import { api, compactQuery, readResponse, requestOptions } from "@teleb/api-client"
import type { Message, MessageQueryInput, MessagesResult } from "@teleb/types/message"

export const getMessages = async (query: MessageQueryInput, locale: string): Promise<MessagesResult> => {
  const body = await readResponse(api.v1.message.get.$get({ query: compactQuery(query) }, requestOptions({ locale })))
  if (body.success === false) throw new Error(body.message || "Failed to fetch messages")

  return {
    data: body.data ?? [],
    total: body.total ?? body.data?.length ?? 0,
  }
}

export const getMessageById = async (id: string | number, locale: string): Promise<Message | null> => {
  const body = await readResponse(api.v1.message.get[":id"].$get({ param: { id: String(id) } }, requestOptions({ locale })))
  if (body.success === false) throw new Error(body.message || "Failed to fetch message")
  return body.data ?? null
}

export const deleteMessage = async (id: string | number, locale: string): Promise<any> => {
  const body = await readResponse(api.v1.message.delete[":id"].$delete({ param: { id: String(id) } }, requestOptions({ locale, method: "DELETE" })))
  if (body.success === false) throw new Error(body.message || "Failed to delete message")
  return body
}

export const markMessageAsViewed = async (id: string | number, locale: string): Promise<Message | null> => {
  const body = await readResponse(api.v1.message.update[":id"].view.$patch({ param: { id: String(id) } }, requestOptions({ locale, method: "PATCH" })))
  if (body.success === false) throw new Error(body.message || "Failed to mark message as viewed")
  return body.data ?? null
}
