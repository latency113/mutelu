'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  speed: number;
  color: string;
}

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    // Initialize starry constellation
    const starColors = ['#fef08a', '#e9d5ff', '#c084fc', '#ffffff', '#fed7aa'];
    const starCount = Math.floor((width * height) / 4500);
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.6,
      baseAlpha: Math.random() * 0.7 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Draw faint mystical nebulae
      const gradient1 = ctx.createRadialGradient(
        width * 0.25 + Math.sin(time * 0.3) * 50,
        height * 0.35 + Math.cos(time * 0.2) * 40,
        10,
        width * 0.25,
        height * 0.35,
        width * 0.5
      );
      gradient1.addColorStop(0, 'rgba(109, 40, 217, 0.15)');
      gradient1.addColorStop(0.5, 'rgba(88, 28, 135, 0.08)');
      gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, width, height);

      const gradient2 = ctx.createRadialGradient(
        width * 0.8 - Math.cos(time * 0.25) * 60,
        height * 0.65 - Math.sin(time * 0.35) * 50,
        20,
        width * 0.8,
        height * 0.65,
        width * 0.45
      );
      gradient2.addColorStop(0, 'rgba(217, 119, 6, 0.12)');
      gradient2.addColorStop(0.6, 'rgba(147, 51, 234, 0.06)');
      gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      for (const star of stars) {
        star.alpha += star.speed;
        const currentAlpha =
          star.baseAlpha * (0.6 + 0.4 * Math.sin(star.alpha));

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
        ctx.fillStyle = star.color;
        ctx.shadowBlur = star.size > 1.4 ? 6 : 2;
        ctx.shadowColor = star.color;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Base deep cosmic gradient */}
      <div className="absolute inset-0 bg-radial from-[#1e0e3e]/40 via-[#0d061f] to-[#06020c]" />

      {/* Dynamic Star Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {/* Sacred geometry subtle grid lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(245,158,11,0.08),transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-purple-950/20 to-transparent" />
    </div>
  );
}
