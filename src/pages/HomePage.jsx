import { Link } from 'react-router-dom'
import { CourseCatalog } from './CoursesPage'
import { Layout } from '../components/Layout'

export function HomePage() {
  return (
    <Layout>

      {/* =====================================================
          HERO SECTION
          ===================================================== */}

      <section className="home-hero">

        <div className="home-hero-content">

          <p className="home-hero-label">
            LEARNING THAT FITS YOUR LIFE
          </p>

          <h1>
            Build skills you’ll
            <span> actually use.</span>
          </h1>

          <p className="home-hero-description">
            Structured courses, meaningful practice, and a learning
            record that stays with you.
          </p>

          <div className="home-hero-actions">
            <Link
              className="button home-primary-button"
              to="/courses"
            >
              Explore courses
              <span>→</span>
            </Link>

            <Link
              className="home-secondary-button"
              to="/register"
            >
              Start learning
            </Link>
          </div>

          <div className="home-hero-trust">

            <div className="home-trust-item">
              <strong>6+</strong>
              <span>Hours of learning</span>
            </div>

            <div className="home-trust-divider"></div>

            <div className="home-trust-item">
              <strong>Practical</strong>
              <span>Skill-focused courses</span>
            </div>

            <div className="home-trust-divider"></div>

            <div className="home-trust-item">
              <strong>∞</strong>
              <span>Room to grow</span>
            </div>

          </div>

        </div>

        {/* ===================================================
            HERO VISUAL
            =================================================== */}

        <div className="home-hero-visual">

          <div className="home-hero-glow"></div>

          <div className="home-learning-card">

            <div className="home-learning-top">
              <span className="home-learning-dot"></span>

              <span>
                YOUR LEARNING JOURNEY
              </span>
            </div>

            <div className="home-learning-icon">
              E
            </div>

            <h3>
              Learn. Practice. Grow.
            </h3>

            <p>
              Turn consistent learning into real skills.
            </p>

            <div className="home-progress">

              <div className="home-progress-label">
                <span>Learning progress</span>
                <strong>75%</strong>
              </div>

              <div className="home-progress-track">
                <div className="home-progress-bar"></div>
              </div>

            </div>

            <div className="home-learning-footer">
              <span>Keep moving forward</span>
              <span>↗</span>
            </div>

          </div>

          

        
        </div>

      </section>


      {/* =====================================================
          VALUE SECTION
          ===================================================== */}

      <section className="home-value-section">

        <div className="home-section-heading">

          <p className="home-section-label">
            WHY E-LEARN
          </p>

          <h2>
            Everything you need to keep learning.
          </h2>

          <p>
            A simple learning experience designed around progress,
            practice, and useful skills.
          </p>

        </div>

        <div className="home-value-grid">

          <article className="home-value-card">

            <div className="home-value-icon">
              01
            </div>

            <h3>
              Structured learning
            </h3>

            <p>
              Follow clear lessons that help you move from fundamentals
              to practical knowledge.
            </p>

          </article>

          <article className="home-value-card">

            <div className="home-value-icon">
              02
            </div>

            <h3>
              Practice your skills
            </h3>

            <p>
              Learn by doing with meaningful practice and assignments
              that reinforce your understanding.
            </p>

          </article>

          <article className="home-value-card">

            <div className="home-value-icon">
              03
            </div>

            <h3>
              Track your progress
            </h3>

            <p>
              Keep your learning progress, course completion, and
              achievements in one place.
            </p>

          </article>

        </div>

      </section>


      {/* =====================================================
          COURSE CATALOG
          ===================================================== */}

      <CourseCatalog short />


      {/* =====================================================
          FINAL CTA
          ===================================================== */}

      <section className="home-final-cta">

        <div>

          <p className="home-section-label">
            READY TO START?
          </p>

          <h2>
            Your next skill starts here.
          </h2>

          <p>
            Choose a course, start learning, and keep building momentum.
          </p>

        </div>

        <Link
          className="button home-cta-button"
          to="/courses"
        >
          Explore courses
          <span>→</span>
        </Link>

      </section>

    </Layout>
  )
}