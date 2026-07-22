import { useEffect, useMemo } from 'react'

export function useObjectUrl(blob: Blob | undefined): string | undefined {
  const url = useMemo(() => {
    if (!blob) {
      return undefined
    }
    return URL.createObjectURL(blob)
  }, [blob])

  useEffect(() => {
    return () => {
      if (url) {
        URL.revokeObjectURL(url)
      }
    }
  }, [url])

  return url
}
