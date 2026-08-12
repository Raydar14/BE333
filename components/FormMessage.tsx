import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export interface FormMessageState {
    type: 'error' | 'success';
    title?: string;
    message: string;
}

interface FormMessageProps {
    state: FormMessageState | null;
}

// Alert.alert() de React Native es un no-op en web (react-native-web lo
// implementa como una clase vacía), así que en be333.app nunca se veía
// nada cuando login/signup fallaban. Este componente reemplaza esos
// Alert.alert por un banner inline que funciona en cualquier plataforma.
export function FormMessage({ state }: FormMessageProps) {
    if (!state) return null;
    const isError = state.type === 'error';
    return (
        <View style={[styles.container, isError ? styles.errorContainer : styles.successContainer]}>
            {state.title && (
                <Text style={[styles.title, isError ? styles.errorText : styles.successText]}>
                    {state.title}
                </Text>
            )}
            <Text style={[styles.message, isError ? styles.errorText : styles.successText]}>
                {state.message}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        borderWidth: 1,
        padding: 12,
        marginBottom: 14,
    },
    errorContainer: {
        backgroundColor: 'rgba(255, 59, 48, 0.12)',
        borderColor: Colors.error,
    },
    successContainer: {
        backgroundColor: 'rgba(52, 199, 89, 0.12)',
        borderColor: Colors.success,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 2,
    },
    message: {
        fontSize: 13,
        lineHeight: 18,
    },
    errorText: {
        color: Colors.error,
    },
    successText: {
        color: Colors.success,
    },
});
