import { hc } from "hono/client"
import type { AppType } from "@teleb/server"
import { getApiOrigin } from "./env"

export type ApiClientOptions = {
  origin?: string
  headers?: Record<string, string> | (() => Record<string, string> | Promise<Record<string, string>>)
  init?: RequestInit
  fetch?: typeof globalThis.fetch
}

export function createApiClient(options: ApiClientOptions = {}) {
  const { origin, headers, init, fetch } = options

  return hc<AppType>(getApiOrigin(origin), {
    init: { credentials: "include", ...init },
    ...(headers ? { headers } : {}),
    ...(fetch ? { fetch } : {}),
  })
}

export const api = createApiClient()
export type ApiClient = typeof api
