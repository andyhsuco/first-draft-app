// src/components/Timer.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Timer: React.FC = () => {
  const [time, setTime] = useState(600);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && time > 0) {
      timer = setInterval(() => setTime(time - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(600);
  };

  const handleChangeTime = () => {
    if (!isRunning) {
      const newTime = prompt("Enter time in seconds:", `${time}`);
      if (newTime) {
        setTime(parseInt(newTime, 10));
      }
    }
  };

  return (
    <div className="timer">
      <span onClick={handleChangeTime}>{formatTime(time)}</span>
      <Button onClick={handleStartPause}>
        {isRunning ? "Pause" : "Start"}
      </Button>
      <Button onClick={handleReset}>Reset</Button>
    </div>
  );
};

export default Timer;
