# ROADMAP — Arabia World: The Lost Kingdom

Satu fase pada satu waktu. Fase berikutnya hanya dimulai setelah fase sebelumnya **diuji dan disetujui pengguna**. Perkiraan sesi adalah tebakan kasar untuk perencanaan, bukan janji; ukuran sesi tergantung kuota.

| Fase | Tujuan | Hasil yang dapat diuji | Syarat selesai | Perkiraan sesi |
|---|---|---|---|---|
| **0 Discovery** | Repo, PDF, spesifikasi, roadmap, indeks materi, kebutuhan aset, master prompt Flow, database materi | Dokumen + 2 JSON valid | Pengguna menyetujui; materi diverifikasi guru; aset Flow siap | 1 (selesai sebagian) |
| **1 Foundation** | Menu utama, loading, character creation sederhana, scene Three.js, kamera orang ketiga, jalan/lompat, joystick, keyboard, grafis adaptif, satu area kecil playable | Dibuka di browser, karakter bergerak di HP/tablet/PC | Playable + `TEST_REPORT.md` terisi hasil nyata | 2–3 |
| **2 World Design** | Animal Kingdom lalu Sickness Kingdom: terrain, bangunan, props, pencahayaan, collision | Satu dunia selesai penuh sebelum dunia kedua | Frame rate dapat diterima di Xiaomi Pad 7 Pro (diukur) | 3–4 |
| **3 Character & NPC** | Animasi, NPC, interaksi, sistem dialog, render teks Arab, pemutaran audio | NPC bicara dan bertanya dalam Arab | Teks Arab berharakat benar di semua perangkat | 2–3 |
| **4 Quest** | Quest utama dan sampingan, pelacakan, collectible, hadiah, achievement | Quest dapat diselesaikan dan tersimpan | Progres tersimpan setelah reload | 2 |
| **5 Mini-games** | 10 mini-game satu per satu, masing-masing diuji sebelum lanjut | Tiap mini-game bermain dari awal sampai akhir | Semua merujuk ID dari database tunggal | 4–6 |
| **6 Learning Engine** | Penguasaan kosakata, listening, reading, dialog, spaced repetition, penilaian individual | Mastery per siswa per kosakata | Data akurat terhadap materi | 2–3 |
| **7 Teacher Mode** | Dashboard, mode kelas, acak giliran, progres, ekspor CSV | CSV terunduh dan benar | Diuji guru di kelas | 2 |
| **8 Polish** | Animasi, audio, UI, performa, responsif, offline, aksesibilitas | Uji jarak pandang di monitor 30 inci | Offline berjalan | 2–3 |
| **9 GitHub Pages** | Build web, base path, workflow Actions, deploy | URL publik dapat dibuka | **Diklaim berhasil hanya setelah URL benar-benar diakses** dan diuji di HP/tablet | 1 |
| **10 Android APK** | Capacitor, app ID, ikon/splash, build, sinkron, APK debug via Actions | APK terpasang di perangkat | Instalasi diuji; proses update didokumentasikan | 1–2 |

## Dependensi lintas fase

- Aset Google Flow (ASSET_REQUIREMENTS.md) dibutuhkan paling lambat di PHASE 3 (potret NPC, kartu hewan/penyakit); PHASE 1 dapat berjalan dengan placeholder bergaya prosedural.
- Audio Arab dibutuhkan paling lambat di PHASE 3.
- Verifikasi guru atas entri `verify` dibutuhkan sebelum PHASE 5.
- Halaman PDF yang hilang dibutuhkan sebelum PHASE 5/6 agar cakupan materi lengkap.

## Strategi quota

Tiap sesi diakhiri dengan commit stabil + pembaruan `HANDOFF.md`, `TASKS.md`, `CHANGELOG.md`, `DECISIONS.md`, `TEST_REPORT.md`, `NEXT_SESSION_PROMPT.md`. Handoff dimulai jika pengguna menyebut sisa kuota ≈20% atau muncul peringatan limit.
