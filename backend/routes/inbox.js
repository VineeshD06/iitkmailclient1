const express = require('express');
const router = express.Router();
const { fetchInbox } = require('../controllers/inboxController');

router.post('/inbox', fetchInbox);

module.exports = router;
