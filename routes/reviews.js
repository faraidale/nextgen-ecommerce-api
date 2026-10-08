const express = require('express');
const reviewsController = require('../controllers/reviews');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.get('/', reviewsController.getAll);
router.get('/:id', reviewsController.getSingle);
router.post('/', isAuthenticated, reviewsController.createReview);
router.put('/:id', isAuthenticated, reviewsController.updateReview);
router.delete('/:id', isAuthenticated, reviewsController.deleteReview);

module.exports = router;
