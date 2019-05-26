const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/auth')
const contactCtrl = require('../../controllers/contacts')
const formidable = require('express-formidable')

router.post('/create', authMiddleware, contactCtrl.createContact);
router.post('/edit', authMiddleware, contactCtrl.editContact);
router.post('/delete', authMiddleware, contactCtrl.deleteContact);

router.get('/single/:contactId', authMiddleware, contactCtrl.getSingleContact)
router.post('/upload', authMiddleware, formidable(), contactCtrl.CDphotoupload)
router.post('/all', authMiddleware, contactCtrl.getContacts)

module.exports = router;