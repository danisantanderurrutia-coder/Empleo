import { X, ShieldCheck, Filter, Cpu, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface ProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProtocolModal: React.FC<ProtocolModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#131c2e] max-w-3xl w-full rounded-2xl border border-slate-700 shadow-2xl space-y-4 my-8 flex flex-col max-h-[90vh] text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-tight">
                Protocolo Estándar SOLID & Transparencia Anti-Alucinaciones
              </h3>
              <p className="text-xs text-slate-400">
                Reglas estrictas de extracción, parsers multirregión y verificación sin falsos datos (Job Search OS)
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs flex-1">
          
          {/* 📋 LISTA ENUMERADA COMPLETA DE LOS 15 PUNTOS SOLID */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                📋 Protocolo SOLID: Lista de los 15 Puntos Anti-Alucinación y Extracción
              </h4>
            </div>

            <div className="space-y-2 text-slate-300">
              {[
                { n: 1, title: 'Parsing Geográfico Real por Dominio y Texto', desc: 'Detección real de países por dominio (.de, .it, .fr, .ch) y ciudades (Roma, Hannover, París, Berlin, Bilbao) sin forzar "España" a todas las ofertas.' },
                { n: 2, title: 'Dominio Estricto de URLs por Empresa', desc: 'Garantía de coincidencia: Tecnalia ➔ tecnalia.com, BC3 ➔ bc3research.org, IHOBE ➔ ihobe.eus. Cero URLs cruzadas de otras empresas.' },
                { n: 3, title: 'Verificación Estricta sin Falsos Positivos', desc: 'Si el enlace remoto no responde con HTTP 200, la oferta se marca "Pendiente de Verificación Manual", impidiendo falsas etiquetas de "Vigente".' },
                { n: 4, title: 'Soporte Multirregión Objetivo (España, DACH, ONU)', desc: 'Filtros adaptados para admitir España/Euskadi, Alemania/DACH, sedes ONU (Roma/París/Ginebra) y Remoto Europa.' },
                { n: 5, title: 'Lógica Booleana O (OR) / Y (AND)', desc: 'Alternador interactivo en la consola para búsquedas amplias (al menos un término) o estrictas (todos los términos).' },
                { n: 6, title: 'Separación en 2 Módulos Independientes', desc: 'Consola dividida entre 🎯 Especialidades Técnicas (Master Profile) y 📍 Lugares Preferentes.' },
                { n: 7, title: 'Filtro de Lugares & Ubicaciones', desc: 'Pills interactivos de 1 clic: Bilbao / Bizkaia (+25 pts), Euskadi, España, Alemania/DACH y Remoto (100%).' },
                { n: 8, title: 'Garantía de Privacidad Local', desc: 'Cartas y CVs guardados 100% en local en "Candidaturas". Cero auto-envíos a terceros.' },
                { n: 9, title: 'Filtro Anti-Títulos Basura UI', desc: 'Purga automática de menús: "Inicio", "Registro", "Contacto", "Login", "Cookies", "Privacidad".' },
                { n: 10, title: 'Exigencia de URL Profunda (Deep Position Slug)', desc: 'Bloqueo incondicional de URLs genéricas (/job-offers/, /careers/). Exige slug/ID numérico de puesto.' },
                { n: 11, title: 'Subdominios ATS Directos', desc: 'Dorking dinámico para IDOM (site:career.idom.com/job), Taleo FAO ONU, Tecnalia y BC3.' },
                { n: 12, title: 'Lista Negra de Sectores Ajenos', desc: 'Bloqueo automático de Sales Manager, SaaS, 401k, Austin TX, Enfermería, Hostelería.' },
                { n: 13, title: 'Escudo Geográfico Seleccionable', desc: 'Descarte automático de Ecuador, Colombia, Pakistán, EE. UU. manteniendo abiertas sedes oficiales en la UE/ONU.' },
                { n: 14, title: 'Descarte de Disciplinas Ajenas', desc: 'Bloqueo de Crimen Organizado, Justicia Penal, Voluntario UNV en terreno.' },
                { n: 15, title: 'Despacho Asistido en Fase 6 ➔ Fase 7', desc: 'Flujo transparente: preparación de borradores en Fase 6, enlace guiado al portal de la empresa y confirmación previa a la Fase 7.' }
              ].map(p => (
                <div key={p.n} className="flex items-start space-x-2.5 p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono text-[11px] shrink-0">
                    Punto {p.n}
                  </span>
                  <div>
                    <strong className="text-white text-xs">{p.title}: </strong>
                    <span className="text-[11px] text-slate-300">{p.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Capa 2: Esquema de Filtrado en 5 Niveles */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-amber-400">
              <Filter className="h-4 w-4" />
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                Esquema de Filtrado en 5 Niveles SOLID (High Precision)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
              
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-rose-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Nivel 1: URL Profunda & Coincidencia de Dominio</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Descarte incondicional de URLs genéricas (<code className="text-rose-300">/job-offers/</code>, <code className="text-rose-300">/careers/</code>). Verificación de correspondencia entre el dominio del enlace y la empresa.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-rose-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Nivel 2: Escudo Geográfico Multirregión</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Admite convocatorias en España/Euskadi, Alemania/DACH, sedes de la ONU (Roma, París, Ginebra) y Europa Remoto, descartando países fuera de objetivo (Pakistán, India, EE. UU.).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-rose-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Nivel 3: Lista Negra de Sectores</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Bloqueo automático de <em>Sales Manager</em>, <em>SaaS</em>, <em>401k</em>, <em>Enfermería</em>, <em>Hostelería</em> o <em>Voluntariados de Campo UNV</em>.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-rose-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Nivel 4: Títulos Basura UI</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Purga de enlaces extraídos de barras de navegación (ej: <em>"Inicio"</em>, <em>"Registro"</em>, <em>"Contacto"</em>, <em>"Cookies"</em>).
                </p>
              </div>

            </div>

            {/* Nivel 5 Match Score */}
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 space-y-1 mt-2">
              <div className="flex items-center justify-between font-bold text-emerald-400">
                <span>Nivel 5: Algoritmo de Puntuación de Encaje (Match Score)</span>
                <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">Máx. 100 pts</span>
              </div>
              <p className="text-[11px] text-slate-300">
                - Bonificación Sede Principal Bilbao / Bizkaia: <strong>+25 pts</strong><br />
                - Doble Máster Alemania/Polonia & Geofísica: <strong>+35 pts</strong><br />
                - Modelación R, GIS & Google Earth Engine: <strong>+20 pts</strong><br />
                - Gobernanza Ambiental & Suelos: <strong>+20 pts</strong>
              </p>
            </div>
          </div>

          {/* Garantía de Privacidad y Control Humano */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                Garantía Absoluta de Privacidad & Control Humano
              </h4>
            </div>
            <p className="text-[11px] text-slate-300">
              Todas las candidaturas, CVs generados, cartas y respuestas de formulario permanecen <strong>100% privadas en el almacenamiento local de tu equipo bajo la pestaña 'Candidaturas'</strong>. Ninguna postulación se envía de forma automática a servidores externos sin tu consentimiento explícito.
            </p>
          </div>

          {/* Capa 3: Pipeline de 5 Pasos */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-sky-400">
              <Cpu className="h-4 w-4" />
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                Protocolo de Postulación (Pipeline Maestro de 5 Pasos)
              </h4>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span>1. Requisitos</span>
              <ArrowRight className="h-3 w-3 text-slate-600" />
              <span>2. Check Link</span>
              <ArrowRight className="h-3 w-3 text-slate-600" />
              <span>3. CV Ejecutivo</span>
              <ArrowRight className="h-3 w-3 text-slate-600" />
              <span>4. Carta & Taleo</span>
              <ArrowRight className="h-3 w-3 text-slate-600" />
              <span>5. Entrevista ONU</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition shadow"
          >
            Entendido, Cerrar Protocolo
          </button>
        </div>

      </div>
    </div>
  );
};
