"use client";

import React, { useEffect, useRef } from "react";
import { birthdayConfig } from "@/config/birthday";

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  phase: number;
}

interface Firefly {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  vx: number;
  vy: number;
  alpha: number;
  phase: number;
  pulseSpeed: number;
}

export default function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize stars
    const stars: Star[] = [];
    const starCount = Math.floor((width * height) / 10000); // Responsive count
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        baseAlpha: Math.random() * 0.7 + 0.3,
        alpha: 0,
        twinkleSpeed: 0.01 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Initialize fireflies
    const fireflies: Firefly[] = [];
    const fireflyCount = Math.max(15, Math.floor((width * height) / 60000));
    for (let i = 0; i < fireflyCount; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1.5,
        baseRadius: Math.random() * 2 + 1.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.6 + 0.4,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background space sky
      // Creates a very deep indigo-black canvas gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, "#03000a");
      skyGrad.addColorStop(0.5, "#08011c");
      skyGrad.addColorStop(1, "#020005");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Twinkling Stars
      stars.forEach((star) => {
        star.phase += star.twinkleSpeed;
        star.alpha = star.baseAlpha + Math.sin(star.phase) * 0.3;
        if (star.alpha < 0.1) star.alpha = 0.1;
        if (star.alpha > 1) star.alpha = 1;

        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Glowing Fireflies
      fireflies.forEach((firefly) => {
        // Move
        firefly.x += firefly.vx;
        firefly.y += firefly.vy;
        firefly.phase += firefly.pulseSpeed;

        // Pulsing glow size
        firefly.radius = firefly.baseRadius + Math.sin(firefly.phase) * 0.8;

        // Mouse avoidance/attraction
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - firefly.x;
          const dy = mouseRef.current.y - firefly.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            // Push fireflies slightly away from the cursor
            const force = (150 - dist) / 150;
            firefly.vx -= (dx / dist) * force * 0.05;
            firefly.vy -= (dy / dist) * force * 0.05;
          }
        }

        // Add some random noise drift to movements
        firefly.vx += (Math.random() - 0.5) * 0.05;
        firefly.vy += (Math.random() - 0.5) * 0.05;

        // Speed limit
        const speed = Math.sqrt(firefly.vx * firefly.vx + firefly.vy * firefly.vy);
        if (speed > 1.2) {
          firefly.vx = (firefly.vx / speed) * 1.2;
          firefly.vy = (firefly.vy / speed) * 1.2;
        }

        // Boundary wrap
        if (firefly.x < -20) firefly.x = width + 20;
        if (firefly.x > width + 20) firefly.x = -20;
        if (firefly.y < -20) firefly.y = height + 20;
        if (firefly.y > height + 20) firefly.y = -20;

        // Draw firefly with radial gradient glow
        const glow = ctx.createRadialGradient(
          firefly.x,
          firefly.y,
          0,
          firefly.x,
          firefly.y,
          firefly.radius * 4
        );
        glow.addColorStop(0, `rgba(234, 179, 8, ${firefly.alpha})`); // Glow color: yellow-500
        glow.addColorStop(0.3, `rgba(234, 179, 8, ${firefly.alpha * 0.4})`);
        glow.addColorStop(1, "rgba(234, 179, 8, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, firefly.radius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw core
        ctx.fillStyle = `rgba(255, 255, 200, ${firefly.alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, firefly.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
      {/* Canvas for stars & fireflies */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Aurora Ambient Glowing Lights */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
        <div 
          className="absolute -top-1/4 -left-1/4 w-[80vw] h-[80vw] rounded-full blur-[120px] animate-pulse"
          style={{
            background: `radial-gradient(circle, ${birthdayConfig.theme.auroraColors[0]} 0%, transparent 70%)`,
            animationDuration: "12s"
          }}
        />
        <div 
          className="absolute -bottom-1/4 -right-1/4 w-[90vw] h-[90vw] rounded-full blur-[140px]"
          style={{
            background: `radial-gradient(circle, ${birthdayConfig.theme.auroraColors[1]} 0%, transparent 70%)`,
            animation: "pulse 18s infinite alternate"
          }}
        />
        <div 
          className="absolute top-1/3 right-1/4 w-[60vw] h-[60vw] rounded-full blur-[100px]"
          style={{
            background: `radial-gradient(circle, ${birthdayConfig.theme.auroraColors[2]} 0%, transparent 70%)`,
            animation: "pulse 15s infinite alternate-reverse"
          }}
        />
        <div 
          className="absolute bottom-1/3 left-1/3 w-[70vw] h-[70vw] rounded-full blur-[120px]"
          style={{
            background: `radial-gradient(circle, ${birthdayConfig.theme.auroraColors[3]} 0%, transparent 70%)`,
            animation: "pulse 22s infinite alternate"
          }}
        />
      </div>
    </div>
  );
}
