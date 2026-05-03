/**
 * Local history management for past assessments
 */
const STORAGE_KEY = 'triageai_history'

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function addHistoryEntry(entry) {
  const existing = getHistory()
  const newEntry = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...entry,
  }
  const updated = [newEntry, ...existing].slice(0, 50) // keep last 50
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return newEntry
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY)
}
