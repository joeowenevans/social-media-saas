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
    thumbnail_url: data.thumbnail_url || data.secure_url
  }
}
