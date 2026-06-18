"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Upload, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [videoReady, setVideoReady] = useState(false);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setVideoReady(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  /** Attach stream after <video> mounts (ref is null until mode === "camera"). */
  useEffect(() => {
    if (mode !== "camera") return;

    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) return;

    setVideoReady(false);
    video.srcObject = stream;

    const onReady = () => {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        setVideoReady(true);
      }
    };

    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("loadeddata", onReady);

    void video.play().catch(() => {
      setCameraError("Could not start camera preview. Try upload instead.");
    });

    return () => {
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("loadeddata", onReady);
      video.srcObject = null;
    };
  }, [mode]);

  const startCamera = async () => {
    setCameraError("");
    stopCamera();

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera is not supported in this browser. Please upload a photo instead.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "user" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      setMode("camera");
    } catch (err) {
      const denied =
        err instanceof DOMException &&
        (err.name === "NotAllowedError" || err.name === "PermissionDeniedError");
      setCameraError(
        denied
          ? "Camera access denied. Allow camera permission in your browser, or upload a photo instead."
          : "Camera unavailable. Please upload a photo instead."
      );
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) {
      setCameraError("Camera is still loading. Wait a moment, then try again.");
      return;
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mirror to match the live preview the user sees
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError("Could not capture photo. Please try again or upload instead.");
          return;
        }
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" });
        onCapture(file, dataUrl);
        stopCamera();
        setMode("choose");
        setCameraError("");
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
          {!videoReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm text-white">
              Starting camera…
            </div>
          )}
        </div>
        {cameraError && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-center">
            {cameraError}
          </p>
        )}
        <p className="text-center text-sm text-slate-500">
          Position your face in the frame. Remove glasses and hats if possible.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button type="button" onClick={capturePhoto} disabled={!videoReady}>
            <Camera className="h-4 w-4" /> Capture Selfie
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              stopCamera();
              setMode("choose");
              setCameraError("");
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
