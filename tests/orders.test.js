jest.mock('../db/connect', () => ({
    initDb: jest.fn(),
    getDb: jest.fn(() => ({
        db: () => ({
            collection: (name) => ({
                find: () => ({
                    toArray: async () => [{ collection: name, mocked: true }],
                }),
                findOne: async (query) => ({
                    _id: query._id,
                    collection: name,
                    mocked: true,
                }),
            }),
        }),
    })),
}));

const request = require('supertest');
const app = require('../server');

const collection = 'orders';
const route = '/orders';
const validId = '650c00000000000000000001';

describe('orders routes', () => {
    test('GET all returns 200 with mocked database results', async () => {
        const response = await request(app).get(route);

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ collection, mocked: true }]);
    });

    test('GET single returns 200 with mocked database result', async () => {
        const response = await request(app).get(`${route}/${validId}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            _id: validId,
            collection,
            mocked: true,
        });
    });
});