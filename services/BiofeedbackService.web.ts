
import type { Device } from 'react-native-ble-plx';

export interface BiofeedbackReading {
    hr: number;
    hrv: number | null; // RMSSD in ms
    breathRate: number | null; // Estimated breaths per minute
    temperature: number | null;
    timestamp: number;
}

export interface SessionSummary {
    startReading: BiofeedbackReading;
    endReading: BiofeedbackReading;
    hrChange: number;
    hrvChange: number | null;
    allHrSamples: number[];
    allHrvSamples: number[];
    avgHr: number;
    avgHrv: number | null;
}

class BiofeedbackServiceWeb {
    setOnConnectionChange(callback: (connected: boolean, device: Device | null) => void): void {
        // No-op on web
    }

    setOnReadingCallback(callback: (reading: BiofeedbackReading) => void): void {
        // No-op on web
    }

    destroy(): void {
        // No-op
    }

    async scanForDevices(onDeviceFound: (device: Device) => void): Promise<void> {
        console.warn('Bluetooth scanning is not available in the web version.');
        // Could potentially simulate devices here if needed for testing
    }

    stopScan(): void {
        // No-op
    }

    async connectToDevice(deviceId: string): Promise<Device> {
        throw new Error('Bluetooth connection is not supported on web.');
    }

    async disconnectDevice(): Promise<void> {
        // No-op
    }

    startSession(): void {
        // No-op
    }

    stopSession(): SessionSummary | null {
        return null;
    }

    getConnectedDevice(): Device | null {
        return null;
    }

    isConnected(): boolean {
        return false;
    }
}

// Singleton instance
export const BiofeedbackService = new BiofeedbackServiceWeb();
