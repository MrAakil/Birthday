"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { birthdayConfig } from "@/config/birthday";
import { useAudio } from "./AudioController";
import { Sparkles, Star } from "lucide-react";

interface StepLoadingProps {
  onComplete: () => void;
}

export default function StepLoading({ onComplete }: StepLoadingProps) {
  const { playSFX } = useAudio();
  const [progress, setProgress] = useState(0);
  const [messageIdx, setMessageIdx] = useState(0);
  const messages = birthdayConfig.loadingMessages;

  // Track floating elements
  const [balloons, setBalloons] = useState<{ id: number; x: number; delay: number; color: string; scale: number }[]>([]);

  useEffect(() => {
    // Generate random balloons for floating animation
    const tempBalloons = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80, // % width
      delay: Math.random() * 4, // seconds delay
      color: birthdayConfig.theme.confettiColors[i % birthdayConfig.theme.confettiColors.length],
      scale: 0.6 + Math.random() * 0.8
    }));
    setBalloons(tempBalloons);

    // Start loading transition

    // Progress bar ticker
    const duration = 6000; // 6 seconds loading
    const intervalTime = 50;
    const increment = (100 / duration) * intervalTime;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Update messages based on progress percentage
  useEffect(() => {
    const chunk = 100 / messages.length;
    const currentChunkIdx = Math.floor(progress / chunk);
    if (currentChunkIdx < messages.length && currentChunkIdx !== messageIdx) {
      setMessageIdx(currentChunkIdx);
    }

    if (progress >= 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, messageIdx, messages.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 relative z-10 overflow-hidden">
      {/* Floating balloons */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {balloons.map((balloon) => (
          <motion.div
            key={balloon.id}
            initial={{ y: "110vh", x: `${balloon.x}vw`, opacity: 0 }}
            animate={{
              y: "-15vh",
              opacity: [0, 0.7, 0.7, 0],
              x: [`${balloon.x}vw`, `${balloon.x + (Math.random() * 10 - 5)}vw`]
            }}
            transition={{
              duration: 6,
              delay: balloon.delay,
              ease: "easeOut",
              repeat: Infinity
            }}
            className="absolute"
            style={{ scale: balloon.scale }}
          >
            {/* Balloon SVG shape */}
            <svg
              width="50"
              height="65"
              viewBox="0 0 50 65"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-lg"
            >
              <ellipse cx="25" cy="27" rx="20" ry="25" fill={balloon.color} fillOpacity="0.8" />
              {/* String */}
              <path d="M25 52C25 55 23 58 25 62" stroke="white" strokeWidth="1" strokeLinecap="round" />
              {/* Knot */}
              <path d="M22 52L28 52L25 48L22 52Z" fill={balloon.color} />
            </svg>
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-lg">
        {/* Loading messages transition */}
        <div className="h-16 flex items-center justify-center mb-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIdx}
              initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
              transition={{ duration: 0.4 }}
              className="text-xl md:text-2xl font-light text-slate-200 tracking-wide flex items-center gap-2"
            >
              <span>{messages[Math.min(messageIdx, messages.length - 1)]}</span>
              <Sparkles className="w-5 h-5 text-purple-400 animate-spin" />
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Glassmorphic progress bar container */}
        <div className="w-full h-2.5 bg-white/5 border border-white/10 rounded-full overflow-hidden p-[2px] backdrop-blur-md shadow-inner">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
            className={`h-full rounded-full bg-gradient-to-r ${birthdayConfig.theme.primaryColor} shadow-[0_0_15px_rgba(168,85,247,0.8)]`}
          />
        </div>

        {/* Subtitle percentage */}
        <motion.span
          className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mt-4"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          PREPARING THE SURPRISE • {Math.round(progress)}%
        </motion.span>
      </div>
    </div>
  );
}
