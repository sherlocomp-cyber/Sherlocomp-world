// Gambar hewan untuk pedestal Animal Kingdom (murni, tanpa Three.js; teruji di Node).
// Memakai ilustrasi orisinal di public/assets/images/animals/ (D-015). Pemetaan = public/assets/manifest.json.

export const ANIMAL_IMAGE = {
  'b2-v01': 'animal_arnab.webp',
  'b2-v02': 'animal_sulhafah.webp',
  'b2-v03': 'animal_fil.webp',
  'b2-v04': 'animal_zarafah.webp',
  'b2-v05': 'animal_tawus.webp',
  'b2-v06': 'animal_batta.webp',
  'b2-v07': 'animal_ghazal.webp',
  'b2-v08': 'animal_hisan.webp',
  'b2-v09': 'animal_jamal.webp',
  'b2-v10': 'animal_dubb.webp',
  'b2-v11': 'animal_asad.webp',
  'b2-v12': 'animal_dzib.webp',
  'b2-v13': 'animal_karkadann.webp',
  'b2-v14': 'animal_hirba.webp',
  'b2-v15': 'animal_qird.webp',
  'b2-v16': 'animal_tuban.webp',
  'b2-v17': 'animal_namir.webp',
  'b2-v18': 'animal_timsah.webp',
  'b2-v19': 'animal_baqarah.webp',
  'b2-v20': 'animal_hamamah.webp',
  'b2-v21': 'animal_samak.webp',
  'b2-x01': 'animal_namlah.webp',
  'b2-x02': 'animal_dajajah.webp',
};

/** Tinggi gambar di dunia (satuan). Perkiraan agar hewan besar terlihat besar; boleh disetel setelah dilihat. */
export const ANIMAL_SIZE = {
  default: 1.9,
  'b2-v04': 3.2, // jerapah
  'b2-v03': 2.6, // gajah
  'b2-v09': 2.6, // unta
  'b2-v13': 2.2, // badak
  'b2-v08': 2.3, // kuda
  'b2-v19': 2.2, // sapi
  'b2-v11': 2.0, // singa
  'b2-v18': 2.0, // buaya
  'b2-v01': 1.3, // kelinci
  'b2-v02': 1.3, // kura-kura
  'b2-v06': 1.3, // bebek
  'b2-v14': 1.2, // bunglon
  'b2-v16': 1.3, // ular
  'b2-v20': 1.2, // merpati
  'b2-v21': 1.3, // ikan
  'b2-x02': 1.3, // ayam
  'b2-x01': 0.9, // semut
};

export const ANIMAL_PEDESTAL_TOP = 0.36;

export function animalImageFile(vocabId) {
  return ANIMAL_IMAGE[vocabId] || null;
}
export function animalSize(vocabId) {
  return ANIMAL_SIZE[vocabId] ?? ANIMAL_SIZE.default;
}
