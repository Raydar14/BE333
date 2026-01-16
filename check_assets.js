const fs = require('fs');
const path = require('path');

const files = [
    'assets/icon.png',
    'assets/splash-icon.png',
    'assets/adaptive-icon.png',
    'assets/favicon.png'
];

files.forEach(f => {
    try {
        const stats = fs.statSync(f);
        console.log(`${f}: ${stats.size} bytes`);
    } catch (e) {
        console.log(`${f}: Error - ${e.message}`);
    }
});
