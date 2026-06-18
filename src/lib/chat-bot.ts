import {
  agentForConversation,
  visitorFirstName,
  type ChatSupportAgent,
} from "@/lib/chat-agents";
import { BOT_KNOWLEDGE } from "@/lib/chat-bot-knowledge";
import { SITE } from "@/lib/site-config";

const GREETING_PATTERNS = /^(hi|hello|hey|good\s+(morning|afternoon|evening)|howdy|greetings)\b/i;

const OPENERS = [
  "Happy to help!",
  "Sure thing!",
  "Great question.",
  "Thanks for reaching out.",
  "Absolutely.",
  "I'd be glad to walk you through that.",
];

const CLOSERS = [
  "Anything else you'd like to know?",
  "Let me know if you want more detail on any of that.",
  "Feel free to ask if something else comes to mind.",
  "Is there anything else I can help with today?",
];

const THANKS_PATTERNS = /\b(thanks|thank you|thx|appreciate)\b/i;

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function hashPick<T>(seed: string, items: readonly T[], salt = 0): T {
  let hash = salt;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % items.length;
  }
  return items[hash]!;
}

function scoreEntry(message: string, entry: (typeof BOT_KNOWLEDGE)[number]) {
  const normalized = normalize(message);
  const tokens = new Set(normalized.split(" ").filter((t) => t.length > 2));
  let score = 0;

  for (const keyword of entry.keywords) {
    const kw = normalize(keyword);
    if (kw.includes(" ")) {
      if (normalized.includes(kw)) score += 4;
    } else if (tokens.has(kw)) {
      score += 2;
    } else if (normalized.includes(kw)) {
      score += 1;
    }
  }

  return score;
}

function bestKnowledgeMatch(message: string) {
  let best: (typeof BOT_KNOWLEDGE)[number] | null = null;
  let bestScore = 0;

  for (const entry of BOT_KNOWLEDGE) {
    const score = scoreEntry(message, entry);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore >= 2 ? best : null;
}

function buildGreetingReply(firstName: string, agent: ChatSupportAgent) {
  return `Hi ${firstName}! I'm ${agent} with AWS Vision Support. Whether it's accounts, deposits, investment plans, or the client portal — I'm here to help. What can I do for you today?`;
}

function buildThanksReply(firstName: string) {
  const closer = hashPick(firstName, CLOSERS, 3);
  return `You're very welcome, ${firstName}! ${closer}`;
}

function humanizeAnswer(answer: string, message: string, firstName: string) {
  const opener = hashPick(message, OPENERS);
  const closer = hashPick(message + answer, CLOSERS, 1);
  const useName = message.length % 3 === 0;
  const prefix = useName ? `${opener} ${firstName}, ` : `${opener} `;
  return `${prefix}${answer} ${closer}`;
}

function fallbackReply(firstName: string, agent: ChatSupportAgent) {
  return `That's a thoughtful question, ${firstName}. I want to make sure you get the right answer — our team can go deeper on anything account-specific. In the meantime, you can browse awsvision.com/faq or email us at ${SITE.email}. I'm ${agent} — is there something about signup, deposits, KYC, investment plans, or the portal I can help clarify?`;
}

export function generateBotReply(
  userMessage: string,
  visitorName: string,
  conversationId: string,
  staffMessageIndex: number
): { body: string; agentName: ChatSupportAgent } {
  const trimmed = userMessage.trim();
  const firstName = visitorFirstName(visitorName);
  const agentName = agentForConversation(conversationId, staffMessageIndex);

  if (!trimmed) {
    return {
      agentName,
      body: `I'm here whenever you're ready, ${firstName}. What would you like to know about AWS Vision?`,
    };
  }

  if (GREETING_PATTERNS.test(trimmed) && trimmed.split(/\s+/).length <= 6) {
    return { agentName, body: buildGreetingReply(firstName, agentName) };
  }

  if (THANKS_PATTERNS.test(trimmed) && trimmed.split(/\s+/).length <= 8) {
    return { agentName, body: buildThanksReply(firstName) };
  }

  const match = bestKnowledgeMatch(trimmed);
  if (match) {
    return {
      agentName,
      body: humanizeAnswer(match.answer, trimmed, firstName),
    };
  }

  return { agentName, body: fallbackReply(firstName, agentName) };
}

export function buildHumanTakeoverNotice(agentName: ChatSupportAgent, visitorName: string) {
  const first = visitorFirstName(visitorName);
  return `${agentName} from our team has joined the chat, ${first}. You're speaking with a live specialist now — how can we help?`;
}
