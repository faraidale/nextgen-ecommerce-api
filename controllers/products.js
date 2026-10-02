const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

async function getAll(req, res) {
    try {
        const products = await mongodb.getDb().db().collection('products').find().toArray();
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function getSingle(req, res) {
    try {
        const product = await mongodb.getDb().db().collection('products').findOne({
            _id: new ObjectId(req.params.id),
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        return res.status(200).json(product);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function createProduct(req, res) {
    try {
        const {
            productName,
            description,
            price,
            category,
            stockQuantity,
            manufacturer,
            dateAdded,
            isActive,
        } = req.body ?? {};
        if (
            [productName, description, price, category, stockQuantity, manufacturer, dateAdded, isActive]
                .some((field) => field === undefined || field === null)
        ) {
            return res.status(400).json({ message: 'Validation error: All fields are required.' });
        }
        const product = {
            productName,
            description,
            price,
            category,
            stockQuantity,
            manufacturer,
            dateAdded,
            isActive,
        };
        const result = await mongodb.getDb().db().collection('products').insertOne(product);
        return res.status(201).json({
            acknowledged: result.acknowledged,
            insertedId: result.insertedId,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function updateProduct(req, res) {
    try {
        const {
            productName,
            description,
            price,
            category,
            stockQuantity,
            manufacturer,
            dateAdded,
            isActive,
        } = req.body ?? {};
        if (
            [productName, description, price, category, stockQuantity, manufacturer, dateAdded, isActive]
                .some((field) => field === undefined || field === null)
        ) {
            return res.status(400).json({ message: 'Validation error: All fields are required.' });
        }
        const product = {
            productName,
            description,
            price,
            category,
            stockQuantity,
            manufacturer,
            dateAdded,
            isActive,
        };
        await mongodb.getDb().db().collection('products').replaceOne(
            { _id: new ObjectId(req.params.id) },
            product
        );
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function deleteProduct(req, res) {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID.' });
        }

        const result = await mongodb.getDb().db().collection('products').deleteOne({
            _id: new ObjectId(req.params.id),
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getAll,
    getSingle,
    createProduct,
    updateProduct,
    deleteProduct,
};
