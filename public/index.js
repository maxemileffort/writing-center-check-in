const MOCK_USERS = {
    "users": [
        {
            "id": "11111",
            "name": "John Doe",
            "currentlyWaiting": true,
            "role": "student",
            "recentTime": "3:05",
            "recentRequest": "Jill",
            "email": "jd@ch.edu",
        },
        {
            "id": "22222",
            "name": "Sally Student",
            "currentlyWaiting": false,
            "role": "student",
            "recentTime": "3:10",
            "recentRequest": "Jack",
            "email": "sallystudent@ch.edu",
        },
        {
            "id": "33333",
            "name": "Seymor Butts",
            "currentlyWaiting": true,
            "role": "student",
            "recentTime": "3:15",
            "recentRequest": "Sam",
            "email": "butts@ch.edu",
        },
        {
            "id": "aaaaa",
            "name": "Sam Steak",
            "email": "samsteak@ch.edu",
            "role": "tutor",
        },
        {
            "id": "bbbbb",
            "name": "Jill Hill",
            "email": "jhill@ch.edu",
            "role": "tutor",
        },
        {
            "id": "ccccc",
            "name": "Jack Squat",
            "email": "js@ch.edu",
            "role": "tutor",
        },
        {
            "id": "1a1a1",
            "name": "Barry Allen",
            "email": "theflash@ch.edu",
            "role": "instructor",
        },
        {
            "id": "2b2b2",
            "name": "Clark Kent",
            "email": "redcape@ch.edu",
            "role": "instructor",         
        }
    ]
}

const MOCK_SESSIONS = {
    "sessions" : [
        {
            "date": "2018-11-08",
            "time": "16:00",
            "tutor": "Sam Steak",
            "instructor": "Barry Allen",
            "student": "John Doe",
            "notes": "Talked to John about tractors",
        },
        {
            "date": "2018-11-08",
            "time": "13:00",
            "tutor": "Jack Squat",
            "instructor": "Clark Kent",
            "student": "Seymour Butts",
            "notes": "Talked to Seymour about donkeys",
        },
        {
            "date": "2018-11-09",
            "time": "14:03",
            "tutor": "Sam Steak",
            "instructor": "Barry Allen",
            "student": "Sally Student",
            "notes": "Talked to Sally about physics",
        },
        {
            "date": "2018-11-29",
            "time": "16:00",
            "tutor": "Jill Hill",
            "instructor": "Barry Allen",
            "student": "Sally Student",
            "notes": "Talked to Sally about Superman",
        },
    ]
}

let students = MOCK_USERS.users.filter(user => user.role === "student");
let tutors = MOCK_USERS.users.filter(user => user.role === "tutor");
let instructors = MOCK_USERS.users.filter(user => user.role === "instructor");
let sessions = MOCK_SESSIONS.sessions;

// TODO: 
//     -navigational flow
//     -grab vals from fields
//     -ajax calls

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
$('#student-register-send').on('click', function (event){
    event.preventDefault();
    let msg;
    //make sure email and password fields contain something
    if ($('#student-first-name-reg').val() === '' || $('#student-last-name-reg').val() === '' ||
    $('#student-email-reg').val() === '' || $('#student-password1-reg').val() === '' ||
    $('#student-password2-reg').val() === '' ){
        msg = "All fields are required.";
        $('#student-reg-error').html(`${msg}`);
        console.log("error, empty fields");
        $('#student-register').removeClass('hidden');
    } 
    //make sure passwords match
    if ($('#student-password1-reg').val() !== $('#student-password2-reg').val()){
        msg = "Passwords must match.";
        $('#student-register').removeClass('hidden');
        console.log('passwords do not match')
        $('#student-reg-error').html(`${msg}`);
    }
    // Success, grab values from each input
    let firstName = $('#student-first-name-reg').val();
    let lastName = $('#student-last-name-reg').val();
    let email = $('#student-email-reg').val();
    let password = $('#student-password1-reg').val();
    // console.log(firstName);
    // console.log(lastName);
    // console.log(email);
    // console.log(password);
    let newStudentObject = {
        firstName: firstName,
        lastName: lastName,
        role: "student",
        email: email,
        password: password
    }
    // console.log(newStudentObject)
    //ajax call to endpoint
    $.ajax({ // this ajax call gets randomly called again a minute later after it is called the first time
        type: 'POST',
        url: '/students/create',
        dataType: 'json',
        data: JSON.stringify(newStudentObject),
        contentType: 'application/json'
    })
    //if call is succefull
    .done(function (result) {
        console.log(result);
    })
    //if the call is failing
    .fail(function (jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });
    //route to landing page
    hideAll();
    $('#landing-page').removeClass('hidden');
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

//user tries to login as staff member
$('#staff-login-send').on('click', function () {
    //grab values
    //ajax call
    //render next page based on user role (instructor vs tutor)
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
    $(`.begin-btn-${el}`).on("click", function(){
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
    if (hh > 12) {
        hh = '0' + (hh - 12);
        time = `${hh}:${mm}:${sec} PM`;
    }
    $('.clock').html(`<h2>Current Time: ${time}</h2>`);

}

setInterval(tellTime, 1000); 
// end aesthetic js