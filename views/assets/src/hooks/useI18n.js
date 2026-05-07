/** Wraps WordPress __() / _n() / sprintf() translation functions with safe fallback */
export function useI18n(defaultDomain = 'wedevs-project-manager') {
  return {
    __: (text, domain) =>
      typeof window.__ === 'function' ? window.__(text, domain ?? defaultDomain) : text,
    _n: (single, plural, n, domain) =>
      typeof window._n === 'function' ? window._n(single, plural, n, domain ?? defaultDomain) : (n === 1 ? single : plural),
    sprintf: (fmt, ...args) =>
      typeof window.wp?.i18n?.sprintf === 'function' ? window.wp.i18n.sprintf(fmt, ...args) : args.reduce((s, a) => s.replace(/%s/, a), fmt),
  }
}
