const express = require('express');
const ordersController = require('../controllers/orders');

const router = express.Router();

router.get('/', ordersController.getAll);
router.get('/:id', ordersController.getSingle);
router.post('/', ordersController.createOrder);
router.put('/:id', ordersController.updateOrder);
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;