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
    "consultants": [
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

$('#student-btn').on('click', function (){
    hideAll();
    showStudentPage();
})

$('#staff-btn').on('click', function () {
    hideAll();
    showConsultantLogin();
})

$('.back').on('click', function () {
    hideAll();
    showLandingPage();
    // console.log('clicked back')
})

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
    <button class="btn start-btn-${el.id}">Start Session</button>
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

function tellTime(){
    let time, today;
    today = new Date();
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