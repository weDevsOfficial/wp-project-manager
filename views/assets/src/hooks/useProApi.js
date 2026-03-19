/**
 * useProApi — wraps jQuery.ajax for PM Pro REST endpoints (pm-pro/v2 namespace).
 * Same pattern as useApi but hits the Pro namespace.
 */
function request(method, endpoint, data) {
  return new Promise((resolve, reject) => {
    const base = PM_Vars.api_base_url ?? PM_Vars.rest_url ?? ''
    const ns   = 'pm-pro/v2'
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

const proApi = {
  get:  (ep, params) => request('GET',    ep, params),
  post: (ep, body)   => request('POST',   ep, body),
  put:  (ep, body)   => request('PUT',    ep, body),
  del:  (ep)         => request('DELETE', ep),
}

export function useProApi() {
  return proApi
}
