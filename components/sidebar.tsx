"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Trash2, MessageSquare, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { ChatSession } from "@/components/chat-interface"
import { formatDistanceToNow } from "date-fns"

interface SidebarProps {
  chatSessions: ChatSession[]
  activeChatId: string | null
  onChatSelect: (chatId: string) => void
  onChatDelete: (chatId: string) => void
  onNewChat: () => void
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({
  chatSessions,
  activeChatId,
  onChatSelect,
  onChatDelete,
  onNewChat,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSessions = chatSessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.summary.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div
      className={`h-full bg-black/60 backdrop-blur-md border-r border-gray-800 transition-all duration-300 flex flex-col ${
        isOpen ? "w-80" : "w-0"
      }`}
    >
      <div className="absolute top-4 -right-10 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="bg-gray-900/60 hover:bg-gray-800/60 text-white"
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>

      {isOpen && (
        <>
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-center mb-4">
              <h2 className="text-xl adsero-font gold-text">ADSERO</h2>
            </div>
            <Button onClick={onNewChat} className="w-full mb-4 bg-[#b38c57] hover:bg-[#b38c57]/80 text-black">
              New Chat
            </Button>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-gray-900/60 border-gray-700 focus-visible:ring-[#b38c57]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className={`sidebar-item group relative ${activeChatId === session.id ? "sidebar-item-active" : ""}`}
                  onClick={() => onChatSelect(session.id)}
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 mt-0.5 text-[#b38c57]" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-white truncate">{session.title}</h3>
                      <p className="text-xs text-gray-400 truncate">{session.summary}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      onChatDelete(session.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <p className="text-gray-400 text-sm">No conversations found</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
