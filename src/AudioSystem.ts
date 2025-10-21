export class AudioSystem {
    private audioContext: AudioContext | null = null;
    private backgroundMusic: HTMLAudioElement | null = null;
    private ingameMusic: HTMLAudioElement | null = null;
    private backgroundMusicReady: boolean = false;
    private ingameMusicReady: boolean = false;
    private ingameMusicPlaying: boolean = false;

    constructor() {
        this.initAudioContext();
        this.loadBackgroundMusic();
        this.loadIngameMusic();
    }

    private initAudioContext(): void {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (error) {
            console.log('Audio non disponible');
        }
    }

    playSound(frequency: number = 440, duration: number = 0.1): void {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playBounceSound(): void {
        this.playSound(220, 0.1);
    }

    playWallSound(): void {
        this.playSound(110, 0.15);
    }

    private loadBackgroundMusic(): void {
        try {
            this.backgroundMusic = new Audio('assets/musics/music.mp3');
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = 0.15;
            
            // Marquer la musique comme prête quand elle est chargée
            this.backgroundMusic.addEventListener('canplaythrough', () => {
                if (!this.backgroundMusicReady) {
                    this.backgroundMusicReady = true;
                    console.log('🎵 Musique de fond chargée et prête');
                    this.tryAutoStartMusic();
                }
            });

            this.backgroundMusic.addEventListener('error', () => {
                console.log('⚠️ Erreur de chargement de music.mp3');
            });

        } catch (error) {
            console.log('⚠️ Impossible de charger la musique de fond:', error);
        }
    }

    private tryAutoStartMusic(): void {
        if (this.backgroundMusicReady && this.backgroundMusic) {
            this.backgroundMusic.play().then(() => {
                console.log('🎵 Musique démarrée automatiquement (app Android)');
            }).catch(error => {
                console.log('⚠️ Démarrage automatique bloqué, attente interaction utilisateur');
            });
        }
    }

    startBackgroundMusic(): void {
        this.stopIngameMusic();
        if (this.backgroundMusicReady && this.backgroundMusic) {
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic.play().then(() => {
                console.log('🎵 Musique de fond démarrée après interaction utilisateur');
            }).catch(error => {
                console.log('⚠️ Impossible de démarrer la musique:', error);
            });
        }
    }

    stopBackgroundMusic(): void {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            console.log('🔇 Musique de fond arrêtée');
        }
    }

    private loadIngameMusic(): void {
        try {
            this.ingameMusic = new Audio('assets/musics/ingame.mp3');
            this.ingameMusic.loop = true;
            this.ingameMusic.volume = 0.15;
            
            this.ingameMusic.addEventListener('canplaythrough', () => {
                if (!this.ingameMusicReady) {
                    this.ingameMusicReady = true;
                    console.log('🎮 Musique ingame chargée et prête');
                }
            });

            this.ingameMusic.addEventListener('error', () => {
                console.log('⚠️ Erreur de chargement de ingame.mp3');
            });

        } catch (error) {
            console.log('⚠️ Impossible de charger la musique ingame:', error);
        }
    }

    startIngameMusic(): void {
        if (this.ingameMusicPlaying) return;
        this.stopBackgroundMusic();
        if (this.ingameMusicReady && this.ingameMusic) {
            // Démarrer avec une vitesse lente
            this.ingameMusic.playbackRate = 0.8;
            this.ingameMusic.play().then(() => {
                this.ingameMusicPlaying = true;
                console.log('🎮 Musique ingame démarrée pour nouvelle balle (vitesse lente)');
            }).catch(error => {
                console.log('⚠️ Impossible de démarrer la musique ingame:', error);
            });
        }
    }

    updateIngameMusicSpeed(ballSpeed: number, minSpeed: number, maxSpeed: number): void {
        if (this.ingameMusicPlaying && this.ingameMusic) {
            // Calculer le ratio de vitesse (0.0 à 1.0)
            const speedRatio = Math.min((ballSpeed - minSpeed) / (maxSpeed - minSpeed), 1.0);

            // Mapper sur une plage de vitesse musicale (0.8x à 1.2x)
            const minPlaybackRate = 0.8;
            const maxPlaybackRate = 1.2;
            const playbackRate = minPlaybackRate + (speedRatio * (maxPlaybackRate - minPlaybackRate));
            
            this.ingameMusic.playbackRate = playbackRate;
            
            console.log(`🎵 Vitesse musique ajustée: ${playbackRate.toFixed(2)}x (balle: ${Math.round(ballSpeed)})`);
        }
    }

    stopIngameMusic(): void {
        if (this.ingameMusic) {
            this.ingameMusic.pause();
            this.ingameMusic.currentTime = 0;
            this.ingameMusicPlaying = false;
            console.log('🔇 Musique ingame arrêtée');
        }
    }

    pauseAllMusic(): void {
        // Mettre en pause la musique de fond si elle joue
        if (this.backgroundMusic && !this.backgroundMusic.paused) {
            this.backgroundMusic.pause();
            console.log('⏸️ Musique de fond mise en pause');
        }
        
        // Mettre en pause la musique ingame si elle joue
        if (this.ingameMusic && !this.ingameMusic.paused) {
            this.ingameMusic.pause();
            console.log('⏸️ Musique ingame mise en pause');
        }
    }

    resumeAllMusic(): void {
        // Reprendre la musique de fond si elle était en cours
        if (this.backgroundMusic && this.backgroundMusic.paused && this.backgroundMusicReady) {
            this.backgroundMusic.play().then(() => {
                console.log('▶️ Musique de fond reprise');
            }).catch(error => {
                console.log('⚠️ Impossible de reprendre la musique de fond:', error);
            });
        }
        
        // Reprendre la musique ingame si elle était en cours
        if (this.ingameMusic && this.ingameMusic.paused && this.ingameMusicPlaying) {
            this.ingameMusic.play().then(() => {
                console.log('▶️ Musique ingame reprise');
            }).catch(error => {
                console.log('⚠️ Impossible de reprendre la musique ingame:', error);
            });
        }
    }
}