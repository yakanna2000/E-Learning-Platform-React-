import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { CourseCard } from "../components/CourseCard";
import { useApp } from "../context/AppContext";
import {
  getStudentAssignments,
  getMySubmissions,
  saveSubmission,
  getInstructorFeedback
} from "../lib/learningService";
import { supabase } from "../lib/supabase";

export function DashboardPage() {
  const { session, profile, flash } = useApp();

  /*
   * Decide which dashboard to display
   */

  if (profile?.role === "instructor") {
    return <InstructorDashboard />;
  }

  return <StudentDashboard session={session} profile={profile} flash={flash} />;
}


/* =====================================================
   STUDENT DASHBOARD
===================================================== */

function StudentDashboard({ session, profile, flash }) {
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [courseProgress, setCourseProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    loadStudentData();
  }, [session]);

  const loadStudentData = async () => {
    setLoading(true);

    try {
      /*
       * ==========================================
       * GET STUDENT ENROLLMENTS
       * ==========================================
       */

      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from("enrollments")
        .select("*, courses(*)")
        .eq("student_id", session.user.id)
        .order("enrolled_at", {
          ascending: false,
        });

      if (enrollmentError) {
        console.error("Enrollment loading error:", enrollmentError);

        flash(enrollmentError.message);

        setLoading(false);
        return;
      }

      /*
       * ==========================================
       * GET ASSIGNMENTS
       * ==========================================
       */

      const enrolledCourseIds = (enrollmentData || []).map(
        (enrollment) => enrollment.course_id,
      );

      const { data: assignmentData, error: assignmentError } =
        await getStudentAssignments(enrolledCourseIds);

      if (assignmentError) {
        console.error("Assignment loading error:", assignmentError);
      }

      /*
       * ==========================================
       * GET STUDENT SUBMISSIONS
       * ==========================================
       */

      const { data: submissionData, error: submissionError } =
        await getMySubmissions(session.user.id);

      if (submissionError) {
        console.error("Submission loading error:", submissionError);
      }

      setEnrollments(enrollmentData || []);

      setAssignments(assignmentData || []);

      setSubmissions(submissionData || []);

      /*
       * ==========================================
       * GET LESSON PROGRESS
       * ==========================================
       */

      const progressMap = {};

      for (const enrollment of enrollmentData || []) {
        const course = enrollment.courses;

        if (!course) continue;

        const { data: lessons, error: lessonError } = await supabase
          .from("lessons")
          .select("id")
          .eq("course_id", course.id);

        if (lessonError) {
          console.error("Lesson loading error:", lessonError);

          continue;
        }

        const lessonIds = lessons?.map((lesson) => lesson.id) || [];

        if (lessonIds.length === 0) {
          progressMap[course.id] = {
            completed: 0,
            total: 0,
            percentage: 0,
          };

          continue;
        }

        const { data: progress, error: progressError } = await supabase
          .from("lesson_progress")
          .select("lesson_id")
          .eq("student_id", session.user.id)
          .in("lesson_id", lessonIds);

        if (progressError) {
          console.error("Progress loading error:", progressError);

          continue;
        }

        const completed = progress?.length || 0;

        const total = lessonIds.length;

        const percentage = Math.round((completed / total) * 100);

        progressMap[course.id] = {
          completed,
          total,
          percentage,
        };
      }

      setCourseProgress(progressMap);
    } catch (error) {
      console.error("Student dashboard error:", error);

      flash(error.message || "Unable to load dashboard.");
    }

    setLoading(false);
  };

  /*
   * ==========================================
   * SUBMIT ASSIGNMENT
   * ==========================================
   */

  const submit = async (assignmentId) => {
    const link = window.prompt("Paste your GitHub or project URL:");

    if (!link) return;

    const { error } = await saveSubmission({
      assignment_id: assignmentId,
      student_id: session.user.id,
      project_url: link,
      status: "submitted",
      submitted_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Submission error:", error);

      flash(error.message);

      return;
    }

    flash("Assignment submitted successfully.");

    /*
     * Refresh submissions
     */

    const { data } = await getMySubmissions(session.user.id);

    setSubmissions(data || []);
  };

  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (loading) {
    return (
      <Layout>
        <p className="center">Loading your dashboard...</p>
      </Layout>
    );
  }

  /*
   * ==========================================
   * DASHBOARD UI
   * ==========================================
   */

  return (
  <Layout>

    {/* =====================================================
        STUDENT DASHBOARD HEADER
    ===================================================== */}

    <section className="dashboard-welcome">

      <div>
        <p className="eyebrow">
          YOUR LEARNING SPACE
        </p>

        <h1>
          Welcome back,{" "}
          {profile?.full_name || session.user.email}
          {" "}👋
        </h1>

        <p className="dashboard-subtitle">
          Continue your courses, complete lessons and
          submit your assignments.
        </p>
      </div>

      <Link
        className="button dashboard-browse-btn"
        to="/courses"
      >
        Browse courses
      </Link>

    </section>


    {/* =====================================================
        STATISTICS
    ===================================================== */}

    <section className="stats dashboard-stats">

      <article className="stat-card">
        <div className="stat-icon">
          📚
        </div>

        <div>
          <b>{enrollments.length}</b>
          <span>Enrolled courses</span>
        </div>
      </article>


      <article className="stat-card">
        <div className="stat-icon">
          📝
        </div>

        <div>
          <b>{submissions.length}</b>
          <span>Assignments submitted</span>
        </div>
      </article>


      <article className="stat-card">
        <div className="stat-icon">
          ✓
        </div>

        <div>
          <b>
            {
              submissions.filter(
                (submission) =>
                  submission.status === "reviewed"
              ).length
            }
          </b>

          <span>
            Assignments reviewed
          </span>
        </div>
      </article>

    </section>


    {/* =====================================================
        MY COURSES
    ===================================================== */}

    <section className="section">

      <div className="section-title dashboard-section-heading">

        <div>
          <p className="eyebrow">
            YOUR LEARNING
          </p>

          <h2>
            Continue learning
          </h2>

          <p className="section-description">
            Pick up where you left off.
          </p>
        </div>

       

      </div>


      {enrollments.length > 0 ? (

        <div className="grid dashboard-course-grid">

          {enrollments.map((enrollment) => {

            const course = enrollment.courses

            if (!course) return null

            const progress =
              courseProgress[course.id] || {
                completed: 0,
                total: 0,
                percentage: 0
              }

            return (

              <article
                className="card dashboard-course-card"
                key={enrollment.id}
              >

                {/* Course Image */}

                <div className="course-image-wrapper">

                  <img
                    src={
                      course.image_url ||
                      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=900"
                    }
                    alt={course.title}
                  />

                  <span className="course-status-badge">
                    {progress.percentage === 100
                      ? "Completed"
                      : "In progress"}
                  </span>

                </div>


                {/* Course Content */}

                <div>

                  <span className="tag">
                    {course.category}
                  </span>


                  <h3>
                    {course.title}
                  </h3>


                  <p>
                    {course.description}
                  </p>


                  <div className="course-meta">

                    <span>
                      {course.level}
                    </span>

                    <span>
                      {course.duration}
                    </span>

                  </div>


                  {/* Progress */}

                  <div className="course-progress">

                    <div className="progress-header">

                      <span>
                        Course progress
                      </span>

                      <strong>
                        {progress.percentage}%
                      </strong>

                    </div>


                    <div className="progress-track">

                      <div
                        className="progress-fill"
                        style={{
                          width:
                            `${progress.percentage}%`
                        }}
                      />

                    </div>


                    <small>
                      {progress.completed} of{" "}
                      {progress.total} lessons completed
                    </small>

                  </div>


                  {/* Continue */}

                  <Link
                    className="button course-action"
                    to={`/learn/${course.id}`}
                  >
                    {progress.percentage === 100
                      ? "Review course"
                      : "Continue learning"}
                  </Link>

                </div>

              </article>

            )
          })}

        </div>

      ) : (

        <div className="empty-state">

          <div className="empty-icon">
            📚
          </div>

          <h3>
            Start your learning journey
          </h3>

          <p>
            You haven't enrolled in any courses yet.
            Explore our courses and find something
            you want to learn.
          </p>

          <Link
            className="button"
            to="/courses"
          >
            Browse courses
          </Link>

        </div>

      )}

    </section>


    {/* =====================================================
        ASSIGNMENTS
    ===================================================== */}

    <section className="section">

      <div className="section-title dashboard-section-heading">

        <div>
          <p className="eyebrow">
            COURSE WORK
          </p>

          <h2>
            Assignments
          </h2>

          <p className="section-description">
            Track your submissions and instructor feedback.
          </p>
        </div>

      </div>


      {assignments.length > 0 ? (

        <div className="assignment-list">

          {assignments.map((assignment) => {

            const submission =
              submissions.find(
                (item) =>
                  item.assignment_id === assignment.id
              )

            return (

              <article
                className="assignment-card"
                key={assignment.id}
              >

                {/* Assignment Information */}

                <div className="assignment-main">

                  <div className="assignment-heading">

                    <span className="tag">
                      ASSIGNMENT
                    </span>

                    {submission && (
                      <span
                        className={
                          submission.status === "reviewed"
                            ? "status-badge status-reviewed"
                            : "status-badge status-submitted"
                        }
                      >
                        {submission.status === "reviewed"
                          ? "✓ Reviewed"
                          : "✓ Submitted"}
                      </span>
                    )}

                  </div>


                  <h3>
                    {assignment.title}
                  </h3>


                  <p>
                    {assignment.description}
                  </p>


                  <div className="assignment-meta">

                    <span>
                      📚 {assignment.courses?.title}
                    </span>

                    <span>
                      📅 Due{" "}
                      {assignment.due_date ||
                        "No due date"}
                    </span>

                  </div>

                </div>


                {/* Assignment Action */}

                <div className="assignment-action">

                  {!submission && (

                    <button
                      onClick={() =>
                        submit(assignment.id)
                      }
                    >
                      Submit work
                    </button>

                  )}


                  {submission && (

                    <div className="submission-result">

                      <div className="submission-status">

                        <strong>
                          {submission.status === "reviewed"
                            ? "✓ Assignment reviewed"
                            : "✓ Assignment submitted"}
                        </strong>

                      </div>


                      <a
                        className="submission-link"
                        href={submission.project_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open submission ↗
                      </a>


                      {/* Score */}

                      {submission.score !== null &&
                        submission.score !== undefined && (

                          <div className="score-box">

                            <span>
                              Score
                            </span>

                            <strong>
                              {submission.score}
                              <small>/100</small>
                            </strong>

                          </div>

                        )}


                      {/* Instructor Feedback */}

                      {submission.instructor_feedback && (

                        <div className="feedback-box">

                          <strong>
                            Instructor feedback
                          </strong>

                          <p>
                            {submission.instructor_feedback}
                          </p>

                        </div>

                      )}


                      {/* Update Submission */}

                      {submission.status !== "reviewed" && (

                        <button
                          className="button-outline"
                          onClick={() =>
                            submit(assignment.id)
                          }
                        >
                          Update submission
                        </button>

                      )}

                    </div>

                  )}

                </div>

              </article>

            )

          })}

        </div>

      ) : (

        <div className="empty-state compact">

          <div className="empty-icon">
            ✓
          </div>

          <h3>
            No assignments yet
          </h3>

          <p>
            Assignments from your enrolled courses
            will appear here.
          </p>

        </div>

      )}

    </section>

  </Layout>
)
}

/* =====================================================
   INSTRUCTOR DASHBOARD
===================================================== */
function InstructorDashboard() {
  const { session, profile } = useApp();

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    if (!session?.user?.id) return;

    loadInstructorData();
  }, [session]);

  const loadInstructorData = async () => {
    /* ==========================================
       GET INSTRUCTOR COURSES
    ========================================== */

    const {
      data: courseData,
      error: courseError,
    } = await supabase
      .from("courses")
      .select("*")
      .eq("instructor_id", session.user.id)
      .order("created_at", {
        ascending: false,
      });

    if (courseError) {
      console.error("Course loading error:", courseError);
    }

    const courseIds =
      courseData?.map((course) => course.id) || [];

    /* ==========================================
       GET ENROLLED STUDENTS
    ========================================== */

    let studentData = [];

    if (courseIds.length > 0) {
      const {
        data: enrollmentData,
        error: enrollmentError,
      } = await supabase
        .from("enrollments")
        .select("student_id, course_id")
        .in("course_id", courseIds);

      if (enrollmentError) {
        console.error(
          "Enrollment loading error:",
          enrollmentError
        );
      }

      if (enrollmentData?.length) {
        const studentIds = [
          ...new Set(
            enrollmentData.map(
              (item) => item.student_id
            )
          ),
        ];

        const {
          data: profiles,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("*")
          .in("id", studentIds);

        if (profileError) {
          console.error(
            "Student loading error:",
            profileError
          );
        }

        studentData = profiles || [];
      }
    }

    /* ==========================================
       GET INSTRUCTOR ASSIGNMENTS
    ========================================== */

    let assignmentData = [];

    if (courseIds.length > 0) {
      const {
        data,
        error,
      } = await supabase
        .from("assignments")
        .select("*, courses(title)")
        .in("course_id", courseIds);

      if (error) {
        console.error(
          "Assignment loading error:",
          error
        );
      }

      assignmentData = data || [];
    }

    /* ==========================================
       GET STUDENT FEEDBACK
    ========================================== */

    let feedbackData = [];

    if (courseIds.length > 0) {
      const {
        data,
        error,
      } = await getInstructorFeedback(courseIds);

      if (error) {
        console.error(
          "Feedback loading error:",
          error
        );
      } else {
        feedbackData = data || [];
      }
    }

    setCourses(courseData || []);
    setStudents(studentData);
    setAssignments(assignmentData);
    setFeedback(feedbackData);
  };

  return (
    <Layout>
      <div className="instructor-dashboard">

        {/* ==========================================
            HERO / WELCOME
        ========================================== */}

        <section className="instructor-hero">
          <div className="instructor-hero-content">
            <div>
              <span className="instructor-kicker">
                INSTRUCTOR DASHBOARD
              </span>

              <h1>
                Welcome back,{" "}
                <span>
                  {profile?.full_name ||
                    session?.user?.email}
                </span>
              </h1>

              <p>
                Manage your courses, support your
                students, create assignments and
                review learner feedback — all from
                one place.
              </p>
            </div>

            <Link
              className="button instructor-hero-button"
              to="/teach"
            >
              + Create course
            </Link>
          </div>
        </section>


        {/* ==========================================
            STATISTICS
        ========================================== */}

        <section className="instructor-stats">

          <article className="instructor-stat-card">
            <div className="instructor-stat-icon">
              📚
            </div>

            <div>
              <strong>{courses.length}</strong>
              <span>Courses created</span>
            </div>
          </article>


          <article className="instructor-stat-card">
            <div className="instructor-stat-icon">
              👨‍🎓
            </div>

            <div>
              <strong>{students.length}</strong>
              <span>Students</span>
            </div>
          </article>


          <article className="instructor-stat-card">
            <div className="instructor-stat-icon">
              📝
            </div>

            <div>
              <strong>{assignments.length}</strong>
              <span>Assignments</span>
            </div>
          </article>


          <article className="instructor-stat-card">
            <div className="instructor-stat-icon">
              ⭐
            </div>

            <div>
              <strong>{feedback.length}</strong>
              <span>Reviews</span>
            </div>
          </article>

        </section>


        {/* ==========================================
            QUICK ACTIONS
        ========================================== */}

        <section className="instructor-section">

          <div className="instructor-section-heading">
            <div>
              <span className="instructor-section-label">
                QUICK ACTIONS
              </span>

              <h2>Instructor tools</h2>

              <p>
                Quickly access the tools you use
                most often.
              </p>
            </div>
          </div>


          <div className="instructor-tools-grid">

            <article className="instructor-tool-card">
              <div className="instructor-tool-icon">
                📚
              </div>

              <div>
                <span className="instructor-tool-label">
                  COURSE
                </span>

                <h3>Create a course</h3>

                <p>
                  Create and publish a new course
                  for your students.
                </p>

                <Link
                  className="instructor-card-link"
                  to="/teach"
                >
                  Create course
                  <span>→</span>
                </Link>
              </div>
            </article>


            <article className="instructor-tool-card">
              <div className="instructor-tool-icon">
                👨‍🎓
              </div>

              <div>
                <span className="instructor-tool-label">
                  STUDENTS
                </span>

                <h3>Manage students</h3>

                <p>
                  View students enrolled in your
                  courses.
                </p>

                <a
                  className="instructor-card-link"
                  href="#students"
                >
                  View students
                  <span>→</span>
                </a>
              </div>
            </article>


            <article className="instructor-tool-card">
              <div className="instructor-tool-icon">
                📝
              </div>

              <div>
                <span className="instructor-tool-label">
                  ASSIGNMENTS
                </span>

                <h3>Manage assignments</h3>

                <p>
                  View assignments created for
                  your courses.
                </p>

                <a
                  className="instructor-card-link"
                  href="#assignments"
                >
                  View assignments
                  <span>→</span>
                </a>
              </div>
            </article>


            <article className="instructor-tool-card">
              <div className="instructor-tool-icon">
                ⭐
              </div>

              <div>
                <span className="instructor-tool-label">
                  FEEDBACK
                </span>

                <h3>Student reviews</h3>

                <p>
                  View ratings and feedback from
                  your students.
                </p>

                <a
                  className="instructor-card-link"
                  href="#reviews"
                >
                  View reviews
                  <span>→</span>
                </a>
              </div>
            </article>

          </div>
        </section>


        {/* ==========================================
            MY COURSES
        ========================================== */}

        <section className="instructor-section">

          <div className="instructor-section-heading instructor-heading-row">
            <div>
              <span className="instructor-section-label">
                YOUR CONTENT
              </span>

              <h2>My courses</h2>

              <p>
                Manage and update the courses you
                have created.
              </p>
            </div>

            <Link
              className="button"
              to="/teach"
            >
              + Create course
            </Link>
          </div>


          {courses.length > 0 ? (

            <div className="instructor-course-grid">

              {courses.map((course) => (

                <article
                  className="instructor-course-card"
                  key={course.id}
                >

                  <div className="instructor-course-image">
                    <img
                      src={
                        course.image_url ||
                        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=900"
                      }
                      alt={course.title}
                    />

                    <span className="instructor-course-category">
                      {course.category}
                    </span>
                  </div>


                  <div className="instructor-course-body">

                    <div className="instructor-course-meta">
                      <span>{course.level}</span>
                      <span>•</span>
                      <span>{course.duration}</span>
                    </div>

                    <h3>{course.title}</h3>

                    <p>
                      {course.description}
                    </p>

                    <Link
                      className="button instructor-edit-button"
                      to={`/teach/courses/${course.id}/edit`}
                    >
                      Edit course
                    </Link>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="instructor-empty-state">
              <div className="instructor-empty-icon">
                📚
              </div>

              <h3>No courses yet</h3>

              <p>
                You haven't created any courses yet.
                Start building your first course.
              </p>

              <Link
                className="button"
                to="/teach"
              >
                Create your first course
              </Link>
            </div>

          )}

        </section>


        {/* ==========================================
            STUDENTS
        ========================================== */}

        <section
          className="instructor-section"
          id="students"
        >

          <div className="instructor-section-heading">
            <div>
              <span className="instructor-section-label">
                ENROLLED LEARNERS
              </span>

              <h2>Students</h2>

              <p>
                Students currently enrolled in your
                courses.
              </p>
            </div>
          </div>


          {students.length > 0 ? (

            <div className="instructor-list">

              {students.map((student) => (

                <article
                  className="instructor-student-card"
                  key={student.id}
                >

                  <div className="student-avatar">
                    {(student.full_name ||
                      "S")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="student-info">
                    <strong>
                      {student.full_name}
                    </strong>

                    <span>Student</span>
                  </div>

                  <span className="student-status">
                    Enrolled
                  </span>

                </article>

              ))}

            </div>

          ) : (

            <div className="instructor-empty-state compact">
              <div className="instructor-empty-icon">
                👨‍🎓
              </div>

              <h3>No students yet</h3>

              <p>
                No students have enrolled in your
                courses yet.
              </p>
            </div>

          )}

        </section>


        {/* ==========================================
            ASSIGNMENTS
        ========================================== */}

        <section
          className="instructor-section"
          id="assignments"
        >

          <div className="instructor-section-heading">
            <div>
              <span className="instructor-section-label">
                COURSE WORK
              </span>

              <h2>Assignments</h2>

              <p>
                Assignments created for your courses.
              </p>
            </div>
          </div>


          {assignments.length > 0 ? (

            <div className="instructor-assignment-list">

              {assignments.map((assignment) => (

                <article
                  className="instructor-assignment-card"
                  key={assignment.id}
                >

                  <div className="assignment-icon">
                    📝
                  </div>

                  <div className="assignment-info">

                    <h3>
                      {assignment.title}
                    </h3>

                    <p>
                      {assignment.description}
                    </p>

                    <div className="assignment-meta">

                      <span>
                        📚{" "}
                        {assignment.courses?.title ||
                          "Course"}
                      </span>

                      <span>
                        📅 Due{" "}
                        {assignment.due_date ||
                          "No due date"}
                      </span>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="instructor-empty-state compact">
              <div className="instructor-empty-icon">
                📝
              </div>

              <h3>No assignments yet</h3>

              <p>
                No assignments have been created
                for your courses.
              </p>
            </div>

          )}

        </section>


        {/* ==========================================
            REVIEWS
        ========================================== */}

        <section
          className="instructor-section"
          id="reviews"
        >

          <div className="instructor-section-heading">
            <div>
              <span className="instructor-section-label">
                STUDENT FEEDBACK
              </span>

              <h2>Course reviews</h2>

              <p>
                See what your students think about
                your courses.
              </p>
            </div>
          </div>


          {feedback.length > 0 ? (

            <div className="instructor-review-grid">

              {feedback.map((review) => (

                <article
                  className="instructor-review-card"
                  key={review.id}
                >

                  <div className="review-top">

                    <div className="review-avatar">
                      {(
                        review.profiles?.full_name ||
                        "S"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {review.profiles?.full_name ||
                          "Student"}
                      </strong>

                      <span>
                        {review.courses?.title ||
                          "Course"}
                      </span>
                    </div>

                  </div>


                  <div className="review-rating">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>


                  <p className="review-comment">
                    “{review.comment}”
                  </p>


                  <small className="review-date">
                    {review.created_at
                      ? new Date(
                          review.created_at
                        ).toLocaleDateString()
                      : ""}
                  </small>

                </article>

              ))}

            </div>

          ) : (

            <div className="instructor-empty-state compact">
              <div className="instructor-empty-icon">
                ⭐
              </div>

              <h3>No reviews yet</h3>

              <p>
                Student reviews will appear here
                after learners complete your courses.
              </p>
            </div>

          )}

        </section>

      </div>
    </Layout>
  );
}