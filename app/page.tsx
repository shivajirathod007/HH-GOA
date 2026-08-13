"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { FormatType } from "@/types";

export default function LandingPage() {
  const router = useRouter();
  const [hoveredFormat, setHoveredFormat] = useState<FormatType | null>(null);

  function handleChooseFormat(format: FormatType) {
    router.push(`/editor?format=${format}`);
  }

  return (
    <main className="flex-1 flex flex-col relative bg-[#090310] min-h-screen">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep ambient glows */}
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] bg-brand-magenta mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full opacity-15 blur-[100px] bg-brand-yellow mix-blend-screen" />
        
        {/* Subtle noise texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
          }}
        />

        {/* Minimal grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(233, 30, 140, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(233, 30, 140, 1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24 z-10">
        
        {/* Logos Area */}
        <div className="flex flex-col items-center gap-6 mb-12 animate-fade-in-up">
          <div className="relative group">
            {/* Logo glow */}
            <div className="absolute inset-0 bg-brand-yellow/20 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Image 
              src="/assets/hacker-house-logo.png" 
              alt="Hacker House" 
              width={400} 
              height={82}
              className="relative drop-shadow-2xl brightness-110 object-contain w-64 md:w-80 lg:w-[400px]"
              priority
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-brand-magenta/30 blur-2xl rounded-full scale-125" />
            <Image 
              src="/assets/goa-logo.png" 
              alt="Goa" 
              width={160} 
              height={160}
              className="relative drop-shadow-xl animate-float object-contain w-28 md:w-36 lg:w-40"
              priority
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          
          {/* Main headline */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight drop-shadow-lg"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="text-white">Your Face. </span>
            <span className="gradient-text">Your Build. </span>
            <span className="text-brand-yellow">Your Goa.</span>
          </h1>

          {/* Tagline */}
          <p className="text-lg sm:text-xl text-gray-400 font-medium max-w-2xl mx-auto">
            Generate your official <span className="text-white">Hacker House Goa 2026</span> social graphic instantly.
            No signup. No data stored. Just pure vibes.
          </p>

          {/* Format Selection Cards */}
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto pt-8">
            {/* Format A — PFP Frame */}
            <button
              onClick={() => handleChooseFormat("A")}
              onMouseEnter={() => setHoveredFormat("A")}
              onMouseLeave={() => setHoveredFormat(null)}
              className="group relative text-left transition-all duration-500 ease-out hover:-translate-y-2"
              aria-label="Create PFP Frame - Format A"
            >
              <div className="absolute inset-0 bg-brand-magenta/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              <div className="relative bg-[#140a20] border border-brand-magenta/20 hover:border-brand-magenta/60 rounded-3xl p-6 sm:p-8 overflow-hidden backdrop-blur-sm transition-colors duration-500">
                {/* Preview mockup */}
                <div className="w-full aspect-square rounded-2xl mb-6 bg-black/40 flex items-center justify-center relative shadow-inner">
                  <div className="w-[75%] h-[75%] relative rounded-xl overflow-hidden border-2 border-brand-magenta/80 shadow-2xl shadow-brand-magenta/20">
                    <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-50 bg-[#1a1a2e]">
                      📸
                    </div>
                    {/* Bottom bar */}
                    <div className="absolute bottom-0 w-full h-8 bg-[#0D0515] flex items-center justify-between px-3 border-t border-brand-magenta/30">
                      <span className="text-[7px] font-bold text-brand-yellow font-serif">HACKER HOUSE</span>
                      <span className="text-[7px] font-bold text-brand-magenta">GOA 2026</span>
                    </div>
                    {/* Top/Side accents */}
                    <div className="absolute top-0 w-full h-1 bg-brand-yellow" />
                  </div>
                </div>

                <div className="flex flex-col gap-2 relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🖼️</span>
                    <h2 className="text-2xl font-bold text-white tracking-wide">PFP Frame</h2>
                  </div>
                  <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                    The classic square overlay. Perfect for updating your X profile picture.
                  </p>
                  <span className="inline-flex items-center justify-center bg-brand-magenta hover:bg-[#d8157a] text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-[0_0_20px_rgba(233,30,140,0.3)] group-hover:shadow-[0_0_30px_rgba(233,30,140,0.5)]">
                    Create Frame <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </button>

            {/* Format B — Builder Card */}
            <button
              onClick={() => handleChooseFormat("B")}
              onMouseEnter={() => setHoveredFormat("B")}
              onMouseLeave={() => setHoveredFormat(null)}
              className="group relative text-left transition-all duration-500 ease-out hover:-translate-y-2"
              aria-label="Create Builder Card - Format B"
            >
              <div className="absolute inset-0 bg-brand-yellow/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              <div className="relative bg-[#140a20] border border-brand-yellow/20 hover:border-brand-yellow/60 rounded-3xl p-6 sm:p-8 overflow-hidden backdrop-blur-sm transition-colors duration-500">
                {/* Preview mockup */}
                <div className="w-full aspect-square rounded-2xl mb-6 bg-black/40 flex items-center justify-center relative shadow-inner">
                  {/* Mini card preview */}
                  <div className="w-[65%] h-[90%] rounded-xl bg-[#0D0515] border border-white/10 flex flex-col items-center justify-between py-4 px-3 shadow-2xl shadow-brand-yellow/10">
                    <div className="text-center w-full">
                      <p className="text-[10px] font-bold text-brand-yellow font-serif leading-tight">HACKER HOUSE</p>
                      <p className="text-[7px] text-brand-magenta font-semibold tracking-widest mt-1">GOA 2026</p>
                      <div className="w-full h-px bg-brand-yellow/30 mt-2" />
                    </div>
                    <div className="w-16 h-16 rounded-xl bg-[#1a1a2e] border-2 border-brand-magenta flex items-center justify-center text-2xl shadow-lg mt-2">
                      📸
                    </div>
                    <div className="text-center w-full mt-3">
                      <p className="text-[10px] font-bold text-white mb-0.5">Your Name</p>
                      <p className="text-[7px] text-gray-400 font-mono mb-1.5">Full Stack Dev</p>
                      <p className="text-[8px] font-bold text-brand-yellow">⚡ Code Wizard</p>
                    </div>
                    <div className="w-full mt-2">
                      <div className="w-full h-px bg-brand-yellow/30 mb-1" />
                      <p className="text-[7px] text-brand-magenta text-center font-medium">#FrameInGoa</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🪪</span>
                    <h2 className="text-2xl font-bold text-white tracking-wide">Builder Card</h2>
                  </div>
                  <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                    A beautiful portrait card featuring your stack and auto-generated title.
                  </p>
                  <span className="inline-flex items-center justify-center bg-brand-yellow hover:bg-[#e6c200] text-black font-bold py-3 px-6 rounded-xl transition-colors shadow-[0_0_20px_rgba(255,215,0,0.2)] group-hover:shadow-[0_0_30px_rgba(255,215,0,0.4)]">
                    Create Card <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-white/5 bg-black/20 backdrop-blur-md relative z-10">
        <p className="text-sm text-gray-500 font-medium">
          Hacker House Goa 2026 •{" "}
          <span className="text-brand-magenta font-semibold tracking-wide">#FrameInGoa</span>
          {" "}• No data stored. Your photos are processed and never saved.
        </p>
      </footer>

      {/* Keyframes for simple animations without tailwind config changes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}} />
    </main>
  );
}
