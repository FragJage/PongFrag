// Import de Phaser et de la scène de jeu
import Phaser from 'phaser'
import { GameScene } from './GameScene'
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from './constants'

// Configuration du jeu Phaser
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO, // Utilise WebGL si possible, sinon Canvas
    width: CANVAS_WIDTH,        // Largeur adaptée smartphone paysage
    height: CANVAS_HEIGHT,       // Hauteur adaptée smartphone paysage (ratio 16:9)
    backgroundColor: COLORS.BACKGROUND, // Couleur de fond
    scene: GameScene,  // Notre scène principale
    scale: {
        mode: Phaser.Scale.FIT,           // Adapte le jeu à la taille de l'écran
        autoCenter: Phaser.Scale.CENTER_BOTH, // Centre le jeu
        min: {
            width: CANVAS_WIDTH / 2,    // Taille minimum (pour très petits écrans)
            height: CANVAS_HEIGHT / 2
        },
        max: {
            width: CANVAS_WIDTH * 2,   // Taille maximum (pour grands écrans)
            height: CANVAS_HEIGHT * 2
        }
    }
}

// Création et démarrage du jeu
const game = new Phaser.Game(config)

console.log('🚀 Jeu Phaser initialisé!')