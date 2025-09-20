export const slugRegex = /^[a-zA-Z0-9._-]{3,60}$/

export function normalizeUrl(value: string): string | null {
  const s = value.trim()
  if (!s) return null
  const withScheme = /^https?:\/\//i.test(s) ? s : `https://${s}`
  try {
    const u = new URL(withScheme)
    return u.toString()
  } catch {
    return null
  }
}

export function normalizeSlug(raw: string) {
  const cleaned = raw
    .trim()
    .replace(/^https?:\/\/[^/]+\/?/, '')
    .replace(/^brev\.ly\//i, '')
    .toLowerCase()
    .slice(0, 60)

  if (!slugRegex.test(cleaned)) {
    return null
  }

  return cleaned
}

export function normalizeBaseDomain(raw: string) {
  const baseDomain = raw.replace(/^https?:\/\//i, '').replace(/\/$/, '')

  return baseDomain
}
