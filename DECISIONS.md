# DECISIONS

Status: **Diusulkan** = pilihan Claude, belum disetujui pengguna. **Ditetapkan** = datang dari arahan pengguna (Master Directive).

| ID | Keputusan | Status | Alasan / catatan |
|---|---|---|---|
| D-001 | Satu repo `sherlocomp-cyber/Sherlocomp-world`; branch `main` stabil, `develop` untuk pengembangan, feature branch untuk fitur besar; commit format `feat:`/`fix:`/`docs:`/... | Ditetapkan | Arahan pengguna. **Catatan:** `develop` belum ada; alat repo sesi 1 hanya commit ke `main`. |
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

## Penjelasan singkat APK debug vs release (diminta Directive)

- **Debug:** ditandatangani otomatis dengan kunci debug, mudah dipasang manual untuk uji, tidak untuk distribusi luas, tidak dioptimalkan.
- **Release:** dioptimalkan dan ditandatangani dengan keystore milik pengguna; kunci yang sama harus dipakai di setiap pembaruan agar APK dapat menimpa versi lama. Kehilangan keystore berarti tidak bisa memperbarui aplikasi yang sama.
