# PHASE 2 — Tahap A: Animal Kingdom (tata letak, medan, dekor, anggaran)

Status jujur: kode ditulis dan lolos uji Node (logika murni) + uji alur dengan tiruan Three.js di sandbox.
**BELUM dijalankan di WebGL/browser/perangkat nyata. FPS belum diukur.** Syarat selesai PHASE 2
(FPS terukur di Xiaomi Pad 7 Pro) BELUM terpenuhi.

## Cara membuka
`npm run dev` lalu buka `/?world=animal&debug=1`. Tanpa `?world=animal` game PHASE 1 berjalan seperti semula.
Pojok HUD (debug) menampilkan: FPS · kualitas · draw call · ribuan segitiga.

## Isi dunia
Dunia radius 100 (PHASE 1: 38). Hub "Gerbang Kerajaan" (tugu + papan peta) + 6 wilayah lewat jalan setapak rata:
Padang Savana (4 hewan), Hutan Rimba (5), Padang Peternakan (4 termasuk ayam b2-x02), Danau Biru (4),
Padang Pasir (3), Taman Burung (2) = 21 kosakata inti + 1 tambahan, masing-masing satu pedestal.
Per wilayah: landmark, papan, 1 bintang (total 6), dekor khas (akasia, hutan rapat, pagar+lumbung+jerami,
danau+alang-alang, kaktus+mesa, taman bunga+gazebo). Pedestal hanya penanda; hewan sungguhan = PHASE 3.
Pesan papan/pedestal memakai kata Indonesia dari `bab2-hewan.json` (lewat ID, tidak disalin).

## Draf untuk DECISIONS.md
- **D-032 (USULAN)** Pengelompokan 21 hewan ke 6 wilayah adalah rancangan game (habitat umum), bukan isi buku. Perlu persetujuan guru/pengguna.
- **D-033 (USULAN)** Anggaran awal `src/core/budget.js`: Low 120 dc / 90k tri, Medium 220 / 160k, High 300 / 240k. Angka TEBAKAN; tetapkan ulang setelah FPS nyata diukur.
- **D-034** Animal Kingdom opt-in lewat `?world=animal`; dunia PHASE 1 tidak diubah. Gunakan `worldId` di `Game`. Setelah FPS disetujui, jadikan default.
- **D-035** Logika tata letak/medan/dekor dipisah murni dari Three.js (lanjutan D-027): `animal-layout.js`, `terrain-animal.js`, `animal-plan.js`. Dekor dirender lewat InstancedMesh (≈18 draw instanced).
- **D-036** Jalan setapak rata (bobot ratakan di `terrain-animal.js`) dan dekor berkolisi dijaga ≥3,4 satuan dari garis tengah jalan; diuji otomatis.

## Draf untuk TEST_REPORT.md (Sesi 5)
Uji Node `npm run test:phase2`: 17/17 lulus di sandbox (config.js/collision.js/JSON di sandbox adalah salinan minimal; jalankan ulang di repo asli).
Uji alur dengan tiruan Three.js: 47 objek render (18 instanced, 870 instance), 202 collider, 29 interaktif, update 120 frame tanpa galat. Ini BUKAN uji WebGL.
Perkiraan kasar (belum diukur): ±65 draw call lintasan utama + bayangan; ±50 ribu segitiga.
Uji manual yang harus dilakukan pengguna (hasil nyata, jangan dikarang):
1. `/?world=animal&debug=1`: dunia termuat tanpa galat konsol.
2. Jalan dari spawn ke tiap 6 wilayah lewat jalan setapak; toast "Selamat datang di …" muncul.
3. Tidak bisa masuk air danau; tidak tembus pohon/pagar/lumbung.
4. 6 bintang bisa diambil dan tersimpan setelah muat ulang.
5. Catat FPS + dc + tri di HP, Xiaomi Pad 7 Pro, laptop pada Low/Medium/High (diam di hub, di hutan, di taman bunga).

## Risiko dari tinjauan kode (belum terbukti)
Pencahayaan/warna zona perkiraan; bayangan jauh dari pemain tidak ada (kamera bayangan ±26); awan instanced tidak di-culling;
impor JSON lewat Vite (diharapkan jalan); tepi dunia menanjak 8 satuan (kamera bisa menembus bukit).
