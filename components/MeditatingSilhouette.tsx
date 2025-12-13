import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { View } from 'react-native';

type Props = {
    color?: string;
    size?: number;
    style?: 'fill' | 'outline';
};

export function MeditatingSilhouette({ color = '#2C6E52', size = 300, style = 'fill' }: Props) {
    const strokeProps = style === 'outline' ? {
        fill: "none",
        stroke: color,
        strokeWidth: "2"
    } : {
        fill: color,
        stroke: "none"
    };

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size} viewBox="0 0 200 200">
                {/* Head */}
                <Circle cx="100" cy="40" r="25" {...strokeProps} />

                {/* Neck/Shoulders to Arms */}
                <Path
                    d="M100,65 
                       Q140,65 160,90 
                       Q170,105 165,130 
                       L180,180 
                       Q120,190 100,190 
                       Q80,190 20,180 
                       L35,130 
                       Q30,105 40,90 
                       Q60,65 100,65 Z"
                    {...strokeProps}
                />

                {/* Torso/Legs simplified base */}
                <Path
                    d="M165,130 
                       Q160,160 140,180 
                       Q100,200 60,180 
                       Q40,160 35,130"
                    {...strokeProps}
                />
            </Svg>
        </View>
    );
}
