const { Router } = require('express');
const { getItems } = require('../controllers/itemsController');

const router = Router();

router.get('/', getItems);

module.exports = router;
