"use client";

import React from "react";
import { motion } from "framer-motion";
import { birthdayConfig } from "@/config/birthday";
import * as LucideIcons from "lucide-react";

export default function SectionTimeline() {
  // Icon mapper helper
  const renderIcon = (name: string) => {
    const iconClass = "w-5 h-5 text-purple-400";
    switch (name) {
      case "coffee": return <LucideIcons.Coffee className={iconClass} />;
      case "compass": return <LucideIcons.Compass className={iconClass} />;
      case "star": return <LucideIcons.Star className={iconClass} />;
      case "music": return <LucideIcons.Music className={iconClass} />;
      case "gift": return <LucideIcons.Gift className={iconClass} />;
      case "camera": return <LucideIcons.Camera className={iconClass} />;
      case "heart": return <LucideIcons.Heart className={iconClass} />;
      default: return <LucideIcons.Sparkles className={iconClass} />;
    }
  };

  return (
    <div className="relative w-full py-32 bg-slate-950/20 px-6 md:px-12 overflow-hidden">
      {/* Background glowing ambient light spheres */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-purple-500/5 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-pink-500/5 blur-[100px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-24 select-none">
        <span className="text-purple-400 text-xs font-semibold uppercase tracking-widest block mb-3">
          Timeline
        </span>
        <h2 className="text-4xl md:text-5xl font-extralight text-white tracking-wide mb-6">
          Memory Lane
        </h2>
        <div className="w-12 h-[1px] bg-purple-500/30 mx-auto mb-6" />
        <p className="text-slate-400 font-extralight text-base md:text-lg leading-relaxed">
          A vertical walk through some of our most precious, shared chapters. Scroll down to revisit our favorite moments together.
        </p>
      </div>

      {/* Timeline Wrapper Container */}
      <div className="relative max-w-5xl mx-auto">
        {/* Timeline Path Line */}
        {/* Desktop: Centered vertical line */}
        <div className="absolute left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-purple-500/0 via-purple-500/30 to-purple-500/0 -translate-x-1/2 hidden md:block" />
        {/* Mobile: Left vertical line */}
        <div className="absolute left-6 top-4 bottom-4 w-[2px] bg-gradient-to-b from-purple-500/0 via-purple-500/30 to-purple-500/0 md:hidden" />

        {/* Timeline Items list */}
        <div className="flex flex-col gap-16 md:gap-24">
          {birthdayConfig.timeline.map((entry, idx) => {
            const isLeft = idx % 2 === 0;

            return (
              <div key={idx} className="relative w-full">
                {/* 1. Desktop Alternating Layout */}
                <div className="hidden md:grid grid-cols-[1fr_80px_1fr] items-center w-full">
                  {/* Left Column (Card on even indices) */}
                  <div className="flex justify-end pr-8">
                    {isLeft ? (
                      <motion.div
                        initial={{ opacity: 0, x: -40, filter: "blur(5px)" }}
                        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full max-w-md bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative group hover:border-purple-500/20 transition-all duration-500 text-right flex flex-col items-end"
                      >
                        <span className="text-xs font-light tracking-widest text-purple-300 bg-purple-500/10 py-1 px-3.5 border border-purple-500/10 rounded-full mb-4">
                          {entry.date}
                        </span>
                        <h3 className="text-xl md:text-2xl font-light text-slate-100 mb-3 group-hover:text-white transition-colors duration-300">
                          {entry.title}
                        </h3>
                        <p className="text-sm font-extralight text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                          {entry.description}
                        </p>
                        {/* Horizontal pointer to center circle */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-purple-500/20 translate-x-8" />
                      </motion.div>
                    ) : null}
                  </div>

                  {/* Center Column: Milestone Node */}
                  <div className="flex justify-center relative">
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6 }}
                      className="w-12 h-12 rounded-full border border-purple-500/30 bg-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] z-10 hover:border-purple-500/60 hover:scale-105 transition-all duration-300"
                    >
                      {renderIcon(entry.iconName)}
                    </motion.div>
                  </div>

                  {/* Right Column (Card on odd indices) */}
                  <div className="flex justify-start pl-8">
                    {!isLeft ? (
                      <motion.div
                        initial={{ opacity: 0, x: 40, filter: "blur(5px)" }}
                        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full max-w-md bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative group hover:border-purple-500/20 transition-all duration-500 text-left flex flex-col items-start"
                      >
                        <span className="text-xs font-light tracking-widest text-purple-300 bg-purple-500/10 py-1 px-3.5 border border-purple-500/10 rounded-full mb-4">
                          {entry.date}
                        </span>
                        <h3 className="text-xl md:text-2xl font-light text-slate-100 mb-3 group-hover:text-white transition-colors duration-300">
                          {entry.title}
                        </h3>
                        <p className="text-sm font-extralight text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                          {entry.description}
                        </p>
                        {/* Horizontal pointer to center circle */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-purple-500/20 -translate-x-8" />
                      </motion.div>
                    ) : null}
                  </div>
                </div>

                {/* 2. Mobile Layout (stacked layout) */}
                <div className="md:hidden flex items-start pl-14 relative w-full">
                  {/* Milestone Node */}
                  <div className="absolute left-6 -translate-x-1/2 top-2 z-10">
                    <div className="w-10 h-10 rounded-full border border-purple-500/30 bg-slate-950 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.25)]">
                      {renderIcon(entry.iconName)}
                    </div>
                  </div>

                  {/* Card content */}
                  <motion.div
                    initial={{ opacity: 0, x: 25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="w-full bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-xl text-left flex flex-col items-start"
                  >
                    <span className="text-[10px] font-light tracking-wider text-purple-300 bg-purple-500/10 py-1 px-2.5 border border-purple-500/10 rounded-full mb-3">
                      {entry.date}
                    </span>
                    <h3 className="text-lg font-light text-slate-100 mb-2">
                      {entry.title}
                    </h3>
                    <p className="text-xs font-extralight text-slate-400 leading-relaxed">
                      {entry.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
