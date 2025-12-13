/**
 * DeviceScanner - Modal for scanning and connecting to BLE heart rate devices
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert
} from 'react-native';
import { X, Bluetooth, BluetoothConnected, RefreshCw, Smartphone } from 'lucide-react-native';
import { Device } from 'react-native-ble-plx';
import { useBiofeedback } from '../contexts/BiofeedbackContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './Button';

interface DeviceScannerProps {
    visible: boolean;
    onClose: () => void;
}

export function DeviceScanner({ visible, onClose }: DeviceScannerProps) {
    const { colors } = useTheme();
    const {
        isScanning,
        discoveredDevices,
        isConnected,
        connectedDevice,
        lastDeviceName,
        startScan,
        stopScan,
        connectToDevice,
        disconnectDevice,
        isDemoMode,
        toggleDemoMode,
    } = useBiofeedback();

    const [connecting, setConnecting] = useState<string | null>(null);

    const handleConnect = async (device: Device) => {
        try {
            setConnecting(device.id);
            await connectToDevice(device.id);
            Alert.alert('Connected!', `Successfully connected to ${device.name || 'device'}`);
            onClose();
        } catch (e: any) {
            Alert.alert('Connection Failed', e.message || 'Could not connect to device');
        } finally {
            setConnecting(null);
        }
    };

    const handleDisconnect = async () => {
        await disconnectDevice();
        Alert.alert('Disconnected', 'Device has been disconnected');
    };

    const handleScan = () => {
        if (isScanning) {
            stopScan();
        } else {
            startScan();
        }
    };

    const renderDevice = ({ item }: { item: Device }) => (
        <TouchableOpacity
            style={[styles.deviceItem, { backgroundColor: 'rgba(255,255,255,0.08)' }]}
            onPress={() => handleConnect(item)}
            disabled={connecting !== null}
        >
            <View style={styles.deviceInfo}>
                <Bluetooth size={20} color={colors.primary} />
                <View>
                    <Text style={[styles.deviceName, { color: colors.text }]}>
                        {item.name || 'Unknown Device'}
                    </Text>
                    <Text style={[styles.deviceId, { color: colors.textSecondary }]}>
                        {item.id.substring(0, 17)}...
                    </Text>
                </View>
            </View>

            {connecting === item.id ? (
                <ActivityIndicator color={colors.primary} />
            ) : (
                <Text style={[styles.connectText, { color: colors.primary }]}>
                    Connect
                </Text>
            )}
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: colors.background }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>
                            Heart Rate Devices
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Connected Device */}
                    {isConnected && connectedDevice && (
                        <View style={[styles.connectedSection, { backgroundColor: 'rgba(74, 153, 119, 0.15)' }]}>
                            <View style={styles.connectedInfo}>
                                <BluetoothConnected size={24} color="#4CAF50" />
                                <View>
                                    <Text style={[styles.connectedLabel, { color: colors.textSecondary }]}>
                                        Connected
                                    </Text>
                                    <Text style={[styles.connectedName, { color: colors.text }]}>
                                        {isDemoMode ? 'Demo Mode' : (connectedDevice.name || lastDeviceName || 'Device')}
                                    </Text>
                                </View>
                            </View>
                            <Button
                                title="Disconnect"
                                variant="outline"
                                onPress={isDemoMode ? toggleDemoMode : handleDisconnect}
                                style={styles.disconnectButton}
                                textStyle={{ color: '#FF6B6B', fontSize: 13 }}
                            />
                        </View>
                    )}

                    {/* Scan Button */}
                    {!isConnected && (
                        <TouchableOpacity
                            style={[styles.scanButton, { backgroundColor: colors.primary }]}
                            onPress={handleScan}
                        >
                            {isScanning ? (
                                <>
                                    <ActivityIndicator color="#fff" />
                                    <Text style={styles.scanButtonText}>Scanning...</Text>
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={20} color="#fff" />
                                    <Text style={styles.scanButtonText}>Scan for Devices</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}

                    {/* Discovered Devices */}
                    {!isConnected && (
                        <View style={styles.listContainer}>
                            {discoveredDevices.length > 0 ? (
                                <FlatList
                                    data={discoveredDevices}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderDevice}
                                    contentContainerStyle={styles.list}
                                />
                            ) : (
                                <View style={styles.emptyState}>
                                    <Bluetooth size={48} color={colors.textSecondary} />
                                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                        {isScanning
                                            ? 'Looking for heart rate devices...'
                                            : 'Tap "Scan" to find devices'}
                                    </Text>
                                    <Text style={[styles.hintText, { color: colors.textSecondary }]}>
                                        Make sure your device is in pairing mode
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Demo Mode Button */}
                    <TouchableOpacity
                        style={[styles.demoButton, { borderColor: colors.textSecondary }]}
                        onPress={toggleDemoMode}
                    >
                        <Smartphone size={18} color={colors.textSecondary} />
                        <Text style={[styles.demoText, { color: colors.textSecondary }]}>
                            {isDemoMode ? 'Exit Demo Mode' : 'Try Demo Mode'}
                        </Text>
                    </TouchableOpacity>

                    <Text style={[styles.demoHint, { color: colors.textSecondary }]}>
                        Demo mode simulates heart rate data for testing
                    </Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
    },
    closeButton: {
        padding: 4,
    },
    connectedSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    connectedInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    connectedLabel: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    connectedName: {
        fontSize: 16,
        fontWeight: '600',
    },
    disconnectButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderColor: '#FF6B6B',
    },
    scanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 14,
        borderRadius: 12,
        marginBottom: 16,
    },
    scanButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    listContainer: {
        flex: 1,
        minHeight: 200,
    },
    list: {
        gap: 8,
    },
    deviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
    },
    deviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    deviceName: {
        fontSize: 15,
        fontWeight: '500',
    },
    deviceId: {
        fontSize: 11,
        marginTop: 2,
    },
    connectText: {
        fontSize: 14,
        fontWeight: '600',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 15,
        textAlign: 'center',
    },
    hintText: {
        fontSize: 12,
        textAlign: 'center',
    },
    demoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        marginTop: 16,
    },
    demoText: {
        fontSize: 14,
        fontWeight: '500',
    },
    demoHint: {
        fontSize: 11,
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 10,
    },
});
