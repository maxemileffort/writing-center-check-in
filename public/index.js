const MOCK_ENTRIES = {
    "students": [
        {
            "id": "11111",
            "name": "John Doe",
            "currentlyWaiting": true,
            "recentTime": "3:05",
            "recentRequest": "Jill",
            "email": "jd@ch.edu",
            "previousSessions": [
                {
                    "date": "Aug 28,2018",
                    "consultant": "Sam Steak",
                    "notes": "talked about blah blah blah"
                },
                {
                    "date": "Sep 5,2018",
                    "consultant": "Jill Hill",
                    "notes": "talked about blah blah blah"
                },
                {
                    "date": "Nov 15,2018",
                    "consultant": "Jack Squat",
                    "notes": "talked about blah blah blah"
                },
            ]
        },
        {
            "id": "22222",
            "name": "Sally Student",
            "currentlyWaiting": false,
            "recentTime": "3:10",
            "recentRequest": "Jack",
            "email": "sallystudent@ch.edu",
            "previousSessions": [
                {
                    "date": "Aug 28,2018",
                    "consultant": "Sam Steak",
                    "notes": "talked about blah blah blah"
                },
                {
                    "date": "Sep 5,2018",
                    "consultant": "Jill Hill",
                    "notes": "talked about blah blah blah"
                },
                {
                    "date": "Nov 15,2018",
                    "consultant": "Jack Squat",
                    "notes": "talked about blah blah blah"
                },
            ]
        },
        {
            "id": "33333",
            "name": "Seymor Butts",
            "currentlyWaiting": true,
            "recentTime": "3:15",
            "recentRequest": "Sam",
            "email": "butts@ch.edu",
            "previousSessions": [
                {
                    "date": "Aug 28,2018",
                    "consultant": "Sam Steak",
                    "notes": "talked about blah blah blah"
                },
                {
                    "date": "Sep 5,2018",
                    "consultant": "Jill Hill",
                    "notes": "talked about blah blah blah"
                },
                {
                    "date": "Nov 15,2018",
                    "consultant": "Jack Squat",
                    "notes": "talked about blah blah blah"
                },
            ]
        }
    ],
    "staff": [
        {
            "id": "aaaaa",
            "name": "Sam Steak",
            "email": "samsteak@ch.edu",
            "previousSessions": [
                {
                    "date": "Aug 28,2018",
                    "student": "John Doe",
                    "notes": "talked about blah blah blah"
                },
                {
                    "date": "Sep 5,2018",
                    "student": "Sally Student",
                    "notes": "talked about blah blah blah"
                },
                {
                    "date": "Nov 15,2018",
                    "student": "Seymor Butts",
                    "notes": "talked about blah blah blah"
                },
            ]
            
        },
        {
            "id": "bbbbb",
            "name": "Jill Hill",
            "email": "jhill@ch.edu",
            "previousSessions": [
                {
                    "date": "Aug 28,2018",
                    "student": "John Doe",
                    "notes": "talked about blah blah blah"
                },
                {
                    "date": "Sep 5,2018",
                    "student": "Sally Student",
                    "notes": "talked about blah blah blah"
                },
                {
                    "date": "Nov 15,2018",
                    "student": "Seymor Butts",
                    "notes": "talked about blah blah blah"
                },
            ]
        },
        {
            "id": "ccccc",
            "name": "Jack Squat",
            "email": "js@ch.edu",
            "previousSessions": [
                {
                    "date": "Aug 28,2018",
                    "student": "John Doe",
                    "notes": "talked about blah blah blah"
                },
                {
                    "date": "Sep 5,2018",
                    "student": "Sally Student",
                    "notes": "talked about blah blah blah"
                },
                {
                    "date": "Nov 15,2018",
                    "student": "Seymor Butts",
                    "notes": "talked about blah blah blah"
                },
            ]
        }
    ],
    "sessions": [
        {
            "id": "1a1a1",
            "name": "Barry Allen",
            "email": "theflash@ch.edu",
            "days-in": [
                "Sep 5, 2018"
            ]
        },
        {
            "id": "2b2b2",
            "name": "Clark Kent",
            "email": "redcape@ch.edu",
            "days-in": [
                "Aug 28, 2018",
                "Nov 15, 2018"
            ]         
        }
    ]
}

const students = MOCK_ENTRIES.students;
const consultants = MOCK_ENTRIES.consultants;
const instructors = MOCK_ENTRIES.instructors;

// TODO: 
//     -navigational flow
//     -grab vals from fields
//     -ajax calls
//     -rewrite mock data for students, staff, and sessions

// begin button behaviors
$('.btn').on('click', function (){
    hideAll();
})
// student buttons
//user clicks student button
$('#student-btn').on('click', function (){
    $('#student-page').removeClass('hidden');
})

//user wants to register as a student
$('#student-register-btn').on('click', function (){
    $('#student-register').removeClass('hidden');
})

// user wants to login as a student
$('#student-login-btn').on('click', function (){
    $('#student-login').removeClass('hidden');
})

// user attempts to register as a student
$('#student-register-send').on('click', function (){
    //make sure email and password fields contain something
    //make sure passwords match
    //grab values from each input
    //ajax call to endpoint
    //route to landing page
})

//user attempts to login as a student
$('#student-login-send').on('click', function (){
    //grab values
    //ajax call
})

// staff buttons
// user clicks staff button
$('#staff-btn').on('click', function () {
    $('#staff-login').removeClass('hidden');
})

$('#staff-login-send').on('click', function () {
    //grab values
    //ajax call
})

// end button behaviors

// begin navigation functions
function hideAll(){
    $('section').addClass('hidden');
}
// end navigation functions

// begin render waitlist
function getWaitingStudents (callbk){
    // console.log(students[0].currentlyWaiting);
    let waitingKids = students.filter(el=>el.currentlyWaiting === true);
    for (let i = 0; i < waitingKids.length; i++){
        callbk(waitingKids[i]);
    }
}

function renderWaitlist(el) {
    $(".waitlist").append(`<li>
    Name: ${el.name} | 
    Walk-in time: ${el.recentTime} | 
    Requested Tutor: ${el.recentRequest} | 
    <button class="btn begin-btn-${el.id}">Start Session</button>
    </li>`);
    // console.log('rendered student entry')
    checkInStudent(el);
}

getWaitingStudents(renderWaitlist);

function checkInStudent(student){
    let el = student.id;
    // console.log(el);
    $(`.start-btn-${el}`).on("click", function(event){
        event.stopPropagation();
        student.currentlyWaiting = false;
        $('.waitlist').html('');
        getWaitingStudents(renderWaitlist);
    })
}
// end render waitlist


// begin aesthetic js
let time; //need access to this for walk-in time
function tellTime(){
    let today = new Date();
    let hh = today.getHours();
    let mm = today.getMinutes();
    let sec = today.getSeconds();
    if(hh<10){
        hh = '0'+hh;
    }
    if(mm<10){
        mm = '0'+mm;
    }
    if(sec<10){
        sec = '0'+sec;
    }
    time = `${hh}:${mm}:${sec}`;
    $('.clock').html(`<h2>Current Time: ${time}</h2>`);

}

setInterval(tellTime, 1000); 
// end aesthetic js