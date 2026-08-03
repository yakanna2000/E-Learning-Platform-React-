/* ==========================================
        auth.js
        Authentication Module
========================================== */

/* ==========================================
        Register User
========================================== */

function registerUser(event) {

    event.preventDefault();

    const user = {

        id: generateUserId(),

        name: document.getElementById("name").value.trim(),

        email: document.getElementById("email").value.trim(),

        mobile: document.getElementById("mobile").value.trim(),

        role: document.getElementById("role").value,

        password: document.getElementById("password").value,

        confirmPassword: document.getElementById("confirmPassword").value,

        terms: document.getElementById("terms").checked

    };

    const result = validateRegister(user);

    if (!result.valid) {

        alert(result.message);

        return;

    }

    if (findUserByEmail(user.email)) {

        alert("Email already registered");

        return;

    }

    delete user.confirmPassword;
    delete user.terms;

    addUser(user);

    alert("Registration Successful");

    window.location.href = "login.html";

}

/* ==========================================
        Login User
========================================== */

function loginUser(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    const result = validateLogin(email, password);

    if (!result.valid) {

        alert(result.message);

        return;

    }

    const user = findUserByEmail(email);

    if (user == null) {

        alert("User not found");

        return;

    }

    if (user.password !== password) {

        alert("Incorrect Password");

        return;

    }

    setCurrentUser(user);

    if (user.role === "student") {

        window.location.href = "student_dashboard.html";

    }

    else {

        window.location.href = "instructor_dashboard.html";

    }

}

/* ==========================================
        Role Based Redirection
========================================== */

function redirectDashboard(role) {

    if (role === "student") {

        window.location.href = "student_dashboard.html";

    }

    else if (role === "instructor") {

        window.location.href = "instructor_dashboard.html";

    }

    else {

        alert("Invalid User Role");

    }

}

/* ==========================================
        Logout User
========================================== */

function logoutUser() {

    logout();

    window.location.href = "login.html";

}
/* ==========================================
        Protect Dashboard
========================================== */



function protectPage() {

    if (!isLoggedIn()) {

        window.location.href = "login.html";

    }

}

/* ==========================================
        Show Logged-in User
========================================== */
function displayCurrentUser() {

    const user = getCurrentUser();

    if (user == null) return;

    const userName = document.getElementById("userName");

    const userEmail = document.getElementById("userEmail");

    const userRole = document.getElementById("userRole");

    if (userName) {

        userName.innerHTML = user.name;

    }

    if (userEmail) {

        userEmail.innerHTML = user.email;

    }

    if (userRole) {

        userRole.innerHTML = user.role;

    }

}

/* ==========================================
        Auto Bind Forms
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {

        registerForm.addEventListener("submit", registerUser);

    }

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", loginUser);

    }

});
