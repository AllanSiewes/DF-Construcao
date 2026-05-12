const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.get('/dashboard', reportController.dashboard);
router.get('/cashflow', reportController.cashflow);
router.get('/by-category', reportController.byCategory);

module.exports = router;
