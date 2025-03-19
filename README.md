# oToBase - Plateforme de Conversion et Traitement de Fichiers

## Description
oToBase est une plateforme web moderne conçue pour simplifier la conversion et le traitement de divers types de fichiers. Elle offre une interface utilisateur intuitive et des outils puissants pour la manipulation de fichiers multimédias et documents.

## Architecture

### Frontend
- Interface utilisateur responsive avec design moderne
- Technologies : HTML5, CSS3, JavaScript (Vanilla)
- Architecture modulaire pour une maintenance facilitée
- Thème sombre/clair adaptatif

### Backend
- Serveur Flask (Python)
- API RESTful pour la communication client-serveur
- Système de gestion de fichiers temporaires
- Intégration avec des outils de conversion (FFmpeg, etc.)

### Modules

#### 1. TOOLS (Outils de conversion) [En cours]
- [x] Interface de base
- [x] Navigation responsive
- [x] Système de thème sombre/clair

##### 1.1 Convertisseur Vidéo [En cours]
- [x] Interface de glisser-déposer
- [x] Prévisualisation vidéo
- [x] Options de conversion basiques
- [x] Préréglages pour réseaux sociaux
- [ ] Conversion batch
- [ ] Compression intelligente
- [ ] Extraction audio

##### 1.2 Convertisseur PDF [Planifié]
- [ ] Fusion de PDF
- [ ] Compression PDF
- [ ] Conversion vers d'autres formats
- [ ] OCR (Reconnaissance de texte)

#### 2. AGENT (Assistant de traitement) [Planifié]
- [ ] Interface conversationnelle
- [ ] Traitement automatisé
- [ ] Suggestions intelligentes
- [ ] Historique des opérations

#### 3. AGENT IA (Intelligence Artificielle) [Planifié]
- [ ] Analyse de contenu
- [ ] Optimisation automatique
- [ ] Recommandations personnalisées
- [ ] Apprentissage des préférences

## Modifications récentes (19/03/2024)

### Ajout de l'outil de conversion vidéo

#### Fonctionnalités ajoutées
- Interface de glisser-déposer pour le téléversement de vidéos
- Prévisualisation des vidéos téléversées
- Options de conversion pour différentes plateformes (Instagram, TikTok, YouTube)
- Gestion des formats de sortie et de la qualité
- Système de post-its pour afficher les vidéos et leurs informations

#### Problèmes rencontrés
1. **Téléversement de fichiers**
   - Erreur 501 (Unsupported method 'POST') sur la route `/upload`
   - Problèmes avec la bibliothèque ffmpeg pour l'extraction des métadonnées
   - Conflits entre différentes versions de ffmpeg-python

2. **Conversion vidéo**
   - Difficultés avec les préréglages pour les différentes plateformes
   - Problèmes de gestion des ratios d'aspect
   - Son manquant dans certaines conversions

3. **Interface utilisateur**
   - Problèmes de rafraîchissement après le téléversement
   - Gestion des états de chargement à améliorer
   - Affichage des erreurs à rendre plus explicite

#### Points à améliorer
1. **Backend**
   - Revoir la gestion des routes Flask pour le téléversement
   - Optimiser la configuration de ffmpeg
   - Améliorer la gestion des erreurs et le logging
   - Nettoyer les fichiers temporaires

2. **Frontend**
   - Améliorer la réactivité de l'interface
   - Ajouter des animations de chargement
   - Rendre l'interface plus intuitive
   - Ajouter des tooltips d'aide

3. **Sécurité**
   - Valider les types de fichiers côté serveur
   - Limiter la taille des fichiers
   - Nettoyer les fichiers temporaires
   - Ajouter des tokens CSRF

## Installation

1. Cloner le dépôt :
```bash
git clone [url-du-repo]
cd oToBase
```

2. Créer un environnement virtuel :
```bash
python3 -m venv venv
source venv/bin/activate
```

3. Installer les dépendances :
```bash
pip install flask flask-cors ffmpeg-python
```

4. Installer ffmpeg :
```bash
# Sur macOS avec Homebrew
brew install ffmpeg

# Sur Ubuntu/Debian
sudo apt-get install ffmpeg
```

5. Lancer le serveur :
```bash
python server.py
```

## Structure du projet
```
oToBase/
├── server.py              # Serveur Flask
├── assets/
│   ├── css/              # Fichiers CSS
│   │   ├── global.css
│   │   ├── navbar.css
│   │   └── video-tool.css
│   └── js/               # Fichiers JavaScript
│       ├── main.js
│       └── video-tool.js
├── modules/              # Modules de l'application
│   └── tools/
│       └── video/       # Outil de conversion vidéo
├── temp/                # Fichiers temporaires
│   ├── uploads/        # Vidéos téléversées
│   └── output/         # Vidéos converties
└── README.md
```

## Prochaines étapes
1. Corriger les problèmes de téléversement
2. Améliorer la gestion des erreurs
3. Optimiser les préréglages de conversion
4. Ajouter des tests unitaires
5. Documenter l'API
6. Ajouter des fonctionnalités de traitement par lots

## Utilisation
1. Accéder à l'application via `http://localhost:8000`
2. Naviguer vers le module souhaité
3. Suivre les instructions à l'écran pour la conversion/le traitement

## Roadmap

### Phase 1 - Foundation [En cours]
- [x] Setup du projet
- [x] Interface de base
- [x] Navigation responsive
- [x] Système de thème

### Phase 2 - Module TOOLS [En cours]
- [x] Convertisseur vidéo basique
- [ ] Optimisation des conversions
- [ ] Module PDF
- [ ] Tests et optimisations

### Phase 3 - Module AGENT [Planifié]
- [ ] Interface de l'assistant
- [ ] Logique de traitement
- [ ] Automatisation des tâches

### Phase 4 - Module AGENT IA [Planifié]
- [ ] Intégration IA
- [ ] Analyse intelligente
- [ ] Optimisation automatique

### Phase 5 - Améliorations [Planifié]
- [ ] Optimisation des performances
- [ ] Amélioration UX/UI
- [ ] Documentation complète
- [ ] Tests de sécurité

## Contribution
Les contributions sont les bienvenues ! Voir le fichier CONTRIBUTING.md pour plus de détails.

## Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
