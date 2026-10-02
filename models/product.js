const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const COLLECTION = 'products';

const productModel = {
    async findAll() {
        const db = getDb();
        return db.collection(COLLECTION).find().toArray();
    },

    async findById(id) {
        const db = getDb();
        return db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
    },

    async create(productData) {
        const db = getDb();
        const doc = {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            brand: productData.brand,
            stock: productData.stock,
            isAvailable: productData.isAvailable ?? true,
            location: productData.location,
            date: productData.date
        };
        const result = await db.collection(COLLECTION).insertOne(doc);
        return { ...doc, _id: result.insertedId };
    },

    async updateById(id, productData) {
        const db = getDb();
        const doc = {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            brand: productData.brand,
            stock: productData.stock,
            isAvailable: productData.isAvailable,
            location: productData.location,
            date: productData.date
        };
        const result = await db.collection(COLLECTION).findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: doc },
            { returnDocument: 'after' }
        );
        return result;
    },

    async deleteById(id) {
        const db = getDb();
        const result = await db.collection(COLLECTION).findOneAndDelete({ _id: new ObjectId(id) });
        return result;
    }
};

module.exports = productModel;