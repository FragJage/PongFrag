// Constantes du jeu
export const CANVAS_WIDTH = 960
export const CANVAS_HEIGHT = 540
export const FRAME_MARGIN = 20

// Constantes des éléments de jeu
export const BALL_RADIUS = 8
export const PADDLE_WIDTH = 15
export const PADDLE_HEIGHT = 80
export const PADDLE_HALF_HEIGHT = PADDLE_HEIGHT / 2
export const PADDLE_OFFSET = 50 // Distance entre le bord de l'écran et les raquettes
export const PADDLE_LEFT_OFFSET = 150 // Distance entre le bord gauche et la paddle gauche (plus d'espace pour le doigt)

// Calcul du centre de l'aire de jeu
export const PLAY_AREA_CENTER = (PADDLE_LEFT_OFFSET + (CANVAS_WIDTH - PADDLE_OFFSET)) / 2

// Constantes de vitesse
export const BALL_INITIAL_SPEED = 200 // Vitesse initiale de la balle
export const BALL_ACCELERATION = 40   // Augmentation de vitesse à chaque rebond
export const BALL_MAX_SPEED = 1000     // Vitesse maximale de la balle

// Constantes pour l'IA
export const AI_SPEED = 250 // Vitesse de l'IA (un peu moins rapide que le joueur)
export const AI_UPDATE_INTERVAL = 0.1 // Intervalle de mise à jour de l'IA en secondes
export const AI_DEAD_ZONE = 8 // Zone morte pour éviter les tremblements
export const AI_IMPRECISION_RANGE = 40 // ±20 pixels d'erreur

// Constantes pour l'interface utilisateur
export const SCORE_PADDING = 5 // Nombre de chiffres pour le score (00001)
export const LIVES_COUNT = 3 // Nombre de vies au début
export const POINTS_PER_HIT = 1 // Points par rebond sur paddle
export const POINTS_PER_GOAL = 20 // Points quand l'IA rate la balle

// Constantes pour les contrôles tactiles
export const TOUCH_ZONE_WIDTH = 120 // Largeur de la zone tactile
export const STRIPE_WIDTH = 20 // Largeur de chaque rayure diagonale
export const STRIPE_ALPHA = 0.3 // Opacité des rayures

// Constantes pour l'affichage
export const DASH_HEIGHT = 15 // Hauteur de chaque trait de la ligne centrale
export const DASH_GAP = 10 // Espacement entre les traits
export const LIFE_ICON_WIDTH = 6 // Largeur des petites raquettes de vies
export const LIFE_ICON_HEIGHT = 16 // Hauteur des petites raquettes de vies
export const LIFE_SPACING = 15 // Espacement entre les icônes de vies

// Couleurs
export const COLORS = {
    BACKGROUND: '#2c3e50',
    FRAME: 0x34495e,
    CENTER_LINE: 0x444444,
    BALL: 0xffffff,
    PADDLE_PLAYER: 0x00ff00,
    PADDLE_AI: 0xff0000,
    STRIPE_BLACK: 0x000000,
    STRIPE_YELLOW: 0xffff00,
    TEXT_WHITE: '#ffffff',
    TEXT_GAME_OVER: '#FF0000',
    TEXT_CREDITS: '#FFFF00'
} as const

// Constantes pour les crédits défilants
export const CREDITS_SPEED = 50 // Vitesse de défilement en pixels par seconde
export const CREDITS_TEXT = "PONG FRAG v1.0 • Développé avec Phaser.js et TypeScript • Musique adaptative générée par l'IA suno.com • Implémentation du code par l'IA GitHub Copilot • Game design imaginé par intelligence non artificielle"