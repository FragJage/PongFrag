# 🏓 Pong Frag - Jeu Pong en TypeScript avec Phaser

Un jeu Pong moderne développé avec **Phaser 3** et **TypeScript**, optimisé pour les smartphones avec une architecture modulaire complète.

## 🎮 Fonctionnalités

### 🎯 Gameplay
- ✅ **Physique réaliste** : Rebonds sur les murs avec effets de spin
- ✅ **IA intelligente** : Prédiction de trajectoire avec imprécision contrôlée
- ✅ **Système de vies** : 3 vies avec affichage visuel
- ✅ **Score progressif** : Points par rebond (1pt) et par but (20pts)
- ✅ **Accélération dynamique** : Vitesse augmente à chaque rebond
- ✅ **Game Over** interactif avec redémarrage

### 🎵 Système Audio Avancé
- ✅ **Musique de fond** : Ambiance constante (`music.mp3`)
- ✅ **Musique ingame** : Intensité qui accélère avec la balle (`ingame.mp3`)
- ✅ **Effets sonores** : Rebonds et collisions avec Web Audio API
- ✅ **Adaptation mobile** : Démarrage automatique ou au premier touch
- ✅ **Vitesse adaptive** : Playback rate de 0.7x à 1.5x selon la vitesse de balle

### 🎨 Interface & UX
- ✅ **Crédits défilants** : Texte jaune en rotation continue dans le terrain
- ✅ **Masquage intelligent** : Crédits visibles uniquement dans la zone de jeu
- ✅ **Contrôles tactiles** : Zone striée diagonale avec feedback visuel
- ✅ **Interface responsive** : Optimisé smartphone + tablette (960x540)

### 🏗️ Architecture Modulaire
- ✅ **Code TypeScript** : 7 fichiers modulaires bien structurés
- ✅ **Séparation des responsabilités** : Chaque système dans son propre fichier
- ✅ **Constants centralisées** : Configuration dans `constants.ts`
- ✅ **Interfaces typées** : Définitions dans `interfaces.ts`

## 🚀 Démarrage rapide

### Prérequis

- **Node.js** (version 16 ou supérieure)
- **npm** (inclus avec Node.js)

### Installation

1. **Cloner le projet** :
```bash
git clone <url-du-repo>
cd PongFrag
```

2. **Installer les dépendances** :
```bash
npm install
```

3. **Lancer le serveur de développement** :
```bash
npm run dev
```

4. **Ouvrir dans le navigateur** :
   - Local : http://localhost:3000
   - Mobile (réseau) : http://192.168.x.x:3000

## 🎯 Contrôles

### Tactile (Mobile/Tablette)
- **Zone tactile striée** : Bandes diagonales jaunes/noires à gauche
- **Glissement fluide** : Mouvement relatif avec sensibilité optimisée
- **Feedback visuel** : Rayures diagonales pour identifier la zone active
- **Auto-détection** : Bascule automatiquement entre clavier et tactile

### Général
- **Système de vies** : 3 vies représentées par des petites paddles vertes
- **Score dynamique** : 1 point par rebond + 20 points par but
- **Accélération progressive** : La balle accélère à chaque rebond (+40 px/s)
- **Vitesse maximale** : Limitée à 1000 px/s pour rester jouable
- **Game Over interactif** : Cliquer sur "GAME OVER" pour redémarrer

## 🎵 Système Audio

### Musiques
- **Musique de fond** (`music.mp3`) : Ambiance constante à 10% de volume
- **Musique ingame** (`ingame.mp3`) : S'accélère avec la balle (0.7x → 1.5x)
- **Transitions intelligentes** : Bascule automatique selon l'état du jeu

### Effets Sonores
- **Rebonds de balle** : Son synthétisé (220 Hz, 0.1s)
- **Collisions murs** : Son grave (110 Hz, 0.15s)
- **Web Audio API** : Sons générés en temps réel

## 📱 Support Mobile

Le jeu est optimisé pour les smartphones :
- **Format 16:9** adaptatif
- **Message d'orientation** en mode portrait
- **Mise à l'échelle automatique** selon la taille d'écran
- **URL réseau** pour tester sur mobile via WiFi

## 🛠️ Structure du projet

```
PongFrag/
├── src/
│   ├── main.ts              # Point d'entrée Phaser
│   ├── constants.ts         # Configuration et constantes du jeu
│   ├── interfaces.ts        # Définitions TypeScript
│   ├── AudioSystem.ts       # Gestion audio complète
│   ├── TouchControlSystem.ts # Contrôles tactiles avec rayures
│   ├── Ball.ts              # Physique et comportement de la balle
│   └── GameScene.ts         # Scène principale et orchestration
├── public/
│   └── assets/
│       └── musics/          # Fichiers audio (music.mp3, ingame.mp3)
├── index.html               # Page HTML principale
├── package.json             # Dépendances et scripts
├── tsconfig.json            # Configuration TypeScript
├── vite.config.ts           # Configuration Vite
└── README.md               # Ce fichier
```

## 🔧 Scripts disponibles

```bash
# Développement (avec hot-reload)
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview

# 📱 Générer un APK Android (SIMPLE !)
npm run apk
```

## 🎨 Architecture du code

### 🏗️ Classes principales

- **`GameScene`** : Orchestration principale du jeu
  - `create()` : Initialisation des systèmes et objets
  - `update()` : Boucle de jeu (60 FPS) avec gestion d'état
  - `updateCredits()` : Défilement continu des crédits
  - `checkCollisions()` : Détection et gestion des collisions

- **`AudioSystem`** : Gestion audio complète
  - `loadBackgroundMusic()` / `loadIngameMusic()` : Chargement des fichiers MP3
  - `updateIngameMusicSpeed()` : Adaptation de la vitesse musicale
  - `playBounceSound()` / `playWallSound()` : Effets sonores synthétisés

- **`TouchControlSystem`** : Contrôles tactiles avancés
  - `setup()` : Création de la zone rayée diagonale
  - `updatePaddlePosition()` : Mouvement fluide avec détection multi-touch

- **`Ball`** : Physique de la balle
  - `accelerate()` : Augmentation progressive de vitesse
  - `addEffect()` : Effets de spin selon le point de contact
  - `reset()` : Repositionnement avec direction aléatoire

### 🎯 Systèmes clés

- **Collision AABB** : Détection précise avec repositionnement anti-coincage
- **IA prédictive** : Calcul de trajectoire avec imprécision contrôlée
- **Masquage Phaser** : Crédits limités à la zone de jeu
- **Défilement continu** : Deux instances de texte en rotation

### 🎮 Game Objects

- **Ball** : `Phaser.GameObjects.Arc` (cercle blanc, rayon 8px)
- **Paddles** : `Phaser.GameObjects.Rectangle` (verte 15x80 / rouge 15x80)
- **UI** : Textes, ligne centrale pointillée, icônes de vies
- **Zone tactile** : Rayures diagonales générées dynamiquement

## ⚙️ Configuration

### Paramètres de jeu (dans `constants.ts`)

```typescript
// Dimensions
CANVAS_WIDTH: 960, CANVAS_HEIGHT: 540
PADDLE_WIDTH: 15, PADDLE_HEIGHT: 80

// Vitesses et physique
BALL_INITIAL_SPEED: 200     // Vitesse de départ (px/s)
BALL_ACCELERATION: 40       // Augmentation par rebond (px/s)
BALL_MAX_SPEED: 1000       // Vitesse maximale (px/s)

// IA
AI_SPEED: 250              // Vitesse de l'IA (px/s)
AI_UPDATE_INTERVAL: 0.1    // Fréquence de mise à jour (s)
AI_IMPRECISION_RANGE: 40   // Marge d'erreur (±pixels)

// Gameplay
LIVES_COUNT: 3             // Nombre de vies
POINTS_PER_HIT: 1         // Points par rebond
POINTS_PER_GOAL: 20       // Points par but

// Audio
CREDITS_SPEED: 50         // Vitesse défilement crédits (px/s)
```

### Couleurs et styles

```typescript
COLORS: {
    PADDLE_PLAYER: 0x00ff00,    // Vert
    PADDLE_AI: 0xff0000,        // Rouge
    BALL: 0xffffff,             // Blanc
    TEXT_CREDITS: '#FFFF00',    // Jaune
    STRIPE_YELLOW: 0xffff00,    // Rayures tactiles
    STRIPE_BLACK: 0x000000
}
```

## 🚀 Améliorations implémentées

- ✅ **Architecture modulaire** : 7 fichiers TypeScript spécialisés
- ✅ **Système audio complet** : Musique adaptative + effets sonores
- ✅ **Contrôles tactiles avancés** : Zone rayée avec feedback visuel
- ✅ **Système de vies** : 3 vies avec interface graphique
- ✅ **Crédits défilants** : Rotation continue avec masquage
- ✅ **Game Over interactif** : Redémarrage par touch/click
- ✅ **Musique adaptive** : Vitesse qui suit l'intensité du jeu
- ✅ **Interface professionnelle** : Design soigné et responsive

## 🎯 Fonctionnalités avancées possibles

- 🎨 **Effets de particules** pour les collisions
- 🏆 **Système de high scores** persistant
- 🎯 **Niveaux de difficulté** IA configurables
- 🌈 **Thèmes visuels** multiples
- 📊 **Statistiques de jeu** détaillées

## 📱 Génération d'APK Android

**Une seule commande pour tout faire :**

```bash
npm run apk
```

Cette commande va :
1. ✅ Builder ton jeu automatiquement
2. ✅ Synchroniser avec Capacitor  
3. ✅ Générer l'APK via Gradle
4. ✅ Copier l'APK dans le dossier principal

**Résultat :** `pong-frag.apk` généré dans le dossier racine du projet

### 📋 Workflow quotidien

```bash
# 1. Modifier ton jeu dans src/ (fichiers modulaires)
# 2. Tester en développement
npm run dev

# 3. Générer l'APK pour Android
npm run apk

# 4. L'APK se trouve dans : ./pong-frag.apk
# 5. Installer sur ton téléphone via USB, Bluetooth, ou cloud
```

### 🔧 Configuration initiale (déjà faite)

Si tu veux refaire le setup sur un autre projet :

```bash
# Installer Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# Initialiser 
npx cap init "App Name" "com.example.app"

# Ajouter Android
npm run build
npx cap add android
```

## 🧑‍💻 Technologies utilisées

- **[Phaser 3](https://phaser.io/)** v3.70.0 : Framework de jeu HTML5 avancé
- **[TypeScript](https://www.typescriptlang.org/)** v5.2.2 : Langage typé avec architecture modulaire
- **[Vite](https://vitejs.dev/)** : Build tool ultra-rapide et serveur de dev
- **[Web Audio API](https://developer.mozilla.org/docs/Web/API/Web_Audio_API)** : Sons synthétisés en temps réel
- **[Capacitor](https://capacitorjs.com/)** : Génération d'APK Android
- **[Node.js](https://nodejs.org/)** : Environnement d'exécution

## 📄 Licence

Ce projet a été construit pour des fins éducatives. Libre d'utilisation et de modification.

---

**🎮 Amusez-vous bien !** 

Pour toute question ou amélioration, n'hésitez pas à contribuer au projet.