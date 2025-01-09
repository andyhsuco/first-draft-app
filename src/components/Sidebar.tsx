import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Timer, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface SidebarProps {
  onTimerStart: (minutes: number) => void;
  timerRunning: boolean;
}

export function Sidebar({ onTimerStart, timerRunning }: SidebarProps) {
  const [timerMinutes, setTimerMinutes] = useState(10);
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const handleTimerStart = (minutes: number) => {
    onTimerStart(minutes);
    setOpen(false);
  };

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-10 w-10 rounded-full ${
              theme === "light"
                ? "bg-gray-200/50 backdrop-blur-lg hover:bg-gray-200/80"
                : "bg-white/10 backdrop-blur-lg hover:bg-white/20 dark:bg-black/30"
            }`}
          >
            <Timer
              className={`h-5 w-5 ${
                timerRunning
                  ? "text-green-400"
                  : theme === "light"
                  ? "text-gray-600"
                  : "text-white"
              }`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="center"
          className={`w-48 ${
            theme === "light"
              ? "bg-white/80 backdrop-blur-lg"
              : "bg-white/10 backdrop-blur-lg dark:bg-black/30"
          }`}
        >
          <div className="space-y-4 p-2">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTimerMinutes(Math.max(5, timerMinutes - 5))}
                className={
                  theme === "light"
                    ? "text-gray-600 hover:bg-gray-200/50"
                    : "text-white hover:bg-white/20"
                }
                disabled={timerRunning}
              >
                -
              </Button>
              <span
                className={`text-lg font-medium ${
                  theme === "light" ? "text-gray-600" : "text-white"
                }`}
              >
                {timerMinutes} min
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTimerMinutes(Math.min(60, timerMinutes + 5))}
                className={
                  theme === "light"
                    ? "text-gray-600 hover:bg-gray-200/50"
                    : "text-white hover:bg-white/20"
                }
                disabled={timerRunning}
              >
                +
              </Button>
            </div>
            <Button
              onClick={() => handleTimerStart(timerMinutes)}
              className={`w-full ${
                theme === "light"
                  ? "bg-gray-200/50 text-gray-600 hover:bg-gray-200/80"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
              disabled={timerRunning}
            >
              Start Timer
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={`h-10 w-10 rounded-full ${
          theme === "light"
            ? "bg-gray-200/50 backdrop-blur-lg hover:bg-gray-200/80"
            : "bg-white/10 backdrop-blur-lg hover:bg-white/20 dark:bg-black/30"
        }`}
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-white" />
        ) : (
          <Moon className="h-5 w-5 text-gray-600" />
        )}
      </Button>
    </div>
  );
}
