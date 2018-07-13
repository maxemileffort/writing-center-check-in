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
    for (let i = 0; i < el.length; i++) {
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

//got this error:
// Refused to execute script from 'http://localhost:8080/queue.js'
//  because its MIME type('text/html') is not executable, 
//  and strict MIME type checking is enabled.
