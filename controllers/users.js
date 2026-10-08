const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

async function getAll(req, res) {
    try {
        const users = await mongodb.getDb().db().collection('users').find().toArray();
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function getSingle(req, res) {
    try {
        const user = await mongodb.getDb().db().collection('users').findOne({
            _id: new ObjectId(req.params.id),
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function createUser(req, res) {
    try {
        const { oauthId, displayName, email, joinDate } = req.body ?? {};
        if ([oauthId, displayName, email, joinDate]
            .some((field) => field === undefined || field === null)) {
            return res.status(400).json({ message: 'Validation error: All fields are required.' });
        }
        const user = { oauthId, displayName, email, joinDate };
        const result = await mongodb.getDb().db().collection('users').insertOne(user);
        return res.status(201).json({
            acknowledged: result.acknowledged,
            insertedId: result.insertedId,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function updateUser(req, res) {
    try {
        const { oauthId, displayName, email, joinDate } = req.body ?? {};
        if ([oauthId, displayName, email, joinDate]
            .some((field) => field === undefined || field === null)) {
            return res.status(400).json({ message: 'Validation error: All fields are required.' });
        }
        const user = { oauthId, displayName, email, joinDate };
        await mongodb.getDb().db().collection('users').replaceOne(
            { _id: new ObjectId(req.params.id) },
            user
        );
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function deleteUser(req, res) {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }

        const result = await mongodb.getDb().db().collection('users').deleteOne({
            _id: new ObjectId(req.params.id),
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser,
};