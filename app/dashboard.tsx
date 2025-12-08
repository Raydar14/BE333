import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Colors } from '../constants/Colors';
import { Button } from '../components/Button';
import { ProFeatureLock } from '../components/ProFeatureLock';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Dashboard() {
    const { user } = useAuth();
    useProtectedRoute();

    async function handleSignOut() {
        await signOut(auth);
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Your Dashboard</Text>

            {/* Current Challenge Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Current 21-Day Set</Text>
                <Text style={styles.sectionSubtitle}>Focus on the practice, not the outcome.</Text>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>5</Text>
                        <Text style={styles.statLabel}>Days Practiced</Text>
                        <Text style={styles.statSubLabel}>(Unique days with 1+ session)</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Total Sessions</Text>
                        <Text style={styles.statSubLabel}>(In this 21-day set)</Text>
                    </View>
                </View>
            </View>

            {/* Lifetime Stats (Pro) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Lifetime Stats</Text>
                <ProFeatureLock label="Pro Feature">
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>142</Text>
                            <Text style={styles.statLabel}>Total Sessions</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>45</Text>
                            <Text style={styles.statLabel}>Longest Flow</Text>
                        </View>
                    </View>
                </ProFeatureLock>
            </View>

            <Button title="Sign Out" onPress={handleSignOut} variant="outline" style={{ marginTop: 20 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: Colors.background,
        padding: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 30,
        textAlign: 'center',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 5,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 15,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 15,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.surface,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.secondary,
    },
    statLabel: {
        fontSize: 14,
        color: Colors.text,
        fontWeight: '600',
        marginTop: 5,
        textAlign: 'center',
    },
    statSubLabel: {
        fontSize: 10,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: 2,
    }
});
