import { useAuth } from '../hooks/useAuth'
import { useBrand } from '../hooks/useBrand'
import { usePosts } from '../hooks/usePosts'
import { useNavigate, useLocation } from 'react-router-dom'
import { PostScheduler } from '../components/scheduling/PostScheduler'
import { ArrowLeft, Calendar, Clock, Trash2, Sparkles, Upload, CalendarDays, Send } from 'lucide-react'
import { format } from 'date-fns'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { useState } from 'react'

export function Schedule() {
  const { user } = useAuth()
  const { brand, loading } = useBrand(user?.id)
  const { posts, loading: postsloading, refetch } = usePosts(brand?.id)
  const navigate = useNavigate()
  const location = useLocation()
  const [posting, setPosting] = useState<string | null>(null)

  const { media, caption } = location.state || {}

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
        <div className="max-w-md w-full card p-8 text-center animate-fade-in">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg mb-6">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Brand Profile Required</h2>
          <p className="text-gray-600 mb-6">
            Please create a brand profile first to use this feature.
          </p>
          <button
            onClick={() => navigate('/settings')}
            className="btn-primary px-6 py-3 w-full"
          >
            Create Brand Profile
          </button>
        </div>
      </div>
    )
  }

  const scheduledPosts = posts.filter((p) => p.status === 'scheduled')

  const handlePostNow = async (postId: string) => {
    setPosting(postId)
    try {
      // Get post data with media relation
      const { data: post, error } = await supabase
        .from('posts')
        .select('*, media(*)')
        .eq('id', postId)
        .single()

      if (error) throw error

      // Call n8n webhook
      const response = await fetch('https://n8n-latest-8yp2.onrender.com/webhook/instagram-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          media_url: post.media?.cloudinary_url || post.media_url,
          caption: post.final_caption || post.generated_caption,
          post_id: post.id
        })
      })

      if (!response.ok) throw new Error('Failed to post to Instagram')

      // Update status in database
      await supabase
        .from('posts')
        .update({
          status: 'posted',
          posted_at: new Date().toISOString()
        })
        .eq('id', postId)

      toast.success('Posted successfully!')
      refetch()
    } catch (error: any) {
      console.error('Error posting:', error)
      toast.error(error.message || 'Failed to post. Please try again.')
    } finally {
      setPosting(null)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this scheduled post?')) return

    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId)
      if (error) throw error

      toast.success('Post deleted')
      refetch()
    } catch (error: any) {
      toast.error('Failed to delete post')
    }
  }

  const handleComplete = () => {
    refetch()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 p-4 sm:p-8">
      <div className="container mx-auto max-w-6xl animate-fade-in">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg">
            <CalendarDays className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Schedule Posts</h1>
            <p className="text-gray-500">Plan and schedule your content</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Schedule New Post */}
          {media && caption ? (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Schedule New Post</h2>
              <PostScheduler
                media={media}
                caption={caption}
                brandId={brand.id}
                onComplete={handleComplete}
              />
            </div>
          ) : (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Schedule New Post</h2>
              <div className="text-center py-8">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gray-100 mb-4">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">
                  Upload content first to schedule a post.
                </p>
                <button
                  onClick={() => navigate('/upload')}
                  className="btn-primary px-6 py-2"
                >
                  Upload Content
                </button>
              </div>
            </div>
          )}

          {/* Scheduled Posts List */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Scheduled Posts</h2>

            {postsloading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : scheduledPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gray-100 mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No scheduled posts yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin pr-2">
                {scheduledPosts.map((post) => (
                  <div
                    key={post.id}
                    className="group rounded-xl border border-gray-200 p-4 hover:border-primary-300 hover:shadow-soft transition-all duration-200"
                  >
                    <div className="flex gap-4">
                      {post.media && (
                        <img
                          src={post.media.thumbnail_url || post.media.cloudinary_url}
                          alt="Post"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                          {post.final_caption}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-primary-500" />
                            <span>
                              {post.scheduled_for
                                ? format(new Date(post.scheduled_for), 'MMM dd, yyyy')
                                : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-primary-500" />
                            <span>
                              {post.scheduled_for
                                ? format(new Date(post.scheduled_for), 'HH:mm')
                                : 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {post.platforms?.map((platform) => (
                            <span
                              key={platform}
                              className="text-xs px-2.5 py-1 bg-primary-50 text-primary-700 rounded-full font-medium"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handlePostNow(post.id)}
                          disabled={posting === post.id}
                          className="p-2 rounded-lg text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Post Now"
                        >
                          {posting === post.id ? (
                            <div className="w-5 h-5 spinner border-2 border-white border-t-transparent"></div>
                          ) : (
                            <Send className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
