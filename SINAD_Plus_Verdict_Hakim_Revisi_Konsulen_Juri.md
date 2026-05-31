# Vonis Hakim Revisi: SINAD+ Setelah Konsulen Juri Final

**Status dokumen:** revisi dari `SINAD_Plus_Verdict_Hakim.md` setelah membaca:
1. `SINAD_Plus_Verdict_Hakim.md` — vonis hakim awal.
2. `penjurian_ready.md` — penilaian final juri lomba, diperlakukan sebagai **konsulen hakim**.
3. `SINAD_PPL_Tim_Ready.md` — proposal awal Tim Ready, dipakai sebagai konteks utama.

**Keputusan utama:** sebagian besar kritik juri final **sudah tercakup** dalam vonis hakim awal, terutama soal validasi ahli, framing therapy, konsultasi, fitur unggulan, dan scope. Namun ada beberapa poin juri final yang **perlu dinaikkan statusnya** karena belum cukup eksplisit di vonis awal: gamifikasi ringan, metodologi yang terlalu teoritis, strategi presentasi, dan cara membuat scope terasa lebih valuable tanpa membuat produk menjadi terlalu besar.

---

## 1. Ringkasan Validasi Konsulen Juri

| Poin dari Juri Final | Sudah Ada di Vonis Hakim Awal? | Keputusan Hakim Revisi |
|---|---:|---|
| Fitur bisa dieksplorasi, misalnya gamifikasi | Sebagian | Tambahkan gamifikasi ringan khusus untuk engagement orang tua, bukan core klinis. |
| Fitur konsultasi harus melibatkan ahli | Ya | Tetap: konsultasi tidak boleh diklaim valid tanpa psikolog/psikiater anak yang nyata. |
| Tidak adanya tenaga ahli/medis membuat sistem tidak relevan | Ya | Diperkuat: Clinical Advisor wajib menjadi aset presentasi, bukan sekadar klaim proposal. |
| Metodologi kurang jelas terkait time management | Sebagian kecil | Tambahkan revisi metodologi: jangan jelaskan teori Scrum, jelaskan sprint nyata dan prioritas MVP. |
| Scope terlalu sempit sehingga kurang valuable | Sebagian | Reframe: jangan memperbanyak fitur liar, perluas value chain dari screening sampai tindak lanjut. |
| Metode pengembangan sebaiknya bukan menjelaskan teorinya | Belum eksplisit | Tambahkan bagian presentasi metodologi praktis. |
| Fitur sistem tidak berkaitan | Ya, tapi belum cukup tajam | Tambahkan peta keterkaitan fitur berbasis user journey. |
| Fitur therapy tidak dapat digunakan / alasan memilih permainan tidak jelas | Ya | Diperkuat: setiap aktivitas harus punya objective, domain gejala, usia, instruksi, durasi, dan evaluasi. |
| Tidak ada fitur yang menjadi keunggulan | Ya, tapi perlu dipresentasikan lebih tajam | Tambahkan 3 flagship differentiator yang bisa dijual ke juri. |
| Presentasi kurang menjual, seperti presentasi tugas | Belum ada | Tambahkan strategi pitch final. |
| Tidak perlu menyebut NIM ketika presentasi | Belum ada | Tambahkan ke aturan presentasi: hapus detail administratif dari pitch. |
| Mungkin lebih tepat ikut bidang UI/UX | Tidak perlu diterima mentah | Anggap sebagai sinyal bahwa software value belum terlihat; bukan berarti pindah kategori, tapi demo harus lebih fungsional. |

---

## 2. Vonis Hakim Awal yang Dikonfirmasi oleh Konsulen Juri

### 2.1 Validasi ahli adalah isu paling penting

Juri final berkali-kali menekan bahwa fitur konsultasi, konten medis, dan sistem pendampingan ADHD harus melibatkan ahli. Ini mengonfirmasi vonis awal: SINAD+ tidak boleh terlihat seperti sistem kesehatan mental anak yang berdiri sendiri tanpa rujukan profesional.

**Keputusan tetap:**
- Cantumkan **Clinical Advisor** jika memang sudah ada psikolog/psikiater anak yang bersedia menjadi rujukan.
- Jika belum ada, jangan menulis seolah sudah ada kerja sama final.
- Ubah wording menjadi: “konten akan divalidasi bersama psikolog/psikiater anak” hanya bila masih rencana.
- Fitur konsultasi tidak boleh menjadi fitur utama sebelum ada ahli nyata.

**Implikasi untuk proposal dan demo:**
- Halaman hasil screening harus menyarankan tindak lanjut ke profesional.
- Artikel edukasi harus punya sumber atau reviewer.
- Aktivitas bermain harus diposisikan sebagai pendampingan orang tua, bukan terapi klinis mandiri.

---

### 2.2 Masalah “play therapy” dikonfirmasi oleh juri final

Juri final menyebut fitur therapy tidak dapat digunakan dan tidak jelas mengapa permainan tertentu dipilih. Ini memperkuat vonis awal bahwa istilah “play therapy” terlalu berat secara klinis.

**Keputusan tetap:**
Ganti semua istilah:
- “play therapy”
- “therapy”
- “terapi bermain”

menjadi:
- “panduan aktivitas bermain terstruktur”
- “kegiatan pendampingan bermain”
- “aktivitas stimulasi fokus dan kontrol diri”

**Tambahan revisi dari konsulen juri:**
Setiap aktivitas harus punya format minimal:

```md
### Nama Aktivitas
- Tujuan: misalnya melatih fokus / kontrol impuls / mengikuti instruksi.
- Cocok untuk usia: 5–7 / 8–10 / 11–12 tahun.
- Durasi: 5–15 menit.
- Alat yang dibutuhkan: ...
- Langkah kegiatan: ...
- Perilaku yang diamati orang tua: ...
- Catatan keamanan: ...
- Kapan harus berhenti: ...
- Sumber / dasar pemilihan aktivitas: ...
```

Dengan format ini, permainan tidak lagi terlihat acak. Ia menjadi bagian dari sistem pendampingan yang bisa dipahami juri.

---

### 2.3 Fitur sistem harus terlihat saling berkaitan

Kritik “fitur sistem tidak berkaitan” adalah sinyal bahwa proposal/presentasi belum menunjukkan alur produk yang utuh. Hakim awal sudah membahas beberapa fitur satu per satu, tetapi belum cukup menekankan **narasi keterhubungan fitur**.

**Keputusan revisi:**
SINAD+ harus dipresentasikan sebagai satu alur, bukan kumpulan menu.

Alur yang disarankan:

```text
Orang tua bingung melihat perilaku anak
→ mengisi self-check SNAP-IV
→ mendapat ringkasan hasil dan catatan bahwa ini bukan diagnosis
→ membaca “Langkah Selanjutnya”
→ mencoba aktivitas bermain terstruktur sesuai domain kesulitan
→ mencatat respons anak lewat daily behavior log
→ mengekspor ringkasan untuk dibawa ke psikolog/dokter
→ membaca cerita/tips orang tua lain yang sudah dikurasi
```

Dengan alur ini, fitur screening, edukasi, aktivitas, log, export, dan komunitas tidak berdiri sendiri. Semua menjadi bagian dari satu siklus pendampingan.

---

## 3. Poin Baru yang Harus Ditambahkan ke Verdict Hakim

### 3.1 Gamifikasi ringan layak ditambahkan, tetapi bukan untuk klaim klinis

Juri Dwi menyarankan eksplorasi fitur, misalnya gamifikasi. Ini saran bagus, tetapi harus dibatasi agar tidak mengganggu sensitivitas konteks ADHD.

**Keputusan hakim: tambahkan gamifikasi ringan untuk orang tua, bukan untuk anak.**

Contoh yang aman:
- Streak mencatat daily behavior log.
- Progress checklist “7 hari memahami pola anak”.
- Badge untuk orang tua, misalnya “Mulai Memantau”, “Konsisten 3 Hari”, “Siap Konsultasi”.
- Reminder lembut untuk mengisi log atau membaca artikel.
- Progress bar pada rencana pendampingan mingguan.

**Yang tidak disarankan:**
- Leaderboard antar orang tua.
- Skor kompetitif anak.
- Klaim bahwa badge meningkatkan kondisi ADHD.
- Game terapeutik kompleks yang butuh validasi klinis.

**Alasan:**
Gamifikasi boleh dipakai sebagai engagement layer agar orang tua konsisten memakai aplikasi. Namun core sistem tetap harus berbasis screening, edukasi, pencatatan, dan tindak lanjut profesional.

---

### 3.2 Metodologi harus diubah dari teori Scrum menjadi rencana kerja nyata

Juri menyebut metodologi kurang jelas dan metode pengembangan sebaiknya bukan menjelaskan teorinya. Proposal awal memang menjelaskan Agile Scrum secara umum: Scrum Master, Product Owner, UI/UX Designer, Front-End, Back-End, QA, serta tahapan backlog sampai retrospective. Masalahnya, ini masih terasa seperti materi kuliah, bukan rencana eksekusi produk.

**Keputusan hakim: bagian metodologi harus direvisi total.**

Jangan fokus pada:
- definisi Scrum Master,
- definisi Product Owner,
- teori sprint,
- keunggulan Agile secara umum.

Fokus pada:
- berapa sprint yang benar-benar dilakukan,
- fitur apa yang masuk sprint 1, 2, dan 3,
- siapa mengerjakan apa,
- apa output tiap sprint,
- apa yang sudah selesai untuk demo,
- apa yang sengaja ditunda.

Contoh format metodologi yang lebih kuat:

| Sprint | Fokus | Output Demo | Risiko yang Dikurangi |
|---|---|---|---|
| Sprint 1 | Autentikasi, profil anak, struktur database | User bisa register, login, membuat profil anak | Fondasi data siap |
| Sprint 2 | SNAP-IV scoring dan halaman hasil | User bisa screening dan melihat hasil non-diagnostik | Core value produk terbukti |
| Sprint 3 | Aktivitas terstruktur dan daily log | User bisa memilih aktivitas dan mencatat respons anak | Fitur pendampingan terlihat |
| Sprint 4 | Export laporan, edukasi, polish UI | Laporan bisa dibawa ke profesional | Demo lebih menjual |

**Tambahan penting:**
Karena tim hanya berisi tiga mahasiswa, pembagian role harus realistis. Jangan menulis seolah ada enam posisi penuh jika orangnya hanya tiga. Tulis sebagai “role yang dirangkap” agar juri tidak melihat proposal sebagai overclaim.

---

### 3.3 Scope jangan diperlebar secara liar; value chain yang harus diperlebar

Juri menyebut scope terlalu sempit sehingga kurang valuable. Hakim awal sebenarnya menolak penambahan fitur besar seperti ML, teacher portal, full forum, dan mini-games terapeutik. Kritik juri ini tidak berarti tim harus membangun semuanya.

**Keputusan hakim: perluas value, bukan jumlah fitur.**

Scope lama terlihat sempit karena hanya berbunyi:
- screening,
- artikel,
- panduan bermain,
- forum WhatsApp.

Scope baru harus terlihat sebagai **alur pendampingan lengkap**:
1. Kenali gejala melalui screening.
2. Pahami hasil dengan bahasa sederhana.
3. Lakukan langkah rumah yang aman.
4. Catat perkembangan.
5. Siapkan konsultasi profesional.
6. Dapatkan dukungan sosial yang terkurasi.

Ini membuat SINAD+ lebih valuable tanpa membuat tim tenggelam dalam fitur besar.

---

### 3.4 Presentasi harus diubah dari “presentasi tugas” menjadi pitch produk

Juri Tio menyebut presentasi kurang menjual dan sebaiknya tidak seperti presentasi tugas. Ini belum ada dalam vonis hakim awal, sehingga harus ditambahkan sebagai keputusan baru.

**Keputusan hakim: susunan presentasi harus diganti.**

Urutan yang disarankan:

1. **Masalah nyata**
   - Banyak orang tua bingung membedakan perilaku aktif biasa dengan gejala yang perlu dipantau.
   - Akses profesional terbatas.
   - Orang tua butuh alat bantu awal yang aman, bukan diagnosis instan.

2. **Solusi utama**
   - SINAD+ membantu orang tua melakukan screening awal, memahami hasil, mencoba pendampingan rumah yang aman, dan menyiapkan data untuk konsultasi profesional.

3. **Demo alur produk**
   - Register/login.
   - Buat profil anak.
   - Isi SNAP-IV.
   - Lihat hasil dan disclaimer.
   - Lihat rekomendasi langkah selanjutnya.
   - Pilih aktivitas terstruktur.
   - Isi daily log.
   - Export laporan.

4. **Keunggulan**
   - Berbasis instrumen SNAP-IV.
   - Aktivitas terstruktur dan bisa dipantau.
   - Ada export laporan untuk profesional.
   - Aman karena tidak mengklaim diagnosis.

5. **Batasan dan rencana pengembangan**
   - Belum menggantikan profesional.
   - Butuh validasi ahli lebih lanjut.
   - Roadmap realistis: advisor, konten tervalidasi, curated parent stories.

6. **Penutup**
   - SINAD+ bukan dokter digital.
   - SINAD+ adalah jembatan awal agar orang tua tidak mulai dari nol.

**Aturan presentasi:**
- Jangan sebut NIM saat pitch, kecuali diminta.
- Jangan terlalu lama di metodologi.
- Jangan menjelaskan teori ADHD terlalu panjang.
- Jangan menjual fitur yang belum bisa didemokan.
- Fokus pada masalah, demo, impact, dan batasan yang jujur.

---

## 4. Keunggulan Produk yang Harus Dijual

Juri mengatakan tidak ada fitur yang menjadi keunggulan. Vonis awal sudah memberi beberapa kandidat, tetapi perlu dipadatkan menjadi flagship yang mudah dijual.

### Flagship 1 — Screening aman berbasis SNAP-IV

Bukan sekadar kuis. Sistem menghitung hasil screening dengan instrumen yang dikenal, lalu memberi disclaimer bahwa hasil bukan diagnosis.

**Kalimat pitch:**
> “SINAD+ tidak mendiagnosis anak. SINAD+ membantu orang tua mengenali sinyal awal dengan alat screening yang lebih terstruktur, lalu mengarahkan mereka ke langkah aman berikutnya.”

---

### Flagship 2 — Aktivitas bermain terstruktur yang terhubung ke pencatatan respons

Keunggulannya bukan “terapi bermain”, melainkan siklus:
aktivitas → observasi → catatan → pola perkembangan.

**Kalimat pitch:**
> “Setiap aktivitas di SINAD+ tidak berdiri sendiri. Orang tua dapat mencatat respons anak setelah aktivitas, sehingga mereka punya data sederhana yang bisa dibawa saat konsultasi.”

---

### Flagship 3 — Export laporan untuk profesional

Ini menjembatani aplikasi dengan ahli medis/psikolog tanpa mengklaim menggantikan mereka.

**Kalimat pitch:**
> “Saat orang tua akhirnya bertemu psikolog atau dokter, mereka tidak datang dengan ingatan samar. Mereka membawa ringkasan screening dan catatan perilaku yang rapi.”

---

## 5. Roadmap Final Revisi

### Tier 1 — Harus diperbaiki di proposal dan narasi

1. Ganti semua istilah “play therapy/therapy/terapi” menjadi “aktivitas bermain terstruktur”.
2. Hapus klaim machine learning dari analisis screening.
3. Klarifikasi status ahli: sudah ada Clinical Advisor atau masih rencana.
4. Tambahkan disclaimer bahwa SINAD+ bukan alat diagnosis.
5. Revisi metodologi agar berisi sprint nyata, output demo, dan pembagian kerja realistis.
6. Buat narasi keterhubungan fitur dari screening sampai tindak lanjut.

---

### Tier 2 — Harus ada atau minimal terlihat di MVP demo

1. Multi-profil anak.
2. Screening SNAP-IV otomatis.
3. Halaman hasil dengan disclaimer dan “Langkah Selanjutnya”.
4. Aktivitas bermain terstruktur dengan tujuan yang jelas.
5. Daily behavior log singkat.
6. Export laporan sederhana.
7. Progress/gamifikasi ringan untuk konsistensi orang tua.

---

### Tier 3 — Bisa menjadi pembeda jika waktu cukup

1. Cerita Orang Tua terkurasi sebagai pengganti forum penuh.
2. Artikel edukasi dengan label reviewer/sumber.
3. Peta layanan profesional atau daftar rujukan dasar.
4. Template pertanyaan yang bisa dibawa saat konsultasi.

---

### Tidak Perlu Dibangun Saat Ini

| Fitur | Alasan |
|---|---|
| Full forum real-time | Moderasi berat, risiko data, effort tinggi. |
| Teacher portal | Menambah user type dan kompleksitas validitas data. |
| Mini-games terapeutik | Butuh validasi klinis dan effort tinggi. |
| Machine learning screening | SNAP-IV cukup dihitung deterministik; tidak ada training data klinis. |
| Konsultasi langsung tanpa ahli resmi | Berisiko secara etika dan kredibilitas. |
| Behavioral fingerprint | Sensitif terhadap UU PDP dan data anak. |

---

## 6. Checklist Revisi Proposal

Gunakan checklist ini sebelum membuat proposal/pitch final.

### Bahasa dan klaim
- [ ] Tidak ada klaim diagnosis.
- [ ] Tidak ada klaim terapi klinis mandiri.
- [ ] Tidak ada klaim ML untuk SNAP-IV.
- [ ] Ada disclaimer di halaman hasil.
- [ ] Ada penjelasan batasan sistem.

### Validasi ahli
- [ ] Ada status jelas tentang psikolog/psikiater anak.
- [ ] Jika ada ahli, tulis nama/peran dengan izin.
- [ ] Jika belum ada ahli, jangan menulis seolah sudah tervalidasi penuh.
- [ ] Konten edukasi punya sumber atau reviewer.

### Fitur
- [ ] Semua fitur terhubung dalam satu user journey.
- [ ] Aktivitas bermain punya tujuan dan alasan pemilihan.
- [ ] Ada daily log atau mekanisme pemantauan.
- [ ] Ada output yang bisa dipakai untuk konsultasi.
- [ ] Forum WhatsApp tidak dijual sebagai fitur utama.

### Metodologi
- [ ] Metodologi menjelaskan sprint nyata.
- [ ] Ada timeline dan output tiap sprint.
- [ ] Pembagian role realistis untuk 3 orang.
- [ ] Ada batasan fitur yang sengaja ditunda.

### Presentasi
- [ ] Tidak menyebut NIM saat pitch kecuali diminta.
- [ ] Tidak terlalu lama menjelaskan teori Scrum.
- [ ] Fokus pada masalah, demo, impact, dan batasan.
- [ ] Menunjukkan fitur unggulan dalam 1 alur demo.
- [ ] Menjawab “kenapa fitur ini penting?” untuk setiap fitur.

---

## 7. Verdict Akhir Setelah Konsulen Juri

**Verdict hakim awal tetap valid, tetapi perlu diberi lapisan presentasi dan eksekusi.**

Kritik juri final menunjukkan bahwa masalah utama SINAD+ bukan hanya isi proposal, tetapi cara produk itu terlihat di mata juri:
- validasi ahli belum terlihat kuat,
- fitur belum terlihat menyatu,
- metodologi terdengar seperti teori kelas,
- therapy belum jelas kegunaannya,
- keunggulan produk belum berhasil dijual,
- presentasi terlalu administratif.

Karena itu, arah revisi paling tepat bukan menambah banyak fitur baru. Arah revisi yang benar adalah:

> **Jadikan SINAD+ sebagai aplikasi pendamping awal yang aman, terstruktur, dan jujur: screening awal → edukasi → aktivitas rumah → pencatatan → laporan untuk profesional.**

Dengan framing ini, SINAD+ tidak perlu berpura-pura menjadi sistem diagnosis, tidak perlu membangun ML, tidak perlu membuat forum besar, dan tidak perlu menjadi platform konsultasi medis penuh. Produk cukup menang sebagai jembatan yang credible antara kebingungan orang tua dan bantuan profesional.

---

## Lampiran: Posisi Poin Juri terhadap Verdict Hakim Awal

| Poin Juri | Status Akhir |
|---|---|
| Gamifikasi | Diterima sebagian sebagai gamifikasi ringan untuk orang tua. |
| Konsultasi harus melibatkan ahli | Diterima penuh. |
| Tidak ada tenaga ahli membuat sistem tidak relevan | Diterima penuh, tetapi proposal perlu membuktikan status ahli. |
| Metodologi kurang jelas | Diterima penuh sebagai revisi baru. |
| Scope terlalu sempit | Diterima sebagian; perluas value chain, bukan fitur liar. |
| Metode jangan menjelaskan teori | Diterima penuh. |
| Fitur tidak berkaitan | Diterima penuh sebagai masalah narasi dan user journey. |
| Therapy tidak jelas | Diterima penuh; ganti istilah dan strukturkan aktivitas. |
| Tidak ada keunggulan | Diterima sebagai masalah presentasi; flagship harus dibuat eksplisit. |
| Presentasi kurang menjual | Diterima penuh sebagai revisi pitch. |
| Tidak perlu menyebut NIM | Diterima penuh sebagai aturan presentasi. |
| Lebih cocok UI/UX | Tidak diterima mentah; dibaca sebagai sinyal bahwa software demo harus dibuat lebih fungsional. |

---

*Dokumen ini adalah versi revisi verdict hakim setelah mempertimbangkan penilaian juri final sebagai konsulen. Dokumen ini tidak mengganti semua isi verdict awal, tetapi menambahkan validasi, koreksi prioritas, dan arahan presentasi yang lebih dekat dengan hasil penjurian sebenarnya.*
