const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

// this lets us use *expect* style syntax in our tests
// so we can do things like `expect(1 + 1).to.equal(2);`
// http://chaijs.com/api/bdd/
const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('landing page', function(){
    it('should have status 200', function(){
        return chai.request(app)
            .get('/')
            .then(function (res) {
                expect(res).to.have.status(200);
            })
    })
})

describe('queue page', function(){
    it('should have status 200', function(){
        return chai.request(app)
            .get('/queue')
            .then(function (res) {
                expect(res).to.have.status(200);
            })
    })
})
describe('dashboard for consultants', function(){
    it('should have status 200', function(){
        return chai.request(app)
            .post('/dashboard1')
            .then(function (res) {
                expect(res).to.have.status(200);
            })
    })
})
describe('dashboard for instructors', function(){
    it('should have status 200', function(){
        return chai.request(app)
            .post('/dashboard2')
            .then(function (res) {
                expect(res).to.have.status(200);
            })
    })
})