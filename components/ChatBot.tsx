"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, Trash2 } from "lucide-react";
import { sendChatMessage, IChatMessage } from "@/actions/chatActions";
import { useToast } from "@/hooks/use-toast";

const SUGGESTIONS = [
  "What projects has Shaikh built?",
  "Tell me about his technical skills",
  "What about his leadership skills",
  "What is his experience in React?",
  "How can I contact him?",
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load chat history from sessionStorage on mount
  useEffect(() => {
    try {
      const savedMessages = sessionStorage.getItem("portfolio_chat_history");
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Welcome message
        setMessages([
          {
            role: "model",
            content: "Hi! I'm Shaikh's AI Assistant.\n\nAsk me anything about his B.Tech studies at IIIT Bhagalpur, his technical projects, professional experience, or how to contact him!",
          },
        ]);
      }
    } catch (e) {
      console.error("Failed to load chat history", e);
    }
  }, []);

  // Save chat history to sessionStorage on change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem("portfolio_chat_history", JSON.stringify(messages));
      } catch (e) {
        console.error("Failed to save chat history", e);
      }
    }
  }, [messages]);

  // Scroll to bottom when messages change or chat is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: IChatMessage = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare history (excluding system prompt logic which is handled on server)
      const result = await sendChatMessage(messages, textToSend);

      if (result.success && result.reply) {
        setMessages([...updatedMessages, { role: "model", content: result.reply }]);
      } else {
        toast({
          title: "Failed to send",
          description: result.error || "Something went wrong.",
          variant: "destructive",
        });
        // Append error notice in chat so it's visible
        setMessages([
          ...updatedMessages,
          {
            role: "model",
            content: ` **Error**: ${result.error || "Unable to reach the AI assistant. Please check your internet connection or server configurations."}`,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const defaultWelcome: IChatMessage[] = [
      {
        role: "model",
        content: "Hi! I'm Shaikh's AI Assistant. \n\nAsk me anything about his B.Tech studies at IIIT Bhagalpur, his technical projects, professional experience, or how to contact him!",
      },
    ];
    setMessages(defaultWelcome);
    sessionStorage.removeItem("portfolio_chat_history");
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  // Helper to parse basic markdown inside bubbles (bold and links)
  const renderFormattedText = (text: string) => {
    let parts: React.ReactNode[] = [text];

    // 1. Bold pattern **boldText**
    parts = parts.flatMap((part) => {
      if (typeof part !== "string") return part;
      const subparts = part.split(/\*\*([^*]+)\*\*/g);
      return subparts.map((sub, idx) =>
        idx % 2 === 1 ? (
          <strong key={idx} className="font-bold text-foreground">
            {sub}
          </strong>
        ) : (
          sub
        )
      );
    });

    // 2. Link pattern [labelText](url)
    parts = parts.flatMap((part) => {
      if (typeof part !== "string") return part;
      const subparts = part.split(/\[([^\]]+)\]\(([^)]+)\)/g);
      const result: React.ReactNode[] = [];
      for (let i = 0; i < subparts.length; i++) {
        if (i % 3 === 0) {
          result.push(subparts[i]);
        } else if (i % 3 === 1) {
          const label = subparts[i];
          const url = subparts[i + 1] || "";
          result.push(
            <a
              key={`link-${i}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary dark:text-amber-400 hover:underline font-semibold inline-flex items-center gap-0.5"
            >
              {label}
            </a>
          );
          i++;
        }
      }
      return result;
    });

    return parts;
  };

  const parseMarkdown = (rawText: string) => {
    const lines = rawText.split("\n");
    return lines.map((line, i) => {
      const cleanLine = line.trim();
      if (cleanLine.startsWith("* ") || cleanLine.startsWith("- ")) {
        return (
          <li key={i} className="ml-5 list-disc mb-1.5 text-sm leading-relaxed text-card-foreground/90">
            {renderFormattedText(cleanLine.substring(2))}
          </li>
        );
      }
      if (cleanLine.startsWith("### ")) {
        return (
          <h4 key={i} className="text-sm font-semibold text-foreground mt-3 mb-1">
            {renderFormattedText(cleanLine.substring(4))}
          </h4>
        );
      }
      return (
        <p key={i} className="mb-2 text-sm leading-relaxed text-card-foreground/90 break-words">
          {renderFormattedText(cleanLine)}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Trigger Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-accent text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
          aria-label="Open AI Assistant"
        >
          {/* Notification Alert Dot */}
          {hasNewMessage && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
          )}

          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-primary to-accent opacity-0 group-hover:opacity-30 blur transition duration-300"></span>

          <MessageSquare className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="flex h-[560px] w-[380px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-border/80 bg-background/95 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out animate-in slide-in-from-bottom-5 fade-in-20">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 bg-card/40 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background"></span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-foreground">Shaikh&apos;s Assistant</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  Online • Vectorless RAG
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleClearChat}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted/80 hover:text-destructive transition-colors duration-200"
                title="Clear Chat History"
                aria-label="Clear chat history"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={toggleChat}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors duration-200"
                title="Minimize Chat"
                aria-label="Close chat"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.map((msg, index) => {
              const isBot = msg.role === "model";
              return (
                <div
                  key={index}
                  className={`flex ${isBot ? "justify-start" : "justify-end"} animate-in fade-in-50 duration-200`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${isBot
                      ? "bg-card/75 border border-border/50 text-foreground rounded-tl-sm"
                      : "bg-primary text-primary-foreground rounded-tr-sm"
                      }`}
                  >
                    {isBot ? parseMarkdown(msg.content) : <p className="leading-relaxed break-words">{msg.content}</p>}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in-50 duration-200">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-card/75 border border-border/50 px-4 py-3">
                  <div className="flex items-center gap-1 py-1.5 px-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          {messages.length <= 1 && !isLoading && (
            <div className="px-5 py-2 space-y-1.5 bg-card/20 border-t border-border/40">
              <span className="text-[11px] font-medium tracking-wide uppercase text-muted-foreground/75 block">
                Suggested Questions
              </span>
              <div className="flex flex-wrap gap-1.5 pb-1">
                {SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(sug)}
                    className="rounded-full border border-border/80 bg-background/50 hover:bg-primary/5 hover:border-primary/40 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-all duration-200 text-left active:scale-97"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="flex items-center gap-2 border-t border-border/60 p-4 bg-card/30 rounded-b-2xl"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me something..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-border/80 bg-background/80 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1.5 focus:ring-primary disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
