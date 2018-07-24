# Writing Center Check-in

Sign in page: https://writing-center-checkin.herokuapp.com/

Waitinglist for checked-in students:  https://writing-center-checkin.herokuapp.com/queue

Technology used: HTML, CSS, Javascript, jQuery, Node, MongoDB

## Images

![landing-page](https://raw.githubusercontent.com/maxemileffort/writing-center-check-in-node-capstone/master/public/img/landing.PNG)
*Landing page.*

![student-login](https://raw.githubusercontent.com/maxemileffort/writing-center-check-in-node-capstone/master/public/img/student-login.PNG)
*Student login.*

![student-reg](https://raw.githubusercontent.com/maxemileffort/writing-center-check-in-node-capstone/master/public/img/student-reg.PNG)
*Student registration.*

![student-checkin](https://raw.githubusercontent.com/maxemileffort/writing-center-check-in-node-capstone/master/public/img/student-checkin.PNG)
*Student check in.*

![queue](https://raw.githubusercontent.com/maxemileffort/writing-center-check-in-node-capstone/master/public/img/queue.PNG)
*Queue*

![staff-login](https://raw.githubusercontent.com/maxemileffort/writing-center-check-in-node-capstone/master/public/img/staff-login.PNG)
*Staff login.*

![instructor-dash-landing](https://raw.githubusercontent.com/maxemileffort/writing-center-check-in-node-capstone/master/public/img/instructor-dash-landing.PNG)
*Instructor dashboard.*

![instructor-pre-search](https://raw.githubusercontent.com/maxemileffort/writing-center-check-in-node-capstone/master/public/img/instructor-pre-search.PNG)
*Instructor session search.*

![instructor-post-search](https://raw.githubusercontent.com/maxemileffort/writing-center-check-in-node-capstone/master/public/img/instructor-post-search.PNG)
*Session search results.*

![instructor-staff-reg](https://raw.githubusercontent.com/maxemileffort/writing-center-check-in-node-capstone/master/public/img/instructor-staff-reg.PNG)
*Staff registration.*

![instructor-user-del](https://raw.githubusercontent.com/maxemileffort/writing-center-check-in-node-capstone/master/public/img/instructor-user-del.PNG)
*User delete.*

![tutor-session](https://raw.githubusercontent.com/maxemileffort/writing-center-check-in-node-capstone/master/public/img/tutor-session.PNG)
*Tutor session.*

## Idea

This project arose from my wife wanting to start a writing center at the school that she works at. I volunteered to help her tackle record keeping
and waitlisting students that arrive. That way, if teachers wanted records of which of their students were using this service, they could see that,
as well as what was being talked about and the degree to which it was helping their students.

## Planning

![wireframe](https://raw.githubusercontent.com/maxemileffort/writing-center-check-in-node-capstone/master/public/img/wireframe.jpg)
*Basic wireframe. Sorry for using notebook paper.*

### First, some context: 
There would be a tablet kiosk that people would have access to when they walk-in.
Also there are 3 basic users: students, consultants (tutors), and instructors (admins).
Tutors are also students, and students have access to chromebooks issued by the school.
Instructors have access to school computers as well as their IT department.

### On to the flow of the app:
**Students:**
Students can either login or register.
From there, they get taken to a check-in, where they can input their teacher, the assignment they are working on,
and request a specific tutor if they are available.
From their, the information populates a waitlist with entries based on login info and student input. Tutors and instructors can see the waitlist, and the waitlist may also be on another screen somewhere in the room where it is visible to people waiting in line.

**Staff:**
Staff comes in and logs in, and then the next screen differs depending on their role (admin or tutor).
Admin gets a sort of dashboard that lets them search previous sessions, which is useful for teachers wanting to 
see what feedback was given or possibly for extra credit for students getting extra help. They are also able to add tutors
and other instructors.
Tutors are taken to a series of inputs where they type their name, the student's name, and any notes about the session, which is all
saved for later so that an instructor can search it later if the need arises.

