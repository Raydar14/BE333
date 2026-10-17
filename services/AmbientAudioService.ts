// AmbientAudioService — the two slots the first audio batch filled:
//
//   1. The welcome chime that plays once on the Onboarding Intro screen.
//      A 56 s "mellow chill" chime song sets the tone before the user
//      taps through onboarding (bainmack / Freesound 566579, CC0).
//
//   2. The ambient nature loop that plays behind a BE Pause while the
//      timer is running and the user has `showNatureVisuals` on. A
//      22 s field recording of water + birds that loops on itself
//      (pibborn / Freesound 192648, CC0).
//
// Both are optional — the UX never depends on them, and any load /
// playback failure is swallowed quietly so the breathing timer and the
// onboarding flow still work.
//
// expo-av is already a dependency (see services/BellService.ts, which
// uses the same Audio.Sound.createAsync pattern). Local .wav files are
// bundled through the standard Metro require() path, which works on
// native and the web build.

import { Audio } from 'expo-av';
import { Platform } from 'react-native';

// require() returns a module id Metro can resolve on all platforms;
// expo-av accepts it directly as the source arg.
const WELCOME_CHIME = require('../assets/audio/intro/chime-welcome.wav');
const NATURE_LOOP = require('../assets/audio/ambient/water-birds.wav');

// One Sound object per slot. Keeping them around means a user who taps
// Start / Stop repeatedly on the BE Pause screen reuses the loaded
// buffer instead of re-decoding the WAV each time.
let welcomeSound: Audio.Sound | null = null;
let natureSound: Audio.Sound | null = null;
let audioModeReady = false;

async function ensureAudioMode() {
    if (audioModeReady) return;
    try {
        // Same config as BellService: ambient sounds should play even
        // when the ringer is muted on iOS, duck instead of pausing
        // other audio on Android.
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            allowsRecordingIOS: false,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });
    } catch {
        // Web and some emulators reject the mode call; playback still
        // works on both, so we move on.
    } finally {
        audioModeReady = true;
    }
}

// WELCOME CHIME

/**
 * Start the onboarding welcome chime. One-shot, no looping — the
 * clip is 56 s and plays once. Safe to call every time the Intro
 * screen mounts; a prior Sound object is replayed from the start.
 */
export async function playWelcomeChime(): Promise<void> {
    try {
        await ensureAudioMode();
        if (welcomeSound) {
            try {
                await welcomeSound.setPositionAsync(0);
                await welcomeSound.playAsync();
                return;
            } catch {
                // Fall through and recreate; the old handle might be
                // from a prior session or a stale web Audio element.
            }
        }
        const { sound } = await Audio.Sound.createAsync(
            WELCOME_CHIME,
            { volume: 0.5, shouldPlay: true, isLooping: false },
        );
        welcomeSound = sound;
    } catch (e) {
        if (Platform.OS !== 'web') {
            // Non-fatal — never block onboarding on audio.
            console.log('Welcome chime failed to play:', e);
        }
    }
}

/** Stop and unload the welcome chime. Called from Intro's cleanup. */
export async function stopWelcomeChime(): Promise<void> {
    const s = welcomeSound;
    welcomeSound = null;
    if (!s) return;
    try {
        await s.stopAsync();
    } catch { /* already stopped */ }
    try {
        await s.unloadAsync();
    } catch { /* already unloaded */ }
}

// NATURE AMBIENT LOOP

/**
 * Start the nature ambient loop. Looping, low volume. Safe to call
 * repeatedly: if the loop is already playing, it stays playing.
 */
export async function startNatureLoop(): Promise<void> {
    try {
        await ensureAudioMode();
        if (natureSound) {
            try {
                const status = await natureSound.getStatusAsync();
                if (status.isLoaded && status.isPlaying) return;
                await natureSound.playAsync();
                return;
            } catch {
                // Fall through and recreate.
            }
        }
        const { sound } = await Audio.Sound.createAsync(
            NATURE_LOOP,
            { volume: 0.35, shouldPlay: true, isLooping: true },
        );
        natureSound = sound;
    } catch (e) {
        if (Platform.OS !== 'web') {
            console.log('Nature loop failed to start:', e);
        }
    }
}

/** Stop and unload the nature loop. Call when the BE Pause ends. */
export async function stopNatureLoop(): Promise<void> {
    const s = natureSound;
    natureSound = null;
    if (!s) return;
    try {
        await s.stopAsync();
    } catch { /* already stopped */ }
    try {
        await s.unloadAsync();
    } catch { /* already unloaded */ }
}
