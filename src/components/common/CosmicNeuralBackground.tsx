import React, { useEffect, useRef, useState } from 'react';
import type { AppTheme } from '../../services/themeManager';
import { resolveAsset } from '../../utils/assets';

interface CosmicNeuralBackgroundProps {
  theme: AppTheme;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  pulseSpeed: number;
  pulsePhase: number;
  color: string;
  energy: number;
}

export const CosmicNeuralBackground: React.FC<CosmicNeuralBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imgSrc, setImgSrc] = useState<string>(() => resolveAsset('backgrounds/cosmic-neural-bg.jpg'));

  // Subtle biological synapse & cosmic web canvas simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Number of synaptic nodes adapted to screen size
    const particleCount = Math.min(48, Math.floor((width * height) / 35000));
    const particles: Particle[] = [];

    const isLight = theme === 'arctic';
    const palette = isLight
      ? ['#0284c7', '#0d9488', '#059669', '#3b82f6', '#6366f1']
      : ['#38bdf8', '#2dd4bf', '#34d399', '#818cf8', '#f59e0b'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        radius: Math.random() * 2 + 1.2,
        baseRadius: Math.random() * 2 + 1.2,
        pulseSpeed: Math.random() * 0.025 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        color: palette[Math.floor(Math.random() * palette.length)],
        energy: Math.random() * 0.6 + 0.4
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const maxDist = Math.min(180, width * 0.16);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse easing
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Update and draw particles (somas)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries smoothly
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Pulsing breathing effect
        p.pulsePhase += p.pulseSpeed;
        const currentRadius = p.baseRadius + Math.sin(p.pulsePhase) * 0.8;

        // Subtle attraction to mouse cursor (headmaster attention)
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 220) {
          const force = (1 - distToMouse / 220) * 0.012;
          p.x += dx * force;
          p.y += dy * force;
        }

        // Draw neuron / star soma with subtle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = isLight ? 4 : 10;
        ctx.globalAlpha = isLight ? 0.35 : 0.65;
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      // Draw neural filaments / cosmic synaptic axons between nearby nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (isLight ? 0.12 : 0.22);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p1.color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = (1 - dist / maxDist) * 1.2;
            ctx.stroke();

            // Occasional synaptic action potential (flowing pulse along axon)
            if (Math.sin(p1.pulsePhase + p2.pulsePhase) > 0.94) {
              const t = (Math.sin(p1.pulsePhase * 3) + 1) / 2;
              const pulseX = p1.x + (p2.x - p1.x) * t;
              const pulseY = p1.y + (p2.y - p1.y) * t;

              ctx.beginPath();
              ctx.arc(pulseX, pulseY, 1.2, 0, Math.PI * 2);
              ctx.fillStyle = '#ffffff';
              ctx.globalAlpha = isLight ? 0.4 : 0.8;
              ctx.fill();
            }
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  const isLight = theme === 'arctic';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-700">
      {/* 1. Base Cosmic Neural Wallpaper Image (Universe meets Neurons - Gemini AI generation) */}
      <img
        src={imgSrc}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover object-center select-none transition-opacity duration-1000 ${
          isLight 
            ? 'opacity-40 filter contrast-125 brightness-110 saturate-85' 
            : 'opacity-85 filter brightness-105 contrast-125'
        }`}
        onError={() => {
          if (imgSrc.endsWith('.jpg')) {
            setImgSrc(resolveAsset('backgrounds/cosmic-neural-bg.png'));
          }
        }}
      />

      {/* 2. Soft Atmospheric Vignette (Protects legibility of text while letting stars & filaments shine brilliantly) */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
          isLight
            ? 'bg-gradient-to-b from-slate-100/60 via-transparent to-slate-200/75'
            : 'bg-gradient-to-b from-[#060a14]/65 via-[#040711]/30 to-[#020409]/75'
        }`}
        style={{
          boxShadow: isLight
            ? 'inset 0 0 120px rgba(241, 245, 249, 0.7)'
            : 'inset 0 0 160px rgba(3, 7, 18, 0.85)'
        }}
      />

      {/* 3. Radial Nebula Glow Points */}
      <div 
        className="absolute inset-0 opacity-45 mix-blend-screen pointer-events-none"
        style={{
          background: isLight
            ? 'radial-gradient(circle at 15% 25%, rgba(2, 132, 199, 0.15) 0%, transparent 45%), radial-gradient(circle at 85% 75%, rgba(13, 148, 136, 0.15) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.22) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(45, 212, 191, 0.18) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.12) 0%, transparent 60%)'
        }}
      />

      {/* 4. Interactive Living Synaptic Filament Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
};
