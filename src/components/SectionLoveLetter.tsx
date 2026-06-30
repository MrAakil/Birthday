"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioController";
import { birthdayConfig } from "@/config/birthday";
import { Mail, MailOpen, X, Sparkles } from "lucide-react";

export default function SectionLoveLetter() {
  const { playSFX } = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const letterData = birthdayConfig.loveLetter;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpen = () => {
    if (isOpen) return;
    playSFX("envelope");
    playSFX("magic");
    setIsOpen(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent re-triggering open
    playSFX("click");
    setIsOpen(false);
  };

  return (
    <div className="relative min-h-screen w-full py-24 flex flex-col items-center justify-center bg-slate-950/40 px-6">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-md w-full text-center relative z-10">
        <span className="text-purple-400 text-xs font-semibold uppercase tracking-widest block mb-3">
          Deepest Thoughts
        </span>
        <h2 className="text-3xl md:text-4xl font-extralight text-white tracking-wide mb-12">
          A Message for You
        </h2>

        {/* The Envelope Interactive Wrapper */}
        <div 
          onClick={handleOpen}
          className={`relative w-80 h-56 mx-auto bg-slate-900 border border-white/10 rounded-2xl shadow-2xl cursor-pointer hover:border-purple-500/30 group transition-all duration-500 flex flex-col items-center justify-center overflow-hidden ${
            isOpen ? "scale-95 shadow-lg border-purple-500/20" : "hover:scale-[1.03]"
          }`}
        >
          {/* Subtle glow border hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.div
                key="closed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-slate-300 font-light tracking-wider text-sm">
                  Click to open envelope
                </span>
                <span className="text-[10px] text-slate-500 font-light tracking-widest mt-1.5 uppercase">
                  sealed with care
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                  <MailOpen className="w-6 h-6 text-indigo-400 animate-pulse" />
                </div>
                <span className="text-slate-400 font-light tracking-wider text-sm animate-pulse">
                  Letter is open...
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Letter flap animations stylized */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-slate-950/40 border-t border-white/5 pointer-events-none" />
        </div>
      </div>

      {/* Full screen lightbox letter overlays using Portals to prevent parent transform clipping */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 w-full h-full bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-6"
              onClick={handleClose}
            >
              <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.85, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 100, scale: 0.85, filter: "blur(10px)" }}
                transition={{ type: "spring", damping: 25, stiffness: 180 }}
                onClick={(e) => e.stopPropagation()} // prevent close on clicking card itself
                className="w-full max-w-xl bg-white text-slate-950 rounded-3xl p-8 md:p-12 shadow-[0_30px_70px_rgba(0,0,0,0.6)] relative overflow-hidden"
                style={{
                  backgroundColor: letterData.letterBgColor,
                  color: letterData.textColor
                }}
              >
                {/* Decorative sparkles in corner of letter */}
                <div className="absolute top-4 left-4 opacity-10">
                  <Sparkles className="w-8 h-8" />
                </div>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-200 transition-colors duration-300 cursor-pointer"
                  style={{ color: letterData.textColor }}
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Letter content */}
                <div className="font-serif">
                  {/* Heading */}
                  <h3 className="text-2xl md:text-3xl font-medium tracking-wide mb-8">
                    {letterData.heading}
                  </h3>

                  {/* Paragraphs */}
                  <div className="flex flex-col gap-6 text-base md:text-lg font-light leading-relaxed opacity-90 select-text">
                    {letterData.paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>

                  {/* Sign-off */}
                  <p className="text-right text-base md:text-lg font-medium italic mt-12 tracking-wide">
                    {letterData.signOff}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
