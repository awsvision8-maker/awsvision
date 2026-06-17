"use client";

import { useRef } from "react";
import { Upload, X, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_SIZE_MB = 5;
const ACCEPT = "image/jpeg,image/png,image/webp,image/heic";

interface DocumentUploadProps {
  label: string;
  hint?: string;
  fileName?: string;
  preview?: string;
  onChange: (file: File, preview: string) => void;
  onClear: () => void;
  required?: boolean;
}

export function DocumentUpload({
  label,
  hint = "PNG, JPG, or WEBP up to 5MB",
  fileName,
  preview,
  onChange,
  onClear,
  required,
}: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`File must be under ${MAX_SIZE_MB}MB`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(file, reader.result as string);
    reader.readAsDataURL(file);
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
        onChange={(e) => handleFile(e.target.files?.[0])}
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
          className={cn(
            "flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-8 text-center",
            "hover:border-teal-400 hover:bg-teal-50/50 transition-colors cursor-pointer"
          )}
        >
          <Upload className="h-8 w-8 text-slate-400" />
          <p className="mt-2 text-sm font-medium text-slate-600">Click to upload</p>
          <p className="text-xs text-slate-400 mt-1">{hint}</p>
        </button>
      )}
    </div>
  );
}
