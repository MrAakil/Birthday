"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioController";
import confetti from "canvas-confetti";
import { Mic, MicOff, Sparkles, Wind } from "lucide-react";
import { birthdayConfig } from "@/config/birthday";

// Dynamically import the 3D canvas with SSR disabled to prevent server-side Node.js compilation of WebGL
const Cake3DCanvas = dynamic(() => import("./Cake3DCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm animate-pulse">
      <div className="text-center text-slate-500 font-light">
        <Sparkles className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-3" />
        Loading 3D interactive model...
      </div>
    </div>
  )
});

export default function SectionCake3D() {
  const { playSFX } = useAudio();
  const [blown, setBlown] = useState(false);
  const [micState, setMicState] = useState<"idle" | "listening" | "denied">("idle");
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Trigger celebration effects
  const triggerCelebration = () => {
    setBlown(true);
    playSFX("blow");
    playSFX("confetti");
    
    // Play fireworks sound effect a bit later
    setTimeout(() => {
      playSFX("fireworks");
    }, 400);

    // Multi-pop confetti burst
    const end = Date.now() + 5000; // celebrate for 5 seconds

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: birthdayConfig.theme.confettiColors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: birthdayConfig.theme.confettiColors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Trigger occasional centered burst
    const interval = setInterval(() => {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: birthdayConfig.theme.confettiColors
      });
    }, 1200);

    setTimeout(() => {
      clearInterval(interval);
    }, 4800);
  };

  // Setup mic listener
  const enableMic = async () => {
    if (blown) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicState("listening");

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let blowStreak = 0; // Number of consecutive frames with blowing intensity

      const checkVolume = () => {
        if (blown) return;

        analyser.getByteFrequencyData(dataArray);

        // Breath/blow sound is highly concentrated in low frequency bands
        // We sum bins 1 through 10 (approx 80Hz - 400Hz)
        let lowEnergy = 0;
        for (let i = 1; i <= 10; i++) {
          lowEnergy += dataArray[i];
        }
        const averageLow = lowEnergy / 10;

        // If threshold exceeded, increment blow streak
        if (averageLow > 70) {
          blowStreak++;
          if (blowStreak >= 12) { // must exceed for ~200ms
            triggerCelebration();
            disableMic();
            return;
          }
        } else {
          blowStreak = Math.max(0, blowStreak - 2); // decay
        }

        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err) {
      console.warn("Microphone access denied or error:", err);
      setMicState("denied");
    }
  };

  const disableMic = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
    setMicState("idle");
  };

  // Cleanup microphone on unmount
  useEffect(() => {
    return () => {
      disableMic();
    };
  }, []);

  const handleManualBlow = () => {
    if (blown) return;
    triggerCelebration();
    disableMic();
  };

  return (
    <div className="relative min-h-screen w-full py-20 flex flex-col items-center justify-center bg-slate-950/40 px-6 overflow-hidden">
      {/* Background soft glowing blur behind cake */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: 3D Cake Canvas Container */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center order-2 lg:order-1">
          <div className="relative w-full max-w-md bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-4 shadow-[0_30px_60px_rgba(0,0,0,0.4)] overflow-hidden">
            {/* Corner glowing auroras */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-pink-500/10 blur-xl rounded-full" />
            <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-indigo-500/10 blur-xl rounded-full" />
            
            <Cake3DCanvas blown={blown} />

            <div className="text-center text-xs text-slate-500 mt-2 tracking-wider">
              {blown ? "✨ WISH HAS BEEN SENT ✨" : "✨ CLICK AND DRAG TO ROTATE CAKE ✨"}
            </div>
          </div>
        </div>

        {/* Right Side: Text, Instructions & Controls */}
        <div className="lg:col-span-6 flex flex-col justify-center order-1 lg:order-2 text-center lg:text-left">
          <span className="text-purple-400 text-xs font-semibold uppercase tracking-widest block mb-3">
            Interactive Moment
          </span>
          <h2 className="text-3xl md:text-4xl font-extralight text-white tracking-wide mb-6">
            The Birthday Cake
          </h2>

          <div className="w-12 h-[1px] bg-purple-500/30 mx-auto lg:mx-0 mb-6" />

          <p className="text-slate-300 font-extralight text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
            Make a beautiful wish in your heart. You can blow out the candles by clicking &ldquo;Enable Microphone&rdquo; and blowing into your mic, or simply click the manual &ldquo;Blow Candles&rdquo; button.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            {/* Microphone Toggle Button */}
            {!blown && (
              <button
                onClick={micState === "listening" ? disableMic : enableMic}
                className={`w-full sm:w-auto px-6 py-4 rounded-2xl font-medium text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border ${
                  micState === "listening"
                    ? "bg-red-500/20 border-red-500/30 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse"
                    : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {micState === "listening" ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span>STOP MICROPHONE</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-purple-400" />
                    <span>ENABLE MICROPHONE</span>
                  </>
                )}
              </button>
            )}

            {/* Blow Button */}
            <button
              onClick={handleManualBlow}
              disabled={blown}
              className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                blown
                  ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] border border-purple-500/30"
              }`}
            >
              <Wind className="w-4 h-4" />
              <span>{blown ? "CANDLES BLOWN OUT" : "BLOW CANDLES"}</span>
            </button>
          </div>

          {/* Micro status messages */}
          <div className="h-8 mt-4 flex items-center justify-center lg:justify-start">
            <AnimatePresence mode="wait">
              {micState === "listening" && (
                <motion.span
                  key="listening"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-purple-400 flex items-center gap-1.5 font-light"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                  Listening for your breath... Blow into the microphone now! 🌬️
                </motion.span>
              )}
              {micState === "denied" && (
                <motion.span
                  key="denied"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-400 font-light"
                >
                  Microphone blocked or not found. Please use the Blow button above! 👆
                </motion.span>
              )}
              {blown && (
                <motion.span
                  key="blown"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-green-400 font-semibold flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-bounce" />
                  Happy Birthday {birthdayConfig.recipientName}! May all your wishes come true! 🎉💖
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
