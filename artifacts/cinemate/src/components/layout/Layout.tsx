import { NavBar } from "./NavBar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">
      <NavBar />
      <main>{children}</main>
      
      <footer className="mt-32 border-t border-white/5 bg-background/50 py-12 text-center text-muted-foreground">
        <p className="font-serif text-lg mb-2 text-white/50">CineMate</p>
        <p className="text-sm">For the love of cinema.</p>
        <p className="text-sm mt-4 text-white/40">
          Created with love by <span className="text-white/60 font-medium">Anshu</span>
          {" "}&mdash;{" "}
          <a
            href="https://instagram.com/anshuuwastaken"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            @anshuuwastaken
          </a>
        </p>
      </footer>
    </div>
  );
}
