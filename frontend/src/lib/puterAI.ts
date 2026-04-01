import { FLOOR_PLAN_PROMPT } from './claudePrompt'
import type { RenderData } from './types'

declare global {
  interface Window {
    puter: {
      auth: {
        isSignedIn: () => boolean
        signIn: () => Promise<void>
      }
      ai: {
        chat: (
          messages: string | Array<{
            role: string
            content: Array<{
              type: string
              text?: string
              image_url?: { url: string }
            }>
          }>,
          options?: {
            model?: string
            stream?: boolean
          },
        ) => Promise<string | {
          message?: { content: Array<{ text: string }> }
          toString?: () => string
        }>
      }
    }
  }
}

const PUTER_TIMEOUT_MS = 90_000 // 90 seconds

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`${label} timed out after ${ms / 1000}s. Please allow Puter popups and sign in, then try again.`)),
        ms,
      ),
    ),
  ])
}

export async function ensurePuterSignedIn(): Promise<void> {
  if (!window.puter?.auth) {
    throw new Error('Puter.js not loaded. Please refresh the page.')
  }

  if (!window.puter.auth.isSignedIn()) {
    console.log('[puterAI] Not signed in — opening Puter login popup...')
    await withTimeout(
      window.puter.auth.signIn(),
      60_000,
      'Puter sign-in',
    )
    console.log('[puterAI] Signed in successfully.')
  } else {
    console.log('[puterAI] Already signed in to Puter.')
  }
}

export async function analyzeFloorPlanWithPuter(base64Image: string): Promise<RenderData> {
  if (!window.puter?.ai) {
    throw new Error('Puter.js not loaded. Please refresh the page.')
  }

  // Ensure the user is authenticated before making the AI call
  await ensurePuterSignedIn()

  const imageDataUrl = `data:image/jpeg;base64,${base64Image}`

  console.log('[puterAI] Calling puter.ai.chat with vision...')

  // Use the messages array format with timeout guard
  const response = await withTimeout(
    window.puter.ai.chat(
      [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: imageDataUrl },
            },
            {
              type: 'text',
              text: FLOOR_PLAN_PROMPT,
            },
          ],
        },
      ],
      { model: 'claude-sonnet-4-5' },
    ),
    PUTER_TIMEOUT_MS,
    'Puter AI chat',
  )

  console.log('[puterAI] Raw response type:', typeof response)
  console.log('[puterAI] Raw response:', JSON.stringify(response)?.slice(0, 300))

  // Handle both string and object responses
  let rawText = ''
  if (typeof response === 'string') {
    rawText = response
  } else if (response?.message?.content?.[0]?.text) {
    rawText = response.message.content[0].text
  } else if (response?.toString) {
    rawText = response.toString()
  }

  console.log('[puterAI] Extracted text:', rawText.slice(0, 200))

  // Extract JSON block
  const jsonMatch = rawText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    console.error('[puterAI] No JSON found. Full response:', rawText)
    throw new Error('AI could not parse this image. Please use a clear floor plan image.')
  }

  let parsed: RenderData
  try {
    parsed = JSON.parse(jsonMatch[0]) as RenderData
  } catch (e) {
    console.error('[puterAI] JSON parse failed:', e)
    throw new Error('AI returned invalid data. Please try again.')
  }

  if (!parsed.rooms || !Array.isArray(parsed.rooms)) {
    throw new Error('Please upload a valid architectural floor plan image.')
  }

  return parsed
}
