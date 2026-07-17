import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LLMModel } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const model = body.model as keyof typeof LLMModel | undefined;

    if (!name || !email || !model) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const normalizedModel = model.toUpperCase();
    if (!(normalizedModel in LLMModel)) {
      return NextResponse.json({ error: "Invalid model" }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        name,
        email,
        model: normalizedModel as LLMModel,
      },
    });

    return NextResponse.json({ id: feedback.id });
  } catch (err) {
    console.error("/api/feedback error", err);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
