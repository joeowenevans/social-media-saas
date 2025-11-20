import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Post } from '../types'

export function usePosts(brandId: string | undefined) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!brandId) {
      setLoading(false)
      return
    }

    fetchPosts()
  }, [brandId])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('posts')
        .select('*, media(*)')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false })

      if (error) throw error

      setPosts(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (postData: Partial<Post>) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ ...postData, brand_id: brandId }])
        .select()
        .single()

      if (error) throw error

      await fetchPosts()
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const updatePost = async (postId: string, postData: Partial<Post>) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', postId)
        .select()
        .single()

      if (error) throw error

      await fetchPosts()
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) throw error

      await fetchPosts()
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    refetch: fetchPosts,
  }
}
