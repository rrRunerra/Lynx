"use client";

import {
  StarCard,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/StarCard";
import { useNavigation } from "@/hooks/useNavigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ApisPage() {
  const { getItem } = useNavigation();
  const apisItem = getItem("Structures", "APIs");

  return (
    <div className="container mx-auto p-8 space-y-8 relative">
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "url(/space-background.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="flex flex-col gap-2 relative z-10">
        <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          APIs
        </h1>
        <p className="text-zinc-400">Manage registered API endpoints</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {apisItem?.children && apisItem.children.length > 0 ? (
          apisItem.children.map((category) => (
            // <Link key={category.href} href={category.href}>
            <StarCard
              className="h-full hover:scale-[1.02] transition-transform duration-300 cursor-pointer group"
              key={category.href}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg border border-zinc-500/20 text-white relative overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-50"
                      style={{
                        backgroundImage: "url(/space-background.svg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="relative z-10">{apisItem.icon}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="mt-4 text-xl text-zinc-100">
                  {category.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {category.subtitle}
                </p>
              </CardContent>
            </StarCard>
            // </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-zinc-400 py-10">
            No APIs found.
          </div>
        )}
      </div>
    </div>
  );
}
