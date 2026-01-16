/**
 * BiofeedbackContext - React context for biofeedback state management
 * 
 * Provides device connection state, real-time readings, and session tracking
 * to all components in the app.
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import type { Device } from 'react-native-ble-plx';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BiofeedbackService, BiofeedbackReading, SessionSummary } from '../services/BiofeedbackService';

// Storage keys
const STORAGE_KEYS = {
    LAST_DEVICE_ID: 'biofeedback_last_device_id',
    LAST_DEVICE_NAME: 'biofeedback_last_device_name',
    AUDIO_ENABLED: 'biofeedback_audio_enabled',
    AUDIO_METRIC: 'biofeedback_audio_metric',
};

export type AudioFeedbackMetric = 'hr' | 'hrv';

interface BiofeedbackContextType {
    // Connection state
    isConnected: boolean;
    connectedDevice: Device | null;
    isScanning: boolean;
    discoveredDevices: Device[];
    lastDeviceId: string | null;
    lastDeviceName: string | null;

    // Current readings
    currentReading: BiofeedbackReading | null;
    baselineReading: BiofeedbackReading | null;
    recentReadings: BiofeedbackReading[];

    // Audio feedback settings
    audioFeedbackEnabled: boolean;
    audioFeedbackMetric: AudioFeedbackMetric;

    // Demo mode for testing without device
    isDemoMode: boolean;

    // Actions
    startScan: () => Promise<void>;
    stopScan: () => void;
    connectToDevice: (deviceId: string) => Promise<void>;
    disconnectDevice: () => Promise<void>;
    reconnectLastDevice: () => Promise<boolean>;

    // Session tracking
    startSessionTracking: () => void;
    stopSessionTracking: () => SessionSummary | null;

    // Settings
    setAudioFeedback: (enabled: boolean) => Promise<void>;
    setAudioFeedbackMetric: (metric: AudioFeedbackMetric) => Promise<void>;

    // Demo mode
    toggleDemoMode: () => void;
}

const BiofeedbackContext = createContext<BiofeedbackContextType>({
    isConnected: false,
    connectedDevice: null,
    isScanning: false,
    discoveredDevices: [],
    lastDeviceId: null,
    lastDeviceName: null,
    currentReading: null,
    baselineReading: null,
    recentReadings: [],
    audioFeedbackEnabled: false,
    audioFeedbackMetric: 'hr',
    isDemoMode: false,
    startScan: async () => { },
    stopScan: () => { },
    connectToDevice: async () => { },
    disconnectDevice: async () => { },
    reconnectLastDevice: async () => false,
    startSessionTracking: () => { },
    stopSessionTracking: () => null,
    setAudioFeedback: async () => { },
    setAudioFeedbackMetric: async () => { },
    toggleDemoMode: () => { },
});

export const useBiofeedback = () => useContext(BiofeedbackContext);

export function BiofeedbackProvider({ children }: { children: React.ReactNode }) {
    // Connection state
    const [isConnected, setIsConnected] = useState(false);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [discoveredDevices, setDiscoveredDevices] = useState<Device[]>([]);
    const [lastDeviceId, setLastDeviceId] = useState<string | null>(null);
    const [lastDeviceName, setLastDeviceName] = useState<string | null>(null);

    // Readings
    const [currentReading, setCurrentReading] = useState<BiofeedbackReading | null>(null);
    const [baselineReading, setBaselineReading] = useState<BiofeedbackReading | null>(null);
    const [recentReadings, setRecentReadings] = useState<BiofeedbackReading[]>([]);

    // Audio feedback
    const [audioFeedbackEnabled, setAudioFeedbackEnabled] = useState(false);
    const [audioFeedbackMetric, setAudioFeedbackMetricState] = useState<AudioFeedbackMetric>('hr');
    const lastAudioPlayTime = useRef<number>(0);
    const audioSoundRef = useRef<Audio.Sound | null>(null);

    // Demo mode
    const [isDemoMode, setIsDemoMode] = useState(false);
    const demoIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Session tracking
    const isTrackingRef = useRef(false);

    // Load saved settings
    useEffect(() => {
        loadSettings();

        // Set up connection change callback
        BiofeedbackService.setOnConnectionChange((connected, device) => {
            setIsConnected(connected);
            setConnectedDevice(device);
        });

        // Set up reading callback
        BiofeedbackService.setOnReadingCallback((reading) => {
            setCurrentReading(reading);
            setRecentReadings(prev => {
                const newHistory = [...prev, reading];
                return newHistory.length > 60 ? newHistory.slice(newHistory.length - 60) : newHistory;
            });
            handleAudioFeedback(reading);
        });

        return () => {
            BiofeedbackService.destroy();
            if (demoIntervalRef.current) {
                clearInterval(demoIntervalRef.current);
            }
        };
    }, []);

    const loadSettings = async () => {
        try {
            const [deviceId, deviceName, audioEnabled, audioMetric] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEYS.LAST_DEVICE_ID),
                AsyncStorage.getItem(STORAGE_KEYS.LAST_DEVICE_NAME),
                AsyncStorage.getItem(STORAGE_KEYS.AUDIO_ENABLED),
                AsyncStorage.getItem(STORAGE_KEYS.AUDIO_METRIC),
            ]);

            if (deviceId) setLastDeviceId(deviceId);
            if (deviceName) setLastDeviceName(deviceName);
            if (audioEnabled) setAudioFeedbackEnabled(audioEnabled === 'true');
            if (audioMetric) setAudioFeedbackMetricState(audioMetric as AudioFeedbackMetric);
        } catch (e) {
            console.error('Error loading biofeedback settings:', e);
        }
    };

    // Handle audio feedback when readings improve
    const handleAudioFeedback = useCallback(async (reading: BiofeedbackReading) => {
        if (!audioFeedbackEnabled || !baselineReading) return;

        const now = Date.now();
        const minInterval = 15000; // 15 seconds between audio cues

        if (now - lastAudioPlayTime.current < minInterval) return;

        let shouldPlay = false;

        if (audioFeedbackMetric === 'hr') {
            // Play if HR dropped by 3+ BPM
            if (baselineReading.hr - reading.hr >= 3) {
                shouldPlay = true;
            }
        } else if (audioFeedbackMetric === 'hrv') {
            // Play if HRV increased by 5+ ms
            if (reading.hrv && baselineReading.hrv && reading.hrv - baselineReading.hrv >= 5) {
                shouldPlay = true;
            }
        }

        if (shouldPlay) {
            lastAudioPlayTime.current = now;
            await playFeedbackSound();
        }
    }, [audioFeedbackEnabled, audioFeedbackMetric, baselineReading]);

    const playFeedbackSound = async () => {
        try {
            // Clean up previous sound
            if (audioSoundRef.current) {
                await audioSoundRef.current.unloadAsync();
            }

            // Create a gentle chime sound using the system
            // In production, you'd load a custom audio file
            const { sound } = await Audio.Sound.createAsync(
                // Using a placeholder - you can add your own audio file
                { uri: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' },
                { volume: 0.3 }
            );

            audioSoundRef.current = sound;
            await sound.playAsync();
        } catch (e) {
            console.log('Audio feedback not available:', e);
        }
    };

    const startScan = async () => {
        if (Platform.OS === 'web') {
            Alert.alert('Not Available', 'Bluetooth is not available on web. Please use a mobile device.');
            return;
        }

        setIsScanning(true);
        setDiscoveredDevices([]);

        try {
            await BiofeedbackService.scanForDevices((device) => {
                setDiscoveredDevices(prev => {
                    // Avoid duplicates
                    if (prev.find(d => d.id === device.id)) return prev;
                    return [...prev, device];
                });
            });
        } catch (e: any) {
            console.error('Scan error:', e);
            Alert.alert('Scan Error', e.message || 'Failed to scan for devices');
        } finally {
            setIsScanning(false);
        }
    };

    const stopScan = () => {
        BiofeedbackService.stopScan();
        setIsScanning(false);
    };

    const connectToDevice = async (deviceId: string) => {
        try {
            const device = await BiofeedbackService.connectToDevice(deviceId);

            // Save as last device
            await AsyncStorage.setItem(STORAGE_KEYS.LAST_DEVICE_ID, deviceId);
            await AsyncStorage.setItem(STORAGE_KEYS.LAST_DEVICE_NAME, device.name || 'Unknown Device');

            setLastDeviceId(deviceId);
            setLastDeviceName(device.name || 'Unknown Device');
            setIsConnected(true);
            setConnectedDevice(device);
        } catch (e: any) {
            console.error('Connection error:', e);
            throw e;
        }
    };

    const disconnectDevice = async () => {
        await BiofeedbackService.disconnectDevice();
        setIsConnected(false);
        setConnectedDevice(null);
        setCurrentReading(null);
    };

    const reconnectLastDevice = async (): Promise<boolean> => {
        if (!lastDeviceId) return false;

        try {
            await connectToDevice(lastDeviceId);
            return true;
        } catch (e) {
            console.log('Failed to reconnect to last device');
            return false;
        }
    };

    const startSessionTracking = () => {
        isTrackingRef.current = true;
        BiofeedbackService.startSession();

        // Set baseline from current reading
        if (currentReading) {
            setBaselineReading(currentReading);
        }
    };

    const stopSessionTracking = (): SessionSummary | null => {
        isTrackingRef.current = false;
        const summary = BiofeedbackService.stopSession();
        setBaselineReading(null);
        return summary;
    };

    const setAudioFeedback = async (enabled: boolean) => {
        setAudioFeedbackEnabled(enabled);
        await AsyncStorage.setItem(STORAGE_KEYS.AUDIO_ENABLED, enabled.toString());
    };

    const setAudioFeedbackMetric = async (metric: AudioFeedbackMetric) => {
        setAudioFeedbackMetricState(metric);
        await AsyncStorage.setItem(STORAGE_KEYS.AUDIO_METRIC, metric);
    };

    // Demo mode for testing UI without a physical device
    const toggleDemoMode = () => {
        if (isDemoMode) {
            // Stop demo mode
            if (demoIntervalRef.current) {
                clearInterval(demoIntervalRef.current);
                demoIntervalRef.current = null;
            }
            setIsDemoMode(false);
            setIsConnected(false);
            setCurrentReading(null);
        } else {
            // Start demo mode
            setIsDemoMode(true);
            setIsConnected(true);
            setConnectedDevice({ id: 'demo', name: 'Demo Device' } as Device);

            // Simulate heart rate data
            let baseHr = 75;
            let baseHrv = 35;

            demoIntervalRef.current = setInterval(() => {
                // Gradually improve values to simulate relaxation
                baseHr = Math.max(55, baseHr - (Math.random() * 0.5));
                baseHrv = Math.min(80, baseHrv + (Math.random() * 0.3));

                const reading: BiofeedbackReading = {
                    hr: Math.round(baseHr + (Math.random() * 4 - 2)),
                    hrv: Math.round(baseHrv + (Math.random() * 6 - 3)),
                    breathRate: Math.round(12 + Math.random() * 4),
                    temperature: null,
                    timestamp: Date.now(),
                };

                setCurrentReading(reading);
                setRecentReadings(prev => {
                    const newHistory = [...prev, reading];
                    return newHistory.length > 60 ? newHistory.slice(newHistory.length - 60) : newHistory;
                });

                // Also call the reading callback for audio feedback
                if (audioFeedbackEnabled && baselineReading) {
                    handleAudioFeedback(reading);
                }
            }, 1000);
        }
    };

    return (
        <BiofeedbackContext.Provider value={{
            isConnected,
            connectedDevice,
            isScanning,
            discoveredDevices,
            lastDeviceId,
            lastDeviceName,
            currentReading,
            baselineReading,
            recentReadings,
            audioFeedbackEnabled,
            audioFeedbackMetric,
            isDemoMode,
            startScan,
            stopScan,
            connectToDevice,
            disconnectDevice,
            reconnectLastDevice,
            startSessionTracking,
            stopSessionTracking,
            setAudioFeedback,
            setAudioFeedbackMetric,
            toggleDemoMode,
        }}>
            {children}
        </BiofeedbackContext.Provider>
    );
}
