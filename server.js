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
            res.status(200).json({
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

app.get('/get-waiting-students/', (req, res)=>{
    User.find({
        currentlyWaiting: true,
    })
    .then(user=>{
        console.log(user);
        Session.find({
            _id: user._id
        })
        .then(session=>console.log(session))
        res.status(200).json(user);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).json({
            message: 'Something went wrong rendering the waitlist.'
        });
    })

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
    let currentlyWaiting = req.body.currentlyWaiting;

    console.log('trying to create new ' + role);

    User.create({
        firstName,
        lastName,
        role,
        email,
        currentlyWaiting,
        password,
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
    
    let student = req.body.name;
    let tutor = req.body.recentRequest;
    let teacher = req.body.teacher;
    let assignment = req.body.assignment;
    let date = req.body.date;
    let time = req.body.time;
    let notes = "";
    Session.create({
        date,
        time,
        tutor,
        teacher,
        assignment,
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
        console.log(user);
        user.currentlyWaiting = true;
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
            if (user.role === "instructor"){
                instructor = user.name;
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Couldn't log in as staff member. Please check email and password." })
        })
       
})
//END Login users

//====================
//PUT endpoints
//====================

app.put('/check-in-student/:id/', (req,res)=>{
    let id = req.params.id;
    User.findOneAndUpdate(
        {_id: id},
        {$set: { currentlyWaiting: false }}
    ).then(session=>{
        res.status(200).json({session})
        console.log(session);
    }).catch(err => {
            console.log(err);
            res.status(500).json({ message: "Couldn't check in student. Please ask instructor for assistance." })
        })
})

//====================
//DELETE endpoints
//====================


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