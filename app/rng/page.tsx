"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  StarCard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/StarCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function RngPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const fromNum = parseInt(from, 10);
    const toNum = parseInt(to, 10);

    // Validate inputs
    if (isNaN(fromNum) || isNaN(toNum)) {
      setError("Please enter valid whole numbers.");
      setLoading(false);
      return;
    }

    if (fromNum > toNum) {
      setError("'From' must be less than or equal to 'To'.");
      setLoading(false);
      return;
    }

    try {
      // Fetch the ignored numbers from the config
      const res = await fetch("/api/config/rng");
      const data = await res.json();
      const ignoredNumbers: number[] = data.ignoredNumbers || [];

      // Calculate how many integers in the [from, to] range are actually ignored
      const uniqueIgnoredInRange = new Set(
        ignoredNumbers.filter((n) => n >= fromNum && n <= toNum)
      );
      const rangeSize = Math.floor(toNum - fromNum + 1);

      // If all numbers in the requested range are ignored, disable the rig
      const disableRig = uniqueIgnoredInRange.size >= rangeSize;

      let rng = Math.floor(Math.random() * (toNum - fromNum + 1)) + fromNum;

      if (!disableRig) {
        // Re-roll if the number is in the ignored list
        while (ignoredNumbers.includes(rng)) {
          rng = Math.floor(Math.random() * (toNum - fromNum + 1)) + fromNum;
        }
      }

      setResult(rng);
    } catch (err) {
      console.error("Error generating random number:", err);
      setError("Failed to generate random number. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <StarCard className="rounded-xl">
            <CardHeader>
              <CardTitle>Random Number Generator</CardTitle>
              <CardDescription>
                Enter a range to generate a random whole number
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="from">From</Label>
                    <Input
                      id="from"
                      type="number"
                      placeholder="1"
                      required
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      disabled={loading}
                      className="rounded-md"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="to">To</Label>
                    <Input
                      id="to"
                      type="number"
                      placeholder="100"
                      required
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      disabled={loading}
                      className="rounded-md"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-md"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate"}
                </Button>

                {error && (
                  <p className="text-center text-sm text-destructive">
                    ❌ {error}
                  </p>
                )}

                {result !== null && (
                  <div className="mt-2 p-6 rounded-lg bg-primary/10 border border-primary/30 text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      Your random number is
                    </p>
                    <p className="text-5xl font-bold text-primary">{result}</p>
                  </div>
                )}
              </form>
            </CardContent>
          </StarCard>
        </div>
      </div>
    </div>
  );
}
