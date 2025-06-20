
"use client";

import { Suspense } from 'react';
import { TypingChallenge } from "@/components/typing-challenge";
import { Button } from "@/components/ui/button";
import { GithubIcon, TypeIcon, Loader2, TrophyIcon } from "lucide-react";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { DifficultyLevel } from '@/types';

function TypingTestContent() {
  const searchParams = useSearchParams();
  const levelParam = searchParams.get('level') as DifficultyLevel | null;
  const level: DifficultyLevel = levelParam && ["simple", "intermediate", "expert"].includes(levelParam) ? levelParam : "intermediate"; // Default to intermediate

  return <TypingChallenge level={level} />;
}

export default function TypingTestPage() {
  const creatorGitHubUrl = "https://github.com/MalikRehan0606";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-4 px-6 md:px-8 border-b border-border">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <TypeIcon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-headline font-bold">
              Realistic<span className="text-primary">Typer</span>
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
                <Link href="/levels">Change Level</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/leaderboard">Leaderboard</Link>
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

      <main className="flex-grow container mx-auto flex items-center justify-center p-2 md:p-4">
        <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /> <span className="ml-4 text-xl">Loading Challenge...</span></div>}>
          <TypingTestContent />
        </Suspense>
      </main>

      <footer className="py-4 px-6 md:px-8 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} RealisticTyper. Master your keyboard.
        </p>
      </footer>
    </div>
  );
}

    