import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Copy,
  Pause,
  Play,
  RotateCcw,
  Timer,
  Sun,
  Moon,
  Square,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface WritingCanvasProps {
  isFirstDraftMode: boolean;
  onFirstDraftModeToggle: (enabled: boolean) => void;
  timeLeft: number;
  isPaused: boolean;
  onTimerPause: () => void;
  onTimerResume: () => void;
  onTimerRestart: () => void;
  onTimerStart: (minutes: number) => void;
  onTimerQuit: () => void;
}

export function WritingCanvas({
  isFirstDraftMode,
  onFirstDraftModeToggle,
  timeLeft,
  isPaused,
  onTimerPause,
  onTimerResume,
  onTimerRestart,
  onTimerStart,
  onTimerQuit,
}: WritingCanvasProps) {
  const [text, setText] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [timerMinutes, setTimerMinutes] = useState(15);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    setMounted(true);
    const savedText = localStorage.getItem("draft-text");
    if (savedText) {
      setText(savedText);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("draft-text", text);
    }
  }, [text, mounted]);

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const adjustHeight = () => {
        textarea.style.height = "auto";
        const minHeight = window.innerHeight - 128; // 8rem = 128px
        const newHeight = Math.max(textarea.scrollHeight, minHeight);
        textarea.style.height = `${newHeight}px`;
      };

      adjustHeight();
      window.addEventListener("resize", adjustHeight);
      return () => window.removeEventListener("resize", adjustHeight);
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isFirstDraftMode && (e.key === "Backspace" || e.key === "Delete")) {
      e.preventDefault();
      toast({
        title: "First Draft Mode is enabled",
        description: "Disable First Draft Mode to use delete/backspace",
        duration: 2000,
      });
    }
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Your text has been copied to the clipboard",
      duration: 2000,
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleTimerStart = (minutes: number) => {
    setIsHovering(false);
    onTimerStart(minutes);
  };

  // Handle hover interactions
  const handleTimerHover = () => {
    setIsHovering(true);
  };

  const handleTimerLeave = () => {
    setIsHovering(false);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        timerRef.current &&
        !timerRef.current.contains(event.target as Node)
      ) {
        setIsHovering(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const adjustTime = (amount: number) => {
    setTimerMinutes((prev) => Math.max(1, Math.min(prev + amount, 60)));
  };

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 ${
        theme === "light"
          ? "bg-gray-50"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      }`}
    >
      <div className="absolute inset-0 mx-auto max-w-3xl">
        <div className="relative h-full">
          <div className="p-8 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span
                  className={`text-sm ${
                    theme === "light" ? "text-gray-600" : "text-gray-300"
                  }`}
                >
                  {wordCount} words
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyText}
                  className={`h-8 w-8 rounded-full ${
                    theme === "light"
                      ? "bg-gray-200/50 hover:bg-gray-200/80"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <Copy
                    className={`h-4 w-4 ${
                      theme === "light" ? "text-gray-600" : "text-gray-300"
                    }`}
                  />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${
                    theme === "light" ? "text-gray-600" : "text-gray-300"
                  }`}
                >
                  First Draft Mode
                </span>
                <Switch
                  checked={isFirstDraftMode}
                  onCheckedChange={onFirstDraftModeToggle}
                  className={
                    theme === "light"
                      ? "data-[state=checked]:bg-green-500"
                      : "data-[state=checked]:bg-green-500"
                  }
                />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 top-24 px-8">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`absolute inset-0 w-full resize-none rounded-t-lg p-6 font-serif text-lg leading-relaxed focus:outline-none focus:ring-2 ${
                theme === "light"
                  ? "bg-white text-gray-800 placeholder-gray-400 focus:ring-gray-200"
                  : "bg-white/5 text-white placeholder-gray-500 backdrop-blur-lg focus:ring-white/20"
              }`}
              placeholder="Start writing..."
              style={{
                fontFamily: "Spectral, serif",
                height: "calc(100% + 32px)",
              }}
            />
          </div>

          <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex flex-col gap-4">
            <div
              ref={timerRef}
              className="relative"
              onMouseEnter={handleTimerHover}
              onMouseLeave={handleTimerLeave}
            >
              <div
                className={cn(
                  "h-10 flex items-center rounded-full py-1.5 relative",
                  isHovering ? "pr-4" : "w-10",
                  "bg-opacity-50 backdrop-blur-lg",
                  theme === "light"
                    ? "bg-gray-200/50 hover:bg-gray-200/80"
                    : "bg-white/10 hover:bg-white/20 dark:bg-black/30",
                  "transition-all duration-200 ease-in-out"
                )}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full p-0 absolute left-0"
                >
                  {timeLeft > 0 ? (
                    <span className="text-sm font-medium text-green-400">
                      {formatTime(timeLeft)}
                    </span>
                  ) : (
                    <Timer className="h-5 w-5" />
                  )}
                </Button>

                <div className="relative w-full">
                  <div
                    className={cn(
                      "flex items-center space-x-2 pl-10",
                      "transition-all duration-200 ease-in-out",
                      isHovering
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-4 pointer-events-none invisible"
                    )}
                  >
                    {timeLeft === 0 ? (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => adjustTime(-1)}
                          className={
                            theme === "light" ? "text-gray-600" : "text-white"
                          }
                        >
                          -
                        </Button>
                        <span
                          className={`w-16 text-center text-sm font-medium ${
                            theme === "light" ? "text-gray-600" : "text-white"
                          }`}
                        >
                          {timerMinutes} min
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => adjustTime(1)}
                          className={
                            theme === "light" ? "text-gray-600" : "text-white"
                          }
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleTimerStart(timerMinutes)}
                          className={
                            theme === "light"
                              ? "bg-gray-900 text-white hover:bg-gray-700"
                              : "bg-white text-gray-900 hover:bg-gray-100"
                          }
                        >
                          Start Writing
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={isPaused ? onTimerResume : onTimerPause}
                          className={`h-8 w-8 rounded-full ${
                            theme === "light"
                              ? "bg-gray-200/50 hover:bg-gray-200/80"
                              : "bg-white/10 hover:bg-white/20"
                          }`}
                        >
                          {isPaused ? (
                            <Play
                              className={`h-4 w-4 ${
                                theme === "light"
                                  ? "text-gray-600"
                                  : "text-gray-300"
                              }`}
                            />
                          ) : (
                            <Pause
                              className={`h-4 w-4 ${
                                theme === "light"
                                  ? "text-gray-600"
                                  : "text-gray-300"
                              }`}
                            />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={onTimerRestart}
                          className={`h-8 w-8 rounded-full ${
                            theme === "light"
                              ? "bg-gray-200/50 hover:bg-gray-200/80"
                              : "bg-white/10 hover:bg-white/20"
                          }`}
                        >
                          <RotateCcw
                            className={`h-4 w-4 ${
                              theme === "light"
                                ? "text-gray-600"
                                : "text-gray-300"
                            }`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={onTimerQuit}
                          className={`h-8 w-8 rounded-full ${
                            theme === "light"
                              ? "bg-gray-200/50 hover:bg-gray-200/80"
                              : "bg-white/10 hover:bg-white/20"
                          }`}
                        >
                          <Square
                            className={`h-4 w-4 ${
                              theme === "light"
                                ? "text-gray-600"
                                : "text-gray-300"
                            }`}
                          />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={`h-10 w-10 rounded-full ${
                theme === "light"
                  ? "bg-gray-200/50 backdrop-blur-lg hover:bg-gray-200/80"
                  : "bg-white/10 backdrop-blur-lg hover:bg-white/20 dark:bg-black/30"
              }`}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-white" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
