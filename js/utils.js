/* ==========================================
        utils.js
========================================== */

/* ==========================================
        Date Utilities
========================================== */

function getCurrentDate() {

    return new Date().toLocaleDateString();

}

function getCurrentTime() {

    return new Date().toLocaleTimeString();

}

function getCurrentDateTime() {

    return new Date().toLocaleString();

}

function formatDate(date) {

    return new Date(date).toLocaleDateString();

}

function formatTime(date) {

    return new Date(date).toLocaleTimeString();

}

/* ==========================================
        Greeting
========================================== */

function getGreeting() {

    const hour = new Date().getHours();

    if (hour < 12) {

        return "Good Morning";

    }

    if (hour < 17) {

        return "Good Afternoon";

    }

    return "Good Evening";

}

/* ==========================================
        String Utilities
========================================== */

function capitalize(text) {

    if (!text) {

        return "";

    }

    return text.charAt(0).toUpperCase() +

        text.slice(1);

}

function capitalizeWords(text) {

    return text.replace(

        /\b\w/g,

        function (letter) {

            return letter.toUpperCase();

        }

    );

}

function truncateText(text, length) {

    if (text.length <= length) {

        return text;

    }

    return text.substring(0, length) + "...";

}

function removeExtraSpaces(text) {

    return text.trim().replace(/\s+/g, " ");

}

/* ==========================================
        Number Utilities
========================================== */

function formatPercentage(value) {

    return value + "%";

}

function roundNumber(value) {

    return Math.round(value);

}

function randomNumber(min, max) {

    return Math.floor(

        Math.random() *

        (max - min + 1)

    ) + min;

}

/* ==========================================
        Random ID
========================================== */

function generateRandomId(prefix = "") {

    return prefix +

        Date.now() +

        randomNumber(100, 999);

}

/* ==========================================
        UUID
========================================== */

function generateUUID() {

    return crypto.randomUUID();

}

/* ==========================================
        Delay
========================================== */

function delay(milliseconds) {

    return new Promise(

        resolve =>

            setTimeout(

                resolve,

                milliseconds

            )

    );

}

/* ==========================================
        Notification Utilities
========================================== */

function showAlert(message) {

    alert(message);

}

function showSuccess(message) {

    alert("✅ " + message);

}

function showError(message) {

    alert("❌ " + message);

}

function showWarning(message) {

    alert("⚠️ " + message);

}

/* ==========================================
        Confirm Dialog
========================================== */

function showConfirm(message) {

    return confirm(message);

}

/* ==========================================
        Toast Notification
========================================== */

function showToast(message, duration = 3000) {

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(function () {

        toast.classList.add("show");

    }, 100);

    setTimeout(function () {

        toast.classList.remove("show");

        setTimeout(function () {

            toast.remove();

        }, 300);

    }, duration);

}

/* ==========================================
        Loader Utilities
========================================== */

function showLoader() {

    const loader = document.getElementById("loader");

    if (loader) {

        loader.style.display = "flex";

    }

}

function hideLoader() {

    const loader = document.getElementById("loader");

    if (loader) {

        loader.style.display = "none";

    }

}

/* ==========================================
        Modal Utilities
========================================== */

function openModal(modalId) {

    const modal = document.getElementById(modalId);

    if (modal) {

        modal.style.display = "block";

    }

}

function closeModal(modalId) {

    const modal = document.getElementById(modalId);

    if (modal) {

        modal.style.display = "none";

    }

}

function toggleModal(modalId) {

    const modal = document.getElementById(modalId);

    if (!modal) {

        return;

    }

    if (modal.style.display === "block") {

        modal.style.display = "none";

    }

    else {

        modal.style.display = "block";

    }

}

/* ==========================================
        DOM Utilities
========================================== */

function getElement(id) {

    return document.getElementById(id);

}

function showElement(id) {

    const element = getElement(id);

    if (element) {

        element.style.display = "block";

    }

}

function hideElement(id) {

    const element = getElement(id);

    if (element) {

        element.style.display = "none";

    }

}

function clearElement(id) {

    const element = getElement(id);

    if (element) {

        element.innerHTML = "";

    }

}

function setText(id, text) {

    const element = getElement(id);

    if (element) {

        element.textContent = text;

    }

}

function setHTML(id, html) {

    const element = getElement(id);

    if (element) {

        element.innerHTML = html;

    }

}

/* ==========================================
        Clipboard Utilities
========================================== */

function copyToClipboard(text) {

    navigator.clipboard.writeText(text)

        .then(function () {

            showToast("Copied to Clipboard");

        })

        .catch(function () {

            showError("Unable to copy");

        });

}

/* ==========================================
        Download Text File
========================================== */

function downloadTextFile(filename, content) {

    const blob = new Blob(

        [content],

        {

            type: "text/plain"

        }

    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}

/* ==========================================
        Scroll Utilities
========================================== */

function scrollToTop() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

function scrollToBottom() {

    window.scrollTo({

        top: document.body.scrollHeight,

        behavior: "smooth"

    });

}

/* ==========================================
        LocalStorage Utilities
========================================== */

function saveToLocalStorage(key, value) {

    localStorage.setItem(

        key,

        JSON.stringify(value)

    );

}

function getFromLocalStorage(key) {

    const data = localStorage.getItem(key);

    return data ? JSON.parse(data) : null;

}

function removeFromLocalStorage(key) {

    localStorage.removeItem(key);

}

function clearLocalStorage() {

    localStorage.clear();

}

/* ==========================================
        URL Utilities
========================================== */

function getQueryParameter(name) {

    const params = new URLSearchParams(

        window.location.search

    );

    return params.get(name);

}

function redirect(url) {

    window.location.href = url;

}

function reloadPage() {

    window.location.reload();

}

/* ==========================================
        Theme Utilities
========================================== */

function enableDarkMode() {

    document.body.classList.add("dark-mode");

    localStorage.setItem("theme", "dark");

}

function enableLightMode() {

    document.body.classList.remove("dark-mode");

    localStorage.setItem("theme", "light");

}

function toggleTheme() {

    if (

        document.body.classList.contains(

            "dark-mode"

        )

    ) {

        enableLightMode();

    }

    else {

        enableDarkMode();

    }

}

function loadTheme() {

    const theme =

        localStorage.getItem("theme");

    if (theme === "dark") {

        enableDarkMode();

    }

}

/* ==========================================
        Validation Helpers
========================================== */

function isEmpty(value) {

    return value.trim() === "";

}

function isEmail(email) {

    const pattern =

        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(email);

}

function isPhone(phone) {

    return /^[6-9]\d{9}$/.test(phone);

}

/* ==========================================
        Search Utilities
========================================== */

function searchByProperty(

    array,

    property,

    keyword

) {

    keyword = keyword.toLowerCase();

    return array.filter(function (item) {

        return String(

            item[property]

        )

            .toLowerCase()

            .includes(keyword);

    });

}

/* ==========================================
        Sort Utilities
========================================== */

function sortAscending(array, property) {

    return array.sort(function (a, b) {

        if (a[property] > b[property]) {

            return 1;

        }

        if (a[property] < b[property]) {

            return -1;

        }

        return 0;

    });

}

function sortDescending(array, property) {

    return array.sort(function (a, b) {

        if (a[property] < b[property]) {

            return 1;

        }

        if (a[property] > b[property]) {

            return -1;

        }

        return 0;

    });

}

/* ==========================================
        File Utilities
========================================== */

function formatFileSize(bytes) {

    if (bytes < 1024) {

        return bytes + " Bytes";

    }

    if (bytes < 1024 * 1024) {

        return (

            (bytes / 1024).toFixed(2)

        ) + " KB";

    }

    if (bytes < 1024 * 1024 * 1024) {

        return (

            (bytes / (1024 * 1024))

            .toFixed(2)

        ) + " MB";

    }

    return (

        (bytes / (1024 * 1024 * 1024))

        .toFixed(2)

    ) + " GB";

}

/* ==========================================
        Debounce
========================================== */

function debounce(callback, delay) {

    let timer;

    return function () {

        clearTimeout(timer);

        const args = arguments;

        timer = setTimeout(function () {

            callback.apply(null, args);

        }, delay);

    };

}

/* ==========================================
        Throttle
========================================== */

function throttle(callback, delay) {

    let waiting = false;

    return function () {

        if (waiting) {

            return;

        }

        callback.apply(null, arguments);

        waiting = true;

        setTimeout(function () {

            waiting = false;

        }, delay);

    };

}

/* ==========================================
        Array Utilities
========================================== */

function uniqueArray(array) {

    return [...new Set(array)];

}

function shuffleArray(array) {

    return array.sort(function () {

        return Math.random() - 0.5;

    });

}

/* ==========================================
        Object Utilities
========================================== */

function deepCopy(object) {

    return JSON.parse(

        JSON.stringify(object)

    );

}

/* ==========================================
        Common Helpers
========================================== */

function sleep(milliseconds) {

    return new Promise(function (resolve) {

        setTimeout(resolve, milliseconds);

    });

}

function isOnline() {

    return navigator.onLine;

}

function getCurrentYear() {

    return new Date().getFullYear();

}

function printPage() {

    window.print();

}

function goBack() {

    history.back();

}

function goForward() {

    history.forward();

}
