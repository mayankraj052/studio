import { Clapperboard } from "lucide-react";
import React from "react";

export function Header() {
  return (
    <header className="py-4 border-b border-border/40">
      <div className="container mx-auto flex items-center gap-3">
        <Clapperboard className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          ReelGenius
        </h1>
      </div>
    </header>
  );
}