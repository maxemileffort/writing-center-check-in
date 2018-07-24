//TODO:
    // polish

//==========================
//VARIABLE DECLARATIONS
//==========================
let time; //need access to this for walk-in time
let today;

//==========================
// FUNCTION DECLARATIONS
//==========================

function checkEmailExists (inputEmail){
    $.ajax({
        type: 'GET',
        url: `/check-duplicate-email/${inputEmail}`,
        dataType: 'json',
        contentType: 'application/json'
    })
        //if call succeeds
        .done(function (result) {
            console.log(result);
            if (result.entries.length == 0){
              msg = "One email above doesn't exist."
              $("#session-error").html(msg);
              $("#session-notes-submit").attr("disabled", "disabled")  
            } else {
                msg = '';
                $("#session-error").html(msg);  
                $("#session-notes-submit").attr("disabled", false)
            }
        })
        //if the call fails
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function checkDuplicateEmail(inputEmail, role) { //used in registration steps to prevent duplicate ussers
    $.ajax({
        type: 'GET',
        url: `/check-duplicate-email/${inputEmail}`,
        dataType: 'json',
        contentType: 'application/json'
    })
        //if call is succefull
        .done(function (result) {
            console.log(result);
            let msg = "Email is already in use."
            if (result.entries.length !== 0) {
                $(`#${role}-reg-error`).html(msg);
                $(`#${role}-register-send`).attr('disabled', "disabled");
                
            } else {
                $(`#${role}-reg-error`).html();
                $(`#${role}-register-send`).attr('disabled', null);
            }

        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function generateTime(){
    let today = new Date();
    let time;
    let hh = today.getHours();
    let min = today.getMinutes();
    let sec = today.getSeconds();

    if (min < 10) {
        min = '0' + min;
    }

    if (sec < 10) {
        sec = '0' + sec;
    }

    if (hh === '00') {
        hh = 12;
    }

    if (hh > 12) {
        hh = hh - 12;
        if (hh < 10) {
            hh = '0' + hh;
        }

        time = `${hh}:${min}:${sec} PM`;
    }

    else {
        time = `${hh}:${min}:${sec}`;
    }
    return time
}

function generateDate(){
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    today = `${mm}/${dd}/${yyyy}`;
    return today;
}

function hideAll() { //hides everything right before correct page is rendered
    $('section').addClass('hidden');
}

//begin waitlist rendering functions
function getWaitingStudents(callbk) { 
    $.ajax({
        type: 'GET',
        url: `/get-waiting-students/`,
        dataType: 'json',
        contentType: 'application/json'
    })
        //if call is succefull
        .done(function (user) {
            console.log(user)
            callbk(user);
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR.responseJSON.message);
            console.log(error);
            console.log(errorThrown);
        });
}

function renderWaitlist(user) {
    for (let i = 0; i < user.length; i++){
        let sessions = user[i].sessions;
        let mostRecentSession = sessions.length-1;
        console.log(user[i]);
        $(".waitlist").append(`<li>
        <div id="li-1">
            Name: ${user[i].firstName} ${user[i].lastName} || 
            Walk-in time: ${sessions[mostRecentSession].time} || 
            Teacher: ${sessions[mostRecentSession].teacher} ||
            Assignment: ${sessions[mostRecentSession].assignment} ||
            Requested Tutor: ${sessions[mostRecentSession].tutor}
        </div>
        <div id="li-2">
            <button id="make-apt-btn" class="btn begin-btn-${user[i]._id}"><i class="fas fa-angle-double-right"></i></button>
        </div>
        
        </li>`);
        checkInStudent(user[i]._id);
    }
    
}

function checkInStudent(student) { 
    // console.log(el);
    $(`.begin-btn-${student}`).on("click", function (event) {
        // event.preventDefault();
        $(`.begin-btn-${student}`).unbind();
        // console.log(event);
        $.ajax({
            type: 'PUT',
            url: `/check-in-student/${student}/`,
            dataType: 'json',
            contentType: 'application/json'
        })
            //if call is succefull
            .done(function (result) {
                console.log(result);
                $('.waitlist').html('');
                getWaitingStudents(renderWaitlist);
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR.responseJSON.message);
                console.log(error);
                console.log(errorThrown);
            });
        
    })
}
//end waitlist rendering functions

//begin clock
function tellTime() {
    let today = new Date();
    let hh = today.getHours();
    let mm = today.getMinutes();
    let sec = today.getSeconds();
    let pmCheck;

    if (sec < 10) {
        sec = '0' + sec;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    if (hh > 12) {
        hh = hh - 12;
        pmCheck = true;
    } else {
        pmCheck = false;
    }
    
    if (hh < 10) {
        hh = '0' + hh;
    }

    if (hh === '00') {
        hh = 12;
    }

    if (pmCheck){
        time = `${hh}:${mm}:${sec} PM`
    } else {
        time = `${hh}:${mm}:${sec}`
    }
    $('.clock').html(`${time}`);

}

setInterval(tellTime, 1000); 
//end clock

//begin update session
function updateStudentSessions(input) {
    $.ajax({
        type: 'PUT',
        url: '/sessions/update/student/',
        dataType: 'json',
        data: JSON.stringify(input),
        contentType: 'application/json'
    })
        //if call succeeds
        .done(function (output) {
            console.log(output)
            updateTutorSessions(input)
        })
        //if the call fails
        .fail(function (jqXHR, error, errorThrown) {
            console.log(errorThrown);
            console.log(error);
            console.log(jqXHR);
            $("#student-login-error").html(jqXHR);
        });
    
 }

function updateTutorSessions(input) {
    $.ajax({
        type: 'PUT',
        url: '/sessions/update/tutor/',
        dataType: 'json',
        data: JSON.stringify(input),
        contentType: 'application/json'
    })
        //if call succeeds
        .done(function () {
            console.log("finished updating student and tutor sessions")
        })
        //if the call fails
        .fail(function (jqXHR, error, errorThrown) {
            console.log(errorThrown);
            console.log(error);
            console.log(jqXHR);
            $("#student-login-error").html(jqXHR);
        });
    
 }
//end session update


//==========================
// BUTTON BEHAVIOR
//==========================

//waitlist refresh
$('#waitlist-refresh').on('click', function () {
    $('.waitlist').html('');
    getWaitingStudents(renderWaitlist);
})

//home button
$(".home").on("click", function (){
    hideAll();
    $("input").val(""); //clear all the input values
    $('#landing-page').removeClass("hidden"); //take user back to landing page
})

// STUDENT buttons
//user clicks student button
$('#student-btn').on('click', function (){
    hideAll();
    $('#student-login').removeClass('hidden');
})

//user wants to register as a student
$('#student-register-btn').on('click', function (){
    hideAll();
    $('#student-register').removeClass('hidden');
})

//user clicks back button on student-register page
$('#student-register-back').on('click', function (event){
    event.preventDefault();
    hideAll();
    //take student back to login
    $('#student-login').removeClass('hidden');
})

//user clicks back button on student-login page
$('#student-login-back').on('click', function (event) {
    event.preventDefault();
    hideAll();
    //take student back to login page
    $('#landing-page').removeClass('hidden');
})


//check for duplicate email submission when focus leaves email box
$("#student-email-reg").blur(function (event){
    event.preventDefault();
    let email = $('#student-email-reg').val();
    let role = "student";
    console.log(email);
    checkDuplicateEmail(email, role);
});

// user attempts to register as a student
$('#student-register-send').on('click', function (event){ //refactor, setting vals to variables
    event.preventDefault();
    let msg;
    //make sure all fields contain something
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
    else {
        // Success, grab values from each input
        let firstName = $('#student-first-name-reg').val();
        let lastName = $('#student-last-name-reg').val();
        let email = $('#student-email-reg').val();
        let password = $('#student-password1-reg').val();
        let sessions = [];
        
        //create payload
        let newStudentObject = {
            firstName: firstName,
            lastName: lastName,
            role: "student",
            email: email,
            currentlyWaiting: true,
            password: password,
            sessions: sessions,
            time: generateTime(),
            request: generateDate()
        }
        // console.log(newStudentObject)
        //ajax call to endpoint
        $.ajax({ 
            type: 'POST',
            url: '/users/create/student/',
            dataType: 'json',
            data: JSON.stringify(newStudentObject),
            contentType: 'application/json'
        })
            //if call succeeds
            .done(function (student) {
                console.log(student.firstName);
                //route to landing page, temporarily --> needs to route to 
                //check-in page after auto-logging in student
                hideAll();
                $('#student-checkin-page').removeClass('hidden');
                $('#returned-student-name').html(student.firstName);
                readyToCheckin(student);
            })
            //if the call fails
            .fail(function (jqXHR, error, errorThrown) {
                console.log(errorThrown);
                console.log(error);
                console.log(jqXHR.responseJSON.message);
                $("#student-reg-error").html(jqXHR.responseJSON.message);
            });
    }
})

//user attempts to login as a student
$('#student-login-send').on('click', function (event){
    event.preventDefault();
    //grab values
    let email = $('#student-email-login').val();
    let password = $('#student-password-login').val();
    let role = "student";
    let currentlyWaiting = true;
    let studentLoginObject = {
        email: email,
        password: password,
        currentlyWaiting: currentlyWaiting,
        role: role
    };
    //make sure fields aren't blank
    if (email === '' || password === ''){
        let msg = "All fields are required.";
        $('#student-login-error').html(msg);
    } else {
    //ajax call
        $.ajax({ 
            type: 'POST',
            url: `/user/login/${role}/`,
            dataType: 'json',
            data: JSON.stringify(studentLoginObject),
            contentType: 'application/json'
        })
            //if call succeeds
            .done(function (student) {
                // console.log(student);
                //route to checkin page
                hideAll();
                $('#student-checkin-page').removeClass('hidden');
                $('#returned-student-name').html(student.firstName);
                console.log(student);
                readyToCheckin(student);
            })
            //if the call fails
            .fail(function (jqXHR, error, errorThrown) {
                console.log(errorThrown);
                console.log(error);
                console.log(jqXHR.responseJSON.message);
                $("#student-login-error").html(jqXHR.responseJSON.message);
            });
    }
})

//user attempts to checkin as a student
function readyToCheckin(session){
    $('#student-checkin-send').on('click', function (event) {
        $("#student-checkin-send").unbind();
        event.preventDefault();
        let teacher = $('#student-teacher').val();
        let assignment = $('#student-assignment').val();
        let tutor = $('#requested-tutor').val();
        session.request = tutor;
        session.teacher = teacher;
        session.assignment = assignment;
        session.time = generateTime();
        session.date = generateDate();
        console.log( session.firstName+' checked in');
        console.log("Student object:");
        console.log(session);
        // create session
        $.ajax({
            type: 'PUT',
            url: '/sessions/create/',
            dataType: 'json',
            data: JSON.stringify(session),
            contentType: 'application/json'
        })
            //if call succeeds
            .done(function (output) {
                // go back to landing page
                console.log("Session object:");
                console.log(output);
                hideAll();
                $('#landing-page').removeClass('hidden');
            })
            //if the call fails
            .fail(function (jqXHR, error, errorThrown) {
                console.log(errorThrown);
                console.log(error);
                console.log(jqXHR);
                $("#student-login-error").html(jqXHR);
            });
        
    })
}


// STAFF buttons
// user clicks staff button
$('#staff-btn').on('click', function () {
    hideAll();
    $('#staff-login').removeClass('hidden');
})

//user clicks back button on staff-login page
$('#staff-login-back').on('click', function (event) {
    event.preventDefault();
    hideAll();
    $('#landing-page').removeClass('hidden');
})

$("#staff-email-reg").blur(function (event) { //used to prevent duplicate staff from being created
    event.preventDefault();
    let email = $('#staff-email-reg').val();
    let role = "staff"
    console.log(email);
    checkDuplicateEmail(email, role);
});


//user tries to login as staff member
$('#staff-login-send').on('click', function (event) {
    event.preventDefault();
    let email = $('#staff-email-login').val();
    let password = $('#staff-password-login').val();
    let role = $('#role-selector-login').val();
    // console.log(role);
    let staffLoginObject = {
        email: email,
        password: password,
    };
    //make sure fields aren't blank
    if (email === '' || password === '') {
        let msg = "All fields are required.";
        $('#staff-login-error').html(msg);
    } else {
        //ajax call
        $.ajax({
            type: 'POST',
            url: `/user/login/${role}/`,
            dataType: 'json',
            data: JSON.stringify(staffLoginObject),
            contentType: 'application/json'
        })
            //if call succeeds
            .done(function (staff) {
                // console.log(staff);
                console.log('logged in '+ staff.firstName+ " as "+ staff.role);

                hideAll();
                //take us to dashboard
                $('#dashboard').removeClass('hidden');
                getWaitingStudents(renderWaitlist);
                if (staff.role === "tutor"){
                    //render tutor specific tools
                    $('#tutor-dash').removeClass('hidden');
                } else if (staff.role === "instructor"){
                    // render instructor specific tools
                    $('#instructor-dash').removeClass('hidden');
                }
            })
            //if the call fails
            .fail(function (jqXHR, error, errorThrown) {
                console.log(errorThrown);
                console.log(error);
                console.log(jqXHR.responseJSON.message);
                $("#staff-login-error").html(jqXHR.responseJSON.message);
            });
    }
})

//============================
//instructor dashboard buttons
//============================
//session search function
$('#show-search').on('click', function(){
    $('#session-search').removeClass('hidden');
    $('#staff-reg-form').addClass('hidden');
    $('#user-del-form').addClass('hidden');
    
})

//add new staff member
$('#show-staff-reg').on('click', function () {
    $('#staff-reg-form').removeClass('hidden');
    $('#user-del-form').addClass('hidden');
    $('#session-search').addClass('hidden');
})

//delete user
$('#show-user-del').on('click', function () {
    $('#user-del-form').removeClass('hidden');
    $('#staff-reg-form').addClass('hidden');
    $('#session-search').addClass('hidden');
    
})

//instructor search for users
$('#search-btn').on('click', function (event) {
    event.preventDefault();
    let query = $('#session-search-bar').val();
    let role = $("input[name='search-user-type']:checked").val();
    let htmlOutput = ''; // clears it out for every search
    $.ajax({
        type: 'GET',
        url: `/user-search/${role}/${query}/`,
        dataType: 'json',
        contentType: 'application/json'
    })
        //if call succeeds
        .done(function (session) {
            // console.log(session);

             if (session.length === 0) {
                 htmlOutput = "No sessions yet."
             }
             session.map(el=>{
                console.log(el);
                htmlOutput += `<p>Student Name: ${el.studentName}</p>`
                htmlOutput += `<p>Tutor Name: ${el.tutorName}</p>`
                htmlOutput += `<p>Date: ${el.date}</p>`
                htmlOutput += `<p>Time: ${el.time}</p>`
                htmlOutput += `<p>Teacher: ${el.teacher}</p>`
                htmlOutput += `<p>Assignment: ${el.assignment}</p>`
                htmlOutput += `<p>Notes: ${el.notes}</p>`
                htmlOutput += `<hr>`
             })
            
            $("#search-results").html(htmlOutput)
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
})

//instructor tries to register new staff member
$('#staff-register-send').on('click', function (event) {
    event.preventDefault();
    let msg;
    let firstName = $('#staff-first-name-reg').val();
    let lastName = $('#staff-last-name-reg').val();
    let email = $('#staff-email-reg').val();
    let password1 = $('#staff-password1-reg').val();
    let password2 = $('#staff-password2-reg').val();
    let role = $('input[name=role-type]').val();
    // console.log(role);

    //make sure fields aren't blank
    if (email === '' || password1 === '' || password2 === '' || lastName === '' || firstName === '') {
        msg = "All fields are required.";
        $('#staff-reg-error').html(msg);
    } else if (password1 !== password2) {
        msg = "Passwords must match."
        $('#staff-reg-error').html(msg);
    } else {

        //create payload

        let newStaffObject = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password1,
            role: role,
        };

        //ajax call

        $.ajax({
            type: 'POST',
            url: `/users/create/${role}`,
            dataType: 'json',
            data: JSON.stringify(newStaffObject),
            contentType: 'application/json'
        })
            //if call succeeds
            .done(function (user) {
                // console.log(user);
                console.log('Created ' + user.firstName + ' as ' + user.role);
                hideAll();
                $('#landing-page').removeClass('hidden');
            })
            //if the call fails
            .fail(function (jqXHR, error, errorThrown) {
                console.log(errorThrown);
                console.log(error);
                console.log(jqXHR.responseJSON.message);
                $("#staff-reg-error").html(jqXHR.responseJSON.message);
            });
    }
})

//instructor deletes user

$('#del-confirm-check').on('click', function () {
    $('#del-confirm-check').attr("checked", true);
})

$('#user-del-send').on('click', function (event) {
    event.preventDefault();
    if ($('#del-confirm-check').attr('checked')){
        let email = $('#user-del-email').val();
        $.ajax({
            type: 'DELETE',
            url: `/user-delete/${email}/`,
            dataType: 'json',
            contentType: 'application/json'
        })
            //if call succeeds
            .done(function (user) {
                console.log(user)
                console.log("Deleted user with email address " + email)
                $('#user-del-form').addClass('hidden');
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR.responseJSON.message);
                console.log(error);
                console.log(errorThrown);
            });
    } else {
        $("#user-del-error").html("Please check confirmation box.");
        $("label[for=del-confirm-check]").addClass("red");
    }
      
})

//============================
//tutor dashboard buttons
//============================

//make sure student email exists
$("#session-student-email").blur(function (event) {
    event.preventDefault();
    let inputEmail = $("#session-student-email").val();
    checkEmailExists(inputEmail);
});

//make sure tutor email exists
$("#session-tutor-email").blur(function (event) {
    event.preventDefault();
    let inputEmail = $("#session-tutor-email").val();
    checkEmailExists(inputEmail);
});

$('#session-notes-submit').on('click', function(event){ 
    event.preventDefault();
    let studentEmail = $('#session-student-email').val();
    let tutorEmail = $('#session-tutor-email').val();
    let notes = $('#session-notes-text').val();
    let teacher = $('#session-teacher').val();
    let assignment = $('#session-assignment').val();
    let date = generateDate();
    let time = generateTime();

    let sessionObject = {
        studentEmail: studentEmail,
        tutorEmail: tutorEmail,
        notes: notes,
        teacher: teacher,
        assignment: assignment,
        date: date,
        time: time,
    }
    console.log('created session object')

    $.ajax({
        type: 'PUT',
        url: '/sessions/update/',
        dataType: 'json',
        data: JSON.stringify(sessionObject),
        contentType: 'application/json'
    })
        //if call succeeds
        .done(function (output) {
            console.log('call succeeded')
        })
        //if the call fails
        .fail(function (jqXHR, error, errorThrown) {
            console.log(errorThrown);
            console.log(error);
            console.log(jqXHR);
        });
    
    hideAll();
    $('#landing-page').removeClass('hidden');

    
})
// end button behaviors
