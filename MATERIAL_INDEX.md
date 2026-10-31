# MATERIAL_INDEX — Indeks Materi Buku

Sumber: *Semangat Belajar Bahasa Arab untuk MI Kelas III*. Database: `src/data/lessons/bab2-hewan.json`, `src/data/lessons/bab3-penyakit.json`.

**Cara pembacaan:** halaman PDF (scan foto) dibaca langsung sebagai gambar dan ditranskripsi manual, bukan lewat OCR. Karena itu harakat dan beberapa ejaan perlu diverifikasi guru. Tidak ada klaim bahwa transkripsi sudah diperiksa penutur asli.

## 1. Cakupan halaman

| Berkas PDF | Halaman ada | Halaman hilang / tidak ada |
|---|---|---|
| Bab 2 (16 hlm) | 30–42, 45–47 | **43–44** (teks qira'ah + soal 1–2) dan halaman pembuka bab (tujuan pembelajaran) |
| Bab 3 (19 hlm) | 55–73 | Kemungkinan hlm 74+ (latihan التراكيب B hanya sampai soal 2) |

## 2. Isi per bab

| Komponen | Bab 2 | Bab 3 |
|---|---|---|
| Kosakata inti (ber-gambar) | 21 (`b2-v01`–`v21`) | 14 (`b3-v01`–`v14`) |
| Kosakata tambahan | 2 (`b2-x01`–`x02`: semut, ayam) | — |
| Kata pendukung | 15 (`b2-w*`) | 22 (`b3-w*`) |
| Kata tunjuk | 4 (`b2-g*`) + tabel | — |
| Kalimat "dengar & ikuti" | 10 (`b2-sn*`) | 12 (`b3-sn*`) |
| Dialog | 1 (13 baris: Usman & Salma) | 2 (19 baris kelas; 8 baris dokter/apotek) |
| Teks bacaan (qira'ah) | **hilang (hlm 43–44)** | 1 (8 baris, `b3-rd01`) |
| Imla | — | 3 kalimat (`b3-ex06`) |
| Pola kalimat | 8 (`b2-p*`) | 5 kelompok (`b3-p*`) |
| Tata bahasa | isim alam, dhamir muttashil | isim alam; dhamir merujuk Bab 2 |
| Latihan | 6 (`b2-ex*`) | 9 (`b3-ex*`) |

## 3. Daftar kosakata inti

**Bab 2 — hewan:** أَرْنَبٌ kelinci · سُلَحْفَاةٌ kura-kura · فِيلٌ gajah · زَرَافَةٌ jerapah · طَاوُوسٌ merak · بَطَّةٌ bebek · غَزَالٌ rusa · حِصَانٌ kuda · جَمَلٌ unta · دُبٌّ beruang · أَسَدٌ singa · ذِئْبٌ serigala · كَرْكَدَنٌّ badak · حِرْبَاءُ bunglon · قِرْدٌ monyet · ثُعْبَانٌ ular · نَمِرٌ harimau · تِمْسَاحٌ buaya · بَقَرَةٌ sapi · حَمَامَةٌ merpati · سَمَكٌ ikan.

**Bab 3 — penyakit dan kesehatan:** إِسْهَالٌ diare · صُدَاعٌ sakit kepala · سُعَالٌ batuk · زُكَامٌ flu · حُمَّى demam · أَلَمٌ فِي الْمَعِدَةِ sakit perut · أَلَمُ الْأَسْنَانِ sakit gigi · الْتِهَابُ الْعَيْنَيْنِ sakit mata · وَصْفَةٌ resep · دَوَاءٌ obat · طَبِيبٌ dokter · مُمَرِّضَةٌ perawat · مُسْتَشْفَى rumah sakit · صَيْدَلِيَّةٌ apotek.

## 4. Sumber arti (label `meaning_source`)

| Label | Arti | Bab 2 inti | Bab 3 inti |
|---|---|---|---|
| `book_text` | Kata Indonesia tertulis di buku (kalimat contoh, soal pasangkan, tabel) | 14 | 13 |
| `book_picture` | Hanya gambar + label Arab; arti Indonesia tidak tertulis | 7 (jerapah, merak, kuda, serigala, badak, monyet, ikan) | 1 (perawat) |
| `general_knowledge` | Tidak ada di buku (kata pendukung, semut) | — | — |

Seluruh kata pendukung `general_knowledge` (Bab 2: 7, Bab 3: 22) dan `book_picture` **wajib dikonfirmasi guru** sebelum dipakai di game. Terjemahan dialog di JSON berstatus `draft_unverified` karena buku tidak menyertakan terjemah dialog.

## 5. Jawaban latihan

Buku **tidak memuat kunci jawaban**. Semua jawaban di JSON berlabel `*_derived` (diturunkan dari dialog, teks bacaan, atau pasangan gambar-label) dan **bukan kunci resmi**. Dua soal tidak punya jawaban yang dapat diturunkan: `b2-ex06` no. 4 (`answer: null`) dan naskah audio soal "Dengarkan" (`b2-ex01`, `b3-ex01`).

## 6. Audio

Buku memakai **QR code** untuk audio ("Dengarkan dan tirukan", "Dengarkan"); audio **tidak ada di PDF**. Sumber audio harus disediakan (lihat TASKS.md, pertanyaan T-02).

## 7. Entri bertanda `verify` (47)

Bab 2: 18 entri, antara lain `b2-v14` (harakat akhir حِرْبَاءُ), `b2-x01` (semut), kata pendukung `b2-w05–w08, w13, w15`, baris dialog 1/12/13, ejaan مِصْرُ dan سُورَابَايَا, urutan huruf soal susun `b2-ex05`, urutan gambar `b2-ex01` no. 2–5 (halaman 38 terscan terbalik).

Bab 3: 29 entri, antara lain `b3-v11` (طَبِيبٌ vs طَبِيبَةٌ), `b3-v12` (arti perawat), 20 kata pendukung `b3-w*` bertanda verify, ejaan بَانْدُونْج dan السُّعُودُ الْعَرَبِيَّةُ, `b3-ex05`, dan إِلْيَاسُ pada soal bacaan no. 2.

Cara menemukan semuanya: cari `"verify": true` pada kedua JSON.

## 8. Ketidakkonsistenan yang ada di buku (dipertahankan, bukan dikoreksi)

- Penomoran gelembung dialog latihan Bab 2 hlm 39–40: nomor 3 muncul dua kali, nomor 6 tidak ada.
- كَرْكَدَنٌّ (daftar) vs كَرْكَدَنٌ (dialog baris 12).
- طَبِيبٌ (daftar, latihan) vs طَبِيبَةٌ (label gambar, soal susun huruf).
- اِلْتِهَابُ (daftar hlm 56) vs إِلْتِهَابُ (label hlm 57).
- Bab 2 menyebut حَمَامَةٌ "merpati"; judul tabel dhamir identik di Bab 2 dan Bab 3.

## 9. Konvensi ID

`b{bab}-v##` kosakata inti · `b2-x##` tambahan · `-w##` kata pendukung · `-g##` kata tunjuk · `-sn##` kalimat · `-p##` pola · `-dlg-X` dialog · `-rd##` bacaan · `-ex##` latihan. ID **tidak boleh diubah** setelah dipakai kode/aset; entri baru mendapat nomor baru.

## 10. Gambar buku

Gambar buku hanya referensi isi. Game memakai ilustrasi **orisinal** (Google Flow + prosedural). Jangan menyalin atau mengunggah gambar buku.
