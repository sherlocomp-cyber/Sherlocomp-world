# TEST_REPORT

Hanya hasil yang benar-benar dijalankan yang dicatat di sini.

## Sesi 1 — PHASE 0 (2026-10-31)

### Dijalankan dan lulus

| Uji | Cara | Hasil |
|---|---|---|
| `bab2-hewan.json` dan `bab3-penyakit.json` dapat di-parse sebagai JSON | Python `json.load` | Lulus |
| Seluruh `id` unik di kedua berkas | Skrip validasi | Lulus — 134 ID, 0 duplikat |
| Semua rujukan ID kosakata (`vocab`, `pictures`, `target_vocab`, `ar_vocab`, `words`) menunjuk ID yang ada | Skrip validasi | Lulus — 0 rujukan hilang |
| Jumlah kosakata inti | Skrip statistik | Bab 2 = 21, Bab 3 = 14 (sesuai hitungan manual dari halaman buku) |
| Repo remote berisi `main` setelah commit pertama | `git ls-remote` | Lulus |
| Isi dua JSON di GitHub sama dengan file lokal yang divalidasi | `git clone` salinan remote + `cmp` | Lulus — identik byte-per-byte |
| Validasi ulang pada salinan hasil clone | Skrip validasi yang sama | Lulus — 134 ID, 0 duplikat, 0 rujukan hilang |

Skrip validasi dijalankan dari luar folder proyek (tidak disimpan di repo).

### Belum diuji / tidak dapat diuji sekarang

- **Akurasi transkripsi Arab dan harakat**: ditranskripsi manual dari scan; **belum diperiksa penutur/guru Bahasa Arab**. 47 entri bertanda `verify`.
- Seluruh fitur game, PWA, GitHub Pages, APK, performa, offline: **tidak ada kode, tidak diuji**.
- Perangkat target (HP, Xiaomi Pad 7 Pro, laptop, PC, monitor 30 inci): belum diuji.

### Bug diketahui

Tidak ada kode, jadi tidak ada bug perangkat lunak. Masalah materi tercatat di `MATERIAL_INDEX.md`.
