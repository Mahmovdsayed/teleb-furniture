"use client"

import { useEffect, useState } from "react"
import { useForm, type FieldValues, type DefaultValues, type SubmitHandler, type UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ZodTypeAny } from "zod"
import { localizedZodError, type Lang } from "@teleb/validations/errors"

export type FormNotifyOptions = {
  title: string
  type: "success" | "error"
  timeout?: number
}

export interface UseFormHandlerOptions<T extends FieldValues> {
  schema: ZodTypeAny
  service: (data: T, ...args: any[]) => Promise<any>
  defaultValues?: DefaultValues<T>
  values?: T
  
  locale: Lang
  notify?: (options: FormNotifyOptions) => void
  onMutate?: (data: T) => any | Promise<any>
  onSuccess?: (data: any, context?: any) => void | Promise<void>
  onError?: (error: any, context?: any) => void | Promise<void>
}

export function useFormHandler<T extends FieldValues>({ schema, service, defaultValues, values, locale, notify, onMutate, onSuccess, onError }: UseFormHandlerOptions<T>) {
  const [loading, setLoading] = useState(false)
  const activeLocale = locale

  const form = useForm<T>({
    resolver: zodResolver(schema as any, {
      error: localizedZodError(activeLocale) as any,
    }),
    defaultValues,
    values,
    mode: "onChange",
    reValidateMode: "onChange",
  })

  useEffect(() => {
    if (form.formState.isSubmitted) {
      form.trigger()
    }
  }, [activeLocale])

  const submitHandler: SubmitHandler<T> = async (data) => {
    let context: any

    try {
      setLoading(true)
      context = await onMutate?.(data)

      const responseData = await service(data)

      if (responseData?.success === false) {
        const message = responseData.message || "Request failed"

        notify?.({
          title: message,
          type: "error",
          timeout: 5000,
        })

        await onError?.(message, context)
        return
      }

      notify?.({
        title: responseData?.message || "Operation completed successfully",
        type: "success",
        timeout: 5000,
      })

      await onSuccess?.(responseData, context)

      form.reset()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong"

      notify?.({
        title: message,
        type: "error",
        timeout: 5000,
      })

      await onError?.(error, context)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = form.handleSubmit(submitHandler)

  return {
    ...form,
    onSubmit,
    loading,
  } as UseFormReturn<T> & {
    onSubmit: (e?: unknown) => Promise<void>
    loading: boolean
  }
}
