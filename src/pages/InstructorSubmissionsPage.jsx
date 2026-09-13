import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useApp } from '../context/AppContext'
import {
  getAssignmentSubmissions,
  reviewSubmission
} from '../lib/learningService'


export function InstructorSubmissionsPage() {

  const { assignmentId } = useParams()

  const { flash } = useApp()

  const [submissions, setSubmissions] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(null)


  useEffect(() => {

    loadSubmissions()

  }, [assignmentId])


  const loadSubmissions = async () => {

    setLoading(true)

    const {
      data,
      error
    } = await getAssignmentSubmissions(
      assignmentId
    )


    if (error) {

      console.error(
        'Submission loading error:',
        error
      )

      flash(error.message)

      setLoading(false)

      return
    }


    setSubmissions(
      data || []
    )

    setLoading(false)
  }


  const updateField = (
    submissionId,
    field,
    value
  ) => {

    setSubmissions(
      previous =>
        previous.map(item =>

          item.id === submissionId

            ? {
                ...item,
                [field]: value
              }

            : item

        )
    )
  }


  const saveReview = async (
    submission
  ) => {

    setSaving(
      submission.id
    )


    const {
      error
    } = await reviewSubmission(

      submission.id,

      submission.score,

      submission.instructor_feedback || ''

    )


    setSaving(null)


    if (error) {

      console.error(
        'Review error:',
        error
      )

      flash(error.message)

      return
    }


    flash(
      'Submission reviewed successfully.'
    )


    await loadSubmissions()
  }


  if (loading) {

    return (
      <Layout>

        <p className="center">
          Loading submissions...
        </p>

      </Layout>
    )

  }


  return (
    <Layout>

      <section className="form-page wide">

        <Link to="/dashboard">
          ← Back to dashboard
        </Link>


        <p className="eyebrow">
          INSTRUCTOR
        </p>


        <h1>
          Assignment submissions
        </h1>


        {submissions.length === 0 ? (

          <p className="empty">

            No students have submitted
            this assignment yet.

          </p>

        ) : (

          <div className="list">

            {submissions.map(
              submission => (

                <article
                  key={submission.id}
                  className="submission-card"
                >

                  {/* STUDENT */}

                  <div>

                    <span className="tag">
                      STUDENT
                    </span>

                    <h3>

                      {
                        submission
                          .profiles
                          ?.full_name ||
                        'Student'
                      }

                    </h3>


                    <p>

                      Assignment:{' '}

                      {
                        submission
                          .assignments
                          ?.title
                      }

                    </p>

                  </div>


                  {/* PROJECT */}

                  <div>

                    <strong>
                      Submitted project
                    </strong>


                    <p>

                      <a
                        href={
                          submission.project_url
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open submitted project
                      </a>

                    </p>


                    <small>

                      Submitted:{' '}

                      {
                        submission
                          .submitted_at
                          ? new Date(
                              submission
                                .submitted_at
                            ).toLocaleString()
                          : 'Unknown'
                      }

                    </small>

                  </div>


                  {/* REVIEW */}

                  <div className="review-form">

                    <label>

                      Score

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          submission.score ??
                          ''
                        }
                        onChange={e =>
                          updateField(
                            submission.id,
                            'score',
                            e.target.value
                          )
                        }
                        placeholder="0 - 100"
                      />

                    </label>


                    <label>

                      Instructor feedback

                      <textarea
                        value={
                          submission
                            .instructor_feedback ||
                          ''
                        }
                        onChange={e =>
                          updateField(
                            submission.id,
                            'instructor_feedback',
                            e.target.value
                          )
                        }
                        placeholder="Write feedback for the student..."
                      />

                    </label>


                    <button
                      onClick={() =>
                        saveReview(
                          submission
                        )
                      }
                      disabled={
                        saving ===
                        submission.id
                      }
                    >

                      {
                        saving ===
                        submission.id
                          ? 'Saving...'
                          : 'Save review'
                      }

                    </button>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </section>

    </Layout>
  )
}