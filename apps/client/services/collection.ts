import { api, readResponse, requestOptions } from "@teleb/api-client"
import type { Collection } from "@teleb/types/collection"

export const getCollections = async (): Promise<Collection[]> => {
  const body = await readResponse(api.v1.collection.get.$get(undefined, requestOptions()))
  if (body.success === false) throw new Error(body.message || "Failed to fetch collections")
  return body.data ?? []
}
