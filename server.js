const express   = require('express'),
      mongoose  = require('mongoose'),
      bcrypt    = require('bcrypt');
      
const app = express();
app.use(express.json());

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { User, Session } = require('./models');


app.use(express.static('public'));

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
app.post('/users/create/:role', (req, res) => {

    //take the paylod from the ajax api call
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let role = req.params.role;
    let password = req.body.password;
    let currentlyWaiting = req.body.currentlyWaiting;
    let sessions = req.body.sessions;
    let time = req.body.time;
    let request = req.body.request;

    //exclude extra spaces from the email and password
    email = email.trim();
    password = password.trim();

    //create an encryption key
    bcrypt.genSalt(10, (err, salt) => {

        //if creating the key returns an error...
        if (err) {

            //display it
            return res.status(500).json({
                message: "Couldn't create salt."
            });
        }

        //using the encryption key above generate an encrypted pasword
        bcrypt.hash(password, salt, (err, hash) => {

            //if creating the ncrypted pasword returns an error..
            if (err) {

                //display it
                return res.status(500).json({
                    message: "Couldn't create hash."
                });
            }

            //using the mongoose DB schema, connect to the database and create the new user
            User.create({
                firstName,
                lastName,
                email,
                password: hash,
                currentlyWaiting,
                role,
                sessions,
                time,
                request
            }, (err, item) => {

                //if creating a new user in the DB returns an error..
                if (err) {
                    //display it
                    return res.status(500).json({
                        message: "Couldn't create user."
                    });
                }
                //if creating a new user in the DB is succefull
                if (item) {

                    //display the new user
                    console.log(`User \`${email}\` created.`);
                    res.status(201).json(item);
                }
            });
        });
    });
});
//End creating new users

//Begin login users
app.post('/user/login/:role/', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let role = req.params.role;
    console.log('trying to login ' + role + " user");

    //login for students
    if(role === "student"){
        User.findOne(
            {email: email},
        )
            .then(user=> {
                let hash = user.password;
                bcrypt.compare(password, hash, (err, result)=>{
                    if (result){
                        res.status(200).json(user);
                    } else {
                        console.log(err)
                        res.status(500).json({message: "Please check email and password and try again."})
                    }
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ message: "Please ask instructor for assistance." })
            })
    }
    
    //login for staff
    else {
        User.findOne({
            email: email,
        })
            .then(user => {
                hash = user.password
                if (bcrypt.compare(password, hash)) {
                    console.log("passwords match");
                    res.status(200).json(user);
                }
                else {
                    console.log("passwords don't match");
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ message: "Couldn't log in as staff. Please check email and password." })
            })
    }

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
    ).then(user=>{
        res.status(200).json({user})
        console.log(user);
    }).catch(err => {
            console.log(err);
            res.status(500).json({ message: "Couldn't check in student. Please ask instructor for assistance." })
        })
})

// Create new session
app.put('/sessions/create/', (req, res)=>{
    console.log('trying to create new session');
    let email = req.body.email
    let tutor = req.body.request;
    let teacher = req.body.teacher;
    let assignment = req.body.assignment;
    let date = req.body.date;
    let time = req.body.time;
    let sessions = req.body.sessions;
    let notes = "";
    let sessionObject = {
        tutor: tutor,
        teacher: teacher,
        assignment: assignment,
        date: date,
        time: time,
        notes: notes,
    }
    User.findOneAndUpdate(
        { email: email },
        { $push: {sessions: sessionObject},
         $set: {currentlyWaiting: true}}
    )
    .then(user => {
        res.status(201).json(user);
        console.log("Session for " + user.email + " created.")
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Couldn't create session." });
    });

})
//End creating new sessions

//====================
//DELETE endpoints
//====================

//====================
//Catchall endpoint
//====================
app.get('*', function (req, res) {
    let message = "Page not found."
    res.status(404).send(message);
});

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