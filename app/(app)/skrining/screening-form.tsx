'use client'

import { useActionState, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { ArrowRight, Check } from 'lucide-react'
import { SNAP_IV_QUESTIONS, SNAP_IV_SCALE } from '@/lib/scoring/snap-iv'
import { saveScreening } from './actions'

function SubmitButton({ answeredCount }: { answeredCount: number }) {
  const { pending } = useFormStatus()
  const complete = answeredCount === SNAP_IV_QUESTIONS.length

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
    >
      {pending
        ? 'Menyimpan...'
        : complete
          ? 'Simpan Hasil Skrining'
          : `Simpan (${answeredCount}/${SNAP_IV_QUESTIONS.length} terjawab)`}
      <ArrowRight aria-hidden="true" size={18} />
    </button>
  )
}

export function ScreeningForm() {
  const [state, formAction] = useActionState(saveScreening, {})
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [activeId, setActiveId] = useState<string | null>(null)
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const answeredCount = Object.keys(answers).length
  const total = SNAP_IV_QUESTIONS.length
  const percent = Math.round((answeredCount / total) * 100)

  function getNextUnansweredId(currentQuestionId: string, nextAnswers: Record<string, number>) {
    const currentIndex = SNAP_IV_QUESTIONS.findIndex((question) => question.id === currentQuestionId)
    if (currentIndex < 0) return null

    const nextQuestion = SNAP_IV_QUESTIONS.slice(currentIndex + 1).find(
      (question) => nextAnswers[question.id] === undefined,
    )

    return nextQuestion?.id ?? null
  }

  function questionIsComfortablyVisible(el: HTMLDivElement) {
    const rect = el.getBoundingClientRect()
    return rect.top >= 96 && rect.bottom <= window.innerHeight - 96
  }

  function focusQuestion(questionId: string) {
    setActiveId(questionId)
    const el = questionRefs.current[questionId]
    if (!el) return

    if (!questionIsComfortablyVisible(el)) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollTo({
        top: el.offsetTop - 96,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
    }
  }

  function handleSelect(questionId: string, value: number) {
    setAnswers((prev) => {
      const wasAlreadyAnswered = prev[questionId] !== undefined
      const next = { ...prev, [questionId]: value }
      const nextUnansweredId = getNextUnansweredId(questionId, next)

      if (!wasAlreadyAnswered && nextUnansweredId) {
        window.setTimeout(() => focusQuestion(nextUnansweredId), 120)
      }

      return next
    })
  }

  function jumpTo(questionId: string) {
    focusQuestion(questionId)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
      {/* LEFT: questions */}
      <form action={formAction} aria-describedby="screening-disclaimer" className="space-y-6">
        {state.error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4" role="alert">
            <p className="text-sm font-medium text-red-900">{state.error}</p>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Pertanyaan Skrining (1-18)</h2>
          <p className="mb-6 text-sm text-slate-600">
            Pilih salah satu jawaban untuk setiap pertanyaan berdasarkan seberapa sering perilaku
            tersebut muncul.
          </p>

          <div className="space-y-6">
            {SNAP_IV_QUESTIONS.map((question, index) => {
              const selected = answers[question.id]
              return (
                <div
                  key={question.id}
                  ref={(el) => {
                    questionRefs.current[question.id] = el
                  }}
                  data-testid={`question-card-${index + 1}`}
                  className={`scroll-mt-24 rounded-2xl border p-4 transition-colors ${
                    activeId === question.id
                      ? 'border-blue-300 bg-blue-50/40'
                      : 'border-transparent'
                  }`}
                >
                  <fieldset>
                    <legend className="mb-3 flex items-start gap-2 text-sm font-medium text-slate-900">
                      <span
                        className={`mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          selected !== undefined
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span>{question.text}</span>
                    </legend>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {SNAP_IV_SCALE.map((option) => {
                        const isChecked = selected === option.value
                        return (
                          <label
                            key={option.value}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all ${
                              isChecked
                                ? 'border-blue-400 bg-blue-50 shadow-sm'
                                : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option.value}
                              required
                              checked={isChecked}
                              onChange={() => handleSelect(question.id, option.value)}
                              className="sr-only"
                            />
                            <span
                              aria-hidden="true"
                              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                                isChecked ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isChecked && <span className="h-2 w-2 rounded-full bg-white" />}
                            </span>
                            <span
                              className={`text-sm ${isChecked ? 'font-medium text-blue-900' : 'text-slate-700'}`}
                            >
                              {option.label}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>
                  {activeId === question.id && selected === undefined && (
                    <p className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
                      Lanjut ke pertanyaan {index + 1}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="mb-2 font-semibold text-slate-900">Sebelum Mengirim</h3>
          <p className="mb-4 text-sm text-slate-600">
            Pastikan semua 18 pertanyaan telah dijawab. Hasil skrining akan disimpan dan dapat
            digunakan sebagai bahan diskusi dengan profesional kesehatan mental.
          </p>
          <SubmitButton answeredCount={answeredCount} />
        </div>
      </form>

      {/* RIGHT: LMS navigator + completion bar */}
      <aside className="lg:sticky lg:top-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-900">Progres</span>
              <span className="text-slate-500">
                {answeredCount} dari {total} terjawab
              </span>
            </div>
            <div
              className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Kemajuan pengisian skrining"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="mt-1.5 text-right text-xs font-medium text-blue-700">{percent}%</p>
          </div>

          <p className="mb-3 text-xs font-medium text-slate-500">
            Klik nomor untuk berpindah. Nomor abu-abu belum terisi.
          </p>
          <div className="grid grid-cols-6 gap-2">
            {SNAP_IV_QUESTIONS.map((question, index) => {
              const isAnswered = answers[question.id] !== undefined
              const isActive = activeId === question.id
              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => jumpTo(question.id)}
                  aria-label={`Soal ${index + 1}${isAnswered ? ', sudah terjawab' : ', belum terjawab'}`}
                  className={`relative flex aspect-square items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                    isAnswered
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-300 hover:text-blue-700'
                  } ${isActive ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}
                >
                  {isAnswered ? <Check aria-hidden="true" size={14} /> : index + 1}
                </button>
              )
            })}
          </div>

          {answeredCount === total ? (
            <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-center text-xs font-medium text-emerald-700">
              Semua pertanyaan terjawab.
            </p>
          ) : (
            <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-center text-xs font-medium text-amber-700">
              {total - answeredCount} pertanyaan belum terisi.
            </p>
          )}
        </div>
      </aside>
    </div>
  )
}
