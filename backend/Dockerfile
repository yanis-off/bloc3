# --- ÉTAPE 1 : Base commune avec toutes les extensions PHP nécessaires ---
FROM php:8.3-apache AS base

# Installe les dépendances système nécessaires (y compris pour la gestion d'images et les fichiers zip)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql gd zip

# Active la réécriture d'URL Apache (indispensable pour les routes Laravel API)
RUN a2enmod rewrite

# Aligne le dossier racine d'Apache sur le dossier /public de Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Installe Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# --- ÉTAPE 2 : Configuration pour le LOGICIEL LOCAL (Développement) ---
FROM base AS development
# En dev, on laisse le code se synchroniser via les volumes du docker-compose
EXPOSE 80

# --- ÉTAPE 3 : Configuration pour la PRODUCTION ---
FROM base AS production
COPY . .
# Installe les dépendances sans les outils de dev et optimise l'autoloader
RUN composer install --no-dev --optimize-autoloader
# Donne les droits d'écriture à Apache sur le stockage Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
EXPOSE 80