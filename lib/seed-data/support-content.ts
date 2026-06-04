export type ParentStory = {
  id: string
  childContext: string
  situation: string
  observed: string
  prepared: string
}

export type SupportTip = {
  id: string
  title: string
  detail: string
}

export type ConsultationQuestion = {
  id: string
  question: string
}

export const PARENT_STORIES: ParentStory[] = [
  {
    id: 'story-1',
    childContext: 'Orang tua dari anak usia 6 tahun',
    situation:
      'Anak sering sulit duduk tenang saat belajar di rumah dan cepat berpindah dari satu kegiatan ke kegiatan lain.',
    observed:
      'Setelah mulai mencatat, orang tua menyadari pola muncul terutama di sore hari saat anak lelah, bukan sepanjang hari.',
    prepared:
      'Catatan singkat selama dua minggu membantu orang tua bercerita lebih jelas saat bertemu psikolog anak, tanpa harus mengandalkan ingatan.',
  },
  {
    id: 'story-2',
    childContext: 'Orang tua dari anak usia 9 tahun',
    situation:
      'Anak sering lupa instruksi bertahap dan mudah terdistraksi saat mengerjakan tugas sekolah.',
    observed:
      'Dengan aktivitas singkat dan terstruktur, orang tua melihat anak lebih mudah fokus bila tugas dipecah menjadi langkah kecil.',
    prepared:
      'Orang tua membawa ringkasan observasi sederhana ke konsultasi, sehingga diskusi dengan profesional terasa lebih terarah.',
  },
  {
    id: 'story-3',
    childContext: 'Orang tua dari anak usia 7 tahun',
    situation:
      'Anak sering menyela pembicaraan dan sulit menunggu giliran saat bermain dengan teman.',
    observed:
      'Permainan aba-aba sederhana di rumah membantu orang tua mengamati bagaimana anak berlatih menunggu dalam suasana santai.',
    prepared:
      'Orang tua merasa lebih siap menjelaskan situasi spesifik kepada tenaga profesional dibanding hanya menyampaikan kekhawatiran umum.',
  },
]

export const SUPPORT_TIPS: SupportTip[] = [
  {
    id: 'tip-1',
    title: 'Catat dengan waktu dan konteks',
    detail:
      'Tulis kapan perilaku terjadi dan apa yang sedang berlangsung. Catatan yang spesifik lebih berguna daripada kesimpulan umum.',
  },
  {
    id: 'tip-2',
    title: 'Hindari label negatif',
    detail:
      'Gambarkan perilaku yang terlihat, bukan memberi cap pada anak. Fokus pada kejadian yang bisa diamati.',
  },
  {
    id: 'tip-3',
    title: 'Jaga rutinitas tetap sederhana',
    detail:
      'Instruksi pendek dan rutinitas yang konsisten sering lebih mudah diikuti anak daripada perubahan yang rumit.',
  },
  {
    id: 'tip-4',
    title: 'Bawa catatan saat konsultasi',
    detail:
      'Ringkasan observasi dan hasil skrining dapat membantu profesional memahami konteks anak Anda lebih cepat.',
  },
  {
    id: 'tip-5',
    title: 'Berhenti bila anak tertekan',
    detail:
      'Jika anak tampak frustrasi atau menolak, hentikan aktivitas. Pendampingan di rumah harus tetap aman dan nyaman.',
  },
]

export const CONSULTATION_QUESTIONS: ConsultationQuestion[] = [
  {
    id: 'q-1',
    question: 'Pola perilaku apa yang sebaiknya kami amati lebih lanjut di rumah?',
  },
  {
    id: 'q-2',
    question: 'Konteks apa di sekolah atau rumah yang perlu kami dokumentasikan?',
  },
  {
    id: 'q-3',
    question: 'Tanda apa yang menunjukkan kami perlu mencari tindak lanjut lebih cepat?',
  },
  {
    id: 'q-4',
    question: 'Bagaimana sebaiknya kami mendiskusikan hal ini dengan guru atau pengasuh?',
  },
  {
    id: 'q-5',
    question: 'Langkah pendampingan rumah apa yang aman untuk dilanjutkan?',
  },
]
