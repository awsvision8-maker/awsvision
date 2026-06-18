/** Client-facing support agent names shown in live chat (never "Admin"). */
export const CHAT_SUPPORT_AGENTS = [
  "Jennifer",
  "Juliyan",
  "Merle",
  "Natasha",
  "Rupert",
] as const;

export type ChatSupportAgent = (typeof CHAT_SUPPORT_AGENTS)[number];

const STAFF_SENDER_TYPES = ["admin", "agent"] as const;

export function isStaffSenderType(senderType: string) {
  return STAFF_SENDER_TYPES.includes(senderType as (typeof STAFF_SENDER_TYPES)[number]);
}

function conversationAgentOffset(conversationId: string) {
  let hash = 0;
  for (let i = 0; i < conversationId.length; i++) {
    hash = (hash + conversationId.charCodeAt(i) * (i + 1)) % CHAT_SUPPORT_AGENTS.length;
  }
  return hash;
}

/** Pick agent name for the nth staff reply in a conversation (rotates per message). */
export function agentForConversation(conversationId: string, staffMessageIndex: number): ChatSupportAgent {
  const offset = conversationAgentOffset(conversationId);
  const index = (offset + staffMessageIndex) % CHAT_SUPPORT_AGENTS.length;
  return CHAT_SUPPORT_AGENTS[index];
}

export function visitorFirstName(visitorName: string) {
  const trimmed = visitorName.trim();
  if (!trimmed) return "there";
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

export function buildAgentGreeting(visitorName: string, agent: string) {
  const first = visitorFirstName(visitorName);
  return `Hi ${first}! I'm ${agent} from AWS Vision Support. How can I help you today?`;
}
