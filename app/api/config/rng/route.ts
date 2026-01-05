import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { validateApiKey } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  try {
    const existingConfig = await prisma.lynxRngRigConfig?.findFirst();
    return NextResponse.json({
      ignoredNumbers: existingConfig?.ignoredNumbers || [],
    });
  } catch (error) {
    console.error("Error fetching RNG config:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let user: any = await validateApiKey(req);

    if (!user) {
      const session = await getServerSession(authOptions);
      if (session?.user?.id) {
        // Fetch full user to check lynxKey
        const dbUser = await prisma.user.findUnique({
          where: { id: session.user.id },
        });

        if (dbUser && dbUser.lynxKey) {
          user = dbUser;
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    let { ignoredNumbers } = body;

    // Convert string "1, 2, 3" to [1, 2, 3]
    if (typeof ignoredNumbers === "string") {
      if (!ignoredNumbers.trim()) {
        ignoredNumbers = [];
      } else {
        ignoredNumbers = ignoredNumbers
          .split(",")
          .map((num: string) => {
            const trimmed = num.trim();
            if (trimmed === "") return NaN;
            return Number(trimmed);
          })
          .filter((num: number) => !isNaN(num));
      }
    }

    if (!Array.isArray(ignoredNumbers)) {
      return NextResponse.json(
        { error: "Invalid format. Expected comma-separated numbers." },
        { status: 400 }
      );
    }

    // Use a fixed ID to allow upsert and singleton behavior
    const CONFIG_ID = "global_rng_config";

    await prisma.lynxRngRigConfig.upsert({
      where: { id: CONFIG_ID },
      update: { ignoredNumbers },
      create: {
        id: CONFIG_ID,
        ignoredNumbers,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving RNG config:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
