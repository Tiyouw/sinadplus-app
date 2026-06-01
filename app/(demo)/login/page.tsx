import { signInDemo } from './actions'
import { APP_NAME, MEDICAL_DISCLAIMER } from '@/lib/constants/copy'
import { Button } from '@/components/ui/button'
import { BrandMark } from '@/components/brand/brand-mark'

export default function DemoLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 via-white to-amber-50/40 px-4 py-10">
      <div className="animate-scale-in w-full max-w-md rounded-3xl border border-blue-100 bg-white/90 p-8 shadow-xl shadow-blue-100/40 backdrop-blur-sm">
        {/* Brand mark */}
        <div className="mb-6 flex flex-col items-center text-center">
          <BrandMark className="mb-4 h-14 w-14" priority />
          <h1 className="text-2xl font-semibold text-slate-900">Demo {APP_NAME}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Masuk ke akun demo untuk menjelajahi fitur {APP_NAME} dengan data fiktif yang telah
            disiapkan.
          </p>
        </div>

        <form action={signInDemo} className="space-y-5">
          <div className="rounded-2xl bg-blue-50/80 p-4 text-sm text-blue-900">
            <p className="mb-2 font-medium">Tentang Data Demo:</p>
            <ul className="list-inside list-disc space-y-1 text-blue-800">
              <li>Semua data bersifat fiktif dan tidak terkait dengan individu nyata</li>
              <li>Data direset secara berkala</li>
              <li>Anda dapat menjelajahi semua fitur tanpa risiko</li>
            </ul>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Masuk Demo
          </Button>
        </form>

        {/* Medical disclaimer */}
        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Catatan Penting
          </p>
          <p className="text-xs leading-relaxed text-slate-600">{MEDICAL_DISCLAIMER}</p>
        </div>
      </div>
    </main>
  )
}
