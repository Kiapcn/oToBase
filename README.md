# oToBase - Documentation

## 📌 Structure du projet

```
oToBase/
│── index.html  → Page d'accueil
│── assets/
│   ├── css/
│   │   ├── global.css  → Styles globaux
│   │   ├── navbar.css  → Styles de la barre latérale
│   │   ├── tools.css  → Styles du module TOOLS
│   │   ├── agent.css  → Styles du module AGENT
│   ├── js/
│   │   ├── main.js  → Script principal
│   │   ├── tools.js  → Scripts spécifiques au module TOOLS
│   │   ├── agent.js  → Scripts spécifiques au module AGENT
│── modules/
│   ├── tools/
│   │   ├── index.html  → Page d'accueil du module TOOLS
│   │   ├── video-conversion.html  → Outil conversion vidéo
│   │   ├── pdf-conversion.html  → Outil conversion PDF
│   ├── agent/
│   │   ├── index.html  → Page d'accueil du module AGENT
│   ├── agent-ia/
│   │   ├── index.html  → Page d'accueil du module AGENT IA avancé
│── database/ (Stockage des utilisateurs, à implémenter plus tard)
│── api/ (Endpoints backend)
│── server.js (Backend si nécessaire)
│── README.md (Documentation)

```

## 🌟 Fonctionnalités de base

### **1. Page principale oToBase (`index.html`)**

- **Barre latérale fixe** : Navigation entre les modules
- **En-tête fixe** : Profil utilisateur + Accès connexion/inscription
- **Zone centrale** : Introduction et présentation de la plateforme

### **2. Page TOOLS (`tools/index.html`)**

- Liste des outils disponibles
- Animation au survol pour présentation
- Redirection vers la page spécifique d'un outil (ex: `pdf-conversion.html`)

### **3. Page AGENT (`agent/index.html`)**

- Interface simple permettant d'utiliser une IA open source

### **4. Page AGENT IA (`agent-ia/index.html`)**

- Interface plus avancée, permettant de configurer et chaîner plusieurs IA

### **5. Gestion des utilisateurs (intégration future)**

- Connexion pour accéder aux fonctionnalités avancées
- Système de rôles (Admin, Utilisateur, Invité)

---

## 🚀 Plan de développement

### **1. Création de la base oToBase** ✅

- ✅ Créer la structure des dossiers et fichiers
- ✅ Développer `index.html` avec navigation et mise en page de base
- ✅ Ajouter `global.css` et `navbar.css`
- ✅ Intégrer une barre latérale fixe

### **2. Intégration du module TOOLS**

- ☑️ Créer `tools/index.html`
- ☑️ Ajouter l'interface dynamique de présentation des outils
- ☑️ Créer une page par outil

### **3. Intégration des autres modules (AGENT, AGENT IA, etc.)**

- ☑️ Créer la structure propre à chaque module
- ☑️ Tester l'intégration avec oToBase

### **4. Connexion et gestion des utilisateurs (plus tard)**

- ☑️ Implémenter l'authentification
- ☑️ Créer la base de données utilisateurs

---

## 🌟 Instructions pour l'installation

1. **Cloner le projet :**
    
    ```bash
    git clone https://github.com/ton-compte/oToBase.git
    cd oToBase
    
    ```
    
2. **Lancer un serveur local (si besoin) :**
    
    ```bash
    npx serve  # Utilisation d'un serveur statique rapide
    
    ```
    

---

## 🌐 Roadmap future

- ✅ Ajout des modules (TOOLS, AGENT, etc.)
- ✅ Connexion et base de données
- ✅ Intégration API et backend

---

**💡 Conclusion :**
Cette structure garantit une intégration modulaire facile et évite tout conflit entre les modules.
Nous allons maintenant implémenter la base et tester l'ajout du premier module TOOLS.

prompt cursor 

🚀 **Développe la base du projet oToBase** en respectant la structure suivante :

- Une **page principale (`index.html`)** avec une **barre latérale fixe** pour la navigation.
- Un **header** en haut affichant le **profil utilisateur et les options de connexion**.
- Une **zone centrale** qui présente **l'introduction du site**.
- **Un dossier `assets/` contenant :**
    - `css/global.css` pour les **styles globaux**.
    - `css/navbar.css` pour la **barre de navigation**.
    - `js/main.js` pour **les interactions globales**.
- Un dossier `modules/` avec :
    - `tools/` contenant `index.html` (page de présentation des outils).
    - `agent/` contenant `index.html` (page de l'agent IA simple).
- **Chaque module doit être indépendant**, avec son propre fichier CSS et JS.

**💡 Spécifications techniques :**

- **Design épuré et sobre**, inspiré d'Apple, avec **nuances de gris (style pencil-paper)**.
- **Barre latérale fixe** sur la gauche avec liens vers `TOOLS`, `AGENT`, `AGENT IA`, `FORMATION`.
- **Page TOOLS (`tools/index.html`)** : Affiche **des cartes** avec les outils disponibles (ex. Conversion PDF, Conversion Vidéo).
- **Utilisation du flexbox/grid** pour une structure bien alignée.
- **Chaque page doit être bien structurée** avec **HTML sémantique et CSS propre**.

**🔹 Étapes de développement à suivre :**

1. **Créer la structure de dossiers et fichiers**.
2. **Développer `index.html` avec une mise en page de base**.
3. **Mettre en place la barre latérale et le header**.
4. **Créer `tools/index.html` avec une première liste d'outils (mockup).**
5. **Faire un test d'affichage et de navigation**.

**🎯 Objectif :**
Produire un **code clair, organisé et évolutif** qui permettra d'ajouter facilement de nouveaux modules (TOOLS, AGENT, etc.).

**❌ Éviter les conflits entre les modules.**

**✅ Vérifier que chaque module est bien isolé (styles CSS et scripts JS propres).**

🚀 **Commence le développement et génère le code !**

🚀 **Projet modulaire et évolutif** avec navigation fixe et intégration des modules TOOLS, AGENT et AGENT IA.

## 🎯 Dernières modifications (19/03/2024)

### **1. Mise en place de la structure de base**

- ✅ Création de la page d'accueil responsive
- ✅ Implémentation de la barre latérale fixe avec navigation
- ✅ Ajout du header avec boutons de connexion/inscription
- ✅ Design moderne avec cartes de fonctionnalités animées
- ✅ Styles CSS modulaires (global.css et navbar.css)
- ✅ Support mobile avec menu responsive

### **2. Fichiers créés/modifiés**

```
oToBase/
│── index.html  → Page d'accueil responsive
│── assets/
│   ├── css/
│   │   ├── global.css  → Styles globaux et cartes
│   │   ├── navbar.css  → Styles navigation et header
│   ├── js/
│   │   ├── main.js  → Gestion navigation et responsive
```

### **3. Design et fonctionnalités**

- Design épuré inspiré d'Apple avec nuances de gris
- Animations douces sur les cartes et interactions
- Navigation responsive avec support mobile
- Structure modulaire pour faciliter les futures extensions

### **4. Comment tester**

```bash
# Installation du serveur de développement
npm install -g serve

# Lancement du serveur
serve

# Accès au site
Ouvrir http://localhost:3000 dans le navigateur
```

---
