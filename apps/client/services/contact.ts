import { api, readResponse, requestOptions } from "@teleb/api-client"
import type { CreateMessageInput } from "@teleb/validations/message"

export const sendMessage = async (payload: CreateMessageInput, locale: string): Promise<any> => {
  const body = await readResponse(api.v1.message.create.$post({ json: payload }, requestOptions({ locale, method: "POST" })))
  if (body.success === false) throw new Error(body.message || "Failed to fetch banners")
  return body
}
