const mongoose = require('mongoose')

const MoviesSchema = new mongoose.Schema({
    title: { type: String, required: true },
    series: { type: String },
    downloads: { type: Number, default: 0 },
    thumbPath: { type: String },
    uploader: { type: String },
    dateOfRelease: { type: String },
    pathName: { type: String, required: true },
    genre: { type: String },
    season: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Movies', MoviesSchema)