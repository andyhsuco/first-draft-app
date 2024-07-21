// src/components/FocusTimer.tsx
"use client";

import React, { useState, useEffect } from "react";

const FocusTimer: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(600);
  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (running && seconds > 0) {
      timer = setInterval(() => setSeconds((seconds) => seconds - 1), 1000);
    } else if (seconds === 0) {
      setRunning(false);
    }
    return () => clearInterval(timer);
  }, [running, seconds]);

  const startPauseTimer = () => {
    setRunning(!running);
  };

  const resetTimer = () => {
    setRunning(false);
    setSeconds(600);
  };

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="flex items-center">
      <span className="mr-4">{formatTime(seconds)}</span>
      <button
        onClick={startPauseTimer}
        className="mr-2 p-2 bg-green-600 text-white"
      >
        {running ? "Pause" : "Start"}
      </button>
      <button onClick={resetTimer} className="p-2 bg-yellow-600 text-white">
        Reset
      </button>
    </div>
  );
};

export default FocusTimer;
