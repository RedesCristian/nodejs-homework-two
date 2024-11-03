const express = require('express');
const router = express.Router();
const { signup, login, logout, getCurrentUser } = require('../../controllers/users');
const authMiddleware = require('../../middleware/auth');
const upload = require('../../middleware/uploadsMidleware');
const users = require('../../controllers/users');

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', authMiddleware, logout); // protejată cu middleware
router.get('/current', authMiddleware, getCurrentUser); // protejată cu middleware
router.post('/upload-avatar', upload.single('avatar'), users.uploadAvatar)

module.exports = router;
