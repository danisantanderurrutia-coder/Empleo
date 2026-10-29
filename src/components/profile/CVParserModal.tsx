import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, FileUp, Loader2, Cpu } from 'lucide-react';
import { parseCVTextToProfile } from '../../services/cvParser';
import { parseCVWithAntigravity } from '../../services/antigravityEngine';
import { extractTextFromDocumentFile } from '../../services/pdfExtractor';
import type { ParsedCVResult } from '../../services/cvParser';

interface CVParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyParsedProfile: (parsed: ParsedCVResult, mode: 'merge' | 'replace') => void;
}

export const CVParserModal: React.FC<CVParserModalProps> = ({ isOpen, onClose, onApplyParsedProfile }) => {
  const [cvText, setCvText] = useState('');
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [extractionWarning, setExtractionWarning] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedCVResult | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtractingPdf(true);
    setAttachedFileName(file.name);
    setExtractionWarning(null);

    try {
      const doc = await extractTextFromDocumentFile(file);
      if (!doc.text || doc.text.trim().length === 0) {
        setExtractionWarning(
          'Aviso de limitación OCR: No se pudo extraer texto seleccionable de este documento. Es probable que sea un PDF escaneado (imagen plana). Por favor, sube un PDF digital con texto seleccionable o pega tu texto directamente.'
        );
      } else {
        setCvText(doc.text);
      }
    } catch (err) {
      console.error('Error extrayendo archivo PDF:', err);
      setExtractionWarning('Error al procesar el archivo. Asegúrate de que sea un PDF válido.');
    } finally {
      setIsExtractingPdf(false);
    }
  };

  const handleParseAntigravity = () => {
    if (!cvText.trim()) return;
    setIsParsing(true);
    const res = parseCVWithAntigravity(cvText);
    setParsedResult(res);
    setIsParsing(false);
  };

  const handleParseStandard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvText.trim()) return;
    setIsParsing(true);
    const res = parseCVTextToProfile(cvText);
    setParsedResult(res);
    setIsParsing(false);
  };

  const handleApply = () => {
    if (!parsedResult) return;
    onApplyParsedProfile(parsedResult, importMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="max-w-2xl w-full rounded-2xl p-6 border shadow-2xl space-y-4 my-8"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
      >
        <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-3">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
              <Cpu className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-primary)] text-base">Analizar CV (extracción básica por patrones)</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Motor de procesamiento de alta fidelidad. Sin colapso de caracteres ni pérdida de formato.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!parsedResult ? (
          <form onSubmit={handleParseStandard} className="space-y-4 text-xs">
            {/* PDF Upload Dropzone */}
            <div 
              className="p-4 rounded-xl border-2 border-dashed border-emerald-500/50 hover:border-emerald-500 transition text-center space-y-2 relative cursor-pointer"
              style={{ backgroundColor: 'var(--panel-bg)' }}
            >
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />

              <div className="flex flex-col items-center justify-center space-y-1">
                {isExtractingPdf ? (
                  <>
                    <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">Procesando y extrayendo texto del PDF...</span>
                  </>
                ) : (
                  <>
                    <FileUp className="h-6 w-6 text-emerald-500" />
                    <span className="font-bold text-[var(--text-primary)] text-xs">
                      {attachedFileName ? `📄 Archivo Adjuntado: ${attachedFileName}` : 'Haz clic o arrastra un archivo PDF de tu CV'}
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Soporta PDF, DOCX y TXT</span>
                  </>
                )}
              </div>
            </div>

            {extractionWarning && (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-300 text-[11px] font-sans flex items-start space-x-2">
                <span className="shrink-0 text-sm">⚠️</span>
                <span>{extractionWarning}</span>
              </div>
            )}

            <div>
              <label className="font-medium text-[var(--text-secondary)] block mb-1">
                O pega directamente el texto plano del CV:
              </label>
              <textarea
                value={cvText}
                onChange={e => setCvText(e.target.value)}
                rows={7}
                placeholder="NOMBRE APELLIDOS&#10;email@ejemplo.com | +34 600 000 000&#10;Resumen profesional..."
                className="w-full p-3 border rounded-xl font-mono text-[11px] leading-relaxed focus:outline-none focus:border-emerald-500 transition"
                style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', color: 'var(--text-primary)' }}
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-[var(--panel-border)]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] font-medium"
              >
                Cancelar
              </button>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleParseAntigravity}
                  disabled={isParsing || !cvText.trim()}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 via-lime-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 disabled:opacity-40 text-white font-extrabold rounded-xl shadow-lg transition flex items-center space-x-2"
                >
                  <Cpu className="h-4 w-4 text-white" />
                  <span>{isParsing ? 'Desglosando...' : 'Procesar CV'}</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 space-y-1">
              <div className="font-bold text-sm text-[var(--text-primary)] flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Datos extraídos (revísalos y complétalos)</span>
              </div>
              <p>
                {attachedFileName ? `Del documento PDF '${attachedFileName}'` : 'Del contenido de tu CV'} se han desglosado {parsedResult.extractedCount} bloques formateados sin colapso:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div 
                className="p-3 rounded-xl border space-y-1"
                style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
              >
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Experiencias Extraídas:</span>
                <div className="text-[var(--text-primary)] font-bold">{parsedResult.experiences.length} puestos</div>
              </div>

              <div 
                className="p-3 rounded-xl border space-y-1"
                style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
              >
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Habilidades Identificadas:</span>
                <div className="text-[var(--text-primary)] font-bold">{parsedResult.skills.length} competencias</div>
              </div>

              <div 
                className="p-3 rounded-xl border space-y-1"
                style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
              >
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Idiomas Detectados:</span>
                <div className="text-[var(--text-primary)] font-bold">{parsedResult.languages.length} idiomas</div>
              </div>

              <div 
                className="p-3 rounded-xl border space-y-1"
                style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
              >
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Logros Cuantificables:</span>
                <div className="text-[var(--text-primary)] font-bold">{parsedResult.achievements.length} logros</div>
              </div>
            </div>

            <div className="space-y-2 pt-1 border-t border-[var(--panel-border)]">
              <label className="font-medium text-[var(--text-secondary)] block">Modo de Aplicación al Master Profile:</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer text-[var(--text-primary)]">
                  <input
                    type="radio"
                    name="importMode"
                    value="merge"
                    checked={importMode === 'merge'}
                    onChange={() => setImportMode('merge')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Fusionar con mi perfil actual (Recomendado)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer text-[var(--text-primary)]">
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-amber-700 dark:text-amber-400 font-semibold">Reemplazar perfil completamente</span>
                </label>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[var(--panel-border)]">
              <button
                type="button"
                onClick={() => {
                  setParsedResult(null);
                  setAttachedFileName(null);
                }}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] font-medium"
              >
                Volver a pegar / adjuntar
              </button>

              <button
                onClick={handleApply}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-bold rounded-xl shadow transition flex items-center space-x-2"
              >
                <span>Incorporar al Master Profile</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
