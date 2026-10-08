jest.mock('../db/connect', () => ({
    initDb: jest.fn(),
    getDb: jest.fn(() => ({
        db: () => ({
            collection: (name) => ({
                find: () => ({
                    toArray: async () => [{ collection: name, mocked: true }],
                }),
            }),
        }),
    })),
}));

const request = require('supertest');
const app = require('../server');

describe('API routes', () => {
    test.each([
        ['/products', 'products'],
        ['/orders', 'orders'],
        ['/users', 'users'],
        ['/reviews', 'reviews'],
    ])('GET %s returns mocked %s data with status 200', async (path, collection) => {
        const response = await request(app).get(path);
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ collection, mocked: true }]);
    });

    test('GET /invalid-route returns 404', async () => {
        const response = await request(app).get('/invalid-route');
        expect(response.status).toBe(404);
    });
});
