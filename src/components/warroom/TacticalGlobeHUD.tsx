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

export const TacticalGlobeHUD: React.FC<TacticalGlobeHUDProps> = ({ onDeploySector }) => {
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(-5); // Longitude center
  const [tiltAngle, setTiltAngle] = useState(16); // Latitude tilt in degrees
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; angle: number; tilt: number }>({ x: 0, y: 0, angle: 0, tilt: 0 });

  const activeOffer = ATTRACTIVE_OFFERS[activeOfferIndex];
  const targetLon = activeOffer ? activeOffer.lon : 0;
  const targetLat = activeOffer ? activeOffer.lat : 20;

  // Auto-cycle through attractive offers every 7 seconds
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setActiveOfferIndex(prev => (prev + 1) % ATTRACTIVE_OFFERS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Smooth rotation interpolation towards active target longitude and latitude
  useEffect(() => {
    let active = true;
    const step = () => {
      if (!isDraggingRef.current) {
        setRotationAngle(currentAngle => {
          let diff = targetLon - currentAngle;
          while (diff < -180) diff += 360;
          while (diff > 180) diff -= 360;
          if (Math.abs(diff) > 0.08) {
            return currentAngle + diff * 0.055;
          }
          return currentAngle;
        });

        setTiltAngle(currentTilt => {
          // Keep tilt balanced between 0 and 28 deg for comfortable view
          const idealTilt = Math.max(0, Math.min(26, targetLat * 0.4 + 8));
          const diffTilt = idealTilt - currentTilt;
          if (Math.abs(diffTilt) > 0.05) {
            return currentTilt + diffTilt * 0.04;
          }
          return currentTilt;
        });
      }
      if (active) {
        animFrameRef.current = requestAnimationFrame(step);
      }
    };
    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetLon, targetLat]);

  // 3D Mathematical Projection for true sphere
  const projectPoint = useCallback((lat: number, lon: number, centerLon: number, tilt: number, cx: number, cy: number, r: number) => {
    const radLat = (lat * Math.PI) / 180;
    const radLon = (lon * Math.PI) / 180;
    const radLon0 = (centerLon * Math.PI) / 180;
    const radTilt = (tilt * Math.PI) / 180;

    // Unit sphere coordinates
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

  // WebGL Realistic Satellite Earth Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) return;

    // Build sphere geometry (48 rings x 48 sectors)
    const rings = 48;
    const sectors = 48;
    const positions: number[] = [];
    const texcoords: number[] = [];
    const indices: number[] = [];

    for (let r = 0; r <= rings; r++) {
      const theta = (r * Math.PI) / rings;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let s = 0; s <= sectors; s++) {
        const phi = (s * 2 * Math.PI) / sectors;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = cosPhi * sinTheta;
        const y = cosTheta;
        const z = sinPhi * sinTheta;

        const u = 1 - s / sectors;
        const v = r / rings;

        positions.push(x, y, z);
        texcoords.push(u, v);
      }
    }

    for (let r = 0; r < rings; r++) {
      for (let s = 0; s < sectors; s++) {
        const first = r * (sectors + 1) + s;
        const second = first + sectors + 1;
        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }

    // Shaders
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
        vec4 satColor = texture2D(u_satelliteTexture, v_texcoord);
        
        // Clouds sampling with gentle offset
        vec2 cloudCoord = vec2(fract(v_texcoord.x + u_cloudsOffset), v_texcoord.y);
        vec4 cloudColor = texture2D(u_cloudsTexture, cloudCoord);

        // Sunlight illumination from upper-left
        vec3 lightDir = normalize(vec3(-0.45, 0.55, 0.7));
        float diff = max(dot(v_normal, lightDir), 0.0);
        float ambient = 0.42;
        float light = ambient + (1.0 - ambient) * diff;

        // Atmospheric rim scatter (sky blue horizon glow)
        float rim = 1.0 - max(dot(v_normal, vec3(0.0, 0.0, 1.0)), 0.0);
        vec3 atmoGlow = vec3(0.25, 0.65, 1.0) * pow(rim, 2.8) * 0.65;

        // Blend satellite imagery + authentic clouds
        vec3 baseColor = mix(satColor.rgb, vec3(0.96, 0.98, 1.0), cloudColor.r * 0.45);
        vec3 finalColor = baseColor * light + atmoGlow;

        gl_FragColor = vec4(finalColor, 1.0);
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

    // Buffers
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // Uniforms & Attributes
    const aPos = gl.getAttribLocation(program, 'a_position');
    const aTex = gl.getAttribLocation(program, 'a_texcoord');
    const uRotation = gl.getUniformLocation(program, 'u_rotation');
    const uSat = gl.getUniformLocation(program, 'u_satelliteTexture');
    const uClouds = gl.getUniformLocation(program, 'u_cloudsTexture');
    const uCloudsOffset = gl.getUniformLocation(program, 'u_cloudsOffset');

    // Textures setup
    const satTex = gl.createTexture();
    const cloudsTex = gl.createTexture();

    // Default 1x1 placeholder texture while loading
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, satTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([15, 55, 110, 255]));

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, cloudsTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 128]));

    // Load authentic NASA Blue Marble satellite photograph
    const satImg = new Image();
    satImg.src = '/textures/earth-satellite.jpg';
    satImg.onload = () => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, satTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, satImg);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    // Load authentic atmospheric clouds
    const cloudImg = new Image();
    cloudImg.src = '/textures/earth-clouds.png';
    cloudImg.onload = () => {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, cloudsTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cloudImg);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Calculate rotation matrix (Lon around Y, Tilt around X)
    const radY = (-rotationAngle * Math.PI) / 180;
    const radX = (tiltAngle * Math.PI) / 180;

    const cosY = Math.cos(radY);
    const sinY = Math.sin(radY);
    const cosX = Math.cos(radX);
    const sinX = Math.sin(radX);

    // Combined rotation matrix: R = Rx * Ry
    // [ cosY,       0,     -sinY     ]
    // [ sinX*sinY,  cosX,  sinX*cosY ]
    // [ cosX*sinY, -sinX,  cosX*cosY ]
    const rotMat = [
      cosY, 0, -sinY,
      sinX * sinY, cosX, sinX * cosY,
      cosX * sinY, -sinX, cosX * cosY
    ];

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enableVertexAttribArray(aPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(aTex);
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix3fv(uRotation, false, new Float32Array(rotMat));
    gl.uniform1i(uSat, 0);
    gl.uniform1i(uClouds, 1);
    gl.uniform1f(uCloudsOffset, (Date.now() * 0.000008) % 1.0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  }, [rotationAngle, tiltAngle]);

  // 2D Overlay Canvas Render: Atmospheric Rim, Realistic Location Pins & Flight Arcs
  useEffect(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.43;

    ctx.clearRect(0, 0, width, height);

    // 1. Natural Soft Physical Drop Shadow under the Globe
    const baseShadow = ctx.createRadialGradient(cx, cy + radius * 0.98, radius * 0.2, cx, cy + radius * 0.98, radius * 1.05);
    baseShadow.addColorStop(0, 'rgba(15, 23, 42, 0.32)');
    baseShadow.addColorStop(0.5, 'rgba(15, 23, 42, 0.12)');
    baseShadow.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = baseShadow;
    ctx.beginPath();
    ctx.ellipse(cx, cy + radius * 0.98, radius * 0.95, radius * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Atmospheric Outer Blue Rim Aura
    const rimAura = ctx.createRadialGradient(cx, cy, radius * 0.94, cx, cy, radius * 1.14);
    rimAura.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
    rimAura.addColorStop(0.6, 'rgba(14, 165, 233, 0.15)');
    rimAura.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = rimAura;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.14, 0, Math.PI * 2);
    ctx.fill();

    // 3. Flight Arcs between Key Hubs (Bilbao <-> Kiel, Bilbao <-> Santiago)
    const bilbaoPt = projectPoint(43.33, -2.99, rotationAngle, tiltAngle, cx, cy, radius);
    const kielPt = projectPoint(54.32, 10.12, rotationAngle, tiltAngle, cx, cy, radius);
    const santiagoPt = projectPoint(-33.45, -70.67, rotationAngle, tiltAngle, cx, cy, radius);

    // Arc Bilbao <-> Kiel
    if (bilbaoPt.isVisible && kielPt.isVisible) {
      ctx.beginPath();
      ctx.moveTo(bilbaoPt.x, bilbaoPt.y);
      const midX = (bilbaoPt.x + kielPt.x) / 2 - 8;
      const midY = (bilbaoPt.y + kielPt.y) / 2 - 14;
      ctx.quadraticCurveTo(midX, midY, kielPt.x, kielPt.y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 2.2;
      ctx.stroke();
    }

    // Arc Bilbao <-> Santiago
    if (santiagoPt.isVisible && bilbaoPt.isVisible) {
      ctx.beginPath();
      ctx.moveTo(santiagoPt.x, santiagoPt.y);
      const midX = (santiagoPt.x + bilbaoPt.x) / 2 + 18;
      const midY = (santiagoPt.y + bilbaoPt.y) / 2 - 18;
      ctx.quadraticCurveTo(midX, midY, bilbaoPt.x, bilbaoPt.y);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 4. Authentic Map Markers (Pins) on Attractive Target Cities
    ATTRACTIVE_OFFERS.forEach((target, idx) => {
      const pt = projectPoint(target.lat, target.lon, rotationAngle, tiltAngle, cx, cy, radius);
      if (!pt.isVisible) return;

      const isCurrent = idx === activeOfferIndex;

      if (isCurrent) {
        // Expanding soft radar ripple on active target
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fill();
        ctx.strokeStyle = target.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Location Pin (Google Maps teardrop style with drop shadow)
        const pinY = pt.y - 12;

        // Pin shadow
        ctx.beginPath();
        ctx.ellipse(pt.x, pt.y + 1, 4.5, 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fill();

        // Pin Head
        ctx.beginPath();
        ctx.arc(pt.x, pinY, 7.5, 0, Math.PI * 2);
        ctx.fillStyle = target.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Inner white dot
        ctx.beginPath();
        ctx.arc(pt.x, pinY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Pin stem
        ctx.beginPath();
        ctx.moveTo(pt.x - 3.5, pinY + 5.5);
        ctx.lineTo(pt.x, pt.y);
        ctx.lineTo(pt.x + 3.5, pinY + 5.5);
        ctx.fillStyle = target.color;
        ctx.fill();
      } else {
        // Subtle clean city marker
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = target.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }, [rotationAngle, tiltAngle, activeOfferIndex, projectPoint]);

  // Drag handling to rotate the globe manually
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY, angle: rotationAngle, tilt: tiltAngle };
    setIsAutoRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setRotationAngle(dragStartRef.current.angle + deltaX * 0.45);
    setTiltAngle(Math.max(-10, Math.min(35, dragStartRef.current.tilt - deltaY * 0.25)));
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
      
      {/* Top Header: Clean, Executive, Non-Tactical */}
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
                SATELITAL REALISTA
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fotografía satelital Blue Marble con rotación interactiva vinculada a vacantes científicas (Bilbao • Kiel • Potsdam • París • Santiago).
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
              width={350}
              height={350}
              className="w-full max-w-[350px] h-auto drop-shadow-2xl rounded-full"
            />

            {/* Overlay Canvas for Atmospheric Rim & Location Pins */}
            <canvas
              ref={overlayCanvasRef}
              width={350}
              height={350}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="absolute inset-0 w-full max-w-[350px] h-auto pointer-events-auto"
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
