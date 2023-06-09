const AdmZip = require('adm-zip')
var fs = require("fs");
const { sizeInMb } = require('./tomb')


const zip = async (fileurl, fileName) => {
    var saved_to_relative_path, willSendthis, file_size, error;

    try {
        var zip = new AdmZip();
        saved_to_relative_path = `src\\uploads\\zip\\${fileName}.zip`
        zip.addLocalFile(fileurl, saved_to_relative_path, fileName);
        await zip.writeZipPromise(saved_to_relative_path);
        file_size = `${sizeInMb((await fs.statSync(saved_to_relative_path))?.size).toFixed(2) || 'unknown'}MB`;
        willSendthis = zip.toBuffer();
        fs.unlinkSync(fileurl)
    } catch (error) {

    }

    return { saved_to_relative_path, willSendthis, file_size, error }
}

module.exports.zip = zip