const express = require('express');
const ordersController = require('../controllers/orders');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.get('/', ordersController.getAll);
router.get('/:id', ordersController.getSingle);
router.post('/', isAuthenticated, ordersController.createOrder);
router.put('/:id', isAuthenticated, ordersController.updateOrder);
router.delete('/:id', isAuthenticated, ordersController.deleteOrder);

module.exports = router;
