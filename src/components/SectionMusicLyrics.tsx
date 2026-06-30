"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioController";
import { birthdayConfig } from "@/config/birthday";
import { Play, Pause, Music, Volume2, VolumeX } from "lucide-react";

export default function SectionMusicLyrics() {
  const { 
    isPlaying, 
    playMusic, 
    pauseMusic, 
    getMusicCurrentTime, 
    isMuted, 
    toggleMute 
  } = useAudio();

  const [currentTime, setCurrentTime] = useState(0);
  const rafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Poll for current time when playing
  useEffect(() => {
    const updateProgress = () => {
      setCurrentTime(getMusicCurrentTime());
      if (isPlaying) {
        rafRef.current = requestAnimationFrame(updateProgress);
      }
    };

    if (isPlaying) {
      rafRef.current = requestAnimationFrame(updateProgress);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      // Still set once to keep it synced
      setCurrentTime(getMusicCurrentTime());
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, getMusicCurrentTime]);

  const lyrics = birthdayConfig.lyrics;

  // Find active lyric index
  let activeIndex = 0;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    }
  }

  // Scroll active lyric to center of container
  useEffect(() => {
    const activeEl = document.getElementById(`lyric-line-${activeIndex}`);
    if (activeEl && containerRef.current) {
      const container = containerRef.current;
      const topPos = activeEl.offsetTop - container.clientHeight / 2 + activeEl.clientHeight / 2;
      container.scrollTo({
        top: topPos,
        behavior: "smooth"
      });
    }
  }, [activeIndex]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  };

  return (
    <div className="relative min-h-screen w-full py-24 flex flex-col items-center justify-center bg-slate-950/20 px-6">
      {/* Background glow element */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-pink-500/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Left Col: Glass Visualizer Disc & Play button */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center select-none">
            {/* Pulsing visualizer rings */}
            <AnimatePresence>
              {isPlaying && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0.15, 0], scale: [1, 1.4] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-purple-500/30"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0.1, 0], scale: [1, 1.7] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-pink-500/20"
                  />
                </>
              )}
            </AnimatePresence>

            {/* Glowing disc core */}
            <motion.div
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="w-full h-full rounded-full bg-gradient-to-tr from-slate-900 via-purple-950/25 to-slate-900 border border-white/10 flex items-center justify-center p-3 shadow-[0_15px_45px_rgba(0,0,0,0.4)] relative"
            >
              {/* Outer Vinyl grooves style */}
              <div className="absolute inset-3 rounded-full border border-white/5 opacity-50" />
              <div className="absolute inset-8 rounded-full border border-white/5 opacity-30" />
              <div className="absolute inset-16 rounded-full border border-white/5 opacity-10" />

              {/* Album art placeholder center */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 p-[2px] shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                  <Music className={`w-8 h-8 text-purple-400 ${isPlaying ? "animate-pulse" : ""}`} />
                </div>
              </div>
            </motion.div>

            {/* Controller Floating play/pause */}
            <button
              onClick={handlePlayPause}
              className="absolute w-16 h-16 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-300 cursor-pointer z-20 hover:bg-slate-100"
              title={isPlaying ? "Pause Music" : "Play Music"}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-slate-950 stroke-slate-950 translate-x-[0px]" />
              ) : (
                <Play className="w-6 h-6 fill-slate-950 stroke-slate-950 translate-x-[2px]" />
              )}
            </button>
          </div>

          <h3 className="text-xl font-light text-white tracking-wider mt-6">
            {birthdayConfig.recipientName}&apos;s Theme
          </h3>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
            Tap play to sync the lyrics
          </p>
        </div>

        {/* Right Col: Synced Lyric scrolling screen */}
        <div className="md:col-span-7 flex flex-col justify-center w-full">
          <div className="text-center md:text-left mb-6">
            <span className="text-purple-400 text-xs font-semibold uppercase tracking-widest block mb-2">
              Soundtrack
            </span>
            <h2 className="text-3xl font-extralight text-white tracking-wide">
              Favorite Song & Lyrics
            </h2>
          </div>

          {/* Lyrics glass panel screen */}
          <div 
            ref={containerRef}
            className="w-full h-[320px] overflow-y-auto px-6 py-32 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl shadow-inner scrollbar-none flex flex-col gap-6 relative"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, white 25%, white 75%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, white 25%, white 75%, transparent 100%)"
            }}
          >
            {lyrics.map((line, idx) => {
              const isActive = idx === activeIndex;
              const isPast = idx < activeIndex;

              return (
                <div
                  key={idx}
                  id={`lyric-line-${idx}`}
                  className="transition-all duration-700 py-2 origin-center text-center md:text-left"
                >
                  <span
                    className={`block transition-all duration-700 text-lg md:text-xl font-light tracking-wide ${
                      isActive
                        ? "text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] scale-105 font-medium blur-none"
                        : isPast
                        ? "text-slate-500 opacity-60 scale-95 blur-none"
                        : "text-slate-700 opacity-20 scale-90 blur-[1px]"
                    }`}
                  >
                    {line.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
