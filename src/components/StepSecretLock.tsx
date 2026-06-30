"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { birthdayConfig } from "@/config/birthday";
import { useAudio } from "./AudioController";
import { Lock, Unlock, KeyRound } from "lucide-react";

interface StepSecretLockProps {
  onComplete: () => void;
}

export default function StepSecretLock({ onComplete }: StepSecretLockProps) {
  const { playSFX } = useAudio();
  const [magicWordInput, setMagicWordInput] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!magicWordInput.trim()) return;

    setIsUnlocking(true);

    const sanitizedInput = magicWordInput.trim().toLowerCase();
    const configWord = birthdayConfig.magicWord.toLowerCase();

    if (sanitizedInput === configWord) {
      setResponseMsg("Ah, you guessed it! That word is the key to everything... Unlocking the magic path. 🔑✨");
    } else {
      setResponseMsg("A beautiful choice. Honestly, any word from you is a magic word to me... Unlocking. 💖");
    }

    // Delay to let them read the warm response and see the portal glow
    setTimeout(() => {
      onComplete();
    }, 2800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative z-10">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
          {/* Unlocking full-screen flash portal */}
          <AnimatePresence>
            {isUnlocking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center"
              >
                <div 
                  className="w-96 h-96 rounded-full blur-[80px]"
                  style={{
                    background: `radial-gradient(circle, ${birthdayConfig.theme.glowingColor} 0%, transparent 70%)`
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
            {isUnlocking ? (
              <Unlock className="w-7 h-7 text-purple-400 animate-pulse" />
            ) : (
              <Lock className="w-7 h-7 text-slate-400" />
            )}
          </div>

          <span className="text-purple-400 text-xs font-semibold uppercase tracking-widest block mb-3">
            Surprise Security
          </span>
          
          <h2 className="text-2xl md:text-3xl font-light text-slate-100 mb-4 leading-snug">
            Enter the Magic Word
          </h2>
          
          <p className="text-sm font-extralight text-slate-400 mb-8 max-w-xs mx-auto">
            Hint: What binds us together? Or just type whatever speaks to you right now.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                disabled={isUnlocking}
                value={magicWordInput}
                onChange={(e) => setMagicWordInput(e.target.value)}
                placeholder="Type the magic word..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-center text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all duration-300 font-light text-lg"
              />
              <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
            </div>

            <button
              type="submit"
              disabled={isUnlocking || !magicWordInput.trim()}
              className={`w-full py-4 rounded-2xl font-medium tracking-wider text-sm transition-all duration-300 cursor-pointer ${
                isUnlocking || !magicWordInput.trim()
                  ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-500/30"
              }`}
            >
              {isUnlocking ? "UNLOCKING SURPRISE..." : "UNLOCK NOW"}
            </button>
          </form>

          <AnimatePresence>
            {responseMsg && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20"
              >
                <p className="text-purple-200 text-sm font-light leading-relaxed">
                  {responseMsg}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
