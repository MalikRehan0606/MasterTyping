
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { TextDisplay } from "./text-display";
import { StatsBar } from "./stats-bar";
import { VirtualKeyboard } from "./virtual-keyboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCwIcon, Loader2 } from "lucide-react";
import { getRandomText } from "@/lib/sample-texts";
import type { TestStatus, DifficultyLevel, LeaderboardEntry } from "@/types";
import { useToast } from "@/hooks/use-toast";

const LEVEL_DURATIONS: Record<DifficultyLevel, number | null> = {
  simple: null,
  intermediate: 30,
  expert: 60,
};

const LEADERBOARD_KEY = "realisticTyperLeaderboard";
const MAX_LEADERBOARD_ENTRIES = 10;

interface TypingChallengeProps {
  level: DifficultyLevel;
}

export const TypingChallenge: React.FC<TypingChallengeProps> = ({ level }) => {
  const { toast } = useToast();
  const [textToType, setTextToType] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [errorIndices, setErrorIndices] = useState<Set<number>>(new Set());
  const [status, setStatus] = useState<TestStatus>("pending");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [finalAccuracy, setFinalAccuracy] = useState<number>(0);

  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [errorKeyVisual, setErrorKeyVisual] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isClient, setIsClient] = useState(false);

  const [wpm, setWpm] = useState(0);
  const [timerValue, setTimerValue] = useState(0);
  const [timerLabel, setTimerLabel] = useState("Time");

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined' && !audioContext) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);
      } catch (e) {
        console.warn("Web Audio API is not supported by this browser or is blocked.");
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch(e => console.error("Error closing audio context:", e));
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playSound = useCallback((type: "correct" | "incorrect") => {
    if (!audioContext || audioContext.state === 'suspended') {
      audioContext?.resume().catch(e => console.warn("Could not resume audio context", e));
    }
    if (!audioContext || audioContext.state !== 'running') return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      if (type === "correct") {
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.05);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
      } else {
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      }
    } catch (e) {
        console.warn("Error playing sound:", e);
    }
  }, [audioContext]);

  const calculateCurrentWpm = useCallback((currentTime: number): number => {
    if (!startTime || userInput.length === 0) return 0;
    const elapsedTimeInSeconds = (currentTime - startTime) / 1000;
    if (elapsedTimeInSeconds <= 0) return 0;
    const wordsTyped = userInput.length / 5; // Standard word length assumption
    const minutes = elapsedTimeInSeconds / 60;
    return Math.max(0, Math.round(wordsTyped / minutes));
  }, [startTime, userInput]);

  const calculateCurrentAccuracy = useCallback((): number => {
    if (userInput.length === 0) return 0;
    const correctChars = userInput.length - errorIndices.size;
    return Math.max(0, Math.round((correctChars / userInput.length) * 100));
  }, [userInput, errorIndices]);


  const saveScoreToLeaderboard = useCallback((currentWpm: number, currentAccuracy: number, currentLevel: DifficultyLevel) => {
    if (typeof window === 'undefined') return;

    const playerName = window.prompt(`Test Complete!\nYour WPM: ${currentWpm}\nAccuracy: ${currentAccuracy}%\n\nEnter your name for the leaderboard (max 20 chars):`, "Anonymous");
    if (playerName === null) {
        toast({ title: "Score Not Saved", description: "You chose not to save your score." });
        return;
    }
    const nameToSave = playerName.trim() === "" ? "Anonymous" : playerName.trim().slice(0, 20);

    const newEntry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: nameToSave,
      wpm: Math.max(0, Math.round(currentWpm)),
      accuracy: Math.max(0, Math.min(100, Math.round(currentAccuracy))),
      level: currentLevel,
      timestamp: Date.now(),
    };

    try {
      const storedLeaderboard = localStorage.getItem(LEADERBOARD_KEY);
      let leaderboard: LeaderboardEntry[] = [];
      if (storedLeaderboard) {
        try {
          const parsedData = JSON.parse(storedLeaderboard);
          if (Array.isArray(parsedData)) {
             leaderboard = parsedData.filter((entry: any): entry is LeaderboardEntry => 
              typeof entry.id === 'string' &&
              typeof entry.name === 'string' &&
              typeof entry.wpm === 'number' &&
              typeof entry.accuracy === 'number' &&
              entry.level && ['simple', 'intermediate', 'expert'].includes(entry.level) &&
              typeof entry.timestamp === 'number'
            );
          }
        } catch (parseError) {
          console.error("Error parsing leaderboard from localStorage:", parseError);
          leaderboard = []; 
        }
      }
      
      leaderboard.push(newEntry);
      leaderboard.sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy || a.timestamp - b.timestamp);
      leaderboard = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES);
      
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
      toast({ 
        title: "Score Saved!", 
        description: `Great job, ${nameToSave}! WPM: ${newEntry.wpm}, Accuracy: ${newEntry.accuracy}% on ${currentLevel} level.` 
      });
    } catch (error) {
      console.error("Failed to save to leaderboard:", error);
      toast({ title: "Error Saving Score", description: "Could not save your score to the local leaderboard.", variant: "destructive" });
    }
  }, [toast]);

  const resetTest = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTextToType(getRandomText(level));
    setUserInput("");
    setCurrentIndex(0);
    setErrorIndices(new Set());
    setStatus("pending");
    setStartTime(null);
    setEndTime(null);
    setFinalAccuracy(0);
    setActiveKey(null);
    setErrorKeyVisual(null);
    setWpm(0);

    const levelDuration = LEVEL_DURATIONS[level];
    if (levelDuration === null) {
      setTimerValue(0);
      setTimerLabel("Time");
    } else {
      setTimerValue(levelDuration);
      setTimerLabel("Time Left");
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [level]);

  useEffect(() => {
    if (isClient) {
      resetTest();
    }
  }, [isClient, resetTest, level]);

  useEffect(() => {
    if (isClient && (status === "pending" || status === "active")) {
      inputRef.current?.focus();
    }
  }, [isClient, status]);

  useEffect(() => {
    if (status !== "active" || !startTime) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const currentElapsedTime = Math.floor((currentTime - startTime) / 1000);
      
      setWpm(calculateCurrentWpm(currentTime)); // Update WPM live

      const levelDuration = LEVEL_DURATIONS[level];
      if (levelDuration === null) { 
        setTimerValue(currentElapsedTime);
      } else { 
        const remaining = levelDuration - currentElapsedTime;
        if (remaining <= 0) {
          setTimerValue(0);
          setEndTime(Date.now()); 
          setStatus("completed");
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        } else {
          setTimerValue(remaining);
        }
      }
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [status, startTime, level, calculateCurrentWpm]);

  useEffect(() => {
    if (status === "completed" && startTime && endTime) {
      const finalWpm = calculateCurrentWpm(endTime);
      const accuracy = calculateCurrentAccuracy();
      setWpm(finalWpm);
      setFinalAccuracy(accuracy);
      
      saveScoreToLeaderboard(finalWpm, accuracy, level);
    }
  }, [status, startTime, endTime, level, calculateCurrentWpm, calculateCurrentAccuracy, saveScoreToLeaderboard, toast, userInput, errorIndices.size]);


  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isClient || status === "completed") return;

    const { key } = e;

    if (key === "Tab" || (key === " " && currentIndex < textToType.length && textToType[currentIndex] !== " ")) {
      e.preventDefault();
    }
    if (key.length > 1 && !["Backspace", "Enter", "Shift", "Control", "Alt", "Meta", "CapsLock", "Escape"].includes(key)) {
      return;
    }
    if (key === "Enter" && !(currentIndex < textToType.length && textToType[currentIndex] === "\\n")) { 
      return;
    }

    if (status === "pending" && key.length === 1 && currentIndex === 0 && textToType.length > 0) {
      setStartTime(Date.now());
      setStatus("active");
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().catch(err => console.warn("Could not resume audio context", err));
      }
    }

    if (status !== "active" && status !== "pending") return;

    setActiveKey(key);

    if (key === "Backspace") {
      e.preventDefault();
      if (currentIndex > 0) {
        const newCurrentIndex = currentIndex - 1;
        setCurrentIndex(newCurrentIndex);
        setUserInput(prev => prev.slice(0, newCurrentIndex));
        setErrorIndices(prev => {
          const newErrors = new Set(prev);
          newErrors.delete(newCurrentIndex);
          return newErrors;
        });
      }
      return;
    }

    if (key.length === 1 && currentIndex < textToType.length) {
      const expectedChar = textToType[currentIndex];
      if (key === expectedChar) {
        playSound("correct");
        setErrorKeyVisual(null);
      } else {
        playSound("incorrect");
        setErrorIndices(prev => new Set(prev).add(currentIndex));
        setErrorKeyVisual(key);
      }
      setUserInput(prev => prev + key);
      setCurrentIndex(prev => prev + 1);
      
      // Live WPM update on key press for responsiveness, actual save is on complete
      if (startTime) {
        setWpm(calculateCurrentWpm(Date.now()));
      }


      if (currentIndex + 1 >= textToType.length) { 
        setEndTime(Date.now());
        setStatus("completed");
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      }
    }
  }, [isClient, status, currentIndex, textToType, playSound, startTime, audioContext, level, calculateCurrentWpm]);

  useEffect(() => {
    if (isClient) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isClient, handleKeyDown]);

  const typedCharsCount = userInput.length;

  if (!isClient || !textToType) {
    return (
      <div className="flex flex-col items-center justify-center w-full p-2 md:p-4 flex-grow">
        <Card className="w-full max-w-3xl shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-headline">Typing Challenge ({level.charAt(0).toUpperCase() + level.slice(1)})</CardTitle>
            <Button variant="outline" size="icon" aria-label="Reset Test" disabled>
              <RefreshCwIcon className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <StatsBar
              timerValue={LEVEL_DURATIONS[level] ?? 0}
              timerLabel={LEVEL_DURATIONS[level] !== null ? "Time Left" : "Time"}
              wpm={0}
              typedCharsCount={0}
              status="pending"
            />
            <div className="mt-6 w-full">
              <div className="flex items-center justify-center h-24 text-muted-foreground">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading challenge...
              </div>
            </div>
          </CardContent>
        </Card>
        <VirtualKeyboard activeKey={null} errorKey={null} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full p-2 md:p-4 flex-grow">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-headline">Typing Challenge ({level.charAt(0).toUpperCase() + level.slice(1)})</CardTitle>
          <Button variant="outline" size="icon" onClick={resetTest} aria-label="Reset Test" disabled={status === 'active' && LEVEL_DURATIONS[level] !== null}>
            <RefreshCwIcon className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <input
            ref={inputRef}
            type="text"
            className="opacity-0 w-0 h-0 absolute"
            onChange={() => {}}
            onBlur={() => { if (isClient && (status === 'active' || status === 'pending')) inputRef.current?.focus();}}
            value=""
            aria-hidden="true"
            tabIndex={-1}
            disabled={status === 'completed'}
          />

          <StatsBar
            timerValue={timerValue}
            timerLabel={timerLabel}
            wpm={wpm}
            typedCharsCount={typedCharsCount}
            status={status}
          />

          <div className="mt-6 w-full cursor-text" onClick={() => inputRef.current?.focus()}>
            <TextDisplay
              textToType={textToType}
              userInput={userInput}
              currentIndex={currentIndex}
              errorIndices={errorIndices}
              status={status}
            />
          </div>
          {status === 'completed' && (
             <Button onClick={resetTest} className="mt-6">
              Try Again ({level.charAt(0).toUpperCase() + level.slice(1)})
            </Button>
          )}
        </CardContent>
      </Card>

      <VirtualKeyboard activeKey={activeKey} errorKey={errorKeyVisual} />
    </div>
  );
};
