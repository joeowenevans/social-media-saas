import { BrandSetup } from './BrandSetup'
import type { Brand } from '../../types'

interface BrandSettingsProps {
  brand: Brand | null
  onSave: (brandData: Partial<Brand>) => Promise<{ data: Brand | null; error: string | null }>
  onComplete: (brand: Brand) => void
}

export function BrandSettings({ brand, onSave, onComplete }: BrandSettingsProps) {
  return (
    <div>
      <h2 style={{
        color: '#14b8a6',
        fontSize: '24px',
        fontWeight: 600,
        marginBottom: '32px',
        textAlign: 'left'
      }}>
        {brand ? 'Edit Brand Profile' : 'Create Brand Profile'}
      </h2>
      <BrandSetup onComplete={onComplete} onSave={onSave} initialData={brand || undefined} />
    </div>
  )
}
