// src/components/NavBar.tsx
"use client";

import React, { useState, useEffect } from "react";
import styles from "./NavBar.module.css";
import "../app/globals.css";
import { Switch } from "@/components/ui/switch"; // Ensure correct import
import { Label } from "@/components/ui/label"; // Ensure correct import
import { useToast } from "@/components/ui/use-toast"; // Ensure correct import
import ToastTest from "@/components/ToastTest";
import { Button } from "@/components/ui/button";

const NavBar: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(600);
  const [running, setRunning] = useState<boolean>(false);
  const [firstDraftMode, setFirstDraftMode] = useState<boolean>(false); // Default to unchecked
  const { toast } = useToast(); // Initialize toast

  useEffect(() => {
    console.log("useEffect: Timer setup");
    let timer: NodeJS.Timeout;
    if (running && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => {
          console.log(`Timer running: ${prevSeconds - 1}`);
          return prevSeconds - 1;
        });
      }, 1000);
    } else if (seconds === 0) {
      setRunning(false);
    }
    return () => {
      clearInterval(timer);
      console.log("Timer cleaned up");
    };
  }, [running, seconds]);

  const startPauseTimer = () => {
    setRunning(!running);
    console.log(`Timer ${running ? "paused" : "started"}`);
  };

  const resetTimer = () => {
    setRunning(false);
    setSeconds(600);
    console.log("Timer reset");
  };

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}m ${seconds}s`;
  };

  const handleDraftToggle = (checked: boolean) => {
    setFirstDraftMode(checked);
    console.log(`First Draft Mode toggled to ${checked}`);
  };

  const disableDeleteKey = (event: KeyboardEvent) => {
    if (event.key === "Backspace" && firstDraftMode) {
      event.preventDefault();
      console.log("Backspace key press prevented");
    }
  };

  useEffect(() => {
    console.log(
      `useEffect: First Draft Mode is now ${
        firstDraftMode ? "enabled" : "disabled"
      }`
    );
    if (firstDraftMode) {
      document.addEventListener("keydown", disableDeleteKey);
      console.log("Event listener added");
    } else {
      document.removeEventListener("keydown", disableDeleteKey);
      console.log("Event listener removed");
    }

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("keydown", disableDeleteKey);
      console.log("Event listener cleaned up");
    };
  }, [firstDraftMode]);

  return (
    <div className={styles.navBar}>
      <div className={`${styles.timer} flex items-center`}>
        <span onClick={() => !running && setSeconds(600)}>
          {formatTime(seconds)}
        </span>

        <Button onClick={startPauseTimer} className="mr-2 p-2 text-white">
          {running ? "Pause" : "Start"}
        </Button>
        <Button onClick={resetTimer} className="p-2 text-white">
          Reset
        </Button>
      </div>
      <div className={styles.date}>{new Date().toLocaleDateString()}</div>
      <div className={`${styles.toggle} flex items-center`}>
        <Label htmlFor="first-draft-mode">First Draft Mode</Label>
        <Switch
          id="first-draft-mode"
          checked={firstDraftMode} // Bind the Switch to the firstDraftMode state
          onCheckedChange={(checked) => {
            handleDraftToggle(checked);
            toast({
              description: `First Draft Mode ${
                checked ? "Enabled" : "Disabled"
              }`,
            });
            console.log("toast launched");
          }} // Use onCheckedChange for state updates
        />
      </div>
      {/* <ToastTest /> */}
    </div>
  );
};

export default NavBar;
