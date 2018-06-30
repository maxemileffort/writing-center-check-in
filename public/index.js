function hideAll (){
    $('section').addClass('hidden');
}

function showStudentPage() {
    $('#student-page').removeClass('hidden');
}

function showConsultantPage() {
    $('#consultant-page').removeClass('hidden');
    
}

function showInstructorPage() {
    $('#instructor-page').removeClass('hidden');

}

$('#student-btn').on('click', function (){
    hideAll();
    showStudentPage();
})

$('#consultant-btn').on('click', function () {
    hideAll();
    showConsultantPage();
})

$('#instructor-btn').on('click', function () {
    hideAll();
    showInstructorPage();
})
