import type { ApiResponse, ListResponse } from "./api"

export type Collection = {
  id: number
  arName: string
  enName: string
  icon: string
  createdAt: string | Date
  updatedAt: string | Date
}

export type CollectionResponse = ListResponse<Collection>
export type SingleCollectionResponse = ApiResponse<Collection>
