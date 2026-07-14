import { SentimentLabel } from "@prisma/client";

// Very simple keyword-based sentiment analysis.
// This is a placeholder for Phase 1 and can be replaced with an ML model later.

const positiveKeywords = [
  "good",
  "great",
  "amazing",
  "love",
  "fast",
  "impressed",
  "awesome",
  "best",
  "powerful",
  "wow",
];

const negativeKeywords = [
  "bad",
  "slow",
  "hate",
  "terrible",
  "awful",
  "buggy",
  "broken",
  "worst",
  "disappointed",
  "meh",
];

export function analyzeSentiment(text: string): SentimentLabel {
  const lower = text.toLowerCase();

  let score = 0;
  for (const word of positiveKeywords) {
    if (lower.includes(word)) score += 1;
  }
  for (const word of negativeKeywords) {
    if (lower.includes(word)) score -= 1;
  }

  if (score > 0) return SentimentLabel.POSITIVE;
  if (score < 0) return SentimentLabel.NEGATIVE;
  return SentimentLabel.NEUTRAL;
}
