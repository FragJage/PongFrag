import Phaser from 'phaser'
import { Velocity } from './interfaces'
import { AudioSystem } from './AudioSystem'
import { 
    PLAY_AREA_CENTER, 
    CANVAS_HEIGHT, 
    BALL_INITIAL_SPEED, 
    BALL_ACCELERATION, 
    BALL_MAX_SPEED,
    BALL_RADIUS,
    COLORS 
} from './constants'

export class Ball {
    public gameObject: Phaser.GameObjects.Arc
    public velocity: Velocity = { x: BALL_INITIAL_SPEED, y: 150 }
    private scene: Phaser.Scene
    private audioSystem: AudioSystem

    constructor(scene: Phaser.Scene, audioSystem: AudioSystem) {
        this.scene = scene
        this.audioSystem = audioSystem
        this.gameObject = this.scene.add.circle(
            PLAY_AREA_CENTER, 
            CANVAS_HEIGHT / 2, 
            BALL_RADIUS, 
            COLORS.BALL
        )
    }

    /**
     * Remettre la balle au centre avec une nouvelle direction aléatoire
     */
    public reset(): void {
        console.log('🔄 Reset de la balle au centre')
        
        // Remettre la balle au centre de l'aire de jeu
        this.gameObject.x = PLAY_AREA_CENTER
        this.gameObject.y = CANVAS_HEIGHT / 2
        
        // Choisir une nouvelle direction aléatoire
        const directions = [-1, 1]
        const randomDirection = directions[Math.floor(Math.random() * directions.length)]!
        
        // Nouvelle vélocité avec direction aléatoire
        this.velocity.x = BALL_INITIAL_SPEED * randomDirection
        this.velocity.y = (Math.random() - 0.5) * BALL_INITIAL_SPEED
        
        // Démarrer la musique ingame pour cette nouvelle balle
        this.audioSystem.stopIngameMusic()
        
        console.log(`🎲 Nouvelle direction: vx=${this.velocity.x}, vy=${this.velocity.y}`)
    }

    /**
     * Augmenter la vitesse de la balle progressivement
     */
    public accelerate(): void {
        // Calculer la vitesse actuelle (magnitude du vecteur)
        const currentSpeed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y)
        
        // Si on n'a pas atteint la vitesse maximale
        if (currentSpeed < BALL_MAX_SPEED) {
            // Calculer la nouvelle vitesse
            const newSpeed = Math.min(currentSpeed + BALL_ACCELERATION, BALL_MAX_SPEED)
            
            // Conserver la direction mais augmenter la magnitude
            const speedRatio = newSpeed / currentSpeed
            this.velocity.x *= speedRatio
            this.velocity.y *= speedRatio
            
            console.log(`🚀 Balle accélérée ! Vitesse: ${Math.round(currentSpeed)} → ${Math.round(newSpeed)}`)
        } else {
            console.log(`⚡ Vitesse maximale atteinte: ${Math.round(currentSpeed)}`)
        }
    }

    /**
     * Mettre à jour la position de la balle
     */
    public update(deltaSeconds: number): void {
        this.gameObject.x += this.velocity.x * deltaSeconds
        this.gameObject.y += this.velocity.y * deltaSeconds
    }

    /**
     * Inverser la direction X (rebond horizontal)
     */
    public reverseX(): void {
        this.velocity.x = -this.velocity.x
    }

    /**
     * Inverser la direction Y (rebond vertical)
     */
    public reverseY(): void {
        this.velocity.y = -this.velocity.y
    }

    /**
     * Ajouter un effet selon la position de contact sur la paddle
     */
    public addEffect(hitPosition: number, effectStrength: number = 100): void {
        this.velocity.y += hitPosition * effectStrength
    }

    /**
     * Obtenir la position actuelle
     */
    public getPosition(): { x: number, y: number } {
        return { x: this.gameObject.x, y: this.gameObject.y }
    }

    /**
     * Définir la position
     */
    public setPosition(x: number, y: number): void {
        this.gameObject.x = x
        this.gameObject.y = y
    }

    /**
     * Vérifier si la balle va vers la droite
     */
    public isMovingRight(): boolean {
        return this.velocity.x > 0
    }

    /**
     * Vérifier si la balle va vers la gauche
     */
    public isMovingLeft(): boolean {
        return this.velocity.x < 0
    }

    /**
     * Obtenir la vitesse actuelle (magnitude du vecteur vitesse)
     */
    public getCurrentSpeed(): number {
        return Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y)
    }
}