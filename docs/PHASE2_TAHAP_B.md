# PHASE 2 — Tahap B: Sickness Kingdom "Kota Sehat" (tata letak, medan, dekor)

Status jujur: kode ditulis dan lolos uji Node (logika murni) + uji alur dengan TIRUAN Three.js di sandbox.
**BELUM dijalankan di WebGL/browser/perangkat nyata. FPS belum diukur. `npm run build` BELUM dijalankan untuk tahap ini.**
Syarat selesai PHASE 2 (FPS terukur di Xiaomi Pad 7 Pro) BELUM terpenuhi.

## Cara membuka
`npm run dev` lalu buka `/?world=sickness&debug=1`. Tanpa `?world=...` game PHASE 1 berjalan seperti semula;
`?world=animal` tetap membuka Animal Kingdom (tidak diubah).
Pojok HUD (debug) menampilkan: FPS · kualitas · draw call · ribuan segitiga.
Bintang tersimpan di kunci sendiri (`p2.sickness.stars`), terpisah dari Animal Kingdom.

## Isi dunia
Dunia radius 100, tanpa air. Hub "Gerbang Kota Sehat" (tugu dengan tanda tambah hijau + papan peta) + 5 wilayah
lewat jalan setapak rata. Satu pedestal per kosakata inti, gambar kosakata di atasnya (billboard):

| Wilayah | Letak | Kosakata (ID) | Landmark |
|---|---|---|---|
| Rumah Sakit | utara | rumah sakit (b3-v13), dokter (b3-v11), perawat (b3-v12) | gedung rumah sakit, tanda tambah hijau |
| Apotek | timur laut | apotek (b3-v14), resep (b3-v09), obat (b3-v10) | toko apotek, kanopi + tanda tambah hijau |
| Taman Kepala | barat laut | sakit kepala (b3-v02), sakit mata (b3-v08), sakit gigi (b3-v07) | menara jam |
| Taman Perut | barat daya | sakit perut (b3-v06), diare (b3-v01) | gazebo |
| Taman Flu dan Demam | tenggara | batuk (b3-v03), flu (b3-v04), demam (b3-v05) | rumah kaca |

Total 14 kosakata inti (semua `vocab` Bab 3), 5 bintang (satu per wilayah), 5 papan wilayah + 1 papan peta.
Dekor khas per wilayah: halaman + bangku + lampu (rumah sakit), kebun herbal + kotak tanaman (apotek), pohon rindang +
batu (taman kepala), bunga hangat + bangku (taman perut), rumput tinggi + bunga biru-putih (taman flu).
Pesan papan/pedestal memakai kata Indonesia dari `bab3-penyakit.json` (lewat ID, tidak disalin). Teks Arab belum ditampilkan (PHASE 3).
Langit dan kabut berwarna mint (`atmosphere` dari dunia) agar terasa berbeda dari Animal Kingdom.

## Draf untuk DECISIONS.md (sudah dimasukkan sebagai D-037 s/d D-041)
- **D-037** Sickness Kingdom opt-in lewat `?world=sickness`; `worldId` `'sickness'` di `Game`; atmosfer sendiri.
- **D-038 (USULAN)** Pengelompokan 14 kosakata ke 5 wilayah = rancangan game, bukan isi buku. Perlu persetujuan guru/pengguna.
- **D-039** Perkakas render bersama `world-kit.js`; `animal-kingdom.js` TIDAK diubah.
- **D-040** Tanda medis memakai tanda tambah HIJAU (D-014). `health_wasfa` dipakai sementara walau memuat simbol merah.
- **D-041** Hanya teks Indonesia di dunia ini; teks Arab/harakat menunggu PHASE 3 (sejalan D-030).

## Draf untuk TEST_REPORT.md (Sesi 6)
Uji Node `npm run test:phase2b`: 19/19 lulus di sandbox. Di sandbox, `config.js`, `bab3-penyakit.json`, `manifest.json`,
dan 14 berkas gambar adalah SALINAN MINIMAL (berkas gambar kosong); jalankan ulang di repo asli.
Uji negatif di sandbox (data sengaja dirusak, uji harus gagal): lingkar tempat kata terlalu dekat landmark → gagal;
papan hub menempel jalan setapak → gagal; satu kosakata dihapus dari wilayah → gagal (2 uji).
Uji alur dengan TIRUAN Three.js (bukan three asli, bukan WebGL): `buildSicknessKingdom()` menghasilkan 5 bintang,
20 objek interaktif, 14 sprite kosakata, 6 grup (tugu + 5 landmark), 14 InstancedMesh (seluruh instance diberi matriks),
14 URL gambar unik yang cocok dengan berkas di `public/assets/images/health/`; `update()` 120 frame tanpa galat.
Pemeriksaan sintaks: `node --check` lolos untuk `world-kit.js` dan `sickness-kingdom.js`.
Perkiraan kasar (BELUM diukur): ±80 objek render (≈ draw call) tanpa bayangan; ±60–70 ribu segitiga (sebagian besar medan 128×128).

Uji manual yang harus dilakukan pengguna (hasil nyata, jangan dikarang):
1. `/?world=sickness&debug=1`: dunia termuat tanpa galat konsol; langit/kabut berwarna mint.
2. Jalan dari titik awal ke tiap 5 wilayah lewat jalan setapak; toast "Selamat datang di …" muncul.
3. Tidak tembus gedung (rumah sakit, apotek), menara jam, gazebo, rumah kaca, pohon, bangku.
4. 14 gambar kosakata muncul di atas pedestal; ukuran wajar; tidak ada gambar hilang.
5. 5 bintang bisa diambil dan tersimpan setelah muat ulang; Animal Kingdom tidak ikut berubah.
6. Papan/pedestal menampilkan kata Indonesia yang benar (mis. "Kata baru: sakit kepala").
7. Catat FPS + dc + tri di HP, Xiaomi Pad 7 Pro, laptop pada Low/Medium/High (diam di hub, di rumah sakit, di taman flu).
8. `npm run build` lalu jalankan; pastikan Animal Kingdom dan dunia PHASE 1 tetap berjalan (game.js diubah).

## Risiko dari tinjauan kode (belum terbukti)
- Kaca rumah kaca memakai material transparan; urutan render transparan + sprite bisa terlihat aneh dari sudut tertentu.
- Prisma atap rumah kaca diputar manual (`rotation.set(-π/2, 0, π/2)`); orientasi belum dilihat (seharusnya puncak ke atas).
- Landmark menghadap hub lewat `rotation.y = π/2 − sudut gerbang`; arah pintu belum dilihat.
- `health_wasfa` memuat lingkaran merah berpalang putih (bertentangan D-014); sebaiknya dibuat ulang di Flow.
- Gambar gedung (`health_mustashfa`, `health_saydaliya`) di atas pedestal berdampingan dengan gedung 3D: bisa terasa ganda.
- Tinggi sprite (`HEALTH_SIZE`) adalah perkiraan.
- Bayangan jauh dari pemain tidak ada (kamera bayangan ±26); awan instanced tidak di-culling; tepi dunia menanjak 8 satuan (kamera bisa menembus bukit) — sama seperti Animal Kingdom.
- Materi: entri `verify` di Bab 3 (mis. dokter b3-v11 dan perawat b3-v12) belum diverifikasi guru (D-020); dunia ini hanya memakai kata Indonesia dari `id_text`.

## Rapi-rapi untuk nanti
`world-kit.js` menduplikasi fungsi di `animal-kingdom.js` (lambert, instanced, starShape, buildClouds). Satukan setelah kedua dunia
terbukti jalan di perangkat; `animal-kingdom.js` sengaja tidak disentuh sekarang.
