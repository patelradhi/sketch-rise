import { FLOOR_PLAN_PROMPT } from './claudePrompt'

declare global {
  interface Window {
    puter: {
      auth: {
        isSignedIn: () => boolean
        signIn: () => Promise<void>
        signOut: () => Promise<void>
      }
      ai: {
        // Image generation with optional input image
        txt2img: (
          prompt: string,
          options?: {
            provider?: string
            model?: string
            input_image?: string
            input_image_mime_type?: string
            ratio?: { w: number; h: number }
          },
        ) => Promise<HTMLImageElement>
      }
    }
  }
}

const PUTER_TIMEOUT_MS = 120_000 // 2 minutes — image generation takes longer
const PUTER_LOAD_TIMEOUT_MS = 15_000

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`${label} timed out after ${ms / 1000}s. Please try again.`)),
        ms,
      ),
    ),
  ])
}

/** Polls until window.puter is ready — fixes race condition when script is still loading */
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
    // signIn() must be called from a direct button click — never from file-chooser flow
    throw new Error('Please connect your Puter account first using the button above, then upload your floor plan.')
  }
  console.log('[puterAI] Signed in to Puter ✓')
}

/**
 * Converts a 2D floor plan (base64 JPEG) into a photorealistic 3D render image.
 * Uses puter.ai.txt2img() with gemini-2.5-flash-image-preview.
 * Returns the rendered image as a data URL string.
 */
export async function generateFloorPlan3D(
  base64Image: string,
  mimeType = 'image/jpeg',
): Promise<string> {
  await ensurePuterSignedIn()

  console.log('[puterAI] Calling puter.ai.txt2img with floor plan image...')

  const response = await withTimeout(
    window.puter.ai.txt2img(FLOOR_PLAN_PROMPT, {
      provider: 'gemini',
      model: 'gemini-2.5-flash-image-preview',
      input_image: base64Image,
      input_image_mime_type: mimeType,
      ratio: { w: 1024, h: 1024 },
    }),
    PUTER_TIMEOUT_MS,
    'Puter AI image generation',
  )

  console.log('[puterAI] Response received:', response)

  const imageUrl = (response as HTMLImageElement).src ?? null

  if (!imageUrl) {
    throw new Error('AI returned no image. Please try a clearer floor plan image.')
  }

  console.log('[puterAI] Image URL:', imageUrl.slice(0, 80) + '...')
  return imageUrl
}
