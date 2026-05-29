"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getPortfolioContext } from "@/lib/rag";

export interface IChatMessage {
  role: "user" | "model";
  content: string;
}

export async function sendChatMessage(history: IChatMessage[], userMessage: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        error: "GEMINI_API_KEY is not configured on the server. Please add it to your .env file to enable the AI assistant.",
      };
    }

    // 1. Retrieve the entire, fresh portfolio context from database
    const context = await getPortfolioContext();

    // 2. Initialize Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);

    // Using gemini-2.5-flash for maximum speed, huge context window, and premium intelligence
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are the official, friendly AI Chat Assistant for Shaikh Abdullah (aka perhac). 
Your primary task is to answer professional and casual inquiries about Abdullah's B.Tech studies at IIIT Bhagalpur, his technical skills, background, experiences, contact options, and projects.

Here is the 100% accurate, real-time context about Abdullah retrieved directly from his database:
---------------------------------------------
${context}
---------------------------------------------

GUIDELINES:
1. Speak professionally, warmly, and enthusiastically as Abdullah's assistant.
2. Keep your answers brief, clear, and easy to read. Use bullet points and clean paragraphs.
3. Be strictly honest and truthful. Base your answers ONLY on the provided context above.
4. If a visitor asks a question that is NOT covered by the context (e.g., asking for unrelated facts, coding questions, opinions, or details of projects not listed), politely say that you do not have that information and invite them to leave a message in the "Contact" section at the bottom of the home page. Do NOT make up or hallucinate any facts.
5. Emphasize his core technologies (React, Next.js, Node.js, TypeScript, MongoDB, Cloudinary, etc.) when appropriate.
6. Provide exact links (like GitHub URLs, live demos, resume link) whenever the user asks about them, using clean Markdown formatting: [Link Text](URL). Do NOT write raw URLs without markdown wrapper, and do NOT make up URLs that are not in the context.
7. Avoid overly robotic phrasing. Sound human, welcoming, and intelligent.`,
    });

    // 3. Format history for Gemini SDK
    // Gemini chat history requires the first message to be from the 'user'.
    // We filter out any leading model greeting messages.
    const firstUserMsgIndex = history.findIndex((msg) => msg.role === "user");
    const filteredHistory = firstUserMsgIndex !== -1 ? history.slice(firstUserMsgIndex) : [];

    const formattedHistory = filteredHistory.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    // 4. Start Chat session
    const chat = model.startChat({
      history: formattedHistory,
    });

    // 5. Send message and get response
    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text();

    return {
      success: true,
      reply: responseText,
    };
  } catch (error) {
    console.error("Failed to generate chat response:", error);
    return {
      success: false,
      error: "An unexpected error occurred while communicating with the AI. Please try again later.",
    };
  }
}
