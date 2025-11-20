import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload as UploadIcon, X, Image, Video } from 'lucide-react'
import { uploadToCloudinary } from '../../lib/cloudinary'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import type { Media } from '../../types'

interface MediaUploaderProps {
  brandId: string
  onUploadComplete: (media: Media) => void
}

export function MediaUploader({ brandId, onUploadComplete }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    const isVideo = file.type.startsWith('video')
    const isImage = file.type.startsWith('image')

    if (!isVideo && !isImage) {
      toast.error('Please upload an image or video file')
      return
    }

    // Check file size (100MB limit for videos)
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(isVideo ? 'Video must be under 100MB' : 'Image must be under 10MB')
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setFileType(isVideo ? 'video' : 'image')

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      // Upload to Cloudinary
      const cloudinaryData = await uploadToCloudinary(file)

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Save to Supabase
      const { data, error } = await supabase
        .from('media')
        .insert([
          {
            brand_id: brandId,
            cloudinary_url: cloudinaryData.secure_url,
            cloudinary_public_id: cloudinaryData.public_id,
            thumbnail_url: cloudinaryData.thumbnail_url,
            media_type: isVideo ? 'video' : 'image',
            file_format: cloudinaryData.format,
            file_size: cloudinaryData.bytes,
            width: cloudinaryData.width,
            height: cloudinaryData.height,
            duration: cloudinaryData.duration || null,
          },
        ])
        .select()
        .single()

      if (error) throw error

      toast.success('Media uploaded successfully!')
      onUploadComplete(data)
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload media')
      setPreview(null)
      setFileType(null)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [brandId, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mov'],
    },
    maxFiles: 1,
    disabled: uploading,
  })

  const clearPreview = () => {
    setPreview(null)
    setFileType(null)
  }

  if (preview && !uploading) {
    return (
      <div className="relative">
        <button
          onClick={clearPreview}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        {fileType === 'video' ? (
          <video
            src={preview}
            controls
            className="w-full max-h-96 rounded-lg shadow-lg"
          />
        ) : (
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-96 object-contain rounded-lg shadow-lg"
          />
        )}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
            <p className="text-gray-600">Uploading... {uploadProgress}%</p>
            <div className="max-w-xs mx-auto bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center space-x-4 mb-4">
              <Image className="w-12 h-12 text-indigo-600" />
              <Video className="w-12 h-12 text-indigo-600" />
            </div>
            <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-lg text-indigo-600 font-medium">Drop your file here...</p>
            ) : (
              <>
                <p className="text-lg text-gray-700 font-medium mb-2">
                  Drag & drop your media here
                </p>
                <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                <p className="text-xs text-gray-400">
                  Supports: JPG, PNG, GIF, MP4, MOV
                  <br />
                  Max size: 10MB for images, 100MB for videos
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
