const https = require('https'); // or 'https' for https:// URLs
const fs = require('fs');
const crypto = require('crypto')
const { sizeInMb } = require('./tomb')


const dowloader = async (filePath, fileName) => {
    const temp_path = `./src/uploads/${fileName}`
    const file = fs.createWriteStream(temp_path);
    const request = https.get(filePath, function (response) { response.pipe(file); });

    return new Promise((resolved => {
        file.on("finish", async () => {
            file.close();
            var temp_size = `${sizeInMb((await fs.statSync(temp_path))?.size).toFixed(2) || 'unknown'}MB`
            resolved({ temp_size, temp_path })
        });
    }))
}

module.exports.dowloader = dowloader