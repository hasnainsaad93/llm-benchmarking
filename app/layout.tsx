import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "LLM Sentiment Benchmark",
  description: "Benchmark Anthropic and OpenAI models based on social media sentiment.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
