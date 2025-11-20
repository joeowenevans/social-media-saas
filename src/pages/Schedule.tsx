import { useAuth } from '../hooks/useAuth'
import { useBrand } from '../hooks/useBrand'
import { usePosts } from '../hooks/usePosts'
import { useNavigate, useLocation } from 'react-router-dom'
import { PostScheduler } from '../components/scheduling/PostScheduler'
import { ArrowLeft, Calendar, Clock, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export function Schedule() {
  const { user } = useAuth()
  const { brand, loading: brandLoading } = useBrand(user?.id)
  const { posts, loading: postsLoading, refetch } = usePosts(brand?.id)
  const navigate = useNavigate()
  const location = useLocation()

  // Get media and caption from navigation state (when coming from Upload page)
  const { media, caption } = location.state || {}

  if (brandLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!brand) {
    navigate('/settings')
    return null
  }

  const scheduledPosts = posts.filter((p) => p.status === 'scheduled')

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-6xl">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Schedule Posts</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Schedule New Post */}
          {media && caption ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Schedule New Post</h2>
              <PostScheduler
                media={media}
                caption={caption}
                brandId={brand.id}
                onComplete={handleComplete}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Schedule New Post</h2>
              <p className="text-gray-600 mb-4">
                Upload content first to schedule a post.
              </p>
              <button
                onClick={() => navigate('/upload')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Upload Content
              </button>
            </div>
          )}

          {/* Scheduled Posts List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Scheduled Posts</h2>

            {postsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : scheduledPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No scheduled posts yet
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledPosts.map((post) => (
                  <div
                    key={post.id}
                    className="border rounded-lg p-4 hover:border-indigo-300 transition"
                  >
                    <div className="flex gap-4">
                      {post.media && (
                        <img
                          src={post.media.thumbnail_url || post.media.cloudinary_url}
                          alt="Post"
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                          {post.final_caption}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {post.scheduled_for
                                ? format(new Date(post.scheduled_for), 'MMM dd, yyyy')
                                : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
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
                              className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
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
