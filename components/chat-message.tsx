"use client"

import { useState } from "react"
import type { Message } from "ai"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface ChatMessageProps {
  message: Message
  isLastMessage: boolean
}

export default function ChatMessage({ message, isLastMessage }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  const isUser = message.role === "user"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="relative group">
        <div className={isUser ? "chat-bubble-user" : "chat-bubble-bot"}>{message.content}</div>

        {!isUser && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 bg-gray-800/60"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3 text-gray-400" />}
          </Button>
        )}
      </div>
    </div>
  )
}
