const fs = require('fs');
const path = require('path');

const dir = 'assets/images';
const files = fs.readdirSync(dir);

files.forEach(f => {
    const p = path.join(dir, f);
    try {
        const stats = fs.statSync(p);
        console.log(`${f}: ${stats.size} bytes`);
    } catch (e) {
        console.log(`${f}: Error - ${e.message}`);
    }
});
