// src/components/TimeSlider.tsx
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface TimeSliderProps {
  className?: string;
  onDurationChange: (duration: number) => void;
}

export function TimeSlider({ className, onDurationChange }: TimeSliderProps) {
  const [value, setValue] = useState<number>(10);

  const handleSliderChange = (val: number[]) => {
    const newValue = val[0];
    setValue(newValue);
    onDurationChange(newValue * 60); // Convert minutes to seconds
  };

  return (
    <Slider
      defaultValue={[10]}
      max={30}
      step={1}
      className={cn("w-[60%]", className)}
      onValueChange={handleSliderChange}
    />
  );
}
