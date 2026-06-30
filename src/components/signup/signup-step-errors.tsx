"use client";

import type { RefObject } from "react";
import { AlertCircle } from "lucide-react";

export function SignupStepErrors({
  errors,
  errorRef,
}: {
  errors: string[];
  errorRef?: RefObject<HTMLDivElement | null>;
}) {
  if (errors.length === 0) return null;

  return (
    <div
      ref={errorRef}
      role="alert"
      className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
    >
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-red-800">
            {errors.length === 1
              ? "Please fix this before continuing:"
              : "Please fix the following before continuing:"}
          </p>
          {errors.length === 1 ? (
            <p className="mt-1 text-sm text-red-700">{errors[0]}</p>
          ) : (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
              {errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
