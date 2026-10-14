# Job Search OS (Empleo)

Herramienta frontend privada para la gestión, seguimiento y postulación estructurada a ofertas de empleo, desarrollada en **React 19**, **TypeScript** y **Vite**.

Todos los datos personales y candidaturas se guardan exclusivamente en el navegador (`localStorage`) del usuario, garantizando total privacidad sin servidores intermediarios.

---

## 🌟 Funcionalidades Reales

### 1. Perfil Maestro y Banco de Logros
- **Master Profile centralizado:** experiencia, educación, idiomas, enlaces profesionales y preferencias de ubicación/salario.
- **Banco de logros:** registro estructurado de hitos cuantificables para adaptar a cada postulación.
- **Privacidad total:** no se envía ningún dato personal a servidores externos.

### 2. Búsqueda en APIs Públicas Reales
- Integración directa desde el navegador (con soporte CORS abierto) con plataformas públicas de empleo:
  - **Remotive API** (empleos remotos internacionales)
  - **Arbeitnow API** (empleos en Europa, Alemania y remotos)
  - **Jobicy API** (vacantes remotas globales)
- Sin necesidad de API keys para la búsqueda básica.
- Soporte para añadir y estructurar manualmente ofertas copiadas desde cualquier portal o convocatoria pública.

### 3. Match Engine Determinista y Explicable
- Cálculo de compatibilidad (0–100%) entre el perfil y la oferta basado en:
  - **Habilidades técnicas y blandas** coincidentes en el texto.
  - **Preferencias de ubicación y teletrabajo** configuradas por el usuario.
  - **Rangos salariales reales** contrastados con la expectativa mínima y deseada.
- **Sin puntuaciones artificiales:** si una oferta no contiene información salarial o habilidades, no se otorgan puntos fantasma (0 pts por defecto con desglose explicable).

### 4. Extracción de CV desde PDF
- Extracción de texto plano en el navegador mediante `pdfjs-dist` (cargado de forma diferida mediante *dynamic import* para optimizar el bundle).
- Detección básica mediante patrones de datos de contacto (email, teléfono, nombre) sin inventar puestos ni estudios no presentes en el documento.

### 5. Asistente de Plantillas para Cartas y Preguntas ATS
- Generación de borradores de cartas de presentación y respuestas frecuentes con marcadores `[COMPLETAR]`.
- No inventa afirmaciones sobre empresas ni logros inexistentes: solo rellena datos ya contrastados del perfil y la vacante.

### 6. Seguimiento de Candidaturas (Tracker Local)
- Registro y ciclo de vida de candidaturas (Nueva, Borrador, Enviada manualmente, En Seguimiento, Descartada).
- Portabilidad completa mediante **Exportar/Importar copia de seguridad en JSON**.

---

## 🛡️ Principios de Honestidad y Límites Técnicos

- **Sin postulaciones automáticas universales:** los portales de empleo y sistemas ATS requieren autenticación, captchas y formularios propietarios. El usuario revisa y confirma el envío en la web oficial correspondiente.
- **Sin scraping de portales con login:** la aplicación no vulnera términos de servicio ni finge sincronizaciones con cuentas de LinkedIn, InfoJobs o XING.
- **Sin tareas en segundo plano con la pestaña cerrada:** una aplicación 100% frontend estática no puede ejecutar tareas cron sin backend o Service Worker dedicado.

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

---

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes de interfaz de usuario organizados por módulos
│   ├── applications/   # Módulo de seguimiento de candidaturas
│   ├── companies/      # Fichas de empresas y entidades
│   ├── cvs/            # Gestión de versiones y plantillas de CV
│   ├── offers/         # Listado, búsqueda y filtrado de vacantes
│   ├── profile/        # Edición del Master Profile y Banco de Logros
│   ├── settings/       # Configuración y copias de seguridad JSON
│   └── sources/        # Directorio de portales y fuentes de referencia
├── services/           # Lógica de negocio y persistencia
│   ├── antigravityEngine.ts    # Parseo heurístico de texto de CV
│   ├── coverLetterCopilot.ts   # Plantillas de carta de presentación
│   ├── db.ts                   # Repositorio y acceso a localStorage
│   ├── matchEngine.ts          # Algoritmo explicable de cálculo de match
│   ├── pdfExtractor.ts         # Extracción de texto con pdfjs-dist diferido
│   ├── publicJobApis.ts        # Clientes HTTP para Remotive, Arbeitnow y Jobicy
│   └── __tests__/              # Tests unitarios automatizados (Vitest)
└── types/              # Definiciones TypeScript de modelos de datos
```
