const request = require('supertest');
const { app, sequelize } = require('./app');

describe('GET /data', () => {
    beforeAll(async () => {
        sequelize.authenticate();
        sequelize.sync({ alter: true });
    });

    it('responds with json with key', async (done) => {
        request(app)
            .get('/data?key=12345')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect(200);
            // .end((err, resp) => {
            //     if(err) return done(err);
            //     expect(resp.text).toEqual('[]');
            //     return done();
            // })
    });
});