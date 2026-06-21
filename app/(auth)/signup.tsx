import { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Mail, Lock, User } from 'lucide-react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Colors } from '../../constants/Colors';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';

export default function Signup() {
    useProtectedRoute();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'user' | 'therapist'>('user');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function signUpWithEmail() {
        setLoading(true);
        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Update Profile (Display Name)
            await updateProfile(user, {
                displayName: name
            });

            // 3. Create User Document in Firestore
            const { doc, setDoc } = await import('firebase/firestore');
            const { db } = await import('../../lib/firebase');

            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: name,
                createdAt: new Date().toISOString(),
                provider: 'email',
                role: role, // 'user' or 'therapist'
                isPremium: false,
            });

            Alert.alert('Success', 'Account created! Signing you in...');
            // Firebase automatically signs in after creation
            router.replace('/');
        } catch (error: any) {
            console.error("Signup Error:", error);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.form}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join the BE333 Community</Text>

                    <View style={styles.roleContainer}>
                        <Text style={styles.label}>I am a:</Text>
                        <View style={styles.roleButtons}>
                            <TouchableOpacity
                                style={[styles.roleBtn, role === 'user' && styles.roleBtnActive]}
                                onPress={() => setRole('user')}
                            >
                                <Text style={[styles.roleText, role === 'user' && styles.roleTextActive]}>Member</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.roleBtn, role === 'therapist' && styles.roleBtnActive]}
                                onPress={() => setRole('therapist')}
                            >
                                <Text style={[styles.roleText, role === 'therapist' && styles.roleTextActive]}>Therapist</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Input
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        icon={User}
                    />
                    <Input
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        icon={Mail}
                    />
                    <Input
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        icon={Lock}
                    />

                    <Button
                        title="Sign Up"
                        onPress={signUpWithEmail}
                        loading={loading}
                        style={styles.button}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Link href="/(auth)/login" asChild>
                            <Text style={styles.link}>Sign In</Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 150,
        height: 90,
        marginBottom: 10,
    },
    form: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
        color: Colors.text,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        marginTop: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    link: {
        color: Colors.secondary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    roleContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 8,
        marginLeft: 4,
    },
    roleButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    roleBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
        alignItems: 'center',
    },
    roleBtnActive: {
        borderColor: Colors.secondary,
        backgroundColor: 'rgba(255, 215, 0, 0.1)', // Gold tint
    },
    roleText: {
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    roleTextActive: {
        color: Colors.secondary,
        fontWeight: 'bold',
    }
});
