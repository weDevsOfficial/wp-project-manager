/**
 * useApi — wraps jQuery.ajax with WP REST nonce.
 * Sends POST/PUT as form-urlencoded (matches old Vue 2 behavior).
 * Injects is_admin param on every request (required by PM backend).
 */
function request(method, endpoint, data) {
  return new Promise((resolve, reject) => {
    const base = PM_Vars.api_base_url ?? PM_Vars.rest_url ?? ''
    const ns   = PM_Vars.api_namespace ?? 'pm/v2'
    const url  = `${base}${ns}/${endpoint}`

    const payload = {
      is_admin: PM_Vars.is_admin,
      ...(data && typeof data === 'object' ? data : {}),
    }

    jQuery.ajax({
      url,
      method,
      data: payload,
      dataType: 'json',
      beforeSend(xhr) {
        xhr.setRequestHeader('X-WP-Nonce', PM_Vars.permission)
      },
      success: (res) => resolve(res ?? {}),
      error: (xhr, textStatus) => {
        if (textStatus === 'parseerror') {
          resolve({})
          return
        }
        reject(new Error(xhr.responseJSON?.message ?? xhr.statusText ?? 'API Error'))
      },
    })
  })
}

/**
 * Upload files via FormData — needed for discussion/comment file attachments.
 * Vue 2 uses: contentType: false, processData: false with FormData.
 */
function uploadFormData(endpoint, formData) {
  return new Promise((resolve, reject) => {
    const base = PM_Vars.api_base_url ?? PM_Vars.rest_url ?? ''
    const ns   = PM_Vars.api_namespace ?? 'pm/v2'
    const url  = `${base}${ns}/${endpoint}`

    formData.append('is_admin', PM_Vars.is_admin)

    jQuery.ajax({
      url,
      method: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      dataType: 'json',
      beforeSend(xhr) {
        xhr.setRequestHeader('X-WP-Nonce', PM_Vars.permission)
      },
      success: (res) => resolve(res ?? {}),
      error: (xhr, textStatus) => {
        if (textStatus === 'parseerror') {
          resolve({})
          return
        }
        reject(new Error(xhr.responseJSON?.message ?? xhr.statusText ?? 'API Error'))
      },
    })
  })
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
