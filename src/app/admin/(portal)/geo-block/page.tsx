"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Globe2, Save, Search } from "lucide-react";
import { AdminLoading, AdminPageHeader } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CountryOption } from "@/lib/countries";

export default function AdminGeoBlockPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/geo-block");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setCountries(data.countries ?? []);
      setSelected(new Set(data.blockedCodes ?? []));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [countries, query]);

  const toggle = (code: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
    setSuccess(null);
  };

  const selectDefaults = () => {
    setSelected(new Set(["PK", "IN", "BD"]));
    setSuccess(null);
  };

  const clearAll = () => {
    setSelected(new Set());
    setSuccess(null);
  };

  const selectVisible = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      filtered.forEach((c) => next.add(c.code));
      return next;
    });
    setSuccess(null);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/admin/geo-block", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockedCodes: Array.from(selected) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setSelected(new Set(data.blockedCodes ?? []));
      setSuccess(
        `Saved. ${data.blockedCodes?.length ?? 0} countr${(data.blockedCodes?.length ?? 0) === 1 ? "y" : "ies"} blocked. Changes apply within ~30 seconds.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Geo Block"
        description="Select countries where the public website should not be shown. Admin portal stays accessible."
      >
        <Button onClick={save} loading={saving} className="gap-2">
          <Save className="h-4 w-4" />
          Save blocked countries
        </Button>
      </AdminPageHeader>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </p>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Globe2 className="h-4 w-4 text-teal-600" />
            <span>
              <strong className="text-slate-900">{selected.size}</strong> of{" "}
              {countries.length} countries selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={selectDefaults}>
              PK + IN + BD
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={selectVisible}>
              Select visible
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={clearAll}>
              Clear all
            </Button>
          </div>
        </div>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search country name or code…"
            className="pl-9"
          />
        </div>

        <div className="mt-4 max-h-[min(60vh,560px)] overflow-y-auto rounded-lg border border-slate-100">
          <ul className="divide-y divide-slate-100 sm:grid sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
            {filtered.map((country) => {
              const checked = selected.has(country.code);
              return (
                <li key={country.code} className="sm:border-b sm:border-slate-100">
                  <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-slate-50">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      checked={checked}
                      onChange={() => toggle(country.code)}
                    />
                    <span className="min-w-0 flex-1 text-sm text-slate-800">
                      {country.name}
                    </span>
                    <span className="shrink-0 font-mono text-xs text-slate-400">
                      {country.code}
                    </span>
                  </label>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="col-span-full px-4 py-8 text-center text-sm text-slate-500">
                No countries match “{query}”.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
