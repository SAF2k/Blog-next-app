import { cn } from "@/lib/utils";
import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Home, BookOpen, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Saf Blogs | Interactive Learning",
  description: "A collection of technical blogs and documentation.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background text-foreground font-sans antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2 font-bold text-lg">
                      <BookOpen className="h-6 w-6 text-primary" />
                      <span>Saf Blogs</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                      <Link 
                        href="/" 
                        className="transition-colors hover:text-foreground/80 text-foreground/90 flex items-center"
                      >
                        <Home className="mr-1 h-4 w-4" />
                        Home
                      </Link>
                    </nav>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button variant="outline" size="sm" className="md:hidden">
                      <Menu className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </div>
                </div>
              </div>
            </header>
            
            <main className="flex-1">
              <div className="min-h-[calc(100vh-4rem)]">
                <div className="px-4 sm:px-6 lg:px-8 py-6 mx-auto max-w-7xl">
                  {children}
                </div>
              </div>
            </main>
            
            <footer className="border-t">
              <div className="container px-4 sm:px-6 lg:px-8 py-6 mx-auto">
                <div className="flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                  <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    {new Date().getFullYear()} Saf Blogs. All rights reserved.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Created with ❤️ by Safwat
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}