import { useAuth } from '../hooks/useAuth'
import { useBrand } from '../hooks/useBrand'
import { usePosts } from '../hooks/usePosts'
import { useNavigate } from 'react-router-dom'
import { Upload, Calendar, Settings as SettingsIcon, LogOut, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export function Dashboard() {
  const { user, signOut } = useAuth()
  const { brand, loading: brandLoading } = useBrand(user?.id)
  const { posts, loading: postsLoading } = usePosts(brand?.id)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out successfully')
    navigate('/')
  }

  if (brandLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

   // Show loading spinner while fetching brand
  if (brandLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // If no brand profile exists, show create prompt (don't redirect!)
  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
          <p className="text-gray-600 mb-6">
            Let's set up your brand profile to get started.
          </p>
          <button
            onClick={() => navigate('/settings')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
          >
            Create Brand Profile
          </button>
        </div>
      </div>
    )
  }

  const scheduledPosts = posts.filter(p => p.status === 'scheduled')
  const postedPosts = posts.filter(p => p.status === 'posted')
  const draftPosts = posts.filter(p => p.status === 'draft')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">SocialAI</span>
            </div>
            <nav className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/upload')}
                className="text-gray-700 hover:text-gray-900 flex items-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Upload</span>
              </button>
              <button
                onClick={() => navigate('/schedule')}
                className="text-gray-700 hover:text-gray-900 flex items-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Schedule</span>
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="text-gray-700 hover:text-gray-900 flex items-center space-x-2"
              >
                <SettingsIcon className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleSignOut}
                className="text-gray-700 hover:text-gray-900 flex items-center space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.email}!
          </h1>
          <p className="text-gray-600">Brand: {brand.name}</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Posts</h3>
            <p className="text-3xl font-bold text-gray-900">{posts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Scheduled</h3>
            <p className="text-3xl font-bold text-indigo-600">{scheduledPosts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Posted</h3>
            <p className="text-3xl font-bold text-green-600">{postedPosts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Drafts</h3>
            <p className="text-3xl font-bold text-gray-600">{draftPosts.length}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/upload')}
              className="flex items-center justify-center space-x-2 p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Content</span>
            </button>
            <button
              onClick={() => navigate('/schedule')}
              className="flex items-center justify-center space-x-2 p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <Calendar className="w-5 h-5" />
              <span>View Calendar</span>
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center justify-center space-x-2 p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <SettingsIcon className="w-5 h-5" />
              <span>Brand Settings</span>
            </button>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Posts</h2>
          {postsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No posts yet. Start by uploading content!</p>
              <button
                onClick={() => navigate('/upload')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Upload Content
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {posts.slice(0, 6).map((post) => (
                <div key={post.id} className="border rounded-lg p-4">
                  {post.media && (
                    <img
                      src={post.media.thumbnail_url || post.media.cloudinary_url}
                      alt="Post media"
                      className="w-full h-48 object-cover rounded mb-2"
                    />
                  )}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {post.final_caption || post.generated_caption}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded ${
                      post.status === 'posted'
                        ? 'bg-green-100 text-green-800'
                        : post.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
