"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Send, X, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { isStaffSenderType } from "@/lib/chat-agents";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  senderType: string;
  senderName: string;
  body: string;
  createdAt: string;
}

export function LiveChatWidget() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [status, setStatus] = useState<"open" | "closed">("open");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastPollRef = useRef<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(`${user.firstName} ${user.lastName}`.trim());
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const pingPresence = async () => {
    try {
      await fetch("/api/chat/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPath: pathname,
          chatActive: started && status === "open" && !!conversationId,
          conversationId,
          visitorName: name || undefined,
          visitorEmail: email || undefined,
        }),
      });
    } catch {
      // ignore heartbeat errors
    }
  };

  useEffect(() => {
    void pingPresence();
    const interval = setInterval(() => void pingPresence(), 30_000);
    return () => clearInterval(interval);
  }, [pathname, started, status, conversationId, name, email]);

  const mergeMessages = (incoming: ChatMessage[]) => {
    if (incoming.length === 0) return;
    setMessages((prev) => {
      const ids = new Set(prev.map((m) => m.id));
      const merged = [...prev];
      for (const m of incoming) {
        if (!ids.has(m.id)) merged.push(m);
      }
      return merged.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });
  };

  const pollMessages = async (convId: string, full = false) => {
    const since = full ? "" : lastPollRef.current ? `&since=${encodeURIComponent(lastPollRef.current)}` : "";
    const res = await fetch(
      `/api/chat/messages?conversationId=${convId}${since}`
    );
    if (!res.ok) return;
    const data = await res.json();
    if (!data.conversation) return;
    setStatus(data.conversation.status);
    if (full) {
      setMessages(data.conversation.messages);
    } else {
      mergeMessages(data.conversation.messages);
    }
    const latest = data.conversation.messages.at(-1);
    if (latest) lastPollRef.current = latest.createdAt;
  };

  useEffect(() => {
    if (!open || !conversationId) return;
    void pollMessages(conversationId, messages.length === 0);
    const interval = setInterval(() => void pollMessages(conversationId), 3000);
    return () => clearInterval(interval);
  }, [open, conversationId, messages.length]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorName: name, visitorEmail: email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to start chat");
        return;
      }
      setConversationId(data.conversationId);
      setStarted(true);
      await pollMessages(data.conversationId, true);
    } catch {
      setError("Failed to start chat");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !conversationId) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        senderType: "visitor",
        senderName: name,
        body: text,
        createdAt: new Date().toISOString(),
      },
    ]);
    const res = await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, body: text, visitorName: name }),
    });
    if (res.ok) {
      await pollMessages(conversationId, true);
    }
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg ring-4 ring-teal-600/20 transition-transform hover:scale-105 hover:bg-teal-500 cursor-pointer"
          aria-label="Open live chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-[60] flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-teal-800 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Live Chat</p>
              <p className="text-xs text-teal-100">AWS Vision Support</p>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 hover:bg-white/10 cursor-pointer"
                aria-label="Minimize chat"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 hover:bg-white/10 cursor-pointer"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!started ? (
            <form onSubmit={handleStart} className="space-y-4 p-4">
              <p className="text-sm text-slate-600">
                Chat with our team about accounts, investments, or support.
              </p>
              <Input
                label="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" loading={loading}>
                Start Chat
              </Button>
            </form>
          ) : (
            <>
              <div className="flex max-h-72 min-h-[220px] flex-1 flex-col gap-3 overflow-y-auto p-4 bg-slate-50">
                {messages.map((m) => {
                  const isVisitor = m.senderType === "visitor";
                  const isStaff = isStaffSenderType(m.senderType);
                  return (
                  <div
                    key={m.id}
                    className={cn(
                      "max-w-[85%] rounded-xl px-3 py-2 text-sm",
                      isVisitor
                        ? "ml-auto bg-teal-600 text-white"
                        : m.senderType === "system"
                          ? "mx-auto bg-slate-200 text-slate-600 text-xs text-center"
                          : "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200"
                    )}
                  >
                    {isStaff && (
                      <p className="mb-0.5 text-[10px] font-semibold text-teal-700">
                        {m.senderName}
                      </p>
                    )}
                    {m.body}
                  </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {status === "closed" ? (
                <p className="border-t border-slate-200 p-3 text-center text-xs text-slate-500">
                  This conversation has been closed. Start a new chat anytime.
                </p>
              ) : (
                <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-200 p-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message…"
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <Button type="submit" size="sm" disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
