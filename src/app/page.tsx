"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AudioProvider } from "@/components/AudioController";
import CanvasBackground from "@/components/CanvasBackground";

// Import pre-reveal components
import StepIntro from "@/components/StepIntro";
import StepQuestions from "@/components/StepQuestions";
import StepOccasion from "@/components/StepOccasion";
import StepSecretLock from "@/components/StepSecretLock";
import StepLoading from "@/components/StepLoading";

// Import celebration container
import CelebrationContainer from "@/components/CelebrationContainer";

function SurpriseApp() {
  const [step, setStep] = useState<number>(1);

  // Read step from localStorage on mount (optional, to keep user place, but for birthday replay, starting at 1 is standard. Let's start at 1.)
  useEffect(() => {
    // Make sure page starts at top
    window.scrollTo(0, 0);
  }, [step]);

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handleReplay = () => {
    // Clear local preferences if needed, or keep them
    // For a complete fresh experience, reset to step 1
    setStep(1);
  };

  return (
    <main className="relative min-h-screen w-full bg-slate-950 overflow-hidden selection:bg-purple-500/30 selection:text-purple-200">
      {/* 1. Starry and glowing background rendered globally */}
      <CanvasBackground />

      {/* 2. Page coordinate navigation states */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.8 }}
            className="w-full min-h-screen"
          >
            <StepIntro onComplete={handleNextStep} />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5 }}
            className="w-full min-h-screen"
          >
            <StepQuestions onComplete={handleNextStep} />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5 }}
            className="w-full min-h-screen"
          >
            <StepOccasion onComplete={handleNextStep} />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5 }}
            className="w-full min-h-screen"
          >
            <StepSecretLock onComplete={handleNextStep} />
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full min-h-screen"
          >
            <StepLoading onComplete={handleNextStep} />
          </motion.div>
        )}

        {step === 6 && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, filter: "blur(12px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="w-full min-h-screen"
          >
            <CelebrationContainer onReplay={handleReplay} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function Home() {
  return (
    <AudioProvider>
      <SurpriseApp />
    </AudioProvider>
  );
}
