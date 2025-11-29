import type { CloudinaryUploadResponse } from '../types'

export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

  const resourceType = file.type.startsWith('video') ? 'video' : 'image'

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    {
      method: 'POST',
      body: formData
    }
  )

  if (!response.ok) {
    throw new Error('Failed to upload to Cloudinary')
  }

  const data = await response.json()

  // For videos, generate a thumbnail URL using Cloudinary transformations
  // Cloudinary doesn't return thumbnail_url for videos, so we create one
  let thumbnailUrl = data.secure_url
  if (resourceType === 'video' && data.secure_url) {
    // Transform: get first frame (so_0), convert to jpg, resize to 400x400 with fill
    thumbnailUrl = data.secure_url
      .replace('/video/upload/', '/video/upload/so_0,f_jpg,w_400,h_400,c_fill/')
      .replace(/\.[^/.]+$/, '.jpg')
  }

  return {
    public_id: data.public_id,
    secure_url: data.secure_url,
    url: data.url,
    format: data.format,
    resource_type: data.resource_type,
    width: data.width,
    height: data.height,
    bytes: data.bytes,
    duration: data.duration,
    thumbnail_url: thumbnailUrl
  }
}
