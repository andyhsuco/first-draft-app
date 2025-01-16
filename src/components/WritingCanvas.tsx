/*
 * WritingCanvas Component
 *
 * This is a React component that implements a distraction-free writing interface with the following features:
 * - First Draft Mode: Prevents deletion/backspace to encourage continuous writing
 * - Timer functionality: Configurable writing sessions with pause/resume
 * - Theme switching: Light/Dark mode support
 * - Auto-saving: Text is saved to localStorage
 * - Word count tracking
 * - Copy to clipboard functionality
 * - Responsive textarea that auto-adjusts height
 */

// Import React hooks for state management and side effects
import { useEffect, useRef, useState } from "react";
// Import UI components from local component library
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
// Import icons from Lucide icon library
import {
  Copy,
  Pause,
  Play,
  RotateCcw,
  Timer,
  Sun,
  Moon,
  Square,
  Trash2,
} from "lucide-react";
// Import toast notification system
import { useToast } from "@/components/ui/use-toast";
// Import theme management hook
import { useTheme } from "next-themes";
// Import UI components for popovers and tooltips
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// Import alert dialog components for confirmations
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// Import utility function for class name management
import { cn } from "@/lib/utils";

// TypeScript interface defining the props for the WritingCanvas component
interface WritingCanvasProps {
  isFirstDraftMode: boolean; // Controls if backspace/delete is disabled
  onFirstDraftModeToggle: (enabled: boolean) => void; // Handler for toggling first draft mode
  timeLeft: number; // Remaining time in seconds
  isPaused: boolean; // Timer pause state
  onTimerPause: () => void; // Handler for pausing timer
  onTimerResume: () => void; // Handler for resuming timer
  onTimerRestart: () => void; // Handler for restarting timer
  onTimerStart: (minutes: number) => void; // Handler for starting timer
  onTimerQuit: () => void; // Handler for quitting timer
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
  // State management using React hooks
  const [text, setText] = useState(""); // Main text content
  const [mounted, setMounted] = useState(false); // Component mount state
  const [isTimerOpen, setIsTimerOpen] = useState(false); // Timer popover state
  const [timerMinutes, setTimerMinutes] = useState(15); // Timer duration
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Alert dialog state

  // Refs for DOM elements
  const timerRef = useRef<HTMLDivElement>(null); // Reference to timer popover
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Reference to textarea

  // Hooks for toast notifications and theme
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  // Calculate word count by splitting text on whitespace and filtering empty strings
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  // Effect: Initialize component and load saved text
  useEffect(() => {
    setMounted(true);
    const savedText = localStorage.getItem("draft-text");
    if (savedText) {
      setText(savedText);
    }
  }, []);

  // Effect: Save text to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("draft-text", text);
    }
  }, [text, mounted]);

  // Effect: Auto-adjust textarea height based on content
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

  // Handle keydown events - prevent backspace/delete in First Draft Mode
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

  // Copy text to clipboard and show toast notification
  const copyText = async () => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Your text has been copied to the clipboard",
      duration: 2000,
    });
  };

  // Clear text and show confirmation toast
  const clearText = () => {
    setText("");
    setIsAlertOpen(false);
    toast({
      title: "Text cleared",
      description: "All text has been cleared from the editor",
      duration: 2000,
    });
  };

  // Format seconds into MM:SS display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Start timer with selected duration
  const handleTimerStart = (minutes: number) => {
    setIsTimerOpen(false);
    onTimerStart(minutes);
  };

  // Effect: Handle clicks outside timer popover to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        timerRef.current &&
        !timerRef.current.contains(event.target as Node)
      ) {
        setIsTimerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle timer popover
  const handleTimerClick = () => {
    setIsTimerOpen(!isTimerOpen);
  };

  // Adjust timer duration (bounded between 1 and 60 minutes)
  const adjustTime = (amount: number) => {
    setTimerMinutes((prev) => Math.max(1, Math.min(prev + amount, 60)));
  };

  const handleFirstDraftModeToggle = (enabled: boolean) => {
    onFirstDraftModeToggle(enabled);
    toast({
      title: `First Draft Mode ${enabled ? "Enabled" : "Disabled"}`,
      description: enabled
        ? "Backspace and delete are now disabled"
        : "You can now use backspace and delete",
      duration: 2000,
    });
  };

  // Wait for component to mount before rendering
  if (!mounted) {
    return null;
  }

  // Main component render
  return (
    // Main container with dynamic theme-based background
    <div
      className={`fixed inset-0 ${
        theme === "light"
          ? "bg-gray-50"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      }`}
    >
      {/* Content container with max width constraint */}
      <div className="absolute inset-0 mx-auto max-w-3xl">
        <div className="relative h-full">
          {/* Top toolbar section */}
          <div className="p-8 pb-4">
            <div className="flex items-center justify-between">
              {/* Left toolbar group: word count, copy, and clear buttons */}
              <div className="flex items-center gap-4">
                {/* Word count display */}
                <span className="text-sm text-theme">
                  {wordCount} {wordCount === 1 ? "word" : "words"}
                </span>

                {/* Copy to clipboard button with tooltip */}
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyText}
                      className="icon-button"
                    >
                      <Copy className="icon" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Copy Text</p>
                  </TooltipContent>
                </Tooltip>

                {/* Clear text button with tooltip and confirmation dialog */}
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="icon-button"
                      onClick={() => setIsAlertOpen(true)}
                    >
                      <Trash2 className="icon" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Clear text</p>
                  </TooltipContent>
                </Tooltip>

                {/* Confirmation dialog for clearing text */}
                <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear Text</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to clear all text? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={clearText}>
                        Clear
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Right toolbar group: First Draft Mode toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-theme">First Draft Mode</span>
                <Switch
                  checked={isFirstDraftMode}
                  onCheckedChange={handleFirstDraftModeToggle}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </div>
          </div>

          {/* Main textarea container */}
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

          {/* Left sidebar with timer and theme controls */}
          <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex flex-col gap-4">
            {/* Timer control with popover */}
            <Popover open={isTimerOpen} onOpenChange={setIsTimerOpen}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="icon-button">
                      {/* Show either remaining time or timer icon */}
                      {timeLeft > 0 ? (
                        <span className="text-sm font-medium text-theme">
                          {formatTime(timeLeft)}
                        </span>
                      ) : (
                        <Timer className="icon" />
                      )}
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Timer</p>
                </TooltipContent>
              </Tooltip>

              {/* Timer configuration popover content */}
              <PopoverContent
                side="right"
                className="flex w-fit items-center space-x-2 bg-gray-200/50 dark:bg-black/40 backdrop-blur-lg p-2"
                align="center"
                sideOffset={10}
              >
                {timeLeft === 0 ? (
                  // Timer setup controls when timer is not running
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
                  // Timer control buttons when timer is running
                  <div className="flex items-center space-x-2 px-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={isPaused ? onTimerResume : onTimerPause}
                      className="icon-button"
                    >
                      {isPaused ? (
                        <Play className="icon" />
                      ) : (
                        <Pause className="icon" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onTimerRestart}
                      className="icon-button"
                    >
                      <RotateCcw className="icon" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onTimerQuit}
                      className="icon-button"
                    >
                      <Square className="icon" />
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {/* Theme toggle button */}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="icon-button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="icon" />
                  ) : (
                    <Moon className="icon" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{theme === "dark" ? "Light" : "Dark"} Mode</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
