import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useApp } from '../context/AppContext'

import {
  completeLesson,
  completeEnrollment,
  getCompletedLessonIds,
  getLessons
} from '../lib/courseService'

import {
  saveFeedback
} from '../lib/learningService'


export function LessonPage() {
  const { courseId } = useParams()

  const { session, flash } = useApp()

  const [lessons, setLessons] = useState([])
  const [active, setActive] = useState(null)
  const [done, setDone] = useState([])
  const [loading, setLoading] = useState(true)
  const [finishing, setFinishing] = useState(false)

  // Review states
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [reviewSaving, setReviewSaving] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)


  /*
   * ==========================================
   * LOAD LESSONS + PROGRESS
   * ==========================================
   */

  useEffect(() => {
    if (!session?.user?.id || !courseId) return

    async function loadLessons() {
      setLoading(true)

      const lessonsResult = await getLessons(courseId)

      if (lessonsResult.error) {
        console.error(
          'Lessons loading error:',
          lessonsResult.error
        )

        flash(lessonsResult.error.message)

        setLoading(false)
        return
      }

      const lessonData = lessonsResult.data || []

      setLessons(lessonData)

      /*
       * No lessons
       */

      if (lessonData.length === 0) {
        setActive(null)
        setDone([])
        setLoading(false)
        return
      }

      /*
       * Get completed lesson IDs
       */

      const lessonIds = lessonData.map(
        lesson => lesson.id
      )

      const completedResult =
        await getCompletedLessonIds(
          session.user.id,
          lessonIds
        )

      if (completedResult.error) {
        console.error(
          'Progress loading error:',
          completedResult.error
        )

        flash(completedResult.error.message)
      }

      const completedIds =
        completedResult.data || []

      setDone(completedIds)

      /*
       * Open first incomplete lesson.
       *
       * If everything is already completed,
       * open the last lesson.
       */

      const firstIncomplete =
        lessonData.find(
          lesson =>
            !completedIds.includes(
              lesson.id
            )
        )

      setActive(
        firstIncomplete ||
        lessonData[lessonData.length - 1]
      )

      setLoading(false)
    }

    loadLessons()
  }, [courseId, session])


  /*
   * ==========================================
   * MARK LESSON COMPLETE
   * ==========================================
   */

  const finish = async () => {
    if (!active || finishing) return

    setFinishing(true)

    const { error } =
      await completeLesson(
        session.user.id,
        active.id
      )

    if (error) {
      console.error(
        'Complete lesson error:',
        error
      )

      flash(error.message)

      setFinishing(false)
      return
    }

    /*
     * Add lesson to completed list
     */

    const updatedDone = [
      ...new Set([
        ...done,
        active.id
      ])
    ]

    setDone(updatedDone)

    /*
     * Check whether all lessons
     * are completed.
     */

    const allCompleted =
      lessons.length > 0 &&
      lessons.every(
        lesson =>
          updatedDone.includes(
            lesson.id
          )
      )

    if (allCompleted) {

      /*
       * Mark enrollment as completed
       */

      const {
        error: enrollmentError
      } = await completeEnrollment(
        courseId,
        session.user.id
      )

      if (enrollmentError) {
        console.error(
          'Enrollment completion error:',
          enrollmentError
        )

        flash(
          enrollmentError.message
        )

        setFinishing(false)
        return
      }

      flash(
        'Congratulations! You completed the course.'
      )

      setFinishing(false)
      return
    }

    /*
     * Find next lesson
     */

    const currentIndex =
      lessons.findIndex(
        lesson =>
          lesson.id === active.id
      )

    const nextLesson =
      lessons[currentIndex + 1]

    /*
     * Automatically open next lesson
     */

    if (nextLesson) {
      setActive(nextLesson)

      flash(
        'Lesson completed. Moving to the next lesson.'
      )
    } else {
      flash(
        'Lesson marked complete.'
      )
    }

    setFinishing(false)
  }


  /*
   * ==========================================
   * SUBMIT STUDENT REVIEW
   * ==========================================
   */

  const submitReview = async () => {

    if (rating === 0) {
      flash('Please select a rating.')
      return
    }

    if (!review.trim()) {
      flash('Please write a review.')
      return
    }

    if (!session?.user?.id) {
      flash('Please login again.')
      return
    }

    setReviewSaving(true)

    const { error } = await saveFeedback({
      course_id: courseId,
      student_id: session.user.id,
      rating: rating,
      comment: review.trim()
    })

    if (error) {
      console.error(
        'Review submission error:',
        error
      )

      flash(error.message)

      setReviewSaving(false)
      return
    }

    setReviewSubmitted(true)

    flash(
      'Thank you! Your review has been submitted.'
    )

    setReviewSaving(false)
  }


  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (loading) {
    return (
      <Layout>
        <p className="center">
          Loading lessons...
        </p>
      </Layout>
    )
  }


  /*
   * ==========================================
   * NO LESSONS
   * ==========================================
   */

  if (!active) {
    return (
      <Layout>

        <section className="form-page">

          <p className="eyebrow">
            COURSE LEARNING
          </p>

          <h1>
            No lessons available
          </h1>

          <p>
            Your instructor has not added
            lessons to this course yet.
          </p>

          <Link
            className="button"
            to="/dashboard"
          >
            Back to dashboard
          </Link>

        </section>

      </Layout>
    )
  }


  /*
   * ==========================================
   * PROGRESS
   * ==========================================
   */

  const completedCount =
    done.length

  const totalLessons =
    lessons.length

  const percentage =
    totalLessons === 0
      ? 0
      : Math.round(
          (completedCount /
            totalLessons) *
          100
        )

  const courseCompleted =
    completedCount ===
    totalLessons


  /*
   * ==========================================
   * CURRENT LESSON STATUS
   * ==========================================
   */

  const isCurrentLessonCompleted =
    done.includes(active.id)


  /*
   * ==========================================
   * FIND NEXT LESSON
   * ==========================================
   */

  const currentIndex =
    lessons.findIndex(
      lesson =>
        lesson.id === active.id
    )

  const nextLesson =
    lessons[currentIndex + 1]


  /*
   * ==========================================
   * UI
   * ==========================================
   */

  return (
    <Layout>

      <div className="learn">

        {/* =====================================
            LESSON SIDEBAR
        ===================================== */}

        <aside>

          <h3>
            Course lessons
          </h3>


          {/* Progress */}

          <div
            style={{
              marginBottom: '20px'
            }}
          >

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                marginBottom: '6px'
              }}
            >

              <small>
                Course progress
              </small>

              <small>
                {percentage}%
              </small>

            </div>


            <div
              style={{
                width: '100%',
                height: '8px',
                background: '#e5e7eb',
                borderRadius: '999px',
                overflow: 'hidden'
              }}
            >

              <div
                style={{
                  width:
                    `${percentage}%`,
                  height: '100%',
                  background:
                    '#2563eb',
                  borderRadius:
                    '999px'
                }}
              />

            </div>


            <small>
              {completedCount} of{' '}
              {totalLessons} lessons completed
            </small>

          </div>


          {/* Lesson list */}

          {lessons.map(lesson => (

            <button
              key={lesson.id}
              className={
                active.id === lesson.id
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setActive(lesson)
              }
            >

              {done.includes(
                lesson.id
              )
                ? '✓ '
                : ''}

              {lesson.position}.{' '}

              {lesson.title}

            </button>

          ))}

        </aside>


        {/* =====================================
            LESSON CONTENT
        ===================================== */}

        <section>

          <p className="eyebrow">
            LESSON {active.position}
            {' '}OF{' '}
            {lessons.length}
          </p>


          <h1>
            {active.title}
          </h1>


          {active.duration_minutes && (

            <p>
              <strong>
                Duration:
              </strong>{' '}

              {active.duration_minutes}
              {' '}
              minutes
            </p>

          )}


          {/* Lesson content */}

          <article className="lesson-content">

            {active.content ||
              'Your instructor will add the lesson content shortly.'}

          </article>


          {/* ==================================
              COURSE COMPLETED
          ================================== */}

          {courseCompleted ? (

            <div
              style={{
                marginTop: '24px',
                padding: '24px',
                borderRadius: '10px',
                background: '#f0fdf4'
              }}
            >

              <h2>
                🎉 Course Completed!
              </h2>

              <p>
                Congratulations! You have
                completed all {totalLessons}
                lessons in this course.
              </p>


              {/* ==================================
                  STUDENT REVIEW
              ================================== */}

              {!reviewSubmitted ? (

                <div
                  style={{
                    marginTop: '24px',
                    padding: '20px',
                    background: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db'
                  }}
                >

                  <h3>
                    ⭐ Review Your Instructor
                  </h3>

                  <p>
                    You completed this course.
                    Please rate your learning
                    experience and share your
                    feedback with the instructor.
                  </p>


                  {/* Rating */}

                  <div
                    style={{
                      marginTop: '16px',
                      marginBottom: '16px'
                    }}
                  >

                    <strong>
                      Your Rating
                    </strong>

                    <div
                      style={{
                        display: 'flex',
                        gap: '6px',
                        marginTop: '8px'
                      }}
                    >

                      {[1, 2, 3, 4, 5].map(
                        star => (

                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setRating(star)
                            }
                            style={{
                              border: 'none',
                              background:
                                'transparent',
                              cursor: 'pointer',
                              fontSize: '30px',
                              padding: '2px',
                              color: '#facc15'
                            }}
                            aria-label={`Rate ${star} stars`}
                          >
                            {star <= rating
                              ? '★'
                              : '☆'}
                          </button>

                        )
                      )}

                    </div>

                  </div>


                  {/* Review textarea */}

                  <div
                    style={{
                      marginBottom: '16px'
                    }}
                  >

                    <label
                      htmlFor="review"
                      style={{
                        display: 'block',
                        fontWeight: '600',
                        marginBottom: '8px'
                      }}
                    >
                      Your Review
                    </label>

                    <textarea
                      id="review"
                      value={review}
                      onChange={event =>
                        setReview(
                          event.target.value
                        )
                      }
                      placeholder="Write your feedback about the instructor and course..."
                      rows={5}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border:
                          '1px solid #d1d5db',
                        resize: 'vertical'
                      }}
                    />

                  </div>


                  {/* Submit */}

                  <button
                    type="button"
                    onClick={submitReview}
                    disabled={reviewSaving}
                  >

                    {reviewSaving
                      ? 'Submitting...'
                      : 'Submit Review'}

                  </button>

                </div>

              ) : (

                <div
                  style={{
                    marginTop: '24px',
                    padding: '20px',
                    background: '#ffffff',
                    borderRadius: '10px',
                    border:
                      '1px solid #bbf7d0'
                  }}
                >

                  <h3>
                    ✅ Review Submitted
                  </h3>

                  <p>
                    Thank you for sharing your
                    feedback with the instructor.
                  </p>

                  <p>
                    Your rating:{' '}
                    {'★'.repeat(rating)}
                    {'☆'.repeat(5 - rating)}
                  </p>

                </div>

              )}


              {/* Back to dashboard */}

              <div
                style={{
                  marginTop: '20px'
                }}
              >

                <Link
                  className="button"
                  to="/dashboard"
                >
                  Back to dashboard
                </Link>

              </div>

            </div>

          ) : (

            <>

              {/* ==================================
                  MARK COMPLETE
              ================================== */}

              <button
                onClick={finish}
                disabled={
                  isCurrentLessonCompleted ||
                  finishing
                }
              >

                {finishing
                  ? 'Saving...'
                  : isCurrentLessonCompleted
                    ? 'Completed ✓'
                    : 'Mark lesson complete'}

              </button>


              {/* ==================================
                  NEXT LESSON
              ================================== */}

              {isCurrentLessonCompleted &&
                nextLesson && (

                  <button
                    style={{
                      marginLeft: '10px'
                    }}
                    onClick={() =>
                      setActive(
                        nextLesson
                      )
                    }
                  >
                    Next lesson →
                  </button>

                )}

            </>

          )}

        </section>

      </div>

    </Layout>
  )
}