"use client";

import { StarCard } from "@/components/ui/StarCard";
import { Link2, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function LinkRequiredPage() {
  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden flex items-center justify-center p-4">
      {/* Background stars from global but we can add extra if needed */}
      <div className="absolute inset-0 bg-[url('/space-background.svg')] opacity-20 pointer-events-none" />

      <StarCard className="max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
            <ShieldAlert className="w-12 h-12 text-red-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            access restricted
          </h1>
          <p className="text-zinc-400 text-sm">
            This area requires your Discord account to be linked with the bot.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 text-left space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-1 bg-blue-500/10 rounded">
              <Link2 className="w-3 h-3 text-blue-400" />
            </div>
            <div className="text-xs text-zinc-300">
              <span className="block font-semibold text-zinc-200 mb-0.5">
                How to link
              </span>
              Run the command{" "}
              <code className="bg-zinc-800 px-1 py-0.5 rounded text-blue-300">
                /auth
              </code>{" "}
              in a private DM with the bot.
            </div>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="block w-full py-2.5 px-4 bg-zinc-100 hover:bg-white text-black font-semibold rounded-md transition-colors text-sm"
        >
          Return to Dashboard
        </Link>
      </StarCard>
    </div>
  );
}
