"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAudio } from "./AudioController";
import { Sparkles } from "lucide-react";

interface StepIntroProps {
  onComplete: () => void;
}

export default function StepIntro({ onComplete }: StepIntroProps) {
  const { playMusic, playSFX } = useAudio();
  const [textStage, setTextStage] = useState(0);

  const introTexts = [
    "Hello...",
    "Someone who cares about you very much...",
    "Has prepared a special digital gift for you.",
    "Are you ready to begin this journey?"
  ];

  useEffect(() => {
    if (textStage < introTexts.length - 1) {
      const timer = setTimeout(() => {
        setTextStage((prev) => prev + 1);
      }, 3500); // Progress text automatically
      return () => clearTimeout(timer);
    }
  }, [textStage]);

  const handleStart = () => {
    playSFX("click");
    playMusic();
    onComplete();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 relative z-10">
      <div className="max-w-2xl min-h-[200px] flex flex-col justify-center">
        {introTexts.map((text, idx) => (
          idx <= textStage && (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`text-slate-200 ${
                idx === introTexts.length - 1
                  ? "text-xl md:text-2xl font-light text-purple-200 tracking-wide mt-6"
                  : "text-lg md:text-xl font-extralight tracking-wider mb-3 text-slate-400"
              }`}
            >
              {text}
            </motion.p>
          )
        ))}
      </div>

      {textStage === introTexts.length - 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-12"
        >
          <button
            onClick={handleStart}
            className="group relative px-8 py-3.5 rounded-full text-white font-medium tracking-widest text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] cursor-pointer flex items-center gap-2 overflow-hidden border border-purple-500/30"
          >
            {/* Magnetic/Glow Hover Effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
            
            <span>START THE JOURNEY</span>
            <Sparkles className="w-4 h-4 text-purple-200 animate-pulse group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
