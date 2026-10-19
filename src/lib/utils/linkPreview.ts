export interface LinkMetadata {
  url: string;
  domain: string;
  provider: "chatgpt" | "gemini" | "claude" | "youtube" | "docs" | "general";
  title: string;
  badgeColor: string;
  iconType: string;
}

export function extractLinks(text: string): LinkMetadata[] {
  if (!text) return [];

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  if (!matches) return [];

  return matches.map((url) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();

      if (host.includes("chatgpt.com") || host.includes("openai.com")) {
        return {
          url,
          domain: "ChatGPT",
          provider: "chatgpt",
          title: "ChatGPT Shared Conversation / Prompt",
          badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          iconType: "ai",
        };
      }

      if (host.includes("gemini.google.com") || host.includes("ai.google")) {
        return {
          url,
          domain: "Google Gemini",
          provider: "gemini",
          title: "Gemini AI Workspace Session",
          badgeColor: "bg-brand-500/20 text-brand-300 border-brand-500/30",
          iconType: "ai",
        };
      }

      if (host.includes("claude.ai") || host.includes("anthropic.com")) {
        return {
          url,
          domain: "Claude AI",
          provider: "claude",
          title: "Claude AI Knowledge Artifact",
          badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
          iconType: "ai",
        };
      }

      if (host.includes("youtube.com") || host.includes("youtu.be")) {
        return {
          url,
          domain: "YouTube",
          provider: "youtube",
          title: "Video Lecture / Tutorial",
          badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
          iconType: "video",
        };
      }

      return {
        url,
        domain: parsed.hostname.replace("www.", ""),
        provider: "general",
        title: "Web Resource & Reference Link",
        badgeColor: "bg-accent-sky/20 text-accent-sky border-accent-sky/30",
        iconType: "web",
      };
    } catch (e) {
      return {
        url,
        domain: "External Link",
        provider: "general",
        title: url,
        badgeColor: "bg-gray-700 text-gray-300 border-gray-600",
        iconType: "web",
      };
    }
  });
}
