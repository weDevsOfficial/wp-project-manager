/**
 * LoomPreviewContainer — scans HTML content for Loom URLs,
 * batch-fetches preview data, and renders LoomPreviewCard for each.
 */
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useApi } from '@hooks/useApi'
import { extractLoomUrls } from '@/lib/url-strippers'
import LoomPreviewCard from './LoomPreviewCard'

const ERROR_SENTINEL = { error: true }
const FAILED_STATES = ['access_denied', 'error', 'rate_limited']

export default function LoomPreviewContainer({ content }) {
  const api = useApi()
  const [previews, setPreviews] = useState({})
  const cache = useRef(new Map())
  const activeKey = useRef(null)

  const urls = useMemo(() => extractLoomUrls(content), [content])
  const urlsKey = urls.join(',')

  useEffect(() => {
    activeKey.current = urlsKey

    if (!urls.length) { setPreviews({}); return }

    const uncached = urls.filter(u => !cache.current.has(u))
    if (!uncached.length) {
      setPreviews(Object.fromEntries(urls.map(u => [u, cache.current.get(u)])))
      return
    }

    setPreviews(prev => {
      const next = { ...prev }
      urls.forEach(u => { if (!next[u]) next[u] = null })
      return next
    })

    const thisKey = urlsKey

    api.post('loom/batch-preview', { urls: uncached }).then(res => {
      if (activeKey.current !== thisKey) return
      if (res?.success && res.data) {
        Object.entries(res.data).forEach(([url, data]) => cache.current.set(url, data))
      }
      setPreviews(Object.fromEntries(urls.map(u => [u, cache.current.get(u) || ERROR_SENTINEL])))
    }).catch(() => {
      if (activeKey.current !== thisKey) return
      setPreviews(prev => {
        const next = { ...prev }
        urls.forEach(u => { if (next[u] === null) next[u] = ERROR_SENTINEL })
        return next
      })
    })
  }, [urlsKey]) // eslint-disable-line react-hooks/exhaustive-deps

  // The card keeps its current data while refreshing: clearing it first made
  // the card vanish (only loaded cards render), and a failed refresh left it gone.
  const handleRefresh = useCallback((url) => {
    api.post('loom/preview', { url, force_refresh: true }).then(res => {
      if (res) {
        cache.current.set(url, res)
        setPreviews(prev => ({ ...prev, [url]: res }))
      }
    }).catch(() => { /* keep the card that is already shown */ })
  }, [api])

  // Only cards whose data loaded. While a batch is in flight, or when it
  // fails (no access, previews off, past the 10-URL batch cap), the link in
  // the text is the fallback, so there is nothing to hold space for.
  const loaded = urls.filter(url => {
    const data = previews[url]?.data
    return data && !FAILED_STATES.includes(data.state)
  })

  if (!loaded.length) return null

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {loaded.map(url => (
        <LoomPreviewCard
          key={url}
          url={url}
          previewData={previews[url].data}
          onRefresh={() => handleRefresh(url)}
        />
      ))}
    </div>
  )
}
