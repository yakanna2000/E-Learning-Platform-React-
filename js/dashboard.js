/* ==========================================
        dashboard.js
        Student Dashboard
========================================== */

/* ==========================================
        Dashboard Initialization
========================================== */

document.addEventListener("DOMContentLoaded", initDashboard);

function initDashboard() {

    protectDashboard();

    loadCurrentUser();

    loadStatistics();

    initializeSearch();

    initializeLogout();

    loadNotifications();

}

/* ==========================================
        Protect Dashboard
========================================== */

function protectDashboard() {

    const user = getCurrentUser();

    if (!user) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;

    }

}

/* ==========================================
        Load Current User
========================================== */

function loadCurrentUser() {

    const user = getCurrentUser();

    if (!user) return;

    const studentName =
        document.getElementById("studentName");

    const welcomeUser =
        document.getElementById("welcomeUser");

    if (studentName) {

        studentName.textContent = user.name;

    }

    if (welcomeUser) {

        welcomeUser.textContent = user.name + " 👋";

    }

}

/* ==========================================
        Dashboard Statistics
========================================== */

function loadStatistics() {

    const statCards =
        document.querySelectorAll(".stat-card h2");

    if (statCards.length < 4) return;

    statCards[0].textContent = "5";

    statCards[1].textContent = "2";

    statCards[2].textContent = "10";

    statCards[3].textContent = "85%";

}

/* ==========================================
        Search Courses
========================================== */

function initializeSearch() {

    const searchInput =
        document.querySelector(".search-box input");

    if (!searchInput) return;

    searchInput.addEventListener("keyup", function () {

        const value =
            this.value.toLowerCase();

        const courseCards =
            document.querySelectorAll(".course-card");

        courseCards.forEach(card => {

            const title =
                card.querySelector("h3")
                .textContent
                .toLowerCase();

            if (title.includes(value)) {

                card.style.display = "block";

            }

            else {

                card.style.display = "none";

            }

        });

    });

}

/* ==========================================
        Notifications
========================================== */

function loadNotifications() {

    console.log("Notifications Loaded");

}

/* ==========================================
        Logout
========================================== */

function initializeLogout() {

    const logoutLink = document.querySelector(

        '.sidebar a[href="login.html"]'

    );

    if (!logoutLink) return;

    logoutLink.addEventListener("click", function (event) {

        event.preventDefault();

        if (confirm("Are you sure you want to logout?")) {

            logout();

            window.location.href = "login.html";

        }

    });

}

/* ==========================================
        Refresh Dashboard
========================================== */

function refreshDashboard() {

    loadCurrentUser();

    loadStatistics();

}

/* ==========================================
        Show Success Message
========================================== */

function showMessage(message) {

    alert(message);

}