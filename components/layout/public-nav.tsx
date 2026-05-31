import Link from 'next/link'
import { APP_NAME } from '@/lib/constants/copy'

export function PublicNav() {
  return (
    <nav aria-label="Navigasi utama" className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-zinc-900">
              {APP_NAME}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              Masuk Demo
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
