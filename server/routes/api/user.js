const express = require('express');
const router = express.Router();
const { register, login, auth, logout, fbLogin, accountkitLogin } = require('../../controllers/user')
const { authMiddleware } = require('../../middleware/auth')


router.post('/register', register);
router.post('/login', login);
router.post('/fblogin', fbLogin)
router.get('/auth', authMiddleware, auth)
router.get('/logout', authMiddleware, logout)
router.post('/accountkit', accountkitLogin)

module.exports = router;