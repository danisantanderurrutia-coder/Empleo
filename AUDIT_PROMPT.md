# PROMPT DE AUDITORÍA — App "Empleo" (React + TS + Vite, 100% frontend)

Copia y pega todo lo siguiente en el agente auditor. Debe tener acceso de lectura al repositorio y poder ejecutar comandos (`npm run build`, `npm run lint`, `npm run dev`).

---

## 0. ROL Y REGLAS DEL JUEGO

Actúa como un **comité auditor independiente** que adopta, por turnos y con rigor, estos roles:

1. **Arquitecto/a de software senior** (arquitectura, deuda técnica, seguridad, rendimiento, persistencia).
2. **Ingeniero/a de QA y de scraping/integraciones** (qué se puede o no obtener desde un navegador: CORS, robots.txt, ToS, anti-bot, login walls, APIs oficiales vs. HTML scraping).
3. **Reclutador/a senior y coach de búsqueda de empleo** (qué hace realmente efectiva una búsqueda; ATS; calidad de CV y cartas).
4. **Asesor/a de portales de empleo** (LinkedIn, InfoJobs, Indeed, Glassdoor, Tecnoempleo, Adzuna, Remotive, etc.: qué exponen, qué prohíben, qué APIs son públicas).
5. **Experto/a en UX/producto** (flujo real del usuario, honestidad de la interfaz).
6. **Especialista en privacidad/legal (RGPD/ToS)** (datos personales del CV, scraping, almacenamiento local).
7. **Auditor/a anti-alucinación de IA** (ver sección 1: tu rol más importante).

### Reglas innegociables
- **Prohibido asumir que algo funciona porque el código "parece" hacerlo, porque el nombre de la función lo sugiere, porque hay un comentario, o porque la UI muestra un resultado.** Todo veredicto debe estar respaldado por evidencia: archivo+línea, salida de comando, o ejecución real.
- **Prohibido inventar.** Si no puedes verificar algo, di "NO VERIFICADO" y explica qué haría falta para verificarlo. No rellenes huecos.
- **No corrijas código en esta fase.** Solo audita y reporta (salvo scripts de prueba temporales fuera de `src/`).
- Sé directo/a y crítico/a. No suavices hallazgos. Lo que el cliente necesita es la verdad, no un informe agradable.

---

## 1. CONTEXTO: EL PROBLEMA QUE HAY QUE DETECTAR

Esta app fue desarrollada en gran parte con IA (Gemini). Se sospecha que:
- Hay **funciones "teatro"**: la UI muestra resultados, progreso, "agentes", "motores", "verificaciones" o "inteligencia" que en realidad son datos hardcodeados, `Math.random()`, `setTimeout` simulando trabajo, datos de muestra (`sampleData.ts`), regex triviales presentados como "IA", o fallbacks silenciosos que ocultan errores.
- La IA **prometió capacidades imposibles en un frontend puro** (scrapear portales protegidos, saltarse CORS, aplicar automáticamente a ofertas, leer LinkedIn logueado, verificar ofertas "en vivo", ejecutar pipelines "diarios" sin servidor ni cron, etc.) y **siguió alucinando** en lugar de admitir la limitación.
- Nombres grandilocuentes (`antigravityEngine`, `agents`, `portalIntegrationEngine`, `dailyPipelineEngine`, `offerVerificationService`, `companyIntelligenceService`, `liveWebScraper`, `liveWebScanner`, `batchApplicationService`, `coverLetterCopilot`) que **no corresponden a lo que hacen**.

Tu misión: **separar lo REAL de lo SIMULADO, y lo POSIBLE de lo IMPOSIBLE.**

---

## 2. METODOLOGÍA OBLIGATORIA

### Fase A — Inventario
1. Lista todas las funcionalidades que la app *dice* tener (fuentes: UI en `src/components/**`, textos, tutorial en `src/components/tutorial`, README, tipos en `src/types/**`, nombres de servicios en `src/services/**`, `vite.config.ts` —que es sospechosamente grande: revisa si contiene proxies/middleware de servidor—).
2. Para cada una, extrae la **promesa literal** (cita el texto de la UI).

### Fase B — Rastreo de verdad (trace end-to-end)
Para cada funcionalidad, traza la cadena completa **UI → handler → servicio → origen de datos → persistencia → UI** y responde:
- ¿De dónde sale el dato realmente? (red real / archivo / hardcode / aleatorio / localStorage / IndexedDB)
- ¿Hay llamadas `fetch`/XHR reales? ¿A qué URL? ¿Se podría ejecutar desde el navegador sin proxy? ¿Existe proxy en `vite.config.ts` que **solo funciona en `npm run dev`** y que no existiría en el build de producción (`dist/`)?
- ¿Qué pasa cuando la red falla, el portal bloquea, o la respuesta es vacía? ¿Se muestra error honesto o se **inventan/rellenan datos** (fallback a `sampleData`)?
- ¿Se usa `Math.random`, `setTimeout`, `Date.now()` para fabricar puntuaciones, tiempos, progreso o resultados?
- ¿Hay una IA/LLM real llamada (API key, endpoint) o los "agentes" son solo `if/else`, plantillas o regex?

### Fase C — Pruebas de ejecución real
- `npm install`, `npm run build`, `npm run lint`: reporta errores y warnings reales.
- Ejecuta la app (`npm run dev`) y recorre cada pantalla. Si dispones de navegador, reproduce los flujos clave; si no, di explícitamente que no pudiste.
- Prueba con **entradas reales**: sube un CV PDF real (y uno escaneado/imagen, y uno con columnas, y uno en inglés), crea un perfil, lanza una búsqueda, genera una carta, genera un CV.
- Prueba con **entradas hostiles**: PDF vacío/corrupto, texto enorme, caracteres raros, sin conexión, `localStorage` lleno (revisa `storageQuotaManager.ts`), borrar datos y recargar.
- Compara **`dist/`** contra `src/`: ¿el build desplegado refleja el código actual? ¿Funcionaría en un hosting estático (GitHub Pages/Netlify) sin el servidor de Vite?

### Fase D — Clasificación de cada funcionalidad
Asigna **una** etiqueta por funcionalidad:

| Etiqueta | Significado |
|---|---|
| ✅ REAL | Funciona de verdad con datos reales, verificado con evidencia |
| 🟡 PARCIAL | Funciona con limitaciones (indicar cuáles y en qué %) |
| 🎭 SIMULADA | La UI lo aparenta pero usa datos falsos/aleatorios/hardcodeados |
| ❌ ROTA | Intenta funcionar y falla |
| 🚫 IMPOSIBLE | No puede lograrse con esta arquitectura (o en absoluto) por razones técnicas/legales |
| ❓ NO VERIFICADO | No se pudo comprobar (indicar por qué) |

---

## 3. ÁREAS ESPECÍFICAS A AUDITAR

### 3.1 Búsqueda y captura de ofertas
- ¿Qué portales/fuentes se consultan realmente? (`masterSourceCatalog.ts`, `sources`, `adapters`, `liveWebScraper/Scanner`, `portalIntegrationEngine`).
- Por cada fuente: ¿API oficial/pública, RSS, HTML scraping, o simulada? ¿Funciona desde el navegador (CORS)? ¿Depende de un proxy de terceros (allorigins, corsproxy, etc.) que es inestable/limitado/inseguro? ¿Viola ToS o robots.txt?
- ¿Las ofertas mostradas son reales y **actuales**? ¿Cómo se detectan duplicados, ofertas caducadas o "ghost jobs"? (`offerVerificationService`).
- ¿Los enlaces a las ofertas abren la oferta real?
- Cobertura real estimada: ¿qué % del mercado laboral abarca realmente?

### 3.2 Matching / puntuación (`matchEngine.ts`)
- ¿El score es explicable y reproducible, o arbitrario? ¿Es keyword-matching básico? ¿Entiende sinónimos, seniority, idiomas, ubicación, salario, modalidad?
- Pruébalo con 5–10 pares CV/oferta construidos por ti donde conozcas la respuesta correcta (buenos, malos y trampa). Reporta aciertos/errores.
- ¿Los porcentajes de "match" tienen sentido o son cosméticos?

### 3.3 CV: parseo y generación (`cvParser`, `pdfExtractor`, `cvGenerator`)
- ¿`pdfjs-dist` extrae texto correctamente? ¿Qué pasa con PDFs escaneados (sin OCR)? ¿Extrae experiencia, educación, skills de forma fiable o con regex frágiles?
- ¿El CV generado es compatible con ATS (texto seleccionable, estructura simple, sin tablas/columnas problemáticas)? ¿Qué formato exporta realmente (PDF, DOCX, HTML, texto)?
- ¿Inventa información que no está en el CV original (**alucinación de datos del candidato**)? Esto es crítico: un CV con datos falsos es un riesgo grave para el usuario.

### 3.4 Cartas de presentación (`coverLetterCopilot.ts`)
- ¿Usa un LLM real o plantillas? ¿Personaliza con datos reales de la oferta/empresa o inserta relleno genérico? ¿Puede inventar logros o empresas?

### 3.5 Inteligencia de empresa (`companyIntelligenceService`)
- ¿De dónde salen salarios, reseñas, tamaño, cultura, noticias? ¿Fuente real y citable, o inventada? Si no hay fuente verificable → 🎭 SIMULADA.

### 3.6 "Agentes", "Antigravity engine", "Pipeline diario" (`agents.ts`, `antigravity*.ts`, `dailyPipelineEngine`, `pipelineOrchestrator`, `pipelineRules`)
- ¿Qué hacen realmente? ¿Hay autonomía real o son funciones secuenciales con nombre llamativo?
- **¿Se ejecuta algo "diariamente" o en segundo plano con la pestaña cerrada?** Un frontend puro NO puede (sin Service Worker/Push/servidor). Verifica qué ocurre de verdad.

### 3.7 Postulación (`batchApplicationService`, `applications`)
- ¿Envía postulaciones reales? (Lo esperable: **no**, no existe API pública universal para aplicar). ¿O solo registra un estado local ("aplicado") sin que nada se envíe? Verifica y sé explícito/a: ¿la UI puede llevar al usuario a creer que aplicó cuando no es así?
- ¿El seguimiento de estados (kanban/tracker) es útil y persistente?

### 3.8 Persistencia y datos (`db.ts`, `storageQuotaManager.ts`, `repositories`)
- ¿Dónde se guardan los datos (localStorage/IndexedDB)? Límites, riesgo de pérdida al limpiar el navegador, falta de backup/exportación/importación, sincronización entre dispositivos (probablemente inexistente), migraciones de esquema, corrupción.

### 3.9 Seguridad y privacidad
- Secretos/API keys expuestos en el bundle (`dist/`, `vite.config.ts`, `.env`). Búsqueda con `grep` de keys, tokens, URLs privadas.
- Uso de proxies CORS públicos con datos personales (fuga del CV/perfil a terceros).
- XSS al renderizar HTML scrapeado (`dangerouslySetInnerHTML`, `innerHTML`).
- Datos personales del CV: dónde viajan y dónde se guardan. Cumplimiento RGPD básico.
- Dependencias vulnerables (`npm audit`).

### 3.10 UX y honestidad de la interfaz
- ¿La UI informa claramente qué es real, qué es una estimación y qué es demo? ¿Hay spinners/barras de progreso falsos? ¿Mensajes de éxito engañosos? ¿Estados vacíos y de error honestos?
- ¿Un usuario nuevo logra, en menos de 10 minutos, pasar de "subir CV" a "tener ofertas relevantes reales y una candidatura enviada"? Mide el recorrido.
- Accesibilidad básica, responsive, rendimiento (tamaño del bundle, carga).

### 3.11 Calidad de ingeniería
- Arquitectura, acoplamiento, duplicación (p. ej. `liveWebScraper` vs `liveWebScanner`; `antigravityEngine` vs `antigravitySearchEngine`: ¿código muerto o redundante?).
- Código muerto/no usado, `any`, `@ts-ignore`, `TODO/FIXME/mock/fake/dummy/simulate/placeholder/hardcoded` (haz `grep` sistemático y reporta cada uno).
- Tests: ¿existen? (previsiblemente no). Manejo de errores, tipado, estados de carga.

---

## 4. DETECTORES AUTOMÁTICOS ANTI-"TEATRO"

Ejecuta búsquedas y reporta **cada coincidencia con archivo:línea y veredicto**:
- `Math.random`, `setTimeout`, `setInterval` (¿simulan trabajo?)
- `sampleData`, `mock`, `fake`, `dummy`, `simulate`, `placeholder`, `hardcode`, `lorem`, `TODO`, `FIXME`
- `fetch(`, `XMLHttpRequest`, `axios`, `allorigins`, `corsproxy`, `cors-anywhere`, `r.jina.ai`, `api.` (¿llamadas reales?)
- `catch` vacíos o que devuelven datos por defecto (errores silenciados)
- Constantes numéricas usadas como scores/porcentajes/salarios
- `process.env`, `import.meta.env`, `apiKey`, `token`, `secret`
- Funciones que devuelven siempre el mismo resultado independientemente de la entrada
- Textos de UI con "IA", "inteligente", "agente", "en vivo", "automático", "tiempo real" y su implementación real detrás

---

## 5. ENTREGABLES (formato obligatorio)

### 5.1 Resumen ejecutivo (máx. 15 líneas)
Veredicto honesto: ¿qué % de la app es real? ¿Es utilizable para buscar trabajo hoy? Nota global 0–10 y por rol (arquitectura, QA, reclutamiento, UX, seguridad).

### 5.2 Matriz de funcionalidades
Tabla: `Funcionalidad | Promesa en la UI | Realidad (evidencia archivo:línea) | Etiqueta (✅🟡🎭❌🚫❓) | Severidad | Esfuerzo para arreglar`

### 5.3 Lista "LO QUE NO SE PUEDE HACER" (sección obligatoria)
Para cada capacidad imposible o inviable: *qué se prometía → por qué es imposible (técnico/legal/económico) → alternativa realista*. Considera como mínimo:
- Scraping fiable de LinkedIn/Indeed/Glassdoor desde el navegador
- Postulación automática universal
- Ejecución programada/autónoma sin backend
- Verificar en tiempo real que una oferta sigue activa en cualquier portal
- Leer sesión logueada del usuario en otros sitios
- OCR/parsing perfecto de cualquier CV
- Datos fiables de salarios/reseñas sin fuente licenciada
- Un LLM "local" sin API/modelo real
- Garantizar compatibilidad ATS "100%"
- Sincronización multi-dispositivo sin servidor
(Añade las que descubras.)

### 5.4 Lista "LO QUE SÍ SE PUEDE HACER" (el máximo realista)
Capacidades alcanzables **de verdad** con la arquitectura actual o con cambios mínimos y honestos, p. ej.: consumir APIs/RSS públicas con CORS abierto (Remotive, Adzuna con key, RemoteOK, Arbeitnow, etc. — **verifica cada una con una petición real**), importar ofertas pegando URL/texto, parsing de CV de PDFs con texto, matching por keywords/embeddings reales, tracker de candidaturas local con exportación, plantillas de carta asistidas, CVs ATS-friendly, y qué requeriría un backend ligero (serverless) o una API de LLM real para dar el siguiente salto. Para cada una: valor para el usuario, esfuerzo, riesgos.

### 5.5 Hallazgos priorizados
Cada hallazgo: `ID | Título | Severidad (Crítica/Alta/Media/Baja) | Rol que lo detecta | Evidencia (archivo:línea / comando / captura) | Impacto en el usuario | Recomendación`.
Marca **críticos** especialmente: datos falsos presentados como reales, fugas de privacidad, falsas postulaciones, CV con información inventada.

### 5.6 Hoja de ruta realista
- **Quitar/etiquetar honestamente** lo simulado (quick wins de honestidad en UI).
- **Arreglar** lo roto.
- **Reconstruir** con fuentes reales lo que sea factible.
- **Descartar** lo imposible.
- Orden recomendado y estimación de esfuerzo (S/M/L).

### 5.7 Declaración de límites del auditor
Lista qué NO pudiste verificar y por qué (sin navegador, sin red, sin claves, etc.).

---

## 6. CRITERIOS DE CALIDAD DE TU PROPIO TRABAJO
- Cada afirmación tiene evidencia. Sin evidencia → "NO VERIFICADO".
- Distingue siempre **"el código lo intenta"** de **"funciona en la práctica"**.
- No recomiendes funcionalidades imposibles como solución. Si una mejora requiere backend, API de pago o consentimiento legal, dilo.
- Prefiere "menos funciones pero reales" a "muchas funciones fingidas".
- Si encuentras que tú mismo/a no puedes comprobar algo, **dilo**; no alucines para completar el informe.
