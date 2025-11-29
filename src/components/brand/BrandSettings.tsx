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
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-teal-400 mb-6 sm:mb-8 text-left">
        {brand ? 'Edit Brand Profile' : 'Create Brand Profile'}
      </h2>
      <BrandSetup onComplete={onComplete} onSave={onSave} initialData={brand || undefined} />
    </div>
  )
}
