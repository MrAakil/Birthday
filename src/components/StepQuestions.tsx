"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { birthdayConfig } from "@/config/birthday";
import { useAudio } from "./AudioController";
import { ChevronRight } from "lucide-react";

interface StepQuestionsProps {
  onComplete: () => void;
}

export default function StepQuestions({ onComplete }: StepQuestionsProps) {
  const { playSFX } = useAudio();
  const [currentIdx, setCurrentIdx] = useState(0);
  const questions = birthdayConfig.questions;
  const currentQuestion = questions[currentIdx];

  const handleSelectOption = (option: string) => {
    playSFX("click");
    
    // Store in localStorage for later personalization
    localStorage.setItem(`birthday_pref_${currentQuestion.id}`, option);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative z-10">
      {/* Progress tracker */}
      <div className="absolute top-8 left-0 right-0 flex justify-center gap-2 px-6">
        {questions.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === currentIdx
                ? "w-8 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                : idx < currentIdx
                ? "w-3 bg-purple-800"
                : "w-3 bg-slate-800"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 50, filter: "blur(5px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -50, filter: "blur(5px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full max-w-lg"
        >
          {/* Question card with glassmorphism */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

            <span className="text-purple-400 text-xs font-semibold uppercase tracking-widest block mb-4">
              Preference {currentIdx + 1} of {questions.length}
            </span>
            
            <h2 className="text-2xl md:text-3xl font-light text-slate-100 mb-8 leading-snug">
              {currentQuestion.question}
            </h2>

            <div className="flex flex-col gap-3.5">
              {currentQuestion.options.map((option, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(option)}
                  className="group w-full py-4 px-6 text-left rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300 text-slate-300 hover:text-white text-base md:text-lg font-light cursor-pointer flex items-center justify-between"
                >
                  <span>{option}</span>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
