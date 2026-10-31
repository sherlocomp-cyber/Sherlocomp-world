// Preset grafis. Aturan: gameplay TIDAK boleh berkurang di Low (PROJECT_SPEC bagian 7).
// Hanya tampilan yang berubah: resolusi render, bayangan, jarak pandang.

export const QUALITY_LEVELS = ['low', 'medium', 'high'];

export const QUALITY_LABELS = {
  low: 'Rendah',
  medium: 'Sedang',
  high: 'Tinggi',
};

export const QUALITY_PRESETS = {
  low: { maxPixelRatio: 1, shadows: false, shadowMapSize: 0, fogFar: 70, clouds: false },
  medium: { maxPixelRatio: 1.5, shadows: true, shadowMapSize: 1024, fogFar: 95, clouds: true },
  high: { maxPixelRatio: 2, shadows: true, shadowMapSize: 2048, fogFar: 130, clouds: true },
};

export function isValidQuality(q) {
  return QUALITY_LEVELS.includes(q);
}

export function pixelRatioFor(level, devicePixelRatio = 1) {
  const preset = QUALITY_PRESETS[level] || QUALITY_PRESETS.medium;
  return Math.max(1, Math.min(devicePixelRatio || 1, preset.maxPixelRatio));
}

// Tebakan awal; pengguna dapat mengubahnya kapan saja. Ukuran sebenarnya
// di Xiaomi Pad 7 Pro BELUM diukur (lihat TEST_REPORT.md).
export function detectDefaultQuality(env = {}) {
  const cores = env.hardwareConcurrency ?? 4;
  const memory = env.deviceMemory ?? 4;
  const touch = !!env.touch;
  if (cores <= 2 || memory <= 2) return 'low';
  if (touch) return 'medium';
  return cores >= 8 && memory >= 8 ? 'high' : 'medium';
}
