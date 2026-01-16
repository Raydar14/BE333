const fs = require('fs');
const path = require('path');

const src = 'assets/images/leaf_floating.png';
const dests = [
    'assets/icon.png',
    'assets/splash-icon.png',
    'assets/adaptive-icon.png',
    'assets/favicon.png'
];

if (fs.existsSync(src)) {
    dests.forEach(d => {
        fs.copyFileSync(src, d);
        console.log(`Copied to ${d}`);
    });
} else {
    console.error('Source not found:', src);
}
