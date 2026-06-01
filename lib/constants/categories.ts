import type { SnapIvCategory, SnapIvDomain } from '@/lib/scoring/snap-iv'

export interface CategoryDisplay {
  label: string
  /** Tailwind classes for a solid/soft badge */
  badgeClass: string
  /** Tailwind text color for inline emphasis */
  textClass: string
  /** Tailwind dot/accent background */
  dotClass: string
  description: string
}

const CATEGORY_DISPLAY: Record<SnapIvCategory, CategoryDisplay> = {
  rendah: {
    label: 'Rendah',
    badgeClass: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
    textClass: 'text-emerald-700',
    dotClass: 'bg-emerald-500',
    description: 'Sebagian besar perilaku jarang muncul. Tetap lakukan observasi berkala.',
  },
  perlu_diperhatikan: {
    label: 'Perlu Diperhatikan',
    badgeClass: 'border border-amber-200 bg-amber-50 text-amber-700',
    textClass: 'text-amber-700',
    dotClass: 'bg-amber-500',
    description: 'Beberapa perilaku cukup sering muncul. Pertimbangkan mencatat pola dan berkonsultasi.',
  },
  tinggi: {
    label: 'Tinggi',
    badgeClass: 'border border-rose-200 bg-rose-50 text-rose-700',
    textClass: 'text-rose-700',
    dotClass: 'bg-rose-500',
    description: 'Banyak perilaku sering muncul. Sebaiknya dikonsultasikan dengan profesional.',
  },
}

const FALLBACK_CATEGORY: CategoryDisplay = {
  label: 'Tidak diketahui',
  badgeClass: 'border border-slate-200 bg-slate-50 text-slate-600',
  textClass: 'text-slate-600',
  dotClass: 'bg-slate-400',
  description: 'Kategori belum tersedia.',
}

export function getCategoryDisplay(category: string | null | undefined): CategoryDisplay {
  if (category && category in CATEGORY_DISPLAY) {
    return CATEGORY_DISPLAY[category as SnapIvCategory]
  }
  return FALLBACK_CATEGORY
}

const DOMAIN_LABEL: Record<SnapIvDomain, string> = {
  inattention: 'Inatensi',
  hyperactivity_impulsivity: 'Hiperaktivitas-Impulsivitas',
}

export function getDomainLabel(domain: string | null | undefined): string {
  if (domain && domain in DOMAIN_LABEL) {
    return DOMAIN_LABEL[domain as SnapIvDomain]
  }
  return 'Tidak diketahui'
}
