import { getDemoChild } from '@/lib/supabase/queries'
import { AlertCircle, User, Calendar, Info } from 'lucide-react'
import Link from 'next/link'

type ChildData = Awaited<ReturnType<typeof getDemoChild>>

function AnakFallback() {
  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
            <AlertCircle aria-hidden="true" size={24} />
          </div>
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">
                Profil anak belum dapat dimuat
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
                Kami belum dapat menampilkan profil anak saat ini. Pastikan konfigurasi
                database sudah tersedia, lalu coba muat ulang halaman.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnakContent({ child }: { child: ChildData }) {
  const birthDate = new Date(child.birth_date)
  const today = new Date()
  const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth())
  const ageYears = Math.floor(ageInMonths / 12)
  const ageMonths = ageInMonths % 12

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-700">Profil Anak</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Informasi Anak</h1>
        <p className="mt-2 text-slate-600">
          Data profil anak yang digunakan untuk pendampingan
        </p>
      </div>

      <div className="sinad-card mb-6 p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
            <User aria-hidden="true" className="text-blue-600" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{child.name}</h2>
            <p className="text-sm text-slate-600">
              {child.gender === 'laki_laki' ? 'Laki-laki' : 'Perempuan'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 border-t border-slate-100 pt-4">
            <Calendar aria-hidden="true" className="mt-1 flex-shrink-0 text-slate-400" size={20} />
            <div>
              <div className="text-sm font-medium text-slate-700">Tanggal Lahir</div>
              <div className="text-slate-900">
                {birthDate.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 border-t border-slate-100 pt-4">
            <Info aria-hidden="true" className="mt-1 flex-shrink-0 text-slate-400" size={20} />
            <div>
              <div className="text-sm font-medium text-slate-700">Usia</div>
              <div className="text-slate-900">
                {ageYears} tahun {ageMonths} bulan
              </div>
            </div>
          </div>

          {child.notes && (
            <div className="flex items-start gap-3 border-t border-slate-100 pt-4">
              <Info aria-hidden="true" className="mt-1 flex-shrink-0 text-slate-400" size={20} />
              <div>
                <div className="text-sm font-medium text-slate-700">Catatan</div>
                <div className="text-slate-900">{child.notes}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-100 p-4">
        <p className="text-xs leading-relaxed text-slate-600">
          <strong>Catatan:</strong> Informasi profil anak digunakan untuk menyesuaikan rekomendasi
          aktivitas dan membantu dalam penyusunan laporan perkembangan. Data ini bersifat pribadi
          dan hanya digunakan dalam konteks pendampingan.
        </p>
      </div>
    </div>
  )
}

async function getSafeChild() {
  try {
    return await getDemoChild()
  } catch {
    return null
  }
}

export default async function AnakPage() {
  const child = await getSafeChild()

  if (!child) {
    return <AnakFallback />
  }

  return <AnakContent child={child} />
}
