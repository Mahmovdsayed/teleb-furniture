import type { ActionResponse, ApiResponse, ListResponse } from "./api"
import type { MessagePriority, MessageSortField, SortOrder } from "./common"

export type Message = {
  id: number
  fullName: string
  email: string
  phone: string
  subject: string
  message: string
  isViewed: boolean
  priority: string
  createdAt: string | Date
  updatedAt: string | Date
}

export type MessageListItem = {
  id: number
  fullName: string
  email: string
  phone: string
  subject: string
  message?: string
  priority: string
  isViewed: boolean
  createdAt: string | Date
}

export type MessageResponse = ListResponse<Message>
export type MessageSingleResponse = ApiResponse<Message>
export type MessageCreateResponse = ActionResponse

export type MessagesResult = {
  data: MessageListItem[]
  total: number
}

export type MessageQueryInput = {
  page?: number | undefined
  limit?: number | undefined
  isViewed?: boolean | undefined
  sort?: MessageSortField | undefined
  order?: SortOrder | undefined
  search?: string | undefined
  priority?: MessagePriority | undefined
}

export type GetMessagesOptions = MessageQueryInput & {
  page: number
  limit: number
}

export interface CreateMessage {
  fullName: string
  email: string
  phone: string
  subject: string
  message: string
}
