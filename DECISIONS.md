# DECISIONS

Status: **Diusulkan** = pilihan Claude, belum disetujui pengguna. **Ditetapkan** = datang dari arahan pengguna (Master Directive).

| ID | Keputusan | Status | Alasan / catatan |
|---|---|---|---|
| D-001 | Satu repo `sherlocomp-cyber/Sherlocomp-world`; branch `main` stabil, `develop` untuk pengembangan, feature branch untuk fitur besar; commit format `feat:`/`fix:`/`docs:`/... | Ditetapkan | Arahan pengguna. **Catatan:** `develop` dibuat pada sesi 1 setelah akses push tersedia (lihat D-025). |
| D-002 | Stack: HTML5 + CSS3 + JavaScript ES modules + Three.js, dibangun dengan **Vite**, base path relatif (`./`) | Diusulkan | Vite menyederhanakan bundel aset lokal dan base path GitHub Pages sub-path. Versi Three.js dipin saat PHASE 1. |
| D-003 | Dunia dan karakter 3D dibuat **prosedural low-poly di kode**; Google Flow hanya untuk ilustrasi 2D | Diusulkan | Flow menghasilkan gambar/video, bukan model 3D. Menghindari aset glTF eksternal pada Phase 1–2 dan menjaga ukuran/offline. |
| D-004 | Phase 0 menaruh lima dokumen wajib + file handoff di **root** repo; `docs/` dicadangkan untuk panduan deployment/pengujian nanti | Diusulkan | Sesuai daftar output di Directive; mudah ditemukan sesi berikutnya. |
| D-005 | Database materi: satu JSON per bab di `src/data/lessons/`; ID unik berpola; mini-game hanya merujuk ID | Ditetapkan (prinsip) / Diusulkan (format) | Directive: jangan menduplikasi materi. Skema di `MATERIAL_INDEX.md`. |
| D-006 | Setiap arti diberi `meaning_source` (`book_text` / `book_picture` / `general_knowledge`); jawaban latihan diberi akhiran `_derived` | Diusulkan | Buku tidak menyertakan arti kosakata hewan tertentu, arti dialog, atau kunci jawaban; tidak boleh mengarang diam-diam. |
| D-007 | Teks buku **tidak diubah**; ketidakkonsistenan buku dipertahankan dan ditandai | Ditetapkan | Directive: jangan mengubah materi buku. |
| D-008 | Alif khanjariyah (ٰ) dipertahankan seperti di buku (هٰذَا, ذٰلِكَ, اللّٰهُ) | Diusulkan | Fidelitas ke buku. **Risiko:** font harus mendukungnya; diuji di PHASE 3 sebelum font ditetapkan. |
| D-009 | Font Arab bundel lokal berlisensi terbuka (kandidat Amiri / Noto Naskh Arabic) | Diusulkan | Offline, harakat penuh, tidak bergantung CDN. |
| D-010 | Penyimpanan: IndexedDB + LocalStorage fallback; profil, mastery, attempt per siswa | Ditetapkan (teknologi) / Diusulkan (skema) | Skema di `PROJECT_SPEC.md` bagian 8. |
| D-011 | Spaced repetition model kotak (Leitner 0–5) | Diusulkan | Sederhana, mudah dijelaskan guru, mudah dihitung offline. |
| D-012 | Pemetaan TLAC 3.0 ke mekanisme game (tabel di `PROJECT_SPEC.md`) | Diusulkan | Perlu ditinjau guru. |
| D-013 | Ilustrasi Flow: latar magenta solid untuk potongan, lalu transparansi diproses saat intake | Diusulkan | Banyak hewan berwarna hijau, sehingga chroma hijau berisiko. |
| D-014 | Tanda tambah hijau (bukan Palang Merah/Bulan Sabit Merah) untuk simbol kesehatan di aset | Diusulkan | Lambang Palang Merah dilindungi. |
| D-015 | Gambar buku tidak dipakai; semua ilustrasi orisinal | Diusulkan | Hak cipta; buku hanya sebagai referensi isi. |
| D-016 | App ID Android usulan `com.sherlocomp.arabiaworld` | Diusulkan | Menunggu T-04. |
| D-017 | APK debug untuk uji; APK release hanya ditandatangani keystore pengguna yang **tidak pernah** masuk repo | Ditetapkan | Directive. |
| D-018 | **T-01 halaman hilang diabaikan** atas arahan pengguna. Game memakai materi yang ada; Bab 2 berjalan tanpa teks qira'ah (hlm 43–44). Jika halaman diberikan nanti, ditambahkan sebagai entri BARU (ID baru), tanpa mengubah ID lama | Ditetapkan (pengguna) | Arahan 2026-10-31. |
| D-019 | **T-02 audio:** dua lapis. (1) file rekaman `public/audio/vocab/<id>.mp3` bila ada; (2) cadangan Web Speech API suara Arab (`ar-SA`); (3) bila keduanya tak tersedia, tampil teks + tombol ulang tanpa suara. Rekaman guru dapat ditambahkan kapan saja tanpa ubah kode. Ketersediaan suara Arab pada Xiaomi Pad 7 Pro dan mode offline **harus diuji** sebelum diklaim bekerja | Diputuskan Claude (didelegasikan) | Tidak ada audio di PDF; TTS cepat untuk mulai, rekaman menyusul. |
| D-020 | **T-03 verifikasi materi:** game memakai data apa adanya; entri `verify`, `general_knowledge`, dan terjemah `draft_unverified` dikumpulkan di antrean verifikasi pada Teacher Mode (PHASE 7) agar guru dapat mengonfirmasi atau mengoreksi di aplikasi. Teks Arab buku tidak diubah | Diputuskan Claude (didelegasikan) | Tidak memblokir PHASE 1. |
| D-021 | **T-04** App ID `com.sherlocomp.arabiaworld`, nama aplikasi "Arabia World" | Diputuskan Claude (didelegasikan) | Mengikuti D-016. |
| D-022 | **T-05** Repo tetap **publik** (GitHub Pages gratis butuh repo publik). PDF dan gambar buku tidak pernah masuk repo. Risiko teks buku di repo publik diterima dan dapat dibalik (jadikan private) kapan saja | Diputuskan Claude (didelegasikan) | Risiko dicatat di `PROJECT_SPEC.md` bagian 10. |
| D-023 | Format aset hasil intake: potongan = **WebP berkanal alpha** (latar magenta dihapus); latar lebar = **JPG**; logo dan ikon aplikasi = **PNG** opaque. File asli Flow (JPG, ±20 MB) tidak di-commit; pengguna menyimpannya | Diputuskan Claude | WebP kecil (rata-rata ±50 KB) cocok untuk tablet/APK/offline. |
| D-024 | Ukuran aset diterima sebagaimana dikirim Flow bila rasio berbeda dari spesifikasi: latar 1376×768 (bukan 1920×1080), `hero_*_full` 768×1376 (bukan 1024×1536) | Diputuskan Claude | Rasio lebih penting daripada piksel; tidak ada peregangan gambar. |
| D-025 | Branch `develop` dibuat dari `main` sesudah akses push tersedia | Ditetapkan (D-001) | Akses push diberikan lewat pendaftaran repo ke sesi. |

## Penjelasan singkat APK debug vs release (diminta Directive)

- **Debug:** ditandatangani otomatis dengan kunci debug, mudah dipasang manual untuk uji, tidak untuk distribusi luas, tidak dioptimalkan.
- **Release:** dioptimalkan dan ditandatangani dengan keystore milik pengguna; kunci yang sama harus dipakai di setiap pembaruan agar APK dapat menimpa versi lama. Kehilangan keystore berarti tidak bisa memperbarui aplikasi yang sama.
