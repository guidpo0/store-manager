const rescue = require('express-rescue');
const express = require('express');
const SalesController = require('../controllers/SalesController');
const SalesErrorController = require('../controllers/SalesErrorController');

const router = express.Router();

router.post('/', rescue(SalesController.create));
router.get('/', rescue(SalesController.getAll));
router.get('/:id', rescue(SalesController.getById));
router.put('/:id', rescue(SalesController.update));
router.delete('/:id', rescue(SalesController.remove));

router.use(SalesErrorController);

module.exports = router;
