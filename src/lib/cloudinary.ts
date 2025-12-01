import type { CloudinaryUploadResponse } from '../types'

// Configuration
const CHUNK_SIZE = 20 * 1024 * 1024 // 20MB chunks
const VIDEO_TIMEOUT = 120000 // 120 seconds for videos
const IMAGE_TIMEOUT = 60000 // 60 seconds for images

/**
 * Upload a file to Cloudinary with timeout and chunked upload support for large files
 */
export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResponse> {
  const isVideo = file.type.startsWith('video')
  const resourceType = isVideo ? 'video' : 'image'
  const timeout = isVideo ? VIDEO_TIMEOUT : IMAGE_TIMEOUT

  // Use chunked upload for large files (>20MB)
  if (file.size > CHUNK_SIZE) {
    return uploadChunked(file, resourceType, timeout)
  }

  return uploadDirect(file, resourceType, timeout)
}

/**
 * Direct upload for smaller files
 */
async function uploadDirect(
  file: File,
  resourceType: string,
  timeout: number
): Promise<CloudinaryUploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
        signal: controller.signal
      }
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `Upload failed with status ${response.status}`)
    }

    const data = await response.json()
    return formatResponse(data, resourceType)
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error(`Upload timed out after ${timeout / 1000} seconds. Please try a smaller file or check your connection.`)
    }
    throw error
  }
}

/**
 * Chunked upload for large files (>20MB)
 * Uses Cloudinary's chunked upload API for better reliability
 */
async function uploadChunked(
  file: File,
  resourceType: string,
  timeout: number
): Promise<CloudinaryUploadResponse> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  const uniqueUploadId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`

  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
  let uploadedBytes = 0

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * CHUNK_SIZE
    const end = Math.min(start + CHUNK_SIZE, file.size)
    const chunk = file.slice(start, end)

    const formData = new FormData()
    formData.append('file', chunk)
    formData.append('upload_preset', uploadPreset)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData,
          signal: controller.signal,
          headers: {
            'X-Unique-Upload-Id': uniqueUploadId,
            'Content-Range': `bytes ${start}-${end - 1}/${file.size}`
          }
        }
      )

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Chunk upload failed with status ${response.status}`)
      }

      uploadedBytes += chunk.size

      // Last chunk returns the full response
      if (chunkIndex === totalChunks - 1) {
        const data = await response.json()
        return formatResponse(data, resourceType)
      }
    } catch (error: any) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error(`Upload timed out after ${timeout / 1000} seconds. Please try again or check your connection.`)
      }
      throw new Error(`Failed to upload chunk ${chunkIndex + 1}/${totalChunks}: ${error.message}`)
    }
  }

  throw new Error('Chunked upload failed unexpectedly')
}

/**
 * Format Cloudinary response with thumbnail URL for videos
 */
function formatResponse(data: any, resourceType: string): CloudinaryUploadResponse {
  // For videos, generate a thumbnail URL using Cloudinary transformations
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
