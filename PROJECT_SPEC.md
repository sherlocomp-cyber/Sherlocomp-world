# PROJECT_SPEC — ARABIA WORLD: THE LOST KINGDOM

Versi 0.1 · PHASE 0 · 2026-10-31 · Status: **menunggu persetujuan pengguna**

Tanda **[USULAN]** = pilihan Claude, belum disetujui pengguna. Semua keputusan teknis dicatat di `DECISIONS.md`.

## 1. Ringkasan

Game edukasi 3D low-poly bergaya petualangan RPG untuk siswa kelas 3 MI. Siswa menjelajahi dua kerajaan, bertemu NPC, mengerjakan misi, dan memainkan mini-game yang melatih kosakata, dialog, dan pola kalimat dari Bahasa Arab MI Kelas III Bab 2 dan Bab 3.

- Dunia 1 **ANIMAL KINGDOM** — Bab 2 (أَسْمَاءُ الْحَيَوَانَاتِ), 21 kosakata inti hewan.
- Dunia 2 **THE SICKNESS KINGDOM** — Bab 3 (الْأَمْرَاضُ), 14 kosakata inti penyakit dan layanan kesehatan.

Prinsip: lebih banyak bermain, bergerak, menemukan, mendengar, membaca, dan memecahkan masalah. **Tidak terasa seperti aplikasi ujian.**

## 2. Pengguna dan konteks

- Siswa kelas 3 MI (sekitar 8–9 tahun). Guru pengampu Bahasa Arab sebagai operator Teacher Mode.
- Pemakaian kelas: Xiaomi Pad 7 Pro disambung ke monitor 30 inci di atas papan tulis → UI harus terbaca dari belakang kelas.
- Pemakaian mandiri: HP/tablet Android, laptop Windows, PC.

## 3. Distribusi (satu basis kode)

1. Web — GitHub Pages (jalan di sub-path repository, bukan hanya root domain).
2. PWA — service worker dengan cache versioning dan update aman.
3. APK Android — Capacitor + GitHub Actions. Debug APK untuk uji; release APK hanya dengan keystore milik pengguna (tidak pernah masuk repo).

Ketiganya memakai database materi yang sama (`src/data/lessons/`).

## 4. Sumber materi

Dua PDF buku *Semangat Belajar Bahasa Arab untuk MI Kelas III*. Hasil ekstraksi PHASE 0 ada di `src/data/lessons/*.json`; ringkasan dan daftar celah di `MATERIAL_INDEX.md`.

Aturan data: satu sumber kebenaran; ID unik per entri (`b2-v01`, `b3-v07`, ...); setiap mini-game merujuk **ID**, tidak menyalin teks. Teks buku tidak diubah. Arti yang tidak tertulis di buku diberi label sumber dan wajib diverifikasi guru.

## 5. Alur permainan inti

Jelajah → temui NPC → terima misi → mini-game → hadiah (XP/gold/koleksi) → penguasaan kosakata naik → boss akhir dunia.

Tiap dunia: lingkungan 3D, NPC, bangunan, objek interaktif, quest, mini-game, hidden treasure, achievement, final boss.

## 6. Fitur (cakupan penuh)

- **Character creation:** laki-laki/perempuan, warna pakaian, aksesori, nama pemain.
- **Open world:** kamera orang ketiga, jalan/lari/lompat, interaksi objek dan NPC, mini-map, quest marker, collectible, treasure chest.
- **NPC:** bicara, beri misi dan petunjuk, bertanya dalam Bahasa Arab, merespons, memicu mini-game.
- **10 mini-game dengan gameplay berbeda:** Word Hunter, Picture Match, Listening Challenge, Memory Cards, Arabic Runner, Word Builder, Dialogue Master, Treasure Hunt, Speed Challenge, Final Boss Challenge.
- **RPG:** XP, level, gold, achievement, badge, kostum, pet companion, koleksi, vocabulary mastery.
- **Teacher Mode:** pilih dunia/misi, atur waktu, acak giliran, kontrol permainan, tingkat kesulitan, matikan terjemahan, lihat progres, unduh CSV. Mode satu perangkat untuk kelas; arsitektur disiapkan untuk multiplayer di masa depan (belum dibangun).

### Pemetaan Teach Like a Champion 3.0 **[USULAN]**

| Teknik | Mekanisme di game |
|---|---|
| Everybody Writes | Langkah "tulis dulu" di buku catatan sebelum jawaban dibuka; Word Builder dan imla |
| Cold Call | Teacher Mode mengacak siswa yang menjawab |
| Wait Time | Jeda hitung mundur sebelum pilihan jawaban muncul |
| No Opt Out | Jawaban salah → petunjuk → ulang sampai benar |
| Right Is Right | Jawaban harus lengkap (harakat/kalimat utuh) agar dihitung benar |
| Check for Understanding | Satu pertanyaan cek cepat di akhir interaksi NPC |
| Ratio | Layar minim teks guru; siswa yang berpikir dan mengucap |
| Everybody Participates | Giliran bergantian + respons serempak (tampilan kelas) |

Penguasaan dicatat **per siswa per kosakata**.

## 7. Cross-platform dan mode kelas

- Sentuh: joystick virtual, tombol lompat, tombol interaksi, kamera sentuh.
- Desktop: WASD, Space, mouse, E (interaksi), ESC (jeda).
- Grafis Low/Medium/High; gameplay **tidak boleh berkurang** di Low.
- Mode kelas: landscape, 16:9, fullscreen, teks Arab besar (titik awal 36–48 px di Full HD, disesuaikan setelah uji jarak pandang), kontras tinggi, UI sederhana.

## 8. Arsitektur teknis **[USULAN]**

- HTML5 + CSS3 + JavaScript (ES modules) + Three.js, dibangun dengan Vite agar base path GitHub Pages mudah dan aset ter-bundle lokal.
- Penyimpanan: IndexedDB, fallback LocalStorage.
- PWA: service worker dengan nama cache berversi.
- Android: Capacitor (WebView), build di GitHub Actions.
- Model 3D dibuat prosedural low-poly di kode (tanpa glTF eksternal pada Phase 1–2); ilustrasi 2D dari Google Flow. Alasan di `DECISIONS.md` D-003.
- Font Arab bundel lokal berlisensi terbuka (kandidat: Amiri atau Noto Naskh Arabic), diuji untuk render harakat penuh.

### Struktur folder target

```
src/
  core/ game/ worlds/ characters/ npcs/ quests/ minigames/ ui/ audio/ teacher/
  data/lessons/        <- sudah ada (PHASE 0)
public/
  assets/ models/ textures/ audio/ images/
android/               <- Capacitor (PHASE 10)
docs/                  <- panduan deployment/pengujian (nanti)
```

Folder kosong tidak bisa dilacak Git; folder dibuat saat file pertamanya ada (PHASE 1 dan seterusnya).

### Model data kemajuan siswa (rancangan, dibangun di PHASE 6)

`profile {id, name, avatar}` · `mastery {profileId, vocabId, box 0–5, correctStreak, lastSeen}` · `attempt {profileId, vocabId, minigame, correct, ms, ts}`. Spaced repetition model kotak (Leitner).

## 9. Kualitas dan pengujian

Setiap fitur diuji sebelum dinyatakan selesai; hasil nyata dicatat di `TEST_REPORT.md`. Perangkat target: HP Android, Xiaomi Pad 7 Pro, laptop, PC, monitor 30 inci. Tidak ada hasil uji yang boleh dikarang.

## 10. Risiko dan hal yang belum diketahui

1. **Audio tidak ada di PDF.** Soal "Dengarkan" memakai QR code. Dibutuhkan sumber audio (rekaman guru/penutur asli atau TTS Arab). Perlu keputusan pengguna.
2. **Halaman hilang:** Bab 2 hlm 43–44 (teks qira'ah + soal 1–2) dan halaman pembuka bab; Bab 3 mungkin hlm 74+.
3. **Hak cipta buku:** repository ini publik dan berisi teks buku (kosakata, dialog, bacaan). Gambar buku **tidak** dipakai. Pertimbangkan membuat repo private atau memastikan izin penerbit sebelum publikasi luas.
4. **Google Flow menghasilkan gambar, bukan model 3D.** Aset 3D dibuat prosedural di kode.
5. **Performa WebGL di Xiaomi Pad 7 Pro belum diukur** (belum ada kode). Anggaran poligon/draw call ditetapkan setelah uji PHASE 1.
6. **Verifikasi materi:** transkripsi harakat dilakukan manual dari scan; 47 entri bertanda `verify` (lihat `MATERIAL_INDEX.md`) perlu dicek guru Bahasa Arab.
7. **Build APK** butuh Android SDK di runner GitHub Actions; belum dicoba.
