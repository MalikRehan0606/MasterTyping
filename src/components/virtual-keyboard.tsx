"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface VirtualKeyboardProps {
  activeKey: string | null;
  errorKey: string | null;
}

const keyboardLayout = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
  ["Caps Lock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
  ["ShiftLeft", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "ShiftRight"],
  ["ControlLeft", "MetaLeft", "AltLeft", "Space", "AltRight", "MetaRight", "ControlRight"],
];

const keyDisplayMap: { [key: string]: string } = {
  "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", "8": "*", "9": "(", "0": ")", "-": "_", "=": "+",
  "[": "{", "]": "}", "\\": "|", ";": ":", "'": "\"", ",": "<", ".": ">", "/": "?",
  "ShiftLeft": "Shift", "ShiftRight": "Shift", "ControlLeft": "Ctrl", "ControlRight": "Ctrl",
  "AltLeft": "Alt", "AltRight": "Alt", "MetaLeft": "Cmd", "MetaRight": "Cmd", "Backspace": "Bksp",
  "Caps Lock": "Caps", "Enter": "Enter", "Tab": "Tab", "Space": "Space"
};


export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ activeKey, errorKey }) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  useEffect(() => {
    if (activeKey) {
      setPressedKey(activeKey.toLowerCase());
      const timer = setTimeout(() => setPressedKey(null), 150);
      return () => clearTimeout(timer);
    }
  }, [activeKey]);
  
  useEffect(() => {
    if (errorKey) {
      setPressedKey(errorKey.toLowerCase()); // Show error highlight
      const timer = setTimeout(() => setPressedKey(null), 150); // Error highlight is also temporary
      return () => clearTimeout(timer);
    }
  }, [errorKey]);


  const getKeyClass = (key: string) => {
    const lowerKey = key.toLowerCase();
    const isPressed = pressedKey === lowerKey;
    const isErrorPress = errorKey?.toLowerCase() === lowerKey && isPressed;

    let widthClass = "w-12"; // Default width
    if (["Backspace", "Enter", "ShiftLeft", "ShiftRight"].includes(key)) widthClass = "w-24";
    if (key === "Tab") widthClass = "w-16";
    if (key === "Caps Lock") widthClass = "w-20";
    if (key === "Space") widthClass = "flex-grow w-96";
    
    return cn(
      "h-12 flex items-center justify-center m-1 rounded-md border border-input shadow-sm transition-all duration-75 ease-in-out transform",
      "bg-card hover:bg-secondary text-sm font-medium",
      widthClass,
      isPressed && !isErrorPress && "bg-primary text-primary-foreground scale-105 shadow-lg",
      isErrorPress && "bg-destructive text-destructive-foreground scale-105 shadow-lg border-red-700",
    );
  };

  return (
    <div className="p-2 md:p-4 bg-background rounded-lg shadow-inner mt-6 w-full max-w-3xl">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center">
          {row.map((key) => (
            <div key={key} className={getKeyClass(key)}>
              {keyDisplayMap[key] || key.toUpperCase()}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
