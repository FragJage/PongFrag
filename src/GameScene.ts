import Phaser from 'phaser'
import { AudioSystem } from './AudioSystem'
import { TouchControlSystem } from './TouchControlSystem'
import { Ball } from './Ball'
import { GameState } from './interfaces'
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    FRAME_MARGIN,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    PADDLE_HALF_HEIGHT,
    PADDLE_OFFSET,
    PADDLE_LEFT_OFFSET,
    PLAY_AREA_CENTER,
    BALL_RADIUS,
    BALL_INITIAL_SPEED,
    BALL_MAX_SPEED,
    AI_SPEED,
    AI_UPDATE_INTERVAL,
    AI_DEAD_ZONE,
    AI_IMPRECISION_RANGE,
    SCORE_PADDING,
    LIVES_COUNT,
    POINTS_PER_HIT,
    POINTS_PER_GOAL,
    DASH_HEIGHT,
    DASH_GAP,
    LIFE_ICON_WIDTH,
    LIFE_ICON_HEIGHT,
    LIFE_SPACING,
    CREDITS_SPEED,
    CREDITS_TEXT,
    COLORS
} from './constants'

export class GameScene extends Phaser.Scene {
    // Systèmes
    private audioSystem!: AudioSystem
    private touchControlSystem!: TouchControlSystem
    
    // Objets de jeu
    private ball!: Ball
    private paddleLeft!: Phaser.GameObjects.Rectangle
    private paddleRight!: Phaser.GameObjects.Rectangle
    
    // État du jeu
    private gameState: GameState = {
        score: 0,
        lives: LIVES_COUNT,
        gameOver: false,
        isTouching: false
    }
    
    // IA
    private aiTargetY = CANVAS_HEIGHT / 2
    private aiUpdateTimer = 0
    
    // Interface utilisateur
    private scoreText!: Phaser.GameObjects.Text
    private livesDisplay: Phaser.GameObjects.Rectangle[] = []
    private gameOverText!: Phaser.GameObjects.Text
    private restartText!: Phaser.GameObjects.Text
    private creditsText1!: Phaser.GameObjects.Text
    private creditsText2!: Phaser.GameObjects.Text

    constructor() {
        super({ key: 'GameScene' })
    }

    preload() {
        console.log('🎮 GameScene: preload() - Chargement des ressources')
    }

    create() {
        console.log('🎮 GameScene: create() - Création des objets du jeu')
        
        // Initialiser les systèmes
        this.audioSystem = new AudioSystem()
        
        // Créer l'interface utilisateur
        this.createUI()
        
        // Créer le terrain de jeu
        this.createGameField()
        
        // Créer les objets de jeu
        this.createGameObjects()
        
        // Créer les crédits défilants
        this.createCredits()
        
        // Configurer les contrôles
        this.setupControls()
        
        // Ajouter les gestionnaires d'événements pour la gestion de l'arrière-plan
        this.setupLifecycleEvents()
    }    private createUI(): void {
        // Titre du jeu
        this.add.text(PLAY_AREA_CENTER, 50, 'PONG FRAG', {
            fontSize: '32px',
            color: COLORS.TEXT_WHITE,
            fontStyle: 'bold'
        }).setOrigin(0.5)
        
        // Affichage du score
        this.updateScoreDisplay()
        
        // Créer l'affichage des vies
        this.createLivesDisplay()
        
        // Textes Game Over (invisibles au début)
        this.createGameOverUI()
    }

    private createGameField(): void {
        // Cadre de l'aire de jeu
        const frameX = PADDLE_LEFT_OFFSET - PADDLE_WIDTH/2 - FRAME_MARGIN
        const frameY = FRAME_MARGIN
        const frameWidth = (CANVAS_WIDTH - PADDLE_OFFSET) - PADDLE_LEFT_OFFSET + PADDLE_WIDTH + FRAME_MARGIN * 2
        const frameHeight = CANVAS_HEIGHT - FRAME_MARGIN * 2
        
        const gameFrame = this.add.graphics()
        gameFrame.lineStyle(3, COLORS.FRAME, 1)
        gameFrame.strokeRoundedRect(frameX, frameY, frameWidth, frameHeight, 12)
        
        // Ligne centrale en pointillés
        this.createCenterLine(frameHeight)
    }

    private createCenterLine(frameHeight: number): void {
        const centerLineHeight = frameHeight - 10
        const totalDashUnit = DASH_HEIGHT + DASH_GAP
        const numberOfDashes = Math.floor(centerLineHeight / totalDashUnit) + 1
        const startY = FRAME_MARGIN + 5
        
        for (let i = 0; i < numberOfDashes; i++) {
            const dashY = startY + (i * totalDashUnit) + (DASH_HEIGHT / 2)
            this.add.rectangle(PLAY_AREA_CENTER, dashY, 4, DASH_HEIGHT, COLORS.CENTER_LINE)
        }
    }

    private createGameObjects(): void {
        // Paddles
        this.paddleLeft = this.add.rectangle(
            PADDLE_LEFT_OFFSET, 
            CANVAS_HEIGHT / 2, 
            PADDLE_WIDTH, 
            PADDLE_HEIGHT, 
            COLORS.PADDLE_PLAYER
        )
        
        this.paddleRight = this.add.rectangle(
            CANVAS_WIDTH - PADDLE_OFFSET, 
            CANVAS_HEIGHT / 2, 
            PADDLE_WIDTH, 
            PADDLE_HEIGHT, 
            COLORS.PADDLE_AI
        )
        
        // Balle (avec référence à l'AudioSystem)
        this.ball = new Ball(this, this.audioSystem)
    }

    private setupControls(): void {
        this.touchControlSystem = new TouchControlSystem(this, this.paddleLeft)
        this.touchControlSystem.setup()
    }

    private setupLifecycleEvents(): void {
        // Gestionnaire pour quand l'application passe en arrière-plan
        this.game.events.on('blur', () => {
            console.log('📱 Application en arrière-plan - Pause de la musique')
            if (this.audioSystem) {
                this.audioSystem.pauseAllMusic()
            }
        })

        // Gestionnaire pour quand l'application revient au premier plan
        this.game.events.on('focus', () => {
            console.log('📱 Application au premier plan - Reprise de la musique')
            if (this.audioSystem && !this.gameState.gameOver) {
                this.audioSystem.resumeAllMusic()
            }
        })

        // Gestionnaire pour la visibilité (spécifique aux applications mobiles)
        this.game.events.on('hidden', () => {
            console.log('📱 Application cachée - Pause de la musique')
            if (this.audioSystem) {
                this.audioSystem.pauseAllMusic()
            }
        })

        this.game.events.on('visible', () => {
            console.log('📱 Application visible - Reprise de la musique')
            if (this.audioSystem && !this.gameState.gameOver) {
                this.audioSystem.resumeAllMusic()
            }
        })
    }

    private updateScoreDisplay(): void {
        const formattedScore = this.gameState.score.toString().padStart(SCORE_PADDING, '0')
        if (this.scoreText) {
            this.scoreText.setText(`Score ${formattedScore}`)
        } else {
            this.scoreText = this.add.text(
                PLAY_AREA_CENTER * 0.5, 
                CANVAS_HEIGHT - 40, 
                `Score ${formattedScore}`, 
                { fontSize: '20px', color: COLORS.TEXT_WHITE }
            ).setOrigin(0.5, 0.5)
        }
    }

    private createLivesDisplay(): void {
        const baseX = PLAY_AREA_CENTER * 1.5
        const baseY = CANVAS_HEIGHT - 40
        
        this.add.text(baseX - 40, baseY, 'Vies', {
            fontSize: '16px',
            color: COLORS.TEXT_WHITE
        }).setOrigin(0.5, 0.5)
        
        for (let i = 0; i < LIVES_COUNT; i++) {
            const lifeIcon = this.add.rectangle(
                baseX + (i * LIFE_SPACING),
                baseY, 
                LIFE_ICON_WIDTH,
                LIFE_ICON_HEIGHT,
                COLORS.PADDLE_PLAYER
            )
            this.livesDisplay.push(lifeIcon)
        }
    }

    private createGameOverUI(): void {
        this.gameOverText = this.add.text(PLAY_AREA_CENTER, CANVAS_HEIGHT/2, 'GAME OVER', {
            fontSize: '48px',
            fontStyle: 'bold',
            color: COLORS.TEXT_GAME_OVER,
            align: 'center'
        }).setOrigin(0.5, 0.5).setVisible(false)
        
        this.gameOverText.setInteractive()
        this.gameOverText.on('pointerdown', () => {
            if (this.gameState.gameOver) {
                this.restartGame()
            }
        })
        
        this.restartText = this.add.text(PLAY_AREA_CENTER, CANVAS_HEIGHT/2 + 60, 'Touchez GAME OVER pour recommencer', {
            fontSize: '24px',
            color: COLORS.TEXT_WHITE,
            align: 'center'
        }).setOrigin(0.5, 0.5).setVisible(false)
    }

    private createCredits(): void {
        // Calculer les limites du terrain de jeu
        const gameFieldLeft = PADDLE_LEFT_OFFSET - PADDLE_WIDTH/2 - FRAME_MARGIN
        const gameFieldRight = CANVAS_WIDTH - PADDLE_OFFSET + PADDLE_WIDTH/2 + FRAME_MARGIN
        const gameFieldTop = FRAME_MARGIN
        const gameFieldBottom = CANVAS_HEIGHT - FRAME_MARGIN - 10
        const gameFieldWidth = gameFieldRight - gameFieldLeft
        const gameFieldHeight = gameFieldBottom - gameFieldTop
        
        // Créer un masque rectangulaire pour le terrain de jeu
        const maskShape = this.add.graphics()
        maskShape.fillStyle(0x00ffff)
        maskShape.fillRect(gameFieldLeft+20, gameFieldTop, gameFieldWidth-40, gameFieldHeight)
        maskShape.setVisible(false)
        const mask = maskShape.createGeometryMask()
        
        // Créer le premier texte des crédits
        this.creditsText1 = this.add.text(gameFieldRight, gameFieldBottom-80, CREDITS_TEXT, {
            fontSize: '16px',
            color: COLORS.TEXT_CREDITS,
            fontStyle: 'italic'
        }).setOrigin(0, 0.5)
        
        // Calculer la largeur du texte pour positionner le second
        const textWidth = this.creditsText1.width
        
        // Créer le second texte des crédits (même contenu, positionné après le premier)
        this.creditsText2 = this.add.text(gameFieldRight + textWidth + 50, gameFieldBottom-80, CREDITS_TEXT, {
            fontSize: '16px',
            color: COLORS.TEXT_CREDITS,
            fontStyle: 'italic'
        }).setOrigin(0, 0.5)
        
        // Appliquer le masque aux deux textes
        this.creditsText1.setMask(mask)
        this.creditsText2.setMask(mask)
        
        // Les crédits sont visibles seulement quand le jeu n'est pas en cours
        this.creditsText1.setVisible(true)
        this.creditsText2.setVisible(true)
    }

    update(time: number, delta: number): void {
        const deltaSeconds = delta / 1000
        this.gameState.isTouching = this.touchControlSystem.getIsTouching()
        
        // Gérer l'affichage des crédits
        this.updateCredits(deltaSeconds)
        
        if (this.gameState.gameOver) {
            // Afficher les crédits quand le jeu est terminé
            this.creditsText1.setVisible(true)
            this.creditsText2.setVisible(true)
            return
        }
        
        // Démarrer la musique au premier touch
        if (this.gameState.isTouching) {
            this.audioSystem.startIngameMusic()
            // Cacher les crédits quand on commence à jouer
            this.creditsText1.setVisible(false)
            this.creditsText2.setVisible(false)
        }
        
        // Mise à jour de la balle et du gameplay seulement si on touche l'écran
        if (this.gameState.isTouching) {
            this.ball.update(deltaSeconds)
            this.checkCollisions()
            this.updateAI(deltaSeconds)
            this.checkGoals()
        }
    }

    private updateCredits(deltaSeconds: number): void {
        // Calculer les limites du terrain de jeu
        const gameFieldLeft = PADDLE_LEFT_OFFSET - PADDLE_WIDTH/2 - FRAME_MARGIN
        const gameFieldRight = CANVAS_WIDTH - PADDLE_OFFSET + PADDLE_WIDTH/2 + FRAME_MARGIN
        
        // Faire défiler les deux textes de droite à gauche
        this.creditsText1.x -= CREDITS_SPEED * deltaSeconds
        this.creditsText2.x -= CREDITS_SPEED * deltaSeconds
        
        // Repositionner le premier texte quand il sort complètement
        if (this.creditsText1.x + this.creditsText1.width < gameFieldLeft) {
            // Le remettre après le second texte
            this.creditsText1.x = this.creditsText2.x + this.creditsText2.width + 50
        }
        
        // Repositionner le second texte quand il sort complètement
        if (this.creditsText2.x + this.creditsText2.width < gameFieldLeft) {
            // Le remettre après le premier texte
            this.creditsText2.x = this.creditsText1.x + this.creditsText1.width + 50
        }
    }

    private checkCollisions(): void {
        this.checkWallCollisions()
        this.checkPaddleCollisions()
    }

    private checkWallCollisions(): void {
        const ballPos = this.ball.getPosition()
        
        // Collision mur haut
        if (ballPos.y - BALL_RADIUS <= FRAME_MARGIN) {
            console.log('💥 Collision mur haut!')
            this.ball.setPosition(ballPos.x, BALL_RADIUS + FRAME_MARGIN)
            this.ball.reverseY()
            this.audioSystem.playWallSound()
        }
        
        // Collision mur bas
        if (ballPos.y + BALL_RADIUS >= CANVAS_HEIGHT - FRAME_MARGIN) {
            console.log('💥 Collision mur bas!')
            this.ball.setPosition(ballPos.x, CANVAS_HEIGHT - BALL_RADIUS - FRAME_MARGIN)
            this.ball.reverseY()
            this.audioSystem.playWallSound()
        }
    }

    private checkPaddleCollisions(): void {
        const ballPos = this.ball.getPosition()
        const paddleHalfWidth = PADDLE_WIDTH / 2
        
        // Collision paddle gauche
        if (ballPos.x - BALL_RADIUS <= this.paddleLeft.x + paddleHalfWidth &&
            ballPos.x + BALL_RADIUS >= this.paddleLeft.x - paddleHalfWidth &&
            ballPos.y - BALL_RADIUS <= this.paddleLeft.y + PADDLE_HALF_HEIGHT &&
            ballPos.y + BALL_RADIUS >= this.paddleLeft.y - PADDLE_HALF_HEIGHT &&
            this.ball.isMovingLeft()) {
            
            this.handlePaddleHit(this.paddleLeft, paddleHalfWidth, true)
        }
        
        // Collision paddle droite
        if (ballPos.x + BALL_RADIUS >= this.paddleRight.x - paddleHalfWidth &&
            ballPos.x - BALL_RADIUS <= this.paddleRight.x + paddleHalfWidth &&
            ballPos.y - BALL_RADIUS <= this.paddleRight.y + PADDLE_HALF_HEIGHT &&
            ballPos.y + BALL_RADIUS >= this.paddleRight.y - PADDLE_HALF_HEIGHT &&
            this.ball.isMovingRight()) {
            
            this.handlePaddleHit(this.paddleRight, paddleHalfWidth, false)
        }
    }

    private handlePaddleHit(paddle: Phaser.GameObjects.Rectangle, paddleHalfWidth: number, isLeftPaddle: boolean): void {
        console.log(`🏓 Collision paddle ${isLeftPaddle ? 'gauche' : 'droite'}!`)
        
        this.gameState.score += POINTS_PER_HIT
        this.updateScoreDisplay()
        this.audioSystem.playBounceSound()
        
        // Repositionner la balle
        const ballPos = this.ball.getPosition()
        if (isLeftPaddle) {
            this.ball.setPosition(paddle.x + paddleHalfWidth + BALL_RADIUS, ballPos.y)
        } else {
            this.ball.setPosition(paddle.x - paddleHalfWidth - BALL_RADIUS, ballPos.y)
        }
        
        this.ball.reverseX()
        
        // Ajouter effet selon position de contact
        const hitPosition = (ballPos.y - paddle.y) / PADDLE_HALF_HEIGHT
        this.ball.addEffect(hitPosition)
        this.ball.accelerate()
        
        // Ajuster la vitesse de la musique selon la vitesse de la balle
        const currentSpeed = this.ball.getCurrentSpeed()
        this.audioSystem.updateIngameMusicSpeed(currentSpeed, BALL_INITIAL_SPEED, BALL_MAX_SPEED)
    }

    private updateAI(deltaSeconds: number): void {
        this.aiUpdateTimer += deltaSeconds
        if (this.aiUpdateTimer >= AI_UPDATE_INTERVAL) {
            this.aiUpdateTimer = 0
            
            const ballPos = this.ball.getPosition()
            let newTargetY = ballPos.y
            
            if (this.ball.isMovingRight()) {
                const timeToReach = (this.paddleRight.x - ballPos.x) / this.ball.velocity.x
                newTargetY = ballPos.y + (this.ball.velocity.y * timeToReach)
                
                if (newTargetY < 0) newTargetY = -newTargetY
                if (newTargetY > CANVAS_HEIGHT) newTargetY = CANVAS_HEIGHT - (newTargetY - CANVAS_HEIGHT)
            }
            
            const imprecision = (Math.random() - 0.5) * AI_IMPRECISION_RANGE
            this.aiTargetY = newTargetY + imprecision
        }
        
        const difference = this.aiTargetY - this.paddleRight.y
        if (Math.abs(difference) > AI_DEAD_ZONE) {
            const moveDirection = Math.sign(difference)
            this.paddleRight.y += moveDirection * AI_SPEED * deltaSeconds
        }
        
        // Limites IA
        if (this.paddleRight.y - PADDLE_HALF_HEIGHT < FRAME_MARGIN) {
            this.paddleRight.y = PADDLE_HALF_HEIGHT + FRAME_MARGIN
        }
        if (this.paddleRight.y + PADDLE_HALF_HEIGHT > CANVAS_HEIGHT - FRAME_MARGIN) {
            this.paddleRight.y = CANVAS_HEIGHT - PADDLE_HALF_HEIGHT - FRAME_MARGIN
        }
    }

    private checkGoals(): void {
        const ballPos = this.ball.getPosition()
        
        // Joueur rate la balle
        if (ballPos.x + BALL_RADIUS < PADDLE_LEFT_OFFSET - PADDLE_WIDTH/2 - 20) {
            console.log('💔 Balle ratée ! Le joueur perd une vie')
            this.loseLife()
        }
        
        // IA rate la balle
        if (ballPos.x - BALL_RADIUS > CANVAS_WIDTH) {
            console.log('🥅 BUT ! Joueur marque!')
            this.gameState.score += POINTS_PER_GOAL
            this.updateScoreDisplay()
            this.ball.reset()
        }
    }

    private loseLife(): void {
        this.gameState.lives--
        this.updateLivesDisplay()
        console.log(`💔 Vie perdue ! Vies restantes: ${this.gameState.lives}`)
        
        if (this.gameState.lives <= 0) {
            this.gameState.gameOver = true
            this.gameOverText.setVisible(true)
            this.restartText.setVisible(true)
            this.audioSystem.startBackgroundMusic()
            console.log('💀 GAME OVER !')
        } else {
            this.ball.reset()
        }
    }

    private updateLivesDisplay(): void {
        this.livesDisplay.forEach(lifeIcon => lifeIcon.setVisible(false))
        for (let i = 0; i < this.gameState.lives; i++) {
            if (this.livesDisplay[i]) {
                this.livesDisplay[i].setVisible(true)
            }
        }
    }

    private restartGame(): void {
        console.log('🔄 Redémarrage du jeu...')
        this.gameState.lives = LIVES_COUNT
        this.gameState.gameOver = false
        this.gameState.score = 0
        this.updateLivesDisplay()
        this.updateScoreDisplay()
        this.gameOverText.setVisible(false)
        this.restartText.setVisible(false)
        this.ball.reset()
        console.log('✨ Jeu redémarré !')
    }

    shutdown(): void {
        // Arrêter les musiques quand on quitte le jeu
        if (this.audioSystem) {
            this.audioSystem.stopBackgroundMusic();
            this.audioSystem.stopIngameMusic();
        }
    }
}