import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useApp } from '../context/AppContext'

export function Layout({ children }) {
  const { session, profile } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const [open, setOpen] = useState(false)

  const signOut = async () => {
    await supabase.auth.signOut()
    setOpen(false)
    navigate('/')
  }

  const closeMenu = () => {
    setOpen(false)
  }

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }

    return location.pathname.startsWith(path)
  }

  return (
    <>
      <header className="site-header">

        {/* Brand */}
        <Link
          className="brand"
          to="/"
          onClick={closeMenu}
          aria-label="E-Learn Home"
        >
          E<span>·</span>Learn
        </Link>


        {/* Mobile Menu Button */}
        <button
          type="button"
          className="menu"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
        >
          {open ? '✕' : '☰'}
        </button>


        {/* Navigation */}
        <nav className={open ? 'open' : ''}>

          <Link
            className={isActive('/courses') ? 'active' : ''}
            to="/courses"
            onClick={closeMenu}
          >
            Courses
          </Link>


          {session && (
            <Link
              className={isActive('/dashboard') ? 'active' : ''}
              to="/dashboard"
              onClick={closeMenu}
            >
              Dashboard
            </Link>
          )}


          {profile?.role === 'instructor' && (
            <Link
              className={isActive('/teach') ? 'active' : ''}
              to="/teach"
              onClick={closeMenu}
            >
              Instructor
            </Link>
          )}


          {session ? (
            <button
              type="button"
              className="text-button"
              onClick={signOut}
            >
              Sign out
            </button>
          ) : (
            <>
              <Link
                className={isActive('/login') ? 'active' : ''}
                to="/login"
                onClick={closeMenu}
              >
                Log in
              </Link>

              <Link
                className="button small nav-cta"
                to="/register"
                onClick={closeMenu}
              >
                Get started
              </Link>
            </>
          )}

        </nav>
      </header>


      {/* Page Content */}
      <main>
        {children}
      </main>


      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">

          <div>
            <Link className="brand footer-brand" to="/">
              E<span>·</span>Learn
            </Link>

            <p>
              Learn with momentum. Build skills. Grow your future.
            </p>
          </div>

          <div className="footer-links">
            <Link to="/courses">
              Courses
            </Link>

            {session && (
              <Link to="/dashboard">
                Dashboard
              </Link>
            )}
          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} E-Learn. All rights reserved.
        </div>
      </footer>
    </>
  )
}