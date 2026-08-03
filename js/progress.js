/* ==========================================
        progress.js
========================================== */

let progressData = null;

/* ==========================================
        Initialize Progress
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeProgress

);

function initializeProgress() {

    loadProgress();

}

/* ==========================================
        Load Progress
========================================== */

function loadProgress() {

    const user = getCurrentUser();

    if (!user) {

        return;

    }

    progressData = {

        userId: user.id,

        completedLessons:

            user.completedLessons || [],

        enrolledCourses:

            user.enrolledCourses || []

    };

}

/* ==========================================
        Save Progress
========================================== */

function saveProgress() {

    const user = getCurrentUser();

    if (!user) {

        return;

    }

    user.completedLessons =

        progressData.completedLessons;

    updateUser(user);

    setCurrentUser(user);

}

/* ==========================================
        Calculate Course Progress
========================================== */

function calculateCourseProgress(courseId) {

    const lessons =

        getLessonsByCourseId(courseId);

    if (lessons.length === 0) {

        return 0;

    }

    let completed = 0;

    lessons.forEach(function (lesson) {

        if (

            progressData.completedLessons.includes(

                lesson.id

            )

        ) {

            completed++;

        }

    });

    return Math.round(

        (completed / lessons.length) * 100

    );

}

/* ==========================================
        Update Progress
========================================== */

function updateCourseProgress(courseId, lessonId) {

    if (

        !progressData.completedLessons.includes(

            lessonId

        )

    ) {

        progressData.completedLessons.push(

            lessonId

        );

        saveProgress();

    }

}

/* ==========================================
        Progress Bar
========================================== */

function updateProgressBar(courseId) {

    const percentage =

        calculateCourseProgress(courseId);

    const bar =

        document.getElementById("progressFill");

    const text =

        document.getElementById("progressText");

    if (bar) {

        bar.style.width =

            percentage + "%";

    }

    if (text) {

        text.textContent =

            percentage + "% Completed";

    }

}

/* ==========================================
        Resume Learning
========================================== */

function resumeLearning(courseId) {

    const lessons = getLessonsByCourseId(courseId);

    if (lessons.length === 0) {

        return null;

    }

    const nextLesson = lessons.find(function (lesson) {

        return !progressData.completedLessons.includes(lesson.id);

    });

    if (nextLesson) {

        return nextLesson;

    }

    return lessons[lessons.length - 1];

}

/* ==========================================
        Last Completed Lesson
========================================== */

function getLastCompletedLesson(courseId) {

    const lessons = getLessonsByCourseId(courseId);

    let lastLesson = null;

    lessons.forEach(function (lesson) {

        if (progressData.completedLessons.includes(lesson.id)) {

            lastLesson = lesson;

        }

    });

    return lastLesson;

}

/* ==========================================
        Course Completion Status
========================================== */

function isCourseCompleted(courseId) {

    return calculateCourseProgress(courseId) === 100;

}

/* ==========================================
        Overall Learning Progress
========================================== */

function calculateOverallProgress() {

    if (!progressData) {

        return 0;

    }

    if (progressData.enrolledCourses.length === 0) {

        return 0;

    }

    let totalPercentage = 0;

    progressData.enrolledCourses.forEach(function (courseId) {

        totalPercentage += calculateCourseProgress(courseId);

    });

    return Math.round(

        totalPercentage /

        progressData.enrolledCourses.length

    );

}

/* ==========================================
        Dashboard Statistics
========================================== */

function loadProgressStatistics() {

    const totalCourses =

        progressData.enrolledCourses.length;

    let completedCourses = 0;

    progressData.enrolledCourses.forEach(function (courseId) {

        if (isCourseCompleted(courseId)) {

            completedCourses++;

        }

    });

    const overallProgress =

        calculateOverallProgress();

    const totalCoursesElement =

        document.getElementById("totalCourses");

    const completedCoursesElement =

        document.getElementById("completedCourses");

    const overallProgressElement =

        document.getElementById("overallProgress");

    if (totalCoursesElement) {

        totalCoursesElement.textContent = totalCourses;

    }

    if (completedCoursesElement) {

        completedCoursesElement.textContent = completedCourses;

    }

    if (overallProgressElement) {

        overallProgressElement.textContent =

            overallProgress + "%";

    }

}

/* ==========================================
        Learning Streak (Basic)
========================================== */

function getLearningStreak() {

    const user = getCurrentUser();

    if (!user) {

        return 0;

    }

    if (!user.learningStreak) {

        user.learningStreak = 0;

    }

    return user.learningStreak;

}

function increaseLearningStreak() {

    const user = getCurrentUser();

    if (!user) {

        return;

    }

    if (!user.learningStreak) {

        user.learningStreak = 0;

    }

    user.learningStreak++;

    updateUser(user);

    setCurrentUser(user);

}

function resetLearningStreak() {

    const user = getCurrentUser();

    if (!user) {

        return;

    }

    user.learningStreak = 0;

    updateUser(user);

    setCurrentUser(user);

}

function displayLearningStreak() {

    const streakElement =

        document.getElementById("learningStreak");

    if (!streakElement) {

        return;

    }

    streakElement.textContent =

        getLearningStreak();

}

/* ==========================================
        Recent Learning Activity
========================================== */

function loadRecentActivity() {

    const activityContainer =

        document.getElementById("recentActivity");

    if (!activityContainer) {

        return;

    }

    activityContainer.innerHTML = "";

    const user = getCurrentUser();

    if (!user) {

        return;

    }

    if (!user.completedLessons ||

        user.completedLessons.length === 0) {

        activityContainer.innerHTML =

            "<p>No recent learning activity.</p>";

        return;

    }

    const recentLessons =

        user.completedLessons.slice(-5).reverse();

    recentLessons.forEach(function (lessonId) {

        const lesson = getLessonById(lessonId);

        if (!lesson) {

            return;

        }

        const item = document.createElement("div");

        item.className = "activity-item";

        item.innerHTML = `

            <p>

                ✅ Completed:

                <strong>${lesson.title}</strong>

            </p>

        `;

        activityContainer.appendChild(item);

    });

}

/* ==========================================
        Certificate Eligibility
========================================== */

function isCertificateEligible(courseId) {

    return calculateCourseProgress(courseId) === 100;

}

function displayCertificateStatus(courseId) {

    const statusElement =

        document.getElementById("certificateStatus");

    if (!statusElement) {

        return;

    }

    if (isCertificateEligible(courseId)) {

        statusElement.textContent =

            "🎉 Certificate Available";

    }

    else {

        statusElement.textContent =

            "Complete the course to unlock your certificate.";

    }

}

/* ==========================================
        Progress Summary
========================================== */

function loadProgressSummary() {

    const summaryElement =

        document.getElementById("progressSummary");

    if (!summaryElement) {

        return;

    }

    summaryElement.innerHTML = "";

    progressData.enrolledCourses.forEach(function (courseId) {

        const course = getCourseById(courseId);

        if (!course) {

            return;

        }

        const percentage =

            calculateCourseProgress(courseId);

        const item = document.createElement("div");

        item.className = "summary-card";

        item.innerHTML = `

            <h4>${course.title}</h4>

            <p>

                Progress:

                ${percentage}%

            </p>

        `;

        summaryElement.appendChild(item);

    });

}

/* ==========================================
        Reset Course Progress
========================================== */

function resetCourseProgress(courseId) {

    const lessons =

        getLessonsByCourseId(courseId);

    progressData.completedLessons =

        progressData.completedLessons.filter(

            function (lessonId) {

                return !lessons.some(

                    lesson => lesson.id === lessonId

                );

            }

        );

    saveProgress();

    updateProgressBar(courseId);

    loadProgressSummary();

}

/* ==========================================
        Continue Learning
========================================== */

function continueLearning(courseId) {

    const lesson =

        resumeLearning(courseId);

    if (!lesson) {

        alert("No lessons available.");

        return;

    }

    setSelectedCourse(courseId);

    setSelectedLesson(lesson.id);

    window.location.href =

        "lesson.html";

}

/* ==========================================
        Initialize Events
========================================== */

function initializeProgressEvents() {

    const continueButton =

        document.getElementById("continueLearningBtn");

    if (continueButton) {

        continueButton.addEventListener(

            "click",

            function () {

                const courseId =

                    parseInt(

                        continueButton.dataset.courseId

                    );

                continueLearning(courseId);

            }

        );

    }

}

/* ==========================================
        Refresh Progress
========================================== */

function refreshProgress() {

    loadProgress();

    loadProgressStatistics();

    loadRecentActivity();

    loadProgressSummary();

    displayLearningStreak();

}

/* ==========================================
        Initialize Progress
========================================== */

function initializeProgress() {

    loadProgress();

    loadProgressStatistics();

    loadRecentActivity();

    loadProgressSummary();

    displayLearningStreak();

    initializeProgressEvents();

}
