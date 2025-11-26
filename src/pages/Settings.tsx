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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-charcoal-50 via-white to-primary-50/30 dark:bg-charcoal-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-charcoal-500 dark:text-charcoal-400 text-sm">Loading settings...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-charcoal-50 via-gray-50 to-charcoal-100 dark:from-charcoal-950 dark:via-charcoal-900 dark:to-charcoal-950 p-4 sm:p-8">
      <div className="container mx-auto max-w-4xl animate-fade-in">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-charcoal-100 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
            <SettingsIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 dark:text-white">Brand Settings</h1>
            <p className="text-charcoal-600 dark:text-charcoal-400">Configure your brand profile and AI preferences</p>
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          <BrandSettings brand={brand} onSave={handleSave} onComplete={handleComplete} />
        </div>
      </div>
    </div>
  )
}
