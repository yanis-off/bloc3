#!/bin/bash
set -e

# --- Correctif MPM (bug Railway déc. 2025) ---
# Railway réactive automatiquement des modules MPM concurrents APRÈS le build,
# ce qui fait planter Apache avec "AH00534: More than one MPM loaded".
# On nettoie donc au démarrage du conteneur (runtime), pas seulement au build :
# on ne garde que mpm_prefork (requis par mod_php).
a2dismod mpm_event mpm_worker 2>/dev/null || true
rm -f /etc/apache2/mods-enabled/mpm_event.* /etc/apache2/mods-enabled/mpm_worker.* 2>/dev/null || true
a2enmod mpm_prefork 2>/dev/null || true

# --- Port dynamique ---
# Railway (et tout PaaS) assigne un port via $PORT.
# En local (docker-compose), $PORT n'est pas défini -> 80 par défaut (mapping "8000:80").
PORT="${PORT:-80}"
sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

# --- Initialisation Laravel ---
php artisan config:clear
php artisan migrate --force
php artisan storage:link --force 2>/dev/null || true

exec "$@"
