import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useBrand } from '../hooks/useBrand'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { BrandSettings } from '../components/brand/BrandSettings'
import { AlertCircle, X } from 'lucide-react'
import toast from 'react-hot-toast'

export function Settings() {
  const { user, deleteAccount } = useAuth()
  const { brand, loading, createBrand, updateBrand } = useBrand(user?.id)
  const navigate = useNavigate()

  // Delete account state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#50E3C2]"></div>
            <p style={{ color: 'rgba(242, 244, 248, 0.6)', fontSize: '14px' }}>Loading settings...</p>
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

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError('Please enter your password')
      return
    }

    setDeleting(true)
    setDeleteError('')

    const { error } = await deleteAccount(deletePassword)

    if (error) {
      setDeleteError(error.message)
      setDeleting(false)
      return
    }

    toast.success('Account deleted successfully')
    navigate('/login?deleted=true')
  }

  const openDeleteModal = () => {
    setDeleteModalOpen(true)
    setDeletePassword('')
    setDeleteError('')
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setDeletePassword('')
    setDeleteError('')
  }

  return (
    <AppLayout>
      {/* Mobile-only styles - does not affect desktop */}
      <style>{`
        @media (max-width: 639px) {
          .settings-container { padding: 24px 16px !important; }
          .settings-title { font-size: 24px !important; }
          .danger-zone { padding: 20px !important; }
          .danger-zone h2 { font-size: 18px !important; }
        }
      `}</style>
      <div className="settings-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 32px' }}>
        {/* Page Title with Teal Text Glow */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{
            color: '#50E3C2',
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '12px',
            textShadow: '0 0 20px rgba(80, 227, 194, 0.6), 0 0 40px rgba(80, 227, 194, 0.4), 0 0 60px rgba(80, 227, 194, 0.2)'
          }}>
            Brand Settings
          </h1>
          <p style={{
            color: 'rgba(242, 244, 248, 0.6)',
            fontSize: '16px',
            margin: 0
          }}>
            Configure your brand profile and AI preferences
          </p>
        </div>

        <BrandSettings brand={brand} onSave={handleSave} onComplete={handleComplete} />

        {/* Danger Zone - Delete Account */}
        <div className="danger-zone" style={{
          marginTop: '80px',
          padding: '32px',
          background: 'rgba(255, 107, 107, 0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 107, 107, 0.3)'
        }}>
          <h2 style={{
            color: '#FF6B6B',
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '12px'
          }}>
            Danger Zone
          </h2>
          <p style={{
            color: 'rgba(242, 244, 248, 0.6)',
            fontSize: '14px',
            marginBottom: '24px',
            lineHeight: 1.6
          }}>
            Once you delete your account, there is no going back. All your data including posts, media, and brand settings will be permanently deleted.
          </p>
          <button
            onClick={openDeleteModal}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: '#FF6B6B',
              fontSize: '15px',
              fontWeight: 600,
              border: '2px solid #FF6B6B',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FF6B6B'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#FF6B6B'
            }}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {deleteModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(26, 31, 54, 0.9)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px'
          }}
          onClick={closeDeleteModal}
        >
          <div
            style={{
              background: '#242A45',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '450px',
              width: '100%',
              boxShadow: '0 0 60px rgba(255, 107, 107, 0.15)',
              border: '1px solid rgba(255, 107, 107, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  background: 'rgba(255, 107, 107, 0.1)'
                }}>
                  <AlertCircle style={{ width: '28px', height: '28px', color: '#FF6B6B' }} />
                </div>
                <h2 style={{
                  color: '#FF6B6B',
                  fontSize: '22px',
                  fontWeight: 700,
                  margin: 0
                }}>
                  Delete Account
                </h2>
              </div>
              <button
                onClick={closeDeleteModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X style={{ width: '20px', height: '20px', color: 'rgba(242, 244, 248, 0.6)' }} />
              </button>
            </div>

            {/* Warning */}
            <div style={{
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <p style={{
                color: '#fca5a5',
                fontSize: '14px',
                lineHeight: 1.6,
                margin: 0
              }}>
                <strong>Warning:</strong> This action is permanent and cannot be undone. All your data including posts, media, brand settings, and account information will be permanently deleted.
              </p>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                color: '#F2F4F8',
                fontSize: '14px',
                fontWeight: 500,
                display: 'block',
                marginBottom: '8px'
              }}>
                Enter your password to confirm
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => {
                  setDeletePassword(e.target.value)
                  setDeleteError('')
                }}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(26, 31, 54, 0.8)',
                  border: deleteError ? '1px solid #FF6B6B' : '1px solid rgba(80, 227, 194, 0.3)',
                  borderRadius: '8px',
                  color: '#F2F4F8',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {deleteError && (
                <p style={{
                  color: '#FF6B6B',
                  fontSize: '13px',
                  marginTop: '8px',
                  margin: '8px 0 0 0'
                }}>
                  {deleteError}
                </p>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(26, 31, 54, 0.8)',
                  color: '#F2F4F8',
                  fontSize: '15px',
                  fontWeight: 600,
                  border: '1px solid rgba(80, 227, 194, 0.3)',
                  borderRadius: '8px',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  opacity: deleting ? 0.6 : 1,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => !deleting && (e.currentTarget.style.background = 'rgba(26, 31, 54, 1)')}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(26, 31, 54, 0.8)'}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={!deletePassword || deleting}
                style={{
                  padding: '12px 24px',
                  background: !deletePassword || deleting ? '#4b5563' : '#FF6B6B',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: !deletePassword || deleting ? 'not-allowed' : 'pointer',
                  opacity: !deletePassword ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (deletePassword && !deleting) {
                    e.currentTarget.style.background = '#e85a5a'
                  }
                }}
                onMouseLeave={(e) => {
                  if (deletePassword && !deleting) {
                    e.currentTarget.style.background = '#FF6B6B'
                  }
                }}
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Account'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
