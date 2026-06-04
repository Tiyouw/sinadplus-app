-- Education articles seeder for SINAD+
--
-- Notes:
-- * reviewer_status = 'approved' is required for articles to appear on /edukasi
--   (lib/supabase/queries.ts filters .eq('reviewer_status', 'approved')).
-- * Content is general, educational, and non-diagnostic. Every article keeps
--   the SINAD+ safety framing: bukan diagnosis, perlu konsultasi profesional.
-- * Fixed UUIDs + `on conflict (slug) do update` keep this seeder idempotent
--   and safe to re-run.
--
-- Run after migrations:
--   psql "$DATABASE_URL" -f supabase/seed_articles.sql
-- or paste into the Supabase SQL editor.

insert into public.education_articles
  (id, title, slug, category, summary, body, source_label, reviewer_status, read_time_minutes)
values
(
  '44444444-4444-4444-4444-444444444401',
  'Memahami Skrining Awal ADHD',
  'memahami-skrining-awal-adhd',
  'Skrining',
  'Apa arti skrining awal dan mengapa hasilnya bukan diagnosis.',
  'Skrining awal membantu orang tua mengenali pola perilaku yang perlu diamati lebih lanjut.' || E'\n' ||
  'Skrining seperti SNAP-IV mengumpulkan pengamatan orang tua tentang fokus, aktivitas, dan kontrol diri anak.' || E'\n' ||
  'Hasil skrining bersifat indikasi awal, bukan diagnosis. Hanya psikolog, psikiater anak, atau dokter anak yang dapat melakukan evaluasi menyeluruh.' || E'\n' ||
  'Gunakan hasil skrining sebagai titik awal untuk mengamati pola, mencatat perkembangan, dan menyiapkan bahan diskusi saat konsultasi profesional.',
  'Sumber edukasi terbuka',
  'approved',
  4
),
(
  '44444444-4444-4444-4444-444444444402',
  'Membuat Catatan Perilaku yang Berguna',
  'membuat-catatan-perilaku',
  'Catatan Harian',
  'Cara mencatat perilaku anak secara singkat dan objektif.',
  'Catatan yang berguna berisi waktu, situasi, perilaku yang terlihat, dan respons orang tua.' || E'\n' ||
  'Hindari label negatif pada anak. Gambarkan kejadian yang bisa diamati, misalnya "sulit duduk tenang saat mengerjakan PR sore hari".' || E'\n' ||
  'Catat juga apa yang membantu anak kembali fokus atau tenang, karena pola ini berguna saat berkonsultasi.' || E'\n' ||
  'Catatan singkat yang konsisten selama beberapa hari sering lebih bermanfaat daripada catatan panjang sesekali.',
  'Sumber edukasi pengasuhan',
  'approved',
  3
),
(
  '44444444-4444-4444-4444-444444444403',
  'Membedakan Perilaku Aktif Biasa dan Sinyal yang Perlu Diperhatikan',
  'membedakan-aktif-biasa-dan-sinyal',
  'Pemahaman Dasar',
  'Tidak semua perilaku aktif berarti masalah. Kenali konteksnya.',
  'Banyak anak memang aktif, banyak bergerak, dan mudah teralihkan, terutama pada usia dini.' || E'\n' ||
  'Yang perlu diperhatikan adalah ketika pola perilaku muncul cukup sering, di berbagai situasi, dan mulai mengganggu kegiatan sehari-hari atau hubungan dengan orang lain.' || E'\n' ||
  'Orang tua dapat memperhatikan seberapa sering, di mana, dan dalam situasi apa perilaku muncul, bukan hanya satu kejadian saja.' || E'\n' ||
  'Pengamatan ini bersifat awal dan tidak menggantikan penilaian profesional. Bila ragu, konsultasikan dengan tenaga kesehatan yang berkompeten.',
  'Sumber edukasi terbuka',
  'approved',
  5
),
(
  '44444444-4444-4444-4444-444444444404',
  'Menyiapkan Konsultasi dengan Psikolog atau Dokter Anak',
  'menyiapkan-konsultasi-profesional',
  'Persiapan Konsultasi',
  'Langkah sederhana agar konsultasi lebih terarah dan bermanfaat.',
  'Sebelum konsultasi, kumpulkan hasil skrining dan catatan perilaku yang sudah Anda buat.' || E'\n' ||
  'Tuliskan beberapa pertanyaan utama, misalnya pola apa yang perlu diamati, konteks sekolah yang perlu didokumentasikan, dan tanda yang memerlukan tindak lanjut lebih cepat.' || E'\n' ||
  'Bawa contoh kejadian nyata yang spesifik, lengkap dengan waktu dan situasinya, agar profesional lebih mudah memahami konteks anak Anda.' || E'\n' ||
  'Konsultasi adalah kerja sama. Catatan yang rapi membantu, tetapi keputusan evaluasi tetap berada pada tenaga profesional.',
  'Sumber edukasi pengasuhan',
  'approved',
  4
),
(
  '44444444-4444-4444-4444-444444444405',
  'Aktivitas Rumah yang Aman untuk Pendampingan',
  'aktivitas-rumah-aman-pendampingan',
  'Aktivitas',
  'Prinsip dasar memilih aktivitas pendampingan di rumah dengan aman.',
  'Aktivitas pendampingan di rumah sebaiknya singkat, jelas, dan menyenangkan, bukan seperti tugas akademik yang menekan.' || E'\n' ||
  'Pilih aktivitas yang sesuai usia anak, lakukan di tempat yang aman, dan amati respons anak selama kegiatan.' || E'\n' ||
  'Hentikan aktivitas bila anak tampak frustrasi, menangis, atau sangat menolak. Tujuan utamanya adalah observasi dan kedekatan, bukan hasil sempurna.' || E'\n' ||
  'Aktivitas ini adalah bentuk pendampingan, bukan terapi klinis. Untuk kebutuhan khusus, mintalah arahan dari profesional.',
  'Sumber edukasi pengasuhan',
  'approved',
  4
),
(
  '44444444-4444-4444-4444-444444444406',
  'Mendukung Diri Sendiri sebagai Orang Tua',
  'mendukung-diri-sebagai-orang-tua',
  'Dukungan',
  'Menjaga ketenangan orang tua sama pentingnya dengan mendampingi anak.',
  'Mendampingi anak dengan kebutuhan perhatian khusus bisa melelahkan secara emosional.' || E'\n' ||
  'Beri ruang untuk diri sendiri beristirahat, dan ingat bahwa kemajuan kecil tetap berarti.' || E'\n' ||
  'Berbagi dengan pasangan, keluarga, atau orang tua lain yang dipercaya dapat membantu mengurangi rasa sendiri.' || E'\n' ||
  'Bila Anda merasa kewalahan berkepanjangan, pertimbangkan untuk berbicara dengan profesional. Menjaga diri sendiri adalah bagian dari mendampingi anak.',
  'Sumber edukasi terbuka',
  'approved',
  3
)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  summary = excluded.summary,
  body = excluded.body,
  source_label = excluded.source_label,
  reviewer_status = excluded.reviewer_status,
  read_time_minutes = excluded.read_time_minutes;
