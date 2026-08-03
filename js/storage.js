/* ==========================================
        storage.js
        Local Storage Operations
========================================== */

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

const COURSES_KEY = "courses";
const LESSONS_KEY = "lessons";
/* ==========================================
        Initialize Users
========================================== */

function initializeUsers(defaultUsers = []) {

    const users = localStorage.getItem(USERS_KEY);

    if (users === null) {

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(defaultUsers)
        );

    }

}

/* ==========================================
        Get All Users
========================================== */

function getUsers() {

    const users = localStorage.getItem(USERS_KEY);

    if (users === null) {
        return [];
    }

    return JSON.parse(users);

}

/* ==========================================
        Save Users
========================================== */

function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}

/* ==========================================
        Add New User
========================================== */

function addUser(user) {

    const users = getUsers();

    users.push(user);

    saveUsers(users);

}

/* ==========================================
        Find User By Email
========================================== */

function findUserByEmail(email) {

    const users = getUsers();

    return users.find(user =>

        user.email.toLowerCase() ===
        email.toLowerCase()

    );

}

/* ==========================================
        Find User By ID
========================================== */

function findUserById(id) {

    const users = getUsers();

    return users.find(user => user.id === id);

}

/* ==========================================
        Update User
========================================== */

function updateUser(updatedUser) {

    const users = getUsers();

    const index = users.findIndex(

        user => user.id === updatedUser.id

    );

    if (index !== -1) {

        users[index] = updatedUser;

        saveUsers(users);

    }

}

/* ==========================================
        Delete User
========================================== */

function deleteUser(id) {

    const users = getUsers();

    const updatedUsers = users.filter(

        user => user.id !== id

    );

    saveUsers(updatedUsers);

}

/* ==========================================
        Save Current User
========================================== */

function setCurrentUser(user) {

    localStorage.setItem(

        CURRENT_USER_KEY,

        JSON.stringify(user)

    );

}

/* ==========================================
        Get Current User
========================================== */

function getCurrentUser() {

    const user = localStorage.getItem(

        CURRENT_USER_KEY

    );

    if (user === null) {

        return null;

    }

    return JSON.parse(user);

}

/* ==========================================
        Is Logged In
========================================== */

function isLoggedIn() {

    return getCurrentUser() !== null;

}

/* ==========================================
        Logout
========================================== */

function logout() {

    localStorage.removeItem(

        CURRENT_USER_KEY

    );

}

/* ==========================================
        Generate User ID
========================================== */

function generateUserId() {

    const users = getUsers();

    if (users.length === 0) {

        return 1;

    }

    const maxId = Math.max(

        ...users.map(user => user.id)

    );

    return maxId + 1;

}

/* ==========================================
        Clear All Storage
        (Testing Purpose)
========================================== */

function clearStorage() {

    localStorage.clear();

}


/* ==========================================
        Initialize Courses
========================================== */

function initializeCourses(defaultCourses = []) {

    const courses = localStorage.getItem(COURSES_KEY);

    if (courses === null) {

        localStorage.setItem(

            COURSES_KEY,

            JSON.stringify(defaultCourses)

        );

    }

}

/* ==========================================
        Get All Courses
========================================== */

function getCourses() {

    const courses = localStorage.getItem(COURSES_KEY);

    if (courses === null) {

        return [];

    }

    return JSON.parse(courses);

}

/* ==========================================
        Save Courses
========================================== */

function saveCourses(courses) {

    localStorage.setItem(

        COURSES_KEY,

        JSON.stringify(courses)

    );

}

/* ==========================================
        Get Course By ID
========================================== */

function getCourseById(id) {

    const courses = getCourses();

    return courses.find(

        course => course.id === id

    );

}

/* ==========================================
        Add Course
========================================== */

function addCourse(course) {

    const courses = getCourses();

    courses.push(course);

    saveCourses(courses);

}

/* ==========================================
        Update Course
========================================== */

function updateCourse(updatedCourse) {

    const courses = getCourses();

    const index = courses.findIndex(

        course => course.id === updatedCourse.id

    );

    if (index !== -1) {

        courses[index] = updatedCourse;

        saveCourses(courses);

    }

}

/* ==========================================
        Delete Course
========================================== */

function deleteCourse(id) {

    const courses = getCourses();

    const updatedCourses = courses.filter(

        course => course.id !== id

    );

    saveCourses(updatedCourses);

}

/* ==========================================
        Generate Course ID
========================================== */

function generateCourseId() {

    const courses = getCourses();

    if (courses.length === 0) {

        return 1;

    }

    const maxId = Math.max(

        ...courses.map(course => course.id)

    );

    return maxId + 1;

}


/* ==========================================
        Lesson Storage Operations
========================================== */

/* ==========================================
        Initialize Lessons
========================================== */

function initializeLessons(defaultLessons = []) {

    const lessons = localStorage.getItem(LESSONS_KEY);

    if (lessons === null) {

        localStorage.setItem(

            LESSONS_KEY,

            JSON.stringify(defaultLessons)

        );

    }

}

/* ==========================================
        Get All Lessons
========================================== */

function getLessons() {

    const lessons = localStorage.getItem(LESSONS_KEY);

    if (lessons === null) {

        return [];

    }

    return JSON.parse(lessons);

}

/* ==========================================
        Save Lessons
========================================== */

function saveLessons(lessons) {

    localStorage.setItem(

        LESSONS_KEY,

        JSON.stringify(lessons)

    );

}

/* ==========================================
        Get Lesson By ID
========================================== */

function getLessonById(id) {

    const lessons = getLessons();

    return lessons.find(

        lesson => lesson.id === id

    );

}

/* ==========================================
        Get Lessons By Course ID
========================================== */

function getLessonsByCourseId(courseId) {

    const lessons = getLessons();

    return lessons.filter(

        lesson => lesson.courseId === courseId

    );

}

/* ==========================================
        Add Lesson
========================================== */

function addLesson(lesson) {

    const lessons = getLessons();

    lessons.push(lesson);

    saveLessons(lessons);

}

/* ==========================================
        Update Lesson
========================================== */

function updateLesson(updatedLesson) {

    const lessons = getLessons();

    const index = lessons.findIndex(

        lesson => lesson.id === updatedLesson.id

    );

    if (index !== -1) {

        lessons[index] = updatedLesson;

        saveLessons(lessons);

    }

}

/* ==========================================
        Delete Lesson
========================================== */

function deleteLesson(id) {

    const lessons = getLessons();

    const updatedLessons = lessons.filter(

        lesson => lesson.id !== id

    );

    saveLessons(updatedLessons);

}

/* ==========================================
        Generate Lesson ID
========================================== */

function generateLessonId() {

    const lessons = getLessons();

    if (lessons.length === 0) {

        return 1;

    }

    const maxId = Math.max(

        ...lessons.map(

            lesson => lesson.id

        )

    );

    return maxId + 1;

}

/* ==========================================
        Get Next Lesson
========================================== */

function getNextLesson(courseId, currentLessonId) {

    const lessons = getLessonsByCourseId(courseId);

    const index = lessons.findIndex(

        lesson => lesson.id === currentLessonId

    );

    if (index === -1 || index === lessons.length - 1) {

        return null;

    }

    return lessons[index + 1];

}

/* ==========================================
        Get Previous Lesson
========================================== */

function getPreviousLesson(courseId, currentLessonId) {

    const lessons = getLessonsByCourseId(courseId);

    const index = lessons.findIndex(

        lesson => lesson.id === currentLessonId

    );

    if (index <= 0) {

        return null;

    }

    return lessons[index - 1];

}

/* Application data collections.  Keeping these helpers here means every
   feature uses one LocalStorage gateway rather than duplicating storage code. */
const E_LEARN_DATA_KEYS = {
    assignments: "assignments", feedback: "feedback", enrollments: "enrolledCourses",
    progress: "progress", notifications: "notifications", certificates: "certificates",
    selectedCourse: "selectedCourse", selectedLesson: "selectedLesson"
};

function readCollection(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch (error) { return []; }
}
function writeCollection(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function initializeCollection(key, seed) { if (localStorage.getItem(key) === null) writeCollection(key, seed || []); }
function initializeAssignments(seed) { initializeCollection(E_LEARN_DATA_KEYS.assignments, seed); }
function getAssignments() { return readCollection(E_LEARN_DATA_KEYS.assignments); }
function saveAssignments(items) { writeCollection(E_LEARN_DATA_KEYS.assignments, items); }
function initializeFeedback(seed) { initializeCollection(E_LEARN_DATA_KEYS.feedback, seed); }
function getFeedback() { return readCollection(E_LEARN_DATA_KEYS.feedback); }
function saveFeedback(items) { writeCollection(E_LEARN_DATA_KEYS.feedback, items); }
function initializeEnrollments(seed) { initializeCollection(E_LEARN_DATA_KEYS.enrollments, seed); }
function getEnrolledCourses() { return readCollection(E_LEARN_DATA_KEYS.enrollments); }
function saveEnrolledCourses(items) { writeCollection(E_LEARN_DATA_KEYS.enrollments, items); }
function initializeProgressData(seed) { initializeCollection(E_LEARN_DATA_KEYS.progress, seed); }
function getProgress() { return readCollection(E_LEARN_DATA_KEYS.progress); }
function saveProgressData(items) { writeCollection(E_LEARN_DATA_KEYS.progress, items); }
function initializeNotifications(seed) { initializeCollection(E_LEARN_DATA_KEYS.notifications, seed); }
function getNotifications() { return readCollection(E_LEARN_DATA_KEYS.notifications); }
function saveNotifications(items) { writeCollection(E_LEARN_DATA_KEYS.notifications, items); }
function generateId(prefix) { return (prefix || "id") + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7); }
function setSelectedCourse(courseId) { localStorage.setItem(E_LEARN_DATA_KEYS.selectedCourse, String(courseId)); }
function getSelectedCourse() { const id = Number(localStorage.getItem(E_LEARN_DATA_KEYS.selectedCourse)); return id ? getCourseById(id) : null; }
function setSelectedLesson(lessonId) { localStorage.setItem(E_LEARN_DATA_KEYS.selectedLesson, String(lessonId)); }
function getSelectedLesson() { return Number(localStorage.getItem(E_LEARN_DATA_KEYS.selectedLesson)) || null; }
function hasRole(role) { const user = getCurrentUser(); return Boolean(user && user.role === role); }

window.ELearnStore = {
    initializeUsers, initializeCourses, initializeLessons, initializeAssignments, initializeFeedback,
    initializeEnrollments, initializeProgress: initializeProgressData, initializeNotifications,
    getUsers, saveUsers, getCourses, saveCourses, getLessons, saveLessons, getAssignments, saveAssignments,
    getFeedback, saveFeedback, getProgress, saveProgress: saveProgressData, getNotifications, saveNotifications,
    getEnrolledCourses, saveEnrolledCourses, setCurrentUser, getCurrentUser, logout, generateId,
    setSelectedCourse, getSelectedCourse, setSelectedLesson, getSelectedLesson, hasRole,
    getCourseById, getLessonsByCourseId, addCourse, updateCourse, deleteCourse, addLesson, updateLesson, deleteLesson
};
