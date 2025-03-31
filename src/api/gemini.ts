import { GoogleGenerativeAI } from '@google/generative-ai'
import { BaseChatCompletionOptions } from './types'
import { handleError, finishLoading } from './utils'
import { RateLimiter } from './geminiRateLimiter'

const rateLimiter = new RateLimiter(15, 50);
interface ChatCompletionStreamOptions extends BaseChatCompletionOptions {
  geminiAPIKey: string
  geminiModel?: string
}

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || 'your_api_key_here'

if (!GEMINI_API_KEY) {
  throw new Error('Gemini API key is missing. Please set VITE_GEMINI_API_KEY in your .env file.')
}

async function createChatCompletionStream(
  options: ChatCompletionStreamOptions
): Promise<void> {
  try {
    await rateLimiter.acquire();
    const geminiAPIKey = options.geminiAPIKey ?? GEMINI_API_KEY

    const genAI = new GoogleGenerativeAI(geminiAPIKey)
    const model = genAI.getGenerativeModel(
      { model: options.geminiModel ?? 'gemini-1.5-flash' }
    )

    const chat = model.startChat({
      history: options.historyDialog.value,
      generationConfig: {
        maxOutputTokens: options.maxTokens ?? 800,
        temperature: options.temperature ?? 0.7
      }
    })

    const result = await chat.sendMessage(options.messages as string)
    const text = (await result.response).text()

    options.result.value = text
    options.historyDialog.value.push(
      {
        role: 'user',
        parts: [{ text: options.messages as string }]
      },
      {
        role: 'model',
        parts: [{ text }]
      }
    )
  } catch (error) {
    handleError(error as Error, options.result, options.errorIssue)
  } finally {
    finishLoading(options.loading)
  }
}

interface TranslationOptions {
  text: string
  targetLanguage: string
  temperature?: number
  model?: string
}

export async function translateText(options: TranslationOptions): Promise<string> {
  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_api_key_here') {
      throw new Error('Please set your Gemini API key in the .env file')
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ 
      model: options.model ?? 'gemini-1.5-flash',
      generationConfig: {
        temperature: options.temperature ?? 0.7
      }
    })

    const prompt = `You are a professional ${options.targetLanguage} translator focused on accuracy and natural-sounding translations. Translate the following text to ${options.targetLanguage}:\n${options.text}. Improve the language quality 
    from basic to sophisticated where appropriate. Provide only the translation without explanations.`
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Translation error:', error)
    throw new Error('Translation failed. Please try again.')
  }
}

export default { createChatCompletionStream }
