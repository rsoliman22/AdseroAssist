import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    system: `You are an AI assistant for Adsero, a legal services platform. 
    You help users manage documents, summarize conversations, generate reports, and provide recommendations.
    You have access to Microsoft 365 SharePoint for document management.
    
    When responding:
    1. Be professional, concise, and helpful
    2. Provide contextual recommendations when appropriate
    3. Offer to help with document retrieval or management when relevant
    4. Suggest next steps or related topics that might be helpful
    5. For document requests, explain that you would retrieve them from SharePoint (simulate this)
    6. For report generation, provide a sample of what the report would look like
    
    Always maintain a helpful, professional tone consistent with legal services.`,
    messages,
  })

  return result.toDataStreamResponse()
}
