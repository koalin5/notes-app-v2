import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Edit3, Search, Share2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Your thoughts, organized{" "}
            <span className="text-primary">beautifully</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            Capture, organize, and share your ideas with a modern note-taking app
            designed for the way you think.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <Link href="/notes">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to stay organized
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Edit3 className="h-6 w-6" />}
              title="Rich Text Editor"
              description="Write and format your notes with our powerful rich text editor."
            />
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="Quick Search"
              description="Find any note instantly with lightning-fast search."
            />
            <FeatureCard
              icon={<Share2 className="h-6 w-6" />}
              title="Easy Sharing"
              description="Share notes with teammates or make them public."
            />
          </div>
        </div>
      </section>

      {/* AI Feature Teaser */}
      <section className="px-4 py-20 bg-gradient-to-b from-background to-primary/5">
        <div className="mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Coming Soon</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Meet Your AI Note-Taking Assistant
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Transform your note-taking experience with AI-powered insights,
            summaries, and intelligent organization.
          </p>
          <div className="bg-card border rounded-xl p-8 max-w-2xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold mb-2">Smart Note Analysis</h3>
                <p className="text-muted-foreground">
                  Chat with your notes, get AI-generated summaries, and receive
                  intelligent suggestions for organizing your content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl border bg-card">
      <div className="p-2 w-fit rounded-lg bg-primary/10 mb-4">{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
