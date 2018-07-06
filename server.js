const express = require('express'),
      mongoose = require('mongoose');
      
const app = express();
app.use(express.json());

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { Student, Staff, Session } = require('./models');


app.use(express.static('public'));

app.get("/", (req, res) => {
    console.log('landed on /')
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/queue", (req, res) => {
    console.log('landed on /queue')
    res.sendFile(__dirname + "/public/queue.html");
});

app.post('/students/create', (req, res)=>{
    console.log('trying to create new student');
    console.log(req.body);
    
})

app.post('/students/login', (req, res)=>{
    console.log('trying to login student');
    console.log(req.body);
    
})

// both runServer and closeServer need to access the same
// server object, so we declare `server` here, and then when
// runServer runs, it assigns a value.
let server;

// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchronously starting
// our server, since we'll be dealing with promises there.
function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
        server = app
            .listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve(server);
            })
            .on("error", err => {
                reject(err);
            });
    });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
    return new Promise((resolve, reject) => {
        console.log("Closing server");
        server.close(err => {
            if (err) {
                reject(err);
                // so we don't also call `resolve()`
                return;
            }
            resolve();
        });
    });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };