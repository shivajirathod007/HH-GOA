"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Image as ImageIcon, IdCard, Zap } from "lucide-react";
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
        
        {/* Content */}
        <div className="relative max-w-5xl mx-auto text-center space-y-10 animate-fade-in-up">
          
          {/* Main Logo */}
          <div className="flex justify-center mb-6">
            <Image 
              src="/assets/hh-goa-logo-transparent.png"
              alt="Hacker House Goa 2026"
              width={800}
              height={240}
              className="w-full max-w-[800px] h-auto object-contain drop-shadow-2xl animate-float"
              priority
            />
          </div>

          {/* Event badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-magenta/10 border border-brand-magenta/30 text-brand-magenta text-sm font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(233,30,140,0.15)]">
            <span className="w-2 h-2 rounded-full bg-brand-magenta animate-pulse" />
            28–31 Oct 2026
          </div>

          {/* Main headline */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight drop-shadow-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="gradient-text-white">Your Face. </span>
            <span className="gradient-text-magenta">Your Build. </span>
            <span className="gradient-text-yellow">Your Goa.</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 font-medium max-w-4xl mx-auto leading-relaxed">
            Generate your official <span className="text-white font-semibold">Hacker House Goa 2026</span> social graphic
            instantly. No signup. No data stored. Just pure vibes.
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 sm:gap-12 text-base sm:text-lg text-gray-400 font-medium pt-4">
            <span className="flex items-center gap-2"><span className="text-brand-yellow font-black text-xl">300+</span> Hackers</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600"/>
            <span className="flex items-center gap-2"><span className="text-brand-magenta font-black text-xl">4</span> Days</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600"/>
            <span className="flex items-center gap-2"><span className="text-white font-black text-xl">∞</span> Vibes</span>
          </div>

          {/* Format Selection Cards */}
          <div className="grid sm:grid-cols-2 gap-8 sm:gap-12 max-w-5xl mx-auto pt-8">
            {/* Format A — PFP Frame */}
            <button
              onClick={() => handleChooseFormat("A")}
              onMouseEnter={() => setHoveredFormat("A")}
              onMouseLeave={() => setHoveredFormat(null)}
              className="group relative text-left transition-all duration-500 ease-out hover:-translate-y-3"
              aria-label="Create PFP Frame - Format A"
            >
              {/* Glow bloom */}
              <div className="absolute -inset-1 bg-brand-magenta/30 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-[36px]" />
              <div className="relative bg-gradient-to-b from-[#1c0d30] to-[#0f0620] border border-brand-magenta/25 group-hover:border-brand-magenta/70 rounded-[32px] overflow-hidden transition-all duration-500 shadow-2xl shadow-black/60">
                {/* Card shimmer top bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-magenta via-brand-yellow to-brand-magenta" />

                {/* Preview mockup */}
                <div className="p-6 pb-0">
                  <div className="w-full aspect-square rounded-2xl bg-[#080212] flex items-center justify-center relative overflow-hidden shadow-inner border border-white/5">
                    {/* Background ambient */}
                    <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-brand-magenta/20 blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-brand-yellow/10 blur-2xl" />
                    
                    {/* Mock frame card */}
                    <div className="relative w-[82%] h-[82%] rounded-2xl overflow-hidden border-2 border-brand-magenta shadow-[0_0_30px_rgba(233,30,140,0.35)]">
                      {/* Gradient bg + photo placeholder */}
                      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0d2e] to-[#0a0515] flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-[#2a1545] border-2 border-brand-magenta/40 flex items-center justify-center">
                          <Camera className="w-9 h-9 text-brand-magenta/60" strokeWidth={1.5} />
                        </div>
                      </div>
                      {/* Top border bar yellow */}
                      <div className="absolute top-0 w-full h-[6px] bg-brand-yellow" />
                      {/* Left border bar magenta */}
                      <div className="absolute left-0 h-full w-[6px] bg-brand-magenta" />
                      {/* Right border bar yellow */}
                      <div className="absolute right-0 h-full w-[6px] bg-brand-yellow" />
                      {/* Bottom bar */}
                      <div className="absolute bottom-0 w-full h-[6px] bg-brand-magenta" />
                      {/* Bottom text bar */}
                      <div className="absolute bottom-[6px] w-full bg-[#0D0515]/90 py-2 px-3 flex items-center justify-between border-t border-brand-magenta/20">
                        <span className="text-[8px] font-black text-brand-yellow tracking-widest" style={{fontFamily:"Georgia,serif"}}>HACKER HOUSE</span>
                        <span className="text-[8px] font-black text-brand-magenta tracking-wider">GOA 2026</span>
                      </div>
                      {/* Top label */}
                      <div className="absolute top-[6px] w-full flex items-center justify-center py-1">
                        <span className="text-[7px] font-bold text-white/50 tracking-[4px]">BUILD · BREAK · BOND</span>
                      </div>
                    </div>
                    {/* Corner tick marks */}
                    <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-brand-magenta/50 rounded-tl" />
                    <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-brand-yellow/50 rounded-tr" />
                    <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-brand-magenta/50 rounded-bl" />
                    <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-brand-yellow/50 rounded-br" />
                  </div>
                </div>

                <div className="flex flex-col gap-3 p-8 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-magenta/15 border border-brand-magenta/30 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-brand-magenta" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-wide">PFP Frame</h2>
                  </div>
                  <p className="text-base sm:text-lg text-gray-300 font-medium leading-relaxed mb-4">
                    Square overlay for X/Twitter. Wrap your photo in HH Goa 2026 branding instantly.
                  </p>
                  <div className="inline-flex items-center justify-center bg-gradient-to-r from-brand-magenta to-[#c4177a] text-white font-bold text-lg py-4 px-8 rounded-2xl transition-all shadow-[0_0_20px_rgba(233,30,140,0.25)] group-hover:shadow-[0_0_35px_rgba(233,30,140,0.55)] group-hover:scale-[1.02] duration-300">
                    Create Frame <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </div>
                </div>
              </div>
            </button>

            {/* Format B — Builder Card */}
            <button
              onClick={() => handleChooseFormat("B")}
              onMouseEnter={() => setHoveredFormat("B")}
              onMouseLeave={() => setHoveredFormat(null)}
              className="group relative text-left transition-all duration-500 ease-out hover:-translate-y-3"
              aria-label="Create Builder Card - Format B"
            >
              {/* Glow bloom */}
              <div className="absolute -inset-1 bg-brand-yellow/20 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-[36px]" />
              <div className="relative bg-gradient-to-b from-[#1c1405] to-[#0f0c02] border border-brand-yellow/20 group-hover:border-brand-yellow/60 rounded-[32px] overflow-hidden transition-all duration-500 shadow-2xl shadow-black/60">
                {/* Card shimmer top bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-yellow via-brand-magenta to-brand-yellow" />

                {/* Preview mockup */}
                <div className="p-6 pb-0">
                  <div className="w-full aspect-square rounded-2xl bg-[#080805] flex items-center justify-center relative overflow-hidden shadow-inner border border-white/5">
                    {/* Background ambient */}
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-brand-yellow/15 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-brand-magenta/10 blur-2xl" />

                    {/* Mini ID card preview */}
                    <div className="relative w-[58%] h-[88%] rounded-2xl bg-gradient-to-b from-[#13102a] to-[#0a0515] border border-white/10 shadow-2xl overflow-hidden flex flex-col items-center">
                      {/* Top accent border */}
                      <div className="w-full h-[5px] bg-gradient-to-r from-brand-yellow to-brand-magenta flex-shrink-0" />
                      
                      {/* Logo area */}
                      <div className="text-center pt-3 px-2 flex-shrink-0">
                        <p className="text-[9px] font-black text-brand-yellow tracking-[3px] leading-tight" style={{fontFamily:"Georgia,serif"}}>HACKER HOUSE</p>
                        <p className="text-[6px] text-brand-magenta font-black tracking-[5px] mt-0.5">GOA 2026</p>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-yellow/40 to-transparent mt-2" />
                      </div>

                      {/* Photo placeholder */}
                      <div className="w-16 h-16 rounded-xl bg-[#1a1a2e] border-2 border-brand-magenta/70 flex items-center justify-center mt-3 flex-shrink-0 shadow-[0_0_15px_rgba(233,30,140,0.3)]">
                        <Camera className="w-6 h-6 text-brand-magenta/70" strokeWidth={1.5} />
                      </div>

                      {/* Name + role */}
                      <div className="text-center px-2 mt-3 flex-shrink-0">
                        <p className="text-[10px] font-black text-white tracking-wide">Your Name</p>
                        <p className="text-[7px] text-gray-400 font-mono mt-0.5 tracking-wider">Full Stack Builder</p>
                      </div>

                      {/* Title badge */}
                      <div className="mt-2 px-2 py-0.5 rounded-full border border-brand-yellow/40 bg-brand-yellow/5 flex-shrink-0">
                        <p className="text-[7px] font-black text-brand-yellow tracking-wide flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5" /> Code Wizard
                        </p>
                      </div>

                      {/* Meta info area */}
                      <div className="w-full px-3 mt-auto mb-3">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-2" />
                        <p className="text-[6px] text-white/30 font-mono text-center tracking-widest">28–31 OCT · GOA INDIA</p>
                        <p className="text-[7px] text-brand-magenta text-center font-black tracking-widest mt-1">#FrameInGoa</p>
                      </div>

                      {/* Bottom bar */}
                      <div className="w-full h-[5px] bg-gradient-to-r from-brand-magenta to-brand-yellow flex-shrink-0" />
                    </div>

                    {/* Corner tick marks */}
                    <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-brand-yellow/50 rounded-tl" />
                    <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-brand-magenta/50 rounded-tr" />
                    <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-brand-yellow/50 rounded-bl" />
                    <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-brand-magenta/50 rounded-br" />
                  </div>
                </div>

                <div className="flex flex-col gap-3 p-8 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center">
                      <IdCard className="w-5 h-5 text-brand-yellow" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-wide">Builder Card</h2>
                  </div>
                  <p className="text-base sm:text-lg text-gray-300 font-medium leading-relaxed mb-4">
                    Portrait ID card with your photo, stack & an AI-generated hacker title.
                  </p>
                  <div className="inline-flex items-center justify-center bg-gradient-to-r from-brand-yellow to-[#e6c200] text-black font-black text-lg py-4 px-8 rounded-2xl transition-all shadow-[0_0_20px_rgba(255,215,0,0.15)] group-hover:shadow-[0_0_35px_rgba(255,215,0,0.45)] group-hover:scale-[1.02] duration-300">
                    Create Card <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </div>
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
