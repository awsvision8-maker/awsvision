"use client";

import { useRef, useState } from "react";
import { Upload, X, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";
import { compressImageFile, MAX_SOURCE_FILE_BYTES } from "@/lib/compress-image";
import { MAX_IMAGE_FILE_MB } from "@/lib/signup-form";

const ACCEPT = "image/jpeg,image/png,image/webp,image/heic";

interface DocumentUploadProps {
  label: string;
  hint?: string;
  fileName?: string;
  preview?: string;
  onChange: (file: File, preview: string) => void;
  onClear: () => void;
  onError?: (message: string) => void;
  onBusyChange?: (busy: boolean) => void;
  required?: boolean;
}

export function DocumentUpload({
  label,
  hint = `PNG, JPG, or WEBP up to ${MAX_IMAGE_FILE_MB}MB`,
  fileName,
  preview,
  onChange,
  onClear,
  onError,
  onBusyChange,
  required,
}: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);

  const setBusy = (busy: boolean) => {
    setProcessing(busy);
    onBusyChange?.(busy);
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_SOURCE_FILE_BYTES) {
      onError?.(`File must be under ${MAX_IMAGE_FILE_MB}MB. Choose a smaller photo.`);
      return;
    }
    if (!file.type.startsWith("image/")) {
      onError?.("Only image files are allowed (JPG, PNG, or WEBP).");
      return;
    }
    setBusy(true);
    try {
      const { file: compressed, preview: compressedPreview } = await compressImageFile(file);
      onChange(compressed, compressedPreview);
    } catch (err) {
      onError?.(
        err instanceof Error ? err.message : "Could not process this image. Try another photo."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </p>
        {fileName && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Remove
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        capture={undefined}
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      {preview ? (
        <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt={label} className="h-40 w-full object-cover" />
          <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-2">
            <FileImage className="h-4 w-4 text-teal-600 shrink-0" />
            <span className="text-xs text-slate-600 truncate">{fileName}</span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={processing}
          className={cn(
            "flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-8 text-center",
            "hover:border-teal-400 hover:bg-teal-50/50 transition-colors cursor-pointer disabled:opacity-60"
          )}
        >
          <Upload className="h-8 w-8 text-slate-400" />
          <p className="mt-2 text-sm font-medium text-slate-600">
            {processing ? "Processing photo…" : "Click to upload"}
          </p>
          <p className="text-xs text-slate-400 mt-1">{hint}</p>
        </button>
      )}
    </div>
  );
}
