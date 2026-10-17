import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, MapPin, Building2, Globe2, ArrowRight } from 'lucide-react';

interface TacticalGlobeHUDProps {
  onDeploySector?: (sector: string) => void;
}

export interface AttractiveOfferTarget {
  id: string;
  name: string;
  role: string;
  city: string;
  country: string;
  coordsText: string;
  lat: number;
  lon: number;
  matchScore: number;
  framework: string;
  salary: string;
  requirements: string[];
  sectorKey: string;
  color: string;
}

const ATTRACTIVE_OFFERS: AttractiveOfferTarget[] = [
  {
    id: 'off-bc3',
    name: 'BC3 Basque Centre for Climate Change',
    role: 'Investigador en Modelación de Carbono & Servicios Ecosistémicos',
    city: 'Bilbao / Leioa',
    country: 'Euskadi / España',
    coordsText: '43.33° N, 2.99° W',
    lat: 43.33,
    lon: -2.99,
    matchScore: 98,
    framework: '🇪🇸 Ley 14/2013 UGE • Vía nacionalidad en 2 años',
    salary: '42.000 € - 52.000 € / año',
    requirements: ['Biogeoquímica de Suelos', 'Modelación de Carbono', 'R / Python', 'GIS'],
    sectorKey: 'bilbao',
    color: '#059669'
  },
  {
    id: 'off-kiel',
    name: 'CAU Kiel / Helmholtz Ocean Research (GEOMAR)',
    role: 'Postdoctoral Researcher in Soil Carbon Fluxes & Peatlands',
    city: 'Kiel (Schleswig-Holstein)',
    country: 'Alemania',
    coordsText: '54.32° N, 10.12° E',
    lat: 54.32,
    lon: 10.12,
    matchScore: 96,
    framework: '🇩🇪 §20 AufenthG • Transición directa a EU Blue Card',
    salary: 'TV-L E13 (~50.400 € brutos/año)',
    requirements: ['Eddy Covariance', 'Flujos de Carbono', 'Turberas Templadas', 'CAU Kiel'],
    sectorKey: 'kiel',
    color: '#0284c7'
  },
  {
    id: 'off-gfz',
    name: 'GFZ Helmholtz German Research Centre for Geosciences',
    role: 'Scientist in Quantitative Geodesy & Satellite Earth Observation',
    city: 'Potsdam / Berlín',
    country: 'Alemania',
    coordsText: '52.38° N, 13.06° E',
    lat: 52.38,
    lon: 13.06,
    matchScore: 95,
    framework: '🇩🇪 §20 AufenthG • Centros Federales Helmholtz',
    salary: 'TVöD Bund E14 (~54.000 € / año)',
    requirements: ['Geofísica Cuantitativa', 'InSAR / Sensores Remotos', 'Python', 'Series Temporales'],
    sectorKey: 'kiel',
    color: '#0369a1'
  },
  {
    id: 'off-tecnalia',
    name: 'Tecnalia Research & Innovation',
    role: 'Especialista en Teledetección Satelital & Transición Energética',
    city: 'Derio / Bilbao (Bizkaia)',
    country: 'Euskadi / España',
    coordsText: '43.29° N, 2.87° W',
    lat: 43.29,
    lon: -2.87,
    matchScore: 95,
    framework: '🇪🇸 Ley 14/2013 • Ecosistema Tecnológico BRTA',
    salary: '40.000 € - 50.000 € / año',
    requirements: ['QGIS / ArcGIS Pro', 'Google Earth Engine', 'Balance Hídrico', 'Automatización'],
    sectorKey: 'bilbao',
    color: '#10b981'
  },
  {
    id: 'off-idom',
    name: 'IDOM Consulting, Engineering & Architecture',
    role: 'Consultor Ambiental Senior en Hidrología & Salvaguardias',
    city: 'Bilbao (Zorrotzaurre)',
    country: 'Euskadi / Internacional',
    coordsText: '43.26° N, 2.93° W',
    lat: 43.26,
    lon: -2.93,
    matchScore: 94,
    framework: '🇪🇸 Ley 14/2013 • Licitaciones Banco Mundial / BID',
    salary: '42.000 € - 55.000 € / año',
    requirements: ['Modelación Hidrológica', 'Salvaguardias Socioambientales', 'Inglés C1', 'Gestión Multiactor'],
    sectorKey: 'bilbao',
    color: '#059669'
  },
  {
    id: 'off-unep',
    name: 'UNEP IMEO (International Methane Emissions Observatory)',
    role: 'IMEO Methane Alert & Response Implementation Coordinator',
    city: 'París / Remoto Europa',
    country: 'Internacional / Remoto UE',
    coordsText: '48.85° N, 2.35° E',
    lat: 48.85,
    lon: 2.35,
    matchScore: 92,
    framework: '🌐 Teletrabajo Transfronterizo UE • Naciones Unidas',
    salary: 'Consultoría Especializada ONU (Escala P3)',
    requirements: ['Monitoreo Satelital MARS', 'Mitigación de Metano', 'Diplomacia Climática', 'Español / Inglés'],
    sectorKey: 'offers',
    color: '#d97706'
  },
  {
    id: 'off-uchile',
    name: 'Universidad de Chile (FCFM) / Red Andina',
    role: 'Cooperación Iberoamericana en Geofísica Aplicada & Riesgos',
    city: 'Santiago',
    country: 'Chile',
    coordsText: '33.45° S, 70.67° W',
    lat: -33.45,
    lon: -70.67,
    matchScore: 90,
    framework: '🇨🇱 Pasaporte Chileno • Convenio Bilateral de Investigación',
    salary: 'Proyectos Bilaterales & Asesoría Estratégica',
    requirements: ['Geofísica FCFM', 'Mecánica de Suelos', 'Riesgos Naturales', 'Sistemas Andinos'],
    sectorKey: 'santiago',
    color: '#ca8a04'
  }
];

// Procedural Equirectangular Earth fallback for instant continental rendering
function createProceduralEarthCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Deep oceanic background
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
  oceanGrad.addColorStop(0, '#091d34');
  oceanGrad.addColorStop(0.5, '#0b294a');
  oceanGrad.addColorStop(1, '#091d34');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 1024, 512);

  const mapPt = (lon: number, lat: number): [number, number] => [
    ((lon + 180) / 360) * 1024,
    ((90 - lat) / 180) * 512
  ];

  const drawPoly = (pts: [number, number][], fill: string) => {
    if (pts.length < 3) return;
    ctx.beginPath();
    const [x0, y0] = mapPt(pts[0][0], pts[0][1]);
    ctx.moveTo(x0, y0);
    for (let i = 1; i < pts.length; i++) {
      const [x, y] = mapPt(pts[i][0], pts[i][1]);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  };

  // Eurasia (Europe + Asia)
  drawPoly([
    [-10, 36], [-9, 43], [-1, 46], [-5, 48], [1, 51], [8, 55], [12, 57], [25, 71],
    [35, 68], [60, 68], [100, 75], [170, 65], [140, 45], [120, 32], [105, 20],
    [80, 12], [70, 24], [50, 26], [35, 32], [26, 38], [15, 40], [-5, 36]
  ], '#2a5525');

  // Iberian Peninsula (Spain & Portugal)
  drawPoly([
    [-9.5, 36.8], [-9.1, 42.2], [-8.7, 43.6], [-2.0, 43.5], [3.2, 42.4],
    [0.2, 38.6], [-2.2, 36.7], [-5.6, 36.0], [-7.5, 37.1]
  ], '#827445');

  // British Isles & Scandinavia
  drawPoly([[-5, 50], [1.5, 52], [-1.8, 58], [-5.5, 56]], '#2e5f29');
  drawPoly([[5, 58], [11, 58], [18, 60], [28, 70], [20, 68], [12, 64]], '#244e21');

  // Africa
  drawPoly([
    [-17, 15], [-12, 28], [-5, 36], [10, 37], [32, 31], [43, 12], [51, 10],
    [40, -10], [33, -28], [18, -34], [12, -15], [9, 4], [-15, 11]
  ], '#8a7444');

  // North America
  drawPoly([
    [-168, 65], [-140, 70], [-90, 73], [-60, 60], [-65, 45], [-75, 35], [-80, 25],
    [-97, 26], [-105, 20], [-115, 32], [-124, 40], [-125, 50], [-140, 60], [-165, 60]
  ], '#375c27');

  // South America
  drawPoly([
    [-76, 9], [-60, 10], [-50, 0], [-35, -5], [-39, -15], [-50, -30], [-65, -55],
    [-75, -50], [-72, -35], [-81, -5], [-77, 5]
  ], '#295424');

  // Australia
  drawPoly([
    [113, -22], [115, -34], [130, -32], [140, -38], [150, -37], [153, -28],
    [143, -11], [130, -14], [120, -18]
  ], '#9c7740');

  // Antarctica & Greenland
  ctx.fillStyle = '#ddebf6';
  ctx.fillRect(0, ((90 - (-65)) / 180) * 512, 1024, 512);
  drawPoly([[-50, 60], [-20, 70], [-25, 82], [-55, 82], [-60, 72]], '#eaf2f8');

  return canvas;
}

export const TacticalGlobeHUD: React.FC<TacticalGlobeHUDProps> = ({ onDeploySector }) => {
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Smooth rotation & tilt coordinates stored in refs for 60fps WebGL rendering
  const currentLonRef = useRef<number>(-3); // Default centered on Spain/Europe
  const currentTiltRef = useRef<number>(18);
  const targetLonRef = useRef<number>(-3);
  const targetTiltRef = useRef<number>(18);

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; lon: number; tilt: number }>({ x: 0, y: 0, lon: 0, tilt: 0 });

  const activeOffer = ATTRACTIVE_OFFERS[activeOfferIndex];
  const activeOfferIndexRef = useRef(activeOfferIndex);

  useEffect(() => {
    activeOfferIndexRef.current = activeOfferIndex;
  }, [activeOfferIndex]);

  // Update target coordinates when active offer changes
  useEffect(() => {
    if (activeOffer) {
      targetLonRef.current = activeOffer.lon;
      targetTiltRef.current = Math.max(2, Math.min(26, activeOffer.lat * 0.38 + 10));
    }
  }, [activeOffer]);

  // Auto-cycle through attractive offers every 8 seconds
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setActiveOfferIndex(prev => (prev + 1) % ATTRACTIVE_OFFERS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // 3D Mathematical Projection for unit sphere
  const projectPoint = useCallback((lat: number, lon: number, centerLon: number, tilt: number, cx: number, cy: number, r: number) => {
    const radLat = (lat * Math.PI) / 180;
    const radLon = (lon * Math.PI) / 180;
    const radLon0 = (centerLon * Math.PI) / 180;
    const radTilt = (tilt * Math.PI) / 180;

    // Unit sphere coordinates (lon0 centered)
    const x0 = Math.cos(radLat) * Math.sin(radLon - radLon0);
    const y0 = Math.sin(radLat);
    const z0 = Math.cos(radLat) * Math.cos(radLon - radLon0);

    // Tilt rotation around X axis
    const x1 = x0;
    const y1 = y0 * Math.cos(radTilt) - z0 * Math.sin(radTilt);
    const z1 = y0 * Math.sin(radTilt) + z0 * Math.cos(radTilt);

    const isVisible = z1 > -0.05;
    const x = cx + x1 * r;
    const y = cy - y1 * r;

    return { x, y, z: z1, isVisible };
  }, []);

  // WebGL Lifecycle & Animation Engine (Mounts ONCE, renders continuously at 60fps)
  useEffect(() => {
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!canvas || !overlayCanvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) return;

    const overlayCtx = overlayCanvas.getContext('2d');
    if (!overlayCtx) return;

    // Support Retina displays (devicePixelRatio)
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displaySize = 350;
    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;
    overlayCanvas.width = displaySize * dpr;
    overlayCanvas.height = displaySize * dpr;

    // Build sphere geometry (64 rings x 64 sectors)
    const rings = 64;
    const sectors = 64;
    const positions: number[] = [];
    const texcoords: number[] = [];
    const indices: number[] = [];

    for (let r = 0; r <= rings; r++) {
      const lat = Math.PI / 2 - (r * Math.PI) / rings;
      const sinLat = Math.sin(lat);
      const cosLat = Math.cos(lat);
      const v = r / rings;

      for (let s = 0; s <= sectors; s++) {
        const lon = -Math.PI + (s * 2 * Math.PI) / sectors;
        const sinLon = Math.sin(lon);
        const cosLon = Math.cos(lon);
        const u = s / sectors;

        const x = cosLat * sinLon;
        const y = sinLat;
        const z = cosLat * cosLon;

        positions.push(x, y, z);
        texcoords.push(u, v);
      }
    }

    for (let r = 0; r < rings; r++) {
      for (let s = 0; s < sectors; s++) {
        const p00 = r * (sectors + 1) + s;
        const p01 = p00 + 1;
        const p10 = (r + 1) * (sectors + 1) + s;
        const p11 = p10 + 1;
        indices.push(p00, p10, p01);
        indices.push(p01, p10, p11);
      }
    }

    // Vertex & Fragment Shaders
    const vsSource = `
      attribute vec3 a_position;
      attribute vec2 a_texcoord;
      uniform mat3 u_rotation;
      varying vec2 v_texcoord;
      varying vec3 v_normal;

      void main() {
        vec3 rotated = u_rotation * a_position;
        gl_Position = vec4(rotated.x, rotated.y, rotated.z * 0.5, 1.0);
        v_texcoord = a_texcoord;
        v_normal = rotated;
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform sampler2D u_satelliteTexture;
      uniform sampler2D u_cloudsTexture;
      uniform float u_cloudsOffset;
      varying vec2 v_texcoord;
      varying vec3 v_normal;

      void main() {
        if (v_normal.z < -0.05) {
          discard;
        }

        vec4 satColor = texture2D(u_satelliteTexture, v_texcoord);

        // Saturation & Contrast Enhancement: Makes continents, forests, and deserts crystal clear!
        float lum = dot(satColor.rgb, vec3(0.299, 0.587, 0.114));
        vec3 vibrant = mix(vec3(lum), satColor.rgb, 1.45);
        vibrant = clamp((vibrant - 0.40) * 1.30 + 0.40, 0.0, 1.0);

        // Atmospheric clouds (delicate 18% veil so continents are NEVER obscured)
        vec2 cloudCoord = vec2(fract(v_texcoord.x + u_cloudsOffset), v_texcoord.y);
        vec4 cloudSample = texture2D(u_cloudsTexture, cloudCoord);
        float cloudAlpha = cloudSample.r * 0.18;
        vec3 baseEarth = mix(vibrant, vec3(0.96, 0.98, 1.0), cloudAlpha);

        // Natural sunlight illumination (Sun from upper-left)
        vec3 sunDir = normalize(vec3(-0.35, 0.55, 0.75));
        float NdotL = max(dot(v_normal, sunDir), 0.0);
        float ambient = 0.50;
        float diffuse = ambient + (1.0 - ambient) * NdotL;

        // Ocean specular glint (water reflects sunlight, land stays matte)
        bool isWater = (satColor.b > satColor.r + 0.04) && (lum < 0.42);
        float spec = 0.0;
        if (isWater && NdotL > 0.0) {
          vec3 viewDir = vec3(0.0, 0.0, 1.0);
          vec3 halfVec = normalize(sunDir + viewDir);
          float NdotH = max(dot(v_normal, halfVec), 0.0);
          spec = pow(NdotH, 22.0) * 0.45;
        }

        // Earth atmospheric limb glow (sky blue outer boundary)
        float rim = 1.0 - max(v_normal.z, 0.0);
        vec3 atmoGlow = vec3(0.26, 0.65, 1.0) * pow(rim, 3.0) * 0.55;

        vec3 finalColor = baseEarth * diffuse + vec3(spec * 0.85, spec * 0.92, spec) + atmoGlow;
        gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
      }
    `;

    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Buffers setup
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // Attributes & Uniforms
    const aPos = gl.getAttribLocation(program, 'a_position');
    const aTex = gl.getAttribLocation(program, 'a_texcoord');
    const uRotation = gl.getUniformLocation(program, 'u_rotation');
    const uSat = gl.getUniformLocation(program, 'u_satelliteTexture');
    const uClouds = gl.getUniformLocation(program, 'u_cloudsTexture');
    const uCloudsOffset = gl.getUniformLocation(program, 'u_cloudsOffset');

    gl.enableVertexAttribArray(aPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(aTex);
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, 0, 0);

    // Create Textures
    const satTex = gl.createTexture();
    const cloudsTex = gl.createTexture();

    // 1. Instant procedural continent fallback so continents are IMMEDIATELY visible at millisecond 0!
    const fallbackCanvas = createProceduralEarthCanvas();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, satTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, fallbackCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Default clouds fallback
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, cloudsTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 60]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // 2. Load High-Resolution NASA Blue Marble Satellite Photograph
    const satImg = new Image();
    satImg.src = '/textures/earth-satellite.jpg';
    satImg.onload = () => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, satTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, satImg);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    // 3. Load Realistic Atmospheric Clouds
    const cloudImg = new Image();
    cloudImg.src = '/textures/earth-clouds.png';
    cloudImg.onload = () => {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, cloudsTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cloudImg);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // 60FPS Continuous Render Loop
    let animId: number;
    const renderLoop = () => {
      // 1. Smooth interpolation towards target offer coords
      if (!isDraggingRef.current) {
        let diffLon = targetLonRef.current - currentLonRef.current;
        while (diffLon < -180) diffLon += 360;
        while (diffLon > 180) diffLon -= 360;
        if (Math.abs(diffLon) > 0.05) {
          currentLonRef.current += diffLon * 0.055;
        }

        const diffTilt = targetTiltRef.current - currentTiltRef.current;
        if (Math.abs(diffTilt) > 0.05) {
          currentTiltRef.current += diffTilt * 0.045;
        }
      }

      const lonAngle = currentLonRef.current;
      const tiltAngle = currentTiltRef.current;

      // 2. Compute Rotation Matrix (Column-Major for WebGL)
      const lon0 = (lonAngle * Math.PI) / 180;
      const tilt = (tiltAngle * Math.PI) / 180;

      const cy = Math.cos(-lon0);
      const sy = Math.sin(-lon0);
      const cx = Math.cos(tilt);
      const sx = Math.sin(tilt);

      const rotMat = [
        cy,          sx * sy,   -cx * sy,
        0,           cx,         sx,
        sy,         -sx * cy,    cx * cy
      ];

      // Draw WebGL Globe
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniformMatrix3fv(uRotation, false, new Float32Array(rotMat));
      gl.uniform1i(uSat, 0);
      gl.uniform1i(uClouds, 1);
      gl.uniform1f(uCloudsOffset, (performance.now() * 0.000008) % 1.0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

      // 3. Render 2D Overlay Canvas (Pins, Shadow, Graticule, Flight Arcs)
      overlayCtx.save();
      overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      overlayCtx.scale(dpr, dpr);

      const cxScreen = displaySize / 2;
      const cyScreen = displaySize / 2;
      const radius = displaySize * 0.43;

      // A. Drop Shadow under the globe onto the white card
      const baseShadow = overlayCtx.createRadialGradient(
        cxScreen, cyScreen + radius * 0.98, radius * 0.2,
        cxScreen, cyScreen + radius * 0.98, radius * 1.04
      );
      baseShadow.addColorStop(0, 'rgba(15, 23, 42, 0.35)');
      baseShadow.addColorStop(0.5, 'rgba(15, 23, 42, 0.12)');
      baseShadow.addColorStop(1, 'rgba(15, 23, 42, 0)');
      overlayCtx.fillStyle = baseShadow;
      overlayCtx.beginPath();
      overlayCtx.ellipse(cxScreen, cyScreen + radius * 0.98, radius * 0.95, radius * 0.22, 0, 0, Math.PI * 2);
      overlayCtx.fill();

      // B. Subtle Planetary Graticule Lines (Equator & Greenwich Meridian for visual orientation)
      overlayCtx.save();
      overlayCtx.strokeStyle = 'rgba(56, 189, 248, 0.20)';
      overlayCtx.lineWidth = 1;
      overlayCtx.setLineDash([3, 4]);

      // Equator (lat = 0)
      overlayCtx.beginPath();
      let started = false;
      for (let l = -180; l <= 180; l += 5) {
        const pt = projectPoint(0, l, lonAngle, tiltAngle, cxScreen, cyScreen, radius);
        if (pt.isVisible) {
          if (!started) {
            overlayCtx.moveTo(pt.x, pt.y);
            started = true;
          } else {
            overlayCtx.lineTo(pt.x, pt.y);
          }
        } else {
          started = false;
        }
      }
      overlayCtx.stroke();

      // Greenwich Meridian (lon = 0)
      overlayCtx.beginPath();
      started = false;
      for (let lt = -85; lt <= 85; lt += 5) {
        const pt = projectPoint(lt, 0, lonAngle, tiltAngle, cxScreen, cyScreen, radius);
        if (pt.isVisible) {
          if (!started) {
            overlayCtx.moveTo(pt.x, pt.y);
            started = true;
          } else {
            overlayCtx.lineTo(pt.x, pt.y);
          }
        } else {
          started = false;
        }
      }
      overlayCtx.stroke();
      overlayCtx.restore();

      // C. Flight Arcs between Strategic Hubs
      const bilbaoPt = projectPoint(43.33, -2.99, lonAngle, tiltAngle, cxScreen, cyScreen, radius);
      const kielPt = projectPoint(54.32, 10.12, lonAngle, tiltAngle, cxScreen, cyScreen, radius);
      const santiagoPt = projectPoint(-33.45, -70.67, lonAngle, tiltAngle, cxScreen, cyScreen, radius);

      // Arc: Bilbao <-> Kiel (Solid Clean Flight Route)
      if (bilbaoPt.isVisible && kielPt.isVisible) {
        overlayCtx.beginPath();
        overlayCtx.moveTo(bilbaoPt.x, bilbaoPt.y);
        const midX = (bilbaoPt.x + kielPt.x) / 2 - 8;
        const midY = (bilbaoPt.y + kielPt.y) / 2 - 16;
        overlayCtx.quadraticCurveTo(midX, midY, kielPt.x, kielPt.y);
        overlayCtx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
        overlayCtx.lineWidth = 2.4;
        overlayCtx.stroke();
      }

      // Arc: Bilbao <-> Santiago (Transatlantic Connection)
      if (santiagoPt.isVisible && bilbaoPt.isVisible) {
        overlayCtx.beginPath();
        overlayCtx.moveTo(santiagoPt.x, santiagoPt.y);
        const midX = (santiagoPt.x + bilbaoPt.x) / 2 + 18;
        const midY = (santiagoPt.y + bilbaoPt.y) / 2 - 18;
        overlayCtx.quadraticCurveTo(midX, midY, bilbaoPt.x, bilbaoPt.y);
        overlayCtx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
        overlayCtx.lineWidth = 2;
        overlayCtx.setLineDash([4, 4]);
        overlayCtx.stroke();
        overlayCtx.setLineDash([]);
      }

      // D. Target Location Markers
      ATTRACTIVE_OFFERS.forEach((target, idx) => {
        const pt = projectPoint(target.lat, target.lon, lonAngle, tiltAngle, cxScreen, cyScreen, radius);
        if (!pt.isVisible) return;

        const isCurrent = idx === activeOfferIndexRef.current;

        if (isCurrent) {
          // Radar pulse ring
          overlayCtx.beginPath();
          overlayCtx.arc(pt.x, pt.y, 16, 0, Math.PI * 2);
          overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.40)';
          overlayCtx.fill();
          overlayCtx.strokeStyle = target.color;
          overlayCtx.lineWidth = 1.8;
          overlayCtx.stroke();

          // Teardrop Pin
          const pinY = pt.y - 12;

          // Pin Shadow
          overlayCtx.beginPath();
          overlayCtx.ellipse(pt.x, pt.y + 1, 4.5, 2, 0, 0, Math.PI * 2);
          overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          overlayCtx.fill();

          // Pin Head
          overlayCtx.beginPath();
          overlayCtx.arc(pt.x, pinY, 7.5, 0, Math.PI * 2);
          overlayCtx.fillStyle = target.color;
          overlayCtx.fill();
          overlayCtx.strokeStyle = '#ffffff';
          overlayCtx.lineWidth = 2.5;
          overlayCtx.stroke();

          // Inner white dot
          overlayCtx.beginPath();
          overlayCtx.arc(pt.x, pinY, 2.5, 0, Math.PI * 2);
          overlayCtx.fillStyle = '#ffffff';
          overlayCtx.fill();

          // Pin Stem
          overlayCtx.beginPath();
          overlayCtx.moveTo(pt.x - 3.5, pinY + 5.5);
          overlayCtx.lineTo(pt.x, pt.y);
          overlayCtx.lineTo(pt.x + 3.5, pinY + 5.5);
          overlayCtx.fillStyle = target.color;
          overlayCtx.fill();

          // City Badge Label
          overlayCtx.font = 'bold 11px system-ui, -apple-system, sans-serif';
          const labelText = target.city.split('/')[0].trim();
          const textWidth = overlayCtx.measureText(labelText).width;
          const badgeX = pt.x + 12;
          const badgeY = pinY - 14;

          overlayCtx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          overlayCtx.beginPath();
          overlayCtx.roundRect(badgeX, badgeY, textWidth + 12, 18, 4);
          overlayCtx.fill();

          overlayCtx.fillStyle = '#ffffff';
          overlayCtx.fillText(labelText, badgeX + 6, badgeY + 13);
        } else {
          // Subtle city marker
          overlayCtx.beginPath();
          overlayCtx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
          overlayCtx.fillStyle = '#ffffff';
          overlayCtx.fill();
          overlayCtx.strokeStyle = target.color;
          overlayCtx.lineWidth = 2;
          overlayCtx.stroke();
        }
      });

      overlayCtx.restore();

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      gl.deleteProgram(program);
      gl.deleteBuffer(posBuffer);
      gl.deleteBuffer(texBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteTexture(satTex);
      gl.deleteTexture(cloudsTex);
    };
  }, [projectPoint]);

  // Drag interaction to rotate the globe manually
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      lon: currentLonRef.current,
      tilt: currentTiltRef.current
    };
    setIsAutoRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    currentLonRef.current = dragStartRef.current.lon + deltaX * 0.55;
    currentTiltRef.current = Math.max(-12, Math.min(38, dragStartRef.current.tilt - deltaY * 0.35));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleSelectOffer = (idx: number) => {
    setActiveOfferIndex(idx);
    setIsAutoRotating(false);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c1322] p-6 sm:p-8 shadow-xl text-slate-800 dark:text-slate-100 font-sans transition-colors">
      
      {/* Top Header: Clean, Executive, High-Tech */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-3">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 flex items-center justify-center shadow-xs">
            <Globe2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase">
                VISOR PLANETARIO // RED GLOBAL DE EMPLEO
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
                SATELITAL REALISTA (NASA)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Esfera terrestre satelital de alta fidelidad con continentes nítidos, relieve continental y rotación orbital orientada a hubs estratégicos.
            </p>
          </div>
        </div>

        {/* Current Target Location Badge */}
        <div className="flex items-center space-x-2 text-xs font-mono bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-bold text-slate-700 dark:text-slate-200">{activeOffer.city}</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500">{activeOffer.coordsText}</span>
        </div>
      </div>

      {/* Main Grid: Photorealistic Satellite Globe + Clean Offer Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5 items-center">
        
        {/* Left Column: True Satellite Earth Globe */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center select-none">
          <div className="relative cursor-grab active:cursor-grabbing p-1 flex items-center justify-center">
            
            {/* WebGL Satellite Globe Canvas */}
            <canvas
              ref={canvasRef}
              className="w-full max-w-[350px] aspect-square drop-shadow-2xl rounded-full"
            />

            {/* Overlay Canvas for Atmospheric Rim & Location Pins */}
            <canvas
              ref={overlayCanvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="absolute inset-0 w-full max-w-[350px] aspect-square pointer-events-auto"
              title="Arrastra con el ratón para rotar el planeta libremente"
            />

            {/* Drag Hint Tooltip */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-md px-3 py-1 rounded-full text-[10px] font-sans text-slate-600 dark:text-slate-300 pointer-events-none backdrop-blur-xs flex items-center gap-1.5 whitespace-nowrap">
              <span>🌍 Fotografía Satelital NASA</span>
              <span className="text-slate-400">•</span>
              <span>Arrastra para girar</span>
            </div>
          </div>

          {/* Smooth Rotation Controls */}
          <div className="flex items-center gap-2 mt-4 justify-center">
            <button
              onClick={() => {
                setActiveOfferIndex((activeOfferIndex - 1 + ATTRACTIVE_OFFERS.length) % ATTRACTIVE_OFFERS.length);
                setIsAutoRotating(false);
              }}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer border border-slate-200 dark:border-slate-700"
              title="Oferta anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer border shadow-xs ${
                isAutoRotating
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title="Alternar rotación automática"
            >
              {isAutoRotating ? (
                <>
                  <Pause className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Pausar Rotación</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Activar Rotación</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setActiveOfferIndex((activeOfferIndex + 1) % ATTRACTIVE_OFFERS.length);
                setIsAutoRotating(false);
              }}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer border border-slate-200 dark:border-slate-700"
              title="Siguiente oferta"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Clean Telemetry Offer Dossier (Light / Clean Card) */}
        <div className="lg:col-span-6 space-y-3.5">
          
          {/* Quick Target Destination Chips */}
          <div className="flex flex-wrap gap-1.5">
            {ATTRACTIVE_OFFERS.map((target, idx) => (
              <button
                key={target.id}
                onClick={() => handleSelectOffer(idx)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium transition flex items-center gap-1.5 cursor-pointer border ${
                  activeOfferIndex === idx
                    ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-700'
                }`}
                title={`Rotar hacia ${target.city}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: target.color }} />
                <span>{target.city.split('/')[0].trim()}</span>
                <span className="text-[10px] opacity-80">({target.matchScore}%)</span>
              </button>
            ))}
          </div>

          {/* Active Attractive Offer Dossier Card */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 space-y-4 shadow-sm relative">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{activeOffer.city} • {activeOffer.country}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 tracking-tight leading-snug">
                  {activeOffer.role}
                </h3>
                <div className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5 mt-1">
                  <Building2 className="h-3.5 w-3.5 shrink-0" />
                  <span>{activeOffer.name}</span>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-black text-xs font-mono shrink-0 shadow-xs">
                {activeOffer.matchScore}% MATCH
              </div>
            </div>

            {/* Strategic Attributes Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-0.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Marco Legal & Visado</span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">{activeOffer.framework}</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-0.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Retribución Estimada</span>
                <span className="text-xs text-amber-700 dark:text-amber-300 font-bold">{activeOffer.salary}</span>
              </div>
            </div>

            {/* Requirements / Tags */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Competencias Demandadas:</div>
              <div className="flex flex-wrap gap-1.5">
                {activeOffer.requirements.map(req => (
                  <span key={req} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-2xs">
                    {req}
                  </span>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            {onDeploySector && (
              <div className="pt-2">
                <button
                  onClick={() => onDeploySector(activeOffer.sectorKey)}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition uppercase tracking-wider cursor-pointer"
                >
                  <span>Explorar Ofertas de este Sector</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
