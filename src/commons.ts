export const createUrlWithQuery = (url: string, mapQuery: Map<string, any>): string => {
  const params = new URLSearchParams()
  for (const [key, value] of mapQuery) {
    if (value !== null) {
      params.append(key, value)
    }
  }
  return `${url}?${params.toString()}`
}
