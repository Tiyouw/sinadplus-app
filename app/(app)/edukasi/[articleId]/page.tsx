import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, CheckCircle, Clock } from 'lucide-react'
import { getArticleBySlug } from '@/lib/supabase/queries'
import { CONTENT_REVIEW_DISCLAIMER } from '@/lib/constants/copy'

async function getSafeArticle(slug: string) {
  try {
    return await getArticleBySlug(slug)
  } catch {
    return null
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ articleId: string }>
}) {
  const { articleId } = await params
  const article = await getSafeArticle(articleId)

  if (!article) {
    notFound()
  }

  return (
    <article className="mx-auto max-w-4xl p-6 lg:p-8">
      <Link
        href="/edukasi"
        className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Kembali ke Edukasi
      </Link>

      <div className="sinad-card p-6 md:p-8">
        <div className="mb-6 space-y-4 border-b border-slate-100 pb-6">
          <div className="inline-flex rounded-xl bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
            {article.category}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              {article.title}
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">{article.summary}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <Clock aria-hidden="true" size={16} />
              {article.read_time_minutes} menit baca
            </span>
            <span className="inline-flex items-center gap-2">
              <BookOpen aria-hidden="true" size={16} />
              Sumber: {article.source_label}
            </span>
            <span className="inline-flex items-center gap-2 text-green-700">
              <CheckCircle aria-hidden="true" size={16} />
              {article.reviewer_status === 'approved' ? 'Telah ditinjau' : article.reviewer_status}
            </span>
          </div>
        </div>

        <div className="prose prose-slate max-w-none">
          {article.body.split('\n').map((paragraph) => (
            <p key={paragraph} className="text-base leading-8 text-slate-700">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm leading-6 text-amber-900">
            <strong>Catatan:</strong> {CONTENT_REVIEW_DISCLAIMER} Konten ini bersifat informatif
            dan tidak menggantikan konsultasi dengan profesional kesehatan.
          </p>
        </div>
      </div>
    </article>
  )
}
