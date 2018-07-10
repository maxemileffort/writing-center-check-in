const express = require('express'),
      mongoose = require('mongoose');
      
const app = express();
app.use(express.json());

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { Student, Staff, Session } = require('./models');


app.use(express.static('public'));

//Begin search features
app.get("/", (req, res) => {
    console.log('landed on /')
    res.sendFile(__dirname + "/public/index.html");
});

app.get('/check-duplicate-email/:inputEmail', (req, res)=>{
    let inputEmail = req.params.inputEmail;
    console.log(inputEmail);
    Student
        .find({
            "email": inputEmail
        })
        .then(function (entries) {
            res.json({
                entries
            });
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error'
            });
    });
})

app.get("/queue", (req, res) => {
    console.log('landed on /queue')
    res.sendFile(__dirname + "/public/queue.html");
});
//END search features

//Begin creating new users
//new student user
app.post('/students/create/', (req, res)=>{
    console.log('trying to create new student');
    // console.log(req.body);
    //grab values
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let role = "student";
    let email = req.body.email;
    let password = req.body.password;
    let currentlWaiting = false;
    let recentRequest = '';
    let recentTime = '';
    
        Student.create({
            firstName,
            lastName,
            role,
            email,
            password,
            currentlWaiting,
            recentTime,
            recentRequest
        })
        .then(student => {
            res.status(201).json(student.serialize());
            console.log(student.name + " created.")
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Couldn't create student." });
        });
    
    

})

//new tutor user
app.post('/tutors/create/', (req, res)=>{
    console.log('trying to create new tutor');
    // console.log(req.body);
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let role = "tutor";
    let email = req.body.email;
    let password = req.body.password;
    Staff.create({
        firstName,
        lastName,
        role,
        email,
        password,
    })
    .then(tutor => {
        res.status(201).json(staff.serialize());
        console.log(tutor.name + " created.")
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Couldn't create tutor." });
    });

})

// new instructor user
app.post('/instructors/create/', (req, res)=>{
    console.log('trying to create new instructor');
    // console.log(req.body);
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let role = "instructor";
    let email = req.body.email;
    let password = req.body.password;
    Staff.create({
        firstName,
        lastName,
        role,
        email,
        password,
    })
    .then(instructor => {
        res.status(201).json(staff.serialize());
        console.log(instructor.name + " created.")
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Couldn't create instructor." });
    });

})
//End creating new users

//Begin login users
//Login student user
app.post('/students/login/', (req, res)=>{
    console.log('trying to login student');
    let email = req.body.email;
    let password = req.body.password;
	Student.findOne({
        email: email,
        password: password
    })
    .then(student=>{
        console.log('Logged in as '+ student);
        res.status(200).json(student.serialize());
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({message: "Couldn't log in as student. Please check email and password."})
    })
})


//Login staff member
app.post('/staff/login/', (req, res)=>{
    console.log('trying to login staff member');
    console.log(req.body);
    
})


//END Login users

let server;

function runServer(dbUrl, port) {
    return new Promise((resolve, reject) => {
        mongoose.connect(dbUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`Listening on localhost:${port}`);
                resolve();
            }).on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

if (require.main === module) {
    runServer(DATABASE_URL, PORT).catch(err => console.error(err));
}

function closeServer() {
    return mongoose.disconnect().then(() => new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    }));
}

module.exports = { app, runServer, closeServer };