#!/bin/bash
set -e

# Railway (et tout PaaS) assigne un port dynamique via $PORT.
# En local (docker-compose), $PORT n'est pas défini -> on garde 80 par défaut,
# ce qui correspond au mapping "8000:80" du docker-compose.yml de dev.
PORT="${PORT:-80}"

sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

php artisan config:clear
php artisan migrate --force
php artisan storage:link --force 2>/dev/null || true

exec "$@"
