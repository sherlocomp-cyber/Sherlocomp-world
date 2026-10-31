# TASKS

Legenda: `[x]` selesai dan terbukti · `[ ]` belum · `[~]` sebagian.

## PHASE 0 — Project Discovery — SELESAI DAN DISETUJUI (2026-10-31)

- [x] Periksa repository (awalnya kosong)
- [x] Baca seluruh halaman kedua PDF (Bab 2: 16 hlm, Bab 3: 19 hlm)
- [x] Ekstrak materi → `src/data/lessons/*.json`, divalidasi (`TEST_REPORT.md`)
- [x] `PROJECT_SPEC.md`, `ROADMAP.md`, `MATERIAL_INDEX.md`, `ASSET_REQUIREMENTS.md`, `TASKS.md`
- [x] Master prompt Google Flow
- [x] File handoff (`HANDOFF.md`, `DECISIONS.md`, `CHANGELOG.md`, `TEST_REPORT.md`, `NEXT_SESSION_PROMPT.md`)
- [x] Struktur folder aset fisik; folder kode dibuat saat PHASE 1
- [x] Branch `develop` (D-025)
- [x] Aset Flow: seluruh 108 aset inti di-intake dan di-push pengguna ke repo
- [x] **Persetujuan eksplisit memulai PHASE 1**: pengguna menulis "Tahap 1" (2026-10-31)

## Pertanyaan T-01 s/d T-05 — SELESAI (D-018 s/d D-022)

## Aset Flow — sisa non-blokir

- [x] Verifikasi jumlah file di repo = 108 (sesi 3: `git ls-files | grep -c '^public/assets/images/'` = 108)
- [ ] Dibuat ulang di Flow: `acc_headband`, `health_wasfa` (D-014), `story_02`; opsional skybox sejati dan tekstur tileable (`tex_roof_tile`, `tex_wood`)
- [ ] Konfirmasi pengguna: pasangan pet/animal (kelinci, kura-kura)

## PHASE 1 — Foundation — SELESAI (laporan lisan pengguna, 2026-10-31)

Catatan: PHASE 1 ditandai selesai berdasarkan laporan lisan pengguna ("aman") setelah menjalankan game di browser. Tabel uji manual di `TEST_REPORT.md` sengaja TIDAK diisi (keputusan pengguna). Butir `[~]` berarti kode ada, lolos uji Node, dan dijalankan pengguna, tanpa uji rinci per fitur.

- [~] Proyek Vite + Three.js, base path relatif (`vite.config.js`; three 0.187.0 dipin) — `npm install` berhasil di PC pengguna; `npm run build` belum dilaporkan
- [~] Loading (pramuat 8 gambar + progres), main menu, character creation (laki-laki/perempuan, nama, 6 warna), pengaturan, jeda
- [~] Scene 3D prosedural "Lembah Awal": medan, kolam, ±38 pohon/palem, 14 batu, rumah, papan, pagar, bunga, awan, 5 bintang
- [~] Kamera orang ketiga; jalan, lari, lompat; tabrakan lingkaran; batas dunia
- [~] Joystick virtual + tombol Lompat/Lari/Aksi + keyboard (WASD, Spasi, Shift, E, Esc, panah) + geser untuk memutar kamera
- [~] Grafis Rendah/Sedang/Tinggi (resolusi render, bayangan, jarak kabut) + deteksi awal
- [x] Uji Node: 28/28 lulus (`tests/smoke.mjs`) — logika murni + konsistensi proyek; **bukan** uji WebGL
- [x] Pengguna: `npm install`, `npm run dev`, mainkan (dilaporkan "aman"; tabel uji manual tidak diisi atas keputusan pengguna)
- [ ] Perbaiki bug dari pemakaian pengguna bila ada (mis. pencahayaan terlalu terang/gelap, arah kamera, orientasi daun palem)
- [ ] Ukur FPS nyata (`?debug=1`) di HP, Xiaomi Pad 7 Pro, laptop; catat; tetapkan anggaran poligon/draw call
- [x] Commit `package-lock.json` hasil `npm install` (7d626f0, di `develop`)
- [x] Persetujuan pengguna atas PHASE 1 (laporan lisan) → PHASE 2 boleh dimulai

### Sengaja BELUM ada di PHASE 1
Penyimpanan IndexedDB dan profil banyak siswa (PHASE 6), aksesori karakter (aset sudah ada; PHASE 3), teks Arab dan font Arab (PHASE 3, D-008/D-009), NPC, quest, mini-game, audio, PWA/service worker (PHASE 8–9), Capacitor (PHASE 10).

## PHASE 2–10

Lihat `ROADMAP.md`. Belum dimulai. PHASE 2 (World Design) berikutnya; syarat selesai mencakup FPS terukur di Xiaomi Pad 7 Pro.
