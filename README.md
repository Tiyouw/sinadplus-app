# SINAD+

SINAD+ adalah aplikasi pendamping orang tua yang dirancang untuk mendukung observasi awal terkait ADHD pada anak. Ini adalah MVP (Minimum Viable Product) yang telah dipoles dan berfungsi penuh. **SINAD+ bukan alat diagnosis medis.**

## Setup

1. Salin `.env.example` ke `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Isi variabel environment Supabase di `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL proyek Supabase Anda
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon key dari proyek Supabase Anda

   Opsional, untuk mengaktifkan narasi insight berbasis AI sungguhan:
   - `SINAD_AI_API_KEY`: API key provider AI OpenAI-compatible
   - `SINAD_AI_BASE_URL`: base URL provider, contoh `https://api.openai.com/v1`
   - `SINAD_AI_MODEL`: nama model, contoh `gpt-4o-mini`

   Jika variabel AI tidak diisi, SINAD+ tetap berjalan dengan Behavioral Insight Engine rule-based.
   Jika respons AI gagal atau melanggar batas aman medis, aplikasi otomatis kembali ke narasi rule-based.

3. Jalankan migrasi dan seed database Supabase:
   - Buka Supabase Dashboard → SQL Editor
   - Jalankan `supabase/migrations/0001_initial.sql`
   - Jalankan `supabase/seed.sql` (data demo inti)
   - Jalankan `supabase/seed_articles.sql` (pustaka artikel edukasi lengkap)

4. Buat user demo di Supabase Authentication yang sesuai dengan:
   - Email: nilai dari `DEMO_EMAIL` di `.env.local`
   - Password: nilai dari `DEMO_PASSWORD` di `.env.local`

5. Install dependencies:
   ```bash
   npm install
   ```

6. Jalankan development server:
   ```bash
   npm run dev
   ```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000).

## Verification

Jalankan perintah berikut untuk memverifikasi kode:

```bash
# Linting
npm run lint

# Unit tests
npm run test

# End-to-end tests
npm run e2e
```

## Deployment

### Vercel

1. Push kode ke repository Git (GitHub, GitLab, atau Bitbucket)
2. Import project di [Vercel Dashboard](https://vercel.com/new)
3. Tambahkan environment variables berikut di Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DEMO_EMAIL`
   - `DEMO_PASSWORD`
   - Opsional: `SINAD_AI_API_KEY`, `SINAD_AI_BASE_URL`, `SINAD_AI_MODEL`
4. Deploy

### Supabase

Pastikan Anda telah:
- Membuat proyek Supabase
- Menjalankan migrasi database
- Menjalankan seed data
- Mengaktifkan Authentication dengan Email provider
- Membuat user demo sesuai dengan credentials di environment variables

## Catatan Keamanan

**PENTING**: SINAD+ bukan alat diagnosis medis dan tidak dimaksudkan untuk menggantikan konsultasi profesional dengan dokter, psikolog, atau tenaga kesehatan mental lainnya. Aplikasi ini hanya menyediakan alat observasi untuk membantu orang tua mencatat perilaku anak mereka. Untuk diagnosis dan penanganan ADHD yang tepat, selalu konsultasikan dengan profesional kesehatan yang berkualifikasi.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Testing**: Jest, React Testing Library, Playwright
- **Deployment**: Vercel

## License

[Add your license here]
