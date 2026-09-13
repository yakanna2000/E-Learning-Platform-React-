import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useApp } from "../context/AppContext";
import { getCourse, getLessons, createLesson } from "../lib/courseService";
import { getAssignments, createAssignment } from "../lib/learningService";
import { supabase } from "../lib/supabase";

export function InstructorCourseEditPage() {
  const { courseId } = useParams();

  const { session, profile, flash } = useApp();

  const [course, setCourse] = useState(null);

  const [lessons, setLessons] = useState([]);

  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [lessonBusy, setLessonBusy] = useState(false);

  const [assignmentBusy, setAssignmentBusy] = useState(false);

  const [lesson, setLesson] = useState({
    title: "",
    content: "",
    duration_minutes: 60,
  });

  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    due_date: "",
  });

  /* =========================
     LOAD COURSE
  ========================= */

  useEffect(() => {
    if (!courseId) return;

    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    setLoading(true);

    const courseResult = await getCourse(courseId);

    if (courseResult.error) {
      console.error(courseResult.error);

      flash(courseResult.error.message);

      setLoading(false);
      return;
    }

    const currentCourse = courseResult.data;

    if (currentCourse.instructor_id !== session?.user?.id) {
      flash("You do not have permission to edit this course.");

      setLoading(false);
      return;
    }

    setCourse(currentCourse);

    /* Load lessons */

    const lessonResult = await getLessons(courseId);

    if (lessonResult.error) {
      console.error(lessonResult.error);
    } else {
      setLessons(lessonResult.data || []);
    }

    /* Load assignments */

    const assignmentResult = await supabase
      .from("assignments")
      .select("*")
      .eq("course_id", courseId)
      .order("created_at", {
        ascending: false,
      });

    if (assignmentResult.error) {
      console.error(assignmentResult.error);
    } else {
      setAssignments(assignmentResult.data || []);
    }

    setLoading(false);
  };

  /* =========================
     LESSON
  ========================= */

  const handleLessonChange = (e) => {
    setLesson({
      ...lesson,
      [e.target.name]: e.target.value,
    });
  };

  const addLesson = async (e) => {
    e.preventDefault();

    if (!course) return;

    setLessonBusy(true);

    const nextPosition =
      lessons.length > 0
        ? Math.max(...lessons.map((item) => item.position)) + 1
        : 1;

    const { data, error } = await createLesson({
      course_id: course.id,

      title: lesson.title,

      content: lesson.content,

      duration_minutes: Number(lesson.duration_minutes),

      position: nextPosition,
    });

    setLessonBusy(false);

    if (error) {
      console.error("Lesson creation error:", error);

      flash(error.message);
      return;
    }

    setLessons([...lessons, data]);

    setLesson({
      title: "",
      content: "",
      duration_minutes: 60,
    });

    flash("Lesson added successfully.");
  };

  /* =========================
     ASSIGNMENT
  ========================= */

  const handleAssignmentChange = (e) => {
    setAssignment({
      ...assignment,
      [e.target.name]: e.target.value,
    });
  };

  const addAssignment = async (e) => {
    e.preventDefault();

    if (!course) return;

    setAssignmentBusy(true);

    const { data, error } = await createAssignment({
      course_id: course.id,

      title: assignment.title,

      description: assignment.description,

      due_date: assignment.due_date || null,
    });

    setAssignmentBusy(false);

    if (error) {
      console.error("Assignment creation error:", error);

      flash(error.message);
      return;
    }

    setAssignments([...assignments, data]);

    setAssignment({
      title: "",
      description: "",
      due_date: "",
    });

    flash("Assignment created successfully.");
  };

  if (loading) {
    return (
      <Layout>
        <p className="center">Loading course editor...</p>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <p className="center">Course not found.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="form-page wide">
        <Link to="/dashboard">← Back to dashboard</Link>

        <p className="eyebrow">COURSE EDITOR</p>

        <h1>{course.title}</h1>

        <p>Manage your course content, lessons and assignments.</p>

        {/* =========================
            COURSE INFORMATION
        ========================= */}

        <section className="editor-section">
          <h2>Course information</h2>

          <p>Category: {course.category}</p>

          <p>Level: {course.level}</p>

          <p>Duration: {course.duration}</p>

          <p>{course.description}</p>
        </section>

        {/* =========================
            LESSONS
        ========================= */}

        <section className="editor-section">
          <div className="section-title">
            <div>
              <p className="eyebrow">COURSE CONTENT</p>

              <h2>Lessons</h2>
            </div>

            <span>{lessons.length} lessons</span>
          </div>

          {lessons.length > 0 ? (
            <ol className="lessons">
              {lessons.map((lessonItem) => (
                <li key={lessonItem.id}>
                  <div>
                    <strong>
                      {lessonItem.position}. {lessonItem.title}
                    </strong>

                    <p>{lessonItem.content}</p>
                  </div>

                  <span>{lessonItem.duration_minutes} min</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="empty">No lessons added yet.</p>
          )}

          {/* ADD LESSON */}

          <form onSubmit={addLesson} className="lesson-form">
            <h3>Add new lesson</h3>

            <label>
              Lesson title
              <input
                name="title"
                required
                value={lesson.title}
                onChange={handleLessonChange}
                placeholder="Introduction to React"
              />
            </label>

            <label>
              Lesson content
              <textarea
                name="content"
                required
                value={lesson.content}
                onChange={handleLessonChange}
                placeholder="Enter lesson content..."
              />
            </label>

            <label>
              Duration in minutes
              <input
                name="duration_minutes"
                type="number"
                min="1"
                value={lesson.duration_minutes}
                onChange={handleLessonChange}
              />
            </label>

            <button disabled={lessonBusy}>
              {lessonBusy ? "Adding lesson..." : "+ Add lesson"}
            </button>
          </form>
        </section>

        {/* =========================
            ASSIGNMENTS
        ========================= */}

        <section className="editor-section">
          <div className="section-title">
            <div>
              <p className="eyebrow">COURSE WORK</p>

              <h2>Assignments</h2>
            </div>

            <span>{assignments.length} assignments</span>
          </div>

          {assignments.length > 0 ? (
            <div className="list">
              {assignments.map((assignmentItem) => (
                <article key={assignmentItem.id}>
                  <div>
                    <b>{assignmentItem.title}</b>

                    <p>{assignmentItem.description}</p>

                    <small>
                      Due: {assignmentItem.due_date || "No due date"}
                    </small>
                  </div>

                  <Link
                    className="button"
                    to={`/teach/assignments/${assignmentItem.id}/submissions`}
                  >
                    View submissions
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty">No assignments added yet.</p>
          )}

          {/* ADD ASSIGNMENT */}

          <form onSubmit={addAssignment} className="lesson-form">
            <h3>Add new assignment</h3>

            <label>
              Assignment title
              <input
                name="title"
                required
                value={assignment.title}
                onChange={handleAssignmentChange}
                placeholder="Build a React Todo App"
              />
            </label>

            <label>
              Assignment description
              <textarea
                name="description"
                required
                value={assignment.description}
                onChange={handleAssignmentChange}
                placeholder="Describe the assignment..."
              />
            </label>

            <label>
              Due date
              <input
                name="due_date"
                type="date"
                value={assignment.due_date}
                onChange={handleAssignmentChange}
              />
            </label>

            <button disabled={assignmentBusy}>
              {assignmentBusy ? "Creating assignment..." : "+ Add assignment"}
            </button>
          </form>
        </section>
      </section>
    </Layout>
  );
}
