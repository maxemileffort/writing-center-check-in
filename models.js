'use strict';

const mongoose = require('mongoose');

//begin User schema
const userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String },
    time: {type: String},
    request: {type: String},
    currentlyWaiting: {type: Boolean},
    email: {type: String, required: true},
    password: {type: String, required: true},
    sessions: {type: Array}
});

// userSchema.virtual('name').get(function () {
//     return `${this.firstName} ${this.lastName}`.trim()
// });

// userSchema.methods.serialize = function () {

//     return {
//         id: this._id,
//         name: this.name,
//         role: this.role,
//         time: this.time,
//         request: this.request,
//         currentlyWaiting: this.currentlyWaiting,
//         email: this.email,
//         password: this.password,
//         sessions: this.sessions
//     };
// }

const User = mongoose.model('User', userSchema);
// end User schema



//begin Session schema
const sessionSchema = mongoose.Schema({
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    tutorName: { type: String, required: true },
    tutorEmail: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true},
    assignment: { type: String, required: true},
    teacher: { type: String, required: true},
    notes: {type: String, required: true},
});


const Session = mongoose.model('Session', sessionSchema);
// end Session schema

module.exports = { User, Session };