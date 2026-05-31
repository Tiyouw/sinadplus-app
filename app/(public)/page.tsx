import Link from 'next/link'
import { PublicNav } from '@/components/layout/public-nav'
import { APP_NAME, MEDICAL_DISCLAIMER, PRODUCT_PROMISE } from '@/lib/constants/copy'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      <PublicNav />
      
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900">
            Pendampingan Awal untuk
            <br />
            <span className="text-blue-600">Perkembangan Anak</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-zinc-600 leading-relaxed">
            {PRODUCT_PROMISE}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button asChild size="lg" className="text-base px-8 py-6">
              <Link href="/login">
                Coba Demo
              </Link>
            </Button>
          </div>
          
          <div className="pt-8">
            <p className="text-sm text-zinc-500 max-w-3xl mx-auto leading-relaxed">
              {MEDICAL_DISCLAIMER}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
            Fitur Utama
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Alat bantu sederhana untuk mendampingi perjalanan perkembangan anak Anda
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1: Skrining Awal */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-3">
              Skrining Awal
            </h3>
            <p className="text-zinc-600 leading-relaxed">
              Kuesioner terstruktur berbasis M-CHAT-R/F dan CARS-2 untuk mengenali sinyal awal perkembangan anak. Hasil bersifat indikasi, bukan diagnosis.
            </p>
          </div>

          {/* Feature 2: Aktivitas Terstruktur */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-3">
              Aktivitas Terstruktur
            </h3>
            <p className="text-zinc-600 leading-relaxed">
              Panduan aktivitas harian yang aman untuk dicoba di rumah. Membantu stimulasi perkembangan dengan pendekatan yang terukur dan terdokumentasi.
            </p>
          </div>

          {/* Feature 3: Laporan Konsultasi */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-3">
              Laporan Konsultasi
            </h3>
            <p className="text-zinc-600 leading-relaxed">
              Ekspor riwayat skrining dan catatan perkembangan dalam format terstruktur untuk dibawa saat konsultasi dengan profesional kesehatan.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Mulai Pendampingan Hari Ini
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Coba demo dengan data fiktif untuk melihat bagaimana {APP_NAME} dapat membantu perjalanan Anda.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-base px-8 py-6">
            <Link href="/login">
              Masuk Demo
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-sm text-zinc-500">
            <p className="mb-2">© 2026 {APP_NAME}. Alat bantu pendampingan perkembangan anak.</p>
            <p className="text-xs max-w-3xl mx-auto leading-relaxed">
              {MEDICAL_DISCLAIMER}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
