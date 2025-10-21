import Phaser from 'phaser'
import { 
    CANVAS_HEIGHT, 
    TOUCH_ZONE_WIDTH, 
    STRIPE_WIDTH, 
    STRIPE_ALPHA,
    PADDLE_HALF_HEIGHT,
    FRAME_MARGIN,
    COLORS 
} from './constants'

export class TouchControlSystem {
    private scene: Phaser.Scene
    private isTouching = false
    private lastTouchY = 0
    private paddle: Phaser.GameObjects.Rectangle

    constructor(scene: Phaser.Scene, paddle: Phaser.GameObjects.Rectangle) {
        this.scene = scene
        this.paddle = paddle
    }

    /**
     * Configurer les contrôles tactiles avec zone rayée
     */
    public setup(): void {
        // Activer les événements de pointeur (touch + souris)
        this.scene.input.addPointer(1) // Ajouter un pointeur supplémentaire pour le multi-touch
        
        // Créer la zone tactile avec rayures diagonales
        this.createStripedTouchZone()
        
        // Créer la zone interactive invisible
        this.createInteractiveZone()
        
        console.log('📱 Contrôles tactiles configurés!')
    }

    /**
     * Créer les rayures diagonales de la zone tactile
     */
    private createStripedTouchZone(): void {
        const touchZoneGraphics = this.scene.add.graphics()
        
        // Dessiner les rayures diagonales Y
        const stripeCountY = Math.ceil(CANVAS_HEIGHT / STRIPE_WIDTH)
        for (let i = 0; i < stripeCountY; i++) {
            const color = i % 2 === 0 ? COLORS.STRIPE_BLACK : COLORS.STRIPE_YELLOW
            touchZoneGraphics.fillStyle(color, STRIPE_ALPHA)
            
            // Dessiner un parallélogramme incliné à 45°
            const startY = i * STRIPE_WIDTH
            touchZoneGraphics.beginPath()
            touchZoneGraphics.moveTo(0, startY)
            touchZoneGraphics.lineTo(0, startY + STRIPE_WIDTH)
            touchZoneGraphics.lineTo(TOUCH_ZONE_WIDTH, startY + TOUCH_ZONE_WIDTH + STRIPE_WIDTH)
            touchZoneGraphics.lineTo(TOUCH_ZONE_WIDTH, startY + TOUCH_ZONE_WIDTH)
            touchZoneGraphics.closePath()
            touchZoneGraphics.fillPath()
        }

        // Dessiner les rayures diagonales X
        const stripeCountX = Math.ceil(TOUCH_ZONE_WIDTH / STRIPE_WIDTH)
        for (let i = 0; i < stripeCountX; i++) {
            const color = i % 2 === 0 ? COLORS.STRIPE_YELLOW : COLORS.STRIPE_BLACK
            touchZoneGraphics.fillStyle(color, STRIPE_ALPHA)

            const startX = i * STRIPE_WIDTH
            touchZoneGraphics.beginPath()
            touchZoneGraphics.moveTo(startX, 0)
            touchZoneGraphics.lineTo(startX + STRIPE_WIDTH, 0)
            touchZoneGraphics.lineTo(TOUCH_ZONE_WIDTH, TOUCH_ZONE_WIDTH - startX - STRIPE_WIDTH)
            touchZoneGraphics.lineTo(TOUCH_ZONE_WIDTH, TOUCH_ZONE_WIDTH - startX)
            touchZoneGraphics.closePath()
            touchZoneGraphics.fillPath()
        }
    }

    /**
     * Créer la zone interactive invisible
     */
    private createInteractiveZone(): void {
        const touchZone = this.scene.add.rectangle(
            TOUCH_ZONE_WIDTH / 2, 
            CANVAS_HEIGHT / 2, 
            TOUCH_ZONE_WIDTH, 
            CANVAS_HEIGHT, 
            COLORS.STRIPE_BLACK, 
            0 // Transparent
        )
        touchZone.setInteractive()
        
        // Événements tactiles
        touchZone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            console.log('👆 Toucher commencé à:', pointer.y)
            this.isTouching = true
            this.lastTouchY = pointer.y
        })
        
        touchZone.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.isTouching) {
                this.handlePaddleMovement(pointer.y)
            }
        })
        
        touchZone.on('pointerup', () => {
            console.log('👆 Toucher terminé')
            this.isTouching = false
        })
        
        touchZone.on('pointerout', () => {
            this.isTouching = false
        })
    }

    /**
     * Gérer le mouvement de la paddle
     */
    private handlePaddleMovement(currentTouchY: number): void {
        // Mouvement relatif fluide
        const deltaY = currentTouchY - this.lastTouchY
        let newPaddleY = this.paddle.y + deltaY
        
        // Appliquer les limites
        if (newPaddleY - PADDLE_HALF_HEIGHT < FRAME_MARGIN) {
            newPaddleY = PADDLE_HALF_HEIGHT + FRAME_MARGIN
        }
        if (newPaddleY + PADDLE_HALF_HEIGHT > CANVAS_HEIGHT - FRAME_MARGIN) {
            newPaddleY = CANVAS_HEIGHT - PADDLE_HALF_HEIGHT - FRAME_MARGIN
        }
        
        this.paddle.y = newPaddleY
        this.lastTouchY = currentTouchY
    }

    /**
     * Vérifier si l'utilisateur touche l'écran
     */
    public getIsTouching(): boolean {
        return this.isTouching
    }

    /**
     * Réinitialiser l'état tactile
     */
    public reset(): void {
        this.isTouching = false
        this.lastTouchY = 0
    }
}