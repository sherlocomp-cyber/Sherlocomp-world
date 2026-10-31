// Gambar kosakata untuk pedestal Sickness Kingdom (murni, tanpa Three.js; teruji di Node).
// Memakai ilustrasi orisinal di public/assets/images/health/ (D-015). Pemetaan = public/assets/manifest.json.
// CATATAN: health_wasfa dipakai sementara (manifest: mengandung lingkaran merah berpalang putih yang
// bertentangan dengan D-014; minta Flow menggantinya dengan tanda tambah HIJAU).

export const HEALTH_IMAGE = {
  'b3-v01': 'health_ishal.webp',
  'b3-v02': 'health_suda.webp',
  'b3-v03': 'health_sual.webp',
  'b3-v04': 'health_zukam.webp',
  'b3-v05': 'health_humma.webp',
  'b3-v06': 'health_alam_maida.webp',
  'b3-v07': 'health_alam_asnan.webp',
  'b3-v08': 'health_iltihab_ainain.webp',
  'b3-v09': 'health_wasfa.webp',
  'b3-v10': 'health_dawa.webp',
  'b3-v11': 'health_tabib.webp',
  'b3-v12': 'health_mumarrida.webp',
  'b3-v13': 'health_mustashfa.webp',
  'b3-v14': 'health_saydaliya.webp',
};

/** Tinggi gambar di dunia (satuan). Perkiraan; boleh disetel setelah dilihat di layar. */
export const HEALTH_SIZE = {
  default: 1.9,
  'b3-v13': 3.0, // rumah sakit
  'b3-v14': 2.6, // apotek
  'b3-v11': 2.2, // dokter
  'b3-v12': 2.2, // perawat
  'b3-v09': 1.3, // resep
  'b3-v10': 1.2, // obat
};

export const HEALTH_PEDESTAL_TOP = 0.36;

export function healthImageFile(vocabId) {
  return HEALTH_IMAGE[vocabId] || null;
}
export function healthSize(vocabId) {
  return HEALTH_SIZE[vocabId] ?? HEALTH_SIZE.default;
}
