/**
 * NotionPreviewContainer — scans HTML content for Notion URLs,
 * batch-fetches preview data, and renders NotionPreviewCard for each.
 */
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useApi } from '@hooks/useApi'
import { extractNotionUrls } from '@/lib/url-strippers'
import NotionPreviewCard from './NotionPreviewCard'

export default function NotionPreviewContainer({ content }) {
  const api = useApi()
  const [previews, setPreviews] = useState({})
  const cache = useRef(new Map())

  const urls = useMemo(() => extractNotionUrls(content), [content])
  const urlsKey = urls.join(',')

  useEffect(() => {
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

    api.post('notion/batch-preview', { urls: uncached }).then(res => {
      if (res?.success && res.data) {
        Object.entries(res.data).forEach(([url, data]) => cache.current.set(url, data))
      }
      setPreviews(Object.fromEntries(urls.map(u => [u, cache.current.get(u) || null])))
    }).catch(() => {})
  }, [urlsKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = useCallback((url) => {
    cache.current.delete(url)
    setPreviews(prev => ({ ...prev, [url]: null }))
    api.post('notion/preview', { url, force_refresh: true }).then(res => {
      if (res) { cache.current.set(url, res); setPreviews(prev => ({ ...prev, [url]: res })) }
    }).catch(() => {})
  }, [api])

  if (!urls.length) return null

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {urls.map(url => (
        <NotionPreviewCard
          key={url}
          url={url}
          previewData={previews[url]?.data ?? null}
          loading={previews[url] === null || previews[url] === undefined}
          onRefresh={() => handleRefresh(url)}
        />
      ))}
    </div>
  )
}
