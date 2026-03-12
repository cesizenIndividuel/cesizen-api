# CESIZen API

Backend du projet **CESIZen**, développé dans le cadre du **projet individuel de 3ème année au CESI – Concepteur Développeur d’Applications**.

Cette API REST permet de gérer une plateforme de contenu orientée **bien-être et activité sportive**, incluant :

- authentification utilisateur
- gestion d’articles
- catégories
- commentaires
- favoris
- diagnostic utilisateur

---

# Technologies utilisées

Backend :

- **Node.js**
- **Express**
- **TypeScript**

Base de données :

- **PostgreSQL**
- **Prisma ORM**

Validation :

- **Zod**

Sécurité :

- **JWT**
- **bcrypt**

Conteneurisation :

- **Docker**

Documentation API :

- **Swagger**

---

# Architecture du projet

Le projet est organisé selon une **architecture en couches inspirée du modèle MVC**.


Principe :

- **routes** : définition des endpoints
- **services** : logique métier
- **validators** : validation des données avec Zod
- **utils** : fonctions utilitaires
- **types** : typage TypeScript

---

# Installation du projet

## 1.Cloner le projet 

```bash
git clone https://github.com/cesizenIndividuel/cesizen-api
cd cesizen-api
```
## 2. Prérequis

Installer :
- Node.js 18+
- Docker
- PostgreSQL

# Installation des dépendances
```bash
npm install
```

# Configuration 
Créer un fichier .env à la racine du projet 
**Exemple**
DATABASE_URL="postgresql://postgres:password@localhost:5432/cesizen"

JWT_SECRET="supersecret"
REFRESH_TOKEN_SECRET="refreshsecret"

PORT=3000

# Base de donnée
## Générer le client Prisma 
```bash
npx prisma generate
```
## Appliquer les migrations
```bash
npx prisma migrate dev
```

# Lancer le projet 
## Mode développement 
```bash
npm run dev
```
Le serveur démarre sur : http://localhost:3000

## Mode production 
```bash
npm run build
npm start
```

# Docker 
Le projet peut etre lancé avec Docker 
## Lancer les services
```bash
docker-compose up -d
```
Cela démarre : PostgreSQL et l'API

## Arreter les containers
```bash
docker-compose down
```
# Documentation API (swagger)
La documentation interactive de l’API est disponible via Swagger UI.

Une fois le serveur démarré, accéder à : http://localhost:3000/api-docs

# Les endpoints principaux 
## Authentification 
    POST /auth/register
    POST /auth/login
    POST /auth/logout
    POST /auth/refresh
## Articles
    GET /articles
    GET /articles/:slug
    POST /articles
    PATCH /articles/:id
    DELETE /articles/:id
## Catégories
    GET /categories
    POST /categories
    PATCH /categories/:id
    DELETE /categories/:id
## Commentaires
    POST /articles/:id/comments
    GET /articles/:id/comments
## Favoris
    POST /favorites/:articleId
    DELETE /favorites/:articleId 

