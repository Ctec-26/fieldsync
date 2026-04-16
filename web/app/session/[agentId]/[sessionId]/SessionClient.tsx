"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Clock } from "lucide-react";
import AgentAvatar from "@/components/agents/AgentAvatar";
import FieldSyncLogo from "@/components/ui/FieldSyncLogo";
import type { Agent } from "@/types/agent";
import type { Message } from "@/types/session";

const MAX_MESSAGES = 20;

function useElapsedTime(startTime: number) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);
  const m = Math.floor(elapsed / 60).toString().padStart(2, "0");
  const s = (elapsed % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

interface Props {
  agent: Agent;
  sessionId: string;
}

export default function SessionClient({ agent, sessionId }: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [startTime] = useState(Date.now);
  const elapsed = useElapsedTime(startTime);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const remaining = MAX_MESSAGES - userMessageCount;

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming || remaining <= 0) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsStreaming(true);

    const assistantId = `msg-${Date.now() + 1}`;
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", timestamp: Date.now() },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.id,
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        const lines = text.split("\n\n").filter(Boolean);
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const { content } = JSON.parse(data);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + content } : m
                )
              );
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Sorry — something went wrong. Please try again." }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
      // Check if limit reached — route to evaluation
      const newUserCount = updatedMessages.filter((m) => m.role === "user").length;
      if (newUserCount >= MAX_MESSAGES) {
        setTimeout(() => router.push(`/evaluation/${sessionId}`), 800);
      }
    }
  }, [input, isStreaming, remaining, messages, agent.id, sessionId, router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-navy-deepest/95">
      {/* Minimal header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-navy-accent/20 bg-navy-primary/60 backdrop-blur-sm flex-shrink-0">
        <FieldSyncLogo size={24} />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-text-muted text-xs font-inter">
            <Clock size={12} strokeWidth={1.5} />
            {elapsed}
          </div>
          <div className="text-text-muted text-xs font-inter">
            {userMessageCount}/{MAX_MESSAGES} messages
          </div>
          <button
            onClick={() => router.push(`/evaluation/${sessionId}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-navy-accent/30 text-text-muted hover:text-text-primary hover:border-navy-highlight/40 text-xs font-inter transition-colors"
          >
            <X size={12} strokeWidth={1.5} />
            End Session
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — session info (desktop) */}
        <aside className="hidden lg:flex flex-col gap-4 w-64 p-4 border-r border-navy-accent/15 bg-navy-primary/30 flex-shrink-0">
          <div className="flex flex-col items-center gap-3 pt-4 pb-4 border-b border-navy-accent/15">
            <AgentAvatar agentId={agent.id} size={64} animate />
            <p className="font-grotesk font-semibold text-text-heading text-sm text-center">{agent.name}</p>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold font-inter uppercase"
              style={{ background: `${agent.tagColor}18`, color: agent.tagColor, border: `1px solid ${agent.tagColor}40` }}
            >
              {agent.id}
            </span>
          </div>

          <div className="flex flex-col gap-3 text-xs font-inter">
            <div className="flex justify-between text-text-muted">
              <span>Session ID</span>
              <span className="font-mono text-text-primary truncate max-w-[80px]">{sessionId.slice(-8)}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Messages</span>
              <span className="text-text-primary">{userMessageCount} / {MAX_MESSAGES}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Time</span>
              <span className="text-text-primary">{elapsed}</span>
            </div>
          </div>

          {remaining <= 5 && remaining > 0 && (
            <div className="p-3 rounded-xl border border-amber-primary/30 bg-amber-primary/10 text-amber-primary text-xs font-inter text-center">
              {remaining} message{remaining !== 1 ? "s" : ""} remaining
            </div>
          )}
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Agent thinking indicator */}
          {isStreaming && (
            <div className="px-4 py-2 border-b border-navy-accent/10 bg-navy-secondary/20 flex items-center gap-2 flex-shrink-0">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <AgentAvatar agentId={agent.id} size={20} animate={false} />
              </motion.div>
              <span className="text-text-muted text-xs font-inter">{agent.name} is thinking…</span>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 text-center mt-12"
              >
                <AgentAvatar agentId={agent.id} size={80} animate glitch />
                <h2 className="font-grotesk font-semibold text-xl text-text-heading">{agent.name}</h2>
                <p className="text-text-muted font-inter text-sm max-w-sm">{agent.tagline}</p>
                <p className="text-text-muted font-inter text-sm max-w-md leading-relaxed border border-navy-accent/20 rounded-xl p-4 bg-navy-secondary/20">
                  {agent.introVariants[0]}
                </p>
              </motion.div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 mt-1">
                      <AgentAvatar agentId={agent.id} size={28} animate={false} />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm font-inter leading-relaxed ${
                      msg.role === "user"
                        ? "bg-navy-accent/60 text-text-primary rounded-tr-sm"
                        : "bg-navy-secondary/60 border border-navy-accent/20 text-text-primary rounded-tl-sm"
                    }`}
                  >
                    {msg.content || (
                      <span className="flex gap-1">
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }}>●</motion.span>
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}>●</motion.span>
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}>●</motion.span>
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 p-4 border-t border-navy-accent/20 bg-navy-primary/50">
            {remaining <= 0 ? (
              <div className="text-center text-text-muted text-sm font-inter">
                Session complete.{" "}
                <button
                  onClick={() => router.push(`/evaluation/${sessionId}`)}
                  className="text-amber-primary hover:text-amber-glow underline"
                >
                  Rate your session →
                </button>
              </div>
            ) : (
              <div className="flex items-end gap-3 max-w-4xl mx-auto">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, 500))}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything…"
                  disabled={isStreaming}
                  rows={1}
                  className="flex-1 resize-none bg-navy-secondary/50 border border-navy-accent/30 rounded-xl px-4 py-3 text-text-primary placeholder-text-muted text-sm font-inter focus:outline-none focus:border-navy-highlight/50 disabled:opacity-60 max-h-32"
                  style={{ lineHeight: "1.5" }}
                />
                <div className="flex flex-col items-end gap-1">
                  <span className="text-text-muted text-[10px] font-inter">{input.length}/500</span>
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={sendMessage}
                    disabled={!input.trim() || isStreaming}
                    className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40 transition-colors"
                    style={{ background: "linear-gradient(135deg, #E8B86D, #F5D29A)" }}
                  >
                    <Send size={15} className="text-navy-deepest" strokeWidth={2} />
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
