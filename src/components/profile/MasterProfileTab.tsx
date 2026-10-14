import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Briefcase, 
  Globe, 
  Save, 
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  RotateCcw,
  Code2,
  Edit3,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { getStoredProfile, saveStoredProfile } from '../../services/db';
import type { MasterProfile, Achievement, WorkExperience, Education, SkillItem, LanguageItem } from '../../types/profile';
import { AchievementBank } from './AchievementBank';
import { CVParserModal } from './CVParserModal';
import { AddExperienceModal } from './AddExperienceModal';
import { EditExperienceModal } from './EditExperienceModal';
import type { ParsedCVResult } from '../../services/cvParser';

export const MasterProfileTab: React.FC = () => {
  const [profile, setProfile] = useState<MasterProfile>(getStoredProfile());
  const [isSaved, setIsSaved] = useState(false);
  const [isParserOpen, setIsParserOpen] = useState(false);
  const [isAddExpOpen, setIsAddExpOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);

  // New Skill & Language inline states
  const [newSkillName, setNewSkillName] = useState('');
  const [newLangName, setNewLangName] = useState('');
  const [newLangProf, setNewLangProf] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Nativo'>('C1');

  // Education state
  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [eduDegree, setEduDegree] = useState('');
  const [eduInstitution, setEduInstitution] = useState('');

  const handleSaveProfile = () => {
    saveStoredProfile(profile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleApplyParsedProfile = (parsed: ParsedCVResult, mode: 'merge' | 'replace') => {
    if (mode === 'replace') {
      const updated: MasterProfile = {
        ...profile,
        fullName: parsed.fullName || profile.fullName,
        email: parsed.email || profile.email,
        phone: parsed.phone || profile.phone,
        summary: parsed.summary || profile.summary,
        experiences: parsed.experiences,
        education: parsed.education.length > 0 ? parsed.education : profile.education,
        skills: parsed.skills.length > 0 ? parsed.skills : profile.skills,
        languages: parsed.languages.length > 0 ? parsed.languages : profile.languages,
        achievementsBank: parsed.achievements.length > 0 ? parsed.achievements : profile.achievementsBank,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setProfile(updated);
      saveStoredProfile(updated);
    } else {
      const updated: MasterProfile = {
        ...profile,
        fullName: parsed.fullName || profile.fullName,
        email: parsed.email || profile.email,
        phone: parsed.phone || profile.phone,
        summary: parsed.summary ? `${profile.summary}\n\n${parsed.summary}` : profile.summary,
        experiences: [...parsed.experiences, ...profile.experiences],
        education: [...parsed.education, ...profile.education],
        skills: [...parsed.skills, ...profile.skills],
        languages: [...parsed.languages, ...profile.languages],
        achievementsBank: [...parsed.achievements, ...profile.achievementsBank],
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setProfile(updated);
      saveStoredProfile(updated);
    }
  };

  const handleAddExperience = (newExp: WorkExperience) => {
    const updated = {
      ...profile,
      experiences: [newExp, ...profile.experiences]
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleSaveExperienceEdit = (updatedExp: WorkExperience) => {
    const updated = {
      ...profile,
      experiences: profile.experiences.map(e => e.id === updatedExp.id ? updatedExp : e)
    };
    setProfile(updated);
    saveStoredProfile(updated);
    setEditingExperience(null);
  };

  const handleDeleteExperience = (id: string) => {
    const updated = {
      ...profile,
      experiences: profile.experiences.filter(e => e.id !== id)
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduDegree || !eduInstitution) return;
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: eduDegree,
      institution: eduInstitution,
      fieldOfStudy: eduDegree,
      startDate: '2022',
      endDate: '2026',
      location: 'Bilbao / Europa',
      isVerified: true
    };
    const updated = {
      ...profile,
      education: [...profile.education, newEdu]
    };
    setProfile(updated);
    saveStoredProfile(updated);
    setEduDegree('');
    setEduInstitution('');
    setIsAddingEdu(false);
  };

  const handleDeleteEducation = (id: string) => {
    const updated = {
      ...profile,
      education: profile.education.filter(e => e.id !== id)
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    const newSk: SkillItem = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      category: 'Tech',
      level: 'Avanzado',
      yearsOfExperience: 3
    };
    const updated = {
      ...profile,
      skills: [...profile.skills, newSk]
    };
    setProfile(updated);
    saveStoredProfile(updated);
    setNewSkillName('');
  };

  const handleDeleteSkill = (id: string) => {
    const updated = {
      ...profile,
      skills: profile.skills.filter(s => s.id !== id)
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleAddLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangName.trim()) return;
    const newL: LanguageItem = {
      id: `lang-${Date.now()}`,
      language: newLangName.trim(),
      proficiency: newLangProf
    };
    const updated = {
      ...profile,
      languages: [...profile.languages, newL]
    };
    setProfile(updated);
    saveStoredProfile(updated);
    setNewLangName('');
  };

  const handleDeleteLanguage = (id: string) => {
    const updated = {
      ...profile,
      languages: profile.languages.filter(l => l.id !== id)
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleAddAchievement = (newAch: Achievement) => {
    const updated = {
      ...profile,
      achievementsBank: [newAch, ...profile.achievementsBank]
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleUpdateAchievement = (updatedAch: Achievement) => {
    const updated = {
      ...profile,
      achievementsBank: profile.achievementsBank.map(a => a.id === updatedAch.id ? updatedAch : a)
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleDeleteAchievement = (id: string) => {
    const updated = {
      ...profile,
      achievementsBank: profile.achievementsBank.filter(a => a.id !== id)
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleClearSampleData = () => {
    if (window.confirm('¿Deseas limpiar las experiencias para dejar únicamente tus datos reales?')) {
      const cleanProfile: MasterProfile = {
        ...profile,
        experiences: [],
        achievementsBank: [],
        pendingFields: []
      };
      setProfile(cleanProfile);
      saveStoredProfile(cleanProfile);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between glass-panel p-5 rounded-2xl border border-slate-800 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-400" />
            <span>Master Profile — Edición Directa In-Place</span>
          </h2>
          <p className="text-xs text-slate-300">
            Edita cualquier campo, logro o experiencia allí mismo en tiempo real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsParserOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 via-lime-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center space-x-1.5"
          >
            <Sparkles className="h-4 w-4" />
            <span>Analizar CV (extracción básica)</span>
          </button>

          <button
            onClick={() => setIsAddExpOpen(true)}
            className="px-3.5 py-2 bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-200 font-semibold text-xs rounded-xl border border-emerald-700/50 transition flex items-center space-x-1.5"
          >
            <Plus className="h-4 w-4 text-emerald-400" />
            <span>Ingresar Experiencia</span>
          </button>

          <button
            onClick={handleSaveProfile}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                <span>¡Guardado!</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Guardar Perfil</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Data & Preferences */}
        <div className="space-y-6">
          {/* Personal Info Box */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
              <User className="h-4 w-4 text-emerald-400" />
              <span>Datos Personales (Editables)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-medium text-slate-300">Nombre Completo</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300">Correo Electrónico</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300">Teléfono</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300">Ubicación de Residencia</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={e => setProfile({ ...profile, location: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Location & Salary Preferences */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <span>Preferencias Laborales & Bilbao</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1.5">
                <div className="font-bold text-xs flex items-center space-x-1.5 text-emerald-200">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span>Ubicaciones Target & Ámbitos de Búsqueda ({profile.locationPreferences?.length || 0})</span>
                </div>
                <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                  El Match Score pondera tus ubicaciones de preferencia (Euskadi, San Sebastián, Alemania remoto, Hannover presencial, Europa remoto).
                </p>
              </div>

              {/* List of active location preferences */}
              <div className="space-y-1.5">
                {profile.locationPreferences?.map((locPref, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/70 text-xs flex items-center justify-between text-slate-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <div>
                        <span className="font-bold text-white">{locPref.city}</span>
                        <span className="text-[10px] text-emerald-400 font-mono ml-2">({locPref.country})</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 font-mono">
                      {locPref.isPreferredHome ? 'Residencia' : locPref.openToRemote ? 'Remoto / Flex' : 'Presencial'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-medium text-slate-300">Salario Mínimo Objetivo (€)</label>
                  <input
                    type="number"
                    value={profile.minSalary}
                    onChange={e => setProfile({ ...profile, minSalary: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-1.5 bg-emerald-950/60 border border-emerald-800/60 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-300">Salario Deseado (€)</label>
                  <input
                    type="number"
                    value={profile.desiredSalary}
                    onChange={e => setProfile({ ...profile, desiredSalary: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-1.5 bg-emerald-950/60 border border-emerald-800/60 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Education Box */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                <GraduationCap className="h-4 w-4 text-emerald-400" />
                <span>Educación & Titulaciones ({profile.education.length})</span>
              </h3>
              <button
                onClick={() => setIsAddingEdu(!isAddingEdu)}
                className="text-xs text-emerald-400 hover:underline"
              >
                + Añadir
              </button>
            </div>

            {isAddingEdu && (
              <form onSubmit={handleAddEducation} className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 space-y-2 text-xs">
                <input
                  type="text"
                  value={eduDegree}
                  onChange={e => setEduDegree(e.target.value)}
                  placeholder="Título (ej. Doble Máster Environmental Management)"
                  className="w-full px-2.5 py-1 bg-emerald-900 border border-emerald-700 rounded text-white"
                  required
                />
                <input
                  type="text"
                  value={eduInstitution}
                  onChange={e => setEduInstitution(e.target.value)}
                  placeholder="Institución (ej. Kiel University & Adam Mickiewicz)"
                  className="w-full px-2.5 py-1 bg-emerald-900 border border-emerald-700 rounded text-white"
                  required
                />
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setIsAddingEdu(false)} className="text-slate-400">Cancelar</button>
                  <button type="submit" className="px-3 py-1 bg-emerald-600 text-white font-bold rounded">Guardar</button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {profile.education.map((edu) => (
                <div key={edu.id} className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs flex items-start justify-between">
                  <div>
                    <div className="font-bold text-white">{edu.degree}</div>
                    <div className="text-emerald-400 text-[11px]">{edu.institution}</div>
                    <div className="text-slate-400 text-[10px]">{edu.startDate} - {edu.endDate}</div>
                  </div>
                  <button onClick={() => handleDeleteEducation(edu.id)} className="text-slate-400 hover:text-rose-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Otros Cursos & Estudios Complementarios */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-emerald-400" />
                <span>Otros Cursos & Estudios ({profile.otherCourses?.length || 0})</span>
              </h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem('newCourseInput') as HTMLInputElement;
                if (!input || !input.value.trim()) return;
                const updated = {
                  ...profile,
                  otherCourses: [...(profile.otherCourses || []), input.value.trim()]
                };
                setProfile(updated);
                saveStoredProfile(updated);
                input.value = '';
              }}
              className="flex gap-2 text-xs"
            >
              <input
                type="text"
                name="newCourseInput"
                placeholder="Añadir curso / estudio (ej. Economía Verde CENSAT 2022)"
                className="flex-1 px-3 py-1.5 bg-emerald-950 border border-emerald-800 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
              >
                <Plus className="h-4 w-4" />
              </button>
            </form>

            <div className="space-y-2 pt-1">
              {(profile.otherCourses || []).map((course, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs flex items-center justify-between">
                  <span className="text-slate-200 leading-snug flex-1 mr-2">• {course}</span>
                  <button
                    onClick={() => {
                      const updated = {
                        ...profile,
                        otherCourses: (profile.otherCourses || []).filter((_, i) => i !== idx)
                      };
                      setProfile(updated);
                      saveStoredProfile(updated);
                    }}
                    className="text-slate-400 hover:text-rose-400 shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Clear sample data helper */}
          <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-2">
            <h4 className="font-semibold text-xs text-slate-300 flex items-center space-x-1.5">
              <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
              <span>Limpiar Datos de Ejemplo</span>
            </h4>
            <button
              onClick={handleClearSampleData}
              className="text-xs text-amber-400 hover:underline font-medium"
            >
              Vaciar Experiencias de Prueba
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Experiences, Education, Skills, Achievement Bank */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Box */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-100 text-sm">Resumen Profesional Ejecutivo (Editable allí mismo)</h3>
            <textarea
              value={profile.summary}
              onChange={e => setProfile({ ...profile, summary: e.target.value })}
              rows={4}
              className="w-full p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-400 leading-relaxed font-sans"
            />
          </div>

          {/* Work Experiences Section */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-emerald-400" />
                <span>Experiencia Laboral ({profile.experiences.length})</span>
              </h3>

              <button
                onClick={() => setIsAddExpOpen(true)}
                className="px-3 py-1.5 bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-300 font-semibold text-xs rounded-xl border border-emerald-700/50 transition flex items-center space-x-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Ingresar Experiencia</span>
              </button>
            </div>

            <div className="space-y-3">
              {profile.experiences.map((exp) => (
                <div key={exp.id} className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 space-y-2 relative group hover:border-emerald-700 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">{exp.role}</h4>
                      <div className="text-xs text-emerald-400 font-medium">{exp.company} • {exp.location}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-slate-300 font-mono px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-800/60">
                        {exp.startDate} — {exp.endDate}
                      </span>
                      <button
                        onClick={() => setEditingExperience(exp)}
                        className="text-emerald-400 hover:text-emerald-200 transition p-1"
                        title="Editar experiencia allí mismo"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="text-slate-400 hover:text-rose-400 transition p-1"
                        title="Eliminar experiencia"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{exp.summary}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.technologies.map((tech, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-800">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Bank Component with In-Place Edit */}
          <AchievementBank
            achievements={profile.achievementsBank}
            onAddAchievement={handleAddAchievement}
            onUpdateAchievement={handleUpdateAchievement}
            onDeleteAchievement={handleDeleteAchievement}
          />

          {/* Skills & Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skills */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                <Code2 className="h-4 w-4 text-lime-400" />
                <span>Habilidades & Competencias ({profile.skills.length})</span>
              </h3>

              <form onSubmit={handleAddSkill} className="flex gap-2 text-xs">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  placeholder="Añadir habilidad (ej. QGIS, R, Python)"
                  className="flex-1 px-3 py-1.5 bg-emerald-950 border border-emerald-800 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </form>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.skills.map((sk) => (
                  <span key={sk.id} className="text-xs px-2.5 py-1 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-200 flex items-center space-x-1.5">
                    <span>{sk.name}</span>
                    <button onClick={() => handleDeleteSkill(sk.id)} className="text-emerald-500 hover:text-rose-400">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                <Globe className="h-4 w-4 text-emerald-400" />
                <span>Idiomas Acreditados ({profile.languages.length})</span>
              </h3>

              <form onSubmit={handleAddLanguage} className="flex gap-2 text-xs">
                <input
                  type="text"
                  value={newLangName}
                  onChange={e => setNewLangName(e.target.value)}
                  placeholder="Idioma (ej. Alemán)"
                  className="flex-1 px-3 py-1.5 bg-emerald-950 border border-emerald-800 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                />
                <select
                  value={newLangProf}
                  onChange={e => setNewLangProf(e.target.value as any)}
                  className="px-2 py-1.5 bg-emerald-950 border border-emerald-800 rounded-xl text-white"
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                  <option value="Nativo">Nativo</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </form>

              <div className="space-y-2 pt-1">
                {profile.languages.map((lang) => (
                  <div key={lang.id} className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs">
                    <span className="font-semibold text-slate-200">{lang.language}</span>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-mono text-[11px] font-semibold">
                        {lang.proficiency}
                      </span>
                      <button onClick={() => handleDeleteLanguage(lang.id)} className="text-slate-400 hover:text-rose-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CV Parser Modal */}
      <CVParserModal
        isOpen={isParserOpen}
        onClose={() => setIsParserOpen(false)}
        onApplyParsedProfile={handleApplyParsedProfile}
      />

      {/* Add Experience Modal */}
      <AddExperienceModal
        isOpen={isAddExpOpen}
        onClose={() => setIsAddExpOpen(false)}
        onAddExperience={handleAddExperience}
      />

      {/* Edit Experience Modal */}
      <EditExperienceModal
        experience={editingExperience}
        isOpen={!!editingExperience}
        onClose={() => setEditingExperience(null)}
        onSaveExperience={handleSaveExperienceEdit}
      />
    </div>
  );
};
