"use client";

import { useEffect, useState } from "react";
import { AdminEmptyState, AdminLoading, AdminPageHeader } from "@/components/admin/admin-ui";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  topic: string;
  message: string;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    fetch("/api/admin/messages")
      .then((r) => r.json())
      .then((d) => setMessages(d.messages ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div className="p-4 sm:p-8">
      <AdminPageHeader
        title="Contact Messages"
        description={`${messages.length} inquiries from the website contact form.`}
      />

      {messages.length === 0 ? (
        <AdminEmptyState title="No contact messages yet" />
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {messages.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelected(m)}
                className={`w-full rounded-lg border p-4 text-left transition-colors cursor-pointer ${
                  selected?.id === m.id
                    ? "border-teal-300 bg-teal-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <p className="font-semibold text-slate-900">
                  {m.firstName} {m.lastName}
                </p>
                <p className="text-sm text-slate-600">{m.topic}</p>
                <p className="mt-1 text-xs text-slate-400">{formatDate(m.createdAt)}</p>
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm min-h-[200px]">
            {selected ? (
              <>
                <h2 className="text-lg font-bold text-slate-900">{selected.topic}</h2>
                <p className="mt-2 text-sm text-slate-600">
                  {selected.firstName} {selected.lastName} ·{" "}
                  <a href={`mailto:${selected.email}`} className="text-teal-600 hover:underline">
                    {selected.email}
                  </a>
                  {selected.phone && ` · ${selected.phone}`}
                </p>
                <p className="mt-1 text-xs text-slate-400">{formatDate(selected.createdAt)}</p>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {selected.message}
                </p>
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.topic)}`}
                  className="mt-6 inline-block rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                >
                  Reply via email
                </a>
              </>
            ) : (
              <p className="text-sm text-slate-500">Select a message to read</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
