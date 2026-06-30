"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { birthdayConfig } from "@/config/birthday";
import { Heart } from "lucide-react";

export default function SectionSlideshow() {
  const photos = birthdayConfig.slideshowPhotos;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [typedText, setTypedText] = useState("");
  const fullText = birthdayConfig.birthdayMessage;

  // Auto cross-fade slideshow with Ken Burns effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % photos.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [photos.length]);

  // Typewriter effect for the birthday message
  useEffect(() => {
    let index = 0;
    const intervalTime = 40; // typing speed ms
    
    // Slight delay before typing starts to let transition finish
    const startDelay = setTimeout(() => {
      const typeTimer = setInterval(() => {
        if (index < fullText.length) {
          setTypedText((prev) => prev + fullText.charAt(index));
          index++;
        } else {
          clearInterval(typeTimer);
        }
      }, intervalTime);
      return () => clearInterval(typeTimer);
    }, 1000);

    return () => clearTimeout(startDelay);
  }, [fullText]);

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* 1. Cinematic Slideshow Images (Background) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 0.6, scale: 1.02 }}
            exit={{ opacity: 0, scale: 1.0 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${photos[currentIdx]})`,
              filter: "brightness(0.5) contrast(1.1) saturate(0.9)",
            }}
          />
        </AnimatePresence>

        {/* Ambient Dark Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950" />
      </div>

      {/* 2. Text Content & Card */}
      <div className="relative z-10 w-full max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="bg-slate-950/45 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          {/* Top light beam glow */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-24 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

          {/* Heading with glowing hearts */}
          <div className="flex items-center justify-center gap-3.5 mb-6">
            <motion.div
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-8 h-8 text-pink-500 fill-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-extralight tracking-wider text-white select-none">
              Happy Birthday, <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.3)]">{birthdayConfig.recipientName}</span>
            </h1>
            
            <motion.div
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 1.6, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-8 h-8 text-pink-500 fill-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
            </motion.div>
          </div>

          {/* Subtitle */}
          <div className="w-16 h-[1px] bg-purple-500/30 mx-auto mb-8" />

          {/* Typewriter message */}
          <div className="min-h-[140px] md:min-h-[100px] flex items-center justify-center">
            <p className="text-slate-200 font-extralight leading-relaxed text-center text-base md:text-lg tracking-wide max-w-lg">
              {typedText}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-1.5 h-4.5 ml-1 bg-purple-400 align-middle"
              />
            </p>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0] }}
          transition={{ duration: 2.2, delay: 4, repeat: Infinity }}
          className="absolute -bottom-24 left-0 right-0 flex flex-col items-center gap-2 text-slate-500 select-none"
        >
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">Scroll down to explore</span>
          <div className="w-5 h-8 rounded-full border border-slate-700 p-1 flex justify-center">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-purple-400 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
