import { SNAP_IV_QUESTIONS, SNAP_IV_SCALE } from '@/lib/scoring/snap-iv'
import { saveScreening } from './actions'
import { ArrowRight } from 'lucide-react'

export default function SkriningPage() {
  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-700">Skrining SNAP-IV</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Formulir Skrining Perilaku Anak</h1>
        <p className="mt-2 text-slate-600">
          Jawab setiap pertanyaan berdasarkan pengamatan perilaku anak dalam 6 bulan terakhir.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-900">
          <strong>Catatan Penting:</strong> Ini adalah alat skrining awal, bukan diagnosis medis.
          Hasil skrining bersifat indikasi dan perlu dikonsultasikan dengan psikolog, psikiater
          anak, atau dokter anak untuk evaluasi profesional.
        </p>
      </div>

      <form action={saveScreening} className="space-y-8">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Pertanyaan Skrining (1-18)
            </h2>
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
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Simpan Hasil Skrining
            <ArrowRight aria-hidden="true" size={18} />
          </button>
        </div>
      </form>

      <div className="mt-6 rounded-2xl bg-slate-100 p-4">
        <p className="text-xs leading-relaxed text-slate-600">
          <strong>Disclaimer:</strong> SINAD+ bukan alat diagnosis medis. Hasil skrining bersifat
          indikasi awal dan perlu dikonsultasikan dengan psikolog, psikiater anak, atau dokter anak
          untuk evaluasi profesional. Informasi yang diberikan tidak menggantikan konsultasi medis.
        </p>
      </div>
    </div>
  )
}
