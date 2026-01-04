import { ChatMessage } from "@/types/lead";

export interface ChatApiResponse {
  message: string;
  timestamp: string;
}

export interface ChatApiError {
  error: string;
  message?: string;
  details?: unknown;
}

export interface ChatContext {
  investmentTimeline?: string;
  capitalAvailable?: string;
  investmentPreferences?: string[];
}

/**
 * Send a chat message to the OpenAI-powered chat API
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  context?: ChatContext,
  model?: string
): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        context,
        model,
      }),
    });

    if (!response.ok) {
      const errorData: ChatApiError = await response.json();
      throw new Error(
        errorData.message || errorData.error || "Failed to get response"
      );
    }

    const data: ChatApiResponse = await response.json();
    return data.message;
  } catch (error) {
    console.error("Chat API error:", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred");
  }
}

/**
 * Check if the chat API is available and configured
 */
export async function checkChatApiHealth(): Promise<boolean> {
  try {
    const response = await fetch("/api/chat");
    if (!response.ok) return false;

    const data = await response.json();
    return data.status === "ok" && data.configured === true;
  } catch (error) {
    console.error("Chat API health check failed:", error);
    return false;
  }
}
