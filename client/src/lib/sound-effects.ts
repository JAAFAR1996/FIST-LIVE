/**
 * Sound Effects Utility for AQUAVO Shrimp Mascot System
 * Uses the Web Audio API for sound generation (no external files needed)
 */

// Audio context singleton
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
}

// Check if sound is enabled in user preferences
function isSoundEnabled(): boolean {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("aquavo-sound-enabled");
    return stored !== "false"; // Enabled by default
}

// Resume audio context on user interaction (required by browsers)
export function resumeAudio(): void {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
        ctx.resume();
    }
}

/**
 * Play a simple beep/ping sound
 */
export function playPing(frequency = 800, duration = 0.1, volume = 0.3): void {
    if (!isSoundEnabled()) return;

    try {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
        console.warn("Sound playback failed:", error);
    }
}

/**
 * Play celebration fanfare sound
 */
export function playCelebration(): void {
    if (!isSoundEnabled()) return;

    try {
        const ctx = getAudioContext();

        // Play ascending notes for celebration effect
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const noteDuration = 0.15;

        notes.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.frequency.value = freq;
                oscillator.type = "triangle";

                gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + noteDuration);

                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + noteDuration);
            }, index * 100);
        });
    } catch (error) {
        console.warn("Celebration sound failed:", error);
    }
}

/**
 * Play golden shrimp catch sound (magical chime)
 */
export function playGoldenCatch(): void {
    if (!isSoundEnabled()) return;

    try {
        const ctx = getAudioContext();

        // Magical sparkle sound
        const sparkleFreqs = [1200, 1500, 1800, 2100, 1500, 1800];

        sparkleFreqs.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.frequency.value = freq;
                oscillator.type = "sine";

                gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.2);
            }, index * 80);
        });

        // Add a deeper tone for impact
        setTimeout(() => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.value = 400;
            oscillator.type = "triangle";

            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.5);
        }, 300);
    } catch (error) {
        console.warn("Golden catch sound failed:", error);
    }
}

/**
 * Play level up / evolution sound
 */
export function playLevelUp(): void {
    if (!isSoundEnabled()) return;

    try {
        const ctx = getAudioContext();

        // Quick ascending sweep
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(300, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
        oscillator.type = "sawtooth";

        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);

        // Follow-up ping
        setTimeout(() => playPing(1000, 0.1, 0.2), 200);
    } catch (error) {
        console.warn("Level up sound failed:", error);
    }
}

/**
 * Play whale/free shipping achieved sound
 */
export function playWhaleAchieved(): void {
    if (!isSoundEnabled()) return;

    // Play celebration + extra fanfare
    playCelebration();

    setTimeout(() => {
        playPing(600, 0.2, 0.3);
    }, 500);

    setTimeout(() => {
        playCelebration();
    }, 700);
}

/**
 * Play copy success sound
 */
export function playCopySuccess(): void {
    if (!isSoundEnabled()) return;
    playPing(1200, 0.08, 0.2);
}

/**
 * Play algae appear sound (bubbly)
 */
export function playAlgaeAppear(): void {
    if (!isSoundEnabled()) return;

    try {
        const ctx = getAudioContext();

        // Bubble sounds
        [0, 100, 200].forEach((delay, i) => {
            setTimeout(() => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                const baseFreq = 200 + i * 100;
                oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 2, ctx.currentTime + 0.1);
                oscillator.type = "sine";

                gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.15);
            }, delay);
        });
    } catch (error) {
        console.warn("Algae sound failed:", error);
    }
}

/**
 * Toggle sound on/off
 */
export function setSoundEnabled(enabled: boolean): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("aquavo-sound-enabled", String(enabled));
}

/**
 * Get current sound enabled status
 */
export function getSoundEnabled(): boolean {
    return isSoundEnabled();
}
