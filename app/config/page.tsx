"use client";

import { useState, useEffect } from "react";
import {
  StarCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/StarCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/context/AlertContext";
import { Loader2 } from "lucide-react";

export default function ConfigPage() {
  const [guildId, setGuildId] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate JSON locally first
      let parsedChannels;
      try {
        parsedChannels = JSON.parse(jsonInput);
      } catch (err) {
        showAlert({
          type: "error",
          title: "Invalid JSON",
          message: "Please enter valid JSON for the channels field.",
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/config/homework", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guildId,
          channels: parsedChannels,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save configuration");
      }

      showAlert({
        type: "success",
        title: "Success",
        message: "HomeWorkChannels configuration saved successfully.",
      });
    } catch (error: any) {
      showAlert({
        type: "error",
        title: "Error",
        message: error.message || "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configuration</h1>
        <p className="text-muted-foreground">
          Manage your homework channels and settings.
        </p>
      </div>

      <StarCard>
        <CardHeader>
          <CardTitle>HomeWork Channels</CardTitle>
          <CardDescription>
            Configure the channels for homework assignments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="guildId" className="text-sm font-medium">
                Guild ID
              </label>
              <Input
                id="guildId"
                placeholder="Enter Guild ID"
                value={guildId}
                onChange={(e) => setGuildId(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="channels" className="text-sm font-medium">
                Channels JSON
              </label>
              <textarea
                id="channels"
                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={`Use subject shortName as key
{
    "apm": "1425890971203145840",
    "slj": "1425890971203145840",
    "pci": "1425890971203145840"
}`}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter a valid JSON object defining the channel configuration.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Configuration"
              )}
            </Button>
          </form>
        </CardContent>
      </StarCard>

      <div className="my-8"></div>

      <StarCard>
        <CardHeader>
          <CardTitle>RNG Rig Configuration</CardTitle>
          <CardDescription>
            Configure the ignored numbers for the RNG command.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RngConfigForm />
        </CardContent>
      </StarCard>
    </div>
  );
}

function RngConfigForm() {
  const [jsonInput, setJsonInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/config/rng");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.ignoredNumbers)) {
            setJsonInput(data.ignoredNumbers.join(", "));
          }
        }
      } catch (error) {
        console.error("Failed to fetch RNG config", error);
      }
    };
    fetchConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send raw string to backend
      const response = await fetch("/api/config/rng", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ignoredNumbers: jsonInput,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save configuration");
      }

      showAlert({
        type: "success",
        title: "Success",
        message: "RNG Rig configuration saved successfully.",
      });
    } catch (error: any) {
      showAlert({
        type: "error",
        title: "Error",
        message: error.message || "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="rngJson" className="text-sm font-medium">
          Ignored Numbers (comma separated)
        </label>
        <textarea
          id="rngJson"
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="1, 2, 3"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Enter numbers separated by commas (e.g., 1, 2, 3).
        </p>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save RNG Config"
        )}
      </Button>
    </form>
  );
}
