import { Audio } from 'expo-av';
import { Platform } from 'react-native';

/**
 * BellService — plays a short bell / chime at the start, midpoint, and end
 * of a BE Pause per the Master Manual ("Sound design: bells (start, midpoint,
 * end) distinct but soft").
 *
 * TODO: These URLs are free public-source placeholders. Swap for the final
 * meditation bell assets (see TODO.md → Audio Assets). The Master Manual
 * spec is: distinct but soft, -12 dBFS peaks; award chime under 400ms.
 */
const BELL_START_URL = 'https://actions.google.com/sounds/v1/alarms/gentle_wake_alarm.ogg';
const BELL_MID_URL = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';
const BELL_END_URL = 'https://actions.google.com/sounds/v1/alarms/gentle_wake_alarm.ogg';

// Keep one Sound object per bell so repeat plays don't accumulate resources.
let startSound: Audio.Sound | null = null;
let midSound: Audio.Sound | null = null;
let endSound: Audio.Sound | null = null;
let audioModeReady = false;

async function ensureAudioMode() {
    if (audioModeReady) return;
    try {
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            allowsRecordingIOS: false,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });
        audioModeReady = true;
    } catch {
        // Web + some emulators reject audio mode config; playback still works.
        audioModeReady = true;
    }
}

async function playFromUrl(url: string, existing: Audio.Sound | null): Promise<Audio.Sound | null> {
    try {
        await ensureAudioMode();
        // On web the Audio API is limited; expo-av still supports basic playback.
        if (existing) {
            try {
                await existing.replayAsync();
                return existing;
            } catch {
                // Fall through and recreate
            }
        }
        const { sound } = await Audio.Sound.createAsync(
            { uri: url },
            { volume: 0.6, shouldPlay: true }
        );
        return sound;
    } catch (e) {
        // Non-fatal: user still sees the visual timer even if audio fails.
        if (Platform.OS !== 'web') console.log('Bell playback failed:', e);
        return null;
    }
}

export const BellService = {
    async playStart() {
        startSound = await playFromUrl(BELL_START_URL, startSound);
    },
    async playMid() {
        midSound = await playFromUrl(BELL_MID_URL, midSound);
    },
    async playEnd() {
        endSound = await playFromUrl(BELL_END_URL, endSound);
    },
    async unloadAll() {
        const sounds = [startSound, midSound, endSound];
        startSound = midSound = endSound = null;
        for (const s of sounds) {
            if (!s) continue;
            try { await s.unloadAsync(); } catch { /* already gone */ }
        }
    },
};
