'use client'

import { saveBehaviorLog } from './actions'
import { useState, useTransition } from 'react'
import { RatingScale } from '@/components/ui/rating-scale'
import { DatePicker } from '@/components/ui/date-picker'
import { CustomSelect, type SelectOption } from '@/components/ui/custom-select'

const MOOD_OPTIONS: SelectOption[] = [
  { value: 'senang', label: 'Senang' },
  { value: 'netral', label: 'Netral' },
  { value: 'rewel', label: 'Rewel' },
  { value: 'marah', label: 'Marah' },
  { value: 'sedih', label: 'Sedih' },
]

export function BehaviorLogForm({ activities }: { activities: Array<{ id: string; title: string }> }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const activityOptions: SelectOption[] = [
    { value: '', label: 'Tidak terkait aktivitas tertentu' },
    ...activities.map((activity) => ({ value: activity.id, label: activity.title })),
  ]

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

      <DatePicker name="log_date" label="Tanggal Observasi" required />

      <CustomSelect
        name="activity_id"
        label="Aktivitas (Opsional)"
        options={activityOptions}
        placeholder="Tidak terkait aktivitas tertentu"
      />

      <CustomSelect
        name="mood"
        label="Suasana Hati"
        options={MOOD_OPTIONS}
        placeholder="Pilih suasana hati"
        required
      />

      <RatingScale
        name="focus_rating"
        label="Tingkat Fokus (1-5)"
        helper="1 = Sangat sulit fokus, 5 = Sangat fokus"
        required
      />

      <RatingScale
        name="impulsivity_rating"
        label="Tingkat Impulsivitas (1-5)"
        helper="1 = Sangat impulsif, 5 = Sangat terkendali"
        required
      />

      <RatingScale
        name="cooperation_rating"
        label="Tingkat Kerja Sama (1-5)"
        helper="1 = Sangat sulit bekerja sama, 5 = Sangat kooperatif"
        required
      />

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
