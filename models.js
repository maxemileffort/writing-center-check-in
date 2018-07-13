'use strict';

const mongoose = require('mongoose');

//begin User schema
const userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String },
    recentTime: {type: String},
    recentRequest: {type: String},
    currentlyWaiting: {type: Boolean},
    email: {type: String, required: true},
    password: {type: String, required: true}
});

userSchema.virtual('name').get(function () {
    return `${this.firstName} ${this.lastName}`.trim()
});

userSchema.methods.serialize = function () {

    return {
        id: this._id,
        name: this.name,
        role: this.role,
        recentTime: this.recentTime,
        recentRequest: this.recentRequest,
        currentlyWaiting: this.currentlyWaiting,
        email: this.email,
        password: this.password
    };
}

const User = mongoose.model('User', userSchema);
// end User schema

//begin session schema
const sessionSchema = mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    tutor: { type: String, required: true },
    teacher: { type: String},
    assignment: { type: String},
    student: { type: String, required: true },
    notes: { type: String }
});

//might need to add a date and time virtual
// sessionSchema.virtual('name').get(function () {
//     return `${this.firstName} ${this.lastName}`.trim()
// });

sessionSchema.methods.serialize = function () {
    
    return {
        id: this._id,
        date: this.date,
        time: this.time,
        tutor: this.tutor,
        teacher: this.teacher,
        assignment: this.assignment,
        student: this.student,
        notes: this.notes
    };
}

const Session = mongoose.model('Session', sessionSchema);
//end session schema

module.exports = { User, Session };