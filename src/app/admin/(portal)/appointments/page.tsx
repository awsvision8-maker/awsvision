"use client";

import { useEffect, useState } from "react";
import { AdminEmptyState, AdminLoading, AdminPageHeader } from "@/components/admin/admin-ui";
import { formatDate } from "@/lib/utils";

interface Appointment {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  preferredDate: string | null;
  topic: string;
  createdAt: string;
}

export default function AdminAppointmentsPage() {
  const [rows, setRows] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/appointments")
      .then((r) => r.json())
      .then((d) => setRows(d.appointments ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div className="p-4 sm:p-8">
      <AdminPageHeader
        title="Appointment Requests"
        description="Consultation and callback requests from the website."
      />

      {rows.length === 0 ? (
        <AdminEmptyState title="No appointment requests" />
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Topic</th>
                <th className="px-6 py-3">Preferred date</th>
                <th className="px-6 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} className="border-b border-slate-50">
                  <td className="px-6 py-4 font-medium">{a.fullName}</td>
                  <td className="px-6 py-4">
                    <a href={`mailto:${a.email}`} className="text-teal-600 hover:underline">
                      {a.email}
                    </a>
                    {a.phone && <p className="text-xs text-slate-500">{a.phone}</p>}
                  </td>
                  <td className="px-6 py-4">{a.topic}</td>
                  <td className="px-6 py-4">{a.preferredDate ?? "—"}</td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(a.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
