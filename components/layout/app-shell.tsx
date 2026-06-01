'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  User,
  ClipboardList,
  Activity,
  FileText,
  BarChart3,
  Menu,
  X,
  LogOut
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { signOut } from '@/app/(app)/actions'
import { BrandMark } from '@/components/brand/brand-mark'

interface AppShellProps {
  children: React.ReactNode
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/anak', label: 'Profil Anak', icon: User },
  { href: '/skrining', label: 'Skrining', icon: ClipboardList },
  { href: '/aktivitas', label: 'Aktivitas', icon: Activity },
  { href: '/catatan', label: 'Catatan', icon: FileText },
  { href: '/laporan', label: 'Laporan', icon: BarChart3 },
]

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <BrandMark className="h-9 w-9 rounded-xl" priority />
            <span>SINAD+</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-40 transition-transform duration-300',
          'lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-200">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 text-xl font-semibold text-slate-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BrandMark className="h-10 w-10 rounded-xl" priority />
              <span>SINAD+</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="tab-enter flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-0.5'
                  )}
                >
                  {isActive && (
                    <span
                      className="nav-active-dot absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-600"
                      aria-hidden="true"
                    />
                  )}
                  <Icon
                    size={20}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="space-y-3 border-t border-slate-200 p-4">
            <form action={signOut}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:border-red-200 hover:bg-red-100 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500/30"
              >
                <LogOut size={20} />
                <span>Keluar</span>
              </button>
            </form>
            <p className="text-center text-xs text-slate-500">
              SINAD+ MVP v1.0
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="pt-16 lg:pl-64 lg:pt-0">
        <div className="hidden h-16 items-center justify-end border-b border-slate-200 bg-white/80 px-6 backdrop-blur lg:flex">
          <Link
            href="/anak"
            aria-label="Profil Alya"
            className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              A
            </span>
            <span className="text-right">
              <span className="block text-sm font-semibold text-slate-900">Alya</span>
              <span className="block text-xs text-slate-500 group-hover:text-blue-700">Profil Anak</span>
            </span>
          </Link>
        </div>
        <div className="min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  )
}
