const express = require('express');
const reviewsController = require('../controllers/reviews');

const router = express.Router();

router.get('/', reviewsController.getAll);
router.get('/:id', reviewsController.getSingle);
router.post('/', reviewsController.createReview);
router.put('/:id', reviewsController.updateReview);
router.delete('/:id', reviewsController.deleteReview);

module.exports = router;