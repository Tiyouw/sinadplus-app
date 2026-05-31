export type SnapIvDomain = 'inattention' | 'hyperactivity_impulsivity'
export type SnapIvCategory = 'rendah' | 'perlu_diperhatikan' | 'tinggi'

export interface SnapIvQuestion {
  id: string
  text: string
  domain: SnapIvDomain
}

export interface SnapIvResult {
  inattentionScore: number
  hyperactivityImpulsivityScore: number
  totalScore: number
  dominantDomain: SnapIvDomain
  category: SnapIvCategory
  summary: string
}

export const SNAP_IV_SCALE = [
  { value: 0, label: 'Tidak sama sekali' },
  { value: 1, label: 'Sedikit' },
  { value: 2, label: 'Cukup banyak' },
  { value: 3, label: 'Sangat banyak' },
] as const

export const SNAP_IV_QUESTIONS: SnapIvQuestion[] = [
  {
    id: 'snap_iv_1',
    text: 'Gagal memberikan perhatian yang cukup terhadap detail atau membuat kesalahan ceroboh dalam pekerjaan',
    domain: 'inattention',
  },
  {
    id: 'snap_iv_2',
    text: 'Kesulitan mempertahankan perhatian dalam tugas atau aktivitas bermain',
    domain: 'inattention',
  },
  {
    id: 'snap_iv_3',
    text: 'Tampak tidak mendengarkan ketika diajak bicara secara langsung',
    domain: 'inattention',
  },
  {
    id: 'snap_iv_4',
    text: 'Tidak mengikuti instruksi dan gagal menyelesaikan tugas',
    domain: 'inattention',
  },
  {
    id: 'snap_iv_5',
    text: 'Kesulitan mengorganisir tugas dan aktivitas',
    domain: 'inattention',
  },
  {
    id: 'snap_iv_6',
    text: 'Menghindari atau tidak menyukai tugas yang memerlukan usaha mental berkelanjutan',
    domain: 'inattention',
  },
  {
    id: 'snap_iv_7',
    text: 'Kehilangan barang-barang yang diperlukan untuk tugas atau aktivitas',
    domain: 'inattention',
  },
  {
    id: 'snap_iv_8',
    text: 'Mudah teralihkan oleh rangsangan dari luar',
    domain: 'inattention',
  },
  {
    id: 'snap_iv_9',
    text: 'Pelupa dalam aktivitas sehari-hari',
    domain: 'inattention',
  },
  {
    id: 'snap_iv_10',
    text: 'Gelisah dengan tangan atau kaki atau menggeliat di tempat duduk',
    domain: 'hyperactivity_impulsivity',
  },
  {
    id: 'snap_iv_11',
    text: 'Meninggalkan tempat duduk dalam situasi di mana diharapkan tetap duduk',
    domain: 'hyperactivity_impulsivity',
  },
  {
    id: 'snap_iv_12',
    text: 'Berlari atau memanjat secara berlebihan dalam situasi yang tidak tepat',
    domain: 'hyperactivity_impulsivity',
  },
  {
    id: 'snap_iv_13',
    text: 'Kesulitan bermain atau terlibat dalam aktivitas santai dengan tenang',
    domain: 'hyperactivity_impulsivity',
  },
  {
    id: 'snap_iv_14',
    text: 'Selalu bergerak atau bertindak seolah-olah digerakkan oleh motor',
    domain: 'hyperactivity_impulsivity',
  },
  {
    id: 'snap_iv_15',
    text: 'Berbicara berlebihan',
    domain: 'hyperactivity_impulsivity',
  },
  {
    id: 'snap_iv_16',
    text: 'Menjawab pertanyaan sebelum pertanyaan selesai diajukan',
    domain: 'hyperactivity_impulsivity',
  },
  {
    id: 'snap_iv_17',
    text: 'Kesulitan menunggu giliran',
    domain: 'hyperactivity_impulsivity',
  },
  {
    id: 'snap_iv_18',
    text: 'Menyela atau mengganggu orang lain',
    domain: 'hyperactivity_impulsivity',
  },
]

export function scoreSnapIv(answers: Record<string, number>): SnapIvResult {
  // Validate all 18 questions are answered
  const answeredIds = Object.keys(answers)
  const requiredIds = SNAP_IV_QUESTIONS.map((q) => q.id)
  const missingIds = requiredIds.filter((id) => !answeredIds.includes(id))

  if (missingIds.length > 0) {
    throw new Error('Jawaban SNAP-IV belum lengkap')
  }

  // Validate all values are integers between 0 and 3
  for (const [id, value] of Object.entries(answers)) {
    if (!Number.isInteger(value) || value < 0 || value > 3) {
      throw new Error(`Nilai jawaban untuk ${id} harus berupa bilangan bulat antara 0 dan 3`)
    }
  }

  // Calculate domain scores
  const inattentionQuestions = SNAP_IV_QUESTIONS.filter((q) => q.domain === 'inattention')
  const hyperactivityImpulsivityQuestions = SNAP_IV_QUESTIONS.filter(
    (q) => q.domain === 'hyperactivity_impulsivity',
  )

  const inattentionScore = inattentionQuestions.reduce((sum, q) => sum + answers[q.id], 0)
  const hyperactivityImpulsivityScore = hyperactivityImpulsivityQuestions.reduce(
    (sum, q) => sum + answers[q.id],
    0,
  )
  const totalScore = inattentionScore + hyperactivityImpulsivityScore

  // Determine dominant domain
  const dominantDomain: SnapIvDomain =
    inattentionScore >= hyperactivityImpulsivityScore ? 'inattention' : 'hyperactivity_impulsivity'

  // Determine category based on total score
  // Total score range: 0-54 (18 questions × 3 max points)
  // Thresholds: rendah (0-17), perlu_diperhatikan (18-36), tinggi (37-54)
  let category: SnapIvCategory
  if (totalScore <= 17) {
    category = 'rendah'
  } else if (totalScore <= 36) {
    category = 'perlu_diperhatikan'
  } else {
    category = 'tinggi'
  }

  // Generate summary
  const domainLabel =
    dominantDomain === 'inattention' ? 'ketidakperhatian' : 'hiperaktivitas/impulsivitas'
  const categoryLabel =
    category === 'rendah'
      ? 'rendah'
      : category === 'perlu_diperhatikan'
        ? 'perlu diperhatikan'
        : 'tinggi'

  const summary = `Skor total SNAP-IV: ${totalScore}. Kategori: ${categoryLabel}. Domain dominan: ${domainLabel}. Ini adalah hasil skrining awal, bukan diagnosis. Konsultasikan dengan profesional kesehatan mental untuk evaluasi lebih lanjut.`

  return {
    inattentionScore,
    hyperactivityImpulsivityScore,
    totalScore,
    dominantDomain,
    category,
    summary,
  }
}
