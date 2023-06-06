var FileSaver = require('file-saver');

const saveFileAs = (urlOrPath, fileName) => {
    const saved = FileSaver.saveAs(urlOrPath, `/src/temps/${fileName}`);
    console.log('FGHJKL:"FGHJKL: ')
    return saved
}

module.exports.saveAs = saveFileAs