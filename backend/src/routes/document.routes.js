// src/routes/document.routes.js
const express = require('express')
const router  = express.Router()

const docController = require('../controllers/document.controller')
const { protect, restrictTo } = require('../middleware/auth')
const upload = require('../middleware/upload')

// All document routes require login
router.use(protect)

// Students only
router.post('/',          restrictTo('student'), upload.array('files', 10), docController.uploadFiles)
router.get('/',           restrictTo('student'), docController.getMyDocuments)
router.delete('/:id',     restrictTo('student'), docController.deleteDocument)

module.exports = router
