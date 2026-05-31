# SINAD+ Landing Redesign Design Spec

**Date:** 2026-06-01  
**Project:** SINAD+ / Siaga Anak ADHD  
**Scope:** Public landing page visual redesign  
**Status:** Approved concept; pending implementation plan

---

## 1. Goal

Redesign the public landing page so it no longer feels like a generic dark SaaS template. The new landing page should quickly communicate that SINAD+ is useful for parents because it turns scattered home observations into structured preparation for professional consultation.

Primary target impression in the first 10 seconds:

> This is actually useful for parents because it turns scattered observations into structured preparation for professional consultation.

The page must remain ethically safe. It must not imply diagnosis, treatment, doctor approval, clinical validation, or expert-reviewed claims.

---

## 2. Core Concept

Direction name:

> From scattered observations to consultation-ready clarity.

The landing page tells this story:

1. Parents notice scattered signals at home.
2. SINAD+ helps structure those signals through screening, activities, and daily notes.
3. Those structured inputs assemble into a polished consultation preparation report.
4. The app clearly reminds users that SINAD+ is not a diagnostic tool and professional consultation is still needed.

The visual identity should be 80% system/product and 20% human warmth.

---

## 3. Hero Section

### Purpose

Make the usefulness of SINAD+ immediately clear while creating one memorable visual moment.

### Left Content Zone

Recommended content:

- Badge: `Pendamping observasi awal untuk orang tua`
- Headline: `Ubah catatan kecil di rumah menjadi bekal konsultasi yang lebih terarah.`
- Subcopy: Explain that SINAD+ helps parents complete early screening, try structured activities, record daily observations, and prepare a consultation report.
- Primary CTA: `Masuk Demo`
- Secondary CTA: `Lihat Alur`
- Compact disclaimer under CTA: `SINAD+ bukan alat diagnosis. Hasil skrining bersifat indikasi awal dan perlu dikonsultasikan dengan profesional.`

### Right Illustration Zone

Create an animated report-building illustration:

- Floating source cards:
  - `Skrining SNAP-IV`
  - `Catatan Harian`
  - `Aktivitas Terstruktur`
  - `Domain Fokus/Atensi`
- Cards gently flow into a central report/PDF sheet.
- Report sheet label: `Ringkasan Konsultasi`
- Thin blue/cyan connection lines show organization, not medical authority.
- Add a small warm parent-child line-art silhouette or soft human accent behind/near the report at low opacity.
- Human accent is emotional support only; product/report remains the main visual subject.

### Hero Motion

- On load, observation cards enter first.
- Connection lines draw in second.
- Report sheet appears and settles last.
- Motion should feel premium and calm, not playful or chaotic.
- The page must still look complete if motion is disabled.

---

## 4. Page Structure

### 4.1 Hero — Consultation-ready clarity

Includes:

- Badge
- Headline
- Subcopy
- CTA pair
- Compact disclaimer
- Animated report-building illustration

### 4.2 Problem Section — Parent observations are scattered

Purpose: make the need emotionally obvious without fear-based language.

Use three soft cards:

1. `Catatan tercecer`
2. `Bingung harus mulai dari mana`
3. `Sulit menjelaskan pola saat konsultasi`

Tone must be empathetic. Avoid copy that implies the child has ADHD.

### 4.3 Solution Flow — SINAD+ organizes observation

Use a horizontal or stepped timeline:

1. `Skrining Awal`
2. `Aktivitas Bermain Terstruktur`
3. `Catatan Harian`
4. `Laporan Konsultasi`

Each step should show:

- what the parent does,
- what SINAD+ organizes,
- the safety boundary.

### 4.4 Report Preview Section — Flagship proof

Purpose: make the PDF report feel concrete and valuable.

Visual:

- Large mock consultation report preview.
- Side annotations pointing to:
  - child profile summary,
  - latest screening,
  - behavior notes,
  - activities tried,
  - disclaimer.

CTA: `Lihat Demo Laporan`

### 4.5 Safety Section — Responsible boundary

Purpose: build credibility without overclaiming.

Required messages:

- `Bukan alat diagnosis`
- `Tidak menggantikan psikolog, psikiater anak, atau dokter anak`
- `Membantu orang tua menyiapkan observasi yang lebih rapi`

Design:

- Calm blue/cream card.
- No red alarm styling unless needed.
- No medical seal, doctor badge, approval stamp, or expert validation cue.

### 4.6 Final CTA

Headline:

`Coba alur demo dan lihat bagaimana laporan konsultasi disusun.`

CTA:

- `Masuk Demo`

---

## 5. Visual System

### Palette

Use a warm clinical premium palette instead of the current dark generic SaaS look.

Suggested tokens:

```css
--sinad-blue: #2563EB;
--sinad-blue-dark: #1E3A8A;
--sinad-cyan: #22D3EE;
--sinad-cream: #FFF7ED;
--sinad-paper: #FFFFFF;
--sinad-slate: #0F172A;
--sinad-muted: #64748B;
```

Guidance:

- Background: soft off-white or warm blue-gray.
- Primary: trustworthy blue.
- Accent: gentle teal/cyan for connection lines.
- Warmth: cream or soft peach glow behind human accent.
- Text: deep slate, not pure black.

### Typography

- Hero should be large, calm, and editorial-quality.
- Body text should feel readable, parent-friendly, and not overly corporate.
- Avoid excessive all-caps.
- Indonesian copy should be warm, concrete, and concise.

### Illustration Style

Allowed:

- report sheet,
- floating cards,
- small charts,
- soft domain rings,
- flow lines,
- simple line-art parent-child silhouette.

Avoid:

- fake doctor avatar,
- medical cross or seal implying approval,
- childish toy overload,
- emoji/icon spam,
- complex realistic human drawings,
- claims such as doctor-approved, clinically validated, or expert-reviewed.

---

## 6. Motion System

The chosen motion direction is a blend of static-first illustration, subtle premium motion, and one hero-focused animated sequence.

Rules:

1. Static-first: the page remains polished if motion is disabled.
2. Subtle premium motion: soft entrance, hover, and gentle float effects.
3. Hero-focused animation: the memorable report-building sequence is limited to the hero.
4. No cinematic motion across every section.
5. No scroll-jacking.
6. No bounce/confetti/childish effects.
7. Respect `prefers-reduced-motion`.

Suggested timing:

- Entrance duration: 500–900ms.
- Use soft ease-out or cubic-bezier easing.
- Cards enter before lines.
- Report settles last.

---

## 7. Ethical and Copy Constraints

The landing page must not say or imply:

- diagnosis,
- treatment,
- cure,
- doctor approval,
- clinically validated,
- expert reviewed,
- therapy prescription,
- machine-learning diagnosis,
- professional consultation inside SINAD+.

Allowed framing:

- early observation,
- parent companion,
- structured home notes,
- consultation preparation,
- screening as initial indication,
- professional consultation required.

The compact hero disclaimer is required. A dedicated safety section is also included later in the page structure.

---

## 8. Success Criteria

The redesigned landing page should improve the review target from the current approximate 24/50 to at least 38/50.

Target dimension scores:

- Philosophy consistency: 8/10
- Visual hierarchy: 8/10
- Detail execution: 8/10
- Functionality: 7/10
- Innovation: 7/10

Functional acceptance:

1. `Masuk Demo` remains the primary CTA and links to the demo login path.
2. `Lihat Alur` scrolls or links to the solution flow section.
3. `Lihat Demo Laporan` links to the report preview or demo report flow when available.
4. Compact disclaimer appears in the hero.
5. Safety section appears below the main product explanation.
6. Page is responsive and usable on desktop and mobile.
7. Motion does not break layout and respects reduced-motion preferences.
8. No unsafe medical or expert validation claims appear in visible copy.

---

## 9. Implementation Notes

Expected implementation area:

- Public landing page component, likely `app/(public)/page.tsx` or the current equivalent route.
- Global tokens and animations in `app/globals.css` if consistent with the existing design system.
- Reusable illustration components may be placed under `components/landing/` if the page becomes too large.

The implementation should prefer semantic React components for:

- `LandingHero`
- `ReportAssemblyIllustration`
- `ProblemCards`
- `SolutionFlow`
- `ReportPreviewSection`
- `SafetySection`
- `FinalCta`

Keep the code maintainable. If the landing page component grows too large, split sections into focused components.
