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
const PUTER_LOAD_TIMEOUT_MS = 15_000 // wait up to 15s for puter script to load

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

/** Waits for window.puter to be defined (race condition: script may still be loading) */
function waitForPuter(): Promise<void> {
  if (window.puter?.auth) return Promise.resolve()
  return withTimeout(
    new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (window.puter?.auth) {
          clearInterval(interval)
          resolve()
        }
      }, 100)
    }),
    PUTER_LOAD_TIMEOUT_MS,
    'Puter.js load',
  )
}

export async function ensurePuterSignedIn(): Promise<void> {
  await waitForPuter()

  if (!window.puter?.auth) {
    throw new Error('Puter.js failed to load. Please refresh the page.')
  }

  if (!window.puter.auth.isSignedIn()) {
    // Cannot call signIn() here — Chrome blocks window.open in file-chooser context.
    // The UI must show a "Connect Puter" button (direct click) before upload.
    throw new Error('Please connect your Puter account first using the button above, then upload your floor plan.')
  }

  console.log('[puterAI] Signed in to Puter ✓')
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
      { model: 'claude-3-5-sonnet' },
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
