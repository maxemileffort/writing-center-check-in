const chai                              = require('chai');
const chaiHttp                          = require('chai-http');

const { TEST_DATABASE_URL, PORT }       = require("../config");
const { User }                 = require("../models");
const { app, runServer, closeServer }   = require('../server');

let id; //used in some tests later

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
        it('should return 1 for non-unique emails, i.e. this user exists', function () {
            let inputEmail = "abc@abc.com";
            return chai.request(app)
                .get(`/check-duplicate-email/${inputEmail}`)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.a("object");
                    expect(res).to.be.json;
                    expect(res.body).to.include.keys("entries");
                    console.log("Line 49:");
                    console.log(res.body.entries.length);
                    expect(res.body.entries).to.have.length(!0);
                })
        })

        it('should return 0 for unique emails, i.e. this is a new user', function () {
            let inputEmail = "thisemail@doesntexist.com"
            return chai.request(app)
            .get(`/check-duplicate-email/${inputEmail}`)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.a("object");
                expect(res).to.be.json;
                expect(res.body).to.include.keys("entries");
                console.log("Line 63:");
                console.log(res.body.entries.length);
                expect(res.body.entries).to.have.length(0);
            })
        })
    })

    describe('get waiting students', function () {
        it('filter out students with currentlyWaiting = true', function () {
            return chai.request(app)
                .get('/get-waiting-students/')
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.a("object");
                    expect(res).to.be.json;
                    expect(res.body.length == User.find({currentlyWaiting: true}));
                })
        })
    })

    describe('user search', function () {
        it("should return a student's sessions for a student search", function () {
            let role = "student";
            let query = "abc@abc.com";
            return chai.request(app)
                .get(`/user-search/${role}/${query}/`)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a("array");
                })
        })

        it("should return a tutor's sessions for a tutor search", function () {
            let role = "tutor";
            let query = "poiu@lkjh.com";
            return chai.request(app)
                .get(`/user-search/${role}/${query}/`)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a("array");
                })
        })
    })

    describe('queue', function () {
        it('should have status 200', function () {
            return chai.request(app)
                .get('/queue')
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
        it('should create user with fake user data', function () {
            //create test object
            let newUserObj = {
                firstName : "test-first-name",
                lastName:  "test-last-name",
                email: "test-email",
                role: "test-role",
                password: "test-password",
                currentlyWaiting : true,
                sessions : [],
                time:  "test-time",
                request: "test-request",
            }
            //test endpoint
            return chai.request(app)
                .post(`/users/create/${newUserObj.role}`)
                .send(newUserObj)
                .then(function (res) {
                    let testUser = res.body;
                    id = testUser._id;
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a("object")
                    // console.log(res.body);
                    expect(testUser.email).to.equal(newUserObj.email);
                    expect(testUser.firstName).to.equal(newUserObj.firstName);
                    expect(testUser.lastName).to.equal(newUserObj.lastName);
                    expect(testUser.time).to.equal(newUserObj.time);
                    expect(testUser.request).to.equal(newUserObj.request);
                    expect(testUser.sessions).to.be.a("array");
                    expect(testUser.sessions).to.have.length(0);
                    expect(testUser.currentlyWaiting).to.equal(true);
                })
        })
    })

    describe('Login user', function () {
        it('should login student if password is correct', function () {
            let email = "test-email"
            let password = "test-password"
            let role = "student"
            let testObj = {
                email,
                password,
                role
            }
            return chai.request(app)
                .post(`/user/login/${role}/`)
                .send(testObj)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res).to.be.a("object");
                })
        })

        it('should login tutor if password is correct', function () {
            let email = "test-email"
            let password = "test-password"
            let role = "test-role"
            let testObj = {
                email,
                password,
                role
            }
            return chai.request(app)
                .post(`/user/login/${role}/`)
                .send(testObj)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res).to.be.a("object");
                })
        })

        it('should reject user if password is incorrect', function () {
            let email = "test-email"
            let password = "wrong-password"
            let role = "test-role"
            let testObj = {
                email,
                password,
                role
            }
            return chai.request(app)
                .post(`/user/login/${role}/`)
                .send(testObj)
                .then(function (res) {
                    expect(res).to.have.status(500);
                    expect(res).to.be.json;
                    expect(res).to.be.a("object");
                })
        })
    })

//PUT endpoints
    describe('check in student', function () {
            it("changes student's wait status", function(){
                console.log(id);
                return chai.request(app)
                .put(`/check-in-student/${id}/`)
                .then(res=>{
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a("object");
                    // console.log(res.body)
                    return User.findById(id);
                })
                .then(user=>{
                    expect(user.currentlyWaiting).to.equal(false);
                })
            })
    })

    describe('Create an appointment', function () {
        it('creates placeholder appointment to render to waitlist', function () {
            let email = "test-email";
            let tutor = "test-tutor";
            let teacher = "test-teacher";
            let assignment = "test-assignment";
            let date = "test-date";
            let time = "test-time";
            let appointmentObj = {
                email,
                tutor,
                teacher,
                assignment,
                date,
                time,
            }
            return chai.request(app)
                .put('/sessions/create/')
                .send(appointmentObj)
                .then(function (res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res).to.be.a('object');
                    return User.find({email: email})
                })
                .then(user=>{
                    expect(user[0].currentlyWaiting).to.equal(true);
                    expect(user[0].sessions).to.have.length(!0);
                })
        })
    })

    describe('Create a session', function () {
        it('creates record of session between tutor and student', function () {
            let studentEmail = "test-email";
            let tutorEmail = "poiu@lkjh.com";
            let notes = "test-notes";
            let time = "test-time";
            let date = "test-date";
            let teacher = "test-teacher";
            let assignment = "test-assignment";

            let newSessionObj = {
                studentEmail,
                tutorEmail, //using a demo-generated tutor for testing reasons
                notes,
                time,
                date,
                teacher,
                assignment
            }

            return chai.request(app)
                .put('/sessions/update/')
                .send(newSessionObj)
                .then(function (res) {
                    // console.log(res.body)
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a("array");
                    expect(res.body).to.have.length(4);
                })
        })
    })

//DELETE endpoints
    describe('Delete an user', function () {
        it('remove fake user created earlier', function () {
            let email = "test-email"
            return chai.request(app)
                .delete(`/user-delete/${email}/`)
                .then(function (res) {
                    expect(res).to.have.status(204);
                })
        })
    })

})



