
const cds = require('@sap/cds')
const proxy = require('@sap/cds-odata-v2-adapter-proxy')
// cds.on('bootstrap', app => app.use(proxy()))

describe('Gamingstoreapp: OData Protocol Level Testing', () => {
    if (cds.User.default) cds.User.default = cds.User.Privileged
    else cds.User = cds.User.Privileged
    const app = require('express')()
    const request = require('supertest')(app)

    beforeAll(async () => {        
        await cds.deploy(__dirname + '/../srv/cat-service').to('sqlite::memory:')
        await cds.deploy(__dirname + '/../srv/admin-service').to('sqlite::memory:')
        await cds.serve('CustomerService').from(__dirname + '/../srv/cat-service').in(app)
        await cds.serve('AdminService').from(__dirname + '/../srv/admin-service').in(app)
        // cds.on('bootstrap', app => app.use(proxy()))
    })
    it('Service $metadata document', async () => {
        const response = await request
            .get('/browse/$metadata')
            .expect('Content-Type', /^application\/xml/)
            .expect(200)

        const expectedVersion = '<edmx:Edmx Version="4.0" xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx">'
        const expectedGamesEntitySet = '<EntitySet Name="Games" EntityType="CustomerService.Games">'
        expect(response.text.includes(expectedVersion)).toBeTruthy()
        expect(response.text.includes(expectedGamesEntitySet)).toBeTruthy()
    })


    it(' DELETE returns 405 for customer service', async () => {
        const response = await request
            .delete('/browse/Games(101)')
            .expect(405)
    })

    it(' PUT returns 405 for customer service', async () => {

        const response = await request
            .put('/browse/Games(101)')
            .send({
                "name": "snake 2",
                "description": "classic game",
                "rating": "30.0",
                "image": "",
                "price": "3.00"
            })
            .set("Content-Type", "application/json;charset=UTF-8;IEEE754Compatible=true")
            .set('Accept', 'application/json')
            .expect(405)
    })

    it(' POST returns 405 for customer service', async () => {

        const response = await request
            .post('/browse/Games')
            .send({
                "name": "snake 2",
                "description": "classic game",
                "rating": "30.0",
                "image": "",
                "ID": 6780,
                "price": "3.00"
            })
            .set("Content-Type", "application/json;charset=UTF-8;IEEE754Compatible=true")
            .set('Accept', 'application/json')
            .expect(405)
    })

    it('Get with filter by publisher', async () => {
        const response = await request
            .get('/browse/Games?$filter=publisher_ID%20eq%205823542')
            .expect('Content-Type', /^application\/json/)
            .expect(200)

        expect(response.body.value).toEqual([
            {
                ID: 101,
                name: "Last Of Us",
                description: "The Last of Us is a 2013 action-adventure game developed by Naughty Dog and published by Sony Computer Entertainment",
                rating: 99,
                image: "NA",
                price: 299,
                publisher_ID: 5823542
            },
            {
                ID: 107,
                name: "Last Of Us 2",
                description: "The Last of Us Part II is a 2020 action-adventure game developed by Naughty Dog and published by Sony Interactive Entertainment for the PlayStation 4.",
                rating: 100,
                image: "NA",
                price: 300,
                publisher_ID: 5823542
            }

        ])
    })

    it('Get with orderby for name', async () => {
        const response = await request
            .get('/browse/Games?$orderby=name%20asc')
            .expect('Content-Type', /^application\/json/)
            .expect(200)

        expect(response.body.value).toEqual([
            {
                ID: 101,
                name: "Last Of Us",
                description: "The Last of Us is a 2013 action-adventure game developed by Naughty Dog and published by Sony Computer Entertainment",
                rating: 99,
                image: "NA",
                price: 299,
                publisher_ID: 5823542
            },
            {
                ID: 107,
                name: "Last Of Us 2",
                description: "The Last of Us Part II is a 2020 action-adventure game developed by Naughty Dog and published by Sony Interactive Entertainment for the PlayStation 4.",
                rating: 100,
                image: "NA",
                price: 300,
                publisher_ID: 5823542
            }

        ])
    })

    it('Get with orderby for price', async () => {
        const response = await request
            .get('/browse/Games?$orderby=price%20asc')
            .expect('Content-Type', /^application\/json/)
            .expect(200)

        expect(response.body.value).toEqual([
            {
                ID: 101,
                name: "Last Of Us",
                description: "The Last of Us is a 2013 action-adventure game developed by Naughty Dog and published by Sony Computer Entertainment",
                rating: 99,
                image: "NA",
                price: 299,
                publisher_ID: 5823542
            },
            {
                ID: 107,
                name: "Last Of Us 2",
                description: "The Last of Us Part II is a 2020 action-adventure game developed by Naughty Dog and published by Sony Interactive Entertainment for the PlayStation 4.",
                rating: 100,
                image: "NA",
                price: 300,
                publisher_ID: 5823542
            }

        ])
    })

    it('serves annotations for fiori elements', async () => {
        const response = await  request.get("/browse/$metadata")
            .expect(200).expect('Content-Type', "/^application\/xml/")
        console.log(response.text);

        expect(response.text.includes('<Annotation Term="UI.LineItem">')).toBeTruthy()
        expect(response.text.includes('<Annotation Term="UI.Identification">')).toBeTruthy()
        expect(response.text.includes('<Record Type="Common.ValueListType">')).toBeTruthy()
    })

    it('Get with search', async () => {
        const response = await request
            .get('/browse/Games?$search=Last%20of')
            .expect('Content-Type', /^application\/json/)
            .expect(200)


        expect(response.body.value).toEqual([
            {
                ID: 101,
                name: "Last Of Us",
                description: "The Last of Us is a 2013 action-adventure game developed by Naughty Dog and published by Sony Computer Entertainment",
                rating: 99,
                image: "NA",
                price: 299,
                publisher_ID: 5823542
            },
            {
                ID: 107,
                name: "Last Of Us 2",
                description: "The Last of Us Part II is a 2020 action-adventure game developed by Naughty Dog and published by Sony Interactive Entertainment for the PlayStation 4.",
                rating: 100,
                image: "NA",
                price: 300,
                publisher_ID: 5823542
            }

        ])
    })
})

describe('Gamingstoreapp: CDS Service Level Testing', () => {
    let srv, Games

    beforeAll(async () => {
        srv = await cds.serve('CustomerService').from(__dirname + '/../srv/cat-service')
        Games = srv.entities.Games
        expect(Games).toBeDefined()
    })

    it('GETs all Games', async () => {
        const games = await srv.read(Games, b => { b.name })
        expect(games).toMatchObject([
            { name: 'Last Of Us' },
            { name: 'Last Of Us 2' }
        ])
    })

})
