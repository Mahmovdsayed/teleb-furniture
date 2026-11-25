type LoaderArgs = {
  src: string
  width: number
  quality?: number
}

const UPLOAD_SEGMENT = "/image/upload/"

export default function cloudinaryLoader({ src, width, quality }: LoaderArgs): string {
  const index = src.indexOf(UPLOAD_SEGMENT)
  if (index === -1) return src

  const base = src.slice(0, index + UPLOAD_SEGMENT.length)
  const rest = src.slice(index + UPLOAD_SEGMENT.length)
  return `${base}w_${width},q_${quality ?? 75},c_limit/${rest}`
}
