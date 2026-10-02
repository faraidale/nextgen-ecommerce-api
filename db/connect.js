const { MongoClient } = require('mongodb');

let db;

function initDb(callback) {
    const client = new MongoClient(process.env.MONGODB_URI);

    client.connect()
        .then(() => {
            db = client.db();
            callback(null);
        })
        .catch((error) => callback(error));
}

function getDb() {
    if (!db) {
        throw new Error('Db not initialized');
    }

    return db;
}

module.exports = {
    initDb,
    getDb,
};
