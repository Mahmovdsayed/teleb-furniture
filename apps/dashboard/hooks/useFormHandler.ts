"use client"

import type { FieldValues } from "react-hook-form"
import { useLocale } from "next-intl"
import { useFormHandler as useSharedFormHandler, type UseFormHandlerOptions as SharedUseFormHandlerOptions } from "@teleb/ui/hooks/use-form-handler"
import type { Lang } from "@teleb/validations/errors"
import { toast } from "@teleb/ui/components/toast"

export type { FormNotifyOptions } from "@teleb/ui/hooks/use-form-handler"
export type UseFormHandlerOptions<T extends FieldValues> = Omit<SharedUseFormHandlerOptions<T>, "locale">

export function useFormHandler<T extends FieldValues>(options: UseFormHandlerOptions<T>) {
  const locale = useLocale() as Lang

  return useSharedFormHandler({
    ...options,
    locale,
    notify: options.notify ?? ((notification) => toast.add(notification)),
  })
}
