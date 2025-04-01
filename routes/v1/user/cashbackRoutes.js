const express = require('express');
const router = express.Router();
const cashbackController = require('../../../controllers/v1/user/cashbackController');
const { authenticateUser } = require('../../../middleware/authMiddleware');

// Get cashback history for a user
router.get('/:userId/history',authenticateUser,cashbackController.getCashbackHistory);

module.exports = router;
