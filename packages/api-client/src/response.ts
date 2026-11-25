export class ApiClientError extends Error {
  readonly status: number
  readonly data: unknown

  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.name = "ApiClientError"
    this.status = status
    this.data = data
  }
}

type JsonResponse = {
  ok: boolean
  status: number
  statusText: string
  json: () => Promise<unknown>
}

export async function readResponse<T extends JsonResponse>(response: T | Promise<T>): Promise<Awaited<ReturnType<T["json"]>>> {
  const resolved = await response

  if (!resolved.ok) {
    const data = (await resolved.json().catch(() => null)) as { message?: unknown; error?: unknown } | null
    const errorValue = data?.error
    const errorMessage = typeof errorValue === "object" && errorValue !== null ? (errorValue as { message?: unknown }).message : errorValue
    const rawMessage = data?.message ?? errorMessage
    const message = typeof rawMessage === "string" ? rawMessage : resolved.statusText || "Request failed"

    throw new ApiClientError(message, resolved.status, data)
  }

  return (await resolved.json()) as Awaited<ReturnType<T["json"]>>
}

export function requestOptions({ locale, method = "GET" }: { locale?: string; method?: string } = {}): {
  headers?: Record<string, string>
  init?: RequestInit
} {
  return {
    ...(locale ? { headers: { "Accept-Language": locale } } : {}),
    ...(method === "GET" ? { init: { cache: "no-store" as RequestCache } } : {}),
  }
}

export function compactQuery<T extends Record<string, unknown>>(query: T): Record<string, unknown> {
  return Object.fromEntries(Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== ""))
}

export function withBody<A extends object, B>(args: A, body: B): A & { json: B } {
  return { ...args, json: body }
}
