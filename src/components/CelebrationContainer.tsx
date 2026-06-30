"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAudio } from "./AudioController";
import { Volume2, VolumeX } from "lucide-react";

// Import all section components
import SectionSlideshow from "./SectionSlideshow";
import SectionCake3D from "./SectionCake3D";
import SectionMusicLyrics from "./SectionMusicLyrics";
import SectionTimeline from "./SectionTimeline";
import SectionLoveLetter from "./SectionLoveLetter";
import SectionFinalScene from "./SectionFinalScene";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface CelebrationContainerProps {
  onReplay: () => void;
}

export default function CelebrationContainer({ onReplay }: CelebrationContainerProps) {
  const { isMuted, toggleMute, isPlaying, playMusic } = useAudio();

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
    });

    // Sync ScrollTrigger with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Make sure we scroll to top on mount
    window.scrollTo(0, 0);

    // Start playing background music if it was paused
    playMusic();

    return () => {
      lenis.destroy();
      gsap.ticker.remove(ScrollTrigger.update);
    };
  }, [playMusic]);

  return (
    <div className="relative w-full text-slate-100 min-h-screen">
      {/* Global Floating Sound Controller */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        {/* Simple Audio playing visualizer lines */}
        {isPlaying && !isMuted && (
          <div className="flex gap-[3px] items-end h-4 w-6 px-1 pointer-events-none">
            <span className="w-[3px] h-3 bg-purple-400 rounded-full animate-bounce [animation-duration:0.6s]" />
            <span className="w-[3px] h-4 bg-purple-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.15s]" />
            <span className="w-[3px] h-2 bg-purple-400 rounded-full animate-bounce [animation-duration:0.5s] [animation-delay:0.3s]" />
            <span className="w-[3px] h-3.5 bg-purple-400 rounded-full animate-bounce [animation-duration:0.7s] [animation-delay:0.1s]" />
          </div>
        )}
        <button
          onClick={toggleMute}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 text-slate-300 hover:text-white transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-red-400 animate-pulse" />
          ) : (
            <Volume2 className="w-5 h-5 text-purple-400" />
          )}
        </button>
      </div>

      {/* Sections sequence */}
      {/* 6. Grand Reveal slideshow */}
      <section className="relative z-10 w-full overflow-hidden">
        <SectionSlideshow />
      </section>

      {/* 7. 3D Cake & Blowing candles */}
      <section className="relative z-10 w-full">
        <SectionCake3D />
      </section>

      {/* 8. Favorite Song & Synced Lyrics */}
      <section className="relative z-10 w-full">
        <SectionMusicLyrics />
      </section>

      {/* 9. Horizon Memory Timeline */}
      <section className="relative z-10 w-full bg-slate-950/20">
        <SectionTimeline />
      </section>

      {/* 10. Letter envelope */}
      <section className="relative z-10 w-full">
        <SectionLoveLetter />
      </section>

      {/* 11. Final night sky starry space */}
      <section className="relative z-10 w-full">
        <SectionFinalScene onReplay={onReplay} />
      </section>
    </div>
  );
}
