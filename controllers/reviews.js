const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

async function getAll(req, res) {
    try {
        const reviews = await mongodb.getDb().db().collection('reviews').find().toArray();
        return res.status(200).json(reviews);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function getSingle(req, res) {
    try {
        const review = await mongodb.getDb().db().collection('reviews').findOne({
            _id: new ObjectId(req.params.id),
        });
        if (!review) {
            return res.status(404).json({ message: 'Review not found.' });
        }
        return res.status(200).json(review);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function createReview(req, res) {
    try {
        const {
            productId,
            userId,
            rating,
            title,
            comment,
            reviewDate,
        } = req.body ?? {};
        if (
            [productId, userId, rating, title, comment, reviewDate]
                .some((field) => field === undefined || field === null)
        ) {
            return res.status(400).json({ message: 'Validation error: All fields are required.or missing field' });
        }
        const review = {
            productId,
            userId,
            rating,
            title,
            comment,
            reviewDate,
        };
        const result = await mongodb.getDb().db().collection('reviews').insertOne(review);
        return res.status(201).json({
            acknowledged: result.acknowledged,
            insertedId: result.insertedId,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function updateReview(req, res) {
    try {
        const {
            productId,
            userId,
            rating,
            title,
            comment,
            reviewDate,
        } = req.body ?? {};
        if (
            [productId, userId, rating, title, comment, reviewDate]
                .some((field) => field === undefined || field === null)
        ) {
            return res.status(400).json({ message: 'Validation error: All fields are required.or missing field' });
        }
        const review = {
            productId,
            userId,
            rating,
            title,
            comment,
            reviewDate,
        };
        await mongodb.getDb().db().collection('reviews').replaceOne(
            { _id: new ObjectId(req.params.id) },
            review
        );
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function deleteReview(req, res) {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid review ID.' });
        }

        const result = await mongodb.getDb().db().collection('reviews').deleteOne({
            _id: new ObjectId(req.params.id),
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Review not found.' });
        }
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getAll,
    getSingle,
    createReview,
    updateReview,
    deleteReview,
};