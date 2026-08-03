/* ==========================================
        feedback.js
========================================== */

let feedbackList = [];

let currentCourse = null;

/* ==========================================
        Initialize Feedback Page
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeFeedbackPage

);

function initializeFeedbackPage() {

    protectDashboard();

    loadCurrentUser();

    loadFeedback();

    initializeFeedbackEvents();

}

/* ==========================================
        Load Feedback
========================================== */

function loadFeedback() {

    feedbackList = getFeedback();

    displayFeedback();

}

/* ==========================================
        Display Feedback
========================================== */

function displayFeedback() {

    const container =

        document.getElementById("feedbackContainer");

    if (!container) {

        return;

    }

    container.innerHTML = "";

    feedbackList.forEach(function (feedback) {

        container.appendChild(

            createFeedbackCard(feedback)

        );

    });

}

/* ==========================================
        Feedback Card
========================================== */

function createFeedbackCard(feedback) {

    const card = document.createElement("div");

    card.className = "feedback-card";

    card.innerHTML = `

        <h3>${feedback.courseName}</h3>

        <p>

            <strong>Rating :</strong>

            ${feedback.rating}/5

        </p>

        <p>

            ${feedback.comment}

        </p>

        <p>

            <small>

                ${feedback.userName}

            </small>

        </p>

    `;

    return card;

}

/* ==========================================
        Add Feedback
========================================== */

function addFeedback() {

    const user = getCurrentUser();

    if (!user) {

        alert("Please login first.");

        return;

    }

    const course =

        document.getElementById("feedbackCourse");

    const rating =

        document.getElementById("feedbackRating");

    const comment =

        document.getElementById("feedbackComment");

    if (

        !course ||

        !rating ||

        !comment

    ) {

        return;

    }

    if (comment.value.trim() === "") {

        alert("Please enter feedback.");

        return;

    }

    const feedback = {

        id: generateFeedbackId(),

        userId: user.id,

        userName: user.name,

        courseId: parseInt(course.value),

        courseName:

            course.options[course.selectedIndex].text,

        rating: parseInt(rating.value),

        comment: comment.value.trim(),

        date: new Date().toLocaleDateString()

    };

    feedbackList.push(feedback);

    saveFeedback(feedbackList);

    displayFeedback();

    clearFeedbackForm();

    alert("Feedback submitted successfully.");

}

/* ==========================================
        Clear Form
========================================== */

function clearFeedbackForm() {

    document.getElementById(

        "feedbackComment"

    ).value = "";

    document.getElementById(

        "feedbackRating"

    ).value = "5";

}

/* ==========================================
        Edit Feedback
========================================== */

function editFeedback(id) {

    const feedback = feedbackList.find(

        item => item.id === id

    );

    if (!feedback) {

        return;

    }

    document.getElementById("feedbackCourse").value =

        feedback.courseId;

    document.getElementById("feedbackRating").value =

        feedback.rating;

    document.getElementById("feedbackComment").value =

        feedback.comment;

    document.getElementById("submitFeedbackBtn").textContent =

        "Update Feedback";

    document.getElementById("submitFeedbackBtn").onclick =

        function () {

            updateFeedbackDetails(id);

        };

}

/* ==========================================
        Update Feedback
========================================== */

function updateFeedbackDetails(id) {

    const feedback = feedbackList.find(

        item => item.id === id

    );

    if (!feedback) {

        return;

    }

    const course = document.getElementById("feedbackCourse");

    const rating = document.getElementById("feedbackRating");

    const comment = document.getElementById("feedbackComment");

    feedback.courseId = parseInt(course.value);

    feedback.courseName =

        course.options[course.selectedIndex].text;

    feedback.rating = parseInt(rating.value);

    feedback.comment = comment.value.trim();

    feedback.date = new Date().toLocaleDateString();

    saveFeedback(feedbackList);

    displayFeedback();

    clearFeedbackForm();

    const button =

        document.getElementById("submitFeedbackBtn");

    button.textContent = "Submit Feedback";

    button.onclick = addFeedback;

    alert("Feedback updated successfully.");

}

/* ==========================================
        Delete Feedback
========================================== */

function removeFeedback(id) {

    if (!confirm("Delete this feedback?")) {

        return;

    }

    feedbackList = feedbackList.filter(

        item => item.id !== id

    );

    saveFeedback(feedbackList);

    displayFeedback();

    alert("Feedback deleted successfully.");

}

/* ==========================================
        Search Feedback
========================================== */

function searchFeedback(keyword) {

    keyword = keyword.toLowerCase();

    const filtered = feedbackList.filter(

        item =>

            item.courseName

                .toLowerCase()

                .includes(keyword) ||

            item.comment

                .toLowerCase()

                .includes(keyword)

    );

    displayFilteredFeedback(filtered);

}

/* ==========================================
        Filter Feedback By Course
========================================== */

function filterFeedback(courseId) {

    if (courseId === "All") {

        displayFeedback();

        return;

    }

    const filtered = feedbackList.filter(

        item =>

            item.courseId === parseInt(courseId)

    );

    displayFilteredFeedback(filtered);

}

/* ==========================================
        Display Filtered Feedback
========================================== */

function displayFilteredFeedback(list) {

    const container =

        document.getElementById("feedbackContainer");

    if (!container) {

        return;

    }

    container.innerHTML = "";

    if (list.length === 0) {

        container.innerHTML =

            "<h3>No Feedback Found</h3>";

        return;

    }

    list.forEach(function (feedback) {

        container.appendChild(

            createFeedbackCard(feedback)

        );

    });

}

/* ==========================================
        Average Rating
========================================== */

function calculateAverageRating(courseId) {

    const courseFeedback = feedbackList.filter(

        item => item.courseId === courseId

    );

    if (courseFeedback.length === 0) {

        return 0;

    }

    let total = 0;

    courseFeedback.forEach(function (item) {

        total += item.rating;

    });

    return (

        total / courseFeedback.length

    ).toFixed(1);

}

/* ==========================================
        Display Star Rating
========================================== */

function getStarRating(rating) {

    let stars = "";

    for (let i = 1; i <= 5; i++) {

        if (i <= rating) {

            stars += "★";

        }

        else {

            stars += "☆";

        }

    }

    return stars;

}

/* ==========================================
        Initialize Search
========================================== */

function initializeFeedbackSearch() {

    const search =

        document.getElementById("feedbackSearch");

    if (!search) {

        return;

    }

    search.addEventListener(

        "keyup",

        function () {

            searchFeedback(

                this.value

            );

        }

    );

}

/* ==========================================
        Initialize Filter
========================================== */

function initializeFeedbackFilter() {

    const filter =

        document.getElementById("feedbackFilter");

    if (!filter) {

        return;

    }

    filter.addEventListener(

        "change",

        function () {

            filterFeedback(

                this.value

            );

        }

    );

}

/* ==========================================
        Feedback Statistics
========================================== */

function loadFeedbackStatistics() {

    const totalFeedbackElement =
        document.getElementById("totalFeedback");

    const averageRatingElement =
        document.getElementById("averageRating");

    if (!totalFeedbackElement || !averageRatingElement) {

        return;

    }

    totalFeedbackElement.textContent = feedbackList.length;

    if (feedbackList.length === 0) {

        averageRatingElement.textContent = "0";

        return;

    }

    let total = 0;

    feedbackList.forEach(function (feedback) {

        total += feedback.rating;

    });

    averageRatingElement.textContent =

        (total / feedbackList.length).toFixed(1);

}

/* ==========================================
        Recent Feedback
========================================== */

function loadRecentFeedback() {

    const container =

        document.getElementById("recentFeedback");

    if (!container) {

        return;

    }

    container.innerHTML = "";

    const recent = feedbackList

        .slice(-5)

        .reverse();

    recent.forEach(function (feedback) {

        const card = document.createElement("div");

        card.className = "recent-feedback-card";

        card.innerHTML = `

            <h4>${feedback.courseName}</h4>

            <p>${getStarRating(feedback.rating)}</p>

            <p>${feedback.comment}</p>

            <small>

                ${feedback.userName}

            </small>

        `;

        container.appendChild(card);

    });

}

/* ==========================================
        Top Rated Courses
========================================== */

function loadTopRatedCourses() {

    const container =

        document.getElementById("topRatedCourses");

    if (!container) {

        return;

    }

    container.innerHTML = "";

    const courses = getCourses();

    courses.forEach(function (course) {

        const rating =

            calculateAverageRating(course.id);

        const item = document.createElement("div");

        item.className = "top-course-card";

        item.innerHTML = `

            <h4>${course.title}</h4>

            <p>

                ${getStarRating(

                    Math.round(rating)

                )}

            </p>

            <p>

                ${rating}/5

            </p>

        `;

        container.appendChild(item);

    });

}

/* ==========================================
        Rating Distribution
========================================== */

function loadRatingDistribution() {

    const counts = [0, 0, 0, 0, 0];

    feedbackList.forEach(function (feedback) {

        counts[feedback.rating - 1]++;

    });

    for (let i = 1; i <= 5; i++) {

        const element =

            document.getElementById(

                "rating" + i

            );

        if (element) {

            element.textContent =

                counts[i - 1];

        }

    }

}

/* ==========================================
        Refresh Feedback
========================================== */

function refreshFeedback() {

    loadFeedback();

    loadFeedbackStatistics();

    loadRecentFeedback();

    loadTopRatedCourses();

    loadRatingDistribution();

}

/* ==========================================
        Initialize Events
========================================== */

function initializeFeedbackEvents() {

    initializeFeedbackSearch();

    initializeFeedbackFilter();

}

/* ==========================================
        Initialize Feedback Page
========================================== */

function initializeFeedbackPage() {

    protectDashboard();

    loadCurrentUser();

    loadFeedback();

    loadFeedbackStatistics();

    loadRecentFeedback();

    loadTopRatedCourses();

    loadRatingDistribution();

    initializeFeedbackEvents();

}
