"use client";

import { cn } from "@/lib/utils";
import { SIGNUP_STEPS } from "@/lib/signup-form";

interface StepProgressProps {
  currentStep: number;
  steps?: readonly { id: string; label: string; shortLabel: string }[];
}

export function StepProgress({ currentStep, steps = SIGNUP_STEPS }: StepProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-1">
        {steps.map((step, i) => (
          <div key={step.id} className="flex flex-1 items-center min-w-0">
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  i < currentStep && "bg-teal-600 text-white",
                  i === currentStep && "bg-teal-600 text-white ring-4 ring-teal-100",
                  i > currentStep && "bg-slate-200 text-slate-500"
                )}
              >
                {i < currentStep ? "✓" : i + 1}
              </div>
              <span
                className={cn(
                  "mt-1.5 hidden text-xs font-medium text-center leading-tight md:block truncate w-full px-0.5",
                  i <= currentStep ? "text-teal-700" : "text-slate-400"
                )}
              >
                {step.shortLabel}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-1 mb-4 sm:mb-5",
                  i < currentStep ? "bg-teal-600" : "bg-slate-200"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-sm font-medium text-slate-700 sm:hidden">
        Step {currentStep + 1} of {steps.length}: {steps[currentStep].label}
      </p>
    </div>
  );
}
