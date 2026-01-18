import {
  StarCard,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/StarCard";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CommandOptions } from "@/components/commands/CommandOptions";
import {
  ChevronLeft,
  Terminal,
  Shield,
  Clock,
  Book,
  Users,
  Server,
  Lock,
  MessageSquare,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

async function getCommand(name: string) {
  try {
    const res = await fetch(
      `http://localhost:4444/commands/getCommand/${name}`,
      { cache: "force-cache" },
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch command:", error);
    return null;
  }
}

export default async function CommandPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const command = await getCommand(name);

  if (!command) {
    return (
      <div className="container mx-auto p-8 text-zinc-400">
        Command not found
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-8 relative">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30" />

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-4">
        <Link
          href="/commands"
          className="flex items-center text-sm text-zinc-400 hover:text-white transition-colors w-fit"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Commands
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent flex items-center gap-3">
            <Terminal className="w-8 h-8 text-zinc-400" />
            {command.name}
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">{command.description}</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <StarCard>
            <CardHeader>
              <CardTitle className="text-xl text-zinc-100 flex items-center gap-2">
                <Book className="w-5 h-5 text-zinc-400" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800 text-zinc-300 leading-relaxed overflow-x-auto prose prose-invert prose-zinc max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-xl font-bold mb-4 text-white"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-lg font-semibold mb-3 text-zinc-100"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-md font-medium mb-2 text-zinc-200"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-4 last:mb-0" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc pl-6 mb-4 space-y-1"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal pl-6 mb-4 space-y-1"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="text-zinc-400" {...props} />
                    ),
                    code: ({ node, ...props }) => (
                      <code
                        className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200 font-mono text-xs"
                        {...props}
                      />
                    ),
                    pre: ({ node, ...props }) => (
                      <pre
                        className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 mb-4 overflow-x-auto"
                        {...props}
                      />
                    ),
                  }}
                >
                  {command.docs || "No documentation available."}
                </ReactMarkdown>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-zinc-500/5 border border-zinc-500/10">
                  <span className="text-zinc-500 text-sm block mb-1">
                    Category
                  </span>
                  <span className="text-zinc-200 font-medium">
                    {command.category || "Uncategorized"}
                  </span>
                </div>
                <div className="p-4 rounded-lg bg-zinc-500/5 border border-zinc-500/10">
                  <span className="text-zinc-500 text-sm block mb-1">
                    Cooldown
                  </span>
                  <span className="text-zinc-200 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {command.cooldown}s
                  </span>
                </div>
              </div>
            </CardContent>
          </StarCard>
          {/* Options/Arguments if any */}
          {command.options && command.options.length > 0 && (
            <StarCard>
              <CardHeader>
                <CardTitle className="text-xl text-zinc-100">Options</CardTitle>
              </CardHeader>
              <CardContent>
                <CommandOptions options={command.options} />
              </CardContent>
            </StarCard>
          )}

          {/* Subcommands */}
          {command.subCommands && command.subCommands.length > 0 && (
            <StarCard>
              <CardHeader>
                <CardTitle className="text-xl text-zinc-100 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-zinc-400" />
                  Subcommands
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {command.subCommands.map((sub: any) => (
                    <div
                      key={sub.name}
                      className="p-4 rounded-lg bg-zinc-500/5 border border-zinc-500/10 hover:border-zinc-500/20 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-zinc-200">
                          {sub.name.split(".").pop()}
                        </span>
                        <Badge
                          variant={sub.enabled ? "default" : "destructive"}
                          className={`text-xs ${
                            sub.enabled
                              ? "bg-emerald-500/10 text-emerald-400"
                              : ""
                          }`}
                        >
                          {sub.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="text-zinc-400 text-sm prose prose-invert prose-zinc max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ node, ...props }) => (
                              <p className="mb-2 last:mb-0" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul className="list-disc pl-4 mb-2" {...props} />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="text-zinc-500" {...props} />
                            ),
                            code: ({ node, ...props }) => (
                              <code
                                className="bg-zinc-800 px-1 rounded text-zinc-300 font-mono text-xs"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {sub.docs || "No documentation provided."}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </StarCard>
          )}

          {/* Permissions */}
          <StarCard>
            <CardHeader>
              <CardTitle className="text-xl text-zinc-100 flex items-center gap-2">
                <Lock className="w-5 h-5 text-zinc-400" />
                Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="text-zinc-500 text-sm block mb-2">
                  User Permissions
                </span>
                <div className="flex flex-wrap gap-2">
                  {command.userPermissions &&
                  command.userPermissions.length > 0 ? (
                    command.userPermissions.map((perm: string) => (
                      <Badge
                        key={perm}
                        variant="outline"
                        className="bg-blue-500/10 text-blue-300 border-blue-500/20"
                      >
                        {perm}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-zinc-600 text-sm italic">None</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-zinc-500 text-sm block mb-2">
                  Client Permissions
                </span>
                <div className="flex flex-wrap gap-2">
                  {command.clientPermissions &&
                  command.clientPermissions.length > 0 ? (
                    command.clientPermissions.map((perm: string) => (
                      <Badge
                        key={perm}
                        variant="outline"
                        className="bg-purple-500/10 text-purple-300 border-purple-500/20"
                      >
                        {perm}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-zinc-600 text-sm italic">None</span>
                  )}
                </div>
              </div>
            </CardContent>
          </StarCard>
        </div>

        {/* Sidebar Status/Config */}
        <div className="space-y-6">
          <StarCard>
            <CardHeader>
              <CardTitle className="text-xl text-zinc-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-zinc-400" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Status</span>
                <Badge
                  variant={command.enabled ? "default" : "destructive"}
                  className={
                    command.enabled
                      ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                      : ""
                  }
                >
                  {command.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Dev Only</span>
                <span
                  className={command.dev ? "text-amber-400" : "text-zinc-600"}
                >
                  {command.dev ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">NSFW</span>
                <span
                  className={command.nsfw ? "text-red-400" : "text-zinc-600"}
                >
                  {command.nsfw ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Allow DM</span>
                <span className="text-zinc-200">
                  {command.allowDm ? (
                    <div className="flex items-center gap-1 text-emerald-400">
                      <MessageSquare className="w-3 h-3" /> Yes
                    </div>
                  ) : (
                    <span className="text-zinc-600">No</span>
                  )}
                </span>
              </div>
            </CardContent>
          </StarCard>

          {/* Restrictions */}
          <StarCard>
            <CardHeader>
              <CardTitle className="text-xl text-zinc-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-zinc-400" />
                Restrictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Server className="w-4 h-4" /> Server Only
                </div>
                <div className="flex flex-wrap gap-1">
                  {command.serverOnly && command.serverOnly.length > 0 ? (
                    command.serverOnly.map((id: string) => (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="font-mono text-xs"
                      >
                        {id}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-zinc-600 text-xs italic">
                      No restriction
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Users className="w-4 h-4" /> User Only
                </div>
                <div className="flex flex-wrap gap-1">
                  {command.userOnly && command.userOnly.length > 0 ? (
                    command.userOnly.map((id: string) => (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="font-mono text-xs"
                      >
                        {id}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-zinc-600 text-xs italic">
                      No restriction
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Clock className="w-4 h-4" /> Cooldown Excluded
                </div>
                <div className="flex flex-wrap gap-1">
                  {command.cooldownFilteredUsers &&
                  command.cooldownFilteredUsers.length > 0 ? (
                    command.cooldownFilteredUsers.map((id: string) => (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="font-mono text-xs"
                      >
                        {id}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-zinc-600 text-xs italic">None</span>
                  )}
                </div>
              </div>
            </CardContent>
          </StarCard>
        </div>
      </div>
    </div>
  );
}
