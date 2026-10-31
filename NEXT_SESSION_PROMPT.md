# NEXT_SESSION_PROMPT

Salin blok di bawah ini ke sesi/akun Claude berikutnya.

```
Kamu melanjutkan proyek "ARABIA WORLD: THE LOST KINGDOM" (game edukasi 3D Bahasa Arab kelas 3 MI) di repository GitHub sherlocomp-cyber/Sherlocomp-world.

WAJIB, berurutan, sebelum mengerjakan apa pun:
1. Baca HANDOFF.md, lalu TASKS.md, lalu DECISIONS.md.
2. Periksa repository aktual (daftar file + commit terakhir, cabang `develop`). Percayai repo, bukan ingatan.
3. Jangan mengulang pekerjaan yang sudah selesai. Jangan menghapus atau menimpa file yang sudah ada tanpa membaca isinya.
4. Jangan mengubah teks buku di src/data/lessons/. ID kosakata tidak boleh diubah.
5. Kerjakan SATU fase saja. PHASE 0 dan PHASE 1 selesai (PHASE 1 berdasarkan laporan lisan pengguna "aman"; TEST_REPORT.md manual sengaja tidak diisi). Fase berikutnya: PHASE 2 (World Design, Animal Kingdom dulu). Jangan menulis ulang kode PHASE 1; perbaiki bila ada bug. Baca ROADMAP.md PHASE 2, rangkum, lalu tanya pengguna apakah langsung mulai. Syarat selesai PHASE 2 mencakup FPS terukur di Xiaomi Pad 7 Pro.
6. Jangan pernah mengklaim sudah commit/push/deploy/menguji jika belum benar-benar berhasil. Catat hasil uji nyata di TEST_REPORT.md. Jika sandbox tanpa internet atau tanpa git, katakan terus terang dan serahkan kode untuk dijalankan pengguna.
7. Jangan menyimpan token, password, atau keystore di repo.
8. Jika pengguna menyebut kuota ≈20% atau kurang, atau muncul peringatan limit: hentikan fitur baru, commit yang stabil, perbarui HANDOFF.md/TASKS.md/CHANGELOG.md/DECISIONS.md/TEST_REPORT.md/NEXT_SESSION_PROMPT.md, lalu akhiri dengan "SESI PENGEMBANGAN DIHENTIKAN DENGAN AMAN." beserta fase terakhir, pekerjaan selesai/tersisa, commit terakhir, status GitHub, lokasi handoff, dan prompt berikutnya.

Langkah pertama: `git fetch origin main develop` lalu bandingkan (pembaruan dokumen lewat put_file bisa masuk `main`, bukan `develop`). Coba `npm install`; bila registry diblokir (403), katakan terus terang, jangan cari jalan memutar, dan serahkan perbaikan kode untuk dijalankan pengguna. Bila pengguna melaporkan bug atau pesan galat konsol, perbaiki dulu sebelum PHASE 2. Bila memakai skill brainstorming dan pengguna sudah menyatakan 'lanjut' atau 'langsung mulai', pertanyaan dilewati.
```
