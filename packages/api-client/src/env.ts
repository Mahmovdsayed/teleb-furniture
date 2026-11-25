export const DEFAULT_API_ORIGIN = "https://api.teleb-furniture.com"
// export const API_ORIGIN_ENV_VAR = "http://localhost:8080"

export function getApiOrigin(override?: string): string {
  const raw = override ?? DEFAULT_API_ORIGIN
  return raw.replace(/\/+$/, "")
}
