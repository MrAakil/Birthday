"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { birthdayConfig } from "@/config/birthday";
import { useAudio } from "./AudioController";
import confetti from "canvas-confetti";
import { HelpCircle, Sparkles } from "lucide-react";

interface StepOccasionProps {
  onComplete: () => void;
}

export default function StepOccasion({ onComplete }: StepOccasionProps) {
  const { playSFX } = useAudio();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSelect = (option: string, idx: number) => {
    setSelectedIdx(idx);
    
    if (option === birthdayConfig.correctOccasion) {
      setIsError(false);
      setIsSuccess(true);
      playSFX("confetti");
      
      // Fire confetti bursts!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: birthdayConfig.theme.confettiColors,
      });

      // Quick delay to enjoy the confetti before moving on
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      setIsSuccess(false);
      setIsError(true);
      playSFX("click");
      
      // Reset shake animation after it plays
      setTimeout(() => {
        setIsError(false);
      }, 600);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative z-10">
      <motion.div
        animate={isError ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />

          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
            {isSuccess ? (
              <Sparkles className="w-8 h-8 text-yellow-400 animate-spin" />
            ) : (
              <HelpCircle className="w-8 h-8 text-purple-400 animate-pulse" />
            )}
          </div>

          <span className="text-purple-400 text-xs font-semibold uppercase tracking-widest block mb-3">
            Guess the Occasion
          </span>
          <h2 className="text-2xl md:text-3xl font-light text-slate-100 mb-8 leading-snug">
            Why did we gather here today?
          </h2>

          <div className="flex flex-col gap-3">
            {birthdayConfig.occasionOptions.map((option, idx) => {
              const isCorrect = option === birthdayConfig.correctOccasion;
              const isSelected = selectedIdx === idx;
              
              let btnClass = "bg-white/5 border-white/5 hover:border-white/20 text-slate-300";
              if (isSelected) {
                if (isSuccess && isCorrect) {
                  btnClass = "bg-green-500/20 border-green-500/50 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
                } else if (isError && !isCorrect) {
                  btnClass = "bg-red-500/20 border-red-500/50 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isSuccess}
                  onClick={() => handleSelect(option, idx)}
                  className={`w-full py-4 px-6 text-center rounded-2xl hover:bg-white/10 border transition-all duration-300 text-base md:text-lg font-light cursor-pointer ${btnClass}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {isError && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 font-light mt-6 text-sm"
            >
              Hmm, that doesn&apos;t seem quite right... Try again! 🤔
            </motion.p>
          )}

          {isSuccess && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-green-400 font-light mt-6 text-sm flex items-center justify-center gap-1.5"
            >
              Bingo! Let the celebration prepare! 🎉✨
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
