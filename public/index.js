const MOCK_ENTRIES = {
    "students": [
        {
            "id": "11111",
            "name": "John Doe",
            "currentlyWaiting": true,
            "email": "jd@ch.edu",
            "previousSessions": [
                {
                    "date": "Aug 28,2018",
                    "tutor": "Sam Steak",
                    "notes": "talked about blah blah blah"
                },
                {
                    "date": "Sep 5,2018",
                    "tutor": "Jill Hill",
                    "notes": "talked about blah blah blah"
                },
                {
                    "date": "Nov 15,2018",
                    "tutor": "Jack Squat",
                    "notes": "talked about blah blah blah"
                },
            ]
        },
        {
            "id": "22222",
            "name": "Sally Student",
            "currentlyWaiting": false,
            "email": "sallystudent@ch.edu",
            "previousSessions": [
                {
                    "date": "Aug 28,2018",
                    "tutor": "Sam Steak",
                    "notes": "talked about blah blah blah"
                },
                {
                    "date": "Sep 5,2018",
                    "tutor": "Jill Hill",
                    "notes": "talked about blah blah blah"
                },
                {
                    "date": "Nov 15,2018",
                    "tutor": "Jack Squat",
                    "notes": "talked about blah blah blah"
                },
            ]
        },
        {
            "id": "33333",
            "name": "Seymor Butts",
            "currentlyWaiting": true,
            "email": "butts@ch.edu",
            "previousSessions": [
                {
                    "date": "Aug 28,2018",
                    "tutor": "Sam Steak",
                    "notes": "talked about blah blah blah"
                },
                {
                    "date": "Sep 5,2018",
                    "tutor": "Jill Hill",
                    "notes": "talked about blah blah blah"
                },
                {
                    "date": "Nov 15,2018",
                    "tutor": "Jack Squat",
                    "notes": "talked about blah blah blah"
                },
            ]
        }
    ],
    "consultants": [
        {
            "id": "aaaaa",
            "name": "Sam Steak",
            "currentlyWaiting": true,
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
            "currentlyWaiting": true,
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
            "currentlyWaiting": true,
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
    "instructors": [
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

function hideAll (){
    $('section').addClass('hidden');
}

function showLandingPage() {
    $('#landing-page').removeClass('hidden');
}

function showStudentPage() {
    $('#student-page').removeClass('hidden');
}

function showConsultantLogin() {
    $('#consultant-login').removeClass('hidden');
}

function showInstructorLogin() {
    $('#instructor-login').removeClass('hidden');
}

$('#student-btn').on('click', function (){
    hideAll();
    showStudentPage();
})

$('#consultant-btn').on('click', function () {
    hideAll();
    showConsultantLogin();
})

$('#instructor-btn').on('click', function () {
    hideAll();
    showInstructorLogin();
})

$('.back').on('click', function () {
    hideAll();
    showLandingPage();
    // console.log('clicked back')
})

function getWaitingStudents (callbk){
    // console.log(students[0].currentlyWaiting);
    for (let i=0; i < students.length; i++){
        if (students[i].currentlyWaiting === true){
            callbk(students[i].name);
        }
    }
}

function renderWaitlist(el) {
    $(".waitlist").append(`<li>${el}</li>`);
}

getWaitingStudents(renderWaitlist);
