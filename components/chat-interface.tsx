"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sidebar } from "@/components/sidebar"
import { MessageSquarePlus, Send, Loader2 } from "lucide-react"
import ChatMessage from "@/components/chat-message"
import QuickReplies from "@/components/quick-replies"
import { nanoid } from "nanoid"

export type ChatSession = {
  id: string
  title: string
  summary: string
  messages: any[]
  createdAt: Date
}

export default function ChatInterface() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
  })

  useEffect(() => {
    // Create a new chat session if none exists
    if (chatSessions.length === 0) {
      createNewChat()
    } else if (!activeChatId) {
      setActiveChatId(chatSessions[0].id)
    }
  }, [chatSessions])

  useEffect(() => {
    // Save current chat session when messages change
    if (activeChatId) {
      setChatSessions((prev) =>
        prev.map((session) => (session.id === activeChatId ? { ...session, messages: messages } : session)),
      )
    }
  }, [messages, activeChatId])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const createNewChat = () => {
    const newChatId = nanoid()
    const newChat: ChatSession = {
      id: newChatId,
      title: "New Chat",
      summary: "New conversation",
      messages: [],
      createdAt: new Date(),
    }

    setChatSessions((prev) => [newChat, ...prev])
    setActiveChatId(newChatId)
    setMessages([])
  }

  const loadChat = (chatId: string) => {
    const chat = chatSessions.find((c) => c.id === chatId)
    if (chat) {
      setActiveChatId(chatId)
      setMessages(chat.messages)
    }
  }

  const deleteChat = (chatId: string) => {
    setChatSessions((prev) => prev.filter((c) => c.id !== chatId))
    if (activeChatId === chatId) {
      if (chatSessions.length > 1) {
        const remainingChats = chatSessions.filter((c) => c.id !== chatId)
        setActiveChatId(remainingChats[0].id)
        setMessages(remainingChats[0].messages)
      } else {
        createNewChat()
      }
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim() === "") return

    // Update chat title after first message
    if (messages.length === 0) {
      setChatSessions((prev) =>
        prev.map((session) =>
          session.id === activeChatId
            ? { ...session, title: input.slice(0, 30) + (input.length > 30 ? "..." : "") }
            : session,
        ),
      )
    }

    handleSubmit(e)
  }

  return (
    <div className="flex h-screen w-full overflow-hidden space-background">
      <Sidebar
        chatSessions={chatSessions}
        activeChatId={activeChatId}
        onChatSelect={loadChat}
        onChatDelete={deleteChat}
        onNewChat={createNewChat}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 flex flex-col h-full bg-black/40 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-xl font-semibold adsero-font gold-text">ADSERO AI ASSISTANT</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={createNewChat}
            className="flex items-center gap-2 border-[#b38c57] text-[#b38c57] hover:bg-[#b38c57]/10"
          >
            <MessageSquarePlus size={16} />
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-3xl font-bold text-white mb-2 adsero-font">Adsero ChatBot</h2>
              <p className="text-gray-300 max-w-md mb-8">
                I can help you manage documents, summarize conversations, generate reports, and provide recommendations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <Button
                  variant="outline"
                  className="p-4 h-auto flex flex-col items-start text-left border-[#b38c57]/50 hover:bg-[#b38c57]/10"
                  onClick={() => handleInputChange({ target: { value: "Show me the latest legal documents" } } as any)}
                >
                  <span className="font-medium mb-1 gold-text">Find documents</span>
                  <span className="text-sm text-gray-400">Search for documents in SharePoint</span>
                </Button>
                <Button
                  variant="outline"
                  className="p-4 h-auto flex flex-col items-start text-left border-[#b38c57]/50 hover:bg-[#b38c57]/10"
                  onClick={() =>
                    handleInputChange({ target: { value: "Generate a summary report of my recent activities" } } as any)
                  }
                >
                  <span className="font-medium mb-1 gold-text">Generate a report</span>
                  <span className="text-sm text-gray-400">Create summaries and insights</span>
                </Button>
                <Button
                  variant="outline"
                  className="p-4 h-auto flex flex-col items-start text-left border-[#b38c57]/50 hover:bg-[#b38c57]/10"
                  onClick={() =>
                    handleInputChange({
                      target: { value: "What legal resources do you recommend for contract review?" },
                    } as any)
                  }
                >
                  <span className="font-medium mb-1 gold-text">Get recommendations</span>
                  <span className="text-sm text-gray-400">Receive personalized suggestions</span>
                </Button>
                <Button
                  variant="outline"
                  className="p-4 h-auto flex flex-col items-start text-left border-[#b38c57]/50 hover:bg-[#b38c57]/10"
                  onClick={() =>
                    handleInputChange({
                      target: { value: "Help me understand the legal implications of this contract" },
                    } as any)
                  }
                >
                  <span className="font-medium mb-1 gold-text">Legal assistance</span>
                  <span className="text-sm text-gray-400">Get help with legal questions</span>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} isLastMessage={index === messages.length - 1} />
              ))}
              {messages.length > 0 && messages[messages.length - 1].role === "assistant" && (
                <QuickReplies onSelect={(reply) => handleInputChange({ target: { value: reply } } as any)} />
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-800">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              className="flex-1 resize-none bg-gray-900/60 border-gray-700 focus-visible:ring-[#b38c57]"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  if (input.trim()) {
                    handleFormSubmit(e as any)
                  }
                }
              }}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#b38c57] hover:bg-[#b38c57]/80 text-black"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
