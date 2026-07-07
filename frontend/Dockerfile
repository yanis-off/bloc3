# --- ÉTAPE 1 : Base commune pour installer les modules Node ---
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# --- ÉTAPE 2 : Environnement de DÉVELOPPEMENT LOCAL ---
FROM base AS development
COPY . .
EXPOSE 5173
# Lance le serveur Vite en mode exposé pour Docker
CMD ["npm", "run", "dev", "--", "--host"]

# --- ÉTAPE 3 : Compilation pour la PRODUCTION ---
FROM base AS builder
# Vite fige les variables VITE_* DANS le bundle au moment du build (pas au runtime).
# Railway doit donc passer VITE_API_URL comme build arg, pas comme simple env var de service.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
COPY . .
RUN npm run build

# --- ÉTAPE 4 : Serveur Nginx final pour distribuer le Front en PRODUCTION ---
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
# nginx:alpine substitue automatiquement les variables d'env (ex: ${PORT})
# dans les fichiers /etc/nginx/templates/*.template au démarrage du conteneur.
ENV PORT=80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]