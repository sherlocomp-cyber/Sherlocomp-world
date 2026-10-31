# HANDOFF

Diperbarui: 2026-10-31 (akhir sesi 1)

## 1. Proyek
ARABIA WORLD: THE LOST KINGDOM — game edukasi 3D Bahasa Arab kelas 3 MI (Bab 2 hewan, Bab 3 penyakit). Repo: `sherlocomp-cyber/Sherlocomp-world`.

## 2. Fase saat ini
**PHASE 0 — Project Discovery.** Dokumen dan database materi selesai dan terverifikasi sintaksis. **Gerbang persetujuan belum dilewati**: pengguna belum menyetujui hasil, materi belum diverifikasi guru, aset Google Flow belum dihasilkan. Jangan mulai PHASE 1 sebelum pengguna menyetujui.

## 3. Status (berdasarkan pekerjaan nyata)
- PHASE 0: dokumen & data selesai; syarat keluar fase **belum** terpenuhi (persetujuan, verifikasi materi, aset).
- Proyek keseluruhan: **sekitar 3%** (hanya perencanaan dan data; nol baris kode game).

## 4. Selesai
- Pemeriksaan repo (kosong) dan pembacaan seluruh halaman kedua PDF.
- Database materi Bab 2 dan Bab 3 (JSON), tervalidasi: parse OK, 134 ID unik, 0 rujukan hilang, isi remote identik dengan lokal.
- Dokumen: spesifikasi, roadmap, indeks materi, kebutuhan aset + master prompt Flow, tasks, keputusan, changelog, laporan uji, prompt sesi berikutnya.

## 5. Belum selesai
- Persetujuan pengguna atas PHASE 0.
- Verifikasi guru atas 47 entri `verify`.
- Halaman PDF yang hilang (Bab 2 hlm 29, 43–44; Bab 3 hlm 74+ bila ada).
- Sumber audio (QR di buku, audio tidak ada).
- Aset visual dari Google Flow.
- Branch `develop`.
- Seluruh PHASE 1–10.

## 6. File dibuat
`README.md`, `PROJECT_SPEC.md`, `ROADMAP.md`, `MATERIAL_INDEX.md`, `ASSET_REQUIREMENTS.md`, `TASKS.md`, `DECISIONS.md`, `CHANGELOG.md`, `TEST_REPORT.md`, `NEXT_SESSION_PROMPT.md`, `HANDOFF.md`, `src/data/lessons/bab2-hewan.json`, `src/data/lessons/bab3-penyakit.json`.

## 7. File diubah
Tidak ada (repo semula kosong). `TEST_REPORT.md` ditulis dua kali dalam sesi ini.

## 8. Struktur repository terbaru
```
README.md  PROJECT_SPEC.md  ROADMAP.md  MATERIAL_INDEX.md  ASSET_REQUIREMENTS.md
TASKS.md  DECISIONS.md  CHANGELOG.md  TEST_REPORT.md  HANDOFF.md  NEXT_SESSION_PROMPT.md
src/data/lessons/bab2-hewan.json
src/data/lessons/bab3-penyakit.json
```
Folder lain (core/, game/, worlds/, dst.) belum ada fisik; dibuat saat PHASE 1.

## 9. Commit terakhir
Sebelum commit HANDOFF ini, remote `main` berada di `3dd9047` ("docs: add next session prompt"). Commit HANDOFF ini adalah yang terbaru; jalankan `git log -1` untuk memastikan.

## 10. Branch aktif
Hanya `main`. **`develop` belum dibuat** (alat repo sesi 1 hanya commit ke `main`; CLI `gh` pada sandbox tidak punya token valid).

## 11. Bug
Tidak ada kode. Masalah materi: lihat `MATERIAL_INDEX.md` bagian 7–8.

## 12. Hasil pengujian
Lihat `TEST_REPORT.md`. Hanya validasi data JSON yang dijalankan (lulus). Tidak ada uji game/perangkat.

## 13. Ketergantungan
Belum ada yang dipasang. Usulan (belum diterapkan): Vite, Three.js (versi dipin), Capacitor, font Arab OFL.

## 14. Langkah berikutnya (spesifik)
1. Pengguna: jawab T-01 s/d T-05 di `TASKS.md`; minta guru memeriksa entri `verify`; jalankan master prompt di Google Flow (`ASSET_REQUIREMENTS.md` bagian 6) dan unggah PNG (minimal Batch 1–3).
2. Setelah pengguna menyatakan **menyetujui PHASE 0**: buat branch `develop`, lalu mulai PHASE 1 (Vite + Three.js, menu, loading, character creation, scene, kamera, gerak, joystick, keyboard, grafis adaptif, satu area playable). PHASE 1 dapat berjalan dengan placeholder prosedural bila aset belum datang.
3. Intake aset Flow sesuai `ASSET_REQUIREMENTS.md` bagian 5 (manifest dulu).

## 15. Instruksi untuk Claude berikutnya
Ikuti `NEXT_SESSION_PROMPT.md`. Baca repo aktual dulu. Satu fase per sesi. Tanyakan hanya yang masih terbuka.

## 16. Jangan diulang atau dirusak
- Jangan menulis ulang database materi; jangan ubah ID; jangan "memperbaiki" teks buku (tandai saja).
- Jangan mengklaim terjemah dialog, arti `general_knowledge`, atau jawaban `*_derived` sebagai resmi.
- Jangan menyalin gambar buku; jangan taruh PDF di repo.
- Jangan memasukkan teks Arab ke dalam ilustrasi.
- Jangan menyimpan secret/keystore di repo; jangan force push.
