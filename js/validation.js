/* ==========================================
   validation.js
   Input Validation Functions
========================================== */

/* ---------- Name Validation ---------- */
function validateName(name) {

    name = name.trim();

    if (name === "") {
        return {
            valid: false,
            message: "Name is required."
        };
    }

    if (name.length < 3) {
        return {
            valid: false,
            message: "Name must contain at least 3 characters."
        };
    }

    const namePattern = /^[A-Za-z ]+$/;

    if (!namePattern.test(name)) {
        return {
            valid: false,
            message: "Name should contain only letters and spaces."
        };
    }

    return {
        valid: true,
        message: ""
    };
}

/* ---------- Email Validation ---------- */
function validateEmail(email) {

    email = email.trim();

    if (email === "") {
        return {
            valid: false,
            message: "Email is required."
        };
    }

    const emailPattern =
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailPattern.test(email)) {
        return {
            valid: false,
            message: "Invalid email address."
        };
    }

    return {
        valid: true,
        message: ""
    };
}

/* ---------- Mobile Validation ---------- */
function validateMobile(mobile) {

    mobile = mobile.trim();

    if (mobile === "") {
        return {
            valid: false,
            message: "Mobile number is required."
        };
    }

    const mobilePattern = /^[6-9]\d{9}$/;

    if (!mobilePattern.test(mobile)) {
        return {
            valid: false,
            message: "Enter a valid 10-digit mobile number."
        };
    }

    return {
        valid: true,
        message: ""
    };
}

/* ---------- Password Validation ---------- */
function validatePassword(password) {

    if (password === "") {
        return {
            valid: false,
            message: "Password is required."
        };
    }

    if (password.length < 6) {
        return {
            valid: false,
            message: "Password must be at least 6 characters."
        };
    }

    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!passwordPattern.test(password)) {
        return {
            valid: false,
            message:
                "Password must contain uppercase, lowercase and one number."
        };
    }

    return {
        valid: true,
        message: ""
    };
}

/* ---------- Confirm Password ---------- */
function validateConfirmPassword(password, confirmPassword) {

    if (confirmPassword === "") {
        return {
            valid: false,
            message: "Confirm Password is required."
        };
    }

    if (password !== confirmPassword) {
        return {
            valid: false,
            message: "Passwords do not match."
        };
    }

    return {
        valid: true,
        message: ""
    };
}

/* ---------- Role Validation ---------- */
function validateRole(role) {

    role = role.trim();

    if (role === "") {
        return {
            valid: false,
            message: "Please select a role."
        };
    }

    if (role !== "student" && role !== "instructor") {
        return {
            valid: false,
            message: "Invalid role selected."
        };
    }

    return {
        valid: true,
        message: ""
    };
}

/* ---------- Terms Validation ---------- */
function validateTerms(isChecked) {

    if (!isChecked) {
        return {
            valid: false,
            message: "Please accept Terms & Conditions."
        };
    }

    return {
        valid: true,
        message: ""
    };
}

/* ---------- Login Validation ---------- */
function validateLogin(email, password) {

    const emailResult = validateEmail(email);

    if (!emailResult.valid) {
        return emailResult;
    }

    if (password.trim() === "") {
        return {
            valid: false,
            message: "Password is required."
        };
    }

    return {
        valid: true,
        message: ""
    };
}

/* ---------- Register Form Validation ---------- */
function validateRegister(user) {

    let result;

    result = validateName(user.name);
    if (!result.valid) return result;

    result = validateEmail(user.email);
    if (!result.valid) return result;

    result = validateMobile(user.mobile);
    if (!result.valid) return result;

    result = validateRole(user.role);
    if (!result.valid) return result;

    result = validatePassword(user.password);
    if (!result.valid) return result;

    result = validateConfirmPassword(
        user.password,
        user.confirmPassword
    );
    if (!result.valid) return result;

    result = validateTerms(user.terms);
    if (!result.valid) return result;

    return {
        valid: true,
        message: "Validation Successful"
    };
}