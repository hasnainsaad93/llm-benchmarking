import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LLMModel, SentimentLabel } from "@prisma/client";

interface SentimentCounts {
  POSITIVE: number;
  NEGATIVE: number;
  NEUTRAL: number;
}

export async function GET(_req: NextRequest) {
  try {
    const rows = await prisma.post.groupBy({
      by: ["model", "sentiment"],
      _count: { _all: true },
    });

    const map = new Map<LLMModel, SentimentCounts>();

    for (const row of rows) {
      const current =
        map.get(row.model) ??
        ({ POSITIVE: 0, NEGATIVE: 0, NEUTRAL: 0 } as SentimentCounts);

      current[row.sentiment as SentimentLabel] = row._count._all;
      map.set(row.model, current);
    }

    const result = Array.from(map.entries()).map(([model, counts]) => ({
      model,
      sentiment: counts,
      total: counts.POSITIVE + counts.NEGATIVE + counts.NEUTRAL,
    }));

    return NextResponse.json({ rows: result });
  } catch (err) {
    console.error("/api/benchmarks error", err);
    return NextResponse.json(
      { error: "Failed to load benchmarks" },
      { status: 500 }
    );
  }
}
