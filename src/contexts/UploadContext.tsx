import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Media } from '../types'

interface UploadState {
  uploadedMedia: Media | null
  caption: string
  selectedPlatforms: string[]
  postType: 'post_now' | 'draft' | 'scheduled'
  scheduledTime: string
  selectedDate: Date | null
  selectedTime: string
}

interface UploadContextType extends UploadState {
  setUploadedMedia: (media: Media | null) => void
  setCaption: (caption: string) => void
  setSelectedPlatforms: (platforms: string[]) => void
  setPostType: (type: 'post_now' | 'draft' | 'scheduled') => void
  setScheduledTime: (time: string) => void
  setSelectedDate: (date: Date | null) => void
  setSelectedTime: (time: string) => void
  clearUploadState: () => void
}

const UploadContext = createContext<UploadContextType | undefined>(undefined)

const STORAGE_KEY = 'socialai_upload_state'

export function UploadProvider({ children }: { children: ReactNode }) {
  const [uploadedMedia, setUploadedMedia] = useState<Media | null>(null)
  const [caption, setCaption] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [postType, setPostType] = useState<'post_now' | 'draft' | 'scheduled'>('draft')
  const [scheduledTime, setScheduledTime] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState('12:00')

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.uploadedMedia) setUploadedMedia(parsed.uploadedMedia)
        if (parsed.caption) setCaption(parsed.caption)
        if (parsed.selectedPlatforms) setSelectedPlatforms(parsed.selectedPlatforms)
        if (parsed.postType) setPostType(parsed.postType)
        if (parsed.scheduledTime) setScheduledTime(parsed.scheduledTime)
        if (parsed.selectedDate) setSelectedDate(new Date(parsed.selectedDate))
        if (parsed.selectedTime) setSelectedTime(parsed.selectedTime)
      }
    } catch (e) {
      console.error('Failed to load upload state from localStorage:', e)
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const stateToSave = {
        uploadedMedia,
        caption,
        selectedPlatforms,
        postType,
        scheduledTime,
        selectedDate: selectedDate?.toISOString() || null,
        selectedTime
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave))
    } catch (e) {
      console.error('Failed to save upload state to localStorage:', e)
    }
  }, [uploadedMedia, caption, selectedPlatforms, postType, scheduledTime, selectedDate, selectedTime])

  const clearUploadState = () => {
    setUploadedMedia(null)
    setCaption('')
    setSelectedPlatforms([])
    setPostType('draft')
    setScheduledTime('')
    setSelectedDate(null)
    setSelectedTime('12:00')
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <UploadContext.Provider
      value={{
        uploadedMedia,
        caption,
        selectedPlatforms,
        postType,
        scheduledTime,
        selectedDate,
        selectedTime,
        setUploadedMedia,
        setCaption,
        setSelectedPlatforms,
        setPostType,
        setScheduledTime,
        setSelectedDate,
        setSelectedTime,
        clearUploadState
      }}
    >
      {children}
    </UploadContext.Provider>
  )
}

export function useUpload() {
  const context = useContext(UploadContext)
  if (context === undefined) {
    throw new Error('useUpload must be used within an UploadProvider')
  }
  return context
}
