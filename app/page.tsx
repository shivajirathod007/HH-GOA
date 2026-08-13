"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormatType } from "@/types";

export default function LandingPage() {
  const router = useRouter();
  const [hoveredFormat, setHoveredFormat] = useState<FormatType | null>(null);

  function handleChooseFormat(format: FormatType) {
    router.push(`/editor?format=${format}`);
  }

  return (
    <main className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 blur-3xl"
            style={{ background: "var(--color-brand-magenta)" }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10 blur-3xl"
            style={{ background: "var(--color-brand-yellow)" }}
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-brand-magenta) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand-magenta) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Event badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
            style={{
              background: "color-mix(in srgb, var(--color-brand-magenta) 15%, transparent)",
              border: "1px solid color-mix(in srgb, var(--color-brand-magenta) 30%, transparent)",
              color: "var(--color-brand-magenta-light)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-brand-magenta animate-pulse" />
            HACKER HOUSE GOA 2026
          </div>

          {/* Main headline */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="block" style={{ color: "var(--color-text-primary)" }}>
              Your Face.
            </span>
            <span className="block gradient-text">Your Build.</span>
            <span
              className="block"
              style={{ color: "var(--color-brand-yellow)" }}
            >
              Your Goa.
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-lg sm:text-xl mb-12 max-w-xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            Turn your photo into a share-ready Hacker House Goa 2026 graphic.
            No signup. No login. Just vibes.
          </p>

          {/* Format Selection Cards */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
            {/* Format A — PFP Frame */}
            <button
              onClick={() => handleChooseFormat("A")}
              onMouseEnter={() => setHoveredFormat("A")}
              onMouseLeave={() => setHoveredFormat(null)}
              className="group card p-6 sm:p-8 text-left transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              style={{
                borderColor:
                  hoveredFormat === "A"
                    ? "var(--color-brand-magenta)"
                    : undefined,
                boxShadow:
                  hoveredFormat === "A"
                    ? "0 0 40px color-mix(in srgb, var(--color-brand-magenta) 20%, transparent)"
                    : undefined,
              }}
              aria-label="Create PFP Frame - Format A"
            >
              {/* Preview mockup */}
              <div className="w-full aspect-square rounded-xl mb-5 flex items-center justify-center overflow-hidden relative"
                style={{ background: "var(--color-bg-surface)" }}
              >
                {/* Mini frame preview */}
                <div className="w-4/5 h-4/5 relative rounded-lg overflow-hidden" style={{ border: "3px solid var(--color-brand-magenta)" }}>
                  <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-40">
                    📸
                  </div>
                  {/* Bottom bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-between px-2"
                    style={{ background: "var(--color-bg-deep)" }}
                  >
                    <span className="text-[8px] font-bold" style={{ color: "var(--color-brand-yellow)", fontFamily: "var(--font-display)" }}>
                      HACKER HOUSE
                    </span>
                    <span className="text-[8px] font-bold" style={{ color: "var(--color-brand-magenta)" }}>
                      GOA 2026
                    </span>
                  </div>
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "var(--color-brand-yellow)" }} />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🖼️</span>
                <h2
                  className="text-xl font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  PFP Frame
                </h2>
              </div>
              <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
                Your photo + HH Goa 2026 frame. Perfect for your X profile picture.
              </p>
              <span className="btn-primary btn-magenta text-sm py-2.5 px-5 group-hover:shadow-lg">
                Create Your Frame →
              </span>
            </button>

            {/* Format B — Builder Card */}
            <button
              onClick={() => handleChooseFormat("B")}
              onMouseEnter={() => setHoveredFormat("B")}
              onMouseLeave={() => setHoveredFormat(null)}
              className="group card p-6 sm:p-8 text-left transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              style={{
                borderColor:
                  hoveredFormat === "B"
                    ? "var(--color-brand-yellow)"
                    : undefined,
                boxShadow:
                  hoveredFormat === "B"
                    ? "0 0 40px color-mix(in srgb, var(--color-brand-yellow) 15%, transparent)"
                    : undefined,
              }}
              aria-label="Create Builder Card - Format B"
            >
              {/* Preview mockup */}
              <div className="w-full aspect-square rounded-xl mb-5 flex items-center justify-center overflow-hidden relative"
                style={{ background: "var(--color-bg-surface)" }}
              >
                {/* Mini card preview */}
                <div className="w-3/4 h-[90%] rounded-lg flex flex-col items-center justify-between py-3 px-3"
                  style={{ background: "var(--color-bg-deep)", border: "2px solid var(--color-bg-elevated)" }}
                >
                  <div>
                    <p className="text-[9px] font-bold text-center" style={{ color: "var(--color-brand-yellow)", fontFamily: "var(--font-display)" }}>
                      HACKER HOUSE
                    </p>
                    <p className="text-[7px] text-center" style={{ color: "var(--color-brand-magenta)" }}>
                      GOA 2026
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl" style={{ background: "var(--color-bg-surface)", border: "2px solid var(--color-brand-magenta)" }}>
                    📸
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-bold text-white">Your Name</p>
                    <p className="text-[7px]" style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                      your-stack
                    </p>
                    <p className="text-[8px] font-bold mt-0.5" style={{ color: "var(--color-brand-yellow)" }}>
                      ⚡ Builder Title
                    </p>
                  </div>
                  <p className="text-[7px]" style={{ color: "var(--color-brand-magenta)" }}>
                    #FrameInGoa
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🪪</span>
                <h2
                  className="text-xl font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Builder Card
                </h2>
              </div>
              <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
                Your photo + name + stack + builder title. Designed for posting on X.
              </p>
              <span className="btn-primary btn-yellow text-sm py-2.5 px-5 group-hover:shadow-lg">
                Create Builder Card →
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 text-center border-t" style={{ borderColor: "var(--color-bg-elevated)" }}>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Hacker House Goa 2026 •{" "}
          <span style={{ color: "var(--color-brand-magenta)" }}>#FrameInGoa</span>
          {" "}• No data stored. Your photos are processed and never saved.
        </p>
      </footer>
    </main>
  );
}
