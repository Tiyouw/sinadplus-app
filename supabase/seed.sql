insert into public.children (id, user_id, name, gender, birth_date, notes) values
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Alya', 'perempuan', '2018-08-12', 'Profil demo untuk presentasi SINAD+.')
on conflict (id) do nothing;

insert into public.activities (id, title, domain, age_min, age_max, duration_minutes, objective, tools, steps_json, observed_behaviors, safety_notes, stop_conditions, rationale, source_label) values
('22222222-2222-2222-2222-222222222221', 'Misi 5 Menit Fokus', 'inattention', 5, 12, 5, 'Melatih anak menyelesaikan instruksi singkat dengan distraksi minimal.', 'Kertas, pensil warna, timer', '["Pilih satu gambar sederhana.","Atur timer 5 menit.","Minta anak mewarnai hanya satu area sampai timer selesai.","Catat kapan anak terdistraksi dan bagaimana ia kembali fokus."]', 'Durasi fokus, respons terhadap instruksi, kebutuhan pengingat.', 'Lakukan di tempat aman dan tenang.', 'Hentikan bila anak tampak frustrasi, menangis, atau sangat menolak.', 'Aktivitas singkat membantu orang tua mengamati rentang fokus tanpa tekanan akademik.', 'Adaptasi edukasi pengasuhan; perlu validasi ahli'),
('22222222-2222-2222-2222-222222222222', 'Lampu Merah Lampu Hijau', 'hyperactivity_impulsivity', 5, 10, 10, 'Melatih berhenti, menunggu, dan mengikuti aba-aba sederhana.', 'Ruang aman untuk bergerak', '["Jelaskan aturan lampu hijau berarti jalan dan lampu merah berarti berhenti.","Mulai dengan tempo lambat.","Ulangi 5-8 kali.","Catat kemampuan anak berhenti saat aba-aba berubah."]', 'Kemampuan berhenti, menunggu, dan mengikuti aba-aba.', 'Pastikan lantai tidak licin dan area bebas benda tajam.', 'Hentikan bila anak berlari terlalu cepat atau sulit diarahkan dengan aman.', 'Permainan aba-aba membantu observasi kontrol impuls dalam suasana bermain.', 'Adaptasi aktivitas bermain anak; perlu validasi ahli')
on conflict (id) do nothing;

insert into public.screenings (id, child_id, completed_at, inattention_score, hyperactivity_impulsivity_score, total_score, category, dominant_domain, answers_json) values
('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', now() - interval '14 days', 18, 13, 31, 'perlu_diperhatikan', 'inattention', '{"q1":2,"q2":2,"q3":2,"q4":2,"q5":2,"q6":2,"q7":2,"q8":2,"q9":2,"q10":1,"q11":1,"q12":1,"q13":1,"q14":2,"q15":2,"q16":2,"q17":2,"q18":1}'),
('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', now() - interval '2 days', 20, 12, 32, 'perlu_diperhatikan', 'inattention', '{"q1":2,"q2":3,"q3":2,"q4":2,"q5":2,"q6":2,"q7":2,"q8":3,"q9":2,"q10":1,"q11":1,"q12":1,"q13":1,"q14":2,"q15":1,"q16":2,"q17":2,"q18":1}')
on conflict (id) do nothing;

insert into public.behavior_logs (child_id, activity_id, log_date, mood, focus_rating, impulsivity_rating, cooperation_rating, notes, incident_text) values
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', current_date - 5, 'Tenang', 3, 2, 4, 'Alya bisa mengikuti aktivitas sekitar 4 menit sebelum terdistraksi.', null),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', current_date - 3, 'Aktif', 2, 3, 3, 'Butuh dua kali pengingat untuk berhenti saat aba-aba merah.', 'Sempat berlari terlalu cepat lalu diarahkan pelan-pelan.'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', current_date - 1, 'Kooperatif', 4, 2, 4, 'Lebih mudah kembali fokus setelah diberi instruksi pendek.', null);

insert into public.education_articles (title, slug, category, summary, body, source_label, reviewer_status, read_time_minutes) values
('Memahami Skrining Awal ADHD', 'memahami-skrining-awal-adhd', 'Skrining', 'Apa arti skrining awal dan mengapa bukan diagnosis.', 'Skrining awal membantu orang tua mengenali pola perilaku yang perlu diamati. Hasil skrining perlu dikonsultasikan dengan profesional untuk evaluasi menyeluruh.', 'Sumber edukasi terbuka', 'Perlu validasi ahli', 4),
('Membuat Catatan Perilaku yang Berguna', 'membuat-catatan-perilaku', 'Catatan Harian', 'Cara mencatat perilaku anak secara singkat dan objektif.', 'Catatan yang berguna berisi waktu, situasi, perilaku yang terlihat, dan respons orang tua. Hindari label negatif dan fokus pada kejadian yang bisa diamati.', 'Sumber edukasi pengasuhan', 'Perlu validasi ahli', 3)
on conflict (slug) do nothing;
