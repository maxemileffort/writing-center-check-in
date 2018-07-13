//TODO:
    // encryption
    // polish
    // staff tools
    // waitlist => add student and tutor and instructor emails to session,
    //             add intermediate "appointment" step that tutor clicks to start session 


//==========================
//VARIABLE DECLARATIONS
//==========================
let time; //need access to this for walk-in time
let today;

//==========================
// FUNCTION DECLARATIONS
//==========================

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
            if (result.entries.length !== 0) {
                alert("Email is in use already.")
                $(`#${role}-register-send`).attr('disabled', "disabled");
                
            } else {
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
        .done(function (result) {
            console.log(result)
            callbk(result);
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR.responseJSON.message);
            console.log(error);
            console.log(errorThrown);
        });
}

function renderWaitlist(el) {
    for (let i = 0; i < el.length; i++){
        $(".waitlist").append(`<li>
        Name: ${el[i].firstName} | 
        Walk-in time: ${el[i].time} | 
        Teacher: ${el[i].teacher} |
        Assignment: ${el[i].assignment} |
        Requested Tutor: ${el[i].tutor} | 
        <button class="btn begin-btn-${el[i]._id}">Start Session</button>
        </li>`);
        checkInStudent(el[i]._id);
    }
    // console.log('rendered student entry')
}

getWaitingStudents(renderWaitlist);

function checkInStudent(student) { 
    // console.log(el);
    $(`.begin-btn-${student}`).on("click", function (event) {
        // event.preventDefault();
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
        if (hh < 10) {
            hh = '0' + hh;
        }
        time = `${hh}:${mm}:${sec} PM`;
    }

    else {
        time = `${hh}:${mm}:${sec}`;
    }


    $('.clock').html(`<h2>Current Time: ${time}</h2>`);

}

setInterval(tellTime, 1000); 
//end clock


//==========================
// BUTTON BEHAVIOR
//==========================
// STUDENT buttons
//user clicks student button
$('#student-btn').on('click', function (){
    hideAll();
    $('#student-page').removeClass('hidden');
})

//user wants to register as a student
$('#student-register-btn').on('click', function (){
    hideAll();
    $('#student-register').removeClass('hidden');
})

// user wants to login as a student
$('#student-login-btn').on('click', function (){
    hideAll();
    $('#student-login').removeClass('hidden');
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
        
        //create payload
        let newStudentObject = {
            firstName: firstName,
            lastName: lastName,
            role: "student",
            email: email,
            currentlyWaiting: true,
            password: password,
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
                console.log(student);
                //route to landing page, temporarily --> needs to route to 
                //check-in page after auto-logging in student
                hideAll();
                $('#student-checkin-page').removeClass('hidden');
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
    let studentLoginObject = {
        email: email,
        password: password,
    };
    //make sure fields aren't blank
    if (email === '' || password === ''){
        let msg = "All fields are required.";
        $('#student-login-error').html(msg);
    } else {
    //ajax call
        $.ajax({ 
            type: 'POST',
            url: '/students/login/',
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
                $('#returned-student-name').html(student.name);
                student.recentTime = time;
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
function readyToCheckin(student){
    $('#student-checkin-send').on('click', function (event) {
        let today = new Date();
        let time;
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        let hh = today.getHours();
        let min = today.getMinutes();
        let sec = today.getSeconds();
        today = `${mm}/${dd}/${yyyy}`

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
            if (hh < 10) {
                hh = '0' + hh;
            }

            time = `${hh}:${min}:${sec} PM`;
        }

        else {
            time = `${hh}:${min}:${sec}`;
        }
        event.preventDefault();
        let teacher = $('#student-teacher').val();
        let assignment = $('#student-assignment').val();
        let tutor = $('#requested-tutor').val();
        student.recentRequest = tutor;
        student.teacher = teacher;
        student.assignment = assignment;
        student.time = time;
        student.date = today;
        console.log( student.name+' checked in');
        console.log("Student object:");
        console.log(student);
        // create session
        $.ajax({
            type: 'POST',
            url: '/sessions/create/',
            dataType: 'json',
            data: JSON.stringify(student),
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
                console.log(jqXHR.responseJSON.message);
                $("#student-login-error").html(jqXHR.responseJSON.message);
            });
        
    })
}


// STAFF buttons
// user clicks staff button
$('#staff-btn').on('click', function () {
    hideAll();
    $('#staff-login').removeClass('hidden');
    let msg;
    $('#staff-reg-error').html(msg);
})

$("#staff-email-reg").blur(function (event) { //used to prevent duplicate staff from being created
    event.preventDefault();
    let email = $('#staff-email-reg').val();
    let role = "staff"
    console.log(email);
    checkDuplicateEmail(email, role);
});

//user tries to register as staff member
$('#staff-register-send').on('click', function (event) {
    event.preventDefault();
    let msg;
    let firstName = $('#staff-first-name-reg').val();
    let lastName = $('#staff-last-name-reg').val();
    let email = $('#staff-email-reg').val();
    let password1 = $('#staff-password1-reg').val();
    let password2 = $('#staff-password2-reg').val();
    let role = $('#role-selector-reg').val();
    // console.log(role);
    
    //make sure fields aren't blank
    if (email === '' || password1 === '' || password2 === '' || lastName === '' || firstName === '') {
        msg = "All fields are required.";
        $('#staff-reg-error').html(msg);
    } else if (password1 !== password2){
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
            .done(function (staff) {
                // console.log(staff);
                console.log('Created ' + staff.name+' as '+staff.role);
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
    //render next page based on user role (instructor vs tutor)
})

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
            url: `/staff/login/${role}/`,
            dataType: 'json',
            data: JSON.stringify(staffLoginObject),
            contentType: 'application/json'
        })
            //if call succeeds
            .done(function (staff) {
                // console.log(staff);
                console.log('logged in '+ staff.name+ " as "+ staff.role);

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


// end button behaviors
