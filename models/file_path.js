const mongoose = require('mongoose')

const FilePathSchema = new mongoose.Schema({
    file_id: { type: String, required: true, unique: true },
    file_type: { type: String, default: 'zip' },
    file_content: { type: Object, },
    file_caption: { type: String, },
    file_size: { type: String, default: 0 },
    file_uploader: { type: String, required: true },
    file_uploaded_from: { type: String, default: "Telegram" },
    file_download_count: { type: String, default: 0 },
    file_relative_path: { type: String, requireed: true },
    file_place_holder: { type: String },
    file_original_size: { type: String, default: 0 },
    file_parent_path: { type: String },
    file_description: { type: String },
    file_thumbnails: { type: String },
    file_download_link: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('FilePath', FilePathSchema)