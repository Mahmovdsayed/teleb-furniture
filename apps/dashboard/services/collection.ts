import { api, readResponse, requestOptions, withBody } from "@teleb/api-client"
import type { Collection } from "@teleb/types/collection"
import { CreateCollectionInput, UpdateCollectionInput } from "@teleb/validations/collection"

export const getCollections = async (): Promise<Collection[]> => {
  const body = await readResponse(api.v1.collection.get.$get(undefined, requestOptions()))
  if (body.success === false) throw new Error(body.message || "Failed to fetch collections")
  return body.data ?? []
}

export const deleteCollection = async (id: string, locale: string): Promise<any> => {
  const body = await readResponse(api.v1.collection.delete[":id"].$delete({ param: { id: String(id) } }, requestOptions({ locale, method: "DELETE" })))
  if (body.success === false) throw new Error(body.message || "Failed to delete collection")
  return body
}

export const addCollection = async (payload: CreateCollectionInput, locale: string): Promise<any> => {
  const body = await readResponse(api.v1.collection.create.$post({ json: payload }, requestOptions({ locale, method: "POST" })))
  if (body.success === false) throw new Error(body.message || "Failed to add collection")
  return body
}

export const getCollectionById = async (id: string): Promise<any> => {
  const body = await readResponse(api.v1.collection.get[":id"].$get({ param: { id: String(id) } }, requestOptions()))

  if (body.success === false) {
    if ("code" in body && body.code === "COLLECTION_NOT_FOUND") return null
    throw new Error(body.message || "Failed to fetch collection")
  }

  return body.data ?? null
}

export const updateCollection = async (payload: UpdateCollectionInput, locale: string, id: string): Promise<any> => {
  const body = await readResponse(api.v1.collection.update[":id"].$patch(withBody({ param: { id: String(id) } }, payload), requestOptions({ locale, method: "PATCH" })))
  if (body.success === false) throw new Error(body.message || "Failed to update collection")
  return body
}
