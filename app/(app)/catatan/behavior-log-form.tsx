'use client'

import { saveBehaviorLog } from './actions'
import { useState, useTransition } from 'react'

export function BehaviorLogForm({ activities }: { activities: Array<{ id: string; title: string }> }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      try {
        await saveBehaviorLog(formData)
        setSuccess(true)
        const form = document.getElementById('behavior-log-form') as HTMLFormElement
        form?.reset()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      }
    })
  }

  return (
    <form id="behavior-log-form" action={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-800">Catatan perilaku berhasil disimpan!</p>
        </div>
      )}

      <div>
        <label htmlFor="log_date" className="mb-2 block text-sm font-medium text-slate-700">
          Tanggal Observasi <span className="sr-only">(wajib)</span> <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="log_date"
          name="log_date"
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div>
        <label htmlFor="activity_id" className="mb-2 block text-sm font-medium text-slate-700">
          Aktivitas (Opsional)
        </label>
        <select
          id="activity_id"
          name="activity_id"
          className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Tidak terkait aktivitas tertentu</option>
          {activities.map((activity) => (
            <option key={activity.id} value={activity.id}>
              {activity.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="mood" className="mb-2 block text-sm font-medium text-slate-700">
          Suasana Hati <span className="sr-only">(wajib)</span> <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <select
          id="mood"
          name="mood"
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Pilih suasana hati</option>
          <option value="senang">Senang</option>
          <option value="netral">Netral</option>
          <option value="rewel">Rewel</option>
          <option value="marah">Marah</option>
          <option value="sedih">Sedih</option>
        </select>
      </div>

      <div>
        <label htmlFor="focus_rating" className="mb-2 block text-sm font-medium text-slate-700">
          Tingkat Fokus (1-5) <span className="sr-only">(wajib)</span> <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="focus_rating"
          name="focus_rating"
          min="1"
          max="5"
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <p className="mt-1 text-xs text-slate-500">1 = Sangat sulit fokus, 5 = Sangat fokus</p>
      </div>

      <div>
        <label htmlFor="impulsivity_rating" className="mb-2 block text-sm font-medium text-slate-700">
          Tingkat Impulsivitas (1-5) <span className="sr-only">(wajib)</span> <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="impulsivity_rating"
          name="impulsivity_rating"
          min="1"
          max="5"
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <p className="mt-1 text-xs text-slate-500">1 = Sangat impulsif, 5 = Sangat terkendali</p>
      </div>

      <div>
        <label htmlFor="cooperation_rating" className="mb-2 block text-sm font-medium text-slate-700">
          Tingkat Kerja Sama (1-5) <span className="sr-only">(wajib)</span> <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="cooperation_rating"
          name="cooperation_rating"
          min="1"
          max="5"
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <p className="mt-1 text-xs text-slate-500">1 = Sangat sulit bekerja sama, 5 = Sangat kooperatif</p>
      </div>

      <div>
        <label htmlFor="notes" className="mb-2 block text-sm font-medium text-slate-700">
          Catatan Observasi <span className="sr-only">(wajib)</span> <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="Deskripsikan perilaku yang diamati, konteks situasi, dan hal-hal penting lainnya..."
        />
      </div>

      <div>
        <label htmlFor="incident_text" className="mb-2 block text-sm font-medium text-slate-700">
          Insiden Khusus (Opsional)
        </label>
        <textarea
          id="incident_text"
          name="incident_text"
          rows={3}
          className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="Catat jika ada insiden khusus seperti tantrum, agresi, atau perilaku yang perlu perhatian..."
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-2xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500"
      >
        {isPending ? 'Menyimpan...' : 'Simpan Catatan'}
      </button>
    </form>
  )
}
