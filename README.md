# 🛠 toolsBase - Module d'outils de conversion

## 📌 À propos
`toolsBase` est un module indépendant qui fournit une collection d'outils de conversion et de traitement de fichiers. Il est conçu pour être autonome et facilement intégrable dans le projet principal `oToBase`.

## 🗂 Structure du projet
```
toolsBase/
│── index.html          → Interface principale des outils
│── assets/
│   ├── css/
│   │   ├── global.css      → Styles globaux
│   │   ├── components.css  → Composants réutilisables
│   │   ├── tools.css      → Styles spécifiques aux outils
│   ├── js/
│   │   ├── main.js        → Script principal
│   │   ├── tools/         → Scripts des outils
│   │   │   ├── pdf.js     → Logique conversion PDF
│   │   │   ├── video.js   → Logique conversion vidéo
│── tools/               → Pages des outils
│   ├── pdf/
│   │   ├── index.html     → Interface PDF
│   ├── video/
│   │   ├── index.html     → Interface vidéo
```

## 🚀 Plan de développement

### Phase 1 : Structure de base ⏳
- ✅ Création de la structure des dossiers
- ⏳ Développement de l'interface principale
- ⏳ Mise en place des styles de base
- ⏳ Configuration du routing

### Phase 2 : Outils PDF 🔄
- ⏳ Interface de conversion PDF
- ⏳ Logique de conversion
- ⏳ Tests et optimisation

### Phase 3 : Outils Vidéo 📹
- ⏳ Interface de conversion vidéo
- ⏳ Logique de conversion
- ⏳ Tests et optimisation

## 💻 Technologies utilisées
- HTML5 / CSS3
- JavaScript (Vanilla)
- API File System pour la gestion des fichiers
- WebAssembly pour les conversions (à implémenter)

## 🔧 Installation et test

1. Lancer le serveur de développement :
```bash
npm install -g serve
serve
```

2. Ouvrir dans le navigateur :
```
http://localhost:3000
```

## 🔄 Intégration avec oToBase

L'intégration avec oToBase se fera en :
1. Copiant le dossier `toolsBase` dans `oToBase/modules/tools`
2. Adaptant les chemins relatifs
3. Testant l'intégration via la navigation principale

## 📝 Convention de code
- BEM pour le nommage des classes CSS
- Modules JavaScript autonomes
- Documentation JSDoc pour les fonctions
- Tests unitaires pour chaque outil

## 🌟 Fonctionnalités prévues

### PDF
- Conversion vers différents formats
- Compression
- Fusion de documents
- Extraction de pages

### Vidéo
- Conversion de formats
- Compression
- Extraction audio
- Découpage/fusion

---

**Note :** Ce module est en développement actif. Suivez les phases de développement pour l'état d'avancement.
