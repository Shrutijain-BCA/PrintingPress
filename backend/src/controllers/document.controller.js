// src/controllers/document.controller.js
const Document = require('../models/Document')
const { success, error } = require('../utils/response')
const path = require('path')
const fs   = require('fs')

// ── Upload files ──────────────────────────────────────────────────────────────
exports.uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return error(res, 'No files uploaded.', 400)

    const docs = await Promise.all(
      req.files.map(async (file) => {
        return Document.create({
          user:      req.user._id,
          fileName:  file.originalname,
          fileUrl:   `/uploads/${file.filename}`,
          fileSize:  file.size,
          mimeType:  file.mimetype,
          pageCount: estimatePageCount(file),
        })
      })
    )

    return success(res, { documents: docs }, 'Files uploaded successfully', 201)
  } catch (err) {
    return error(res, err.message)
  }
}

// ── Get user documents ────────────────────────────────────────────────────────
exports.getMyDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ user: req.user._id }).sort({ createdAt: -1 })
    return success(res, { documents: docs })
  } catch (err) {
    return error(res, err.message)
  }
}

// ── Delete document ───────────────────────────────────────────────────────────
exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, user: req.user._id })
    if (!doc) return error(res, 'Document not found.', 404)

    // Delete physical file
    const filePath = path.join(__dirname, '../../', doc.fileUrl)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

    await doc.deleteOne()
    return success(res, null, 'Document deleted')
  } catch (err) {
    return error(res, err.message)
  }
}

// ── Helper: estimate page count by file size/type ─────────────────────────────
function estimatePageCount(file) {
  // Real implementation would use pdf-parse for PDFs.
  // This is a size-based estimate as a placeholder.
  const MB = file.size / (1024 * 1024)
  if (file.mimetype === 'application/pdf') return Math.max(1, Math.round(MB * 10))
  if (file.mimetype.startsWith('image/'))  return 1
  return Math.max(1, Math.round(MB * 5))
}
