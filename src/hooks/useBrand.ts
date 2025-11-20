import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Brand } from '../types'

export function useBrand(userId: string | undefined) {
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    fetchBrand()
  }, [userId])

  const fetchBrand = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setBrand(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createBrand = async (brandData: Partial<Brand>) => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .insert([{ ...brandData, user_id: userId }])
        .select()
        .single()

      if (error) throw error

      setBrand(data)
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const updateBrand = async (brandId: string, brandData: Partial<Brand>) => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .update(brandData)
        .eq('id', brandId)
        .select()
        .single()

      if (error) throw error

      setBrand(data)
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  return {
    brand,
    loading,
    error,
    createBrand,
    updateBrand,
    refetch: fetchBrand,
  }
}
