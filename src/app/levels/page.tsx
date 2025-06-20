
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TypeIcon, GithubIcon, ChevronRightIcon, ClockIcon, ZapIcon, BrainIcon, TrophyIcon } from "lucide-react";

export default function LevelsPage() {
  const creatorGitHubUrl = "https://github.com/MalikRehan0606";

  const levels = [
    {
      name: "Simple",
      description: "Perfect for beginners. Shorter texts, common words, no time limit.",
      icon: <ZapIcon className="w-8 h-8 text-primary" />,
      query: "simple",
      borderColor: "border-green-500",
    },
    {
      name: "Intermediate",
      description: "A good challenge. Standard texts, 30-second timer.",
      icon: <ClockIcon className="w-8 h-8 text-primary" />,
      query: "intermediate",
      borderColor: "border-yellow-500",
    },
    {
      name: "Expert",
      description: "Test your limits! Complex texts, 60-second timer.",
      icon: <BrainIcon className="w-8 h-8 text-primary" />,
      query: "expert",
      borderColor: "border-red-500",
    },
  ];

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

      <main className="flex-grow container mx-auto flex flex-col items-center justify-center p-4 md:p-8">
        <section className="py-12 md:py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Choose Your Challenge Level</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Select a difficulty that suits you and start improving your typing skills!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            {levels.map((level) => (
              <Card key={level.name} className={`shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 ${level.borderColor} bg-card`}>
                <CardHeader className="items-center text-center">
                  {level.icon}
                  <CardTitle className="text-2xl mt-2">{level.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center flex flex-col items-center">
                  <CardDescription className="text-sm text-muted-foreground mb-6 h-20">{level.description}</CardDescription>
                  <Button asChild className="w-full mt-auto shadow-md hover:shadow-primary/50 transition-shadow">
                    <Link href={`/typing-test?level=${level.query}`}>
                      Start {level.name} <ChevronRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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

    