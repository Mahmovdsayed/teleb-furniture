export type ApiResponse<T> = {
  success: boolean
  data?: T
  code?: string
  message?: string
  error?: string | { message?: string }
}

export type ListResponse<T> = ApiResponse<T[]> & {
  total?: number
}

export type ActionResponse = {
  success: boolean
  code?: string
  message?: string
  error?: string | { message?: string }
}

export type ValidationIssue = {
  path: string
  message: string
}

export type ValidationErrorResponse = ActionResponse & {
  success: false
  errors: ValidationIssue[]
}
