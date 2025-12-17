const Jimp = require('jimp');

async function main() {
    const bgHex = '#1A4331';
    const inputPath = './assets/images/favicon.png';
    const outputPath = './assets/images/favicon_bg.png';

    try {
        const image = await Jimp.read(inputPath);
        const bg = new Jimp(image.bitmap.width, image.bitmap.height, bgHex);

        bg.composite(image, 0, 0);
        await bg.writeAsync(outputPath);
        console.log('Favicon background added successfully.');
    } catch (err) {
        console.error('Error processing image:', err);
    }
}

main();
