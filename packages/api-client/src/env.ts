export const DEFAULT_API_ORIGIN = "https://api.teleb-furniture.com"

export function getApiOrigin(override?: string): string {
  if (override) return override.replace(/\/+$/, "")

  if (typeof window === "undefined" && process.env.API_URL) {
    return process.env.API_URL.replace(/\/+$/, "")
  }

  return (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_ORIGIN).replace(/\/+$/, "")
}
