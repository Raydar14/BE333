import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Mail, Lock, Phone, KeyRound } from 'lucide-react-native';
import { signInWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Colors } from '../../constants/Colors';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';

declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
    }
}

export default function Login() {
    useProtectedRoute();
    const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Phone Auth State
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationId, setVerificationId] = useState<ConfirmationResult | null>(null);
    const [phoneStep, setPhoneStep] = useState<'number' | 'otp'>('number');

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (Platform.OS === 'web' && !window.recaptchaVerifier) {
            try {
                // Initialize invisible recaptcha
                window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    'size': 'invisible',
                    'callback': () => { }
                });
            } catch (e) {
                console.log("Recaptcha already initialized or failed", e);
            }
        }
    }, [authMethod]);

    async function signInWithEmail() {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace('/');
        } catch (error: unknown) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Sign in failed');
        } finally {
            setLoading(false);
        }
    }

    async function handleForgotPassword() {
        if (!email) {
            Alert.alert('Email Required', 'Please enter your email address first to reset your password.');
            return;
        }

        setLoading(true);
        try {
            const { sendPasswordResetEmail } = await import('firebase/auth');
            await sendPasswordResetEmail(auth, email);
            Alert.alert('Email Sent', 'Check your email for a link to reset your password.');
        } catch (error: unknown) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    }

    async function signInWithGoogle() {
        if (Platform.OS !== 'web') {
            Alert.alert('Not Supported', 'Google Sign-In is currently only supported on Web.');
            return;
        }

        setLoading(true);
        try {
            const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });
            await signInWithPopup(auth, provider);
            router.replace('/');
        } catch (error: unknown) {
            console.error('Google Sign-In Error:', error);
            Alert.alert('Error', error instanceof Error ? error.message : 'Google sign in failed');
        } finally {
            setLoading(false);
        }
    }

    async function sendVerificationCode() {
        if (Platform.OS !== 'web') {
            Alert.alert('Not Supported', 'Phone verification setup currently for Web only.');
            return;
        }

        if (!phoneNumber) {
            Alert.alert('Error', 'Please enter a valid phone number.');
            return;
        }

        setLoading(true);
        try {
            const appVerifier = window.recaptchaVerifier;
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setVerificationId(confirmationResult);
            setPhoneStep('otp');
            Alert.alert('Code Sent', 'Check your SMS for the verification code.');
        } catch (error: unknown) {
            Alert.alert('Error Sending Code', error instanceof Error ? error.message : 'Could not send code');
            // Reset recaptcha on error so user can try again
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.render().then((widgetId: number) => window.recaptchaVerifier.reset(widgetId));
            }
        } finally {
            setLoading(false);
        }
    }

    async function confirmCode() {
        if (!verificationId) return;

        setLoading(true);
        try {
            await verificationId.confirm(verificationCode);
            router.replace('/');
        } catch {
            Alert.alert('Invalid Code', 'The code you entered is incorrect.');
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
                    <Text style={styles.subtitle}>Pause. Breathe. Be333</Text>
                </View>

                {/* Hidden Recaptcha Div for Web */}
                {Platform.OS === 'web' && <div id="recaptcha-container"></div>}

                <View style={styles.form}>
                    <Text style={styles.title}>Welcome Back</Text>

                    {/* Auth Method Tabs */}
                    <View style={styles.tabs}>
                        <TouchableOpacity
                            style={[styles.tab, authMethod === 'email' && styles.activeTab]}
                            onPress={() => setAuthMethod('email')}
                        >
                            <Text style={[styles.tabText, authMethod === 'email' && styles.activeTabText]}>Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, authMethod === 'phone' && styles.activeTab]}
                            onPress={() => setAuthMethod('phone')}
                        >
                            <Text style={[styles.tabText, authMethod === 'phone' && styles.activeTabText]}>Phone</Text>
                        </TouchableOpacity>
                    </View>

                    {authMethod === 'email' ? (
                        <>
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
                                title="Sign In"
                                onPress={signInWithEmail}
                                loading={loading}
                                style={styles.button}
                            />
                            <TouchableOpacity
                                onPress={handleForgotPassword}
                                style={styles.forgotPasswordContainer}
                            >
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            {phoneStep === 'number' ? (
                                <>
                                    <Input
                                        placeholder="Phone (+1 555 555 5555)"
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                        keyboardType="phone-pad"
                                        icon={Phone}
                                    />
                                    <Button
                                        title="Send Code"
                                        onPress={sendVerificationCode}
                                        loading={loading}
                                        style={styles.button}
                                    />
                                </>
                            ) : (
                                <>
                                    <Text style={styles.infoText}>Enter the code sent to {phoneNumber}</Text>
                                    <Input
                                        placeholder="123456"
                                        value={verificationCode}
                                        onChangeText={setVerificationCode}
                                        keyboardType="number-pad"
                                        icon={KeyRound}
                                    />
                                    <Button
                                        title="Verify Code"
                                        onPress={confirmCode}
                                        loading={loading}
                                        style={styles.button}
                                    />
                                    <TouchableOpacity onPress={() => setPhoneStep('number')} style={styles.backLink}>
                                        <Text style={styles.link}>Change Number</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </>
                    )}

                    {Platform.OS === 'web' && (
                        <>
                            <View style={styles.divider}>
                                <View style={styles.line} />
                                <Text style={styles.orText}>OR</Text>
                                <View style={styles.line} />
                            </View>

                            <Button
                                title="Sign in with Google"
                                onPress={signInWithGoogle}
                                variant="secondary"
                                style={{ marginBottom: 20 }}
                            />
                        </>
                    )}

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <Link href="/(auth)/signup" asChild>
                            <Text style={styles.link}>Sign Up</Text>
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
        marginBottom: 30,
    },
    logo: {
        width: 180,
        height: 100,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.primary,
        fontWeight: '500',
        letterSpacing: 1,
    },
    form: {
        width: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.text,
        textAlign: 'center',
    },
    tabs: {
        flexDirection: 'row',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.primary,
    },
    tabText: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    activeTabText: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    button: {
        marginTop: 10,
    },
    infoText: {
        textAlign: 'center',
        marginBottom: 15,
        color: Colors.textSecondary,
    },
    backLink: {
        alignItems: 'center',
        marginTop: 10,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border
    },
    orText: {
        marginHorizontal: 10,
        color: Colors.textSecondary
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
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
    forgotPasswordContainer: {
        alignItems: 'center',
        marginTop: 15,
    },
    forgotPasswordText: {
        color: Colors.secondary,
        textDecorationLine: 'underline',
        fontSize: 14,
    },
});
