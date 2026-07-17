# LLM Sentiment Benchmark (Phases 1–2)

Runnable skeleton of a web app that benchmarks LLMs (OpenAI and Anthropic)
using social media-style sentiment.

Phase 1 focuses on:

- Project infrastructure (Next.js App Router, TypeScript, Prisma, PostgreSQL)
- Core data model for posts and sentiment
- Basic end-to-end flow:
  - Fetch a batch of sample posts (simulating x.com)
  - Analyze sentiment for each post
  - Store results in PostgreSQL via Prisma
  - Display aggregated benchmark metrics per model

Later phases will add real x.com fetching, user feedback, email verification,
and duplicate-prevention logic.

## Tech stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- PostgreSQL
- Prisma ORM

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure your database:

   - Create a PostgreSQL database.
   - Copy `.env.example` to `.env` and set `DATABASE_URL`.

3. Run Prisma migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

5. Open the app:

   - Visit `http://localhost:3000`.
   - Click "Run sample fetch & analysis".
   - The page will show a simple bar-style benchmark of positive/negative/neutral
     posts for the Anthropic and OpenAI models.

## Notes

- The `/api/fetch-posts` route currently **simulates** x.com posts with a
  small hard-coded batch so the project runs without external API keys.
- Sentiment analysis is a very small keyword-based heuristic in `lib/sentiment.ts`.
  It is intentionally simple and will be replaced by a better model in later
  phases.
- Only the core skeleton requested for Phase 1 is implemented here.

## Phase 2: User feedback collection form

Phase 2 adds a minimal feedback collection flow:

- New `Feedback` model in `prisma/schema.prisma` to store name, email, and
  preferred `LLMModel`.
- `/api/feedback` POST route to accept feedback submissions.
- A form on the main benchmark page that lets users submit their name, email,
  and preferred model (Anthropic or OpenAI).

Email verification and duplicate feedback prevention are **not** implemented
in this phase yet; they will be added in later phases of the roadmap.
