# ARABIA WORLD: THE LOST KINGDOM

*Jelajahi Dunia, Taklukkan Misi, Kuasai Bahasa Arab!*

Game edukasi 3D bergaya low-poly (terinspirasi Roblox) untuk siswa **kelas 3 Madrasah Ibtidaiyah**.
Materi: *Semangat Belajar Bahasa Arab untuk MI Kelas III* — Bab 2 (Nama-nama Hewan) dan Bab 3 (Penyakit).

Satu basis kode untuk tiga bentuk distribusi: **Web (GitHub Pages)**, **PWA**, dan **APK Android (Capacitor)**.
Perangkat utama uji: Xiaomi Pad 7 Pro yang disambung ke monitor 30 inci di papan tulis kelas.

## Status

**PHASE 0 selesai dan disetujui. PHASE 1 (Foundation): kode sudah ditulis, tetapi BELUM diuji di browser** (uji Node 28/28 lulus; `npm install`/build/run belum pernah dijalankan). Lihat `HANDOFF.md` dan `TEST_REPORT.md`.

## Menjalankan (butuh Node 20+)

```bash
git checkout develop && git pull
npm install                 # lalu commit package-lock.json
npm run test:smoke          # uji Node (logika + konsistensi), bukan uji WebGL
npm run dev                 # buka http://localhost:5173/?debug=1  (?debug=1 = tampilkan FPS)
npm run build && npm run preview
```

Kontrol: WASD gerak · Spasi lompat · Shift lari · E aksi · geser mouse/jari putar kamera · Esc jeda.
Di HP/tablet: joystick kiri, tombol Lompat/Lari/Aksi kanan.

## Peta dokumen

| File | Isi |
|---|---|
| `HANDOFF.md` | Status terkini dan instruksi untuk sesi Claude berikutnya (baca PERTAMA) |
| `NEXT_SESSION_PROMPT.md` | Prompt siap salin untuk sesi berikutnya |
| `PROJECT_SPEC.md` | Spesifikasi proyek |
| `ROADMAP.md` | Fase 0–10 |
| `MATERIAL_INDEX.md` | Indeks materi buku, cakupan, dan bagian yang perlu diverifikasi |
| `ASSET_REQUIREMENTS.md` | Daftar aset visual + MASTER PROMPT Google Flow |
| `TASKS.md` | Daftar tugas dan pertanyaan terbuka |
| `DECISIONS.md` | Keputusan teknis penting |
| `CHANGELOG.md` | Riwayat perubahan |
| `TEST_REPORT.md` | Laporan pengujian nyata |
| `src/data/lessons/` | Database materi terpusat (JSON) |
| `src/` `index.html` `tests/` | Kode game PHASE 1 (Vite + Three.js) dan uji Node |

## Catatan

- File PDF buku **tidak** disimpan di repository ini.
- Jangan pernah menyimpan token, password, atau keystore di repository.
