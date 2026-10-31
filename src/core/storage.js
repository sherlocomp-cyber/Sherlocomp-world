// Penyimpanan sederhana PHASE 1 (LocalStorage dengan try/catch).
// Profil siswa/mastery penuh pindah ke IndexedDB di PHASE 6 (D-010).

const PREFIX = 'arabiaworld.v1.';

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false; // mode privat / kuota penuh: game tetap jalan tanpa simpan
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* abaikan */
  }
}
