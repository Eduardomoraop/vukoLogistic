const { Router } = require('express');
const { createMovement, testDb } = require('../controllers/movementsController');

const router = Router();

router.post('/', createMovement);

module.exports = router;
