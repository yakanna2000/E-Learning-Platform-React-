import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useApp } from '../context/AppContext'
import { createCourse } from '../lib/courseService'

export function InstructorPage() {
  const {
    session,
    profile,
    flash
  } = useApp()

  const navigate = useNavigate()

  const [busy, setBusy] = useState(false)

  const [course, setCourse] = useState({
    title: '',
    category: 'Development',
    level: 'Beginner',
    description: '',
    duration: '6 hours',
    image_url: ''
  })

  const handleChange = (e) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value
    })
  }

  const publish = async (e) => {
    e.preventDefault()

    if (!session?.user?.id) {
      flash('Please log in first.')
      return
    }

    if (profile?.role !== 'instructor') {
      flash('Only instructors can create courses.')
      return
    }

    setBusy(true)

    const { data, error } = await createCourse({
      ...course,
      instructor_id: session.user.id,
      instructor_name: profile.full_name,
      published: true
    })

    setBusy(false)

    if (error) {
      console.error('Course creation error:', error)
      flash(error.message)
      return
    }

    flash('Course created successfully.')

    navigate(`/teach/courses/${data.id}/edit`)
  }

  return (
    <Layout>

      <section className="instructor-create-page">

        {/* =================================================
            PAGE HEADER
            ================================================= */}

        <div className="instructor-create-header">

          <div>

            <p className="instructor-create-label">
              INSTRUCTOR WORKSPACE
            </p>

            <h1>
              Create a new course
            </h1>

            <p>
              Share your knowledge with learners.
              Create the course details first, then
              add lessons and assignments.
            </p>

          </div>

          <div className="instructor-create-badge">
            <span>✦</span>
            <div>
              <strong>Build something useful</strong>
              <small>One course at a time</small>
            </div>
          </div>

        </div>


        {/* =================================================
            COURSE FORM
            ================================================= */}

        <form
          className="instructor-create-form"
          onSubmit={publish}
        >

          <div className="instructor-form-heading">

            <div className="instructor-form-number">
              01
            </div>

            <div>
              <h2>
                Course information
              </h2>

              <p>
                Give learners a clear idea of what
                they will learn.
              </p>
            </div>

          </div>


          {/* =================================================
              BASIC INFORMATION
              ================================================= */}

          <div className="instructor-form-grid">

            <label className="instructor-field instructor-field-full">
              <span>
                Course title
              </span>

              <input
                name="title"
                required
                value={course.title}
                onChange={handleChange}
                placeholder="React JS Complete Course"
              />

              <small>
                Choose a clear and descriptive course title.
              </small>
            </label>


            <label className="instructor-field">
              <span>
                Category
              </span>

              <input
                name="category"
                required
                value={course.category}
                onChange={handleChange}
                placeholder="Development"
              />
            </label>


            <label className="instructor-field">
              <span>
                Level
              </span>

              <select
                name="level"
                value={course.level}
                onChange={handleChange}
              >
                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>
              </select>
            </label>


            <label className="instructor-field">
              <span>
                Duration
              </span>

              <input
                name="duration"
                value={course.duration}
                onChange={handleChange}
                placeholder="6 hours"
              />
            </label>


            <label className="instructor-field">
              <span>
                Cover image URL
              </span>

              <input
                name="image_url"
                value={course.image_url}
                onChange={handleChange}
                placeholder="https://..."
              />

              <small>
                Add an image URL to make your course stand out.
              </small>
            </label>


            <label className="instructor-field instructor-field-full">
              <span>
                Course description
              </span>

              <textarea
                name="description"
                required
                value={course.description}
                onChange={handleChange}
                placeholder="Describe what students will learn in this course..."
              />

              <small>
                Explain the course content, goals, and what learners
                can expect.
              </small>
            </label>

          </div>


          {/* =================================================
              NEXT STEP INFORMATION
              ================================================= */}

          <div className="instructor-next-step">

            <div className="instructor-next-icon">
              →
            </div>

            <div>
              <strong>
                What happens next?
              </strong>

              <p>
                After creating the course, you'll be taken to
                the course editor where you can add lessons
                and assignments.
              </p>
            </div>

          </div>


          {/* =================================================
              FORM ACTION
              ================================================= */}

          <div className="instructor-form-actions">

            <button
              type="submit"
              className="instructor-create-button"
              disabled={busy}
            >
              {busy
                ? 'Creating course...'
                : 'Create course'}

              {!busy && (
                <span>
                  →
                </span>
              )}
            </button>

          </div>

        </form>

      </section>

    </Layout>
  )
}