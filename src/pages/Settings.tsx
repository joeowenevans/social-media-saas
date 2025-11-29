import { useAuth } from '../hooks/useAuth'
import { useBrand } from '../hooks/useBrand'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { BrandSettings } from '../components/brand/BrandSettings'

export function Settings() {
  const { user } = useAuth()
  const { brand, loading, createBrand, updateBrand } = useBrand(user?.id)
  const navigate = useNavigate()

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14b8a6]"></div>
            <p style={{ color: '#a1a1aa', fontSize: '14px' }}>Loading settings...</p>
          </div>
        </div>
      </AppLayout>
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
    <AppLayout>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 32px' }}>
        {/* Page Title Card with Teal Glow */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '64px',
          maxWidth: '512px',
          margin: '0 auto 64px',
          boxShadow: '0 0 30px rgba(20, 184, 166, 0.2), 0 0 60px rgba(20, 184, 166, 0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{
            color: '#14b8a6',
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '12px'
          }}>
            Brand Settings
          </h1>
          <p style={{
            color: '#888',
            fontSize: '16px',
            margin: 0
          }}>
            Configure your brand profile and AI preferences
          </p>
        </div>

        <BrandSettings brand={brand} onSave={handleSave} onComplete={handleComplete} />
      </div>
    </AppLayout>
  )
}
