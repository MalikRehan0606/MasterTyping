"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface TextDisplayProps {
  textToType: string;
  userInput: string;
  currentIndex: number;
  errorIndices: Set<number>;
  status: "pending" | "active" | "completed";
}

const CharacterSpan: React.FC<{
  char: string;
  isCurrent: boolean;
  isTyped: boolean;
  isCorrect: boolean | null;
  isError: boolean;
  status: "pending" | "active" | "completed";
}> = ({ char, isCurrent, isTyped, isCorrect, isError, status }) => {
  const getCharColor = () => {
    if (status === "pending" && isCurrent) return "border-b-2 border-foreground animate-pulse-caret";
    if (isCurrent && status === "active") return "border-b-2 border-foreground animate-pulse-caret";
    if (!isTyped && !isCurrent) return "text-muted-foreground"; // Upcoming text
    if (isError) return "text-destructive bg-accent/50 rounded-sm";
    if (isCorrect) return "text-green-600";
    return "text-muted-foreground"; // Default for characters not yet actively typed or current in pending state
  };
  
  return (
    <span
      className={cn(
        "text-2xl md:text-3xl font-mono transition-colors duration-100 ease-in-out px-px",
        getCharColor(),
        char === " " ? "min-w-[0.5ch]" : "" // Ensure space has some width
      )}
    >
      {char === " " && isError ? <span className="bg-destructive text-destructive-foreground rounded-sm">_</span> : char}
    </span>
  );
};


export const TextDisplay: React.FC<TextDisplayProps> = ({
  textToType,
  userInput,
  currentIndex,
  errorIndices,
  status
}) => {
  return (
    <div
      className="p-4 md:p-6 bg-card rounded-lg shadow-md w-full max-w-3xl leading-relaxed select-none relative"
      aria-label="Text to type"
      tabIndex={-1} 
    >
      <p className="whitespace-pre-wrap break-words">
        {textToType.split("").map((char, index) => {
          const isTyped = index < userInput.length;
          const isCorrect = isTyped ? userInput[index] === char : null;
          const isError = errorIndices.has(index);
          
          return (
            <CharacterSpan
              key={`${char}-${index}`}
              char={char}
              isCurrent={index === currentIndex}
              isTyped={isTyped}
              isCorrect={isCorrect}
              isError={isError}
              status={status}
            />
          );
        })}
        {status === "pending" && currentIndex === 0 && <span className="text-2xl md:text-3xl font-mono border-b-2 border-foreground animate-pulse-caret">&nbsp;</span>}
      </p>
    </div>
  );
};
