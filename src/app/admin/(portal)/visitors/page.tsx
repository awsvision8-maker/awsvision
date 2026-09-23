"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, MapPin, RefreshCw } from "lucide-react";
import {
  AdminEmptyState,
  AdminLoading,
  AdminPageHeader,
} from "@/components/admin/admin-ui";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface PageViewRow {
  id: string;
  path: string;
  title: string | null;
  enteredAt: string;
  leftAt: string | null;
  durationMs: number;
  durationLabel: string;
  ipAddress: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface VisitRow {
  id: string;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  durationLabel: string;
  entryPath: string;
  exitPath: string | null;
  ipAddress: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  locationLabel: string | null;
  referrer: string | null;
  pageViews: PageViewRow[];
}

interface VisitorRow {
  id: string;
  visitCount: number;
  pageViewCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
  lastIp: string | null;
  lastCity: string | null;
  lastRegion: string | null;
  lastCountry: string | null;
  lastLatitude: number | null;
  lastLongitude: number | null;
  lastLocation: string | null;
  lastUserAgent: string | null;
  lastPath: string | null;
  visits: VisitRow[];
}

interface Summary {
  visitors: number;
  visits: number;
  pageViews: number;
  todayVisitors: number;
}

function Coord({ lat, lng }: { lat: number | null; lng: number | null }) {
  if (lat == null || lng == null) return <span className="text-slate-400">—</span>;
  return (
    <span className="font-mono text-xs">
      {lat.toFixed(4)}, {lng.toFixed(4)}
    </span>
  );
}

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorRow[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<VisitorRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "150" });
    if (q.trim()) params.set("q", q.trim());
    const res = await fetch(`/api/admin/visitors?${params.toString()}`);
    const data = await res.json();
    if (res.ok) {
      setVisitors(data.visitors ?? []);
      setSummary(data.summary ?? null);
      setSelected((prev) => {
        if (!prev) return data.visitors?.[0] ?? null;
        return data.visitors?.find((v: VisitorRow) => v.id === prev.id) ?? data.visitors?.[0] ?? null;
      });
    }
    setLoading(false);
  }, [q]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && visitors.length === 0) return <AdminLoading />;

  return (
    <div className="p-4 sm:p-8">
      <AdminPageHeader
        title="Visitors"
        description="Who visited the site — pages, dwell time, IP, location, and repeat visits."
      >
        <div className="flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search IP, city, state, country, path…"
            className="min-w-[220px] rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </AdminPageHeader>

      {summary && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Unique visitors", value: summary.visitors },
            { label: "Active today", value: summary.todayVisitors },
            { label: "Total visits", value: summary.visits },
            { label: "Page views", value: summary.pageViews },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <p className="text-xs uppercase tracking-wide text-slate-500">{s.label}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {visitors.length === 0 ? (
        <AdminEmptyState
          title="No visitors tracked yet"
          description="As people browse the marketing site, their pages, stay time, IP, and location will appear here."
        />
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <th className="px-4 py-2">Last seen</th>
                  <th className="px-4 py-2">Location / IP</th>
                  <th className="px-4 py-2">Visits</th>
                  <th className="px-4 py-2">Last page</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v) => (
                  <tr
                    key={v.id}
                    onClick={() => setSelected(v)}
                    className={`cursor-pointer border-b border-slate-50 hover:bg-slate-50 ${
                      selected?.id === v.id ? "bg-teal-50" : ""
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">
                      {formatWhen(v.lastSeenAt)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">
                        {v.lastLocation || "Unknown"}
                      </p>
                      <p className="font-mono text-xs text-slate-500">{v.lastIp || "—"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {v.visitCount}×
                      </span>
                    </td>
                    <td className="max-w-[140px] truncate px-4 py-3 font-mono text-xs text-slate-600">
                      {v.lastPath || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selected ? (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-start gap-2">
                <Eye className="mt-0.5 h-5 w-5 text-teal-600" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Visitor detail</h2>
                  <p className="text-sm text-slate-500">
                    Came {selected.visitCount} time{selected.visitCount === 1 ? "" : "s"} ·{" "}
                    {selected.pageViewCount} page views
                  </p>
                </div>
              </div>

              <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase text-slate-500">IP address</dt>
                  <dd className="mt-0.5 font-mono font-medium">{selected.lastIp || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-500">Location</dt>
                  <dd className="mt-0.5 font-medium">{selected.lastLocation || "Unknown"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-500">City</dt>
                  <dd className="mt-0.5">{selected.lastCity || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-500">State / region</dt>
                  <dd className="mt-0.5">{selected.lastRegion || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-500">Country</dt>
                  <dd className="mt-0.5">{selected.lastCountry || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Lat / Long
                  </dt>
                  <dd className="mt-0.5">
                    <Coord lat={selected.lastLatitude} lng={selected.lastLongitude} />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-500">First seen</dt>
                  <dd className="mt-0.5">{formatWhen(selected.firstSeenAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-500">Last seen</dt>
                  <dd className="mt-0.5">{formatWhen(selected.lastSeenAt)}</dd>
                </div>
              </dl>

              {selected.lastUserAgent && (
                <p className="truncate rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500" title={selected.lastUserAgent}>
                  {selected.lastUserAgent}
                </p>
              )}

              <div className="space-y-4 border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-900">Visit history</h3>
                {selected.visits.length === 0 ? (
                  <p className="text-sm text-slate-500">No visits recorded.</p>
                ) : (
                  selected.visits.map((visit, idx) => (
                    <div
                      key={visit.id}
                      className="rounded-lg border border-slate-100 bg-slate-50/80 p-3"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-800">
                          Visit #{selected.visitCount - idx}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatWhen(visit.startedAt)} · stayed {visit.durationLabel}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        {visit.locationLabel || "Unknown"} ·{" "}
                        <span className="font-mono">{visit.ipAddress || "—"}</span>
                        {" · "}
                        <Coord lat={visit.latitude} lng={visit.longitude} />
                      </p>
                      <p className="mt-1 font-mono text-xs text-slate-500">
                        In: {visit.entryPath}
                        {visit.exitPath && visit.exitPath !== visit.entryPath
                          ? ` → Out: ${visit.exitPath}`
                          : ""}
                      </p>

                      <ul className="mt-3 space-y-1.5">
                        {visit.pageViews.map((pv) => (
                          <li
                            key={pv.id}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-white px-2.5 py-1.5 text-xs"
                          >
                            <span className="font-mono text-slate-800">{pv.path}</span>
                            <span className="text-slate-500">
                              {pv.durationLabel} · {formatWhen(pv.enteredAt)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
