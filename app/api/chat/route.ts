import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  generateChatCompletion,
  type ChatMessage,
} from "@/lib/openai-client";

// Validation schema for incoming chat requests
const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1, "Message content cannot be empty"),
    })
  ),
  context: z
    .object({
      investmentTimeline: z.string().optional(),
      capitalAvailable: z.string().optional(),
      investmentPreferences: z.array(z.string()).optional(),
    })
    .optional(),
  model: z.string().optional(),
  reasoning: z.enum(["low", "medium", "high"]).optional(),
});

// System instructions for the real estate investment chatbot
const SYSTEM_INSTRUCTIONS = `You are an intelligent assistant for BlackKeyX, a real estate investment platform. Your role is to help potential investors understand real estate investment opportunities and guide them through the qualification process.

Key responsibilities:
- Answer questions about real estate investments, tax advantages, and investment strategies
- Provide information about BlackKeyX's investment opportunities
- Help investors understand their options based on their timeline, capital, and preferences
- Maintain a professional, friendly, and helpful tone
- Keep responses concise and relevant (2-3 sentences typically)
- If asked about specific investment opportunities, explain that you'll match them with suitable options after gathering their information

Important guidelines:
- Do not provide specific financial advice or guarantees
- Always encourage users to consult with financial advisors for personalized advice
- Focus on education and information rather than hard selling
- Be transparent about the qualification process`;

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is not configured");
      return NextResponse.json(
        {
          error: "Chat service is not configured. Please contact support.",
        },
        { status: 503 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = chatRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { messages, context, model, reasoning } = validationResult.data;

    // Build enhanced instructions with context if available
    let instructions = SYSTEM_INSTRUCTIONS;

    if (context) {
      const contextInfo = [];
      if (context.investmentTimeline) {
        contextInfo.push(`Timeline: ${context.investmentTimeline}`);
      }
      if (context.capitalAvailable) {
        contextInfo.push(`Capital: ${context.capitalAvailable}`);
      }
      if (context.investmentPreferences?.length) {
        contextInfo.push(
          `Preferences: ${context.investmentPreferences.join(", ")}`
        );
      }

      if (contextInfo.length > 0) {
        instructions += `\n\nUser Context:\n${contextInfo.join("\n")}`;
      }
    }

    // Call OpenAI to generate response
    const assistantResponse = await generateChatCompletion(
      messages as ChatMessage[],
      {
        model: model || process.env.OPENAI_MODEL || "gpt-5",
        instructions,
        reasoning: reasoning || "low",
      }
    );

    // Return the assistant's response
    return NextResponse.json({
      message: assistantResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat API error:", error);

    // Return appropriate error response
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to generate response",
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET method to check API health
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "BlackKeyX Chat API",
    configured: !!process.env.OPENAI_API_KEY,
  });
}
