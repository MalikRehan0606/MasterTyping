
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TimerIcon, KeyboardIcon, ZapIcon } from "lucide-react";
import type { TestStatus } from "@/types";

interface StatsBarProps {
  timerValue: number;
  timerLabel: string;
  wpm: number;
  typedCharsCount: number;
  status: TestStatus; // To know if test is pending, active or completed
}

export const StatsBar: React.FC<StatsBarProps> = ({
  timerValue,
  timerLabel,
  wpm,
  typedCharsCount,
  status
}) => {
  const formatTime = (seconds: number) => {
    const wholeSeconds = Math.max(0, Math.floor(seconds)); // Ensure non-negative and integer
    const minutes = Math.floor(wholeSeconds / 60);
    const remainingSeconds = wholeSeconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <Card className="w-full max-w-3xl mt-4 shadow-sm">
      <CardContent className="p-4 flex justify-around items-center">
        <div className="flex flex-col items-center text-center w-1/3">
          <div className="flex items-center text-lg font-semibold text-muted-foreground">
            <TimerIcon className="mr-2 h-5 w-5 text-primary" />
            <span>{timerLabel}</span>
          </div>
          <span className="text-2xl font-bold">{formatTime(timerValue)}</span>
        </div>
        <div className="flex flex-col items-center text-center w-1/3">
          <div className="flex items-center text-lg font-semibold text-muted-foreground">
            <ZapIcon className="mr-2 h-5 w-5 text-primary" />
            <span>WPM</span>
          </div>
          <span className="text-2xl font-bold">{wpm}</span>
        </div>
        <div className="flex flex-col items-center text-center w-1/3">
         <div className="flex items-center text-lg font-semibold text-muted-foreground">
            <KeyboardIcon className="mr-2 h-5 w-5 text-primary" />
            <span>Chars</span>
          </div>
          <span className="text-2xl font-bold">{typedCharsCount}</span>
        </div>
      </CardContent>
    </Card>
  );
};
