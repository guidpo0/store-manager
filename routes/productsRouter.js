const rescue = require('express-rescue');
const express = require('express');
const ProductsController = require('../controllers/ProductsController');

const router = express.Router();

router.post('/', rescue(ProductsController.create));

module.exports = router;
