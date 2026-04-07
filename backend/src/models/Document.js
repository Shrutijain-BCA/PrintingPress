// src/models/Document.js
const mongoose = require('mongoose')

const documentSchema = new mongoose.Schema(
  {
    user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName:  { type: String, required: true },
    fileUrl:   { type: String, required: true },  // local path or cloud URL
    fileSize:  { type: Number, required: true },   // bytes
    mimeType:  { type: String, required: true },
    pageCount: { type: Number, default: 1 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Document', documentSchema)
