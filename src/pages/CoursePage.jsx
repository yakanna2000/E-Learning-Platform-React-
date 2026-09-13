import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useApp } from '../context/AppContext'
import {
  enroll,
  getCourse,
  getEnrollment,
  getLessons
} from '../lib/courseService'
import { isConfigured } from '../lib/supabase'

export function CoursePage() {
  const { id } = useParams()

  const { session, profile, flash } = useApp()

  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [joined, setJoined] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isConfigured || !id) {
      setLoading(false)
      return
    }

    async function loadCourse() {
      setLoading(true)
      setError('')

      const courseResult = await getCourse(id)

      if (courseResult.error) {
        console.error(
          'Course loading error:',
          courseResult.error
        )

        setError(courseResult.error.message)
        setLoading(false)
        return
      }

      setCourse(courseResult.data)

      const lessonsResult = await getLessons(id)

      if (lessonsResult.error) {
        console.error(
          'Lessons loading error:',
          lessonsResult.error
        )

        setError(lessonsResult.error.message)
        setLessons([])
      } else {
        setLessons(lessonsResult.data || [])
      }

      if (session?.user?.id) {
        const enrollmentResult = await getEnrollment(
          id,
          session.user.id
        )

        if (enrollmentResult.error) {
          console.error(
            'Enrollment loading error:',
            enrollmentResult.error
          )
        }

        setJoined(Boolean(enrollmentResult.data))
      } else {
        setJoined(false)
      }

      setLoading(false)
    }

    loadCourse()
  }, [id, session])

  const join = async () => {
    if (!session) {
      flash('Log in to enroll.')
      return
    }

    if (profile?.role !== 'student') {
      flash('Only student accounts can enroll.')
      return
    }

    const { error } = await enroll(
      id,
      session.user.id
    )

    if (error) {
      flash(error.message)
      return
    }

    setJoined(true)

    flash(
      'You are enrolled — start your first lesson.'
    )
  }

  if (!isConfigured) {
    return (
      <Layout>
        <main className="course-state-page">
          <div className="course-state-card">
            <div className="course-state-icon">
              ⚙️
            </div>

            <h1>Supabase configuration required</h1>

            <p>
              Configure Supabase to load courses.
            </p>
          </div>
        </main>
      </Layout>
    )
  }

  if (loading) {
    return (
      <Layout>
        <main className="course-state-page">
          <div className="course-state-card">
            <div className="course-loading-spinner" />

            <h1>Loading course</h1>

            <p>
              Please wait while we load the course
              content.
            </p>
          </div>
        </main>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <main className="course-state-page">
          <div className="course-state-card">
            <div className="course-state-icon">
              ⚠️
            </div>

            <span className="course-state-label">
              COURSE ERROR
            </span>

            <h1>
              Unable to load this course
            </h1>

            <p>{error}</p>

            <Link
              className="button"
              to="/courses"
            >
              ← Back to courses
            </Link>
          </div>
        </main>
      </Layout>
    )
  }

  if (!course) {
    return (
      <Layout>
        <main className="course-state-page">
          <div className="course-state-card">
            <div className="course-state-icon">
              🔍
            </div>

            <span className="course-state-label">
              COURSE NOT FOUND
            </span>

            <h1>Course not found</h1>

            <p>
              This course does not exist or is no
              longer available.
            </p>

            <Link
              className="button"
              to="/courses"
            >
              ← Back to courses
            </Link>
          </div>
        </main>
      </Layout>
    )
  }

  return (
    <Layout>

      {/* =====================================================
          COURSE HERO
      ===================================================== */}

      <main className="course-page">

        <section className="course-hero">

          <div className="course-hero-image">

            <img
              src={
                course.image_url ||
                'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200'
              }
              alt={course.title}
            />

            <div className="course-image-overlay" />

            <span className="course-category">
              {course.category}
            </span>

          </div>


          <div className="course-hero-content">

            <div className="course-breadcrumb">
              <Link to="/courses">
                Courses
              </Link>

              <span>/</span>

              <span>{course.category}</span>
            </div>


            <span className="course-eyebrow">
              {course.level} · {course.duration}
            </span>


            <h1>
              {course.title}
            </h1>


            <p className="course-description">
              {course.description}
            </p>


            <div className="course-instructor">

              <div className="course-instructor-avatar">
                {(
                  course.instructor_name ||
                  'I'
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <span>
                  Course instructor
                </span>

                <strong>
                  {course.instructor_name}
                </strong>
              </div>

            </div>


            <div className="course-action-area">

              {joined ? (

                <Link
                  className="button course-main-button"
                  to={`/learn/${id}`}
                >
                  Continue learning
                  <span>→</span>
                </Link>

              ) : (

                <button
                  className="course-main-button"
                  onClick={join}
                >
                  Enroll free
                  <span>→</span>
                </button>

              )}

              <div className="course-free-note">
                ✓ Free enrollment
              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            COURSE OVERVIEW
        ===================================================== */}

        <section className="course-overview">

          <div className="course-overview-item">

            <span className="course-overview-icon">
              📚
            </span>

            <div>
              <strong>
                {lessons.length}
              </strong>

              <span>
                Lessons
              </span>
            </div>

          </div>


          <div className="course-overview-item">

            <span className="course-overview-icon">
              ⏱️
            </span>

            <div>
              <strong>
                {course.duration}
              </strong>

              <span>
                Course duration
              </span>
            </div>

          </div>


          <div className="course-overview-item">

            <span className="course-overview-icon">
              🎓
            </span>

            <div>
              <strong>
                {course.level}
              </strong>

              <span>
                Skill level
              </span>
            </div>

          </div>


          <div className="course-overview-item">

            <span className="course-overview-icon">
              ✓
            </span>

            <div>
              <strong>
                Free
              </strong>

              <span>
                Enrollment
              </span>
            </div>

          </div>

        </section>


        {/* =====================================================
            COURSE SYLLABUS
        ===================================================== */}

        <section className="course-syllabus">

          <div className="course-section-heading">

            <div>

              <span className="course-section-label">
                COURSE CONTENT
              </span>

              <h2>
                Course syllabus
              </h2>

              <p>
                Explore the lessons included in
                this course.
              </p>

            </div>

            <div className="course-lesson-count">
              <strong>
                {lessons.length}
              </strong>

              <span>
                {lessons.length === 1
                  ? 'lesson'
                  : 'lessons'}
              </span>
            </div>

          </div>


          {lessons.length > 0 ? (

            <ol className="course-lessons">

              {lessons.map(
                (lesson, index) => (

                  <li
                    className="course-lesson"
                    key={lesson.id}
                  >

                    <div className="course-lesson-number">
                      {String(index + 1).padStart(
                        2,
                        '0'
                      )}
                    </div>


                    <div className="course-lesson-info">

                      <h3>
                        {lesson.title}
                      </h3>

                      {lesson.content && (
                        <p>
                          {lesson.content}
                        </p>
                      )}

                    </div>


                    <span className="course-lesson-duration">
                      <span>◷</span>
                      {lesson.duration_minutes ||
                        10}{' '}
                      min
                    </span>

                  </li>

                )
              )}

            </ol>

          ) : (

            <div className="course-empty-lessons">

              <div>
                📖
              </div>

              <h3>
                Lessons coming soon
              </h3>

              <p>
                No lessons have been added to this
                course yet.
              </p>

            </div>

          )}

        </section>

      </main>

    </Layout>
  )
}