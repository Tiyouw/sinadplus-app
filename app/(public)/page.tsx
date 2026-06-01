import { FinalCta } from '@/components/landing/final-cta'
import { LandingHero } from '@/components/landing/landing-hero'
import { ProblemSection } from '@/components/landing/problem-section'
import { ReportPreviewSection } from '@/components/landing/report-preview'
import { SafetySection } from '@/components/landing/safety-section'
import { SolutionFlow } from '@/components/landing/solution-flow'
import { PublicNav } from '@/components/layout/public-nav'
import { APP_NAME, MEDICAL_DISCLAIMER } from '@/lib/constants/copy'

export default function LandingPage() {
  return (
    <div className="landing-shell min-h-screen overflow-hidden">
      <PublicNav />
      <main>
        <LandingHero />
        <ProblemSection />
        <SolutionFlow />
        <ReportPreviewSection />
        <SafetySection />
        <FinalCta />
        <footer className="border-t border-white/70 bg-white/60 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-medium text-slate-600">© 2026 {APP_NAME}. Alat bantu pendampingan perkembangan anak.</p>
            <p className="mx-auto mt-3 max-w-3xl text-xs leading-6 text-slate-500">{MEDICAL_DISCLAIMER}</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
