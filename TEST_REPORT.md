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

## Sesi 3 — PHASE 1 Foundation (2026-10-31)

**Ringkasan jujur:** kode PHASE 1 sudah ditulis, tetapi **belum pernah dijalankan di browser** oleh Claude. Alasan: di sandbox sesi ini registry npm dijawab **HTTP 403 oleh kebijakan egress** (`registry.npmjs.org`; percobaan pertama gagal `ENOTFOUND` karena daftar `no_proxy`, percobaan kedua lewat proxy sandbox ditolak 403). Karena itu `npm install`, `vite build`, dan `vite dev` **tidak pernah berjalan**. Claude tidak mencari jalan memutar. Tidak ada `package-lock.json`.

### Dijalankan dan lulus (Node, tanpa Three.js, tanpa browser)

`node tests/smoke.mjs` → **28/28 lulus**. Cakupan:

| Kelompok | Yang diperiksa |
|---|---|
| Sintaks | `node --check` pada seluruh `src/**/*.js`, `vite.config.js`, `tests/smoke.mjs` |
| Konsistensi impor | setiap impor relatif menunjuk file yang ada; setiap paket yang diimpor terdaftar di `package.json`; `three` dipin persis |
| HTML ↔ JS | semua `$('id')` di `main.js`/`ui.js` ada di `index.html`; kesepuluh id kontrol/HUD ada; kelima layar ada |
| Aset | semua `/assets/...` di `index.html` dan `styles.css` ada di `public/`; `PRELOAD_IMAGES` ada di disk dan di `manifest.json` |
| Materi | dua JSON pelajaran valid dan ID kosakata unik (teks buku tidak disentuh) |
| Medan | titik awal, rumah, papan rata dan bukan air; kolam adalah air; tepi dunia menanjak; deterministik dan berhingga pada 1.681 titik |
| Tata letak | 5 bintang di darat, di dalam dunia, tidak di dalam penghalang; titik awal tidak menempel penghalang; kolam selaras dengan `terrain.POND` |
| Tabrakan | dorong keluar lingkaran; titik di pusat tidak NaN; dua rintangan berdekatan; batas dunia |
| Gerak/kamera | maju = −Z pada yaw 0; arah mengikuti yaw; arah kamera→target selalu = arah maju (5 sudut); `lerpAngle` jalur terpendek; joystick (zona mati, maju, batas 1); pitch dijepit |
| Grafis | tiga level, preset valid, `pixelRatioFor`, deteksi level awal |
| Konfigurasi | 6 warna baju valid dan unik |

**Uji negatif (membuktikan uji bisa gagal):** tiga perusakan sengaja, lalu dipulihkan → (1) id `btn-act` diganti di HTML: 2 uji gagal; (2) bintang dipindah ke kolam: 1 uji gagal; (3) salah ketik nama impor: 1 uji gagal. Setelah pemulihan 28/28 lulus.

Pemeriksaan lain yang dijalankan:
- `git ls-files | grep -c '^public/assets/images/'` = **108** (menutup tugas verifikasi jumlah aset).
- `develop` di-fast-forward ke `main` (50bcc7f); riwayat bersih, tanpa konflik.
- Potret `hero_boy_portrait` dan `hero_girl_portrait` dilihat langsung untuk menyesuaikan model prosedural.

### TIDAK diuji (belum ada bukti — jangan dianggap jalan)

- `npm install`, `npm run dev`, `npm run build`, `npm run preview`.
- Render WebGL apa pun: apakah scene tampil, apakah pencahayaan terlalu terang/gelap (intensitas diperkirakan, bukan diukur), apakah warna vertex medan benar, apakah daun palem mengarah keluar, apakah bayangan benar.
- Sentuh: joystick, tombol, geser kamera, mencegah zoom/gulir di Android.
- FPS di perangkat mana pun (HP, Xiaomi Pad 7 Pro, laptop, PC). Anggaran poligon belum ditetapkan.
- Sub-path GitHub Pages dan WebView Capacitor.
- Perilaku `ResizeObserver`, layar penuh, auto-jeda saat tab disembunyikan.
- Penyimpanan LocalStorage (profil, pengaturan, bintang) di browser nyata.
- Kemampuan `three` 0.187.0 (API yang dipakai ditulis dari pengetahuan sebelum rilis itu; `three` tidak terpasang sehingga tidak ada pemeriksaan impor/API).

### Tabel uji manual untuk pengguna (isi kolom "Hasil")

Perintah (Node 20+; sandbox Claude memakai Node 22): `git pull origin develop`, `npm install`, `npm run test:smoke`, `npm run dev` lalu buka `http://localhost:5173/?debug=1` (`?debug=1` menampilkan FPS dan level grafis). Di HP/tablet satu Wi-Fi: alamat `http://<IP-komputer>:5173/?debug=1`.

| # | Uji | Hasil yang diharapkan | Hasil |
|---|---|---|---|
| 1 | `npm install` | selesai tanpa galat; muncul `package-lock.json` (commit file ini) | BELUM DIUJI |
| 2 | `npm run test:smoke` | 28/28 lulus | BELUM DIUJI |
| 3 | `npm run dev`, buka halaman | bilah memuat sampai 100%, lalu menu berlatar hutan dengan logo | BELUM DIUJI |
| 4 | Buat karakter: perempuan → nama → warna → Mulai | masuk game; HUD menampilkan nama dan 0/5 | BELUM DIUJI |
| 5 | Tampilan dunia | langit biru, rumput, pohon, kolam, rumah; **tidak** layar hitam/putih; pencahayaan wajar | BELUM DIUJI |
| 6 | Gerak WASD / joystick | W = menjauhi kamera; A/D benar; karakter menghadap arah jalan | BELUM DIUJI |
| 7 | Putar kamera (geser mouse/jari, panah) | geser ke kanan → pandangan ke kanan; tidak terbalik; tidak tembus tanah | BELUM DIUJI |
| 8 | Lompat (Spasi / tombol) | melompat ±1,6 m dan mendarat; tidak terbang | BELUM DIUJI |
| 9 | Lari (Shift / tombol Lari) | lebih cepat dari jalan | BELUM DIUJI |
| 10 | Tabrakan | tidak menembus pohon, batu, rumah, kolam, batas dunia | BELUM DIUJI |
| 11 | Interaksi | dekat papan muncul "E · Baca papan"; E menampilkan pesan; dekat rumah: "Ketuk pintu" | BELUM DIUJI |
| 12 | Bintang | 5 bintang berputar; terkumpul saat didekati; HUD naik; setelah muat ulang tetap terkumpul | BELUM DIUJI |
| 13 | Jeda (Esc / tombol) | menu jeda muncul, game berhenti; Esc/Lanjutkan melanjutkan | BELUM DIUJI |
| 14 | Grafis Rendah/Sedang/Tinggi (dari menu jeda) | berubah langsung: bayangan hanya di Sedang/Tinggi; gameplay sama | BELUM DIUJI |
| 15 | Kembali ke Menu → Lanjutkan | masuk lagi dengan karakter yang sama | BELUM DIUJI |
| 16 | HP/tablet: sentuh | joystick, tombol, geser kamera bekerja; layar tidak menggulir/memperbesar | BELUM DIUJI |
| 17 | FPS (`?debug=1`): catat per perangkat dan level | angka nyata; target awal ≥30 FPS di Xiaomi Pad 7 Pro (belum ditetapkan resmi) | BELUM DIUJI |
| 18 | `npm run build` lalu `npm run preview` | build sukses; game jalan dari `dist/` | BELUM DIUJI |
| 19 | Sub-path: salin `dist/` ke `…/Sherlocomp-world/` dan layani | game jalan di sub-path (aset tidak 404) | BELUM DIUJI |
| 20 | Layar penuh di monitor 30 inci | teks HUD dan menu terbaca dari belakang kelas | BELUM DIUJI |

### Bug / risiko diketahui (dari tinjauan kode, belum terbukti)

- Intensitas cahaya (`hemi 1.5`, `sun 2.0`) adalah perkiraan; mungkin terlalu terang atau gelap.
- `antialias` tidak berubah saat ganti level di tengah sesi (D-029).
- Kamera tidak menghindari pohon (bisa menembus dedaunan).
- Daun palem disusun dengan rotasi manual; orientasi belum dilihat.
- Versi `vite ^7` belum diverifikasi dan belum ada `package-lock.json` (D-026).

## Sesi 5 — PHASE 2 tahap A (2026-10-31)

Sandbox (repo asli, `develop` 4eb920c): `npm install` berhasil; `npm run test:smoke` 28/28; `npm run test:phase2` 17/17; `npm run build` berhasil (vite 7.3.7; bundel game 598 kB, 156 kB gzip). Ini uji Node/build, bukan uji WebGL.

Browser (pengguna): membuka `/?world=animal&debug=1`, dilaporkan "sudah bagus" (laporan lisan, tanpa rincian).

BELUM DIUJI / JANGAN DIKLAIM: FPS, draw call, segitiga di HP/Xiaomi Pad 7 Pro/laptop; sentuhan; penyimpanan bintang setelah muat ulang; pencahayaan; kamera menembus bukit di tepi dunia.

## Sesi 6 — PHASE 2 tahap B: Sickness Kingdom (2026-11-01)

Sandbox: `node tests/phase2b.mjs` 19/19 lulus. `config.js`, `bab3-penyakit.json`, `manifest.json` di sandbox adalah SALINAN MINIMAL dan 14 berkas gambar kosong; kode `sickness-*`, `terrain-sickness`, `world-kit` adalah salinan persis. Jalankan ulang di repo asli.
Uji negatif (data dirusak di salinan; uji harus gagal): lingkar tempat kata dekat landmark → gagal; papan hub di jalan setapak → gagal; satu kosakata hilang → gagal (2 uji). Semua tertangkap.
Uji alur dengan TIRUAN Three.js (bukan three asli, bukan WebGL): `buildSicknessKingdom()` → 5 bintang, 20 objek interaktif, 14 sprite, 6 grup, 14 InstancedMesh (semua instance bermatriks), 14 URL gambar unik cocok dengan berkas di repo, `update()` 120 frame tanpa galat. `node --check` lolos untuk `world-kit.js` dan `sickness-kingdom.js`.
Keterbatasan sesi: `npm install` three asli GAGAL di sandbox (registry npm tidak terjangkau: nama host tak ter-resolve). Salinan file PC → sandbox lewat alat bantu juga gagal; file disusun ulang lewat teks. `npm run build`, `test:smoke`, `test:phase2` TIDAK dijalankan sesudah `game.js`/`main.js` diubah.

BELUM DIUJI / JANGAN DIKLAIM: tampilan di browser (WebGL); API Three.js asli untuk geometri baru (prisma atap rumah kaca, ExtrudeGeometry bintang di dunia ini); FPS, draw call, segitiga di perangkat; sentuhan; penyimpanan bintang `p2.sickness.stars`; arah pintu landmark; pencahayaan; `npm run build`; regresi Animal Kingdom/PHASE 1 setelah `game.js` diubah.
Daftar uji manual: `docs/PHASE2_TAHAP_B.md`.

Browser (pengguna, 2026-11-01): membuka `/?world=sickness&debug=1` di Xiaomi Pad 7, dilaporkan "sudah aman" (laporan lisan, tanpa rincian). Tidak ada angka FPS, draw call, atau segitiga. Tidak dilaporkan: hasil `npm run build`/`test:smoke`/`test:phase2`, cek ulang `?world=animal` dan PHASE 1, penyimpanan bintang, sentuhan per fitur.
