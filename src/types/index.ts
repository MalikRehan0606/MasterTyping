
export type TestStatus = "pending" | "active" | "completed";

export type DifficultyLevel = "simple" | "intermediate" | "expert";

export type LeaderboardEntry = {
  id: string; // Unique ID for each entry, can be a timestamp or random string
  name: string;
  wpm: number;
  accuracy: number; // Percentage
  level: DifficultyLevel;
  timestamp: number; // To sort by date if WPM is the same, or for pruning
};
