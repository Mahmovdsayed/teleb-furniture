import type { InferInsertModel } from "drizzle-orm"
import { bannerTable } from "../../database/schemas"
import type { Banner } from "@teleb/types/banner"

export type NewBanner = InferInsertModel<typeof bannerTable>

export interface IBannerService {
  getAll(): Promise<Banner[]>
  getById(id: number): Promise<Banner>
  create(data: import("@teleb/types/banner").CreateBanner, userId: number): Promise<Banner>
  update(id: number, data: import("@teleb/types/banner").UpdateBanner): Promise<Banner>
  delete(id: number): Promise<void>
  addImage(bannerId: number, data: import("@teleb/types/banner").AddBannerImage): Promise<Banner>
  updateImage(bannerId: number, imageId: number, data: import("@teleb/types/banner").UpdateBannerImage): Promise<Banner>
  deleteImage(bannerId: number, imageId: number): Promise<Banner>
  reorderImages(bannerId: number, imageIds: number[]): Promise<Banner>
}
