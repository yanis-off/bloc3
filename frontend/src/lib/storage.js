// URL de base pour les fichiers stockés côté backend (affiches de films, etc.)
// Dérivée de VITE_API_URL (ex: https://api.monapp.com/api -> https://api.monapp.com/storage/)
// pour ne pas dupliquer une variable d'env en plus.
const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
export const STORAGE_URL = apiUrl.replace(/\/api\/?$/, '') + '/storage/'

/**
 * Résout l'URL d'une affiche de film.
 * - Si `poster` est déjà une URL complète (ex: https://picsum.photos/...), on la garde telle quelle.
 * - Si `poster` est un chemin relatif (ex: films/xxx.jpg, cas d'un vrai fichier uploadé),
 *   on la préfixe avec STORAGE_URL.
 */
export function resolvePosterUrl(poster) {
  if (!poster) return null
  if (/^https?:\/\//i.test(poster)) return poster
  return `${STORAGE_URL}${poster}`
}
