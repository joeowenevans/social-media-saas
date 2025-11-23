import { useAuth } from '../hooks/useAuth'
import { useBrand } from '../hooks/useBrand'
import { useNavigate } from 'react-router-dom'
import { BrandSettings } from '../components/brand/BrandSettings'
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react'

export function Settings() {
  const { user } = useAuth()
  const { brand, loading, createBrand, updateBrand } = useBrand(user?.id)
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-500 text-sm">Loading settings...</p>
        </div>
      </div>
    )
  }

  const handleSave = async (brandData: any) => {
    if (brand) {
      return await updateBrand(brand.id, brandData)
    } else {
      return await createBrand(brandData)
    }
  }

  const handleComplete = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 p-4 sm:p-8">
      <div className="container mx-auto max-w-4xl animate-fade-in">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg">
            <SettingsIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Brand Settings</h1>
            <p className="text-gray-500">Configure your brand profile and AI preferences</p>
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          <BrandSettings brand={brand} onSave={handleSave} onComplete={handleComplete} />
        </div>
      </div>
    </div>
  )
}
