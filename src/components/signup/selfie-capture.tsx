"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Upload, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SelfieCaptureProps {
  preview?: string;
  fileName?: string;
  onCapture: (file: File, preview: string) => void;
  onClear: () => void;
}

export function SelfieCapture({ preview, fileName, onCapture, onClear }: SelfieCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [mode, setMode] = useState<"choose" | "camera">("choose");
  const [cameraError, setCameraError] = useState("");

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const startCamera = async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setMode("camera");
    } catch {
      setCameraError("Camera access denied or unavailable. Please upload a photo instead.");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" });
        onCapture(file, dataUrl);
        stopCamera();
        setMode("choose");
      },
      "image/jpeg",
      0.9
    );
  };

  const handleUpload = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onCapture(file, reader.result as string);
    reader.readAsDataURL(file);
  };

  if (preview) {
    return (
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-xl border border-slate-200 mx-auto max-w-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Selfie verification" className="w-full aspect-[3/4] object-cover" />
          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3">
            <span className="text-xs text-slate-600 truncate">{fileName}</span>
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Retake
            </button>
          </div>
        </div>
        <p className="text-center text-sm text-emerald-600 font-medium">Selfie captured successfully</p>
      </div>
    );
  }

  if (mode === "camera") {
    return (
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-black mx-auto max-w-sm">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full aspect-[3/4] object-cover [transform:scaleX(-1)]"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <p className="text-center text-sm text-slate-500">
          Position your face in the frame. Remove glasses and hats if possible.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button type="button" onClick={capturePhoto}>
            <Camera className="h-4 w-4" /> Capture Selfie
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              stopCamera();
              setMode("choose");
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center max-w-lg mx-auto">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-100">
          <Camera className="h-10 w-10 text-teal-600" />
        </div>
        <h3 className="mt-4 font-semibold text-slate-900">Verify it&apos;s you</h3>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          Take a live selfie or upload a recent photo. We use this to match your face with your ID document,
          as required for bank account opening under federal KYC regulations.
        </p>
      </div>

      {cameraError && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-center">
          {cameraError}
        </p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="user"
        className="hidden"
        onChange={(e) => handleUpload(e.target.files?.[0])}
      />

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Button type="button" onClick={startCamera} className="min-w-[180px]">
          <Camera className="h-4 w-4" /> Take Selfie
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileRef.current?.click()}
          className="min-w-[180px]"
        >
          <Upload className="h-4 w-4" /> Upload Photo
        </Button>
      </div>

      <ul className="text-xs text-slate-500 space-y-1 max-w-md mx-auto">
        <li className="flex items-start gap-2">
          <RotateCcw className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          Use good lighting and look directly at the camera
        </li>
        <li className="flex items-start gap-2">
          <RotateCcw className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          Do not use filters or edited photos
        </li>
      </ul>
    </div>
  );
}
