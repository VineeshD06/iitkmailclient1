const express = require('express');
const router = express.Router();
const { sendMail } = require('../controllers/sendController');

router.post('/send', sendMail);

module.exports = router;
