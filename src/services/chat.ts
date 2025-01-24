import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '')

// System prompt that defines the AI's context and knowledge
const SYSTEM_PROMPT = `You are a concise AI assistant. Give extremely brief, direct answers.

Tools:
• Garbage Sorter: Classifies waste as recyclable/non-recyclable/compostable
• Energy Analysis: Solar recommendations and efficiency tips
• More tools coming soon

Rules:
1. Keep ALL responses under 50 words
2. No greetings or pleasantries
3. No marketing language
4. Just facts and instructions
5. Use bullet points for steps

For images: Give only category and 1-2 disposal tips.`

export interface ChatAttachment {
  type: 'image'
  data: string
  mimeType: string
}

async function fileToGenerativePart(file: File): Promise<ChatAttachment> {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })

  const base64EncodedData = await base64EncodedDataPromise
  const base64Data = base64EncodedData.split(',')[1]

  return {
    type: 'image',
    data: base64Data,
    mimeType: file.type,
  }
}

export async function sendChatMessage(message: string, attachments: File[] = []) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    // Enforce brevity in every response
    const parts = [
      SYSTEM_PROMPT + 
      "\n\nIMPORTANT: Keep response under 50 words, no greetings, no marketing.\n\nUser: " + 
      message
    ]
    
    if (attachments.length > 0) {
      const attachmentParts = await Promise.all(
        attachments.map(file => fileToGenerativePart(file))
      )
      
      parts.push("\n\nFor each image, give only: 1) Category 2) One disposal tip")
      attachmentParts.forEach((part, index) => {
        parts.push(`\nImage ${index + 1}: ${part}`)
      })
    }

    const result = await model.generateContent(parts)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error in chat:', error)
    throw new Error('Failed to get response. Please try again.')
  }
} 