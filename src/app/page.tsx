// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { CoverModal } from "@/components/CoverModal";
import { WritingCanvas } from "@/components/WritingCanvas";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  // Initialize with null to indicate "not yet checked"
  const [showCoverModal, setShowCoverModal] = useState<boolean | null>(null);
  const [isFirstDraftMode, setIsFirstDraftMode] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [initialTime, setInitialTime] = useState(0);
  const { toast } = useToast();

  // Separate effect for session check that runs only once on mount
  useEffect(() => {
    const checkSession = () => {
      const lastVisitTime = localStorage.getItem("last-visit-time");
      if (!lastVisitTime) {
        setShowCoverModal(true);
        return;
      }

      const currentTime = Date.now();
      const lastTime = parseInt(lastVisitTime);
      const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

      if (currentTime - lastTime > SESSION_TIMEOUT) {
        setShowCoverModal(true);
      } else {
        setShowCoverModal(false);
      }
    };

    // Small delay to ensure proper hydration
    const timer = setTimeout(checkSession, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    localStorage.setItem("last-visit-time", Date.now().toString());
    setShowCoverModal(false);
  };

  const handleTimerStart = (minutes: number) => {
    if (timerRunning) {
      toast({
        title: "Timer already running",
        description: "Please wait for the current timer to finish",
        duration: 2000,
      });
      return;
    }

    const seconds = minutes * 60;
    setTimeLeft(seconds);
    setInitialTime(seconds);
    setTimerRunning(true);
    setIsPaused(false);

    toast({
      title: "Timer started",
      description: `${minutes} minute timer started`,
      duration: 2000,
    });
  };

  const handleTimerPause = () => {
    setIsPaused(true);
    toast({
      title: "Timer paused",
      description: "Click play to resume",
      duration: 2000,
    });
  };

  const handleTimerResume = () => {
    setIsPaused(false);
    toast({
      title: "Timer resumed",
      duration: 2000,
    });
  };

  const handleTimerRestart = () => {
    setTimeLeft(initialTime);
    setIsPaused(false);
    toast({
      title: "Timer restarted",
      duration: 2000,
    });
  };

  const handleTimerQuit = () => {
    setTimeLeft(0);
    setTimerRunning(false);
    setIsPaused(false);
    toast({
      title: "Timer stopped",
      description: "Timer has been cancelled",
      duration: 2000,
    });
  };

  useEffect(() => {
    if (!timerRunning || timeLeft <= 0 || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          setTimerRunning(false);
          toast({
            title: "Timer finished",
            description: "Time's up! Great work on your writing session.",
            duration: 3000,
          });
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, timeLeft, isPaused, toast]);

  // Don't render anything until we've determined modal state
  if (showCoverModal === null) {
    return null;
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <CoverModal isVisible={showCoverModal} onStart={handleStart} />
      <WritingCanvas
        isFirstDraftMode={isFirstDraftMode}
        onFirstDraftModeToggle={setIsFirstDraftMode}
        timeLeft={timeLeft}
        isPaused={isPaused}
        onTimerPause={handleTimerPause}
        onTimerResume={handleTimerResume}
        onTimerRestart={handleTimerRestart}
        onTimerStart={handleTimerStart}
        onTimerQuit={handleTimerQuit}
      />
      <Toaster />
    </main>
  );
}
