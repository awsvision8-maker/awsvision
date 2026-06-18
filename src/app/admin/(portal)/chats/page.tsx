"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Globe, MapPin, MessageCircle, Send, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isStaffSenderType } from "@/lib/chat-agents";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  visitorName: string;
  visitorEmail: string;
  status: string;
  updatedAt: string;
  messageCount: number;
  visitorIp: string | null;
  visitorLocation: string | null;
  isLive: boolean;
  liveLabel: string | null;
  botActive?: boolean;
  lastMessage: { body: string; senderType: string; createdAt: string } | null;
}

interface LiveVisitor {
  id: string;
  displayName: string;
  visitorEmail: string | null;
  conversationId: string | null;
  currentPath: string;
  ipAddress: string | null;
  location: string | null;
  status: string;
  isLive: boolean;
  liveLabel: string;
  lastSeenAt: string;
}

interface ChatMessage {
  id: string;
  senderType: string;
  senderName: string;
  body: string;
  createdAt: string;
}

interface ConversationDetail {
  visitorIp: string | null;
  visitorLocation: string | null;
  isLive: boolean;
  liveLabel: string | null;
  botActive: boolean;
}

export default function AdminChatsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [websiteVisitors, setWebsiteVisitors] = useState<LiveVisitor[]>([]);
  const [chatVisitors, setChatVisitors] = useState<LiveVisitor[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatStatus, setChatStatus] = useState("open");
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"open" | "closed" | "all">("open");
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadPresence = useCallback(async () => {
    const res = await fetch("/api/admin/chats/presence");
    if (!res.ok) return;
    const data = await res.json();
    setWebsiteVisitors(data.website ?? []);
    setChatVisitors(data.chat ?? []);
  }, []);

  const loadConversations = useCallback(async () => {
    const q = filter === "all" ? "" : `?status=${filter}`;
    const res = await fetch(`/api/admin/chats${q}`);
    if (!res.ok) return;
    const data = await res.json();
    setConversations(data.conversations ?? []);
  }, [filter]);

  const loadMessages = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/chats/${id}`);
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data.conversation.messages ?? []);
    setChatStatus(data.conversation.status);
    setDetail({
      visitorIp: data.conversation.visitorIp ?? null,
      visitorLocation: data.conversation.visitorLocation ?? null,
      isLive: data.conversation.isLive ?? false,
      liveLabel: data.conversation.liveLabel ?? null,
      botActive: data.conversation.botActive ?? false,
    });
  }, []);

  useEffect(() => {
    void loadConversations();
    void loadPresence();
    const interval = setInterval(() => {
      void loadConversations();
      void loadPresence();
    }, 5000);
    return () => clearInterval(interval);
  }, [loadConversations, loadPresence]);

  useEffect(() => {
    if (!selectedId) return;
    void loadMessages(selectedId);
    const interval = setInterval(() => void loadMessages(selectedId), 3000);
    return () => clearInterval(interval);
  }, [selectedId, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !input.trim()) return;
    const text = input.trim();
    setInput("");
    await fetch(`/api/admin/chats/${selectedId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: text }),
    });
    await loadMessages(selectedId);
    await loadConversations();
  };

  const toggleStatus = async (status: "open" | "closed") => {
    if (!selectedId) return;
    await fetch(`/api/admin/chats/${selectedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setChatStatus(status);
    await loadConversations();
  };

  const selected = conversations.find((c) => c.id === selectedId);

  const selectConversation = (id: string) => {
    setSelectedId(id);
  };

  return (
    <div className="flex h-[calc(100vh-0px)] flex-col lg:h-screen">
      <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-8">
        <h1 className="text-2xl font-bold text-slate-900">Live Chat Management</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["open", "closed", "all"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium capitalize cursor-pointer",
                filter === f ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <Globe className="h-4 w-4" />
              Live on website ({websiteVisitors.length})
            </div>
            {websiteVisitors.length === 0 ? (
              <p className="text-xs text-emerald-700/70">No visitors browsing right now.</p>
            ) : (
              <ul className="max-h-28 space-y-2 overflow-y-auto">
                {websiteVisitors.map((v) => (
                  <li key={v.id} className="rounded-lg bg-white/80 px-2 py-1.5 text-xs ring-1 ring-emerald-100">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 font-medium text-slate-800">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                        {v.displayName}
                      </span>
                      <span className="text-[10px] text-emerald-700">{v.currentPath}</span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      {v.ipAddress ?? "IP unknown"} · {v.location ?? "Location unknown"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-800">
              <MessageCircle className="h-4 w-4" />
              Live on chat ({chatVisitors.length})
            </div>
            {chatVisitors.length === 0 ? (
              <p className="text-xs text-teal-700/70">No active chat sessions right now.</p>
            ) : (
              <ul className="max-h-28 space-y-2 overflow-y-auto">
                {chatVisitors.map((v) => (
                  <li key={v.id}>
                    <button
                      type="button"
                      onClick={() => v.conversationId && selectConversation(v.conversationId)}
                      className="w-full rounded-lg bg-white/80 px-2 py-1.5 text-left text-xs ring-1 ring-teal-100 hover:bg-white cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 font-medium text-slate-800">
                          <span className="h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                          {v.displayName}
                        </span>
                        <span className="text-[10px] text-teal-700">Live on chat</span>
                      </div>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        {v.ipAddress ?? "IP unknown"} · {v.location ?? "Location unknown"}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="max-h-48 overflow-y-auto border-b border-slate-200 lg:max-h-none lg:w-80 lg:shrink-0 lg:border-b-0 lg:border-r">
          {conversations.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No conversations yet.</p>
          ) : (
            conversations.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => selectConversation(c.id)}
                className={cn(
                  "w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 cursor-pointer",
                  selectedId === c.id && "bg-teal-50"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-medium text-slate-900">{c.visitorName}</p>
                  <div className="flex shrink-0 items-center gap-1">
                    {c.botActive && (
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                        Auto
                      </span>
                    )}
                    {c.isLive && (
                      <span className="flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-700">
                        <Wifi className="h-3 w-3" />
                        Live
                      </span>
                    )}
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                        c.status === "open" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                      )}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>
                <p className="truncate text-xs text-slate-500">{c.visitorEmail}</p>
                {(c.visitorIp || c.visitorLocation) && (
                  <p className="mt-0.5 truncate text-[10px] text-slate-400">
                    {c.visitorIp ?? "—"} · {c.visitorLocation ?? "—"}
                  </p>
                )}
                {c.lastMessage && (
                  <p className="mt-1 truncate text-xs text-slate-400">{c.lastMessage.body}</p>
                )}
              </button>
            ))
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col bg-slate-50">
          {!selected ? (
            <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
              Select a conversation to reply
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{selected.visitorName}</p>
                    {(detail?.botActive ?? selected.botActive) && (
                      <span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                        Auto-reply bot
                      </span>
                    )}
                    {(detail?.isLive ?? selected.isLive) && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-700">
                        <Wifi className="h-3 w-3" />
                        {detail?.liveLabel ?? selected.liveLabel ?? "Live on chat"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{selected.visitorEmail}</p>
                  {(detail?.botActive ?? selected.botActive) ? (
                    <p className="mt-1 text-[11px] text-violet-600">
                      Bot is answering automatically. Open this chat to take over as a live agent.
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-teal-700">You are handling this conversation.</p>
                  )}
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      IP: {detail?.visitorIp ?? selected.visitorIp ?? "—"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {detail?.visitorLocation ?? selected.visitorLocation ?? "Location unknown"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {chatStatus === "open" ? (
                    <Button size="sm" variant="outline" onClick={() => void toggleStatus("closed")}>
                      Close Chat
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => void toggleStatus("open")}>
                      Reopen
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((m) => {
                  const isStaff = isStaffSenderType(m.senderType);
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "max-w-[80%] rounded-xl px-3 py-2 text-sm",
                        isStaff
                          ? "ml-auto bg-teal-600 text-white"
                          : m.senderType === "system"
                            ? "mx-auto bg-slate-200 text-slate-600 text-xs text-center"
                            : "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200"
                      )}
                    >
                      {isStaff && (
                        <p className="mb-0.5 text-[10px] font-semibold opacity-90">
                          Reply as {m.senderName}
                        </p>
                      )}
                      {m.senderType === "visitor" && (
                        <p className="mb-0.5 text-[10px] font-semibold text-slate-500">{m.senderName}</p>
                      )}
                      {m.body}
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {chatStatus === "open" && (
                <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-200 bg-white p-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your reply…"
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                  />
                  <Button type="submit" disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
