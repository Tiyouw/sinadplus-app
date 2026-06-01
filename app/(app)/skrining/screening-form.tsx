'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { ArrowRight } from 'lucide-react'
import { SNAP_IV_QUESTIONS, SNAP_IV_SCALE } from '@/lib/scoring/snap-iv'
import { saveScreening } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
    >
      {pending ? 'Menyimpan...' : 'Simpan Hasil Skrining'}
      <ArrowRight aria-hidden="true" size={18} />
    </button>
  )
}

export function ScreeningForm() {
  const [state, formAction] = useActionState(saveScreening, {})

  return (
    <form action={formAction} aria-describedby="screening-disclaimer" className="space-y-8">
      {state.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4" role="alert">
          <p className="text-sm font-medium text-red-900">{state.error}</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Pertanyaan Skrining (1-18)</h2>
          <p className="mb-6 text-sm text-slate-600">
            Pilih salah satu jawaban untuk setiap pertanyaan berdasarkan seberapa sering perilaku
            tersebut muncul.
          </p>

          <div className="space-y-6">
            {SNAP_IV_QUESTIONS.map((question, index) => (
              <div key={question.id} className="border-b border-slate-100 pb-6 last:border-b-0">
                <fieldset>
                  <legend className="mb-3 text-sm font-medium text-slate-900">
                    {index + 1}. {question.text}
                  </legend>
                  <div className="space-y-2">
                    {SNAP_IV_SCALE.map((option) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-blue-300 hover:bg-blue-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50"
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.value}
                          required
                          className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        />
                        <span className="text-sm text-slate-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="mb-2 font-semibold text-slate-900">Sebelum Mengirim</h3>
        <p className="mb-4 text-sm text-slate-600">
          Pastikan semua 18 pertanyaan telah dijawab. Hasil skrining akan disimpan dan dapat
          digunakan sebagai bahan diskusi dengan profesional kesehatan mental.
        </p>
        <SubmitButton />
      </div>
    </form>
  )
}
