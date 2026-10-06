const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

async function getAll(req, res) {
    try {
        const orders = await mongodb.getDb().db().collection('orders').find().toArray();
        return res.status(200).json(orders);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function getSingle(req, res) {
    try {
        const order = await mongodb.getDb().db().collection('orders').findOne({
            _id: new ObjectId(req.params.id),
        });
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        return res.status(200).json(order);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function createOrder(req, res) {
    try {
        const { orderId, userId, productId, quantity, orderStatus, orderDate } = req.body ?? {};
        if ([orderId, userId, productId, quantity, orderStatus, orderDate]
            .some((field) => field === undefined || field === null)) {
            return res.status(400).json({ message: 'Validation error: All fields are required.' });
        }
        const order = { orderId, userId, productId, quantity, orderStatus, orderDate };
        const result = await mongodb.getDb().db().collection('orders').insertOne(order);
        return res.status(201).json({
            acknowledged: result.acknowledged,
            insertedId: result.insertedId,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function updateOrder(req, res) {
    try {
        const { orderId, userId, productId, quantity, orderStatus, orderDate } = req.body ?? {};
        if ([orderId, userId, productId, quantity, orderStatus, orderDate]
            .some((field) => field === undefined || field === null)) {
            return res.status(400).json({ message: 'Validation error: All fields are required.' });
        }
        const order = { orderId, userId, productId, quantity, orderStatus, orderDate };
        await mongodb.getDb().db().collection('orders').replaceOne(
            { _id: new ObjectId(req.params.id) },
            order
        );
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function deleteOrder(req, res) {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order ID.' });
        }

        const result = await mongodb.getDb().db().collection('orders').deleteOne({
            _id: new ObjectId(req.params.id),
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getAll,
    getSingle,
    createOrder,
    updateOrder,
    deleteOrder,
};