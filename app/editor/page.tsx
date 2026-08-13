"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import type { FormatType, CropData, BuilderTitle } from "@/types";
import { validateFileClient } from "@/lib/validation";
import { generateBuilderTitle } from "@/lib/title-generator";

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
        className={`upload-zone p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[200px] ${isDragOver ? "drag-over" : ""}`}
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
        <div className="text-5xl mb-4">📸</div>
        <p className="text-lg font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>
          Drop your photo here
        </p>
        <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
          or tap to choose • JPG, PNG, HEIC • Max 10MB
        </p>
        <span className="btn-primary btn-magenta text-sm py-2.5 px-6">
          Choose Photo
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
      {error && (
        <div
          className="mt-4 p-4 rounded-xl text-sm font-medium"
          role="alert"
          style={{
            background: "color-mix(in srgb, #ef4444 15%, transparent)",
            color: "#fca5a5",
            border: "1px solid color-mix(in srgb, #ef4444 30%, transparent)",
          }}
        >
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
  aspectRatio: number; // width/height
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
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl cursor-grab active:cursor-grabbing mx-auto"
        style={{
          aspectRatio: `${aspectRatio}`,
          maxWidth: aspectRatio >= 1 ? "400px" : `${400 * aspectRatio}px`,
          background: "var(--color-bg-surface)",
          border: "2px solid var(--color-bg-elevated)",
        }}
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
            transition: isDragging.current ? "none" : "transform 0.15s ease",
          }}
          draggable={false}
        />
        {/* Position indicator */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="text-xs px-2 py-1 rounded-md" style={{ background: "rgba(0,0,0,0.6)", color: "var(--color-text-secondary)" }}>
            Drag to reposition
          </span>
          <span className="text-xs px-2 py-1 rounded-md" style={{ background: "rgba(0,0,0,0.6)", color: "var(--color-text-secondary)" }}>
            {Math.round(crop.zoom * 100)}%
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-4 justify-center">
        {/* Zoom slider */}
        <label className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          <span>🔍</span>
          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={crop.zoom}
            onChange={(e) =>
              onCropChange({ ...crop, zoom: parseFloat(e.target.value) })
            }
            className="w-24 sm:w-32 accent-brand-magenta"
            aria-label="Zoom level"
          />
        </label>
        {/* Reset */}
        <button
          onClick={() => onCropChange({ x: 0, y: 0, zoom: 1 })}
          className="btn-primary btn-outline text-xs py-1.5 px-3"
          aria-label="Reset position and zoom"
        >
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
    <div className="w-full space-y-4">
      <div>
        <label
          htmlFor="builder-name"
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Your Name
        </label>
        <input
          id="builder-name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. Shivaji Rathod"
          maxLength={100}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
          style={{
            background: "var(--color-bg-surface)",
            color: "var(--color-text-primary)",
            border: "2px solid var(--color-bg-elevated)",
          }}
          onFocus={(e) =>
            (e.target.style.borderColor = "var(--color-brand-magenta)")
          }
          onBlur={(e) =>
            (e.target.style.borderColor = "var(--color-bg-elevated)")
          }
          required
        />
      </div>
      <div>
        <label
          htmlFor="builder-stack"
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Stack / Role
        </label>
        <input
          id="builder-stack"
          type="text"
          value={stack}
          onChange={(e) => onStackChange(e.target.value)}
          placeholder="e.g. Full Stack, AI, Security, Frontend"
          maxLength={100}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
          style={{
            background: "var(--color-bg-surface)",
            color: "var(--color-text-primary)",
            border: "2px solid var(--color-bg-elevated)",
          }}
          onFocus={(e) =>
            (e.target.style.borderColor = "var(--color-brand-magenta)")
          }
          onBlur={(e) =>
            (e.target.style.borderColor = "var(--color-bg-elevated)")
          }
          required
        />
      </div>
      <div>
        <p
          className="text-sm font-medium mb-1.5"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Builder Title
        </p>
        <div className="flex items-center gap-3">
          <div
            className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold"
            style={{
              background: "var(--color-bg-surface)",
              color: "var(--color-brand-yellow)",
              border: "2px solid var(--color-bg-elevated)",
            }}
          >
            {builderTitle.emoji} {builderTitle.title}
          </div>
          <button
            onClick={onRegenerateTitle}
            className="btn-primary btn-outline text-xs py-3 px-4"
            aria-label="Regenerate builder title"
            title="Regenerate title"
          >
            🔄
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Editor Component (wrapped in Suspense) ---
function EditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialFormat = (searchParams.get("format") as FormatType) || "A";

  const [format, setFormat] = useState<FormatType>(initialFormat);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropData>({ x: 0, y: 0, zoom: 1 });

  // Format B fields
  const [name, setName] = useState("");
  const [stack, setStack] = useState("");
  const [builderTitle, setBuilderTitle] = useState<BuilderTitle>({
    title: "Builder",
    emoji: "🔨",
  });

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedFilename, setGeneratedFilename] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Update builder title when stack changes
  useEffect(() => {
    if (stack.trim()) {
      setBuilderTitle(generateBuilderTitle(stack));
    }
  }, [stack]);

  const aspectRatio = format === "A" ? 1 : 1080 / 1350;

  function handleImageSelected(f: File, url: string) {
    setFile(f);
    setPreviewUrl(url);
    setCrop({ x: 0, y: 0, zoom: 1 });
    setGeneratedImage(null);
    setError(null);
  }

  function handleRegenerateTitle() {
    setBuilderTitle(generateBuilderTitle(stack || "general"));
  }

  function handleSwitchFormat(f: FormatType) {
    setFormat(f);
    setGeneratedImage(null);
    setError(null);
    setCrop({ x: 0, y: 0, zoom: 1 });
  }

  const handleGenerate = useCallback(async () => {
    if (!file) return;

    // Validate Format B fields
    if (format === "B") {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (!stack.trim()) {
        setError("Please enter your stack or role.");
        return;
      }
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

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

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setGeneratedImage(`data:${data.mimeType};base64,${data.imageBase64}`);
      setGeneratedFilename(data.filename);
    } catch {
      setError("Failed to generate image. Check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [file, format, crop, name, stack, builderTitle]);

  function handleDownload() {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = generatedFilename || `HHGoa-2026-${format === "A" ? "PFP" : "Builder"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleShareX() {
    const text = encodeURIComponent(
      `Built in Goa. Now framed for it. #FrameInGoa`
    );
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleStartOver() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setCrop({ x: 0, y: 0, zoom: 1 });
    setGeneratedImage(null);
    setError(null);
    setName("");
    setStack("");
  }

  return (
    <main className="flex-1 flex flex-col">
      {/* Top bar */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 backdrop-blur-xl"
        style={{
          background: "color-mix(in srgb, var(--color-bg-deep) 80%, transparent)",
          borderBottom: "1px solid var(--color-bg-elevated)",
        }}
      >
        <button
          onClick={() => router.push("/")}
          className="text-sm font-bold flex items-center gap-2"
          style={{ color: "var(--color-brand-yellow)", fontFamily: "var(--font-display)" }}
          aria-label="Back to home"
        >
          ← HH GOA
        </button>
        {/* Format toggle */}
        <div
          className="flex rounded-lg overflow-hidden"
          style={{ border: "1px solid var(--color-bg-elevated)" }}
        >
          <button
            onClick={() => handleSwitchFormat("A")}
            className="px-3 py-1.5 text-xs font-semibold transition-colors"
            style={{
              background:
                format === "A"
                  ? "var(--color-brand-magenta)"
                  : "transparent",
              color:
                format === "A"
                  ? "white"
                  : "var(--color-text-muted)",
            }}
          >
            PFP Frame
          </button>
          <button
            onClick={() => handleSwitchFormat("B")}
            className="px-3 py-1.5 text-xs font-semibold transition-colors"
            style={{
              background:
                format === "B"
                  ? "var(--color-brand-yellow)"
                  : "transparent",
              color:
                format === "B"
                  ? "var(--color-bg-deep)"
                  : "var(--color-text-muted)",
            }}
          >
            Builder Card
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 px-4 py-6 sm:py-10 max-w-lg mx-auto w-full">
        {/* Step 1: Upload */}
        {!previewUrl && (
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text-primary)",
              }}
            >
              {format === "A" ? "Create Your Frame" : "Create Builder Card"}
            </h1>
            <p className="mb-6 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Upload a photo to get started.{" "}
              {format === "A"
                ? "We'll wrap it in HH Goa 2026 branding."
                : "We'll create a builder ID card with your info."}
            </p>
            <ImageUploader onImageSelected={handleImageSelected} />
          </div>
        )}

        {/* Step 2: Adjust + (Form for B) */}
        {previewUrl && !generatedImage && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2
                className="text-xl font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-text-primary)",
                }}
              >
                Position Your Photo
              </h2>
              <button
                onClick={handleStartOver}
                className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  color: "var(--color-text-muted)",
                  background: "var(--color-bg-surface)",
                }}
              >
                Change Photo
              </button>
            </div>

            <ImagePositioner
              previewUrl={previewUrl}
              aspectRatio={aspectRatio}
              crop={crop}
              onCropChange={setCrop}
            />

            {/* Format B form */}
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

            {/* Error */}
            {error && (
              <div
                className="p-4 rounded-xl text-sm font-medium"
                role="alert"
                style={{
                  background: "color-mix(in srgb, #ef4444 15%, transparent)",
                  color: "#fca5a5",
                  border: "1px solid color-mix(in srgb, #ef4444 30%, transparent)",
                }}
              >
                {error}
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-primary btn-magenta w-full text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating...
                </span>
              ) : (
                `Generate ${format === "A" ? "Frame" : "Card"} ✨`
              )}
            </button>
          </div>
        )}

        {/* Step 3: Result */}
        {generatedImage && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2
                className="text-xl font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-text-primary)",
                }}
              >
                Your {format === "A" ? "Frame" : "Builder Card"} is Ready! 🎉
              </h2>
            </div>

            {/* Preview */}
            <div className="w-full flex justify-center">
              <img
                src={generatedImage}
                alt={`Your HH Goa 2026 ${format === "A" ? "PFP Frame" : "Builder Card"}`}
                className="w-full rounded-xl shadow-2xl"
                style={{
                  maxWidth: format === "A" ? "400px" : "320px",
                  border: "2px solid var(--color-bg-elevated)",
                }}
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownload}
                className="btn-primary btn-yellow flex-1 text-base py-3.5"
              >
                ⬇️ Download Image
              </button>
              <button
                onClick={handleShareX}
                className="btn-primary flex-1 text-base py-3.5"
                style={{
                  background: "#000000",
                  color: "white",
                  border: "2px solid #333",
                }}
              >
                𝕏 Share to X
              </button>
            </div>

            {/* Secondary actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => {
                  setGeneratedImage(null);
                  setError(null);
                }}
                className="btn-primary btn-outline flex-1 text-sm py-2.5"
              >
                ← Adjust & Regenerate
              </button>
              <button
                onClick={handleStartOver}
                className="btn-primary btn-outline flex-1 text-sm py-2.5"
              >
                🔄 Start Over
              </button>
            </div>

            {/* Share tip */}
            <div
              className="p-4 rounded-xl text-sm"
              style={{
                background: "var(--color-bg-surface)",
                color: "var(--color-text-secondary)",
                border: "1px solid var(--color-bg-elevated)",
              }}
            >
              <p className="font-semibold mb-1" style={{ color: "var(--color-brand-yellow)" }}>
                💡 Sharing Tip
              </p>
              <p>
                Download the image first, then attach it when composing your post on X for the best quality.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// --- Page with Suspense boundary for useSearchParams ---
export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="shimmer w-16 h-16 rounded-xl" />
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
