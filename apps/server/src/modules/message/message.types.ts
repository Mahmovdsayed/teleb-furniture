import type { Lang } from "@teleb/validations/errors"
import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { messageTable } from "../../database/schemas"

import type { MessageListItem as MessageListItemType, Message as MessageResponseType } from "@teleb/types/message"
export type Message = InferSelectModel<typeof messageTable>
export type NewMessage = InferInsertModel<typeof messageTable>
export type Locale = Lang
export type MessageResponse = MessageResponseType
export type MessageListItemResponse = MessageListItemType

export interface IMessageService {
  create(data: import("@teleb/types/message").CreateMessage, locale: Locale): Promise<void>
  getAll(options: import("@teleb/types/message").GetMessagesOptions): Promise<{ data: import("@teleb/types/message").MessageListItem[]; total: number }>
  getById(id: number): Promise<MessageResponse>
  markAsViewed(id: number): Promise<MessageResponse>
  delete(id: number): Promise<void>
}
