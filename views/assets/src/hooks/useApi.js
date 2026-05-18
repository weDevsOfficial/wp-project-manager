/**
 * useApi — native fetch() wrapper for PM REST endpoints.
 * Sends POST/PUT/DELETE as JSON, GET as query params.
 * Injects is_admin param on every request (required by PM backend).
 *
 * Base URL comes from PHP: PM_Vars.rest_url (e.g. https://site.com/wp-json/pm/v2/)
 */

/**
 * Serialize an object into URL query string.
 * Handles flat values, arrays (key[]=val), and nested objects (key[sub]=val).
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
  // PM_Vars.rest_url is the full base: https://site.com/wp-json/pm/v2/
  let url = PM_Vars.rest_url + endpoint

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

  // Parse response — gracefully handle empty or non-JSON responses
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

/**
 * Upload files via FormData — needed for discussion/comment file attachments.
 */
async function uploadFormData(endpoint, formData) {
  const url = PM_Vars.rest_url + endpoint

  formData.append('is_admin', PM_Vars.is_admin)

  const options = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'X-WP-Nonce': PM_Vars.permission,
      // Do NOT set Content-Type — browser sets it with multipart boundary
    },
    body: formData,
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
    throw new Error(res.statusText || 'Upload failed')
  }

  if (!res.ok) {
    throw new Error(json?.message ?? res.statusText ?? 'Upload failed')
  }

  return json ?? {}
}

// Stable singleton — same reference every render, safe in useCallback deps
const api = {
  get:    (ep, params)   => request('GET',    ep, params),
  post:   (ep, body)     => request('POST',   ep, body),
  put:    (ep, body)     => request('PUT',    ep, body),
  del:    (ep)           => request('DELETE', ep),
  upload: (ep, formData) => uploadFormData(ep, formData),
}

export function useApi() {
  return api
}
