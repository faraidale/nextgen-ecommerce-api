const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const COLLECTION = 'reviews';

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}

const validateReview = (data) => {
    if (!data || typeof data !== 'object') {
        throw new ValidationError('Request body must be a valid JSON object');
    }

    const { rating, text, author, date, productId } = data;

    // Required checks (missing, null, or empty string)
    if (rating === undefined || rating === null || rating === "") {
        throw new ValidationError('Rating is required.');
    }
    if (text === undefined || text === null || text === '') {
        throw new ValidationError('Text is required.');
    }
    if (author === undefined || author === null || author === '') {
        throw new ValidationError('Author is required.');
    }
    if (date === undefined || date === null || date === '') {
        throw new ValidationError('Date is required.');
    }
    if (productId === undefined || productId === null || productId === '') {
        throw new ValidationError('productId is required.');
    }

    // Type checks
    if (typeof rating !== 'number' || isNaN(rating)) {
        throw new ValidationError('Rating must be a number.');
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new ValidationError('Rating must be a whole number between 1 and 5.');
    }

    if (typeof text !== 'string') {
        throw new ValidationError('Text must be a string.');
    }
    if (text.trim().length < 2) {
        throw new ValidationError('Text must be at least 2 characters.');
    }

    if (typeof author !== 'string') {
        throw new ValidationError('Author must be a string.');
    }
    if (author.trim().length < 2) {
        throw new ValidationError('Author must be at least 2 characters.');
    }

    if (typeof date !== 'string') {
        throw new ValidationError('Date must be a string.');
    }

    if (typeof productId !== 'string') {
        throw new ValidationError('productId must be a string.');
    }

    return true;
};

const reviewModel = {
    async findAll() {
        const db = getDb();
        return db.collection(COLLECTION).find().toArray();
    },

    async findById(id) {
        if (!ObjectId.isValid(id)) {
            throw new ValidationError('Invalid review ID.');
        }
        const db = getDb();
        return db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
    },

    async create(data) {
        validateReview(data);

        const doc = {
            rating: data.rating,
            text: data.text,
            author: data.author,
            date: data.date,
            productId: data.productId,
        };

        const db = getDb();
        const result = await db.collection(COLLECTION).insertOne(doc);
        return { ...doc, _id: result.insertedId };
    },

    async updateById(id, data) {
        if (!ObjectId.isValid(id)) {
            throw new ValidationError('Invalid review ID.');
        }

        validateReview(data);

        const doc = {
            rating: data.rating,
            text: data.text,
            author: data.author,
            date: data.date,
            productId: data.productId,
        };

        const db = getDb();
        return db.collection(COLLECTION).findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: doc },
            { returnDocument: 'after' }
        );
    },

    async deleteById(id) {
        if (!ObjectId.isValid(id)) {
            throw new ValidationError('Invalid review ID.');
        }
        const db = getDb();
        return db.collection(COLLECTION).findOneAndDelete({ _id: new ObjectId(id) });
    }
};

module.exports = {
    reviewModel,
    validateReview,
    ValidationError,
};