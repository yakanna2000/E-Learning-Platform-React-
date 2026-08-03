/* ==========================================
        course.js
        Course Operations
========================================== */

document.addEventListener("DOMContentLoaded", initializeCoursePage);

/* ==========================================
        Initialize Page
========================================== */

function initializeCoursePage() {

    loadCourses();

    initializeSearch();

}

/* ==========================================
        Load All Courses
========================================== */

function loadCourses() {

    const courseContainer = document.getElementById("courseContainer");

    if (!courseContainer) {

        return;

    }

    const courses = getCourses();

    courseContainer.innerHTML = "";

    courses.forEach(course => {

        const card = createCourseCard(course);

        courseContainer.appendChild(card);

    });

}

/* ==========================================
        Create Course Card
========================================== */

function createCourseCard(course) {

    const div = document.createElement("div");

    div.className = "course-card";

    div.innerHTML = `

        <img src="${course.image}" alt="${course.title}">

        <h3>${course.title}</h3>

        <p>${course.description}</p>

        <p><strong>Instructor:</strong> ${course.instructor}</p>

        <p><strong>Duration:</strong> ${course.duration}</p>

        <button
            class="btn btn-primary"
            onclick="viewCourse(${course.id})">

            View Course

        </button>

    `;

    return div;

}

/* ==========================================
        Search Courses
========================================== */

function initializeSearch() {

    const search = document.getElementById("searchCourse");

    if (!search) {

        return;

    }

    search.addEventListener("keyup", function () {

        const keyword = this.value.toLowerCase();

        searchCourses(keyword);

    });

}

/* ==========================================
        Search Logic
========================================== */

function searchCourses(keyword) {

    const cards = document.querySelectorAll(".course-card");

    cards.forEach(card => {

        const title = card
            .querySelector("h3")
            .textContent
            .toLowerCase();

        if (title.includes(keyword)) {

            card.style.display = "block";

        }

        else {

            card.style.display = "none";

        }

    });

}

/* ==========================================
        View Course
========================================== */

function viewCourse(id) {

    localStorage.setItem(

        "selectedCourse",

        id

    );

    window.location.href = "course_details.html";

}

/* ==========================================
        Load Selected Course
========================================== */

function loadCourseDetails() {

    const courseId = Number(

        localStorage.getItem("selectedCourse")

    );

    if (!courseId) {

        return;

    }

    const title = document.getElementById("courseTitle");

    const image = document.getElementById("courseImage");

    const description = document.getElementById("courseDescription");

    const instructor = document.getElementById("courseInstructor");

    const duration = document.getElementById("courseDuration");

    if (title) {

        title.textContent = course.title;

    }

    if (image) {

        image.src = course.image;

    }

    if (description) {

        description.textContent = course.description;

    }

    if (instructor) {

        instructor.textContent = course.instructor;

    }

    if (duration) {

        duration.textContent = course.duration;

    }

    const course = getCourseById(courseId);

    if (!course) {

        return;

    }

}

/* ==========================================
        Enroll Course
========================================== */

function enrollCourse(courseId) {

    const user = getCurrentUser();

    if (!user) {

        alert("Please login first.");

        return;

    }

    if (!user.enrolledCourses) {

        user.enrolledCourses = [];

    }

    if (user.enrolledCourses.includes(courseId)) {

        alert("Already enrolled.");

        return;

    }

    user.enrolledCourses.push(courseId);

    updateUser(user);

    setCurrentUser(user);

    alert("Course enrolled successfully.");

}

/* ==========================================
        Check Enrollment
========================================== */

function isEnrolled(courseId) {

    const user = getCurrentUser();

    if (!user) {

        return false;

    }

    if (!user.enrolledCourses) {

        return false;

    }

    return user.enrolledCourses.includes(courseId);

}

/* ==========================================
        Display Recommended Courses
========================================== */

function loadRecommendedCourses(limit = 3) {

    const container = document.getElementById("recommendedCourses");

    if (!container) {

        return;

    }

    container.innerHTML = "";

    const courses = getCourses();

    courses.slice(0, limit).forEach(course => {

        container.appendChild(

            createCourseCard(course)

        );

    });

}
