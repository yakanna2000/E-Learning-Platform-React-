import { Link } from 'react-router-dom'

export function CourseCard({ course }) {
  return (
    <article className="course-catalog-card">

      {/* =====================================================
          COURSE IMAGE
      ===================================================== */}

      <Link
        className="course-card-image"
        to={`/courses/${course.id}`}
        aria-label={`View ${course.title}`}
      >
        <img
          src={
            course.image_url ||
            'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=900'
          }
          alt={course.title}
        />

        <span className="course-card-category">
          {course.category}
        </span>
      </Link>


      {/* =====================================================
          COURSE CONTENT
      ===================================================== */}

      <div className="course-card-body">

        <div className="course-card-meta">
          <span>{course.level}</span>
          <span>•</span>
          <span>{course.duration}</span>
        </div>


        <h3>
          {course.title}
        </h3>


        <p className="course-card-description">
          {course.description}
        </p>


        {/* ===================================================
            INSTRUCTOR
        =================================================== */}

        <div className="course-card-instructor">

          <div className="course-card-avatar">
            {(
              course.instructor_name ||
              'I'
            )
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <span>Instructor</span>

            <strong>
              {course.instructor_name}
            </strong>
          </div>

        </div>


        {/* ===================================================
            ACTION
        =================================================== */}

        <Link
          className="course-card-action"
          to={`/courses/${course.id}`}
        >
          View course

          <span>→</span>
        </Link>

      </div>

    </article>
  )
}