
const cds = require('@sap/cds')



describe('Gamingstoreapp: OData Protocol Level Testing auth check', () => {
    const app = require('express')()
    const request = require('supertest')(app)

    beforeAll(async () => {
        await cds.deploy(__dirname + '/../srv/cat-service').to('sqlite::memory:')
        await cds.serve('CustomerService').from(__dirname + '/../srv/cat-service').in(app)
    })
    it('  returns 401 without auth', async () => {
        const response = await request
            .get('/browse/Games(101)')
            .expect(401)
    })
})