'use strict';

const mongoose = require('mongoose');

//begin student schema
const studentSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    currentlyWaiting: { type: Boolean },
    role: { type: String, required: true },
    recentTime: {type: String},
    recentRequest: {type: String},
    email: {type: String, required: true},
    password: {type: String, required: true}
});

studentSchema.virtual('name').get(function () {
    return `${this.firstName} ${this.lastName}`.trim()
});

studentSchema.methods.serialize = function () {

    return {
        id: this._id,
        name: this.name,
        currentlyWaiting: this.currentlyWaiting,
        role: this.role,
        recentTime: this.recentTime,
        recentRequest: this.recentRequest,
        email: this.email,
        password: this.password
    };
}

const Student = mongoose.model('Student', studentSchema);
// end student schema

//begin staff schema
const staffSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

staffSchema.virtual('name').get(function () {
    return `${this.firstName} ${this.lastName}`.trim()
});

staffSchema.methods.serialize = function () {

    return {
        id: this._id,
        name: this.name,
        role: this.role,
        email: this.email,
        password: this.password
    };
}

const Staff = mongoose.model('Staff', staffSchema);
//end staff schema

//begin session schema
const sessionSchema = mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    tutor: { type: String, required: true },
    instructor: { type: String, required: true },
    student: { type: String, required: true },
    notes: { type: String, required: true }
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
        instructor: this.instructor,
        student: this.student,
        notes: this.notes
    };
}

const Session = mongoose.model('Session', sessionSchema);
//end session schema

module.exports = { Student, Staff, Session };