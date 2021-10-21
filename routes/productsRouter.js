const rescue = require('express-rescue');
const express = require('express');
const ProductsController = require('../controllers/ProductsController');
const ProductsErrorController = require('../controllers/ProductsErrorController');

const router = express.Router();

router.post('/', rescue(ProductsController.create));
router.get('/', rescue(ProductsController.getAll));
router.get('/:id', rescue(ProductsController.getById));
router.put('/:id', rescue(ProductsController.update));
router.delete('/:id', rescue(ProductsController.remove));

router.use(ProductsErrorController);

module.exports = router;
