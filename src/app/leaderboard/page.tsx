
"use client";

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GithubIcon, TypeIcon, TrophyIcon, ArrowLeftIcon, Trash2Icon, PercentIcon } from "lucide-react";
import type { LeaderboardEntry } from '@/types';
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";


const LEADERBOARD_KEY = "realisticTyperLeaderboard";

export default function LeaderboardPage() {
  const creatorGitHubUrl = "https://github.com/MalikRehan0606";
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const loadLeaderboard = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedLeaderboard = localStorage.getItem(LEADERBOARD_KEY);
        if (storedLeaderboard) {
          const parsedData: unknown = JSON.parse(storedLeaderboard);
          if (Array.isArray(parsedData)) {
            const validData = parsedData.filter((entry: any): entry is LeaderboardEntry => 
              typeof entry.id === 'string' &&
              typeof entry.name === 'string' &&
              typeof entry.wpm === 'number' &&
              typeof entry.accuracy === 'number' && // Check for accuracy
              entry.level && ['simple', 'intermediate', 'expert'].includes(entry.level) &&
              typeof entry.timestamp === 'number'
            );
            // Sort by WPM (desc), then Accuracy (desc), then timestamp (asc for older first among ties)
            setLeaderboardData(validData.sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy || a.timestamp - b.timestamp));
          } else {
             setLeaderboardData([]); 
          }
        } else {
          setLeaderboardData([]); 
        }
      } catch (error) {
        console.error("Failed to load leaderboard from localStorage:", error);
        setLeaderboardData([]);
        toast({
          title: "Error Loading Leaderboard",
          description: "Could not retrieve scores. Data might be corrupted.",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  useEffect(() => {
    if (isClient) {
      loadLeaderboard();
    }
  }, [isClient, loadLeaderboard]);

  const clearLeaderboard = () => {
    if (typeof window !== 'undefined') {
      if (window.confirm("Are you sure you want to clear the local leaderboard? This action cannot be undone.")) {
        try {
          localStorage.removeItem(LEADERBOARD_KEY);
          setLeaderboardData([]);
          toast({ title: "Leaderboard Cleared", description: "Your local scores have been removed." });
        } catch (error) {
           console.error("Failed to clear leaderboard from localStorage:", error);
           toast({
             title: "Error Clearing Leaderboard",
             description: "Could not clear scores from local storage.",
             variant: "destructive"
           });
        }
      }
    }
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-4 px-6 md:px-8 border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <TypeIcon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-headline font-bold">
              Realistic<span className="text-primary">Typer</span>
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/levels">Start Typing</Link>
            </Button>
            <a
              href={creatorGitHubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="View creator's profile on GitHub"
            >
              <GithubIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto flex flex-col items-center p-4 md:p-8">
        <section className="py-12 md:py-16 w-full max-w-4xl"> {/* Increased max-w for new column */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
             {isClient && leaderboardData.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearLeaderboard} className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 border-destructive/50">
                <Trash2Icon className="mr-2 h-4 w-4" />
                Clear Leaderboard
              </Button>
            )}
          </div>
          <Card className="shadow-xl">
            <CardHeader className="items-center text-center border-b pb-4">
              <TrophyIcon className="w-12 h-12 text-primary mb-2" />
              <CardTitle className="text-3xl font-headline">Top Typer Leaderboard</CardTitle>
              <CardDescription className="text-muted-foreground">
                Your personal bests, stored locally in your browser.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isClient && leaderboardData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px] text-center">Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-center">WPM</TableHead>
                      <TableHead className="text-center">Accuracy</TableHead>
                      <TableHead className="text-center">Level</TableHead>
                      <TableHead className="text-center">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboardData.map((entry, index) => (
                      <TableRow key={entry.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-center">{index + 1}</TableCell>
                        <TableCell>
                          {entry.name}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-primary">{entry.wpm}</TableCell>
                        <TableCell className="text-center">
                          {entry.accuracy}%
                        </TableCell>
                        <TableCell className="text-center capitalize">
                          <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              entry.level === "simple" && "bg-green-500/20 text-green-700 dark:text-green-400",
                              entry.level === "intermediate" && "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
                              entry.level === "expert" && "bg-red-500/20 text-red-700 dark:text-red-400"
                          )}>
                              {entry.level}
                          </span>
                        </TableCell>
                         <TableCell className="text-center text-xs text-muted-foreground">{formatDate(entry.timestamp)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  {isClient ? "No scores recorded yet. Complete a typing test to see your name here!" : "Loading leaderboard..."}
                </div>
              )}
            </CardContent>
          </Card>
           <p className="text-center text-sm text-muted-foreground mt-6">
            Note: This leaderboard saves your scores in your browser&apos;s local storage. Scores are not shared with other users.
          </p>
        </section>
      </main>

      <footer className="py-4 px-6 md:px-8 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} RealisticTyper. Master your keyboard.
        </p>
      </footer>
    </div>
  );
}
