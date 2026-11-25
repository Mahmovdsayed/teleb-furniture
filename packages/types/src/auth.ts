import type { ActionResponse, ApiResponse } from "./api"

export type User = {
  id: number
  name: string
  email: string
  role: string
}

export type AuthUser = Omit<User, "role">

export type LoginData = {
  user: AuthUser
}

export type LoginResponse = ApiResponse<LoginData> & {
  message?: string
}

export type LogoutResponse = ActionResponse
