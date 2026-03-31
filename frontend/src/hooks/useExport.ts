import { useCallback } from 'react'

export function useExport(projectTitle: string) {
  const exportPNG = useCallback(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png', 1.0)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectTitle.replace(/\s+/g, '_')}.png`
    a.click()
  }, [projectTitle])

  const exportJPEG = useCallback(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/jpeg', 0.92)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectTitle.replace(/\s+/g, '_')}.jpg`
    a.click()
  }, [projectTitle])

  return { exportPNG, exportJPEG }
}
