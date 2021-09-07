'use strict'

const Bundles = require('../lib/elasticsearch-db.js')

const es = {
    host: 'localhost',
    port: '9200',
    urlGroups: 'groups',
    urlUsers: 'users'
}

it('should create a bundles service object!', done => {
    const service = Bundles.init(es) // <=> new Bundles(es)
    expect(service.urlGroups).toBe('http://localhost:9200/groups/_doc/')
    done()
})

it('should create a new group and get it and delete it!', done => {
    const service = Bundles.init(es)
    service.createGroup('receitas da avó', 'Com carinho da avó', (err, data) => {
        expect(err).toBeFalsy()
        expect(data._id).toBeTruthy()
        const id = data._id
        service.getGroup(id, (err, group) => {
            expect(err).toBeFalsy()
            expect(group.name).toBe('receitas da avó')
            service.deleteGroup(id, (err) => {
                expect(err).toBeFalsy()
                service.getGroup(id, (err) => {
                    expect(err).toBeTruthy()
                    expect(err.code).toBe(404)
                    done()
                })
            })
        })
    })
})

it('should create a new user and delete after', done => {
    const service = Bundles.init(es)
    service.addUser('dummyUser', 'dummyUser@hotmail.com', 'dummyPassword', (err, data) => {
        expect(err).toBeFalsy()
        expect(data._id).toBeTruthy()
        const id = data._id
        service.getUserById(id, (err, user) => {
            expect(err).toBeFalsy()
            expect(user.name).toBe('dummyUser')
            expect(user.email).toBe('dummyUser@hotmail.com')
            expect(user.password).toBe('dummyPassword')
            service.deleteUser(id, err => {
                expect(err).toBeFalsy()
                service.getUserById(id, (err) => {
                    expect(err).toBeTruthy()
                    expect(err.code).toBe(404)
                    done()
                })
            })
        })
    })
})
