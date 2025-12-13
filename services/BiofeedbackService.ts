/**
 * BiofeedbackService - BLE operations for heart rate monitors
 * 
 * Supports standard Bluetooth Heart Rate Service (0x180D)
 * with HRV calculated from RR-intervals in the measurement characteristic
 */

import { BleManager, Device, Characteristic, State } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';
import { decode } from 'base-64';

// Standard Bluetooth GATT UUIDs
const HEART_RATE_SERVICE_UUID = '0000180d-0000-1000-8000-00805f9b34fb';
const HEART_RATE_MEASUREMENT_UUID = '00002a37-0000-1000-8000-00805f9b34fb';
const BODY_SENSOR_LOCATION_UUID = '00002a38-0000-1000-8000-00805f9b34fb';

// Health Thermometer Service (optional)
const TEMPERATURE_SERVICE_UUID = '00001809-0000-1000-8000-00805f9b34fb';
const TEMPERATURE_MEASUREMENT_UUID = '00002a1c-0000-1000-8000-00805f9b34fb';

export interface HeartRateData {
    heartRate: number;
    rrIntervals: number[]; // in ms
    timestamp: number;
}

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

class BiofeedbackServiceClass {
    private bleManager: BleManager | null = null;
    private connectedDevice: Device | null = null;
    private hrSubscription: any = null;
    private tempSubscription: any = null;

    // Session tracking
    private sessionReadings: BiofeedbackReading[] = [];
    private rrBuffer: number[] = []; // Buffer for HRV calculation
    private isTracking: boolean = false;

    // Callbacks
    private onReadingCallback: ((reading: BiofeedbackReading) => void) | null = null;
    private onConnectionChange: ((connected: boolean, device: Device | null) => void) | null = null;

    constructor() {
        // Lazy initialization to prevent crashes on web/Expo Go
    }

    private getManager(): BleManager | null {
        if (Platform.OS === 'web') return null;

        if (!this.bleManager) {
            try {
                this.bleManager = new BleManager();
            } catch (e) {
                console.warn('Failed to initialize BleManager:', e);
                return null;
            }
        }
        return this.bleManager;
    }

    /**
     * Request necessary permissions for BLE
     */
    async requestPermissions(): Promise<boolean> {
        if (Platform.OS === 'android') {
            const apiLevel = Platform.Version;

            if (apiLevel >= 31) {
                // Android 12+
                const results = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ]);

                return Object.values(results).every(
                    result => result === PermissionsAndroid.RESULTS.GRANTED
                );
            } else {
                // Android 11 and below
                const result = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                return result === PermissionsAndroid.RESULTS.GRANTED;
            }
        }

        // iOS permissions handled via Info.plist
        return true;
    }

    /**
     * Check if Bluetooth is enabled
     */
    async isBluetoothEnabled(): Promise<boolean> {
        const manager = this.getManager();
        if (!manager) return false;

        try {
            const state = await manager.state();
            return state === State.PoweredOn;
        } catch (e) {
            return false;
        }
    }

    /**
     * Wait for Bluetooth to be ready
     */
    async waitForBluetooth(): Promise<boolean> {
        const manager = this.getManager();
        if (!manager) return false;

        return new Promise((resolve) => {
            const subscription = manager.onStateChange((state) => {
                if (state === State.PoweredOn) {
                    subscription.remove();
                    resolve(true);
                }
            }, true);

            // Timeout after 10 seconds
            setTimeout(() => {
                subscription.remove();
                resolve(false);
            }, 10000);
        });
    }

    /**
     * Scan for heart rate devices
     */
    async scanForDevices(
        onDeviceFound: (device: Device) => void,
        timeoutMs: number = 10000
    ): Promise<void> {
        const manager = this.getManager();
        if (!manager) {
            throw new Error('Bluetooth not available on this device');
        }

        const hasPermission = await this.requestPermissions();
        if (!hasPermission) {
            throw new Error('Bluetooth permissions not granted');
        }

        const isEnabled = await this.isBluetoothEnabled();
        if (!isEnabled) {
            const ready = await this.waitForBluetooth();
            if (!ready) {
                throw new Error('Bluetooth not available');
            }
        }

        const discoveredIds = new Set<string>();

        return new Promise((resolve, reject) => {
            manager.startDeviceScan(
                [HEART_RATE_SERVICE_UUID],
                { allowDuplicates: false },
                (error, device) => {
                    if (error) {
                        manager.stopDeviceScan();
                        reject(error);
                        return;
                    }

                    if (device && device.id && !discoveredIds.has(device.id)) {
                        discoveredIds.add(device.id);
                        onDeviceFound(device);
                    }
                }
            );

            // Stop scanning after timeout
            setTimeout(() => {
                manager.stopDeviceScan();
                resolve();
            }, timeoutMs);
        });
    }

    /**
     * Stop active scan
     */
    stopScan(): void {
        this.getManager()?.stopDeviceScan();
    }

    /**
     * Connect to a heart rate device
     */
    async connectToDevice(deviceId: string): Promise<Device> {
        const manager = this.getManager();
        if (!manager) {
            throw new Error('Bluetooth not available');
        }

        // Disconnect existing device first
        if (this.connectedDevice) {
            await this.disconnectDevice();
        }

        const device = await manager.connectToDevice(deviceId);
        await device.discoverAllServicesAndCharacteristics();

        this.connectedDevice = device;

        // Set up disconnection listener
        device.onDisconnected((error, disconnectedDevice) => {
            console.log('Device disconnected:', disconnectedDevice?.name);
            this.connectedDevice = null;
            this.onConnectionChange?.(false, null);
        });

        this.onConnectionChange?.(true, device);

        // Start monitoring heart rate
        await this.subscribeToHeartRate();

        return device;
    }

    /**
     * Disconnect from current device
     */
    async disconnectDevice(): Promise<void> {
        if (this.hrSubscription) {
            this.hrSubscription.remove();
            this.hrSubscription = null;
        }

        if (this.tempSubscription) {
            this.tempSubscription.remove();
            this.tempSubscription = null;
        }

        if (this.connectedDevice) {
            try {
                await this.connectedDevice.cancelConnection();
            } catch (e) {
                // Device might already be disconnected
            }
            this.connectedDevice = null;
        }

        this.onConnectionChange?.(false, null);
    }

    /**
     * Subscribe to heart rate measurement notifications
     */
    private async subscribeToHeartRate(): Promise<void> {
        if (!this.connectedDevice) return;

        this.hrSubscription = this.connectedDevice.monitorCharacteristicForService(
            HEART_RATE_SERVICE_UUID,
            HEART_RATE_MEASUREMENT_UUID,
            (error, characteristic) => {
                if (error) {
                    console.error('HR monitoring error:', error);
                    return;
                }

                if (characteristic?.value) {
                    const data = this.parseHeartRateMeasurement(characteristic.value);
                    this.processHeartRateData(data);
                }
            }
        );
    }

    /**
     * Parse the Heart Rate Measurement characteristic value
     * Format defined by Bluetooth GATT specification
     */
    private parseHeartRateMeasurement(base64Value: string): HeartRateData {
        const buffer = this.base64ToBuffer(base64Value);
        const flags = buffer[0];

        // Bit 0: Heart Rate Value Format (0 = UINT8, 1 = UINT16)
        const isHr16Bit = (flags & 0x01) !== 0;

        // Bit 4: RR-Interval (0 = not present, 1 = present)
        const hasRrInterval = (flags & 0x10) !== 0;

        let offset = 1;
        let heartRate: number;

        if (isHr16Bit) {
            heartRate = buffer[offset] | (buffer[offset + 1] << 8);
            offset += 2;
        } else {
            heartRate = buffer[offset];
            offset += 1;
        }

        // Skip Energy Expended if present (bit 3)
        if ((flags & 0x08) !== 0) {
            offset += 2;
        }

        // Extract RR-Intervals
        const rrIntervals: number[] = [];
        if (hasRrInterval) {
            while (offset + 1 < buffer.length) {
                // RR-Interval is in 1/1024 seconds, convert to ms
                const rrRaw = buffer[offset] | (buffer[offset + 1] << 8);
                const rrMs = (rrRaw / 1024) * 1000;
                rrIntervals.push(rrMs);
                offset += 2;
            }
        }

        return {
            heartRate,
            rrIntervals,
            timestamp: Date.now()
        };
    }

    /**
     * Process incoming heart rate data
     */
    private processHeartRateData(data: HeartRateData): void {
        // Add RR intervals to buffer for HRV calculation
        this.rrBuffer.push(...data.rrIntervals);

        // Keep only last 60 seconds of RR intervals (roughly 60-120 intervals)
        if (this.rrBuffer.length > 120) {
            this.rrBuffer = this.rrBuffer.slice(-120);
        }

        // Calculate HRV (RMSSD) from recent RR intervals
        const hrv = this.calculateHRV(this.rrBuffer);

        // Estimate breath rate from HRV patterns (optional, less accurate)
        const breathRate = this.estimateBreathRate(this.rrBuffer);

        const reading: BiofeedbackReading = {
            hr: data.heartRate,
            hrv: hrv,
            breathRate: breathRate,
            temperature: null, // Would come from temp sensor
            timestamp: data.timestamp
        };

        // Store reading if tracking session
        if (this.isTracking) {
            this.sessionReadings.push(reading);
        }

        // Notify callback
        this.onReadingCallback?.(reading);
    }

    /**
     * Calculate HRV using RMSSD method
     * RMSSD = Root Mean Square of Successive Differences
     */
    private calculateHRV(rrIntervals: number[]): number | null {
        if (rrIntervals.length < 2) return null;

        let sumSquaredDiffs = 0;
        let count = 0;

        for (let i = 1; i < rrIntervals.length; i++) {
            const diff = rrIntervals[i] - rrIntervals[i - 1];

            // Filter out artifacts (unrealistic changes > 300ms)
            if (Math.abs(diff) < 300) {
                sumSquaredDiffs += diff * diff;
                count++;
            }
        }

        if (count === 0) return null;

        return Math.sqrt(sumSquaredDiffs / count);
    }

    /**
     * Estimate breath rate from HRV patterns
     * Uses respiratory sinus arrhythmia (RSA), less reliable than direct measurement
     */
    private estimateBreathRate(rrIntervals: number[]): number | null {
        if (rrIntervals.length < 10) return null;

        // Simple peak detection in RR intervals
        // Breathing causes cyclical changes in heart rate
        let peaks = 0;
        const lookback = Math.min(rrIntervals.length, 60);
        const recent = rrIntervals.slice(-lookback);

        for (let i = 2; i < recent.length - 2; i++) {
            if (
                recent[i] > recent[i - 1] &&
                recent[i] > recent[i - 2] &&
                recent[i] > recent[i + 1] &&
                recent[i] > recent[i + 2]
            ) {
                peaks++;
            }
        }

        // Estimate time span covered
        const totalMs = recent.reduce((a, b) => a + b, 0);
        const minutes = totalMs / 60000;

        if (minutes < 0.1) return null;

        return Math.round(peaks / minutes);
    }

    /**
     * Start tracking a session
     */
    startSession(): void {
        this.sessionReadings = [];
        this.isTracking = true;
    }

    /**
     * Stop tracking and return session summary
     */
    stopSession(): SessionSummary | null {
        this.isTracking = false;

        if (this.sessionReadings.length < 2) {
            return null;
        }

        const startReading = this.sessionReadings[0];
        const endReading = this.sessionReadings[this.sessionReadings.length - 1];

        const allHrSamples = this.sessionReadings.map(r => r.hr);
        const allHrvSamples = this.sessionReadings
            .filter(r => r.hrv !== null)
            .map(r => r.hrv!);

        const avgHr = allHrSamples.reduce((a, b) => a + b, 0) / allHrSamples.length;
        const avgHrv = allHrvSamples.length > 0
            ? allHrvSamples.reduce((a, b) => a + b, 0) / allHrvSamples.length
            : null;

        return {
            startReading,
            endReading,
            hrChange: endReading.hr - startReading.hr,
            hrvChange: (startReading.hrv && endReading.hrv)
                ? endReading.hrv - startReading.hrv
                : null,
            allHrSamples,
            allHrvSamples,
            avgHr,
            avgHrv
        };
    }

    /**
     * Set callback for new readings
     */
    setOnReadingCallback(callback: (reading: BiofeedbackReading) => void): void {
        this.onReadingCallback = callback;
    }

    /**
     * Set callback for connection changes
     */
    setOnConnectionChange(callback: (connected: boolean, device: Device | null) => void): void {
        this.onConnectionChange = callback;
    }

    /**
     * Get connected device
     */
    getConnectedDevice(): Device | null {
        return this.connectedDevice;
    }

    /**
     * Check if connected
     */
    isConnected(): boolean {
        return this.connectedDevice !== null;
    }

    /**
     * Utility: Convert base64 to Uint8Array
     */
    private base64ToBuffer(base64: string): Uint8Array {
        const binaryString = decode(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    /**
     * Clean up resources
     */
    destroy(): void {
        this.disconnectDevice();
        this.getManager()?.destroy();
    }
}

// Singleton instance
export const BiofeedbackService = new BiofeedbackServiceClass();
