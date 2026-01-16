const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../assets/images/Main Logo.svg');
const outputPath = path.join(__dirname, '../components/BrandLogo.tsx');

try {
    let svgContent = fs.readFileSync(inputPath, 'utf8');

    // Extract styles from all <style> blocks
    const styleRegex = /<style>([\s\S]*?)<\/style>/g;
    let cssText = '';
    let match;
    while ((match = styleRegex.exec(svgContent)) !== null) {
        cssText += match[1] + '\n';
    }

    // Parse CSS to map class names to inline styles
    const styleMap = {};
    const cssRules = cssText.split('}');

    // Helper to Convert CSS props to React Native SVG props (camelCase)
    const toCamelCase = (prop) => {
        return prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    };

    cssRules.forEach(rule => {
        const [selector, body] = rule.split('{');
        if (selector && body) {
            const cleanSelector = selector.trim().replace('.', '');
            const declarations = body.split(';')
                .map(d => d.trim())
                .filter(d => d)
                .map(d => {
                    const [prop, val] = d.split(':');
                    if (prop && val) {
                        return `${toCamelCase(prop.trim())}="${val.trim().replace(/"/g, "'")}"`; // Use single quotes for values
                    }
                    return '';
                })
                .join(' ');
            styleMap[cleanSelector] = declarations;
        }
    });

    // We no longer need hardcoded overrides for 3s as they are handled by the new SVG content itself.

    // Replace classes with inline styles
    svgContent = svgContent.replace(/class="([^"]+)"/g, (match, className) => {
        if (styleMap[className]) {
            return styleMap[className];
        }
        return match;
    });

    // Remove all style blocks
    svgContent = svgContent.replace(/<style>[\s\S]*?<\/style>/g, '');

    // Remove XML declaration
    svgContent = svgContent.replace(/<\?xml.*?\?>/, '');

    // Escape backticks just in case
    svgContent = svgContent.replace(/`/g, '\\`');

    const componentContent = `import React from 'react';
import { SvgXml } from 'react-native-svg';
import { ViewStyle, StyleProp } from 'react-native';

const xml = \`${svgContent}\`;

interface BrandLogoProps {
  width?: number | string;
  height?: number | string;
  style?: StyleProp<ViewStyle>;
}

export default function BrandLogo({ width = "100%", height = "100%", style }: BrandLogoProps) {
  return <SvgXml xml={xml} width={width} height={height} style={style} />;
}
`;

    fs.writeFileSync(outputPath, componentContent);
    console.log('Successfully created BrandLogo.tsx');

} catch (error) {
    console.error('Error processing SVG:', error);
    process.exit(1);
}
