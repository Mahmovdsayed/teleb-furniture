import type { StateCreator } from "zustand"
import type { AuthUser } from "@teleb/types/auth"
export type User = AuthUser

export interface UserSlice {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  clearUser: () => void
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
})
