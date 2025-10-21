// Types et interfaces pour le jeu Pong

export interface Velocity {
    x: number
    y: number
}

export interface Position {
    x: number
    y: number
}

export interface GameState {
    score: number
    lives: number
    gameOver: boolean
    isTouching: boolean
}

export interface AudioConfig {
    frequency: number
    type: OscillatorType
    volume: number
    duration: number
}

export interface TouchZoneConfig {
    width: number
    stripeWidth: number
    alpha: number
}

export interface PaddleBounds {
    minY: number
    maxY: number
}

export interface CollisionBox {
    x: number
    y: number
    width: number
    height: number
}

// Types pour les événements
export type GameEvent = 'ballHit' | 'wallHit' | 'goal' | 'gameOver' | 'restart'

// Configuration de l'IA
export interface AIConfig {
    speed: number
    updateInterval: number
    deadZone: number
    imprecisionRange: number
}