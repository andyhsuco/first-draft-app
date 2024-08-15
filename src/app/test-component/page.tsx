"use client";
import React, { useState } from "react";
import ToastTest from "@/components/ToastTest";
import { Toaster } from "@/components/ui/toaster";
import { TimeSlider } from "@/components/TimeSlider";
import styles from "./page.module.css"; // Ensure correct import

export default function TestPage() {
  const [hovered, setHovered] = useState<boolean>(false);
  const [sliderVisible, setSliderVisible] = useState<boolean>(false);
  const [running, setRunning] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(600);
  const [initialSeconds, setInitialSeconds] = useState<number>(600);

  const handleDurationChange = (duration: number) => {
    setInitialSeconds(duration);
    setSeconds(duration);
  };

  const startPauseTimer = () => {
    setRunning(!running);
  };

  const resetTimer = () => {
    setRunning(false);
    setSeconds(initialSeconds);
  };

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}m ${seconds}s`;
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    if (!sliderVisible) {
      setHovered(false);
    }
  };

  const handleSliderMouseEnter = () => {
    setSliderVisible(true);
  };

  const handleSliderMouseLeave = () => {
    setSliderVisible(false);
    setHovered(false);
  };

  return (
    <div>
      <h1>Test Page</h1>
      <ToastTest />
      <Toaster /> {/* Ensure Toaster is included to render toasts */}
      <div
        className="flex items-center justify-between relative" // Add relative positioning to parent
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span onClick={() => !running && setSeconds(initialSeconds)}>
          {formatTime(seconds)}
        </span>
        <button onClick={startPauseTimer} className="mr-2 p-2 text-white">
          {running ? "Pause" : "Start"}
        </button>
        <button onClick={resetTimer} className="p-2 text-white">
          Reset
        </button>
        {!running && hovered && (
          <div
            className={styles.sliderBubble}
            onMouseEnter={handleSliderMouseEnter}
            onMouseLeave={handleSliderMouseLeave}
          >
            <TimeSlider
              onDurationChange={handleDurationChange}
              className="w-[200px]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
