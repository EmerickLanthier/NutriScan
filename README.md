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

## 📁 Structure du projet finale

### backend

```
NutriScanAPI/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── productController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── History.js
│   │   ├── Product.js
│   │   ├── Recipe.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── product.routes.js
│   └── server.js
├── tests/
│   └── README.md
├── .env
├── .gitignore
├── package.json
└── package-lock.json
```

### frontend

```
NutriScanApp/
├── .expo/
├── .vscode/
├── app/
│   ├── (auth)/
│   │   ├── connexion.tsx
│   │   ├── forgotPassword.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── account.tsx
│   │   ├── history.tsx
│   │   ├── index.tsx
│   │   └── scanner.tsx
│   ├── _layout.tsx
│   ├── edit-profile.tsx
│   ├── favorites.tsx
│   └── modal.tsx
├── assets/
│   ├── fonts/
│   │   └── icomoon.ttf
│   ├── images/
│   └── selection.json
├── components/
│   ├── ui/
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   ├── HealthWarning.tsx
│   ├── hello-wave.tsx
│   ├── NutriScoreBadge.tsx
│   ├── parallax-scroll-view.tsx
│   ├── ProductDetailModal.tsx
│   ├── RecipeCard.tsx
│   ├── RecipeStepModal.tsx
│   ├── themed-text.tsx
│   └── themed-view.tsx
├── constants/
│   └── theme.ts
├── hooks/
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
├── scripts/
│   └── reset-project.js
├── services/
│   ├── geminiRecipes.ts
│   ├── healthyAlternatives.ts
│   ├── history.ts
│   ├── openFoodFacts.ts
│   ├── productQuality.ts
│   └── recipeStorage.ts
├── .env
├── .env.example
├── .gitignore
├── app.json
├── eslint.config.js
├── expo-env.d.ts
├── package.json
├── package-lock.json
├── react-native.config.js
├── tsconfig.json
└── README.md
```
## ⚠️⚠️⚠️ Étapes d'installation
1. Configuration du Backend (NutriScanAPI)
Accédez au dossier de l'API :

Dans le terminal:
cd NutriScanAPI
Créez un fichier .env à la racine de ce dossier (Assurez-vous qu'il ne soit jamais commité sur GitHub).

Ajoutez les variables d'environnement suivantes dans le fichier .env :

Code snippet
PORT=5000
NODE_ENV=development
MONGODB_URI=<INSÉREZ_LA_CHAÎNE_DE_CONNEXION_FOURNIE_PAR_LE_COLLÈGUE>
(Note : L'URL de la base de données MongoDB vous sera fournie en privé par l'équipe).

Lancez le serveur localement :

Dans le terminal:
npm start

2. Configuration du Frontend (NutriScanApp)
Ouvrez un nouveau terminal et accédez au dossier de l'application :

Bash
cd NutriScanApp
Créez un fichier .env (vous pouvez vous baser sur le fichier .env.example).

Trouvez votre adresse IP locale (IPv4) :

Ouvrez l'invite de commande (Command Prompt) et tapez ipconfig.

Repérez la ligne IPv4 Address (ex: 192.168.10.190).

Ajoutez les variables suivantes dans votre fichier .env :

Code snippet
EXPO_PUBLIC_API_URL=http://<VOTRE_ADRESSE_IPV4_LOCALE>:5000/api
EXPO_PUBLIC_GEMINI_API_KEY=<LA_CLÉ_API_GEMINI>
⚠️ Important : N'oubliez pas d'ajouter /api à la fin de l'URL de votre API et assurez-vous de bien utiliser votre propre adresse IPv4.

Lancez l'application mobile :

Dans le terminal:
npx expo start -c


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




