import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { ShimmerButton } from '../../components/ShimmerButton';
import { BreathingLeaves } from '../../components/BreathingLeaves';
import { Leaf } from 'lucide-react-native';
import Svg, { Path, Line } from 'react-native-svg';
import BrandLogo from '../../components/BrandLogo';

// Tree Roots visual connector
function TreeRoots({ color }: { color: string }) {
    return (
        <Svg width={280} height={50} viewBox="0 0 280 50">
            {/* Central trunk */}
            <Line x1="140" y1="0" x2="140" y2="20" stroke={color} strokeWidth="2" />
            {/* Branches to each label */}
            <Path d="M140 20 Q80 20 40 45" stroke={color} strokeWidth="2" fill="none" />
            <Path d="M140 20 L140 45" stroke={color} strokeWidth="2" />
            <Path d="M140 20 Q200 20 240 45" stroke={color} strokeWidth="2" fill="none" />
        </Svg>
    );
}

export default function OnboardingIntro() {
    const router = useRouter();
    const { colors } = useTheme();

    return (
        <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={{ height: 260, alignItems: 'center', justifyContent: 'center', marginBottom: -60 }}>
                            <BrandLogo style={styles.logo} />
                            <BreathingLeaves isActive={true} phase="idle" />
                        </View>

                        <Text style={[styles.title, { color: colors.primary }]}>Welcome to BE.</Text>

                        <Text style={[styles.subtitle, { color: colors.text, paddingHorizontal: 10, lineHeight: 24 }]}>
                            Root your new 3-minute practice in a habit that is already firmly grounded in your daily routine.
                        </Text>

                        <Text style={[styles.description, { color: colors.textSecondary }]}>
                            Choose one habit from each time frame
                        </Text>

                        {/* Detailed Habit Descriptions */}
                        <View style={styles.habitList}>
                            <View style={styles.habitItem}>
                                <Text style={[styles.habitTitle, { color: '#FFD700' }]}>☀️ Rise: Anchoring Energy</Text>
                                <Text style={[styles.habitDesc, { color: '#004d40' }]}>
                                    "Sets the tone" and roots the habit before daily stress begins. It leverages the clarity you have when you first wake up.
                                </Text>
                            </View>

                            <View style={styles.habitItem}>
                                <Text style={[styles.habitTitle, { color: '#FFD700' }]}>🌤️ Reset: Preventing the Slump</Text>
                                <Text style={[styles.habitDesc, { color: '#004d40' }]}>
                                    Serves as a deliberate Reset or recharge point, breaking up the longest work or activity block and helping you overcome the typical afternoon energy dip.
                                </Text>
                            </View>

                            <View style={styles.habitItem}>
                                <Text style={[styles.habitTitle, { color: '#FFD700' }]}>🌙 Rest: Unwind</Text>
                                <Text style={[styles.habitDesc, { color: '#004d40' }]}>
                                    Creates a vital separation between the day's activity and sleep. It uses Rest time to promote reflection and better rest, making winding down easier.
                                </Text>
                            </View>
                        </View>

                        {/* Sample Plan Section */}
                        <View style={styles.samplePlanContainer}>
                            <Text style={[styles.sampleTitle, { color: '#FFD700' }]}>Sample Plan:</Text>
                            <View style={styles.sampleRow}>
                                <Text style={styles.sampleIcon}>☀️</Text>
                                <Text style={[styles.sampleText, { color: colors.textSecondary }]}>
                                    <Text style={{ fontWeight: 'bold' }}>Rise:</Text> After I feed the cats (8am)
                                </Text>
                            </View>
                            <View style={styles.sampleRow}>
                                <Text style={styles.sampleIcon}>🌤️</Text>
                                <Text style={[styles.sampleText, { color: colors.textSecondary }]}>
                                    <Text style={{ fontWeight: 'bold' }}>Reset:</Text> Before Lunch break (12pm)
                                </Text>
                            </View>
                            <View style={styles.sampleRow}>
                                <Text style={styles.sampleIcon}>🌙</Text>
                                <Text style={[styles.sampleText, { color: colors.textSecondary }]}>
                                    <Text style={{ fontWeight: 'bold' }}>Rest:</Text> After eating dinner (7pm)
                                </Text>
                            </View>
                        </View>

                        <ShimmerButton
                            title="Set Up Root Routine"
                            onPress={() => router.push('/onboarding/setup')}
                            style={styles.button}
                            icon={Leaf}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    container: {
        width: '100%',
        maxWidth: 500, // Increased for larger devices/tablets
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 20,
    },
    habitList: {
        width: '100%',
        marginBottom: 20,
        gap: 15,
    },
    habitItem: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    habitTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    habitDesc: {
        fontSize: 14,
        lineHeight: 20,
    },
    button: {
        width: '100%',
    },
    logo: {
        width: 320,
        height: 240,
        marginBottom: 0,
        position: 'absolute',
        zIndex: 10,
    },
    samplePlanContainer: {
        width: '100%',
        backgroundColor: 'rgba(212, 175, 55, 0.1)', // Light gold bg
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    sampleTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sampleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        gap: 10,
    },
    sampleIcon: {
        fontSize: 14,
    },
    sampleText: {
        fontSize: 14,
        fontStyle: 'italic',
    }
});
