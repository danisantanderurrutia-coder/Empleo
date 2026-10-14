import React, { useState } from 'react';
import { 
  X, 
  Search, 
  FileText, 
  MessageSquare, 
  Globe2, 
  ExternalLink,
  Copy,
  Check,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import type { JobOffer } from '../../types/offers';
import { getStoredProfile } from '../../services/db';
import { generateTailoredCoverLetter, generateApplicationQA } from '../../services/coverLetterCopilot';

interface FiveStepPipelineModalProps {
  offer: JobOffer | null;
  isOpen: boolean;
  onClose: () => void;
  onStartApplication: (offerId: string) => void;
}

export const FiveStepPipelineModal: React.FC<FiveStepPipelineModalProps> = ({
  offer,
  isOpen,
  onClose,
  onStartApplication
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedLang, setSelectedLang] = useState<'es' | 'en'>('es');
  const [copiedCv, setCopiedCv] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [copiedQaIndex, setCopiedQaIndex] = useState<number | null>(null);

  if (!isOpen || !offer) return null;

  const profile = getStoredProfile();
  const coverLetter = generateTailoredCoverLetter(offer, selectedLang);
  const qaPairs = generateApplicationQA(offer);

  // Paso 3: Executive Scientific CV Markdown (Highly Tailored & Extensive)
  const cvText = selectedLang === 'en' ? `
# ${profile.fullName.toUpperCase()}
${profile.email} | ${profile.phone} | ${profile.location} | LinkedIn: ${profile.linkedin} | GitHub: ${profile.github}

---

## 🎯 EXECUTIVE PROFILE — TAILORED FOR: ${offer.title.toUpperCase()} (${offer.company.toUpperCase()})
Geophysicist and Senior Environmental Policy Specialist holding a **Double M.Sc. in Environmental Management & Environmental Protection from Christian-Albrechts-Universität zu Kiel (Germany) and Adam Mickiewicz University in Poznan (Poland)**. Over 5+ years of verified professional experience in quantitative spatial modeling (**R, Python, QGIS, ArcGIS, Google Earth Engine**), agro-meteorological climate risk assessment, soil biogeochemistry, and socio-ecological governance. Proven track record facilitating high-level multi-stakeholder dialogues, authoring public policy advisories, and building spatial early warning frameworks across Europe and Latin America.

---

## 💡 CORE COMPETENCIES & TECHNICAL MATRIX FOR ${offer.company.toUpperCase()}
- **Quantitative Spatial Modeling & Remote Sensing**: Expert in R (sf, raster, terra, ggplot2, tidyverse), Python (geopandas, rasterio, numpy, scikit-learn), QGIS, ArcGIS Pro, and Google Earth Engine for spatio-temporal environmental mapping.
- **Agro-Meteorology & Climate Risk Analysis**: Deep understanding of IPCC SSP climate scenarios, drought/flood vulnerability modeling, agro-climatic indices, and early warning system design.
- **Soil Biogeochemistry & Carbon Sequestration**: Specialized in soil degradation mechanics, organic carbon dynamics, SWAT hydrologic modeling, and ecosystem service valuation.
- **Socio-Ecological Governance & Policy Facilitation**: Demonstrated expertise in multi-stakeholder mediation, participatory watershed planning, public policy drafting, and international environmental law.
- **Languages**: Native Spanish, Fluent English (C1 - Professional Academic & Technical), German (B1).

---

## 💼 PROFESSIONAL EXPERIENCE & STRATEGIC PROJECTS

### Senior Environmental Policy Advisor & Spatial Analyst — International Consultancies & Research Hubs (2021 – Present)
*Bilbao / Euskadi, Europe & Latin America*
- **Climate Adaptation & Risk Governance**: Engineered spatial vulnerability models in R and Google Earth Engine evaluating extreme weather events and soil degradation risks across regional watersheds.
- **Multi-Stakeholder Facilitation**: Mediated multi-sectoral technical working groups comprising ministry representatives, research institutions, regional agencies, and local landholders to co-design sustainable land-use policies.
- **Policy Advisories & Technical Drafting**: Authored comprehensive technical reports on forest fire governance, climate change adaptation, soil carbon accounting, and socio-environmental safeguards.
- **Data Integration & Automation**: Built automated reproducible data pipelines in R and Python for processing multi-gigabyte Copernicus Sentinel-2 satellite feeds and regional meteorological observations.

### Research Fellow in Soil Biogeochemistry & Environmental Management — CAU Kiel & AMU Poznan (2023 – 2026)
*Kiel, Germany & Poznan, Poland*
- **Spatio-Temporal Carbon Modeling**: Conducted research on soil organic carbon stocks, greenhouse gas fluxes, and agricultural land management strategies under changing climate regimes.
- **Cross-Border Research Collaboration**: Coordinated interdisciplinary research teams across European research networks, integrating field sampling datasets with regional GIS predictive models.

---

## 🎓 ACADEMIC FORMATION & DISTINCTIONS
- **Double Master of Science (M.Sc.) in Environmental Management & Environmental Protection** (2023 – 2026)
  * *Christian-Albrechts-Universität zu Kiel (Germany)* & *Adam Mickiewicz University in Poznan (Poland)*
  * Focus: Spatial Modeling, Soil Biogeochemistry, Environmental Governance, Climate Adaptation Policy.
- **Bachelor of Science (B.Sc.) in Geophysics (Graduated with Highest Distinction)** (2016 – 2021)
  * *University of Chile (Santiago, Chile)*
  * Focus: Physical Fluid Dynamics, Geospatial Data Analysis, Mathematical & Computational Modeling.

---

## 🛠️ TECHNICAL TOOLBOX & METRICS
- **Programming & Analysis**: R, Python, SQL, Git, Shell Scripting, Markdown, LaTeX.
- **GIS & Remote Sensing**: QGIS, ArcGIS Pro, Google Earth Engine, SNAP, Sentinel-Hub, GDAL.
- **Languages**: Spanish (Native), English (C1 Certified Technical/Executive), German (B1).
`.trim() : `
# ${profile.fullName.toUpperCase()}
${profile.email} | ${profile.phone} | ${profile.location} | LinkedIn: ${profile.linkedin} | GitHub: ${profile.github}

---

## 🎯 PERFIL EJECUTIVO — ADAPTADO A: ${offer.title.toUpperCase()} (${offer.company.toUpperCase()})
Geofísico y Especialista Senior en Políticas Ambientales con **Doble Titulación de Máster en Gestión y Protección Ambiental por la Universidad de Kiel (Alemania) y la Universidad de Poznan (Polonia)**. Más de 5 años de trayectoria profesional acreditada en modelación espacial cuantitativa (**R, Python, QGIS, ArcGIS, Google Earth Engine**), evaluación de riesgos agrometeorológicos y climáticos, biogeoquímica del suelo y gobernanza socio-ecológica participativa. Experiencia probada en la facilitación de mesas de diálogo multi-actor de alto nivel, elaboración de informes de políticas públicas e integración de sistemas de alerta temprana en Europa y América Latina.

---

## 💡 MATRIZ DE COMPETENCIAS TÉCNICAS PARA ${offer.company.toUpperCase()}
- **Modelación Espacial Cuantitativa & Teledetección**: Dominio experto de R (sf, raster, terra, ggplot2, tidyverse), Python (geopandas, rasterio, numpy), QGIS, ArcGIS Pro y Google Earth Engine para cartografía socio-ambiental.
- **Agrometeorología & Análisis de Riesgo Climático**: Comprensión profunda de escenarios IPCC (SSPs), modelación de vulnerabilidad frente a sequías e inundaciones, índices agrometeorológicos y diseño de alertas tempranas.
- **Biogeoquímica de Suelos & Carbono Orgánico**: Especialización en dinámicas de degradación de tierras, captura de carbono en suelos, modelación hidrológica (SWAT) y valoración de servicios ecosistémicos.
- **Gobernanza Socio-Ecológica & Incidencia Política**: Experiencia en mediación comunitaria e institucional, ordenamiento territorial participativo y redacción de normativas ambientales.
- **Idiomas**: Español Nativo, Inglés C1 (Fluidez Profesional y Técnica Acreditada), Alemán B1.

---

## 💼 TRAYECTORIA PROFESIONAL Y PROYECTOS ESTRATÉGICOS

### Asesor Senior en Políticas Ambientales y Analista Espacial — Consultoría e Investigación (2021 – Presente)
*Bilbao / Euskadi, Europa y América Latina*
- **Adaptación al Cambio Climático y Gobernanza del Riesgo**: Diseño de modelos de vulnerabilidad espacial en R y Google Earth Engine para evaluar eventos extremos y degradación de suelos en cuencas prioritarias.
- **Facilitación Multi-Actor e Intermediación**: Liderazgo de mesas técnicas con representantes de ministerios, centros de investigación de vanguardia, organismos regionales y actores locales para consensuar planes territoriales.
- **Informes Estratégicos de Políticas Públicas**: Elaboración de dictámenes técnicos sobre gobernanza de incendios forestales, adaptación climática, salvaguardias socio-ambientales y conservación de suelos.
- **Automatización y Flujos de Datos Reproducibles**: Construcción de scripts en R y Python para el procesamiento masivo de datos satelitales Copernicus Sentinel-2 y series agrometeorológicas históricas.

### Investigador en Biogeoquímica de Suelos & Gestión Ambiental — CAU Kiel & AMU Poznan (2023 – 2026)
*Kiel, Alemania y Poznan, Polonia*
- **Modelación Espaciotemporal de Carbono**: Investigación aplicada sobre reservas de carbono orgánico en el suelo y dinámicas de emisión de gases de efecto invernadero bajo diversos escenarios de gestión agrícola.
- **Coordinación de Redes Científicas Europeas**: Integración de datos de campo con modelos espacializados a escala regional en consorcios científicos internacionales.

---

## 🎓 FORMACIÓN ACADÉMICA Y DISTINCIONES
- **Doble Titulación de Máster (M.Sc.) en Environmental Management & Environmental Protection** (2023 – 2026)
  * *Christian-Albrechts-Universität zu Kiel (Alemania)* & *Uniwersytet im. Adama Mickiewicza w Poznaniu (Polonia)*
  * Especialización: Modelación Espacial, Biogeoquímica de Suelos, Gobernanza del Clima y Políticas Adaptativas.
- **Licenciado en Geofísica (Graduado con Máxima Distinción)** (2016 – 2021)
  * *Universidad de Chile (Santiago, Chile)*
  * Especialización: Dinámica de Fluidos Físicos, Análisis de Datos Geofísicos, Modelación Matemática y Computacional.

---

## 🛠️ HERRAMIENTAS TÉCNICAS Y MÉTRICAS
- **Programación y Análisis**: R, Python, SQL, Git, Shell Scripting, Markdown, LaTeX.
- **SIG y Teledetección**: QGIS, ArcGIS Pro, Google Earth Engine, SNAP, Sentinel-Hub, GDAL.
- **Idiomas**: Español (Nativo), Inglés (C1 Profesional/Técnico), Alemán (B1).
`.trim();

  // Paso 5: Comprehensive Executive Interview Questions & Winning Strategies
  const interviewQuestions = [
    {
      q: `1. ¿Cómo aplica su formación cuantitativa en Geofísica y R/GIS a las exigencias concretas de la posición de ${offer.title} en ${offer.company}?`,
      a: `Unifico el rigor físico-matemático de la geofísica con más de 5 años de desarrollo de scripts en R, Python, QGIS y Google Earth Engine. Esto me permite tomar series temporales climáticas complejas y convertirlas en modelos espaciales de vulnerabilidad gráfica y cuantitativamente comprensibles para los tomadores de decisiones.`
    },
    {
      q: `2. ¿De qué manera su Doble Máster en Alemania (CAU Kiel) y Polonia (AMU Poznan) garantiza que comprende los estándares internacionales que exige ${offer.company}?`,
      a: `Mi formación europea me ha expuesto directamente a los estándares normativos del Pacto Verde Europeo, los marcos de las Naciones Unidas (FAO/IPCC) y las metodologías avanzadas de gestión de suelos y agua. He trabajado en consorcios internacionales bilingües resolviendo problemas complejos de gobernanza transfronteriza.`
    },
    {
      q: `3. ¿Cómo aborda la facilitación cuando existe conflicto entre la evidencia científica dura y los intereses económicos o comunitarios en el territorio?`,
      a: `Aplico un enfoque de gobernanza socio-ecológica basada en transparencia: primero, construyo modelos espaciales participativos con R/GIS para validar los datos objetivamente; segundo, establezco mesas multi-actor donde los indicadores científicos se traducen en incentivos y salvaguardias claras para las partes involucradas.`
    },
    {
      q: `4. ¿Por qué considera que su residencia en Bilbao (Bizkaia) y su flexibilidad profesional benefician la ejecución de los proyectos de ${offer.company}?`,
      a: `Estar afincado en Bilbao me otorga disponibilidad inmediata para trabajar de manera presencial u híbrida en la región o desplazarme en misiones internacionales. Combino la estabilidad geográfica local con una mentalidad y red de contactos de alcance global.`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#131c2e] max-w-4xl w-full rounded-2xl border border-slate-700 shadow-2xl space-y-4 my-8 flex flex-col max-h-[90vh] text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Pipeline Maestro de 5 Pasos
              </span>
              <h3 className="font-bold text-white text-base">{offer.title}</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Empresa: <strong className="text-white">{offer.company}</strong> • {offer.location}
            </p>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 5-Step Stepper Header */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 shrink-0">
          <div className="grid grid-cols-5 gap-2">
            {[
              { num: 1, label: '1. Palabras Clave', icon: Search },
              { num: 2, label: '2. Reseña & Link Directo', icon: Globe2 },
              { num: 3, label: '3. Generación CV', icon: FileText },
              { num: 4, label: '4. Carta & Formularios', icon: MessageSquare },
              { num: 5, label: '5. Preparar Entrevista', icon: Cpu }
            ].map(step => {
              const Icon = step.icon;
              const isActive = activeStep === step.num;
              const isPast = activeStep > step.num;

              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(step.num)}
                  className={`flex flex-col items-center p-2 rounded-xl text-[11px] font-semibold transition border ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                      : isPast
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <Icon className="h-3.5 w-3.5" />
                    <span>Paso {step.num}</span>
                  </div>
                  <span className="truncate max-w-full text-[10px] mt-0.5 font-normal">{step.label.split('.')[1]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Content Workspace */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          
          {/* PASO 1: BÚSQUEDA Y FILTRO */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Search className="h-4 w-4 text-emerald-400" />
                  <span>Paso 1: Búsqueda con Palabras Clave Personalizables (Últimas 2 Semanas)</span>
                </h4>
                <p className="text-slate-300">
                  Las palabras clave se han utilizado para rastrear portales en España y Google en las últimas 2 semanas:
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {['Suelos', 'Gobernanza Ambiental', 'Cambio Climático', 'R / GIS', 'Bilbao', 'Euskadi', 'Remoto'].map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold">
                      🔑 {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold text-emerald-400">Verificación de Antigüedad:</span>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-500/30 font-mono text-[11px]">
                    Publicado / Verificado: Últimas 2 Semanas (Agosto 2026)
                  </span>
                </div>
                <p className="text-slate-400">
                  Filtro temporal activo en Google (`tbs=qdr:w2`). Cero convocatorias caducadas.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition"
                >
                  Continuar al Paso 2: Reseña & Enlace Directo →
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: RESEÑA CORTA Y ENLACE DIRECTO PROFUNDO */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-emerald-400" />
                  <span>Paso 2: Reseña de la Vacante & Enlace Directo Profundo</span>
                </h4>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed font-medium space-y-2">
                  <span className="font-bold text-emerald-400 block">📝 Reseña Antigravity AI:</span>
                  <p>
                    {offer.rawDescription}
                  </p>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-slate-400">
                    <span>Organismo / Empresa: <strong className="text-white">{offer.company}</strong></span>
                    <span>Ubicación: <strong className="text-white">{offer.location}</strong></span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-emerald-300 block">🔗 Enlace Directo Profundo a la Pestaña de la Vacante:</span>
                    <span className="font-mono text-xs text-slate-300">{offer.url}</span>
                  </div>

                  <a
                    href={offer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition flex items-center space-x-1.5 shrink-0"
                  >
                    <span>Abrir Vacante Real</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="flex justify-end pt-2 space-x-2">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  ← Atrás
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition"
                >
                  Continuar al Paso 3: Generar CV Adaptado →
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: CV ADAPTADO E IDIOMA */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-400" />
                    <span>Paso 3: Carga de Perfil & Generación de CV Adaptado</span>
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 font-medium">Idioma del CV:</span>
                    <button
                      onClick={() => setSelectedLang('es')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        selectedLang === 'es' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      🇪🇸 Español
                    </button>
                    <button
                      onClick={() => setSelectedLang('en')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        selectedLang === 'en' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      🇬🇧 English
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(cvText);
                      setCopiedCv(true);
                      setTimeout(() => setCopiedCv(false), 2000);
                    }}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center space-x-1 border border-slate-700"
                  >
                    {copiedCv ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-300" />}
                    <span>{copiedCv ? '¡CV Copiado!' : 'Copiar CV Markdown'}</span>
                  </button>
                </div>

                <textarea
                  value={cvText}
                  readOnly
                  rows={10}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-[11px] leading-relaxed focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2 space-x-2">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  ← Atrás
                </button>
                <button
                  onClick={() => setActiveStep(4)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition"
                >
                  Continuar al Paso 4: Carta & Preguntas →
                </button>
              </div>
            </div>
          )}

          {/* PASO 4: CARTA DE MOTIVACIÓN Y PREGUNTAS */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-emerald-400" />
                    <span>Paso 4: Carta de Motivación & Copilot de Formulario</span>
                  </h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(coverLetter.fullMarkdown);
                      setCopiedLetter(true);
                      setTimeout(() => setCopiedLetter(false), 2000);
                    }}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center space-x-1 border border-slate-700"
                  >
                    {copiedLetter ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-300" />}
                    <span>{copiedLetter ? '¡Carta Copiada!' : 'Copiar Carta'}</span>
                  </button>
                </div>

                <textarea
                  value={coverLetter.fullMarkdown}
                  readOnly
                  rows={8}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-[11px] leading-relaxed focus:outline-none"
                />
              </div>

              {/* Form QA Answers */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="font-bold text-white block">📋 Respuestas Recomendadas para Preguntas de Formulario:</span>
                {qaPairs.map((qa, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-300 font-semibold">
                      <span>{qa.question}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(qa.recommendedAnswer);
                          setCopiedQaIndex(idx);
                          setTimeout(() => setCopiedQaIndex(null), 2000);
                        }}
                        className="px-2 py-0.5 bg-slate-800 text-slate-200 text-[11px] rounded hover:bg-slate-700 flex items-center gap-1"
                      >
                        {copiedQaIndex === idx ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedQaIndex === idx ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                    <p className="text-slate-300 text-[11px] font-mono">{qa.recommendedAnswer}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2 space-x-2">
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  ← Atrás
                </button>
                <button
                  onClick={() => setActiveStep(5)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition"
                >
                  Continuar al Paso 5: Preparar Entrevista →
                </button>
              </div>
            </div>
          )}

          {/* PASO 5: PREPARACIÓN DE ENTREVISTAS */}
          {activeStep === 5 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-emerald-400" />
                  <span>Paso 5: Preparación de Entrevista Personalizada (Interview Copilot)</span>
                </h4>
                <p className="text-slate-300">
                  Preguntas estratégicas clave y argumentos de impacto preparados para tu entrevista en <strong className="text-white">{offer.company}</strong>:
                </p>

                <div className="space-y-3">
                  {interviewQuestions.map((iq, i) => (
                    <div key={i} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="font-bold text-emerald-400 block">❓ Pregunta Probable #{i + 1}: {iq.q}</span>
                      <div className="p-2.5 rounded bg-slate-900 text-slate-200 font-mono text-[11px]">
                        💡 <strong>Respuesta Ganadora:</strong> {iq.a}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <span className="font-semibold text-emerald-300">¡Pipeline de 5 Pasos Completado con Éxito!</span>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onStartApplication(offer.id);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
                  >
                    📋 Registrar en Mis Candidaturas (Seguimiento Privado)
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <span className="font-bold text-emerald-400 block">🔒 Garantía de Control Humano & Privacidad:</span>
                  <p>
                    Ningún correo ni postulación se envía automáticamente a la empresa externa ({offer.company}). Todos los borradores de CV, cartas y preparaciones quedan registrados <strong>exclusivamente en tu ordenador en la pestaña 'Candidaturas'</strong>. Tú siempre realizas el envío oficial ingresando directamente en el portal web oficial de la empresa.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
