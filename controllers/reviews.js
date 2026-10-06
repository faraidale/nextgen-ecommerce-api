const { reviewModel } = require('../models/reviews');

const handleError = (err, res) => {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({ message: err.message });
};

async function getAll(req, res) {
    try {
        const reviews = await reviewModel.findAll();
        return res.status(200).json(reviews);
    } catch (err) {
        return handleError(err, res);
    }
}

async function getSingle(req, res) {
    try {
        const review = await reviewModel.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found.' });
        }
        return res.status(200).json(review);
    } catch (err) {
        return handleError(err, res);
    }
}

async function createReview(req, res) {
    try {
        const saved = await reviewModel.create(req.body ?? {});
        return res.status(201).json(saved);
    } catch (err) {
        return handleError(err, res);
    }
}

async function updateReview(req, res) {
    try {
        const updated = await reviewModel.updateById(req.params.id, req.body ?? {});
        if (!updated) {
            return res.status(404).json({ message: 'Review not found.' });
        }
        return res.status(200).json(updated);
    } catch (err) {
        return handleError(err, res);
    }
}

async function deleteReview(req, res) {
    try {
        const deleted = await reviewModel.deleteById(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Review not found.' });
        }
        return res.status(204).send();
    } catch (err) {
        return handleError(err, res);
    }
}

module.exports = {
    getAll,
    getSingle,
    createReview,
    updateReview,
    deleteReview,
};