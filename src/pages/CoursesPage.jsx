import { useEffect, useState } from 'react'
import { CourseCard } from '../components/CourseCard'
import { getCourses } from '../lib/courseService'
import { isConfigured } from '../lib/supabase'

export function CourseCatalog({ short = false }) {
  const [courses, setCourses] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadCourses() {
      if (!isConfigured) {
        setError('Supabase is not configured.')
        setLoading(false)
        return
      }

      const { data, error } = await getCourses()

      if (!mounted) return

      if (error) {
        console.error('Error loading courses:', error)
        setError(error.message)
        setCourses([])
      } else {
        setCourses(data || [])
      }

      setLoading(false)
    }

    loadCourses()

    return () => {
      mounted = false
    }
  }, [])

  const list = courses
    .filter((course) => {
      const searchText = `
        ${course.title || ''}
        ${course.category || ''}
        ${course.instructor_name || ''}
        ${course.level || ''}
      `.toLowerCase()

      return searchText.includes(query.toLowerCase())
    })
    .slice(0, short ? 3 : undefined)

  return (
    <section className="course-catalog">
      <div className="course-catalog-header">

        <div>
          <p className="course-catalog-label">
            COURSE CATALOG
          </p>

          <h2>
            Find your next challenge
          </h2>

          <p className="course-catalog-subtitle">
            Explore courses, build practical skills, and keep learning.
          </p>
        </div>

        {!short && (
          <div className="course-search-wrapper">
            <span className="course-search-icon">
              🔍
            </span>

            <input
              className="course-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses..."
              aria-label="Search courses"
            />

            {query && (
              <button
                type="button"
                className="course-search-clear"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        )}

      </div>

      {loading && (
        <div className="course-catalog-loading">
          <div className="course-catalog-spinner"></div>

          <p>
            Loading courses...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="course-catalog-empty">
          <div className="course-catalog-empty-icon">
            !
          </div>

          <h3>
            Unable to load courses
          </h3>

          <p>
            {error}
          </p>
        </div>
      )}

      {!loading && !error && list.length === 0 && (
        <div className="course-catalog-empty">
          <div className="course-catalog-empty-icon">
            📚
          </div>

          <h3>
            No courses found
          </h3>

          <p>
            {query
              ? `No courses match "${query}". Try another search.`
              : 'No courses are available yet.'}
          </p>

          {query && (
            <button
              type="button"
              className="course-catalog-clear-button"
              onClick={() => setQuery('')}
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {!loading && !error && list.length > 0 && (
        <div className="course-catalog-grid">
          {list.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
            />
          ))}
        </div>
      )}

    </section>
  )
}

export function CoursesPage() {
  return <CourseCatalog />
}