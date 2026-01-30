# Gestion NutriScan
# NutriScan - Projet de fin de session

## 📖 Description

Nutriscan est une application mobile développé en React.js qui permet aux utilisateurs de scanner les codes-barres des produits alimentaires afin d'obtenir instantanément leur score nutritionnel et des informations détaillées pour faire des choix de consommation plus sains.
**NutriScan** Nutriscan est une application mobile développé en React.js qui permet aux utilisateurs de scanner les codes-barres des produits alimentaires afin d'obtenir instantanément leur score nutritionnel et des informations détaillées pour faire des choix de consommation plus sains.

### ✨ Fonctionnalités principales

-  **Scan de code-barres** : Utilisation de la caméra pour capturer le code QR des produits alimentaires 
-  **Affichage du Score Nutritionnel** : Présentation instantanée d'un score (type Nutri-Score ou système propriétaire) et des valeurs nutritionnelles clés (sucres, graisses, sel).
- 📖 **Fiche Produit Détaillée** : Récupération et affichage des informations complètes via l'API OpenFoodFacts (ingrédients, allergènes, additifs).

### ✨ Fonctionnalités secondaires

-  **Historique des scans** : Liste des produits récemment consultés pour un accès rapide.
-  **Suggestions d'alternatives** : Recommandation de produits similaires avec un meilleur score nutritionnel.
-  **Recommandations de recettes** : Recommandations de recettes saines avec le produit scanné
-  **Authentification** : Système de connexion pour les utilisateurs
-  **Automatisation** : Triggers MySQL (MongoDB) pour maintenir l'intégrité des données

---

## 📁 Structure du projet (Version 1.0, va changer avec le temps)

### frontend

```
nutriscan-frontend/
├── assets/
│   └── images, icônes, polices
├── src/
│   ├── components/
│   │   └── composants réutilisables 
│   ├── screens/
│   │   ├── ScanScreen/
│   │   ├── ProductScreen/
│   │   ├── AlternativesScreen/
│   │   └── SettingsScreen/
│   ├── navigation/
│   │   └── configuration des routes 
│   ├── services/
│   │   └── apiClient.ts          // appels vers le backend
│   ├── storage/
│   │   └── productCache.ts       // cache local
│   ├── models/
│   │   └── product.ts            // types / interfaces
│   ├── outils/
│   │   └── helpers 
│   ├── context/
│   │   └── état global 
│   ├── App.tsx
│   └── index.ts
├── tests/
│   └── tests UI / logique
├── package.json
└── fichiers de configuration
```

### backendà

```
nutriscan-backend/
├── src/
│   ├── routes/
│   │   └── product.routes.js     // /api/product/:barcode, /api/alternatives
│   ├── controllers/
│   │   └── product.controller.js 
│   ├── services/
│   │   └── off.service.js       
│   ├── middleware/
│   │   └── errorHandler.js       // gestion des erreurs
│   ├── utils/
│   │   └── mapper.js            
│   ├── config/
│   │   └── env.js                
│   └── server.js
├── tests/
│   └── tests d’API 
├── .env.example
├── package.json
└── README.md
```

## ⚙️ Règles de gestion

### Limite API: 
## Limites de fréquence (Rate limits) ##
Pour protéger notre infrastructure, nous appliquons des limites de fréquence sur l'API et le site web. Les limites suivantes s'appliquent :

100 requêtes/minute pour toutes les requêtes de lecture de produits (requêtes GET /api/v/product ou pages produits). Il n'y a pas de limite pour les requêtes d'écriture (ajout/modification) de produits.

10 requêtes/minute pour toutes les requêtes de recherche (requêtes GET /api/v/search ou GET /cgi/search.pl) ; ne l'utilisez pas pour une fonctionnalité de « recherche instantanée à la saisie » (search-as-you-type), vous seriez bloqué très rapidement.

2 requêtes/minute pour les requêtes par facettes (telles que /categories, /label/organic, /ingredient/salt/category/breads, ...).

### Limite de produits en favoris:
- 50 produits maximum 

---

## 🗄️ Base de données

### Tables principales
## Table : [Utilisateurs] ##
## Description ## : [Stocker les informations de chaque compte utilisateur qui va être créé]
| Colonne | Type | Contraintes | Descriptions |
| id	| UUID / INT | PRIMARY KEY  | Identifiant unique |
| username | VARCHAR(50) | NOT NULL | Nom de l’utilisateur
| email | VARCHAR(254) | NOT NULL |	Email de l’utilisateur
| password | VARCHAR(32) | NOT NULL | Mot de passe de l’utilisateur
| favori | ARRAY(50) | NULL | Code de chaque aliment ajouté au favorie
Index : - Index sur [username] : [Rendre les requêtes avec le username plus efficace]
Relations : - Juste une table

---

## 🔒 Sécurité

### Mesures implémentées

✅ **Requêtes préparées (PDO)** - Protection contre injections SQL  
✅ **Validation des données** - Côté serveur  
✅ **Contraintes d'intégrité** - Base de données  
✅ **Vérification des permissions** - Vérifier que l'utilisateur est authentifié

### Recommandations pour la production

- ⚠️ Implémenter des **mots de passe hashés** (password_hash)
- ⚠️ Activer **HTTPS obligatoire**
- ⚠️ Limiter les **tentatives de connexion** (5)
- ⚠️ Configurer des **sauvegardes automatiques**

---

## 🎨 Technologies utilisées

### Backend
- **Runtime/Framework** - Node.js + Express 
- **Base de données** - MongoDB
- **Authentification** - JWT = sécuritaire pour les données utilisateurs ; Lorsque 
on stocke des jetons (tokens) dans le localStorage ou le sessionStorage, ils persistent après les actualisations de page et les redémarrages du navigateur (pour le localStorage)

### Frontend
- **Framework** - React Native (IOS-Android)
- **UI Library** - React Native Paper (il fournit les UI composant nécessaire)
- **Autres librairies** - expo-barcode-scanner, expo-camera

---

## 📊 Fonctionnalités avancées 

### Filtrage 
- Filtrer l'historique selon le Nutriscore des produits - filtrage instantané

### Recherche 
- Recherche selon le nom du produit
- Trié en ordre croissant

### Communauté (WON'T; dans le futur loin si le temps)
- S’assurer de pouvoir mettre des likes sur le profil des autres utilisateurs
- S’assurer de pouvoir partager avec les autres
- S’assurer de pouvoir envoyer des messages a d’autre personne
- S’assurer de pouvoir faire des albums partagés

## 📝 Licence

Ce projet est un projet de fin de session.

---

## 📞 Contact

Projet développé par Madrid Boutin-Guénette, Emerick Lanthier, Youssef Nassit, Jacob Somphanthabansouk - NutriScan

---

**Version :** 1.0.0  
**Dernière mise à jour :** 2026
**Statut :** En production

---




