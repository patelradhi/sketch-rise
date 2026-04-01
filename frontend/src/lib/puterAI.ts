import { FLOOR_PLAN_PROMPT } from './claudePrompt'
import type { RenderData } from './types'

// Puter.js is loaded via <script src="https://js.puter.com/v2/"> in index.html
// It gives us FREE Claude access — no API key, no cost
declare global {
  interface Window {
    puter: {
      ai: {
        chat: (
          prompt: string,
          options?: {
            model?: string
            image?: string
          },
        ) => Promise<{
          message: {
            content: Array<{ text: string }>
          }
        }>
      }
    }
  }
}

export async function analyzeFloorPlanWithPuter(base64Image: string): Promise<RenderData> {
  // Check Puter is loaded
  if (!window.puter?.ai) {
    throw new Error('Puter.js not loaded. Please refresh the page and try again.')
  }

  // Puter expects a full data URL
  const imageDataUrl = `data:image/jpeg;base64,${base64Image}`

  const response = await window.puter.ai.chat(FLOOR_PLAN_PROMPT, {
    model: 'claude-sonnet-4-5',
    image: imageDataUrl,
  })

  const rawText = response.message.content[0]?.text ?? ''

  // Extract JSON block — handle thinking text, markdown fences, extra text
  const jsonMatch = rawText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    console.error('[puterAI] Raw response:', rawText.slice(0, 500))
    throw new Error('AI could not parse this image as a floor plan. Please try a clearer image.')
  }

  let parsed: RenderData
  try {
    parsed = JSON.parse(jsonMatch[0]) as RenderData
  } catch {
    console.error('[puterAI] JSON parse error on:', jsonMatch[0].slice(0, 300))
    throw new Error('AI returned invalid data. Please try again.')
  }

  // Basic validation
  if (!parsed.rooms || !Array.isArray(parsed.rooms)) {
    throw new Error('NOT_A_FLOOR_PLAN: Please upload a valid architectural floor plan image.')
  }

  return parsed
}
