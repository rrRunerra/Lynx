"use client";

import { cn } from "@/lib/utils";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarBackground } from "@/components/ui/StarBackground";

interface StarCardProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode;
}

export function StarCard({ className, children, ...props }: StarCardProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <Card
      onMouseMove={handleMouseMove}
      className={cn(
        "relative overflow-hidden group border-(--star-card-border,var(--color-zinc-800)/30) bg-(--star-card-bg,rgba(0,0,0,0.4)) backdrop-blur-xl transition-colors hover:border-(--star-card-border-hover,var(--color-zinc-700)/30)",
        className,
      )}
      {...props}
    >
      <div
        className="absolute -inset-px z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), var(--glow-color, rgba(255,255,255,0.2)), transparent 40%)`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
          borderRadius: "inherit",
        }}
      />
      <StarBackground />
      <div className="relative z-10">{children}</div>
    </Card>
  );
}

// Re-export Card sub-components so they can be used directly with StarCard if desired,
// or users can import them from ui/card. Ideally, StarCard should work as a drop-in replacement for Card.
export { CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
