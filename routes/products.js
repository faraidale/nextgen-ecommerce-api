const express = require('express');
const productsController = require('../controllers/products');

const router = express.Router();

router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getSingleProduct);
router.post('/', productsController.createProducts);
router.put('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProducts);

module.exports = router;


