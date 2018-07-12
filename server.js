const express = require('express'),
      mongoose = require('mongoose');
      
const app = express();
app.use(express.json());

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { User, Session } = require('./models');


app.use(express.static('public'));
let instructor; //used for session creation

//====================
//GET endpoints
//====================
app.get("/", (req, res) => {
    console.log('landed on /');
    res.sendFile(__dirname + "/public/index.html");
});

app.get('/check-duplicate-email/:inputEmail', (req, res)=>{
    let inputEmail = req.params.inputEmail;
    console.log(inputEmail);
    User
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
                message: 'Unable to check for duplicate emails. User may already exist.'
            });
    });
})

app.get("/queue", (req, res) => {
    console.log('landed on /queue');
    res.sendFile(__dirname + "/public/queue.html");
});
//END search features


//====================
//POST endpoints
//====================
//Create new user
app.post('/users/create/:role/', (req, res)=>{
    //grab values
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let role = req.params.role;
    let email = req.body.email;
    let password = req.body.password;
    let currentlWaiting = false;
    let recentRequest = '';
    let recentTime = '';

    console.log('trying to create new ' + role);

    User.create({
        firstName,
        lastName,
        role,
        email,
        password,
        currentlWaiting,
        recentTime,
        recentRequest
    })
    .then(user => {
        res.status(201).json(user.serialize());
        console.log(user.name + " created.")
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Couldn't create "+role });
    });
    
    

})

//Create new session
app.post('/sessions/create/', (req, res)=>{
    console.log('trying to create new session');
    // console.log(req.body);
    let today = new Date();
    let time;
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    let hh = today.getHours();
    let min = today.getMinutes();
    let sec = today.getSeconds();
    today = `${mm}/${dd}/${yyyy}`

    
    if (hh < 10) {
        hh = '0' + hh;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    if (sec < 10) {
        sec = '0' + sec;
    }

    if (hh === '00') {
        hh = 12;
    }

    if (hh > 12) {
        hh = hh - 12;
        time = `${hh}:${min}:${sec} PM`;
    }

    else {
        time = `${hh}:${min}:${sec}`;
    }

    let student = req.body.name;
    let tutor = req.body.recentRequest;
    let getTodaysInstructor = instructor;
    let date = today;
    time = time;
    let notes;
    Session.create({
        date,
        time,
        tutor,
        getTodaysInstructor,
        student,
        notes,
    })
    .then(session => {
        res.status(201).json(session.serialize());
        console.log("Session for " + session.student + " created.")
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Couldn't create session." });
    });

})
//End creating new users

//Begin login users
//Login student user
app.post('/students/login/', (req, res)=>{
    console.log('trying to login student');
    let email = req.body.email;
    let password = req.body.password;
	User.findOne({
        email: email,
        password: password
    })
    .then(user=>{
        console.log('Logged in as '+ user);
        res.status(200).json(user.serialize());
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({message: "Couldn't log in as student. Please check email and password."})
    })
})


//Login staff member
app.post('/staff/login/:role/', (req, res)=>{
    console.log('trying to login staff member');
    let email = req.body.email;
    let password = req.body.password;
    let role = req.params.role;
    console.log(email)
    console.log(password)
    console.log(role)
    User.findOne({
        email: email,
        password: password,
        role: role
    })
        .then(user => {
            res.status(200).json(user.serialize());
            console.log('Logged in as ' + user.name);
            console.log(user);
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Couldn't log in as staff member. Please check email and password." })
        })
       
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