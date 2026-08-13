"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import type { FormatType, CropData, BuilderTitle } from "@/types";
import { validateFileClient } from "@/lib/validation";
import { generateBuilderTitle } from "@/lib/title-generator";
import { 
  UploadCloud, 
  Search, 
  RefreshCw, 
  Sparkles, 
  Download, 
  ArrowLeft, 
  RotateCcw, 
  Lightbulb, 
  PartyPopper,
  Image as ImageIcon,
  IdCard,
  Loader2,
  Wand2
} from "lucide-react";

// --- Custom X (Twitter) Icon ---
const XIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.007 4.076H5.036z" />
  </svg>
);

// --- Image Uploader Component ---
function ImageUploader({
  onImageSelected,
}: {
  onImageSelected: (file: File, previewUrl: string) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setError(null);
    const result = validateFileClient(file);
    if (!result.valid) {
      setError(result.error || "Invalid file.");
      return;
    }
    const url = URL.createObjectURL(file);
    onImageSelected(file, url);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="w-full">
      <div
        className={`relative group rounded-3xl p-1 overflow-hidden transition-all duration-500 ${isDragOver ? "scale-[1.02]" : ""}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-r from-brand-magenta to-brand-yellow opacity-20 blur-xl transition-opacity duration-500 ${isDragOver ? "opacity-60" : "group-hover:opacity-40"}`} />
        <div
          className={`relative flex flex-col items-center justify-center text-center min-h-[260px] rounded-[22px] border-2 border-dashed transition-colors duration-300 backdrop-blur-sm ${
            isDragOver 
              ? "border-brand-magenta bg-brand-magenta/10" 
              : "border-white/10 bg-[#140a20]/80 hover:border-brand-magenta/40 hover:bg-[#140a20]"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload your photo"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
        >
          <div className="w-20 h-20 mb-6 rounded-full bg-[#1a1a2e] border border-white/5 shadow-inner flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <UploadCloud className="w-10 h-10 text-brand-magenta opacity-90" strokeWidth={1.5} />
          </div>
          <p className="text-xl font-bold mb-2 text-white tracking-wide">
            Drop your photo here
          </p>
          <p className="text-sm mb-6 text-gray-400 font-medium">
            or tap to choose • JPG, PNG, HEIC • Max 10MB
          </p>
          <span className="inline-flex items-center gap-2 bg-brand-magenta hover:bg-[#d8157a] text-white font-semibold py-2.5 px-8 rounded-xl transition-colors shadow-[0_0_15px_rgba(233,30,140,0.3)] group-hover:shadow-[0_0_25px_rgba(233,30,140,0.5)]">
            <Search className="w-4 h-4" /> Browse Files
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif"
            className="hidden"
            onChange={handleChange}
            aria-label="Choose photo file"
          />
        </div>
      </div>
      {error && (
        <div className="mt-4 p-4 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {error}
        </div>
      )}
    </div>
  );
}

// --- Image Positioner Component ---
function ImagePositioner({
  previewUrl,
  aspectRatio,
  crop,
  onCropChange,
}: {
  previewUrl: string;
  aspectRatio: number;
  crop: CropData;
  onCropChange: (crop: CropData) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, cropX: 0, cropY: 0 });

  function handlePointerDown(e: React.PointerEvent) {
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      cropX: crop.x,
      cropY: crop.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = (e.clientX - dragStart.current.x) / rect.width;
    const dy = (e.clientY - dragStart.current.y) / rect.height;
    onCropChange({
      ...crop,
      x: Math.max(-1, Math.min(1, dragStart.current.cropX + dx * 2)),
      y: Math.max(-1, Math.min(1, dragStart.current.cropY + dy * 2)),
    });
  }

  function handlePointerUp() {
    isDragging.current = false;
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    onCropChange({
      ...crop,
      zoom: Math.max(1, Math.min(5, crop.zoom + delta)),
    });
  }

  return (
    <div className="w-full">
      <div className="relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent">
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden rounded-xl cursor-grab active:cursor-grabbing mx-auto bg-[#1a1a2e] shadow-2xl shadow-black/50"
          style={{ aspectRatio: `${aspectRatio}` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          role="application"
          aria-label="Drag to reposition your photo, scroll to zoom"
        >
          <img
            src={previewUrl}
            alt="Your photo preview"
            className="absolute w-full h-full select-none pointer-events-none"
            style={{
              objectFit: "cover",
              objectPosition: `${50 + crop.x * 50}% ${50 + crop.y * 50}%`,
              transform: `scale(${crop.zoom})`,
              transition: isDragging.current ? "none" : "transform 0.15s ease-out",
            }}
            draggable={false}
          />
          {/* Position indicator */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none opacity-80">
            <span className="text-xs px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-gray-300 font-medium border border-white/10 shadow-lg">
              Drag to pan
            </span>
            <span className="text-xs px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-brand-yellow font-bold border border-white/10 shadow-lg flex items-center gap-1">
              <Search className="w-3 h-3" />
              {Math.round(crop.zoom * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-6 justify-center bg-[#140a20] py-3 px-6 rounded-2xl border border-white/5 w-fit mx-auto shadow-lg">
        {/* Zoom slider */}
        <label className="flex items-center gap-3 text-sm text-gray-400">
          <Search className="w-4 h-4 text-brand-magenta" />
          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={crop.zoom}
            onChange={(e) =>
              onCropChange({ ...crop, zoom: parseFloat(e.target.value) })
            }
            className="w-24 sm:w-32 accent-brand-magenta h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
            aria-label="Zoom level"
          />
        </label>
        <div className="w-px h-6 bg-white/10 mx-2" />
        {/* Reset */}
        <button
          onClick={() => onCropChange({ x: 0, y: 0, zoom: 1 })}
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          aria-label="Reset position and zoom"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
}

// --- Builder Form Component ---
function BuilderForm({
  name,
  stack,
  builderTitle,
  onNameChange,
  onStackChange,
  onRegenerateTitle,
}: {
  name: string;
  stack: string;
  builderTitle: BuilderTitle;
  onNameChange: (v: string) => void;
  onStackChange: (v: string) => void;
  onRegenerateTitle: () => void;
}) {
  return (
    <div className="w-full space-y-5 bg-[#140a20]/80 p-6 sm:p-8 rounded-3xl border border-white/5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2">
        <IdCard className="w-5 h-5 text-brand-yellow" />
        <h3 className="text-lg font-bold text-white">Builder Details</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="builder-name" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Your Name
          </label>
          <input
            id="builder-name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Shivaji Rathod"
            maxLength={100}
            className="w-full px-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all bg-[#1a1a2e] text-white border border-white/10 focus:border-brand-yellow focus:shadow-[0_0_15px_rgba(255,215,0,0.15)] placeholder:text-gray-600"
            required
          />
        </div>
        <div>
          <label htmlFor="builder-stack" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Stack / Role
          </label>
          <input
            id="builder-stack"
            type="text"
            value={stack}
            onChange={(e) => onStackChange(e.target.value)}
            placeholder="e.g. Full Stack, AI, Security"
            maxLength={100}
            className="w-full px-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all bg-[#1a1a2e] text-white border border-white/10 focus:border-brand-magenta focus:shadow-[0_0_15px_rgba(233,30,140,0.15)] placeholder:text-gray-600"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Generated Title
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1 px-4 py-3.5 rounded-xl text-sm font-bold bg-[#1a1a2e] border border-brand-yellow/30 text-brand-yellow shadow-inner flex items-center gap-2">
              <Wand2 className="w-4 h-4 opacity-70" />
              {builderTitle.emoji} {builderTitle.title}
            </div>
            <button
              onClick={onRegenerateTitle}
              className="flex items-center justify-center w-[52px] h-[52px] rounded-xl bg-[#1a1a2e] border border-white/10 hover:border-brand-yellow hover:bg-[#1a1a2e]/80 text-gray-400 hover:text-brand-yellow transition-all hover:rotate-180 duration-500 shadow-md"
              aria-label="Regenerate builder title"
              title="Regenerate title"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Editor Component ---
function EditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialFormat = (searchParams.get("format") as FormatType) || "A";

  const [format, setFormat] = useState<FormatType>(initialFormat);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropData>({ x: 0, y: 0, zoom: 1 });

  const [name, setName] = useState("");
  const [stack, setStack] = useState("");
  const [builderTitle, setBuilderTitle] = useState<BuilderTitle>({
    title: "Builder",
    emoji: "🚀",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedPdf, setGeneratedPdf] = useState<string | null>(null);
  const [generatedFilename, setGeneratedFilename] = useState<string>("");
  const [generatedPdfFilename, setGeneratedPdfFilename] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (stack.trim()) setBuilderTitle(generateBuilderTitle(stack));
  }, [stack]);

  const aspectRatio = format === "A" ? 1 : 1080 / 1350;

  function handleImageSelected(f: File, url: string) {
    setFile(f);
    setPreviewUrl(url);
    setCrop({ x: 0, y: 0, zoom: 1 });
    setGeneratedImage(null);
    setGeneratedPdf(null);
    setError(null);
  }

  function handleRegenerateTitle() {
    setBuilderTitle(generateBuilderTitle(stack || "general"));
  }

  function handleSwitchFormat(f: FormatType) {
    setFormat(f);
    setGeneratedImage(null);
    setGeneratedPdf(null);
    setError(null);
    setCrop({ x: 0, y: 0, zoom: 1 });
  }

  const handleGenerate = useCallback(async () => {
    if (!file) return;

    if (format === "B") {
      if (!name.trim()) { setError("Please enter your name."); return; }
      if (!stack.trim()) { setError("Please enter your stack or role."); return; }
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedPdf(null);

    try {
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("format", format);
      formData.append("cropX", String(crop.x));
      formData.append("cropY", String(crop.y));
      formData.append("cropZoom", String(crop.zoom));

      if (format === "B") {
        formData.append("name", name.trim());
        formData.append("stack", stack.trim());
        formData.append("title", `${builderTitle.emoji} ${builderTitle.title}`);
      }

      const res = await fetch("/api/generate", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setGeneratedImage(`data:${data.mimeType};base64,${data.imageBase64}`);
      if (data.pdfBase64) {
        setGeneratedPdf(`data:application/pdf;base64,${data.pdfBase64}`);
        setGeneratedPdfFilename(data.pdfFilename);
      }
      setGeneratedFilename(data.filename);
    } catch {
      setError("Failed to generate image. Check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [file, format, crop, name, stack, builderTitle]);

  function handleDownload(type: 'png' | 'jpg' | 'pdf') {
    if (type === 'pdf' && generatedPdf) {
      const link = document.createElement("a");
      link.href = generatedPdf;
      link.download = generatedPdfFilename || `HHGoa-2026-Print.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    if (!generatedImage) return;

    if (type === 'jpg') {
      // Convert PNG to JPG via canvas
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = "#0D0515"; // Dark background to replace transparent areas
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          const jpgUrl = canvas.toDataURL('image/jpeg', 0.95);
          
          const link = document.createElement("a");
          link.href = jpgUrl;
          link.download = generatedFilename.replace('.png', '.jpg');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      };
      img.src = generatedImage;
      return;
    }

    // Default PNG
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = generatedFilename || `HHGoa-2026-${format === "A" ? "PFP" : "Builder"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleShareX() {
    const text = encodeURIComponent(`Built in Goa. See you at HH Goa 2026. #FrameInGoa\n\nCreate yours: https://hhgoa-framelab.com`);
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleStartOver() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setCrop({ x: 0, y: 0, zoom: 1 });
    setGeneratedImage(null);
    setGeneratedPdf(null);
    setError(null);
    setName("");
    setStack("");
  }

  return (
    <main className="flex-1 flex flex-col relative bg-[#090310] min-h-screen">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden fixed">
        <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] rounded-full opacity-10 blur-[100px] bg-brand-magenta mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] bg-brand-yellow mix-blend-screen" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(233,30,140,1) 1px, transparent 1px), linear-gradient(90deg, rgba(233,30,140,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* Top bar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4 bg-[#090310]/80 backdrop-blur-xl border-b border-white/5 shadow-sm">
        <button
          onClick={() => router.push("/")}
          className="text-sm font-bold flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-4 h-4" /> HH GOA
        </button>
        
        {/* Format toggle */}
        <div className="flex rounded-xl bg-[#140a20] p-1 border border-white/5 shadow-inner">
          <button
            onClick={() => handleSwitchFormat("A")}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              format === "A" ? "bg-brand-magenta text-white shadow-md" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> PFP
          </button>
          <button
            onClick={() => handleSwitchFormat("B")}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              format === "B" ? "bg-brand-yellow text-black shadow-md" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <IdCard className="w-3.5 h-3.5" /> Card
          </button>
        </div>
      </nav>

      {/* ── Step 1: Upload — always narrow centered ── */}
      {!previewUrl && !generatedImage && (
        <div className="flex-1 px-4 py-8 sm:py-12 max-w-lg mx-auto w-full relative z-10 animate-fade-in-up">
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                {format === "A" ? "Frame Your Photo" : "Build Your Identity"}
              </h1>
              <p className="text-gray-400 text-sm">
                {format === "A" ? "Upload a picture to wrap in HH Goa 2026 branding." : "Upload a photo to generate your custom builder ID card."}
              </p>
            </div>
            <ImageUploader onImageSelected={handleImageSelected} />
          </div>
        </div>
      )}

      {/* ── Step 2: Adjust + Form — two-col on desktop ── */}
      {previewUrl && !generatedImage && (
        <div className="flex-1 relative z-10 animate-fade-in-up w-full">
          {/* Header row */}
          <div className="flex items-center justify-between px-4 sm:px-8 pt-8 pb-4 max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Position Photo
            </h2>
            <button
              onClick={handleStartOver}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors border border-white/5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Change
            </button>
          </div>

          {/*
            lg+: [photo positioner | form + generate btn]
            <lg: stacked column
          */}
          <div className="px-4 sm:px-8 pb-12 max-w-5xl mx-auto lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start flex flex-col gap-8">

            {/* ── LEFT: photo positioner ── */}
            <div className="flex flex-col items-center">
              <ImagePositioner
                previewUrl={previewUrl}
                aspectRatio={aspectRatio}
                crop={crop}
                onCropChange={setCrop}
              />
            </div>

            {/* ── RIGHT: form + generate ── */}
            <div className="flex flex-col gap-6">
              {format === "B" && (
                <BuilderForm
                  name={name}
                  stack={stack}
                  builderTitle={builderTitle}
                  onNameChange={setName}
                  onStackChange={setStack}
                  onRegenerateTitle={handleRegenerateTitle}
                />
              )}

              {/* Hint card (Format A has no form, show a tip instead) */}
              {format === "A" && (
                <div className="p-5 rounded-2xl bg-[#140a20] border border-white/5 flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-xl bg-brand-magenta/10 border border-brand-magenta/20 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-brand-magenta" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm mb-0.5">Positioning tip</p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Drag to pan and scroll (or use the slider) to zoom. Your photo fills the full frame — center your face for the best result.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full flex items-center justify-center gap-2 font-bold text-lg py-4 rounded-2xl transition-all shadow-lg ${
                  format === "A"
                    ? "bg-brand-magenta hover:bg-[#d8157a] text-white shadow-[0_0_20px_rgba(233,30,140,0.3)] hover:shadow-[0_0_30px_rgba(233,30,140,0.5)]"
                    : "bg-brand-yellow hover:bg-[#e6c200] text-black shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)]"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isGenerating ? (
                  <><Loader2 className="w-6 h-6 animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> Generate {format === "A" ? "Frame" : "Card"}</>
                )}
              </button>

              {/* Event info card — desktop only */}
              <div className="hidden lg:flex flex-col gap-3 p-5 rounded-2xl bg-[#140a20] border border-white/5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Event Info</p>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Event</span>
                    <span className="text-white font-semibold">Hacker House Goa 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dates</span>
                    <span className="text-white font-semibold">28 – 31 Oct 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format</span>
                    <span className="text-white font-semibold">{format === "A" ? "PFP Frame (1080×1080)" : "Builder Card (1080×1620)"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hashtag</span>
                    <span className="text-brand-magenta font-bold">#FrameInGoa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Result — responsive two-column on desktop ── */}
      {generatedImage && (
        <div className="flex-1 relative z-10 animate-fade-in-up w-full">

          {/* Page title row (always full-width) */}
          <div className="text-center pt-8 pb-6 px-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-brand-magenta/30 to-brand-yellow/20 text-brand-yellow mb-3 border border-brand-yellow/30 shadow-[0_0_24px_rgba(255,215,0,0.2)]">
              <PartyPopper className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Your {format === "A" ? "Frame" : "Card"} is Ready!
            </h2>
            <p className="text-sm text-gray-500 mt-1">Looking fire. Download and flex it. 🔥</p>
          </div>

          {/*
            Two-column on lg+:  [card preview | actions]
            Single column below lg: [card preview] then [actions]
          */}
          <div className="px-4 pb-12 max-w-5xl mx-auto lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start flex flex-col gap-8">

            {/* ── LEFT / TOP — Card preview ── */}
            <div className="flex flex-col items-center gap-4">
              {/* Glow + image — constrained properly on all screen sizes */}
              <div className="relative w-full flex justify-center">
                {/* Glow blob */}
                <div
                  className={`absolute blur-3xl opacity-30 pointer-events-none rounded-full ${format === "A" ? "bg-brand-magenta" : "bg-brand-yellow"}`}
                  style={{ inset: "10% 20%" }}
                />
                {/* Gradient border wrapper — must not overflow viewport */}
                <div
                  className={`relative rounded-3xl p-[3px] shadow-2xl bg-gradient-to-b ${format === "A" ? "from-brand-magenta/60 to-brand-yellow/25" : "from-brand-yellow/60 to-brand-magenta/25"} w-full`}
                  style={{ maxWidth: format === "A" ? "420px" : "300px" }}
                >
                  <img
                    src={generatedImage}
                    alt={`Your HH Goa 2026 ${format === "A" ? "PFP Frame" : "Builder Card"}`}
                    className="rounded-[22px] w-full block"
                  />
                </div>
              </div>

              {/* Adjust / Start over */}
              <div
                className="grid grid-cols-2 gap-3 w-full"
                style={{ maxWidth: format === "A" ? "420px" : "300px" }}
              >
                <button
                  onClick={() => { setGeneratedImage(null); setError(null); }}
                  className="flex items-center justify-center gap-2 text-sm font-bold py-3 bg-[#140a20] hover:bg-[#1c1030] border border-white/10 hover:border-brand-magenta/40 rounded-2xl text-gray-300 hover:text-white transition-all"
                >
                  <RotateCcw className="w-4 h-4" /> Adjust
                </button>
                <button
                  onClick={handleStartOver}
                  className="flex items-center justify-center gap-2 text-sm font-bold py-3 bg-[#140a20] hover:bg-[#1c1030] border border-white/10 hover:border-brand-yellow/40 rounded-2xl text-gray-300 hover:text-white transition-all"
                >
                  <RefreshCw className="w-4 h-4" /> Start Over
                </button>
              </div>
            </div>

            {/* ── RIGHT / BOTTOM — Actions panel ── */}
            <div className="flex flex-col gap-5 w-full lg:pt-2">

              {/* Section label */}
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Download</p>

              {/* PNG / JPG / PDF */}
              <div className="grid grid-cols-3 gap-3">
                {(['png', 'jpg', 'pdf'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleDownload(type)}
                    disabled={type === 'pdf' && !generatedPdf}
                    className="group flex flex-col items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm transition-all bg-gradient-to-b from-brand-yellow to-[#e6c200] text-black shadow-[0_0_16px_rgba(255,215,0,0.15)] hover:shadow-[0_0_28px_rgba(255,215,0,0.45)] hover:scale-[1.04] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Share to X */}
              <button
                onClick={handleShareX}
                className="w-full flex items-center justify-center gap-2.5 bg-black hover:bg-[#0d0d0d] text-white font-black text-base py-4 px-6 rounded-2xl border-2 border-[#222] hover:border-brand-magenta transition-all shadow-lg hover:shadow-[0_0_24px_rgba(233,30,140,0.25)]"
              >
                <XIcon className="w-5 h-5" /> Share to X
              </button>

              {/* Divider */}
              <div className="h-px bg-white/5" />

              {/* Sharing tip */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-yellow/5 to-transparent border border-brand-yellow/15 flex gap-3 items-start">
                <div className="w-8 h-8 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4 text-brand-yellow" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm mb-0.5">Sharing Tip</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Download first, then attach the image when composing on X for the best quality.
                  </p>
                </div>
              </div>

              {/* Extra info card — desktop only adds context */}
              <div className="hidden lg:flex flex-col gap-3 p-5 rounded-2xl bg-[#140a20] border border-white/5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">About this card</p>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Event</span>
                    <span className="text-white font-semibold">Hacker House Goa 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dates</span>
                    <span className="text-white font-semibold">28 – 31 Oct 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format</span>
                    <span className="text-white font-semibold">{format === "A" ? "PFP Frame (1080×1080)" : "Builder Card (1080×1620)"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hashtag</span>
                    <span className="text-brand-magenta font-bold">#FrameInGoa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-screen bg-[#090310]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-brand-magenta animate-spin" />
            <span className="text-gray-400 font-medium">Loading Editor...</span>
          </div>
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
