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

## Sesi 1 — intake aset Flow pertama (2026-10-31)

| Uji | Cara | Hasil |
|---|---|---|
| ZIP berisi 40 gambar; ukuran terbaca | Python PIL | Lulus — 40 file; 35 bergaya potongan (latar magenta), 5 opaque |
| Latar magenta terhapus pada 35 potongan | Pemeriksaan visual lembar kontak di atas latar gelap | Lulus — tepi bersih, lubang di dalam syal terhapus, tidak ada sisa magenta yang terlihat pada ukuran lembar kontak |
| Tidak ada teks dalam gambar | Pemeriksaan visual lembar kontak | Lulus pada 40 gambar yang diterima |
| Manifest cocok dengan file | Skrip: file ada, ukuran piksel cocok, alpha ada, byte cocok, ID unik | Lulus — 40 aset, 0 masalah |
| Rujukan `vocab_id` aset hewan valid | Skrip terhadap `bab2-hewan.json` | Lulus — 12 rujukan, 0 duplikat |
| Berkas di atas 250 KB | Skrip | 5 berkas: 3 latar lebar (264–352 KB), `logo_mark.png` (816 KB), `app_icon.png` (1032 KB). Semua potongan di bawah 250 KB (maks ±100 KB) |

Catatan kualitas: `acc_headband` tampak seperti gelang hijau, bukan ikat kepala (disarankan dibuat ulang). Pasangan pet/animal untuk kelinci dan kura-kura adalah **asumsi** (dari tampilan), belum dikonfirmasi pengguna.

## Sesi 2 — intake aset Flow kedua (2026-10-31)

Masukan: 3 ZIP (hewan+kesehatan 25, tekstur+langit 12, ikon+lencana+cerita 31) = 68 gambar.

| Uji | Cara | Hasil |
|---|---|---|
| Jumlah dan pemetaan 68 file ke ID manifest | Pemetaan manual dari nama file Flow + tampilan; skrip memastikan satu file ↔ satu ID | Lulus — 68 file terpetakan, 0 sisa |
| Latar magenta terhapus pada 50 potongan (11 hewan, 14 kesehatan, 15 ikon, 10 lencana) | Flood fill dari tepi + kantong magenta ≥12 piksel, despill tepi, WebP kualitas 90; pemeriksaan visual pada lembar kontak dan zoom 420 px | Lulus setelah pengulangan — **lintasan pertama meninggalkan sisa magenta** di kantong kecil (tempat tidur perawat, sela tangan, kapsul); algoritme diperketat dan diulang |
| Sisa piksel magenta pekat (alpha>40) | Skrip penghitung per file | 0 file dengan lebih dari 15 piksel |
| Manifest cocok dengan 68 file baru | Skrip: file ada, ukuran piksel, byte, ada/tidaknya alpha | Lulus — 108 entri, 0 ID ganda, 0 ketidakcocokan |
| Himpunan `vocab_id` aset | Skrip terhadap pola ID | Lulus — persis `b2-v01..v21` + `b2-x01,x02` (23) dan `b3-v01..v14` (14), tanpa duplikat |
| Tidak ada teks dalam gambar | Pemeriksaan visual lembar kontak | Lulus pada 68 gambar (tidak ada huruf/angka terbaca) |
| Bingkai putih `story_06` | Pemindaian piksel tepi | Ditemukan dan dipangkas; piksel putih tepi setelah pangkas = 0 |
| Kemulusan tekstur (rasio perbedaan tepi berlawanan terhadap perbedaan piksel bersebelahan; ≈1 = mulus) | Skrip | Mulus (≤2): clinic_floor, dirt, rock, water. Ringan (3–4): grass, leaves, sand (atas-bawah). **Terlihat:** roof_tile atas-bawah ±11, wall_mint atas-bawah ±7,6, wood kiri-kanan ±10,6 |

### Temuan kualitas (tidak memblokir PHASE 1)

- `health_wasfa`: lingkaran merah berpalang putih; D-014 meminta tanda tambah hijau. Disarankan dibuat ulang.
- `story_02`: tokoh bergaya petualang remaja, anak perempuan tidak berhijab; tidak cocok dengan character bible. `story_01`, `story_03`, `story_04` perlu diperiksa konsistensinya pada resolusi penuh.
- `sky_animal`, `sky_sickness`: panorama pemandangan 1376×768, bukan equirectangular 2048×1024 yang mulus; cukup sebagai latar, bukan skybox sejati.
- Ikon UI disimpan 256×256 (spec 128×128); tekstur 512×512 JPG (spec PNG).

### Belum diuji / tidak dapat diuji sekarang

- **Berkas aset 68 belum ada di repo GitHub**: dikirim sebagai ZIP karena alat `put_file` hanya menerima teks; harus di-commit dengan git.
- 40 aset intake pertama tidak diperiksa ulang pada sesi ini (tidak ada di sandbox).
- Pemeriksaan tepi dilakukan pada lembar kontak dan zoom 420 px; pemeriksaan pada ukuran penuh untuk setiap gambar belum dilakukan.
- Pemetaan beberapa hewan/kesehatan dari tampilan (mis. bunglon = hirba, anak memegang kepala = suda') adalah penilaian visual; guru perlu mengonfirmasi.
- **Akurasi transkripsi Arab dan harakat**: ditranskripsi manual dari scan; **belum diperiksa penutur/guru Bahasa Arab**. 47 entri bertanda `verify`.
- Seluruh fitur game, PWA, GitHub Pages, APK, performa, offline: **tidak ada kode, tidak diuji**.
- Perangkat target (HP, Xiaomi Pad 7 Pro, laptop, PC, monitor 30 inci): belum diuji.

### Bug diketahui

Tidak ada kode, jadi tidak ada bug perangkat lunak. Masalah materi tercatat di `MATERIAL_INDEX.md`.
