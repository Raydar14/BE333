import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { ShimmerButton } from '../../components/ShimmerButton';
import { BreathingLeaves } from '../../components/BreathingLeaves';
import { Leaf } from 'lucide-react-native';
import Svg, { Path, Line } from 'react-native-svg';

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
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={{ height: 200, alignItems: 'center', justifyContent: 'center' }}>
                        <BreathingLeaves isActive={true} />
                    </View>

                    <Text style={[styles.title, { color: colors.primary }]}>Welcome to BE.</Text>

                    <Text style={[styles.subtitle, { color: colors.text }]}>
                        Let's weave mindfulness into the fabric of your day.
                    </Text>

                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                        We'll set up 3 simple pauses linked to habits you already do:
                    </Text>

                    <TreeRoots color={colors.primary} />

                    <View style={styles.steps}>
                        <Text style={[styles.stepProp, { color: colors.text }]}>☀️ Rise</Text>
                        <Text style={[styles.stepProp, { color: colors.text }]}>🌤️ Rest</Text>
                        <Text style={[styles.stepProp, { color: colors.text }]}>🌙 Relax</Text>
                    </View>

                    <ShimmerButton
                        title="Start Linking"
                        onPress={() => router.push('/onboarding/morning')}
                        style={styles.button}
                        icon={Leaf}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
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
    steps: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    stepProp: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        width: '100%',
    }
});
