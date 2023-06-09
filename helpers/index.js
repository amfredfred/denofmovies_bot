const AdmZip = require('adm-zip')
const https = require('https'); // or 'https' for https:// URLs
const fs = require('fs');


const title = (text) => (text?.toLocaleLowerCase()?.split('title')?.[1]?.split('\n')?.[0] ?? "No Title")?.replace(/\s+/g, ' ')
const sizeInMb = (num) => (num / (1024 * 1024))
const zip = async (fileurl, fileName) => {
    var saved_to_relative_path, willSendthis, file_size, error;
    var zip = new AdmZip();
    saved_to_relative_path = `src\\uploads\\zip\\${fileName}.zip`
    zip.addLocalFile(fileurl, saved_to_relative_path, fileName);
    await zip.writeZipPromise(saved_to_relative_path);
    file_size = `${sizeInMb((await fs.statSync(saved_to_relative_path))?.size).toFixed(2) || 'unknown'}MB`;
    willSendthis = zip.toBuffer();
    fs.unlinkSync(fileurl)
    return { saved_to_relative_path, willSendthis, file_size, error }
}



const dowloader = async (filePath, fileName) => {
    const pathExist = fs.existsSync('tmp/thumbnails')
    if (!pathExist) {
        console.log(__dirname)
        fs.mkdir('tmp/thumbnails',
            { recursive: true }, (err) => {
                if (err) {
                    return console.error(err);
                }
                console.log('Directory created successfully!');
            })
    }

    const temp_path = fileName
    const file = fs.createWriteStream(temp_path)
    const request = https.get(filePath, function (response) { response.pipe(file); });
    return new Promise((resolved => {
        file.on("finish", async () => {
            file.close();
            var temp_size = `${sizeInMb((await fs.statSync(temp_path))?.size).toFixed(2) || 'unknown'}MB`
            resolved({ temp_size, temp_path })
        });
    }))
}

module.exports = { sizeInMb, zip, title, dowloader }