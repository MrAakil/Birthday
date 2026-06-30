"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioController";
import { birthdayConfig } from "@/config/birthday";
import { Star, RotateCcw, Heart, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface SectionFinalSceneProps {
  onReplay: () => void;
}

export default function SectionFinalScene({ onReplay }: SectionFinalSceneProps) {
  const { playSFX } = useAudio();
  const [activeStarId, setActiveStarId] = useState<number | null>(null);
  const [shootingStarActive, setShootingStarActive] = useState(false);
  const [revealHeading, setRevealHeading] = useState(false);

  // Trigger shooting star automatically on an interval
  useEffect(() => {
    const interval = setInterval(() => {
      setShootingStarActive(true);
      setTimeout(() => {
        setShootingStarActive(false);
      }, 1500);
    }, 7000);

    // Fade in final message after a slight delay
    const delayTimer = setTimeout(() => {
      setRevealHeading(true);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(delayTimer);
    };
  }, []);

  const handleStarClick = (starId: number) => {
    setActiveStarId(starId);
    playSFX("magic");

    // Trigger local shooting star
    setShootingStarActive(true);
    setTimeout(() => {
      setShootingStarActive(false);
    }, 1200);

    // Tiny sparkle pop around clicked star
    confetti({
      particleCount: 15,
      spread: 40,
      colors: birthdayConfig.theme.confettiColors,
      origin: {
        x: birthdayConfig.reasons.find((r) => r.id === starId)!.x / 100,
        y: 0.2 + (birthdayConfig.reasons.find((r) => r.id === starId)!.y / 100) * 0.6 // estimate vertical position
      }
    });
  };

  const handleReplayClick = () => {
    playSFX("click");
    playSFX("unlock");
    onReplay();
  };

  const activeStarText = birthdayConfig.reasons.find(
    (star) => star.id === activeStarId
  )?.text;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between py-24 bg-slate-950/60 px-6 overflow-hidden select-none">
      {/* 1. Nebula backdrop glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/15 to-slate-950 pointer-events-none -z-10" />

      {/* 2. Periodic/Triggered Shooting Star */}
      <AnimatePresence>
        {shootingStarActive && (
          <motion.div
            initial={{ x: "-10vw", y: "10vh", opacity: 0, scale: 0.5 }}
            animate={{ x: "110vw", y: "70vh", opacity: [0, 0.8, 0], scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-0 left-0 w-32 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_12px_#ffffff] rotate-[-25deg] pointer-events-none z-10"
          />
        )}
      </AnimatePresence>

      {/* Top Section: Heading */}
      <div className="text-center relative z-20 max-w-2xl mt-8">
        <AnimatePresence>
          {revealHeading && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <h2 className="text-xl md:text-2xl font-extralight tracking-widest text-slate-300 mb-4">
                &ldquo;Every star here represents one reason why you&apos;re special.&rdquo;
              </h2>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-400">
                Tap on any star to reveal
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Middle Section: The Interactive Star Constellation */}
      <div className="relative w-full max-w-4xl h-[400px] md:h-[450px] my-6 z-20">
        {birthdayConfig.reasons.map((star) => {
          const isActive = activeStarId === star.id;

          return (
            <div
              key={star.id}
              className="absolute"
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
            >
              <button
                onClick={() => handleStarClick(star.id)}
                className="relative group focus:outline-none cursor-pointer"
              >
                {/* Glow ring on hover/active */}
                <motion.div
                  animate={{
                    scale: isActive ? [1, 1.6, 1] : [1, 1.2, 1],
                    opacity: isActive ? [0.8, 0.2, 0.8] : [0.4, 0.8, 0.4]
                  }}
                  transition={{
                    duration: isActive ? 1.5 : 2 + Math.random() * 2,
                    repeat: Infinity
                  }}
                  className={`absolute -inset-3 rounded-full blur-sm pointer-events-none transition-all duration-300 ${
                    isActive ? "bg-purple-400" : "bg-purple-500/10 group-hover:bg-purple-400/20"
                  }`}
                />

                {/* Star icon */}
                <Star
                  className={`w-5 h-5 transition-all duration-500 ${
                    isActive
                      ? "text-yellow-300 fill-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)] scale-110"
                      : "text-purple-200 opacity-60 group-hover:opacity-100 group-hover:scale-105"
                  }`}
                />
              </button>
            </div>
          );
        })}

        {/* Center: Active Star Text Overlay Dialog */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {activeStarId && activeStarText && (
              <motion.div
                key={activeStarId}
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -15 }}
                className="pointer-events-auto bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-2xl py-4 px-6 max-w-sm text-center shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
              >
                <div className="flex justify-center gap-1.5 mb-2 text-pink-400">
                  <Heart className="w-4 h-4 fill-pink-400" />
                  <span className="text-xs uppercase font-semibold tracking-wider">Reason {activeStarId}</span>
                </div>
                <p className="text-slate-100 font-light text-sm md:text-base leading-relaxed">
                  {activeStarText}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Section: Sign off & Replay */}
      <div className="text-center relative z-20 flex flex-col items-center gap-10">
        <div>
          <motion.div
            animate={{ scale: [1, 1.05, 1], filter: ["blur(0px)", "blur(0.2px)", "blur(0px)"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-extralight tracking-widest text-white">
              Happy Birthday, {birthdayConfig.recipientName}
            </h1>
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          </motion.div>
          <span className="text-[10px] text-slate-500 font-semibold tracking-[0.4em] uppercase">
            created with love & wishes
          </span>
        </div>

        {/* Replay Button */}
        <button
          onClick={handleReplayClick}
          className="group relative px-6 py-3.5 rounded-full text-slate-400 hover:text-white font-medium tracking-widest text-xs border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.15)] active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-45 transition-transform" />
          <span>REPLAY EXPERIENCE</span>
        </button>
      </div>
    </div>
  );
}
