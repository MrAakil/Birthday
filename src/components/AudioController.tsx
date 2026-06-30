"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { birthdayConfig } from "@/config/birthday";

interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  playMusic: () => void;
  pauseMusic: () => void;
  toggleMute: () => void;
  setVolume: (val: number) => void;
  playSFX: (type: SFXType) => void;
  getMusicProgress: () => number; // returns 0 to 1
  getMusicCurrentTime: () => number; // returns seconds
}

export type SFXType = "click" | "unlock" | "confetti" | "blow" | "envelope" | "fireworks" | "magic";

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(birthdayConfig.musicVolume);
  
  const musicRef = useRef<Howl | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize background music
  useEffect(() => {
    musicRef.current = new Howl({
      src: [birthdayConfig.musicUrl],
      html5: true, // Stream large audio files
      loop: true,
      volume: volume,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onloaderror: (id, err) => console.error("Howler load error:", err),
      onplayerror: (id, err) => {
        console.error("Howler play error:", err);
        // Autoplay blocked fallback is handled by manual trigger
        setIsPlaying(false);
      }
    });

    return () => {
      if (musicRef.current) {
        musicRef.current.unload();
      }
    };
  }, []);

  // Web Audio Context for programmatically synthesizing sound effects
  const getAudioContext = (): AudioContext => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Synthesize Sound Effects
  const playSFX = (type: SFXType) => {
    if (isMuted) return;
    
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      switch (type) {
        case "click": {
          // A short, clean UI tap
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
          
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }
        case "unlock": {
          // A sparkling ascending arpeggio
          const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C E G C E
          notes.forEach((freq, idx) => {
            const time = now + idx * 0.06;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, time);
            
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.1, time + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.25);
          });
          break;
        }
        case "confetti": {
          // White noise explosion for a pop
          const bufferSize = ctx.sampleRate * 0.3; // 0.3 seconds
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          
          const filter = ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(1000, now);
          filter.frequency.exponentialRampToValueAtTime(100, now + 0.3);
          
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          
          // Add a deep thud to the pop
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(120, now);
          osc.frequency.linearRampToValueAtTime(40, now + 0.15);
          oscGain.gain.setValueAtTime(0.2, now);
          oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          
          osc.connect(oscGain);
          oscGain.connect(ctx.destination);
          
          noise.start(now);
          osc.start(now);
          noise.stop(now + 0.3);
          osc.stop(now + 0.15);
          break;
        }
        case "blow": {
          // Dynamic noise that simulates blowing/wind
          const duration = 0.5;
          const bufferSize = ctx.sampleRate * duration;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          
          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(400, now);
          filter.frequency.exponentialRampToValueAtTime(80, now + duration);
          
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
          
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          
          noise.start(now);
          noise.stop(now + duration);
          break;
        }
        case "envelope": {
          // Paper swoosh sound (filtered noise sliding)
          const duration = 0.4;
          const bufferSize = ctx.sampleRate * duration;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          
          const filter = ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(800, now);
          filter.frequency.linearRampToValueAtTime(1400, now + duration * 0.5);
          filter.frequency.linearRampToValueAtTime(600, now + duration);
          
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.01, now);
          gain.gain.linearRampToValueAtTime(0.12, now + duration * 0.2);
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
          
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          
          noise.start(now);
          noise.stop(now + duration);
          break;
        }
        case "fireworks": {
          // Deep explosion thud + high-pitch crackling sparks
          const duration = 1.8;
          // 1. The main explosion thud
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(20, now + 0.5);
          
          oscGain.gain.setValueAtTime(0.4, now);
          oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          
          osc.connect(oscGain);
          oscGain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.6);
          
          // 2. High-pitch crackles
          for (let i = 0; i < 8; i++) {
            const timeOffset = 0.15 + Math.random() * 0.8;
            const crackleTime = now + timeOffset;
            const cOsc = ctx.createOscillator();
            const cGain = ctx.createGain();
            cOsc.type = "square";
            cOsc.frequency.setValueAtTime(1200 + Math.random() * 800, crackleTime);
            
            cGain.gain.setValueAtTime(0, crackleTime);
            cGain.gain.linearRampToValueAtTime(0.02, crackleTime + 0.005);
            cGain.gain.exponentialRampToValueAtTime(0.001, crackleTime + 0.04);
            
            cOsc.connect(cGain);
            cGain.connect(ctx.destination);
            cOsc.start(crackleTime);
            cOsc.stop(crackleTime + 0.05);
          }
          break;
        }
        case "magic": {
          // A fairy-dust wind chime
          const baseFreq = 800;
          for (let i = 0; i < 12; i++) {
            const time = now + i * 0.08;
            const pitch = baseFreq + i * 150 + (Math.random() - 0.5) * 100;
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(pitch, time);
            
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.08, time + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.4);
          }
          break;
        }
      }
    } catch (e) {
      console.warn("Audio Context sound synthesis failed:", e);
    }
  };

  const playMusic = () => {
    // Resume audio context to enable browser sounds
    try {
      getAudioContext();
    } catch (_) {}

    if (musicRef.current) {
      if (!musicRef.current.playing()) {
        musicRef.current.play();
      }
    }
  };

  const pauseMusic = () => {
    if (musicRef.current) {
      musicRef.current.pause();
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (musicRef.current) {
      musicRef.current.mute(nextMuted);
    }
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (musicRef.current) {
      musicRef.current.volume(clamped);
    }
  };

  const getMusicProgress = () => {
    if (!musicRef.current || !isPlaying) return 0;
    const duration = musicRef.current.duration();
    const seek = musicRef.current.seek();
    if (typeof seek === "number" && duration > 0) {
      return seek / duration;
    }
    return 0;
  };

  const getMusicCurrentTime = () => {
    if (!musicRef.current) return 0;
    const seek = musicRef.current.seek();
    return typeof seek === "number" ? seek : 0;
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        playMusic,
        pauseMusic,
        toggleMute,
        setVolume,
        playSFX,
        getMusicProgress,
        getMusicCurrentTime,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
