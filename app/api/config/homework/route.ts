import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateApiKey } from "@/lib/api-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  // 1. Verify Authentication
  let user = await validateApiKey(req);
  let authMethod = "apikey";

  if (!user) {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      // Fetch full user to check lynxKey
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (dbUser && dbUser.lynxKey) {
        user = dbUser;
        authMethod = "session";
      }
    }
  }

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized: Missing API Key or Unlinked Account" },
      { status: 401 }
    );
  }

  // 2. Validate Input
  try {
    const body = await req.json();
    const { guildId, channels } = body;

    if (!guildId || typeof guildId !== "string") {
      return NextResponse.json({ error: "Invalid guildId" }, { status: 400 });
    }

    if (!channels) {
      return NextResponse.json(
        { error: "Missing channels data" },
        { status: 400 }
      );
    }

    // Validate channels is valid JSON (it comes as object if req.json() worked,
    // but if user sends stringified JSON in a field, we might need to parse.
    // Assuming the client sends a JSON object structure).
    // Prisma Json type expects an object/array.

    // 3. Upsert HomeWorkChannels
    const result = await prisma.lynxHomeWorkChannels.upsert({
      where: { guildId },
      update: { channels },
      create: { guildId, channels },
    });

    return NextResponse.json({
      message: "Configuration saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error saving HomeWorkChannels:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
