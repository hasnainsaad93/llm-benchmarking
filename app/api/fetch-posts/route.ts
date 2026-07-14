import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeSentiment } from "@/lib/sentiment";
import { LLMModel, SentimentLabel } from "@prisma/client";

// Phase 1 note:
// In a real app, this route would call the X (Twitter) API to fetch
// live posts mentioning Anthropic and OpenAI models. To keep this
// project runnable without external credentials or rate limits,
// we simulate a small batch of posts instead.

const SAMPLE_POSTS: { text: string; model: LLMModel }[] = [
  {
    text: "Really impressed with the latest OpenAI model, it's amazingly fast and accurate!",
    model: LLMModel.OPENAI,
  },
  {
    text: "Tried Anthropic's model today and the results were great, I love the safety features.",
    model: LLMModel.ANTHROPIC,
  },
  {
    text: "OpenAI was slow for my last query and the answers felt kinda meh.",
    model: LLMModel.OPENAI,
  },
  {
    text: "Anthropic model gave me bad responses, pretty disappointed this time.",
    model: LLMModel.ANTHROPIC,
  },
  {
    text: "Hard to say which is better, both OpenAI and Anthropic are solid choices.",
    model: LLMModel.OPENAI,
  },
];

export async function POST(_req: NextRequest) {
  try {
    const created = await prisma.$transaction(async (tx) => {
      const createdPosts = [] as { id: string; model: LLMModel; sentiment: SentimentLabel }[];

      for (const item of SAMPLE_POSTS) {
        const sentiment = analyzeSentiment(item.text);
        const post = await tx.post.create({
          data: {
            text: item.text,
            model: item.model,
            sentiment,
          },
        });
        createdPosts.push({ id: post.id, model: post.model, sentiment: post.sentiment });
      }

      return createdPosts;
    });

    return NextResponse.json({ ok: true, created });
  } catch (err) {
    console.error("/api/fetch-posts error", err);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch or store posts" },
      { status: 500 }
    );
  }
}
