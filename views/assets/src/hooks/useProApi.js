/**
 * useProApi — native fetch() wrapper for PM Pro REST endpoints.
 * Base URL comes from PHP: PM_Vars.rest_url_pro (e.g. https://site.com/wp-json/pm-pro/v2/)
 */

function buildQueryString(obj, prefix) {
  const parts = []
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue
    const value = obj[key]
    const paramKey = prefix ? `${prefix}[${key}]` : key

    if (value === undefined || value === null) continue

    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (item !== null && typeof item === 'object') {
          parts.push(buildQueryString(item, `${paramKey}[${i}]`))
        } else {
          parts.push(`${encodeURIComponent(paramKey)}[]=${encodeURIComponent(item)}`)
        }
      })
    } else if (typeof value === 'object') {
      parts.push(buildQueryString(value, paramKey))
    } else {
      parts.push(`${encodeURIComponent(paramKey)}=${encodeURIComponent(value)}`)
    }
  }
  return parts.filter(Boolean).join('&')
}

async function request(method, endpoint, data) {
  let url = PM_Vars.rest_url_pro + endpoint

  const payload = {
    is_admin: PM_Vars.is_admin,
    ...(data && typeof data === 'object' ? data : {}),
  }

  const options = {
    method,
    credentials: 'same-origin',
    headers: {
      'X-WP-Nonce': PM_Vars.permission,
    },
  }

  if (method === 'GET') {
    const qs = buildQueryString(payload)
    if (qs) url += (url.includes('?') ? '&' : '?') + qs
  } else {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(payload)
  }

  let res
  try {
    res = await fetch(url, options)
  } catch {
    throw new Error('Network error')
  }

  let json
  try {
    const text = await res.text()
    json = text ? JSON.parse(text) : {}
  } catch {
    if (res.ok) return {}
    throw new Error(res.statusText || 'API Error')
  }

  if (!res.ok) {
    throw new Error(json?.message ?? res.statusText ?? 'API Error')
  }

  return json ?? {}
}

async function uploadFormData(endpoint, formData) {
  const url = PM_Vars.rest_url_pro + endpoint
  formData.append('is_admin', PM_Vars.is_admin)

  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'X-WP-Nonce': PM_Vars.permission },
      body: formData,
    })
  } catch {
    throw new Error('Network error')
  }

  let json
  try {
    const text = await res.text()
    json = text ? JSON.parse(text) : {}
  } catch {
    if (res.ok) return {}
    throw new Error(res.statusText || 'Upload failed')
  }

  if (!res.ok) {
    throw new Error(json?.message ?? res.statusText ?? 'Upload failed')
  }

  return json ?? {}
}

const proApi = {
  get:    (ep, params)   => request('GET',    ep, params),
  post:   (ep, body)     => request('POST',   ep, body),
  put:    (ep, body)     => request('PUT',    ep, body),
  del:    (ep)           => request('DELETE', ep),
  upload: (ep, formData) => uploadFormData(ep, formData),
}

export function useProApi() {
  return proApi
}
