// Anggaran performa (USULAN D-033). Angka awal adalah TEBAKAN perencanaan, bukan hasil ukur;
// tetapkan ulang setelah FPS nyata diukur di Xiaomi Pad 7 Pro (`?debug=1`).
// Hitungan `calls` dan `triangles` diambil dari renderer.info.render per frame (termasuk lintasan bayangan).

export const PERF_BUDGET = {
  low: { drawCalls: 120, triangles: 90000 },
  medium: { drawCalls: 220, triangles: 160000 },
  high: { drawCalls: 300, triangles: 240000 },
};

export function checkBudget(info, quality) {
  const b = PERF_BUDGET[quality] || PERF_BUDGET.medium;
  const issues = [];
  if (info.calls > b.drawCalls) issues.push(`draw call ${info.calls} > ${b.drawCalls}`);
  if (info.triangles > b.triangles) issues.push(`segitiga ${info.triangles} > ${b.triangles}`);
  return { ok: issues.length === 0, issues, budget: b };
}
