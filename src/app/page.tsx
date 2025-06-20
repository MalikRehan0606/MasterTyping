
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GithubIcon, TypeIcon, ArrowRightIcon, UserCircleIcon, TrophyIcon } from "lucide-react";
import Image from 'next/image';

export default function HomePage() {
  const creatorGitHubUrl = "https://github.com/MalikRehan0606";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-4 px-6 md:px-8 border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TypeIcon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-headline font-bold">
              Realistic<span className="text-primary">Typer</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/levels">Start Typing</Link>
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

      <main className="flex-grow container mx-auto flex flex-col items-center justify-center p-4 md:p-8 text-center">
        <section className="py-12 md:py-20">
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6">
            Master Your Keyboard Skills
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Improve your typing speed and accuracy with engaging challenges and live feedback. Get ready to type like a pro!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="shadow-lg hover:shadow-primary/50 transition-shadow">
              <Link href="/levels">
                Choose Your Challenge <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="shadow-lg hover:shadow-accent/50 transition-shadow">
              <Link href="/leaderboard">
                View Leaderboard <TrophyIcon className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-12 md:py-20 w-full max-w-4xl">
          <Card className="shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/30 p-6">
              <div className="flex items-center gap-4">
                <UserCircleIcon className="h-10 w-10 text-primary" />
                <CardTitle className="text-2xl md:text-3xl font-headline">About the Creator</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8 text-left flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-md flex-shrink-0">
                <Image
                  src="https://placehold.co/200x200.png"
                  alt="Malik Rehan"
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                  data-ai-hint="profile portrait"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2">Malik Rehan</h3>
                <p className="text-muted-foreground mb-4">
                  Hi, I&apos;m Malik Rehan, a passionate developer dedicated to creating useful and engaging web applications. RealisticTyper is one of my projects aimed at helping users improve their typing skills in a fun and effective way.
                </p>
                <p className="text-muted-foreground mb-4">
                  Connect with me on GitHub to see more of my work and contributions to the open-source community.
                </p>
                <Button asChild variant="outline">
                  <a href={creatorGitHubUrl} target="_blank" rel="noopener noreferrer">
                    <GithubIcon className="mr-2 h-5 w-5" />
                    View GitHub Profile
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
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

    