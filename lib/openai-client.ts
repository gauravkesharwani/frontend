import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatCompletionOptions {
  model?: string;
  instructions?: string;
  reasoning?: "low" | "medium" | "high";
}

/**
 * Generate a chat response using OpenAI Responses API
 * Based on OpenAI Responses API pattern from the documentation
 */
export async function generateChatCompletion(
  messages: ChatMessage[],
  options: ChatCompletionOptions = {}
): Promise<string> {
  const {
    model = "gpt-5.2",
    instructions,
    reasoning = "low",
  } = options;

  try {
    // Build the input array according to OpenAI Responses API format
    const input: Array<{ role: "user" | "assistant"; content: string }> = [];

    // Add assistant instructions if provided
    if (instructions) {
      input.push({
        role: "assistant",
        content: instructions,
      });
    }

    // Add conversation messages
    input.push(...messages);

    const response = await openai.responses.create({
      model,
      reasoning: { effort: reasoning },
      input,
    });

    // Extract the response text
    const responseText = response.output_text;

    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    return responseText;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to generate response"
    );
  }
}

/**
 * Generate a chat response with streaming support using OpenAI Responses API
 * Note: Streaming support with Responses API
 */
export async function* generateChatCompletionStream(
  messages: ChatMessage[],
  options: ChatCompletionOptions = {}
): AsyncGenerator<string, void, unknown> {
  const {
    model = "gpt-5.2",
    instructions,
    reasoning = "low",
  } = options;

  try {
    // Build the input array according to OpenAI Responses API format
    const input: Array<{ role: "user" | "assistant"; content: string }> = [];

    if (instructions) {
      input.push({
        role: "assistant",
        content: instructions,
      });
    }

    input.push(...messages);

    // Stream the response
    const stream = await openai.responses.create({
      model,
      reasoning: { effort: reasoning },
      input,
      stream: true,
    });

    for await (const event of stream) {
      // Handle output text delta events
      if (event.type === "response.output_text.delta" && "delta" in event && event.delta) {
        yield event.delta;
      }
    }
  } catch (error) {
    console.error("OpenAI streaming error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to stream response"
    );
  }
}

export default openai;
