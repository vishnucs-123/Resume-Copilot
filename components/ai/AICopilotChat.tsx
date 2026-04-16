"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

export default function AICopilotChat({ resumeText }: { resumeText: string }) {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim() || !resumeText) return;
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, resumeContext: resumeText }),
      });
      const data = await res.json();
      if (data.result) {
        setMessages((prev) => [...prev, { role: "ai", content: data.result }]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = content;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const clearChat = () => setMessages([]);

  const suggestions = [
    "Make my summary more impactful",
    "Improve my bullet points",
    "What skills am I missing?",
    "Help me tailor for a senior role",
  ];

  const chatContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-sm">✨</div>
          <div>
            <h3 className="font-bold text-white text-sm leading-tight">Resume AI Copilot</h3>
            <p className="text-indigo-200 text-xs">Your personal resume coach</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              title="Clear chat"
              className="text-indigo-200 hover:text-white transition p-1.5 rounded hover:bg-white/10 text-xs"
            >
              🗑
            </button>
          )}
          {/* Toggle fullscreen — hidden on mobile (always fullscreen there) */}
          <button
            onClick={() => setFullscreen(!fullscreen)}
            title={fullscreen ? "Minimize" : "Expand"}
            className="hidden sm:flex text-indigo-200 hover:text-white transition p-1.5 rounded hover:bg-white/10 text-xs"
          >
            {fullscreen ? "⊡" : "⊞"}
          </button>
          <button
            onClick={() => { setOpen(false); setFullscreen(false); }}
            className="text-indigo-200 hover:text-white transition p-1.5 rounded hover:bg-white/10 font-bold text-base leading-none"
          >
            ×
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-3 sm:p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-6">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl">✨</div>
            <div className="text-center">
              <p className="text-gray-700 font-medium text-sm">How can I improve your resume?</p>
              <p className="text-gray-400 text-xs mt-1">Ask me anything about your resume</p>
            </div>
            <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  className="text-left text-xs bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-600 hover:text-indigo-700 px-3 py-2 rounded-lg transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`relative group max-w-[88%] sm:max-w-[82%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`px-3 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-sm"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                }`}>
                  {msg.content}
                </div>
                {/* Copy button */}
                <button
                  onClick={() => copyMessage(msg.content, i)}
                  className={`mt-1 flex items-center gap-1 text-xs transition px-1.5 py-0.5 rounded ${
                    msg.role === "user"
                      ? "text-indigo-300 hover:text-indigo-100 self-end"
                      : "text-gray-400 hover:text-gray-600 self-start"
                  }`}
                  title="Copy message"
                >
                  {copiedIndex === i ? (
                    <><span>✓</span><span>Copied!</span></>
                  ) : (
                    <><span>⎘</span><span>Copy</span></>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex items-start">
            <div className="bg-white border border-gray-200 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white p-3 flex gap-2 flex-shrink-0">
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Ask anything about your resume..."
          disabled={loading}
          className="flex-1 text-sm border-gray-200 focus-visible:ring-indigo-500 rounded-xl"
        />
        <Button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 flex-shrink-0 text-sm"
        >
          Send
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* FAB Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-3 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
        >
          <span className="text-base">✨</span>
          <span className="hidden sm:inline">AI Copilot</span>
          <span className="sm:hidden">AI</span>
        </button>
      )}

      {/* Chat Window — mobile: fullscreen overlay, desktop: floating or fullscreen panel */}
      {open && (
        <>
          {/* Mobile: always fullscreen */}
          <div className="sm:hidden fixed inset-0 z-50 bg-white flex flex-col">
            {chatContent}
          </div>

          {/* Desktop: floating or fullscreen */}
          <div
            className={`hidden sm:flex fixed z-50 flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ${
              fullscreen
                ? "inset-4"
                : "bottom-6 right-6 w-96 h-[580px]"
            }`}
          >
            {chatContent}
          </div>
        </>
      )}
    </>
  );
}