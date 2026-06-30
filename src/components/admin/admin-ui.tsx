"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function AdminEmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mt-10 flex flex-col items-center rounded-xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
      <p className="font-medium text-slate-700">{title}</p>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  completed: "bg-emerald-100 text-emerald-800",
  verified: "bg-emerald-100 text-emerald-800",
  submitted: "bg-sky-100 text-sky-800",
  failed: "bg-red-100 text-red-800",
  resubmit_required: "bg-orange-100 text-orange-800",
  open: "bg-teal-100 text-teal-800",
  closed: "bg-slate-100 text-slate-700",
};

export function AdminStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        STATUS_STYLES[status] ?? "bg-slate-100 text-slate-700"
      )}
    >
      {status}
    </span>
  );
}

export function AdminActionButton({
  variant,
  onClick,
  disabled,
  children,
}: {
  variant: "approve" | "reject";
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50 cursor-pointer",
        variant === "approve"
          ? "bg-emerald-600 text-white hover:bg-emerald-700"
          : "border border-red-200 bg-white text-red-600 hover:bg-red-50"
      )}
    >
      {children}
    </button>
  );
}
