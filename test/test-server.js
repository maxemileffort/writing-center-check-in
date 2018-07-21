const chai                              = require('chai');
const chaiHttp                          = require('chai-http');


const { TEST_DATABASE_URL, PORT }             = require("../config");
const { User, Session }                 = require("../models");
const { app, runServer, closeServer }   = require('../server');

// this lets us use *expect* style syntax in our tests
// so we can do things like `expect(1 + 1).to.equal(2);`
// http://chaijs.com/api/bdd/
const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe("Writing center node capstone", function(){


    before(function () {
        return runServer(TEST_DATABASE_URL, PORT);
    });

    after(function () {
        return closeServer();
    });

    //GET endpoints
    describe('landing page', function () { //done
        it('should have status 200', function () {
            return chai.request(app)
                .get('/')
                .then(function (res) {
                    expect(res).to.have.status(200);
                })
        })
    })


    describe('check duplicate emails', function () {
        it('should return some number for non-unique emails', function () {
            let inputEmail = "abc@abc.com";
            return chai.request(app)
                .get(`/check-duplicate-email/${inputEmail}`)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.a("object");
                    expect(res.body).to.include.keys("entries");
                    expect(res.body.entries).to.have.length(!0);
                })
        })

        it('should return some number for non-unique emails', function () {
        return User.create({
            email: "abc@abc.com",
            password
        })
        return chai.request(app)
        .get('/check-duplicate-email/:inputEmail')
        .then(function (res) {
                    expect(res).to.have.status(200);
                })
        })
    })


    describe('check user exists', function () {
        it('should have status 200', function () {
            return chai.request(app)
                .get('/')
                .then(function (res) {
                    expect(res).to.have.status(200);
                })
        })
    })

    describe('get waiting students', function () {
        it('should have status 200', function () {
            return chai.request(app)
                .get('/')
                .then(function (res) {
                    expect(res).to.have.status(200);
                })
        })
    })

    describe('user search', function () {
        it('should have status 200', function () {
            return chai.request(app)
                .get('/')
                .then(function (res) {
                    expect(res).to.have.status(200);
                })
        })
    })

    describe('queue', function () {
        it('should have status 200', function () {
            return chai.request(app)
                .get('/')
                .then(function (res) {
                    expect(res).to.have.status(200);
                })
        })
    })

    describe('catchall', function () {
        it('should have status 404', function () {
            return chai.request(app)
                .get('/*')
                .then(function (res) {
                    expect(res).to.have.status(404);
                })
        })
    })

//POST endpoints
    describe('create user', function () {
        it('should have status 200', function () {
            return chai.request(app)
                .get('/')
                .then(function (res) {
                    expect(res).to.have.status(200);
                })
        })
    })

    describe('Login user', function () {
        it('should have status 200', function () {
            return chai.request(app)
                .get('/')
                .then(function (res) {
                    expect(res).to.have.status(200);
                })
        })
    })

//PUT endpoints
    describe('check in student', function () {
        it('should have status 200', function () {
            return chai.request(app)
                .get('/')
                .then(function (res) {
                    expect(res).to.have.status(200);
                })
        })
    })

    describe('Create an appointment', function () {
        it('should have status 200', function () {
            return chai.request(app)
                .get('/')
                .then(function (res) {
                    expect(res).to.have.status(200);
                })
        })
    })

    describe('Create a session', function () {
        it('should have status 200', function () {
            return chai.request(app)
                .get('/')
                .then(function (res) {
                    expect(res).to.have.status(200);
                })
        })
    })

//DELETE endpoints
    describe('Delete an user', function () {
        it('should have status 200', function () {
            return chai.request(app)
                .get('/')
                .then(function (res) {
                    expect(res).to.have.status(200);
                })
        })
    })

})



