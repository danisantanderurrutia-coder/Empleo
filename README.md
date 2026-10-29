# Headhunter OS

Sistema de prospección directa, inteligencia corporativa y postulación estructurada de alto valor para perfiles transdisciplinarios y científicos, desarrollado en **React 19**, **TypeScript** y **Vite**.

Todos los datos personales, notas de decisores y expedientes se almacenan exclusivamente en el navegador (`localStorage`) del usuario, garantizando total privacidad sin servidores intermediarios.

---

## 🌟 Arquitectura y Módulos Tácticos

### 1. Directorio de Organizaciones & Cuadrantes (Mercado)
- **Atlas de Cuentas Diana:** Centros de investigación (Helmholtz GFZ, CAU Kiel, Thünen, UBA, Greifswald Mire Centre), institutos de la RVCTI (BC3, Tecnalia, Neiker, AZTI, Ikerbasque) y consultoras ambientales.
- **Segmentación por Cuadrantes:** Filtros tácticos por DACH (Alemania/Austria/Suiza), Euskadi / Norte y Global / Remoto.
- **Mapeo de Decisores (Hiring Managers / PIs):** Registro estructurado de directores de laboratorio, supervisores y reclutadores técnicos con sus canales de contacto directo (LinkedIn, email institucional).
- **Vínculos con Financiación:** Detección de convocatorias públicas compatibles para co-diseño de proyectos (DFG, Hazitek, Horizon Europe).

### 2. Portales de Rastreo Diario
- Cuadrícula matutina de 12 portales verificados con parámetros booleanos pre-configurados para geofísica, turberas, balances de carbono, teledetección y gobernanza ambiental.
- Accesos directos a LinkedIn, XING, StepStone, EURAXESS, DFG GEPRIS, Bund.de, InfoJobs, Tecnoempleo, Climatebase y Eurobrussels.
- Checklist local de revisión diaria.

### 3. Pipeline Definitivo (PD-1 a PD-8)
Procedimiento táctico híbrido que combina la prospección proactiva con el rigor de la postulación formal:
1. **Cuenta Diana:** Selección de organización prioritaria por cuadrante.
2. **Revisión de Oferta / Proyecto:** Análisis de dolor técnico y requerimientos.
3. **Mapeo del Decisor:** Identificación del supervisor o Hiring Manager.
4. **Capacidades & CV:** Cruce transdisciplinario de hechos verificados (`verifiedCvFacts`) y adaptación del CV.
5. **Gancho & Carta:** Doble mensaje (gancho directo de <100 palabras + carta formal de 5 párrafos rigurosos).
6. **Control de Calidad:** Verificación de enlaces, títulos y expediente.
7. **Despacho & Registro:** Confirmación y registro del canal de envío utilizado.
8. **Seguimiento & Diálogo:** Cadencia de 5 días hábiles para follow-up y preparación de reuniones.

### 4. Expediente & Arsenal de Solvencia (Perfil)
- **Fuente de la Verdad Inmutable (`verifiedCvFacts.ts`):** Solo hechos respaldados por el portafolio público o evidencia verificable (títulos, publicaciones, instrumentación eddy covariance, testimonio ante el Congreso).
- **CV Studio:** Generación de formatos A4 calibrados con tipografía y diseño profesional.

### 5. Palanca de Convocatorias (Fondos I+D)
- Catálogo curado de programas institucionales oficiales europeos, alemanes y vascos (DFG Walter Benjamin, DAAD, Humboldt, Helmholtz, Horizon Europe MSCA, Hazitek, Bikaintek, Ikerbasque).

---

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo local
npm run dev

# Ejecutar suite de pruebas unitarias (Vitest)
npm test

# Verificación de linting (Oxlint)
npm run lint

# Compilación para producción (TypeScript + Vite)
npm run build

# Previsualizar build de producción
npm run preview
```
