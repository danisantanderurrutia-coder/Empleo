import React, { useState } from 'react';
import { 
  Building2, 
  Newspaper, 
  ShieldAlert, 
  MessageSquare, 
  ExternalLink,
  Briefcase,
  PlusCircle,
  Eye,
  FileText
} from 'lucide-react';
import { getStoredCompanies } from '../../services/db';
import type { CompanyDossier } from '../../types/companies';
import { AddCompanyModal } from './AddCompanyModal';
import { CompanyReportModal } from './CompanyReportModal';
import { WebsitePreviewModal } from '../common/WebsitePreviewModal';
import { AntigravityExploreModal } from '../common/AntigravityExploreModal';

import { EditCompanyModal } from './EditCompanyModal';
import { saveStoredCompanies } from '../../services/db';
import { Edit3 } from 'lucide-react';

export const CompaniesTab: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyDossier[]>(getStoredCompanies());
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companies[0]?.id || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const refreshCompanies = () => {
    const fresh = getStoredCompanies();
    setCompanies(fresh);
    if (fresh.length > 0) setSelectedCompanyId(fresh[0].id);
  };

  const selectedCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

  const handleCompanyAdded = (newComp: CompanyDossier) => {
    const updated = [newComp, ...companies];
    setCompanies(updated);
    saveStoredCompanies(updated);
    setSelectedCompanyId(newComp.id);
  };

  const handleCompanyUpdated = (updatedComp: CompanyDossier) => {
    const updated = companies.map(c => c.id === updatedComp.id ? updatedComp : c);
    setCompanies(updated);
    saveStoredCompanies(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between glass-panel p-5 rounded-2xl border border-slate-800 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-400" />
            <span>Fichas de Empresa e Inteligencia Corporativa</span>
          </h2>
          <p className="text-xs text-slate-300">
            Ficha manual de empresa para recopilar proyectos, noticias recientes, banderas rojas y argumentos estratégicos para entrevistas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-1.5"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Agregar Empresa / Instituto</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Company Selector */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Directorio de Empresas ({companies.length})</h3>
          
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {companies.map((comp) => {
              const isSelected = comp.id === selectedCompanyId;
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedCompanyId(comp.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-emerald-950/80 border-emerald-500 shadow-md'
                      : 'bg-emerald-950/40 border-emerald-900/60 hover:border-emerald-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white">{comp.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-800 font-mono">
                      {comp.sector}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 flex items-center justify-between">
                    <span>📍 {comp.headquarters}</span>
                    <span className="text-slate-400">{comp.size}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Dossier */}
        {selectedCompany ? (
          <div className="lg:col-span-2 space-y-5">
            {/* Executive Top Card */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>{selectedCompany.name}</span>
                    {selectedCompany.website && (
                      <a
                        href={selectedCompany.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300"
                        title="Visitar web externa de carreras"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </h3>
                  <div className="text-xs text-emerald-400 font-medium flex items-center gap-2 mt-0.5">
                    <span>{selectedCompany.sector}</span>
                    <span>•</span>
                    <span>📍 {selectedCompany.headquarters}</span>
                    <span>•</span>
                    <span>{selectedCompany.size}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center space-x-1.5"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Editar URL Careers</span>
                  </button>

                  {selectedCompany.website && (
                    <button
                      onClick={() => setIsPreviewModalOpen(true)}
                      className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-800 transition flex items-center space-x-1.5"
                    >
                      <Eye className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Vista Previa Web</span>
                    </button>
                  )}

                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Reporte Ejecutivo IA</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{selectedCompany.description}</p>
            </div>

            {/* Rhetorical Interview Arguments */}
            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-300 flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <span>Argumentos Retóricos para la Entrevista (IA Generated)</span>
              </h4>
              <div className="space-y-2">
                {selectedCompany.interviewArguments.map((arg, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-xs text-slate-200 flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{arg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects & News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Key Projects */}
              <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-xs text-slate-200 flex items-center space-x-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Proyectos Clave</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedCompany.keyProjects.map((proj, i) => (
                    <div key={i} className="text-xs text-slate-300 p-2 rounded-lg bg-emerald-950/60 border border-emerald-900/60">
                      {proj}
                    </div>
                  ))}
                </div>
              </div>

              {/* News */}
              <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-xs text-slate-200 flex items-center space-x-1.5">
                  <Newspaper className="h-3.5 w-3.5 text-lime-400" />
                  <span>Noticias Recientes</span>
                </h4>
                <div className="space-y-2">
                  {selectedCompany.recentNews.map((news, i) => (
                    <div key={i} className="text-xs space-y-0.5 p-2 rounded-lg bg-emerald-950/60 border border-emerald-900/60">
                      <div className="font-semibold text-slate-200 flex items-center justify-between">
                        <span>{news.title}</span>
                        <span className="text-[10px] text-slate-400">{news.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{news.snippet}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Red Flags / Risk Alert */}
            {selectedCompany.redFlags.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-2 text-xs">
                <h4 className="font-bold flex items-center space-x-1.5 text-rose-200">
                  <ShieldAlert className="h-4 w-4 text-rose-400" />
                  <span>Alertas de Riesgo / Red Flags</span>
                </h4>
                <div className="space-y-1">
                  {selectedCompany.redFlags.map((flag, i) => (
                    <div key={i} className="flex items-start space-x-1.5">
                      <span>•</span>
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-slate-800 flex items-center justify-center text-slate-400 text-xs">
            Selecciona o agrega una empresa para visualizar su ficha de inteligencia.
          </div>
        )}
      </div>

      <AddCompanyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCompanyAdded={handleCompanyAdded}
      />

      <EditCompanyModal
        company={selectedCompany}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onCompanyUpdated={handleCompanyUpdated}
      />

      <CompanyReportModal
        company={selectedCompany}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <WebsitePreviewModal
        url={selectedCompany?.website || 'https://www.tecnalia.com'}
        title={selectedCompany?.name || 'Sitio Corporativo'}
        company={selectedCompany?.name || 'Empresa Target'}
        location={selectedCompany?.headquarters || 'Bilbao'}
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
      />

      <AntigravityExploreModal
        isOpen={isExploreModalOpen}
        onClose={() => setIsExploreModalOpen(false)}
        defaultCategory="companies"
        onExplorationCompleted={refreshCompanies}
      />
    </div>
  );
};
