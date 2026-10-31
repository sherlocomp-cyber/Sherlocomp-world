# ASSET_REQUIREMENTS — Aset Visual dan Master Prompt Google Flow

Status: **USULAN, menunggu persetujuan pengguna.** Aset belum dibuat. Semua nama karakter, palet, dan arah seni di bawah adalah usulan Claude.

## 1. Prinsip

1. **Ilustrasi 2D** dibuat di Google Flow dalam **satu rangkaian produksi** (satu master prompt, urutan tetap) agar gaya konsisten.
2. **Model 3D dunia dan karakter dibuat prosedural low-poly di kode Three.js**, bukan dari Flow (Flow menghasilkan gambar/video, bukan model 3D). Lihat DECISIONS D-003. Ilustrasi Flow dipakai untuk kartu, potret, latar, tekstur, ikon, dan panel cerita.
3. **Tanpa teks apa pun di gambar:** tidak ada huruf Arab, Latin, angka, papan nama, atau label. Semua teks dirender oleh game agar akurat. Papan toko/rumah sakit memakai **simbol** (tanda tambah hijau), bukan tulisan dan bukan lambang Palang Merah/Bulan Sabit Merah.
4. **Tidak menyalin gambar buku** maupun gaya/karakter merek lain (Roblox, Pixar, dsb.). Semua karakter orisinal.
5. Pakaian karakter sopan; ramah anak; tidak menakutkan; ilustrasi penyakit ringan dan kartun (tidak grafis).
6. Karakter pemain berbaju **netral abu terang** agar dapat diwarnai di game (pilihan warna pakaian).

## 2. Arah seni **[USULAN]**

Low-poly ramah anak: bentuk membulat, bidang warna datar dengan gradasi lembut, pencahayaan hangat, siluet jelas terbaca dari jauh (layar 30 inci dari belakang kelas), garis tepi tipis opsional.

**Palet:**

| Nama | Hex | Pakai |
|---|---|---|
| Sunrise Orange | #FF8A3D | aksen, tombol utama |
| Sky Teal | #2EC4B6 | Sickness Kingdom, UI |
| Leaf Green | #6BCB77 | Animal Kingdom |
| Sand Gold | #FFD166 | hadiah, gold, XP |
| Royal Indigo | #3A3A8C | langit senja, teks kontras |
| Berry | #E84A5F | peringatan ringan, hati |
| Cream | #FFF7E6 | latar kartu |
| Ink | #1F2430 | kontur, teks |

Animal Kingdom dominan hijau/emas hangat; Sickness Kingdom dominan teal/mint/putih dengan aksen jingga hangat (tidak steril menakutkan).

## 3. Karakter **[USULAN]**

| Peran | Nama usulan | Deskripsi singkat |
|---|---|---|
| Pemain laki-laki | Faris | Anak ±9 th, rambut hitam pendek, tunik/rompi netral abu terang, ransel kecil |
| Pemain perempuan | Amira | Anak ±9 th, berhijab sederhana (netral abu terang), rok/gamis ringan, ransel kecil |
| Animal: penjaga | Pak Karim | Penjaga hutan ramah, topi lebar, rompi hijau |
| Animal: penjelajah | Kak Sara | Pemandu muda, kamera dan teropong |
| Animal: raja | Raja Asad | Singa besar bijak bermahkota emas, ramah (boss pembuka: ujian, bukan menakutkan) |
| Sickness: dokter | Dokter Hana | Dokter perempuan berhijab, jas putih, stetoskop |
| Sickness: perawat | Perawat Nur | Perawat perempuan berhijab, seragam mint |
| Sickness: apoteker | Apoteker Salim | Apoteker laki-laki, kacamata, jas putih |
| Sickness: guru | Bu Guru Aisyah | Guru berhijab, buku absen |
| Boss Sickness | Si Kuman Nakal | Kuman kartun lucu bertanduk kecil (jahil, bukan seram) |
| Pet | Kelinci, Merpati, Kura-kura | Pendamping kecil (kosakata Bab 2) |

## 4. Daftar aset lengkap

Format: PNG. "Potongan" = latar transparan (dihasilkan di Flow dengan latar magenta solid #FF00FF lalu dikeluarkan saat intake; magenta dipilih karena banyak hewan berwarna hijau). Folder dasar: `public/assets/images/`.

| # | Kelompok | File (pola) | Jumlah | Ukuran | Latar | Prioritas |
|---|---|---|---|---|---|---|
| 1 | Merek | `brand/logo_mark.png`, `brand/app_icon.png` (tanpa teks, full-bleed), `brand/splash_art.png`, `brand/menu_bg_animal.png`, `brand/menu_bg_sickness.png` | 5 | 1024², 1024², 1920×1080 ×3 | opaque | P0 |
| 2 | Karakter pemain | `characters/hero_boy_portrait.png`, `hero_girl_portrait.png` (1024²); `hero_boy_full.png`, `hero_girl_full.png` (1024×1536) | 4 | lihat kiri | potongan | P0 |
| 3 | Aksesori | `accessories/acc_{cap,glasses,backpack,scarf,crown,cape,headband,bowtie}.png` | 8 | 256² | potongan | P1 |
| 4 | Potret NPC | `npcs/npc_{ranger,explorer,lion_king,doctor,nurse,pharmacist,teacher,virus_boss}.png` | 8 | 1024² | potongan | P0 |
| 5 | Pet | `pets/pet_{rabbit,pigeon,turtle}.png` | 3 | 512² | potongan | P1 |
| 6 | Kartu hewan | `animals/animal_{slug}.png` | 23 | 768² | potongan | P1 |
| 7 | Kartu kesehatan | `health/health_{slug}.png` | 14 | 768² | potongan | P1 |
| 8 | Langit | `sky/sky_animal.png`, `sky/sky_sickness.png` (equirectangular, tanpa sambungan) | 2 | 2048×1024 | opaque | P1 |
| 9 | Tekstur mulus (seamless) | `textures/tex_{grass,dirt,sand,rock,water,wood,leaves,clinic_floor,wall_mint,roof_tile}.png` | 10 | 512² | opaque, tileable | P1 |
| 10 | Ikon UI | `ui/icon_{xp,gold,level,chest,key,quest,star,heart,hint,timer,map,pause,teacher,sound,lock}.png` | 15 | 128² | potongan | P1 |
| 11 | Lencana | `ui/badge_{animal_explorer,zoo_hero,listener,speaker,builder,doctor_helper,pharmacy_pro,perfect_streak,treasure_finder,kingdom_hero}.png` | 10 | 256² | potongan | P2 |
| 12 | Panel cerita | `story/story_01..06.png` | 6 | 1920×1080 | opaque | P2 |
| | **Total inti** | | **108** | | | |
| 13 | (Opsional) latar mini-game | `minigames/mg_{name}_bg.png` | 10 | 1920×1080 | opaque | P3 |

### Pemetaan slug ke ID kosakata (jangan diubah, dipakai manifest)

**Hewan (`animal_{slug}`):** arnab=b2-v01 · sulhafah=b2-v02 · fil=b2-v03 · zarafah=b2-v04 · tawus=b2-v05 · batta=b2-v06 · ghazal=b2-v07 · hisan=b2-v08 · jamal=b2-v09 · dubb=b2-v10 · asad=b2-v11 · dzib=b2-v12 · karkadann=b2-v13 · hirba=b2-v14 · qird=b2-v15 · tuban=b2-v16 · namir=b2-v17 · timsah=b2-v18 · baqarah=b2-v19 · hamamah=b2-v20 · samak=b2-v21 · namlah=b2-x01 · dajajah=b2-x02.

**Kesehatan (`health_{slug}`):** ishal=b3-v01 · suda=b3-v02 · sual=b3-v03 · zukam=b3-v04 · humma=b3-v05 · alam_maida=b3-v06 · alam_asnan=b3-v07 · iltihab_ainain=b3-v08 · wasfa=b3-v09 · dawa=b3-v10 · tabib=b3-v11 · mumarrida=b3-v12 · mustashfa=b3-v13 · saydaliya=b3-v14.

Gambar penyakit: anak kartun dengan ekspresi/gestur jelas (pegang kepala, pegang perut, bersin ke tisu, termometer di mulut, dsb.), tanpa darah atau hal grafis. Gambar tempat/benda (resep, obat, apotek, rumah sakit): objek sederhana, tanpa tulisan.

## 5. Proses intake setelah aset dikembalikan

Periksa semua aset → buat `public/assets/manifest.json` → tempatkan pada folder → optimalkan ukuran → keluarkan latar magenta dan periksa transparansi → periksa konsistensi karakter → pastikan nama file sesuai manifest. Aset yang sudah disetujui tidak diganti tanpa alasan. Catatan: jika Flow tidak dapat memberi hasil bergaya konsisten, hentikan dan laporkan; jangan lanjut membangun di atas aset yang tidak konsisten.

## 6. MASTER PROMPT GOOGLE FLOW (siap salin)

```
PROJECT: "Arabia World" — a children's educational 3D adventure game for 8-9 year olds (Indonesian Islamic primary school). You will produce ONE coordinated set of 2D illustrations in a single consistent style. Work through the batches in the order given and keep the same art style, palette, line weight, lighting and character designs across ALL images.

HARD RULES (apply to every image):
- ABSOLUTELY NO TEXT of any kind: no Arabic, no Latin letters, no numbers, no signs with writing, no labels, no logos, no watermarks. Shop/hospital signs use a plain GREEN PLUS SYMBOL only (never the Red Cross or Red Crescent emblem).
- Original designs only. Do not imitate Roblox, Pixar, Disney, textbook illustrations, or any existing character or brand.
- Child-friendly, cheerful, safe. Nothing scary, bloody, violent or graphic. Illness is shown mildly and cartoonishly (gestures and faces only).
- Modest, respectful clothing. Girls/women wear simple hijab; boys/men wear simple everyday clothing.
- Cutout items (marked CUTOUT): single subject, centered, full subject visible with margin, on a SOLID FLAT PURE MAGENTA background (#FF00FF), no shadow on the background, no gradient, no magenta inside the subject.

ART STYLE: friendly low-poly-inspired illustration with rounded shapes, flat color areas with soft gradients, warm soft lighting, thin dark outline (#1F2430) optional but consistent, strong readable silhouette (must read from far away on a classroom screen).

PALETTE (use these as the dominant colors): Sunrise Orange #FF8A3D, Sky Teal #2EC4B6, Leaf Green #6BCB77, Sand Gold #FFD166, Royal Indigo #3A3A8C, Berry #E84A5F, Cream #FFF7E6, Ink #1F2430. Animal Kingdom = warm greens and golds. Sickness Kingdom = teal, mint and white with warm orange accents (friendly, not sterile or scary).

CHARACTER BIBLE (keep identical across all images):
- FARIS: boy, about 9, short black hair, round friendly face, light-grey tunic and vest (neutral so it can be recolored), small backpack.
- AMIRA: girl, about 9, simple light-grey hijab and light-grey long-sleeve dress (neutral so it can be recolored), small backpack.
- PAK KARIM: friendly forest ranger, wide-brim hat, green vest, warm smile.
- KAK SARA: young explorer guide with binoculars and a camera.
- RAJA ASAD: big wise friendly lion wearing a small golden crown (kind, majestic, not scary).
- DOKTER HANA: woman doctor in simple hijab, white coat, stethoscope.
- PERAWAT NUR: woman nurse in simple hijab, mint uniform.
- APOTEKER SALIM: man pharmacist with glasses, white coat.
- BU GURU AISYAH: woman teacher in simple hijab holding an attendance book.
- SI KUMAN NAKAL: a cute cartoon germ monster with tiny horns, mischievous but funny, never scary.
- PETS: small cute rabbit, pigeon, turtle.

BATCH 1 (key art, opaque, 16:9 1920x1080 unless noted): 1 splash art — Faris and Amira at the gate of a mysterious glowing kingdom, two worlds visible behind (jungle kingdom and a mint-teal healing town); 2 menu background Animal Kingdom; 3 menu background Sickness Kingdom; 4 square 1024x1024 logo mark (a golden crown over a compass, no text); 5 square 1024x1024 app icon (same mark, full-bleed background, no text).
BATCH 2 (heroes, CUTOUT): Faris portrait 1024x1024; Amira portrait 1024x1024; Faris full body 1024x1536 standing, neutral pose; Amira full body 1024x1536.
BATCH 3 (NPC portraits, CUTOUT, 1024x1024): Pak Karim, Kak Sara, Raja Asad, Dokter Hana, Perawat Nur, Apoteker Salim, Bu Guru Aisyah, Si Kuman Nakal.
BATCH 4 (pets, CUTOUT, 512x512): rabbit, pigeon, turtle. Accessories (CUTOUT, 256x256): cap, round glasses, backpack, scarf, golden crown, cape, headband, bow tie.
BATCH 5 (animal cards, CUTOUT, 768x768, one animal each, friendly pose, cartoon, same style): rabbit, turtle, elephant, giraffe, peacock, duck, deer, horse, camel, bear, lion, wolf, rhinoceros, chameleon, monkey, snake (cute, non-threatening), tiger, crocodile (cute, closed mouth), cow, dove, fish (orange koi), ant, chicken.
BATCH 6 (health cards, CUTOUT, 768x768): a child with diarrhea (hurrying toward a plain toilet icon, mild cartoon); child holding head (headache); child coughing into fist; child sneezing into tissue (cold/flu); child in bed with thermometer and cool pack on forehead (fever); child holding stomach (stomach ache); child holding cheek (toothache); child rubbing red tired eyes (eye infection); a doctor's prescription paper with scribbles and NO readable text; a pile of colorful medicine pills and capsules; a woman doctor at a desk writing; a nurse standing beside a bed with an IV stand; a small friendly pharmacy shop with a green plus sign and NO text; a hospital building with a green plus sign and NO text.
BATCH 7 (environments, opaque): sky panorama 2048x1024 equirectangular for Animal Kingdom (golden-green morning, soft clouds, seamless left-right edges); sky panorama 2048x1024 for Sickness Kingdom (mint-teal morning, soft clouds, seamless edges); 10 SEAMLESS TILEABLE textures 512x512: grass, dirt path, sand, rock, shallow water, wood planks, leaf canopy, clinic floor tiles, mint painted wall, terracotta roof tiles.
BATCH 8 (UI icons, CUTOUT, 128x128, bold simple, same style): XP star burst, gold coin, level shield, treasure chest, key, quest marker (exclamation-free, a golden diamond), star, heart, lightbulb hint, stopwatch, map, pause, teacher hat, speaker, padlock.
BATCH 9 (badges, CUTOUT, 256x256, round medals with symbols, NO text): animal explorer (paw), zoo hero (gate), listener (ear), speaker (speech bubble), builder (blocks), doctor helper (stethoscope), pharmacy pro (pill bottle), perfect streak (flame), treasure finder (chest), kingdom hero (crown).
BATCH 10 (story panels, opaque, 1920x1080, six-panel story with NO text): 1 Faris and Amira find an old glowing map; 2 the map opens a portal; 3 they arrive at the jungle kingdom, animals are sleepy and silent; 4 Raja Asad greets them; 5 they travel to the mint-teal healing town where the townsfolk are sick; 6 Si Kuman Nakal laughs on a rooftop, the kingdom's words have been scattered.

OUTPUT: deliver every image as a separate PNG named exactly as in the file list of ASSET_REQUIREMENTS.md (e.g. animal_arnab.png). Keep character faces and outfits identical across batches. If any image would require text, leave that area blank.
```

## 7. Pekerjaan pengguna

Jalankan master prompt di Google Flow, unduh semua PNG dengan nama persis seperti tabel, lalu unggah ke sesi Claude berikutnya. Boleh dikirim bertahap per batch (Batch 1–3 dahulu sudah cukup untuk PHASE 1–3).
