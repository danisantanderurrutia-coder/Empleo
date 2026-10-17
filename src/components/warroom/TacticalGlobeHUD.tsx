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

// Natural terrestrial continent boundary polygons with biome types
interface ContinentPolygon {
  biome: 'forest' | 'desert' | 'ice' | 'mountain';
  coords: [number, number][];
}

const REALISTIC_CONTINENTS: ContinentPolygon[] = [
  // Western & Central Europe (Temperate Forest)
  {
    biome: 'forest',
    coords: [
      [36, -5.5], [37, -9], [39, -9.5], [42, -8.9], [43.5, -9.3], [43.5, -2], [45, -1.2],
      [47, -3], [48.6, -4.7], [49.5, -1.5], [51, 1.8], [52, 4.3], [53.5, 7.5], [54.3, 10.1],
      [57.5, 10.5], [55, 13], [54.5, 18.5], [57, 24], [60, 30], [55, 30], [50, 24],
      [45, 29], [42, 28], [40, 24], [38, 23.7], [37, 21.8], [39, 20], [42, 19],
      [45.4, 12.3], [44, 8.5], [43.3, 5.4], [43, 3], [36.5, -3], [36, -5.5]
    ]
  },
  // British Isles & Ireland (Forest)
  {
    biome: 'forest',
    coords: [
      [50.2, -5.3], [51.5, -4.5], [53, -4.3], [55, -5.5], [58.5, -5], [58.5, -3],
      [56, -2.5], [54, -0.5], [51.5, 1.3], [50.8, -0.5], [50.2, -5.3]
    ]
  },
  {
    biome: 'forest',
    coords: [
      [51.5, -9.9], [53.5, -10], [55.2, -7.5], [54.5, -5.5], [52.2, -6.3], [51.5, -9.9]
    ]
  },
  // Scandinavia (Forest)
  {
    biome: 'forest',
    coords: [
      [55.4, 13], [56.2, 16], [59.3, 18.1], [63.5, 20.5], [65.5, 22.5], [68, 28],
      [71.2, 25.8], [70, 18], [68, 14], [64, 10], [60.4, 5.3], [58, 6], [59, 10.5], [55.4, 13]
    ]
  },
  // Greenland (Ice Sheet)
  {
    biome: 'ice',
    coords: [
      [59.8, -43.9], [64.2, -51.7], [69, -53], [76.5, -68.7], [82, -30], [76, -18],
      [70, -22], [65, -36], [59.8, -43.9]
    ]
  },
  // North Africa (Sahara Desert)
  {
    biome: 'desert',
    coords: [
      [35.8, -5.8], [33.6, -7.6], [28, -13], [24, -15], [17, -16.5], [14, -17],
      [14, 10], [15, 24], [22, 38], [28, 34], [31.2, 29.9], [32.9, 13.2],
      [37, 10], [36.8, 3], [35.8, -5.8]
    ]
  },
  // Sub-Saharan Africa (Tropical Forest & Savanna)
  {
    biome: 'forest',
    coords: [
      [14, -17], [10, -14], [5, -8], [4, 7], [4, 9], [0, 9], [-9, 13],
      [-17, 12], [-22, 14.5], [-34, 18.5], [-34, 25.6], [-29.8, 31], [-19, 35],
      [-10, 40], [-4, 39.6], [11.8, 51.2], [14, 43], [15, 24], [14, 10], [14, -17]
    ]
  },
  // Madagascar (Forest)
  {
    biome: 'forest',
    coords: [
      [-12, 49.3], [-16, 49.7], [-25, 47], [-25.5, 45], [-16, 44], [-12, 49.3]
    ]
  },
  // Middle East & Arabia (Desert)
  {
    biome: 'desert',
    coords: [
      [31, 34], [28, 34], [22, 38], [12.8, 45], [17, 54], [23.6, 58.5],
      [25.3, 55.3], [30, 48], [36, 42], [37, 36], [31, 34]
    ]
  },
  // Eurasia / Siberia / Asia (Forest)
  {
    biome: 'forest',
    coords: [
      [42, 29], [45, 37], [50, 45], [55, 60], [67, 70], [72, 80], [73, 120],
      [70, 160], [65, 175], [60, 163], [53, 142], [43, 132], [37, 126], [31, 122],
      [22, 114], [10, 105], [1, 104], [16, 96], [22, 90], [21, 70], [25, 62],
      [30, 48], [36, 42], [42, 29]
    ]
  },
  // South America (Forest & Andes)
  {
    biome: 'forest',
    coords: [
      [11, -72], [9, -77], [5, -53], [-1.4, -48.5], [-3.7, -38.5], [-8, -34.8],
      [-13, -38.5], [-22.9, -43.2], [-23.9, -46.3], [-34.6, -58.4], [-38, -57.5],
      [-45.8, -67.5], [-54.8, -68.3], [-55.9, -67.3], [-50, -75], [-41.5, -73],
      [-36.8, -73.1], [-33.45, -70.7], [-23.6, -70.4], [-18.5, -70.3], [-12, -77],
      [-2.2, -79.9], [4, -77.3], [8.5, -79], [11, -72]
  ]
  },
  // North America (Forest)
  {
    biome: 'forest',
    coords: [
      [8.5, -79], [16.8, -99.9], [28, -114], [34, -118.2], [37.8, -122.4], [48, -123],
      [60, -145], [65, -168], [70, -120], [60, -85], [48, -55], [44.6, -63.6],
      [40.7, -74], [35.2, -75.5], [25.8, -80.2], [29.7, -95.3], [21, -89], [15, -88], [8.5, -79]
  ]
  },
  // Australia (Desert center & Forest coasts)
  {
    biome: 'desert',
    coords: [
      [-12.4, 130.8], [-15, 136], [-16.9, 145.7], [-27.5, 153], [-33.8, 151.2],
      [-37.8, 145], [-34.9, 138.6], [-31.9, 115.8], [-22, 114], [-12.4, 130.8]
    ]
  }
];

export const TacticalGlobeHUD: React.FC<TacticalGlobeHUDProps> = ({ onDeploySector }) => {
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(-5); // Longitude center
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; angle: number }>({ x: 0, angle: 0 });

  const activeOffer = ATTRACTIVE_OFFERS[activeOfferIndex];
  const targetLon = activeOffer ? activeOffer.lon : 0;

  // Auto-cycle through attractive offers every 7 seconds
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setActiveOfferIndex(prev => (prev + 1) % ATTRACTIVE_OFFERS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Smooth rotation interpolation towards active target longitude
  useEffect(() => {
    let active = true;
    const step = () => {
      if (!isDraggingRef.current) {
        setRotationAngle(currentAngle => {
          let diff = targetLon - currentAngle;
          while (diff < -180) diff += 360;
          while (diff > 180) diff -= 360;

          if (Math.abs(diff) > 0.08) {
            return currentAngle + diff * 0.05;
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

  // Closed-form 3D Orthographic Projection for true spherical realism
  const projectPoint = useCallback((lat: number, lon: number, centerLon: number, cx: number, cy: number, r: number) => {
    const phi0 = (20 * Math.PI) / 180; // 20 deg North tilt
    const phi = (lat * Math.PI) / 180;
    const lam = (lon * Math.PI) / 180;
    const lam0 = (centerLon * Math.PI) / 180;

    const cosC = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lam - lam0);
    const isVisible = cosC >= -0.08;

    const x = cx + r * Math.cos(phi) * Math.sin(lam - lam0);
    const y = cy - r * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lam - lam0));

    return { x, y, isVisible, cosC };
  }, []);

  // Main Canvas Render: Natural Photorealistic Earth Globe
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.43;

    ctx.clearRect(0, 0, width, height);

    // 1. Natural Physical Shadow under the Globe (resting on the light card)
    const baseShadow = ctx.createRadialGradient(cx, cy + radius * 0.98, radius * 0.2, cx, cy + radius * 0.98, radius * 1.05);
    baseShadow.addColorStop(0, 'rgba(15, 23, 42, 0.28)');
    baseShadow.addColorStop(0.5, 'rgba(15, 23, 42, 0.12)');
    baseShadow.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = baseShadow;
    ctx.beginPath();
    ctx.ellipse(cx, cy + radius * 0.98, radius * 0.95, radius * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Atmospheric Sky Glow Aura
    const atmoGlow = ctx.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.18);
    atmoGlow.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
    atmoGlow.addColorStop(0.6, 'rgba(14, 165, 233, 0.12)');
    atmoGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = atmoGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.18, 0, Math.PI * 2);
    ctx.fill();

    // 3. Globe Sphere with Deep Ocean Texture and Natural Lighting
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    // Realistic Ocean Sapphire Gradient (Sunlight reflection from upper left)
    const oceanGrad = ctx.createRadialGradient(cx - radius * 0.38, cy - radius * 0.38, radius * 0.12, cx, cy, radius * 1.1);
    oceanGrad.addColorStop(0, '#1d63c6'); // Sunlight on water
    oceanGrad.addColorStop(0.35, '#164e9c');
    oceanGrad.addColorStop(0.7, '#0f366e');
    oceanGrad.addColorStop(0.95, '#0a2347');
    oceanGrad.addColorStop(1, '#06162d'); // Shaded limb
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    // 4. Subtle Latitude & Longitude Graticule Lines (Delicate, realistic)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 0.8;

    [-60, -30, 0, 30, 60].forEach(lat => {
      ctx.beginPath();
      let started = false;
      for (let lon = -180; lon <= 180; lon += 6) {
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

    [-120, -60, 0, 60, 120, 180].forEach(lon => {
      ctx.beginPath();
      let started = false;
      for (let lat = -80; lat <= 80; lat += 6) {
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

    // 5. Realistic Continents with Coastal Shelf Halos & Biome Colors
    REALISTIC_CONTINENTS.forEach(continent => {
      // Step A: Coastal water shelf (turquoise shallow sea around landmass)
      ctx.beginPath();
      let hasVisible = false;
      continent.coords.forEach(([lat, lon], idx) => {
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
        // Turquoise coastal shelf
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.35)';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Biome terrestrial fills
        if (continent.biome === 'forest') {
          ctx.fillStyle = '#2d6a3f';
          ctx.fill();
          ctx.strokeStyle = '#225230';
        } else if (continent.biome === 'desert') {
          ctx.fillStyle = '#c59d5f';
          ctx.fill();
          ctx.strokeStyle = '#99743c';
        } else if (continent.biome === 'ice') {
          ctx.fillStyle = '#eef3f7';
          ctx.fill();
          ctx.strokeStyle = '#cbd5e1';
        } else {
          ctx.fillStyle = '#6b7280';
          ctx.fill();
          ctx.strokeStyle = '#4b5563';
        }
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // 6. Natural Curved Flight Routes between Primary Research Bases
    const bilbaoPt = projectPoint(43.33, -2.99, rotationAngle, cx, cy, radius);
    const kielPt = projectPoint(54.32, 10.12, rotationAngle, cx, cy, radius);
    const santiagoPt = projectPoint(-33.45, -70.67, rotationAngle, cx, cy, radius);

    // Route Bilbao <-> Kiel
    if (bilbaoPt.isVisible && kielPt.isVisible) {
      ctx.beginPath();
      ctx.moveTo(bilbaoPt.x, bilbaoPt.y);
      const midX = (bilbaoPt.x + kielPt.x) / 2 - 10;
      const midY = (bilbaoPt.y + kielPt.y) / 2 - 16;
      ctx.quadraticCurveTo(midX, midY, kielPt.x, kielPt.y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Route Bilbao <-> Santiago
    if (santiagoPt.isVisible && bilbaoPt.isVisible) {
      ctx.beginPath();
      ctx.moveTo(santiagoPt.x, santiagoPt.y);
      const midX = (santiagoPt.x + bilbaoPt.x) / 2 + 20;
      const midY = (santiagoPt.y + bilbaoPt.y) / 2 - 20;
      ctx.quadraticCurveTo(midX, midY, bilbaoPt.x, bilbaoPt.y);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 7. Spherical Sunlight & Diffuse Shadow Overlay
    const sunShade = ctx.createRadialGradient(cx - radius * 0.45, cy - radius * 0.45, radius * 0.1, cx, cy, radius * 1.05);
    sunShade.addColorStop(0, 'rgba(255, 255, 255, 0.22)'); // Sun reflection
    sunShade.addColorStop(0.55, 'rgba(255, 255, 255, 0.02)');
    sunShade.addColorStop(0.85, 'rgba(2, 6, 23, 0.28)'); // Diffuse horizon shadow
    sunShade.addColorStop(1, 'rgba(2, 6, 23, 0.58)'); // Rim shadow
    ctx.fillStyle = sunShade;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    // 8. Authentic Map Markers (Pins) on Attractive Target Cities
    ATTRACTIVE_OFFERS.forEach((target, idx) => {
      const pt = projectPoint(target.lat, target.lon, rotationAngle, cx, cy, radius);
      if (!pt.isVisible) return;

      const isCurrent = idx === activeOfferIndex;

      if (isCurrent) {
        // Expanding soft radar ripple on active target
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fill();
        ctx.strokeStyle = target.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Realistic Location Pin (Teardrop Google Maps style)
        const pinY = pt.y - 12;
        ctx.beginPath();
        ctx.arc(pt.x, pinY, 7, 0, Math.PI * 2);
        ctx.fillStyle = target.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Inner white center
        ctx.beginPath();
        ctx.arc(pt.x, pinY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Pin stem
        ctx.beginPath();
        ctx.moveTo(pt.x - 3, pinY + 5);
        ctx.lineTo(pt.x, pt.y);
        ctx.lineTo(pt.x + 3, pinY + 5);
        ctx.fillStyle = target.color;
        ctx.fill();
      } else {
        // Subtle clean city dot
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = target.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    ctx.restore();

    // 9. Clean Physical Rim Frame (Delicate, polished)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
  }, [rotationAngle, activeOfferIndex, projectPoint]);

  // Drag handling to rotate the globe manually
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
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] p-5 sm:p-7 shadow-xl text-slate-800 dark:text-slate-100 font-sans transition-colors">
      
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
                EN VIVO
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rotación interactiva vinculada a vacantes científicas prioritarias (Bilbao • Kiel • Potsdam • París • Santiago).
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

      {/* Main Grid: Realistic Earth Globe + Clean Offer Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5 items-center">
        
        {/* Left Column: Realistic 3D Globe Canvas */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center select-none">
          <div className="relative cursor-grab active:cursor-grabbing p-1">
            <canvas
              ref={canvasRef}
              width={350}
              height={330}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full max-w-[350px] h-auto drop-shadow-2xl transition"
              title="Arrastra con el ratón para rotar el planeta libremente"
            />

            {/* Drag Hint Tooltip */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md px-3 py-1 rounded-full text-[10px] font-sans text-slate-600 dark:text-slate-300 pointer-events-none backdrop-blur-xs flex items-center gap-1.5 whitespace-nowrap">
              <span>🌍 Arrastra para girar la Tierra</span>
              <span className="text-slate-400">•</span>
              <span>Gira hacia ofertas</span>
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
