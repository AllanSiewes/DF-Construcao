const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', projectController.index);
router.get('/:id', projectController.show);
router.post('/', projectController.create);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.destroy);

module.exports = router;
