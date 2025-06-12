import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function useThemedLogo(logoPath: string) {
  const { resolvedTheme } = useTheme()
  const [logoSrc, setLogoSrc] = useState(logoPath)

  useEffect(() => {
    if (!logoPath) return

    // Extract the directory and filename
    const lastSlashIndex = logoPath.lastIndexOf('/')
    const directory = logoPath.substring(0, lastSlashIndex)
    const filename = logoPath.substring(lastSlashIndex + 1)
    
    // Remove .svg extension to add theme suffix
    const nameWithoutExt = filename.replace('.svg', '')
    
    // Construct themed logo path
    const themedLogoPath = resolvedTheme === 'dark' 
      ? `${directory}/${nameWithoutExt}_dark.svg`
      : `${directory}/${nameWithoutExt}_light.svg`
    
    // Check if themed version exists by attempting to load it
    const img = new Image()
    img.onload = () => {
      // Themed version exists, use it
      setLogoSrc(themedLogoPath)
    }
    img.onerror = () => {
      // Themed version doesn't exist, fall back to original
      setLogoSrc(logoPath)
    }
    img.src = themedLogoPath
  }, [logoPath, resolvedTheme])

  return logoSrc
}