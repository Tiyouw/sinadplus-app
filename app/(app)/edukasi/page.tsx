import { getArticles } from '@/lib/supabase/queries'
import { AlertCircle, BookOpen, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

type ArticlesData = Awaited<ReturnType<typeof getArticles>>

function EdukasiFallback() {
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
                Artikel edukasi belum dapat dimuat
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
                Kami belum dapat menampilkan artikel edukasi saat ini. Pastikan konfigurasi
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

function EdukasiContent({ articles }: { articles: ArticlesData }) {
  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-700">Perpustakaan Edukasi</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Artikel Edukasi</h1>
        <p className="mt-2 text-slate-600">
          Kumpulan artikel edukatif tentang perkembangan anak dan pendampingan orang tua
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm leading-relaxed text-blue-900">
          <strong>Catatan Penting:</strong> Konten edukasi disusun dari sumber terbuka dan perlu
          validasi lebih lanjut oleh ahli. Artikel ini bersifat informatif dan tidak menggantikan
          konsultasi dengan profesional kesehatan.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="sinad-card p-8 text-center">
          <BookOpen aria-hidden="true" className="mx-auto mb-4 text-slate-400" size={48} />
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Belum ada artikel</h2>
          <p className="text-sm text-slate-600">
            Artikel edukasi akan ditampilkan di sini setelah data tersedia.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.id} href={`/edukasi/${article.slug}`} className="sinad-card block p-6 transition hover:-translate-y-0.5 hover:border-primary/30">
              <div className="mb-4">
                <div className="mb-2 inline-block rounded-xl bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                  {article.category}
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{article.title}</h2>
              </div>

              <p className="mb-4 line-clamp-3 text-sm text-slate-600">{article.summary}</p>

              <div className="mb-4 space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock aria-hidden="true" size={14} />
                  <span>{article.read_time_minutes} menit baca</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <BookOpen aria-hidden="true" size={14} />
                  <span>Sumber: {article.source_label}</span>
                </div>
                {article.reviewer_status === 'approved' && (
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <CheckCircle aria-hidden="true" size={14} />
                    <span>Telah ditinjau</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-2xl bg-slate-100 p-4">
        <p className="text-xs leading-relaxed text-slate-600">
          <strong>Disclaimer:</strong> Artikel edukasi ini bersifat informatif dan tidak menggantikan
          nasihat medis profesional. Untuk kekhawatiran spesifik tentang perkembangan anak,
          konsultasikan dengan psikolog, psikiater anak, atau dokter anak.
        </p>
      </div>
    </div>
  )
}

async function getSafeArticles() {
  try {
    return await getArticles()
  } catch {
    return null
  }
}

export default async function EdukasiPage() {
  const articles = await getSafeArticles()

  if (!articles) {
    return <EdukasiFallback />
  }

  return <EdukasiContent articles={articles} />
}
