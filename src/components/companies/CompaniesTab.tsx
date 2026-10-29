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
  Edit3,
  Users,
  Link as LinkIcon,
  Mail,
  Coins,
  Send,
  Search
} from 'lucide-react';
import { getStoredCompanies, saveStoredCompanies } from '../../services/db';
import type { CompanyDossier, QuadrantType, CompanyContact, CompanySectorCluster } from '../../types/companies';
import { AddCompanyModal } from './AddCompanyModal';
import { EditCompanyModal } from './EditCompanyModal';
import { WebsitePreviewModal } from '../common/WebsitePreviewModal';
import { FUNDING_CATALOG } from '../../data/fundingCatalog';
import { inferCompanyQuadrants, inferCompanySectorCluster } from '../../utils/quadrants';

interface CompaniesTabProps {
  onStartPipeline?: (companyId: string) => void;
  initialQuadrant?: string;
}

export const CompaniesTab: React.FC<CompaniesTabProps> = ({ onStartPipeline, initialQuadrant = 'ALL' }) => {
  const [companies, setCompanies] = useState<CompanyDossier[]>(getStoredCompanies());
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>(
    initialQuadrant === 'GERMANY' ? 'DACH' :
    initialQuadrant === 'BILBAO' || initialQuadrant === 'EUSKADI' ? 'EUSKADI' :
    initialQuadrant === 'REMOTE' ? 'GLOBAL' : 'ALL'
  );
  const [selectedSectorCluster, setSelectedSectorCluster] = useState<CompanySectorCluster>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companies[0]?.id || '');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Add Contact Form inline state
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactLinkedin, setContactLinkedin] = useState('');
  const [contactNotes, setContactNotes] = useState('');

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

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !selectedCompany) return;

    const newContact: CompanyContact = {
      id: `cnt-${Date.now()}`,
      name: contactName.trim(),
      role: contactRole.trim() || 'Hiring Manager / Investigador Principal',
      email: contactEmail.trim(),
      linkedinUrl: contactLinkedin.trim(),
      notes: contactNotes.trim()
    };

    const existingContacts = selectedCompany.contacts || [];
    const updatedCompany: CompanyDossier = {
      ...selectedCompany,
      contacts: [...existingContacts, newContact]
    };

    handleCompanyUpdated(updatedCompany);
    setIsAddingContact(false);
    setContactName('');
    setContactRole('');
    setContactEmail('');
    setContactLinkedin('');
    setContactNotes('');
  };

  const handleDeleteContact = (contactId: string) => {
    if (!selectedCompany) return;
    const updatedContacts = (selectedCompany.contacts || []).filter(c => c.id !== contactId);
    handleCompanyUpdated({
      ...selectedCompany,
      contacts: updatedContacts
    });
  };

  // Filter companies by quadrant, sector cluster, and search
  const filteredCompanies = companies.filter(comp => {
    const quads = inferCompanyQuadrants(comp);
    if (selectedQuadrant !== 'ALL' && !quads.includes(selectedQuadrant as QuadrantType)) {
      return false;
    }
    const cluster = inferCompanySectorCluster(comp);
    if (selectedSectorCluster !== 'ALL' && cluster !== selectedSectorCluster) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inName = comp.name.toLowerCase().includes(q);
      const inSector = comp.sector.toLowerCase().includes(q);
      const inHQ = comp.headquarters.toLowerCase().includes(q);
      return inName || inSector || inHQ;
    }
    return true;
  });

  // Associated funding opportunities
  const relatedFunding = FUNDING_CATALOG.filter(f => {
    if (!selectedCompany) return false;
    if (selectedCompany.fundingTies && selectedCompany.fundingTies.includes(f.id)) return true;
    const quads = inferCompanyQuadrants(selectedCompany);
    if (quads.includes('DACH') && f.region === 'germany') return true;
    if (quads.includes('EUSKADI') && f.region === 'euskadi') return true;
    return false;
  }).slice(0, 3);

  const getQuadrantColor = (quad: QuadrantType) => {
    switch (quad) {
      case 'DACH': return 'bg-teal-900/60 text-teal-300 border-teal-700/60';
      case 'EUSKADI': return 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60';
      case 'UK_NL': return 'bg-blue-900/60 text-blue-300 border-blue-700/60';
      case 'NORDICS': return 'bg-indigo-900/60 text-indigo-300 border-indigo-700/60';
      case 'CANADA_GLOBAL': return 'bg-rose-900/60 text-rose-300 border-rose-700/60';
      case 'GLOBAL': return 'bg-sky-900/60 text-sky-300 border-sky-700/60';
      case 'REMOTE': return 'bg-violet-900/60 text-violet-300 border-violet-700/60';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getClusterBadge = (cluster: CompanySectorCluster) => {
    switch (cluster) {
      case 'CARBON_TECH_MRV':
        return { label: 'Carbon-Tech & MRV', color: 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60' };
      case 'CAT_RISK_INSURANCE':
        return { label: 'Cat Risk & Seguros', color: 'bg-amber-950/80 text-amber-300 border-amber-700/60' };
      case 'RD_PUBLIC':
        return { label: 'I+D Público & Centros', color: 'bg-teal-950/80 text-teal-300 border-teal-700/60' };
      case 'MULTILATERAL_POLICY':
        return { label: 'Multilateral & Políticas', color: 'bg-purple-950/80 text-purple-300 border-purple-700/60' };
      case 'GEOTHERMAL_ENERGY':
        return { label: 'Geotermia & Subsuelo', color: 'bg-orange-950/80 text-orange-300 border-orange-700/60' };
      default:
        return { label: 'Sector Estratégico', color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-slate-900/90 border border-slate-800 gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
            <Building2 className="h-5 w-5 text-emerald-400" />
            <span>DIRECTORIO ESTRATÉGICO DE ORGANIZACIONES // CUADRANTES</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Centros de investigación, institutos públicos e ingenierías clasificadas por cuadrante geográfico y operativo. Identifica decisores y prepara ganchos antes de iniciar contacto.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Agregar Organización</span>
        </button>
      </div>

      {/* 2D Matrix Filter Bar (Geographic Poles x Sector Clusters) & Search */}
      <div className="space-y-3">
        {/* Row 1: Geographic Poles with Regularization pathways */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedQuadrant('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                selectedQuadrant === 'ALL'
                  ? 'bg-slate-700 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Todos ({companies.length})
            </button>
            <button
              onClick={() => setSelectedQuadrant('EUSKADI')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                selectedQuadrant === 'EUSKADI'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Euskadi / España (Vía 2a)
            </button>
            <button
              onClick={() => setSelectedQuadrant('DACH')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                selectedQuadrant === 'DACH'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              DACH (Kiel/Bonn/TVöD)
            </button>
            <button
              onClick={() => setSelectedQuadrant('UK_NL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                selectedQuadrant === 'UK_NL'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              UK & NL (Wageningen/Londres)
            </button>
            <button
              onClick={() => setSelectedQuadrant('NORDICS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                selectedQuadrant === 'NORDICS'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Nórdicos (ICOS/Finlandia/Suecia)
            </button>
            <button
              onClick={() => setSelectedQuadrant('CANADA_GLOBAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                selectedQuadrant === 'CANADA_GLOBAL'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Canadá / IEC Global
            </button>
            <button
              onClick={() => setSelectedQuadrant('GLOBAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                selectedQuadrant === 'GLOBAL'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Remoto & Global
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar organización o sector..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Row 2: Functional Sector Clusters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-mono text-slate-500 mr-1">Clúster Funcional:</span>
          {[
            { id: 'ALL' as CompanySectorCluster, label: 'Todos los sectores' },
            { id: 'CARBON_TECH_MRV' as CompanySectorCluster, label: 'Carbon-Tech & MRV' },
            { id: 'CAT_RISK_INSURANCE' as CompanySectorCluster, label: 'Cat Risk & Seguros' },
            { id: 'RD_PUBLIC' as CompanySectorCluster, label: 'I+D Público & Centros' },
            { id: 'MULTILATERAL_POLICY' as CompanySectorCluster, label: 'Multilateral & Políticas' },
            { id: 'GEOTHERMAL_ENERGY' as CompanySectorCluster, label: 'Geotermia & Subsuelo' }
          ].map((cluster) => {
            const active = selectedSectorCluster === cluster.id;
            return (
              <button
                key={cluster.id}
                onClick={() => setSelectedSectorCluster(cluster.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                  active
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/60 shadow-xs font-bold'
                    : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cluster.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Directory Column + Dossier Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Organization Directory List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider font-mono">
              Organizaciones ({filteredCompanies.length})
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">
              {selectedQuadrant === 'ALL' ? 'Todos los cuadrantes' : `Filtro: ${selectedQuadrant}`}
            </span>
          </div>
          
          <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
            {filteredCompanies.map((comp) => {
              const isSelected = comp.id === (selectedCompany?.id || selectedCompanyId);
              const quads = inferCompanyQuadrants(comp);
              const contactCount = (comp.contacts || []).length;
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedCompanyId(comp.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-emerald-950/80 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                      : 'bg-[#0b101e]/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-white leading-snug">{comp.name}</h4>
                    <div className="flex flex-wrap gap-1 shrink-0">
                      {quads.map(q => (
                        <span key={q} className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border ${getQuadrantColor(q)}`}>
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold border ${getClusterBadge(inferCompanySectorCluster(comp)).color}`}>
                      {getClusterBadge(inferCompanySectorCluster(comp)).label}
                    </span>
                    <span className="text-xs text-slate-400 line-clamp-1">{comp.sector}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80 font-mono">
                    <span className="truncate max-w-[170px]">📍 {comp.headquarters}</span>
                    {contactCount > 0 ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Users className="h-3 w-3" /> {contactCount} decisor{contactCount > 1 ? 'es' : ''}
                      </span>
                    ) : (
                      <span className="text-slate-500">Sin decisor</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Selected Organization Dossier & Decision Makers */}
        {selectedCompany ? (
          <div className="lg:col-span-2 space-y-5">
            {/* Executive Top Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <span>{selectedCompany.name}</span>
                      {selectedCompany.website && (
                        <a
                          href={selectedCompany.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 transition"
                          title="Visitar web oficial"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-emerald-400 font-medium">{selectedCompany.sector}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300">📍 {selectedCompany.headquarters}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{selectedCompany.size}</span>
                  </div>

                  {/* Quadrant and Sector Cluster tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-500 font-mono">Cuadrante(s):</span>
                    {inferCompanyQuadrants(selectedCompany).map(q => (
                      <span key={q} className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${getQuadrantColor(q)}`}>
                        {q}
                      </span>
                    ))}
                    <span className="text-slate-600">•</span>
                    <span className="text-[11px] text-slate-500 font-mono">Clúster:</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${getClusterBadge(inferCompanySectorCluster(selectedCompany)).color}`}>
                      {getClusterBadge(inferCompanySectorCluster(selectedCompany)).label}
                    </span>
                  </div>
                </div>

                {/* Main Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {onStartPipeline && (
                    <button
                      onClick={() => onStartPipeline(selectedCompany.id)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-1.5 cursor-pointer"
                      title="Abrir el procedimiento táctico con esta organización"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Iniciar Prospección</span>
                    </button>
                  )}

                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Editar Ficha</span>
                  </button>

                  {selectedCompany.website && (
                    <button
                      onClick={() => setIsPreviewModalOpen(true)}
                      className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-800 transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Vista Previa</span>
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{selectedCompany.description}</p>
            </div>

            {/* SECCIÓN 1: DECISORES & PERSONAS CLAVE (HIRING MANAGERS / PIs) */}
            <div className="p-5 rounded-2xl bg-[#090e1a] border border-cyan-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-300 font-mono">
                      DECISORES & CONTACTOS CLAVE // HIRING MANAGERS & PIs
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Personas específicas a las que dirigir el gancho de contacto directo (NP2).
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddingContact(!isAddingContact)}
                  className="px-2.5 py-1 text-xs font-mono font-bold bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded-lg transition flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>{isAddingContact ? 'Cancelar' : 'Agregar Decisor'}</span>
                </button>
              </div>

              {/* Form inline to add a contact */}
              {isAddingContact && (
                <form onSubmit={handleAddContactSubmit} className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Ej: Dr. Markus Weiler / Aitor Bilbao"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">Cargo / Rol *</label>
                      <input
                        type="text"
                        required
                        value={contactRole}
                        onChange={(e) => setContactRole(e.target.value)}
                        placeholder="Ej: Head of Peatland Research / Director Técnico"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">Perfil LinkedIn</label>
                      <input
                        type="url"
                        value={contactLinkedin}
                        onChange={(e) => setContactLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">Correo Institucional</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="nombre@instituto.de"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Notas / Publicaciones de interés</label>
                    <input
                      type="text"
                      value={contactNotes}
                      onChange={(e) => setContactNotes(e.target.value)}
                      placeholder="Ej: Lidera el proyecto de torres eddy covariance en turberas templadas."
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingContact(false)}
                      className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition"
                    >
                      Guardar Decisor
                    </button>
                  </div>
                </form>
              )}

              {/* List of contacts */}
              {selectedCompany.contacts && selectedCompany.contacts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCompany.contacts.map((cnt) => (
                    <div key={cnt.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 relative group">
                      <div className="flex items-start justify-between">
                        <h5 className="font-bold text-sm text-white">{cnt.name}</h5>
                        <button
                          onClick={() => handleDeleteContact(cnt.id)}
                          className="text-slate-600 hover:text-rose-400 text-xs opacity-0 group-hover:opacity-100 transition"
                          title="Eliminar contacto"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-xs text-cyan-400 font-medium">{cnt.role}</p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
                        {cnt.linkedinUrl && (
                          <a
                            href={cnt.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-400 hover:underline flex items-center gap-1 font-mono"
                          >
                            <LinkIcon className="h-3 w-3" />
                            <span>LinkedIn</span>
                          </a>
                        )}
                        {cnt.email && (
                          <a
                            href={`mailto:${cnt.email}`}
                            className="text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                          >
                            <Mail className="h-3 w-3" />
                            <span>{cnt.email}</span>
                          </a>
                        )}
                      </div>

                      {cnt.notes && (
                        <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 italic">
                          "{cnt.notes}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center text-xs text-slate-400">
                  No hay decisores registrados para esta organización. Haz clic en <strong className="text-cyan-400">"Agregar Decisor"</strong> para mapear al responsable de área o investigador principal.
                </div>
              )}
            </div>

            {/* SECCIÓN 2: CONVOCATORIAS ASOCIADAS / PALANCA DE FINANCIACIÓN */}
            {relatedFunding.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300 font-mono flex items-center gap-2">
                    <Coins className="h-4 w-4 text-amber-400" />
                    <span>CONVOCATORIAS & FONDOS PUENTE ASOCIADOS</span>
                  </h4>
                  <span className="text-[10px] text-amber-400/80 font-mono">
                    Argumento de co-financiación
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {relatedFunding.map((fund) => (
                    <div key={fund.id} className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-900/40 text-xs space-y-1">
                      <div className="font-bold text-white leading-snug">{fund.title}</div>
                      <div className="text-[11px] text-amber-400 font-mono">{fund.organization} • {fund.amount}</div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{fund.strategicFit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECCIÓN 3: ARGUMENTOS RETÓRICOS PARA ENTREVISTAS & PITCH */}
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-300 flex items-center space-x-2 font-mono">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <span>ARGUMENTOS ESTRATÉGICOS // PRUEBA DE SOLVENCIA PARA ESTA ORGANIZACIÓN</span>
              </h4>
              <div className="space-y-2">
                {selectedCompany.interviewArguments.map((arg, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-emerald-800/40 text-xs text-slate-200 flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{arg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECCIÓN 4: PROYECTOS Y NOTICIAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Proyectos Clave */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <h4 className="font-bold text-xs text-slate-200 flex items-center space-x-1.5 font-mono">
                  <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
                  <span>LÍNEAS DE INVESTIGACIÓN & PROYECTOS</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedCompany.keyProjects.map((proj, i) => (
                    <div key={i} className="text-xs text-slate-300 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                      {proj}
                    </div>
                  ))}
                </div>
              </div>

              {/* Noticias Recientes */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <h4 className="font-bold text-xs text-slate-200 flex items-center space-x-1.5 font-mono">
                  <Newspaper className="h-3.5 w-3.5 text-lime-400" />
                  <span>SEÑALES RECIENTES // NOTICIAS</span>
                </h4>
                <div className="space-y-2">
                  {selectedCompany.recentNews.map((news, i) => (
                    <div key={i} className="text-xs space-y-0.5 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
                      <div className="font-semibold text-slate-200 flex items-center justify-between">
                        <span>{news.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{news.date}</span>
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
                <h4 className="font-bold flex items-center space-x-1.5 text-rose-200 font-mono">
                  <ShieldAlert className="h-4 w-4 text-rose-400" />
                  <span>CONSIDERACIONES & ALERTAS DE PROCESO</span>
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
          <div className="lg:col-span-2 p-8 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-400 text-xs">
            Selecciona una organización del directorio de cuadrantes para ver su ficha completa.
          </div>
        )}
      </div>

      {/* Modals */}
      <AddCompanyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCompanyAdded={handleCompanyAdded}
      />

      {selectedCompany && (
        <EditCompanyModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          company={selectedCompany}
          onCompanyUpdated={handleCompanyUpdated}
        />
      )}

      {selectedCompany && selectedCompany.website && (
        <WebsitePreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          url={selectedCompany.website}
          title={selectedCompany.name}
          company={selectedCompany.name}
          location={selectedCompany.headquarters}
        />
      )}
    </div>
  );
};
