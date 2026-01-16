import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import { SvgXml } from 'react-native-svg';

type BreathingCircleProps = {
    isActive: boolean;
    size?: number;
    showGuide?: boolean;
    showNature?: boolean; // New prop
    isMinuteMark?: boolean; // Trigger for the minute mark animation
};

const lotusXml = `
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="linear-gradient" x1="207.32" y1="588.62" x2="400.35" y2="588.62" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#B8860B"/>
      <stop offset=".3" stop-color="#FFD700"/>
      <stop offset="1" stop-color="#FDB931"/>
    </linearGradient>
    <linearGradient id="linear-gradient-2" x1="400.35" y1="589.67" x2="595.98" y2="589.67" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FDB931"/>
      <stop offset=".64" stop-color="#FFD700"/>
      <stop offset="1" stop-color="#B8860B"/>
    </linearGradient>
    <linearGradient id="linear-gradient-3" x1="100.32" y1="515.87" x2="400.04" y2="515.87" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#B8860B"/>
      <stop offset=".56" stop-color="#FFD700"/>
      <stop offset="1" stop-color="#FDB931"/>
    </linearGradient>
    <linearGradient id="linear-gradient-4" x1="-7602.52" y1="515.87" x2="-7302.8" y2="515.87" gradientTransform="translate(-6902.44) rotate(-180) scale(1 -1)" xlink:href="#linear-gradient-3"/>
    <linearGradient id="linear-gradient-5" x1="99.93" y1="465.24" x2="369.66" y2="465.24" xlink:href="#linear-gradient"/>
    <linearGradient id="linear-gradient-6" x1="-7506.5" y1="467.85" x2="-7236.77" y2="467.85" gradientTransform="translate(-6808.79) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#B8860B"/>
      <stop offset=".24" stop-color="#FFD700"/>
      <stop offset=".92" stop-color="#FDB931"/>
    </linearGradient>
    <linearGradient id="linear-gradient-7" x1="193.75" y1="426.56" x2="381.24" y2="426.56" xlink:href="#linear-gradient"/>
    <linearGradient id="linear-gradient-8" x1="-7267.71" y1="426.56" x2="-7080.23" y2="426.56" gradientTransform="translate(-6659.6) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#B8860B"/>
      <stop offset=".24" stop-color="#FFD700"/>
      <stop offset="1" stop-color="#FDB931"/>
    </linearGradient>
    <linearGradient id="linear-gradient-9" x1="343.52" y1="319.27" x2="250.18" y2="319.27" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FDB931"/>
      <stop offset=".74" stop-color="#FFD700"/>
      <stop offset="1" stop-color="#B8860B"/>
    </linearGradient>
    <linearGradient id="linear-gradient-10" x1="-7212.21" y1="319.27" x2="-7305.55" y2="319.27" gradientTransform="translate(-6755.33) rotate(-180) scale(1 -1)" xlink:href="#linear-gradient-9"/>
    <linearGradient id="linear-gradient-11" x1="125.94" y1="347.95" x2="185.27" y2="347.95" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#B8860B"/>
      <stop offset=".33" stop-color="#FFD700"/>
    </linearGradient>
    <linearGradient id="linear-gradient-12" x1="193.89" y1="271.34" x2="245.17" y2="271.34" xlink:href="#linear-gradient-11"/>
    <linearGradient id="linear-gradient-13" x1="-7241.42" y1="271.34" x2="-7190.14" y2="271.34" gradientTransform="translate(-6636.9) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#B8860B"/>
      <stop offset=".53" stop-color="#FFD700"/>
    </linearGradient>
    <linearGradient id="linear-gradient-14" x1="-7311.67" y1="347.95" x2="-7252.34" y2="347.95" gradientTransform="translate(-6636.82) rotate(-180) scale(1 -1)" xlink:href="#linear-gradient-13"/>
    <linearGradient id="linear-gradient-15" x1="312.79" y1="231.59" x2="267.21" y2="231.59" xlink:href="#linear-gradient-11"/>
    <linearGradient id="linear-gradient-16" x1="-7207.05" y1="231.59" x2="-7252.63" y2="231.59" gradientTransform="translate(-6719.62) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset=".43" stop-color="#FFD700"/>
      <stop offset="1" stop-color="#B8860B"/>
    </linearGradient>
    <linearGradient id="linear-gradient-17" x1="355.51" y1="156.79" x2="355.51" y2="310.36" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#B8860B"/>
      <stop offset=".47" stop-color="#FFD700"/>
      <stop offset="1" stop-color="#FDB931"/>
    </linearGradient>
    <linearGradient id="linear-gradient-18" x1="-7210.61" y1="310.36" x2="-7210.61" y2="156.79" gradientTransform="translate(-6765.35) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FDB931"/>
      <stop offset=".53" stop-color="#FFD700"/>
      <stop offset="1" stop-color="#B8860B"/>
    </linearGradient>
    <linearGradient id="linear-gradient-19" x1="399.77" y1="534.99" x2="399.77" y2="268.38" gradientUnits="userSpaceOnUse">
      <stop offset=".29" stop-color="#FDB931"/>
      <stop offset="1" stop-color="#FFD700"/>
    </linearGradient>
  </defs>
  <path fill="url(#linear-gradient)" d="M334.7,551.07c-28.03,2.45-60.52,22.27-80.71,40.9-14.49,11.56-25.21,22.37-46.67,20.63,5.46,3.64,13.84,8.4,24.85,11.53,11.45,3.26,21.93,3.67,36.32,2.56,15.21-1.17,38.08-4.3,66.21-13.31,2.61-1,5.42-2.22,8.37-3.71,3.16-1.59,5.97-3.23,8.46-4.83,5.62-3.42,11.98-7.89,18.47-13.7,10.52-9.43,17.77-19.15,22.62-26.9,1.03-1.5,2.17-3.07,3.43-4.67,1.46-1.84,2.9-3.52,4.3-5.03,0-1.52,0-3.04,0-4.57-21.89.36-43.77.72-65.66,1.08Z"/>
  <path fill="url(#linear-gradient-2)" d="M468.6,553.76c11.14,2.84,51.46,17.58,80.71,40.9,14.49,11.56,25.21,22.37,46.67,20.63-5.46,3.64-13.84,8.4-24.85,11.53-11.45,3.26-21.93,3.67-36.32,2.56-15.21-1.17-38.08-4.3-66.21-13.31-2.61-1-5.42-2.22-8.37-3.71-3.16-1.59-5.97-3.23-8.46-4.83-5.62-3.42-11.98-7.89-18.47-13.7-10.52-9.43-17.77-19.15-22.62-26.9-.4-.64-1.44-2.57-3.43-4.67-2.52-2.66-5.18-4.19-6.89-5.03,0-1.52,0-3.04,0-4.57,31.02-6.07,54.17-2.51,68.25,1.08Z"/>
  <path fill="url(#linear-gradient-3)" d="M100.33,496.23c-.37-3.65,6.95-8.69,10.83-10.96,50.07-29.63,41.41,15.27,125.4,43.61,13.29,4.48,22.54,7.29,41.69,11.2,35.12,7.16,69.61,14.2,98.44,9.41,0,0,21.28-3.53,23.03.98.12.31.7,2.09-.1,2.88-.37.37-1.14.37-2.67.36-1.94-.01-2.92-.02-3.11-.03-2.34-.08-3.97.22-4.75.3-1.43.15-2.48.32-2.61.33-39.54,5.98-130.07-4.31-130.07-4.31-3.19-.36-8.57-.98-15.3-1.82-17.78-1.85-31.27-5.81-39.92-8.87-34.14-12.06-54.96-31.9-73.93-32.9-2.16-.11-10.25-.28-18.95-4.79-3.75-1.94-6.46-4.09-7.99-5.41Z"/>
  <path fill="url(#linear-gradient-4)" d="M700.06,496.23c.37-3.65-6.95-8.69,10.83-10.96-50.07-29.63,41.41,15.27-125.4,43.61-13.29,4.48-22.54,7.29-41.69,11.2-35.12,7.16-69.61,14.2-98.44,9.41,0,0-21.28-3.53-23.03.98-.12.31-.7,2.09.1,2.88.37.37,1.14.37,2.67.36-1.94-.01-2.92-.02-3.11-.03-2.34-.08-3.97.22-4.75.3-1.43.15-2.48.32-2.61.33-39.54,5.98-130.07-4.31,130.07-4.31-3.19-.36-8.57-.98-15.3-1.82-17.78-1.85-31.27-5.81-39.92-8.87-34.14-12.06-54.96-31.9-73.93-32.9-2.16-.11-10.25-.28-18.95-4.79-3.75-1.94,6.46-4.09-7.99-5.41Z"/>
  <path fill="url(#linear-gradient-5)" d="M99.97,404.84c.67-1.52,3.91-2.81,5.97-3.41,18.58-5.84,80.93-16.13,90.17,6.12,4.28,8.2,10.28,19.14,15.18,27.86,21.21,36.21,60.29,61.5,96.86,81.16,17.54,8.57,38,12.14,56.62,17.65,3.08.9,5.05,1.66,4.87,2.13-70.3,2.76-148.76-21.59-200.21-68.61-10.45-9.35-20.09-18.94-30.12-29.05-9.42-9.25-18.34-18.57-28.58-26.36-4.36-3.25-10.54-4.46-10.8-7.32l.04-.18Z"/>
  <path fill="url(#linear-gradient-6)" d="M697.67,407.45c-.67-1.52-3.91-2.81-5.97-3.41-18.58-5.84-80.93-16.13-90.17,6.12-4.28,8.2-10.28,19.14-15.18,27.86-21.21,36.21-60.29,61.5-96.86,81.16-17.54,8.57-38,12.14-56.62,17.65-3.08.9-5.05,1.66-4.87,2.13,70.3,2.76-148.76-21.59-200.21-68.61-10.45-9.35-20.09-18.94-30.12-29.05-9.42-9.25-18.34-18.57-28.58-26.36-4.36-3.25-10.54-4.46-10.8-7.32l-.04-.18Z"/>
  <path fill="url(#linear-gradient-7)" d="M195.66,322.73c-2.23,1.36-2.09,6.64-1.62,10.12,1.39,9.95,3.18,22.56,5.18,32.79,5.67,23.9,18.17,46.14,32.16,67.05,16.02,25.24,36.98,47.8,62.97,62.78,14.23,8.1,34.52,19.29,48.27,27.01,5.02,2.82,15.04,8.21,16.15,8.03,1.18.09-.22-1.52-3.71-4.21-22.14-15.37-45.89-29.75-64.69-49.37-28.6-31-51.41-69.79-63.1-110.07,16.75,38.88,41.68,75.84,70.92,106.78,18.84,18.84,39.96,34.13,62.45,48.25,8.35,4.79,30.55,19.83,15.47-1.31-15.8-22.81-27.67-48.39-35.94-74.6-6.21-16.91-1.6-37.55-10.68-53.33-13.91-18.45-33.41-31.45-53.14-44.48-19.74-11.92-41.98-20.37-64.39-24.89-4.87-.87-12.01-3.01-16.08-.72l-.22.16Z"/>
  <path fill="url(#linear-gradient-8)" d="M606.21,322.73c2.23,1.36,2.09,6.64,1.62,10.12-1.39,9.95-3.18,22.56-5.18,32.79-5.67,23.9-18.17,46.14-32.16,67.05-16.02,25.24-36.98,47.8-62.97,62.78-14.23,8.1-34.52,19.29-48.27,27.01-5.02,2.82,15.04,8.21,16.15,8.03,1.18.09.22-1.52,3.71-4.21,22.14-15.37,45.89-29.75,64.69-49.37,28.6-31,51.41-69.79-63.1-110.07-16.75,38.88-41.68,75.84-70.92,106.78-18.84,18.84,39.96,34.13,62.45,48.25,8.35,4.79,30.55,19.83,15.47-1.31,15.8-22.81-27.67-48.39-35.94-74.6,6.21-16.91-1.6-37.55-10.68-53.33-13.91-18.45-33.41-31.45-53.14-44.48-19.74-11.92-41.98-20.37-64.39-24.89-4.87-.87-12.01-3.01-16.08-.72l.22.16Z"/>
  <path fill="url(#linear-gradient-9)" d="M259.22,265.25l-9.04,52.81s68.15,24.71,81.71,55.23l11.63-42.63s-14.53-34.4-84.3-65.41Z"/>
  <path fill="url(#linear-gradient-10)" d="M541.17,265.25l9.04,52.81s-68.15,24.71-81.71,55.23l-11.63-42.63s14.53-34.4,84.3-65.41Z"/>
  <path fill="url(#linear-gradient-11)" d="M125.94,319.27s36.64,35.98,35.33,57.36h23.99l-6.98-57.36h-52.35Z"/>
  <path fill="url(#linear-gradient-12)" d="M193.89,236.06c1.45,2.85,11.3,16.28,12.42,25.17.61,11.55.25,34.34.85,43.14.27,3.55,6.31,1.82,9.48,2.24,4.13-.02,10.01.08,13.6-.08,1.52-.15,2.22-.32,2.72-1.58,1.41-5.04,7.65-31.38,10.75-43.93.52-2.15.95-3.88,1.22-5.05.46-1.72.33-2.54-1.28-3.07-5.16-1.67-39.6-14.04-49.75-16.89l-.02.06Z"/>
  <path fill="url(#linear-gradient-13)" d="M604.52,236.06c-1.45,2.85-11.3,16.28-12.42,25.17-.61,11.55-.25,34.34-.85,43.14-.27,3.55-6.31,1.82-9.48,2.24-4.13-.02,10.01.08-13.6-.08-1.52-.15-2.22-.32-2.72-1.58-1.41-5.04-7.65-31.38-10.75-43.93-.52-2.15-.95-3.88-1.22-5.05.46-1.72-.33-2.54,1.28-3.07,5.16-1.67-39.6-14.04-49.75-16.89l.02.06Z"/>
  <path fill="url(#linear-gradient-14)" d="M674.85,319.27s-36.64,35.98-35.33,57.36h-23.99s6.98-57.36,6.98-57.36h52.35Z"/>
  <path fill="url(#linear-gradient-15)" d="M277.27,197.93s-5.03,44.39-10.06,46.17l31.08,21.15,14.5-32.4s-21.01-29.89-35.52-34.92Z"/>
  <path fill="url(#linear-gradient-16)" d="M522.94,197.93s5.03,44.39,10.06,46.17l-31.08,21.15-14.5-32.4s21.01-29.89,35.52-34.92Z"/>
  <path fill="url(#linear-gradient-17)" d="M309.91,271.34s39.85,36.89,39.85,39.02c5.29-9.39,11.82-19.69,19.88-30.36,10.72-14.2,21.63-25.75,31.47-34.93-.25-29.43-.5-58.85-.75-88.28-31.18,30.01-67.32,70.12-90.45,114.55Z"/>
  <path fill="url(#linear-gradient-18)" d="M490.48,271.34s-39.85,36.89-39.85,39.02c-5.25-9.36-11.77-19.66-19.88-30.36-10.48-13.83-21.13-25.04-30.71-33.94v-89.27c31.18,30.01,67.32,70.12,90.45,114.55Z"/>
  <path fill="url(#linear-gradient-19)" d="M400.04,268.38c-57.28,50.81-73.34,182.26,0,266.61,47.34-62.31,80.28-179.15,0-266.61Z"/>
</svg>
`;

export function BreathingCircle({ isActive, size = 400, showGuide = false, showNature = true, isMinuteMark = false }: BreathingCircleProps) {
    const lotusScale = useRef(new Animated.Value(1.0)).current;
    const glowOpacity = useRef(new Animated.Value(1)).current;

    // Y-offset specifically for the minute-mark float
    const lotusFloatY = useRef(new Animated.Value(0)).current;

    // Text Opacities
    const exhaleTextOpacity = useRef(new Animated.Value(0)).current;
    const inhaleTextOpacity = useRef(new Animated.Value(0)).current;

    // Effect to handle Minute Mark Float Animation
    useEffect(() => {
        if (isActive && isMinuteMark) {
            // Float UP and Down sequence
            Animated.sequence([
                Animated.timing(lotusFloatY, {
                    toValue: -80, // Float up 80px
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(lotusFloatY, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [isMinuteMark, isActive]);

    useEffect(() => {
        if (!isActive) {
            lotusScale.setValue(1.0);
            glowOpacity.setValue(1);
            exhaleTextOpacity.setValue(0);
            inhaleTextOpacity.setValue(0);
            lotusFloatY.setValue(0);
            return;
        }

        const breathingCycle = () => {
            Animated.sequence([
                // EXHALE (6.5s)
                Animated.parallel([
                    Animated.timing(lotusScale, {
                        toValue: 0.4,
                        duration: 6500,
                        easing: Easing.bezier(0.4, 0, 0.2, 1),
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowOpacity, {
                        toValue: 0.5,
                        duration: 6500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    // Show Exhale Text
                    Animated.sequence([
                        Animated.timing(exhaleTextOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
                        Animated.delay(4500),
                        Animated.timing(exhaleTextOpacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
                    ]),
                ]),
                // Pause
                Animated.delay(500),

                // INHALE (4.0s)
                Animated.parallel([
                    Animated.timing(lotusScale, {
                        toValue: 1.0,
                        duration: 4000,
                        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowOpacity, {
                        toValue: 1,
                        duration: 4000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    // Show Inhale Text
                    Animated.sequence([
                        Animated.timing(inhaleTextOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                        Animated.delay(2500),
                        Animated.timing(inhaleTextOpacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
                    ]),
                ]),
                // Pause
                Animated.delay(500),
            ]).start(() => {
                if (isActive) breathingCycle();
            });
        };

        breathingCycle();

        return () => {
            lotusScale.stopAnimation();
            glowOpacity.stopAnimation();
            exhaleTextOpacity.stopAnimation();
            inhaleTextOpacity.stopAnimation();
        };
    }, [isActive]);

    if (!isActive) return null;

    return (
        <View style={[styles.container, { width: size, height: size }]} pointerEvents="none">
            {/* Animated Container (Scales with Breath + Floats on minute mark) */}
            <Animated.View
                style={[
                    styles.lotusContainer,
                    {
                        width: size,
                        height: size,
                        opacity: glowOpacity,
                        transform: [
                            { scale: lotusScale },
                            { translateY: lotusFloatY } // Add vertical float transform
                        ],
                    }
                ]}
            >
                {/* Central Lotus (Always Visible) */}
                <SvgXml
                    xml={lotusXml}
                    width={size}
                    height={size}
                />
            </Animated.View>

            {/* Guide Text Overlay - Should it float too? Probably. */}
            {showGuide && (
                <Animated.View style={[StyleSheet.absoluteFillObject, { transform: [{ translateY: lotusFloatY }] }]}>
                    <Animated.View style={[styles.textContainer, { opacity: exhaleTextOpacity }]}>
                        <Text style={styles.guideText}>Breathe Out</Text>
                        <Text style={styles.guideSubText}>Shrink Your Belly</Text>
                    </Animated.View>

                    <Animated.View style={[styles.textContainer, { opacity: inhaleTextOpacity }]}>
                        <Text style={styles.guideText}>Breathe In</Text>
                        <Text style={styles.guideSubText}>Expand Your Belly</Text>
                    </Animated.View>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    lotusContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    lotusImage: {
        // dimensions set via props
    },
    textContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    guideText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
        marginBottom: 8,
    },
    guideSubText: {
        color: '#E0E0E0',
        fontSize: 18,
        fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    }
});
