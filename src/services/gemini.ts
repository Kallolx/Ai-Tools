import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '')

export type WasteCategory = 'Recyclable' | 'Non-Recyclable' | 'Compostable' | 'Unknown'

export interface AnalysisResult {
  category: WasteCategory
  explanation: string
  confidence: string
  tips: string[]
}

async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })

  const base64EncodedData = await base64EncodedDataPromise
  const base64Data = base64EncodedData.split(',')[1]

  return {
    inlineData: { data: base64Data, mimeType: file.type },
  }
}

export async function analyzeWasteImage(imageFile: File): Promise<AnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `Analyze this image of waste/garbage and classify it into one of these categories: Recyclable, Non-Recyclable, or Compostable.
    
    Provide your response in this format:
    Category: [category name]
    Confidence: [high/medium/low]
    Explanation: [brief explanation of why it belongs in this category]
    Tips: [2-3 bullet points about proper disposal or recycling of this item]
    
    Be specific and consider the material composition visible in the image.`

    const imagePart = await fileToGenerativePart(imageFile)
    const result = await model.generateContent([prompt, imagePart])
    const response = await result.response
    const text = response.text()

    // Parse the response
    const category = text.match(/Category: (.*)/i)?.[1] as WasteCategory || 'Unknown'
    const confidence = text.match(/Confidence: (.*)/i)?.[1] || 'medium'
    const explanation = text.match(/Explanation: (.*)/i)?.[1] || ''
    const tipsMatch = text.match(/Tips:([\s\S]*?)(?=\n\n|$)/i)
    const tips = tipsMatch 
      ? tipsMatch[1]
        .split('\n')
        .map(tip => tip.trim())
        .filter(tip => tip && !tip.startsWith('Tips:'))
      : []

    return {
      category,
      confidence,
      explanation,
      tips
    }
  } catch (error) {
    console.error('Error analyzing image:', error)
    return {
      category: 'Unknown',
      confidence: 'low',
      explanation: 'Failed to analyze the image',
      tips: ['Please try again with a clearer image']
    }
  }
} 