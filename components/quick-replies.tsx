"use client"

import { Button } from "@/components/ui/button"

interface QuickRepliesProps {
  onSelect: (reply: string) => void
}

export default function QuickReplies({ onSelect }: QuickRepliesProps) {
  const suggestions = [
    "Can you help me find a specific document?",
    "Generate a summary report",
    "What recommendations do you have?",
    "Tell me more about legal resources",
  ]

  return (
    <div className="flex flex-wrap gap-2 mt-4 mb-2">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="bg-gray-800/60 border-[#b38c57]/50 hover:bg-[#b38c57]/10 text-sm"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  )
}
