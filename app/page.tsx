"use client";

import { useEffect, useState } from "react";

interface SentimentCounts {
  POSITIVE: number;
  NEGATIVE: number;
  NEUTRAL: number;
}

interface BenchmarkRow {
  model: "OPENAI" | "ANTHROPIC";
  total: number;
  sentiment: SentimentCounts;
}

export default function HomePage() {
  const [benchmarks, setBenchmarks] = useState<BenchmarkRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("");
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackModel, setFeedbackModel] = useState<"OPENAI" | "ANTHROPIC">(
    "OPENAI"
  );

  async function loadBenchmarks() {
    setError(null);
    try {
      const res = await fetch("/api/benchmarks");
      const data = await res.json();
      setBenchmarks(data.rows ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load benchmarks");
    }
  }

  useEffect(() => {
    loadBenchmarks();
  }, []);

  async function runSampleFetch() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/fetch-posts", { method: "POST" });
      if (!res.ok) {
        throw new Error("Request failed");
      }
      await loadBenchmarks();
    } catch (err) {
      console.error(err);
      setError("Failed to fetch and analyze posts");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          LLM Sentiment Benchmark
        </h1>
        <p className="text-sm text-slate-300">
          Phase 1: runnable skeleton. Click the button below to fetch a batch of
          sample posts for Anthropic and OpenAI, analyze sentiment, and update
          the benchmark.
        </p>
      </header>

      <div className="flex items-center gap-4">
        <button
          onClick={runSampleFetch}
          disabled={loading}
          className="rounded bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
        >
          {loading ? "Running analysis..." : "Run sample fetch & analysis"}
        </button>
        <button
          onClick={loadBenchmarks}
          className="rounded border border-slate-600 px-3 py-2 text-xs text-slate-100 hover:bg-slate-800"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <section className="space-y-6">
        <h2 className="text-xl font-medium">Your preferred LLM</h2>
        <p className="text-sm text-slate-300">
          Tell us which model you currently prefer. This phase only collects
          your vote; later phases will add email verification and
          duplicate-prevention.
        </p>

        <form
          className="space-y-4 rounded border border-slate-800 bg-slate-900 p-4 text-sm"
          onSubmit={async (e) => {
            e.preventDefault();
            setFeedbackError(null);
            setFeedbackStatus("submitting");
            try {
              const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: feedbackName,
                  email: feedbackEmail,
                  model: feedbackModel,
                }),
              });
              if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to submit feedback");
              }
              setFeedbackStatus("success");
              setFeedbackName("");
              setFeedbackEmail("");
              setFeedbackModel("OPENAI");
            } catch (err: any) {
              console.error(err);
              setFeedbackStatus("error");
              setFeedbackError(err.message || "Failed to submit feedback");
            }
          }}
        >
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-200">
              Name
            </label>
            <input
              type="text"
              required
              value={feedbackName}
              onChange={(e) => setFeedbackName(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-200">
              Email
            </label>
            <input
              type="email"
              required
              value={feedbackEmail}
              onChange={(e) => setFeedbackEmail(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <span className="block text-xs font-medium text-slate-200">
              Preferred model
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs text-slate-200">
                <input
                  type="radio"
                  name="model"
                  value="OPENAI"
                  checked={feedbackModel === "OPENAI"}
                  onChange={() => setFeedbackModel("OPENAI")}
                />
                OpenAI
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-200">
                <input
                  type="radio"
                  name="model"
                  value="ANTHROPIC"
                  checked={feedbackModel === "ANTHROPIC"}
                  onChange={() => setFeedbackModel("ANTHROPIC")}
                />
                Anthropic
              </label>
            </div>
          </div>

          {feedbackError && (
            <p className="text-xs text-rose-400" role="alert">
              {feedbackError}
            </p>
          )}
          {feedbackStatus === "success" && (
            <p className="text-xs text-emerald-400">
              Thanks! Your preference has been recorded.
            </p>
          )}

          <button
            type="submit"
            disabled={feedbackStatus === "submitting"}
            className="rounded bg-emerald-500 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
          >
            {feedbackStatus === "submitting" ? "Submitting..." : "Submit"}
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Current benchmark</h2>
        {!benchmarks.length ? (
          <p className="text-sm text-slate-400">
            No data yet. Run a sample fetch to populate the benchmark.
          </p>
        ) : (
          <div className="space-y-4">
            {benchmarks.map((row) => (
              <div
                key={row.model}
                className="rounded border border-slate-800 bg-slate-900 p-4"
              >
                <div className="mb-2 flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold">
                    {row.model === "OPENAI" ? "OpenAI" : "Anthropic"}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {row.total} posts analyzed
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-200">
                  {(["POSITIVE", "NEGATIVE", "NEUTRAL"] as const).map(
                    (label) => {
                      const count = row.sentiment[label];
                      const percent = row.total
                        ? Math.round((count / row.total) * 100)
                        : 0;
                      return (
                        <div key={label} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>{label}</span>
                            <span className="text-slate-400">
                              {count} • {percent}%
                            </span>
                          </div>
                          <div className="h-2 w-full rounded bg-slate-800">
                            <div
                              className={`h-full rounded ${
                                label === "POSITIVE"
                                  ? "bg-emerald-500"
                                  : label === "NEGATIVE"
                                  ? "bg-rose-500"
                                  : "bg-slate-500"
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
