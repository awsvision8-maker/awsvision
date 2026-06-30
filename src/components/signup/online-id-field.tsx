"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AvailabilityStatus = "idle" | "checking" | "available" | "taken" | "invalid";

interface OnlineIdFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onAvailabilityChange?: (available: boolean | null) => void;
  firstName?: string;
  lastName?: string;
  orgName?: string;
  placeholder?: string;
  required?: boolean;
}

export function OnlineIdField({
  label = "Create Online ID *",
  value,
  onChange,
  onAvailabilityChange,
  firstName,
  lastName,
  orgName,
  placeholder = "Choose a unique Online ID",
  required,
}: OnlineIdFieldProps) {
  const [status, setStatus] = useState<AvailabilityStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runCheck = useCallback(
    async (id: string) => {
      const trimmed = id.trim().replace(/\s/g, "");
      if (trimmed.length < 4) {
        setStatus("idle");
        setMessage(null);
        setSuggestions([]);
        onAvailabilityChange?.(null);
        return;
      }

      if (!/^[a-zA-Z0-9._-]+$/.test(trimmed)) {
        setStatus("invalid");
        setMessage("Use only letters, numbers, dots, dashes, and underscores");
        setSuggestions([]);
        onAvailabilityChange?.(false);
        return;
      }

      setStatus("checking");
      setMessage(null);
      setSuggestions([]);

      try {
        const params = new URLSearchParams({ id: trimmed });
        if (firstName) params.set("firstName", firstName);
        if (lastName) params.set("lastName", lastName);
        if (orgName) params.set("orgName", orgName);

        const res = await fetch(`/api/auth/check-online-id?${params.toString()}`);
        const data = (await res.json()) as {
          available: boolean;
          message?: string | null;
          suggestions?: string[];
        };

        if (data.available) {
          setStatus("available");
          setMessage("This Online ID is available");
          setSuggestions([]);
          onAvailabilityChange?.(true);
        } else {
          setStatus(data.suggestions?.length ? "taken" : "invalid");
          setMessage(data.message ?? "This Online ID is not available");
          setSuggestions(data.suggestions ?? []);
          onAvailabilityChange?.(false);
        }
      } catch {
        setStatus("idle");
        setMessage("Could not verify Online ID. Try again.");
        onAvailabilityChange?.(null);
      }
    },
    [firstName, lastName, orgName, onAvailabilityChange]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void runCheck(value), 450);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, runCheck]);

  const fieldError =
    status === "taken" || status === "invalid" ? (message ?? undefined) : undefined;

  return (
    <div className="space-y-2">
      <Input
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\s/g, ""))}
        placeholder={placeholder}
        required={required}
        autoComplete="username"
        error={fieldError}
      />

      {status === "checking" && value.trim().length >= 4 && (
        <p className="flex items-center gap-1.5 text-xs text-slate-500">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Checking availability…
        </p>
      )}

      {status === "available" && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {message}
        </p>
      )}

      {status === "taken" && suggestions.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3">
          <p className="flex items-start gap-1.5 text-xs font-medium text-amber-900">
            <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {message}
          </p>
          <p className="mt-2 text-xs text-amber-800">Suggested available IDs:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange(s)}
                className={cn(
                  "rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-medium text-amber-900",
                  "hover:border-teal-400 hover:bg-teal-50 hover:text-teal-800 cursor-pointer transition-colors"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-500">
        Your Online ID is unique and used to sign in alongside your email. Minimum 4 characters.
      </p>
    </div>
  );
}

/** Client-side re-check before advancing signup step. */
export async function verifyOnlineIdAvailable(
  onlineId: string,
  hints?: { firstName?: string; lastName?: string; orgName?: string }
): Promise<{ ok: boolean; message?: string; suggestions?: string[] }> {
  const trimmed = onlineId.trim().replace(/\s/g, "");
  if (trimmed.length < 4) {
    return { ok: false, message: "Online ID must be at least 4 characters" };
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(trimmed)) {
    return {
      ok: false,
      message: "Online ID may only contain letters, numbers, dots, dashes, and underscores",
    };
  }

  const params = new URLSearchParams({ id: trimmed });
  if (hints?.firstName) params.set("firstName", hints.firstName);
  if (hints?.lastName) params.set("lastName", hints.lastName);
  if (hints?.orgName) params.set("orgName", hints.orgName);

  const res = await fetch(`/api/auth/check-online-id?${params.toString()}`);
  const data = (await res.json()) as {
    available: boolean;
    message?: string | null;
    suggestions?: string[];
  };

  if (data.available) return { ok: true };
  return {
    ok: false,
    message: data.message ?? "This Online ID is already taken. Please choose a different one.",
    suggestions: data.suggestions,
  };
}
