/* ==========================================
        assignment.js
        Assignment Operations
========================================== */

let assignments = [];

let currentAssignment = null;

/* ==========================================
        Initialize Page
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeAssignmentPage

);

function initializeAssignmentPage() {

    protectDashboard();

    loadCurrentUser();

    loadAssignments();

}

/* ==========================================
        Load Assignments
========================================== */

function loadAssignments() {

    assignments = getAssignments();

    displayAssignments();

}

/* ==========================================
        Display Assignments
========================================== */

function displayAssignments() {

    const container =

        document.getElementById("assignmentContainer");

    if (!container) {

        return;

    }

    container.innerHTML = "";

    assignments.forEach(function (assignment) {

        container.appendChild(

            createAssignmentCard(assignment)

        );

    });

}

/* ==========================================
        Assignment Card
========================================== */

function createAssignmentCard(assignment) {

    const div = document.createElement("div");

    div.className = "assignment-card";

    div.innerHTML = `

        <h3>

            ${assignment.title}

        </h3>

        <p>

            ${assignment.description}

        </p>

        <p>

            <strong>Course :</strong>

            ${assignment.course}

        </p>

        <p>

            <strong>Due Date :</strong>

            ${assignment.dueDate}

        </p>

        <p>

            <strong>Marks :</strong>

            ${assignment.totalMarks}

        </p>

        <button
            class="btn btn-primary"
            onclick="viewAssignment(${assignment.id})">

            View Assignment

        </button>

    `;

    return div;

}

/* ==========================================
        View Assignment
========================================== */

function viewAssignment(id) {

    currentAssignment =

        assignments.find(

            assignment => assignment.id === id

        );

    if (!currentAssignment) {

        return;

    }

    loadAssignmentDetails();

}

/* ==========================================
        Assignment Details
========================================== */

function loadAssignmentDetails() {

    const title =

        document.getElementById("assignmentTitle");

    const description =

        document.getElementById("assignmentDescription");

    const dueDate =

        document.getElementById("assignmentDueDate");

    const marks =

        document.getElementById("assignmentMarks");

    if (title) {

        title.textContent =

            currentAssignment.title;

    }

    if (description) {

        description.textContent =

            currentAssignment.description;

    }

    if (dueDate) {

        dueDate.textContent =

            currentAssignment.dueDate;

    }

    if (marks) {

        marks.textContent =

            currentAssignment.totalMarks;

    }

}

/* ==========================================
        Submit Assignment
========================================== */

function submitAssignment() {

    if (!currentAssignment) {

        alert("Please select an assignment.");

        return;

    }

    const submission = document.getElementById("submissionText");

    if (!submission) {

        return;

    }

    const answer = submission.value.trim();

    if (answer === "") {

        alert("Please enter your submission.");

        return;

    }

    const user = getCurrentUser();

    if (!user) {

        alert("Please login first.");

        return;

    }

    if (!currentAssignment.submissions) {

        currentAssignment.submissions = [];

    }

    const existingSubmission = currentAssignment.submissions.find(

        item => item.userId === user.id

    );

    if (existingSubmission) {

        existingSubmission.answer = answer;

        existingSubmission.status = "Submitted";

        existingSubmission.submittedOn = new Date().toLocaleString();

    }

    else {

        currentAssignment.submissions.push({

            userId: user.id,

            answer: answer,

            status: "Submitted",

            submittedOn: new Date().toLocaleString(),

            marks: null

        });

    }

    updateAssignment(currentAssignment);

    alert("Assignment submitted successfully.");

    loadAssignmentDetails();

}

/* ==========================================
        Assignment Status
========================================== */

function getAssignmentStatus(assignmentId) {

    const assignment = getAssignmentById(assignmentId);

    if (!assignment) {

        return "Pending";

    }

    const user = getCurrentUser();

    if (!user) {

        return "Pending";

    }

    if (!assignment.submissions) {

        return "Pending";

    }

    const submission = assignment.submissions.find(

        item => item.userId === user.id

    );

    if (!submission) {

        return "Pending";

    }

    return submission.status;

}

/* ==========================================
        Search Assignments
========================================== */

function searchAssignments(keyword) {

    keyword = keyword.toLowerCase();

    const filteredAssignments = assignments.filter(

        assignment =>

            assignment.title.toLowerCase().includes(keyword) ||

            assignment.course.toLowerCase().includes(keyword)

    );

    displayFilteredAssignments(filteredAssignments);

}

/* ==========================================
        Filter Assignments
========================================== */

function filterAssignments(status) {

    if (status === "All") {

        displayAssignments();

        return;

    }

    const filteredAssignments = assignments.filter(

        assignment =>

            getAssignmentStatus(assignment.id) === status

    );

    displayFilteredAssignments(filteredAssignments);

}

/* ==========================================
        Display Filtered Assignments
========================================== */

function displayFilteredAssignments(filteredAssignments) {

    const container =

        document.getElementById("assignmentContainer");

    if (!container) {

        return;

    }

    container.innerHTML = "";

    if (filteredAssignments.length === 0) {

        container.innerHTML =

            "<h3>No Assignments Found</h3>";

        return;

    }

    filteredAssignments.forEach(function (assignment) {

        container.appendChild(

            createAssignmentCard(assignment)

        );

    });

}

/* ==========================================
        Save Submission
========================================== */

function saveSubmission() {

    updateAssignment(currentAssignment);

}

/* ==========================================
        Initialize Search
========================================== */

function initializeAssignmentSearch() {

    const search =

        document.getElementById("assignmentSearch");

    if (!search) {

        return;

    }

    search.addEventListener(

        "keyup",

        function () {

            searchAssignments(

                this.value

            );

        }

    );

}

/* ==========================================
        Initialize Filter
========================================== */

function initializeAssignmentFilter() {

    const filter =

        document.getElementById("assignmentFilter");

    if (!filter) {

        return;

    }

    filter.addEventListener(

        "change",

        function () {

            filterAssignments(

                this.value

            );

        }

    );

}

/* ==========================================
        View Submitted Assignment
========================================== */

function viewSubmission() {

    if (!currentAssignment) {

        alert("Please select an assignment.");

        return;

    }

    const user = getCurrentUser();

    if (!user) {

        return;

    }

    if (!currentAssignment.submissions) {

        alert("No submission found.");

        return;

    }

    const submission = currentAssignment.submissions.find(

        item => item.userId === user.id

    );

    if (!submission) {

        alert("You have not submitted this assignment.");

        return;

    }

    alert(

        "Your Submission\n\n" +

        submission.answer +

        "\n\nStatus : " +

        submission.status

    );

}

/* ==========================================
        Download Assignment
========================================== */

function downloadAssignment() {

    if (!currentAssignment) {

        return;

    }

    alert(

        "Downloading : " +

        currentAssignment.title

    );

}

/* ==========================================
        Display Marks
========================================== */

function displayMarks() {

    if (!currentAssignment) {

        return;

    }

    const user = getCurrentUser();

    if (!user) {

        return;

    }

    if (!currentAssignment.submissions) {

        return;

    }

    const submission = currentAssignment.submissions.find(

        item => item.userId === user.id

    );

    const marks = document.getElementById("obtainedMarks");

    if (!marks) {

        return;

    }

    if (!submission) {

        marks.textContent = "Not Evaluated";

        return;

    }

    if (submission.marks === null) {

        marks.textContent = "Pending";

    }

    else {

        marks.textContent =

            submission.marks +

            " / " +

            currentAssignment.totalMarks;

    }

}

/* ==========================================
        Assignment Statistics
========================================== */

function loadAssignmentStatistics() {

    const user = getCurrentUser();

    if (!user) {

        return;

    }

    let pending = 0;

    let submitted = 0;

    assignments.forEach(function (assignment) {

        const status = getAssignmentStatus(

            assignment.id

        );

        if (status === "Submitted") {

            submitted++;

        }

        else {

            pending++;

        }

    });

    const pendingCount =

        document.getElementById("pendingAssignments");

    const submittedCount =

        document.getElementById("submittedAssignments");

    const totalCount =

        document.getElementById("totalAssignments");

    if (pendingCount) {

        pendingCount.textContent = pending;

    }

    if (submittedCount) {

        submittedCount.textContent = submitted;

    }

    if (totalCount) {

        totalCount.textContent = assignments.length;

    }

}

/* ==========================================
        Refresh Assignment
========================================== */

function refreshAssignments() {

    loadAssignments();

    loadAssignmentStatistics();

}

/* ==========================================
        Initialize Buttons
========================================== */

function initializeAssignmentButtons() {

    const viewButton =

        document.getElementById("viewSubmissionBtn");

    const downloadButton =

        document.getElementById("downloadAssignmentBtn");

    if (viewButton) {

        viewButton.addEventListener(

            "click",

            viewSubmission

        );

    }

    if (downloadButton) {

        downloadButton.addEventListener(

            "click",

            downloadAssignment

        );

    }

}

/* ==========================================
        Initialize Events
========================================== */

function initializeAssignmentEvents() {

    initializeAssignmentSearch();

    initializeAssignmentFilter();

    initializeAssignmentButtons();

}

/* ==========================================
        Initialize Assignment Page
========================================== */

function initializeAssignmentPage() {

    protectDashboard();

    loadCurrentUser();

    loadAssignments();

    loadAssignmentStatistics();

    initializeAssignmentEvents();

}
