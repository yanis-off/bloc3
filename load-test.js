import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';


const BASE_URL = 'https://backend-production-aa95.up.railway.app/api';

// --- Métriques personnalisées ---
const erreurs = new Rate('erreurs_http');
const dureeFilms = new Trend('duree_endpoint_films');
const dureeScreenings = new Trend('duree_endpoint_screenings');
const dureeCategories = new Trend('duree_endpoint_categories');

export const options = {
  // Montée en charge progressive (paliers)
  stages: [
    { duration: '30s', target: 10 },   // montée douce à 10 utilisateurs
    { duration: '1m',  target: 50 },   // montée à 50 utilisateurs
    { duration: '1m',  target: 100 },  // pic à 100 utilisateurs simultanés
    { duration: '30s', target: 0 },    // redescente
  ],

  // Seuils de réussite/échec (SLO)
  thresholds: {
    // 95 % des requêtes doivent répondre en moins de 800 ms
    http_req_duration: ['p(95)<800'],
    // Moins de 1 % d'erreurs tolérées
    erreurs_http: ['rate<0.01'],
    // Au moins 99 % des vérifications doivent passer
    checks: ['rate>0.99'],
  },
};

export default function () {
  // --- Scénario : parcours d'un visiteur consultant le catalogue ---

  // 1. Consultation de la liste des films (endpoint le plus sollicité)
  let res = http.get(`${BASE_URL}/films`);
  dureeFilms.add(res.timings.duration);
  const okFilms = check(res, {
    'films — statut 200': (r) => r.status === 200,
    'films — reponse non vide': (r) => r.body && r.body.length > 2,
  });
  erreurs.add(!okFilms);

  sleep(1); // temps de lecture simulé

  // 2. Consultation des séances
  res = http.get(`${BASE_URL}/screenings`);
  dureeScreenings.add(res.timings.duration);
  const okScreenings = check(res, {
    'screenings — statut 200': (r) => r.status === 200,
  });
  erreurs.add(!okScreenings);

  sleep(1);

  // 3. Consultation des catégories (filtre du catalogue)
  res = http.get(`${BASE_URL}/categories`);
  dureeCategories.add(res.timings.duration);
  const okCategories = check(res, {
    'categories — statut 200': (r) => r.status === 200,
  });
  erreurs.add(!okCategories);

  sleep(1);
}