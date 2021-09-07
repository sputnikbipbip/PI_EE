'use strict'

const urllib = require('urllib')

class Groups {

    constructor(es) {
        this.urlGroups =  `http://${es.host}:${es.port}/${es.urlGroups}/_doc/`
        this.urlUsers = `http://${es.host}:${es.port}/${es.urlUsers}/_doc/`
    }

    static init(es) {
        return new Groups(es)
    }

    getGroup(id, cb) {
        const url = `${this.urlGroups}${id}`
        urllib.request(url, (err, body, res) => {
            if(!checkError(200, cb, err, res, body))
                cb(null, JSON.parse(body)._source)
        })
    }

    deleteGroup(id, cb) {
        const url = `${this.urlGroups}${id}`
        const options = { method: 'DELETE' }
        urllib.request(url, options, (err, body, res) => {
            if(!checkError(200, cb, err, res, body))
                cb(null, JSON.parse(body))
        })
    }

    createGroup(name,description, cb) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            content: JSON.stringify({
                'name': name,
                'description' : description
            })
        }
        urllib.request(this.urlGroups, options, (err, body, res) => {
            if(!checkError(201, cb, err, res, body))
                cb(null, JSON.parse(body))
        })
    }

    addUser(name, email, password, cb) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            content: JSON.stringify({
                'id': Date.now().toString(),
                'name': name,
                'email' : email,
                'password' : password
            })
        }
        urllib.request(this.urlUsers, options, (err, body, res) => {
            if(!checkError(201, cb, err, res, body))
                return cb(null, JSON.parse(body))
        })
    }

    deleteUser(id, cb) {
        const url = `${this.urlUsers}${id}`
        const options = { method: 'DELETE' }
        urllib.request(url, options, (err, body, res) => {
            if(!checkError(200, cb, err, res, body))
                cb(null, JSON.parse(body))
        })
    }

    getUserByEmail(email, cb) {
        const url = `${this.urlUsers}${email}`
        urllib.request(url, (err, body, res) => {
            if(!checkError(200, cb, err, res, body))
                cb(null, JSON.parse(body)._source)
        })
    }

    getUserById(id, cb) {
        const url = `${this.urlUsers}${id}`
        urllib.request(url, (err, body, res) => {
            if(!checkError(200, cb, err, res, body))
                cb(null, JSON.parse(body)._source)
        })
    }
}

function checkError(successCode, cb, err, res, body) {
    if(err) {
        cb(err)
        return true
    }
    if(res.statusCode != successCode) {
        const err = new Error(res.statusMessage)
        err.code = res.statusCode
        err.error = body
        cb(err)
        return true
    }
    return false
}

module.exports = Groups
