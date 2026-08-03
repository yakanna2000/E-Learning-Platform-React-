/* ==========================================
            lesson.js
        Lesson Operations
========================================== */

let currentCourse = null;
let currentLesson = null;
let courseLessons = [];
let currentLessonIndex = 0;

/* ==========================================
        Initialize Lesson Page
========================================== */

document.addEventListener("DOMContentLoaded", initializeLessonPage);

function initializeLessonPage() {

    protectDashboard();

    loadCurrentUser();

    loadSelectedCourse();

    loadLessons();

    loadCurrentLesson();

}

/* ==========================================
        Load Selected Course
========================================== */

function loadSelectedCourse() {

    currentCourse = getSelectedCourse();

    if (!currentCourse) {

        alert("No course selected.");

        window.location.href = "browse_courses.html";

        return;

    }

    const title = document.getElementById("courseTitle");

    const description = document.getElementById("courseDescription");

    if (title) {

        title.textContent = currentCourse.title;

    }

    if (description) {

        description.textContent = currentCourse.description;

    }

}

/* ==========================================
        Load Lessons
========================================== */

function loadLessons() {

    if (!currentCourse) {

        return;

    }

    courseLessons = getLessonsByCourseId(

        currentCourse.id

    );

    if (courseLessons.length === 0) {

        alert("No lessons available.");

        return;

    }

}

/* ==========================================
        Load Current Lesson
========================================== */

function loadCurrentLesson() {

    if (courseLessons.length === 0) {

        return;

    }

    const savedLesson = getSelectedLesson();

    if (savedLesson) {

        const index = courseLessons.findIndex(

            lesson => lesson.id === savedLesson

        );

        if (index !== -1) {

            currentLessonIndex = index;

        }

    }

    currentLesson =

        courseLessons[currentLessonIndex];

    displayLesson();

}

/* ==========================================
        Display Lesson
========================================== */

function displayLesson() {

    if (!currentLesson) {

        return;

    }

    setSelectedLesson(currentLesson.id);

    const lessonTitle =

        document.getElementById("lessonTitle");

    const lessonDuration =

        document.getElementById("lessonDuration");

    const lessonNumber =

        document.getElementById("lessonNumber");

    const lessonContent =

        document.getElementById("lessonContent");

    if (lessonTitle) {

        lessonTitle.textContent =

            currentLesson.title;

    }

    if (lessonDuration) {

        lessonDuration.textContent =

            currentLesson.duration;

    }

    if (lessonNumber) {

        lessonNumber.textContent =

            "Lesson " +

            (currentLessonIndex + 1) +

            " of " +

            courseLessons.length;

    }

    if (lessonContent) {

        lessonContent.innerHTML =

            currentLesson.content;

    }

    loadLessonVideo();

}

/* ==========================================
        Load Lesson Video
========================================== */

function loadLessonVideo() {

    const video =

        document.getElementById("lessonVideo");

    const source =

        document.getElementById("videoSource");

    if (!video || !source) {

        return;

    }

    source.src = currentLesson.video;

    video.load();

}

/* ==========================================
        Reload Lesson
========================================== */

function reloadLesson() {

    displayLesson();

}

/* ==========================================
        Load Lesson List
========================================== */

function loadLessonList() {

    const container = document.getElementById("lessonContainer");

    if (!container) {

        return;

    }

    container.innerHTML = "";

    courseLessons.forEach((lesson, index) => {

        const lessonItem = document.createElement("div");

        lessonItem.className = "lesson-item";

        if (index === currentLessonIndex) {

            lessonItem.classList.add("active");

        }

        lessonItem.innerHTML = `

            <div>

                <div class="lesson-title">

                    ${index + 1}. ${lesson.title}

                </div>

                <div class="lesson-duration">

                    ${lesson.duration}

                </div>

            </div>

            <i class="fa-solid fa-circle-play"></i>

        `;

        lessonItem.addEventListener("click", function () {

            openLesson(index);

        });

        container.appendChild(lessonItem);

    });

}

/* ==========================================
        Open Lesson
========================================== */

function openLesson(index) {

    currentLessonIndex = index;

    currentLesson = courseLessons[index];

    setSelectedLesson(currentLesson.id);

    displayLesson();

    loadLessonList();

    updateNavigationButtons();

}

/* ==========================================
        Previous Lesson
========================================== */

function previousLesson() {

    if (currentLessonIndex === 0) {

        alert("This is the first lesson.");

        return;

    }

    currentLessonIndex--;

    currentLesson = courseLessons[currentLessonIndex];

    displayLesson();

    loadLessonList();

    updateNavigationButtons();

}

/* ==========================================
        Next Lesson
========================================== */

function nextLesson() {

    if (currentLessonIndex === courseLessons.length - 1) {

        alert("You have reached the last lesson.");

        return;

    }

    currentLessonIndex++;

    currentLesson = courseLessons[currentLessonIndex];

    displayLesson();

    loadLessonList();

    updateNavigationButtons();

}

/* ==========================================
        Navigation Buttons
========================================== */

function updateNavigationButtons() {

    const previousBtn = document.getElementById("previousBtn");

    const nextBtn = document.getElementById("nextBtn");

    if (previousBtn) {

        previousBtn.disabled = currentLessonIndex === 0;

    }

    if (nextBtn) {

        nextBtn.disabled =

            currentLessonIndex === courseLessons.length - 1;

    }

}

/* ==========================================
        Initialize Navigation
========================================== */

function initializeLessonNavigation() {

    const previousBtn = document.getElementById("previousBtn");

    const nextBtn = document.getElementById("nextBtn");

    if (previousBtn) {

        previousBtn.addEventListener(

            "click",

            previousLesson

        );

    }

    if (nextBtn) {

        nextBtn.addEventListener(

            "click",

            nextLesson

        );

    }

    updateNavigationButtons();

}

/* ==========================================
        Lesson Progress Operations
========================================== */

/* ==========================================
        Mark Lesson As Completed
========================================== */

function markLessonCompleted() {

    const user = getCurrentUser();

    if (!user) {

        alert("Please login first.");

        return;

    }

    if (!user.completedLessons) {

        user.completedLessons = [];

    }

    if (!user.completedLessons.includes(currentLesson.id)) {

        user.completedLessons.push(currentLesson.id);

        updateUser(user);

        setCurrentUser(user);

    }

    updateProgress();

    alert("Lesson completed successfully!");

}

/* ==========================================
        Update Progress
========================================== */

function updateProgress() {

    const user = getCurrentUser();

    if (!user) {

        return;

    }

    if (!user.completedLessons) {

        user.completedLessons = [];

    }

    let completed = 0;

    courseLessons.forEach(function (lesson) {

        if (user.completedLessons.includes(lesson.id)) {

            completed++;

        }

    });

    const percentage = Math.round(

        (completed / courseLessons.length) * 100

    );

    const progressFill = document.getElementById("progressFill");

    const progressText = document.getElementById("progressText");

    if (progressFill) {

        progressFill.style.width = percentage + "%";

    }

    if (progressText) {

        progressText.textContent =
            percentage + "% Completed";

    }

}

/* ==========================================
        Resume Learning
========================================== */

function resumeLearning() {

    const user = getCurrentUser();

    if (!user) {

        return;

    }

    if (!user.completedLessons) {

        return;

    }

    const nextLesson = courseLessons.find(

        lesson =>

            !user.completedLessons.includes(lesson.id)

    );

    if (nextLesson) {

        currentLessonIndex =

            courseLessons.indexOf(nextLesson);

        currentLesson = nextLesson;

    }

    else {

        currentLessonIndex =

            courseLessons.length - 1;

        currentLesson =

            courseLessons[currentLessonIndex];

    }

    displayLesson();

    loadLessonList();

    updateNavigationButtons();

    updateProgress();

}

/* ==========================================
        Complete Course
========================================== */

function isCourseCompleted() {

    const user = getCurrentUser();

    if (!user) {

        return false;

    }

    if (!user.completedLessons) {

        return false;

    }

    let completed = 0;

    courseLessons.forEach(function (lesson) {

        if (user.completedLessons.includes(lesson.id)) {

            completed++;

        }

    });

    return completed === courseLessons.length;

}

/* ==========================================
        Finish Course
========================================== */

function finishCourse() {

    if (isCourseCompleted()) {

        alert("🎉 Congratulations!\n\nYou have completed this course.");

    }

}

/* ==========================================
        Complete Button
========================================== */

function initializeCompleteButton() {

    const button =

        document.getElementById("completeBtn");

    if (!button) {

        return;

    }

    button.addEventListener(

        "click",

        function () {

            markLessonCompleted();

            finishCourse();

        }

    );

}

/* ==========================================
        Logout
========================================== */

function initializeLogout() {

    const logoutButton =

        document.getElementById("logoutBtn");

    if (!logoutButton) {

        return;

    }

    logoutButton.addEventListener(

        "click",

        function (event) {

            event.preventDefault();

            if (confirm("Logout?")) {

                logout();

                window.location.href =

                    "login.html";

            }

        }

    );

}

/* ==========================================
        Refresh Lesson
========================================== */

function refreshLesson() {

    displayLesson();

    loadLessonList();

    updateNavigationButtons();

    updateProgress();

}

/* ==========================================
        Initialize Events
========================================== */

function initializeLessonEvents() {

    initializeCompleteButton();

    initializeLogout();

}

/* ==========================================
        Initialize Everything
========================================== */

function initializeLessonPage() {

    protectDashboard();

    loadCurrentUser();

    loadSelectedCourse();

    loadLessons();

    loadCurrentLesson();

    loadLessonList();

    initializeLessonNavigation();

    initializeLessonEvents();

    updateProgress();

}
