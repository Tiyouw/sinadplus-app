import { ScreeningForm } from './screening-form'

export default function SkriningPage() {
  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8">
      <div className="tab-enter">
        <div className="mb-6 text-left">
          <p className="text-sm font-medium text-blue-700">Skrining SNAP-IV</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Formulir Skrining Perilaku Anak
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Jawab setiap pertanyaan berdasarkan pengamatan perilaku anak dalam 6 bulan terakhir.
          </p>
        </div>

        <div
          id="screening-disclaimer"
          className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4"
        >
          <p className="text-sm text-amber-900">
            <strong>Catatan Penting:</strong> Ini adalah alat skrining awal, bukan diagnosis medis.
            Hasil skrining bersifat indikasi dan perlu dikonsultasikan dengan psikolog, psikiater
            anak, atau dokter anak untuk evaluasi profesional.
          </p>
        </div>

        <ScreeningForm />

        <div className="mt-6 rounded-2xl bg-slate-100 p-4">
          <p className="text-xs leading-relaxed text-slate-600">
            <strong>Disclaimer:</strong> SINAD+ bukan alat diagnosis medis. Hasil skrining bersifat
            indikasi awal dan perlu dikonsultasikan dengan psikolog, psikiater anak, atau dokter
            anak untuk evaluasi profesional. Informasi yang diberikan tidak menggantikan konsultasi
            medis.
          </p>
        </div>
      </div>
    </div>
  )
}
