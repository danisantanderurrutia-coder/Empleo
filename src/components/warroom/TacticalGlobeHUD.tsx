import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Crosshair, Satellite, Play, Pause, ChevronLeft, ChevronRight, MapPin, Building2 } from 'lucide-react';

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
    framework: '🇪🇸 Ley 14/2013 UGE • Nacionalidad en 2 años',
    salary: '42.000 € - 52.000 € / año',
    requirements: ['Biogeoquímica de Suelos', 'Modelación de Carbono', 'R / Python', 'GIS'],
    sectorKey: 'bilbao',
    color: '#10b981'
  },
  {
    id: 'off-kiel',
    name: 'CAU Kiel / Helmholtz Centre for Ocean Research',
    role: 'Postdoctoral Researcher in Soil Carbon Fluxes & Peatland Dynamics',
    city: 'Kiel (Schleswig-Holstein)',
    country: 'Alemania',
    coordsText: '54.32° N, 10.12° E',
    lat: 54.32,
    lon: 10.12,
    matchScore: 96,
    framework: '🇩🇪 §20 AufenthG • Transición inmediata a EU Blue Card',
    salary: 'TV-L E13 (~50.400 € brutos/año)',
    requirements: ['Torres Eddy Covariance', 'Flujos de GEI', 'Turberas Templadas', 'Alma Mater CAU'],
    sectorKey: 'kiel',
    color: '#0ea5e9'
  },
  {
    id: 'off-gfz',
    name: 'GFZ Helmholtz German Research Centre for Geosciences',
    role: 'Scientist in Geodesy, Satellite Earth Observation & Geophysics',
    city: 'Potsdam / Berlín',
    country: 'Alemania',
    coordsText: '52.38° N, 13.06° E',
    lat: 52.38,
    lon: 13.06,
    matchScore: 95,
    framework: '🇩🇪 §20 AufenthG • Red de Centros Federales Helmholtz',
    salary: 'TVöD Bund E14 (~54.000 € / año)',
    requirements: ['Geofísica Cuantitativa', 'InSAR / Sensores Remotos', 'Python', 'Series Temporales'],
    sectorKey: 'kiel',
    color: '#38bdf8'
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
    color: '#34d399'
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
    color: '#10b981'
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
    color: '#f59e0b'
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
    color: '#eab308'
  }
];

// Simplified realistic continent coastal outlines in [lat, lon] polygons
const CONTINENT_POLYGONS: [number, number][][] = [
  // Europe & Mediterranean (Iberia, France, Germany, Scandinavia, Italy, UK)
  [
    [36, -6], [37, -9], [43, -9], [43.5, -2], [47, -3], [49, -1.5], [51, 2], [53.5, 8],
    [54.5, 9.5], [57.5, 10.5], [55, 13], [54, 19], [59, 18], [63, 21], [65, 25],
    [70, 28], [71, 26], [68, 14], [62, 5], [58, 6], [54, 9], [51, 4], [44, 4],
    [43.5, 7], [41, 9], [38, 15], [40, 18], [38, 24], [41, 28], [45, 30], [47, 39],
    [44, 38], [42, 29], [37, 22], [38, 13], [44, 12], [44, 8], [43, 3], [36.5, -3], [36, -6]
  ],
  // British Isles
  [
    [50, -5], [52, -5.5], [55, -5], [58, -5], [58, -3], [54, 0], [51, 1.5], [50, -1], [50, -5]
  ],
  // Scandinavia
  [
    [58, 6], [62, 5], [66, 12], [70, 19], [71, 26], [68, 29], [64, 21], [60, 19], [56, 14], [58, 6]
  ],
  // South America (Santiago, Chile, Andes, Brazil, Argentina, Colombia)
  [
    [12, -72], [9, -79], [4, -77], [-5, -81], [-14, -76], [-23, -70], [-33, -71.5], [-45, -75],
    [-54, -71], [-55, -66], [-46, -66], [-38, -57], [-34, -54], [-24, -46], [-13, -38],
    [-5, -35], [-2, -44], [4, -51], [7, -58], [11, -63], [12, -72]
  ],
  // North America
  [
    [8, -77], [16, -93], [21, -97], [29, -95], [30, -85], [25, -80], [35, -75], [44, -66],
    [47, -53], [58, -62], [62, -75], [69, -90], [70, -120], [71, -155], [60, -165],
    [54, -160], [58, -135], [48, -125], [37, -122], [32, -117], [23, -110], [16, -95], [8, -77]
  ],
  // Africa
  [
    [36, -6], [32, 10], [31, 32], [22, 38], [12, 44], [12, 51], [0, 42], [-11, 40],
    [-25, 33], [-34, 20], [-34, 18], [-22, 14], [-12, 13], [5, 2], [4, -8], [12, -16],
    [21, -17], [28, -13], [36, -6]
  ],
  // Eurasia (East of Urals to Asia)
  [
    [42, 29], [47, 39], [55, 60], [67, 70], [72, 80], [73, 120], [70, 160], [65, 175],
    [60, 163], [53, 142], [43, 132], [37, 126], [31, 122], [22, 114], [10, 105],
    [1, 104], [16, 96], [22, 90], [21, 70], [25, 62], [25, 56], [15, 52], [13, 44],
    [25, 35], [36, 36], [41, 29]
  ]
];

export const TacticalGlobeHUD: React.FC<TacticalGlobeHUDProps> = ({ onDeploySector }) => {
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0); // Longitude center in degrees
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; angle: number }>({ x: 0, angle: 0 });

  const activeOffer = ATTRACTIVE_OFFERS[activeOfferIndex];

  // Target longitude to smoothly rotate towards
  const targetLon = activeOffer ? activeOffer.lon : 0;

  // Auto-cycle through attractive offers every 6.5s when auto-rotate is on
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setActiveOfferIndex(prev => (prev + 1) % ATTRACTIVE_OFFERS.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Smoothly interpolate rotationAngle towards active offer longitude
  useEffect(() => {
    let active = true;
    const step = () => {
      if (!isDraggingRef.current) {
        setRotationAngle(currentAngle => {
          // Calculate shortest angular distance
          let diff = targetLon - currentAngle;
          while (diff < -180) diff += 360;
          while (diff > 180) diff -= 360;

          // Soft exponential smoothing
          if (Math.abs(diff) > 0.1) {
            return currentAngle + diff * 0.055;
          }
          return currentAngle;
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
  }, [targetLon]);

  // Project lat/lon to Canvas coordinates using closed-form 3D Orthographic Projection
  const projectPoint = useCallback((lat: number, lon: number, centerLon: number, cx: number, cy: number, r: number) => {
    const phi0 = (22 * Math.PI) / 180; // Tilt 22 deg North for panoramic view of EU & Americas
    const phi = (lat * Math.PI) / 180;
    const lam = (lon * Math.PI) / 180;
    const lam0 = (centerLon * Math.PI) / 180;

    // Angular distance from projection center
    const cosC = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lam - lam0);
    const isVisible = cosC >= -0.05;

    // Projected cartesian coordinates
    const x = cx + r * Math.cos(phi) * Math.sin(lam - lam0);
    const y = cy - r * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lam - lam0));

    return { x, y, isVisible, cosC };
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.42;

    ctx.clearRect(0, 0, width, height);

    // 1. Outer Atmospheric Rim Glow
    const rimGrad = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.25);
    rimGrad.addColorStop(0, 'rgba(14, 165, 233, 0.25)');
    rimGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.12)');
    rimGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
    ctx.fillStyle = rimGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.25, 0, Math.PI * 2);
    ctx.fill();

    // 2. Realistic 3D Globe Deep Ocean Sphere with Specular Highlight
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    // Deep ocean sphere gradient
    const oceanGrad = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.35, radius * 0.1, cx, cy, radius);
    oceanGrad.addColorStop(0, '#0a2540');
    oceanGrad.addColorStop(0.4, '#06162a');
    oceanGrad.addColorStop(0.85, '#040d1a');
    oceanGrad.addColorStop(1, '#020611');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    // 3. Latitude Parallels (Graticule)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);

    [-60, -30, 0, 30, 60].forEach(lat => {
      ctx.beginPath();
      let started = false;
      for (let lon = -180; lon <= 180; lon += 5) {
        const pt = projectPoint(lat, lon, rotationAngle, cx, cy, radius);
        if (pt.isVisible) {
          if (!started) {
            ctx.moveTo(pt.x, pt.y);
            started = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    });

    // 4. Longitude Meridians (Graticule)
    [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180].forEach(lon => {
      ctx.beginPath();
      let started = false;
      for (let lat = -80; lat <= 80; lat += 5) {
        const pt = projectPoint(lat, lon, rotationAngle, cx, cy, radius);
        if (pt.isVisible) {
          if (!started) {
            ctx.moveTo(pt.x, pt.y);
            started = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // 5. Realistic Continent Landmasses
    CONTINENT_POLYGONS.forEach(polygon => {
      ctx.beginPath();
      let hasVisible = false;
      polygon.forEach(([lat, lon], idx) => {
        const pt = projectPoint(lat, lon, rotationAngle, cx, cy, radius);
        if (pt.isVisible) hasVisible = true;
        if (idx === 0) {
          ctx.moveTo(pt.x, pt.y);
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      });
      ctx.closePath();

      if (hasVisible) {
        // High-contrast tactical emerald landmass
        ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    });

    // 6. Geodesic Flight Arcs between Strategic Operational Bases
    const bilbaoPt = projectPoint(43.33, -2.99, rotationAngle, cx, cy, radius);
    const kielPt = projectPoint(54.32, 10.12, rotationAngle, cx, cy, radius);
    const santiagoPt = projectPoint(-33.45, -70.67, rotationAngle, cx, cy, radius);

    // Arc Bilbao -> Kiel
    if (bilbaoPt.isVisible && kielPt.isVisible) {
      ctx.beginPath();
      ctx.moveTo(bilbaoPt.x, bilbaoPt.y);
      const midX = (bilbaoPt.x + kielPt.x) / 2 - 12;
      const midY = (bilbaoPt.y + kielPt.y) / 2 - 18;
      ctx.quadraticCurveTo(midX, midY, kielPt.x, kielPt.y);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Arc Santiago -> Bilbao
    if (santiagoPt.isVisible && bilbaoPt.isVisible) {
      ctx.beginPath();
      ctx.moveTo(santiagoPt.x, santiagoPt.y);
      const midX = (santiagoPt.x + bilbaoPt.x) / 2 + 25;
      const midY = (santiagoPt.y + bilbaoPt.y) / 2 - 25;
      ctx.quadraticCurveTo(midX, midY, bilbaoPt.x, bilbaoPt.y);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 7. Render All Attractive Offer Targets as Tactical Blips
    ATTRACTIVE_OFFERS.forEach((target, idx) => {
      const pt = projectPoint(target.lat, target.lon, rotationAngle, cx, cy, radius);
      if (!pt.isVisible) return;

      const isCurrent = idx === activeOfferIndex;

      // Concentric pulsing sonar rings on current active target
      if (isCurrent) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 14, 0, Math.PI * 2);
        ctx.strokeStyle = target.color;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Tactical Crosshair
        ctx.strokeStyle = target.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pt.x - 18, pt.y);
        ctx.lineTo(pt.x + 18, pt.y);
        ctx.moveTo(pt.x, pt.y - 18);
        ctx.lineTo(pt.x, pt.y + 18);
        ctx.stroke();

        // High glow pulse
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 6.5, 0, Math.PI * 2);
        ctx.fillStyle = target.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        // Subtle blip for other targets
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = target.color;
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    ctx.restore();

    // 8. Outer Tactical Reticle Frame & Border
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Cardinal notches
    const notchLen = 8;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    // North
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius - notchLen);
    ctx.lineTo(cx, cy - radius);
    ctx.stroke();
    // South
    ctx.beginPath();
    ctx.moveTo(cx, cy + radius);
    ctx.lineTo(cx, cy + radius + notchLen);
    ctx.stroke();
    // West
    ctx.beginPath();
    ctx.moveTo(cx - radius - notchLen, cy);
    ctx.lineTo(cx - radius, cy);
    ctx.stroke();
    // East
    ctx.beginPath();
    ctx.moveTo(cx + radius, cy);
    ctx.lineTo(cx + radius + notchLen, cy);
    ctx.stroke();
  }, [rotationAngle, activeOfferIndex, projectPoint]);

  // Mouse / Touch drag handling to manually spin the globe
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, angle: rotationAngle };
    setIsAutoRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    setRotationAngle(dragStartRef.current.angle + deltaX * 0.5);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleSelectOffer = (idx: number) => {
    setActiveOfferIndex(idx);
    setIsAutoRotating(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-br from-[#070d18] via-[#0a1426] to-[#040810] p-5 shadow-2xl text-slate-100 font-mono">
      
      {/* Top HUD Banner */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-red-950/80 border border-red-500/50 text-red-400 font-mono text-[10px] font-black tracking-wider uppercase shadow-xs">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span>GEO-RADAR 3D // OFERTAS DESTACADAS</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            ESFERA ORTOGRÁFICA • ROTACIÓN DINÁMICA
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span className="text-slate-400 font-mono">
            OBJETIVO: <strong className="text-emerald-400">{activeOffer.city}</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-sky-400 font-mono flex items-center gap-1">
            <Satellite className="h-3 w-3 text-sky-400 animate-pulse" />
            COORD: <strong className="text-white">{activeOffer.coordsText}</strong>
          </span>
        </div>
      </div>

      {/* Main Grid: Realistic 3D Globe Canvas + Telemetry Offer Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4 items-center">
        
        {/* Left Column: 3D Interactive Rotating Canvas Globe */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center p-1 select-none">
          <div className="relative cursor-grab active:cursor-grabbing">
            <canvas
              ref={canvasRef}
              width={340}
              height={320}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full max-w-[340px] h-auto drop-shadow-[0_0_30px_rgba(14,165,233,0.3)] transition"
              title="Arrastra con el ratón para rotar el planeta libremente"
            />

            {/* Latitude/Longitude Badge */}
            <div className="absolute top-2 left-2 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-md text-[9px] font-mono text-slate-300 pointer-events-none backdrop-blur-xs">
              ROTACIÓN: <span className="text-emerald-400 font-bold">{Math.round(rotationAngle)}° LON</span>
            </div>

            {/* Drag hint overlay */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 border border-slate-700/80 px-2 py-0.5 rounded text-[8.5px] font-mono text-slate-400 pointer-events-none backdrop-blur-xs">
              Arrastra para rotar el globo • Gira hacia ofertas
            </div>
          </div>

          {/* Globe Rotation Controls */}
          <div className="flex items-center gap-2 mt-3 w-full justify-center">
            <button
              onClick={() => {
                setActiveOfferIndex((activeOfferIndex - 1 + ATTRACTIVE_OFFERS.length) % ATTRACTIVE_OFFERS.length);
                setIsAutoRotating(false);
              }}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition cursor-pointer"
              title="Oferta anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                isAutoRotating
                  ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Alternar rotación automática"
            >
              {isAutoRotating ? (
                <>
                  <Pause className="h-3 w-3 text-emerald-400" />
                  <span>PAUSAR ROTACIÓN</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 text-sky-400" />
                  <span>ACTIVAR ROTACIÓN</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setActiveOfferIndex((activeOfferIndex + 1) % ATTRACTIVE_OFFERS.length);
                setIsAutoRotating(false);
              }}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition cursor-pointer"
              title="Siguiente oferta"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Active Attractive Offer Telemetry Dossier */}
        <div className="lg:col-span-6 space-y-3">
          
          {/* Quick Offer Selector Pills */}
          <div className="flex flex-wrap gap-1.5 pb-1">
            {ATTRACTIVE_OFFERS.map((target, idx) => (
              <button
                key={target.id}
                onClick={() => handleSelectOffer(idx)}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition flex items-center gap-1 cursor-pointer border ${
                  activeOfferIndex === idx
                    ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow'
                    : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
                title={`Rotar hacia ${target.city}`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: target.color }} />
                <span>{target.city.split(' ')[0]}</span>
                <span className="text-[9px] opacity-80">{target.matchScore}%</span>
              </button>
            ))}
          </div>

          {/* Active Offer Card */}
          <div className="p-4 rounded-xl border border-slate-700/80 bg-slate-900/90 space-y-3 shadow-lg relative">
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{activeOffer.city} • {activeOffer.country}</span>
                </div>
                <h3 className="text-base font-black text-white font-sans mt-0.5 tracking-tight">
                  {activeOffer.role}
                </h3>
                <div className="text-xs font-mono font-bold text-sky-400 flex items-center gap-1 mt-0.5">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{activeOffer.name}</span>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="px-2.5 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/60 font-black text-xs font-mono shrink-0 shadow">
                {activeOffer.matchScore}% AFINIDAD
              </div>
            </div>

            {/* Strategic Attributes Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">MARCO LEGAL & VISADO</span>
                <span className="text-[11px] text-emerald-400 font-bold">{activeOffer.framework}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">RETRIBUCIÓN ESTIMADA</span>
                <span className="text-[11px] text-amber-300 font-bold">{activeOffer.salary}</span>
              </div>
            </div>

            {/* Requirements / Tags */}
            <div className="space-y-1">
              <div className="text-[9px] font-mono text-slate-400 font-bold uppercase">COMPETENCIAS DEMANDADAS:</div>
              <div className="flex flex-wrap gap-1">
                {activeOffer.requirements.map(req => (
                  <span key={req} className="px-2 py-0.5 rounded bg-black/60 border border-slate-700 text-[10px] font-mono text-slate-200">
                    {req}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {onDeploySector && (
              <div className="pt-1 flex items-center gap-2">
                <button
                  onClick={() => onDeploySector(activeOffer.sectorKey)}
                  className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition uppercase tracking-wider cursor-pointer"
                >
                  <Crosshair className="h-3.5 w-3.5" />
                  <span>Explorar en Radar Táctico</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
