"use client"

import { useAppQuery as useSharedAppQuery, type AppQueryArgs } from "@teleb/ui/hooks/use-app-query"

export { keepPreviousData } from "@teleb/ui/hooks/use-app-query"
export type { AppQueryArgs } from "@teleb/ui/hooks/use-app-query"

export function useAppQuery<TData>(options: AppQueryArgs<TData>) {
  return useSharedAppQuery({ refetchOnMount: "always", ...options })
}
