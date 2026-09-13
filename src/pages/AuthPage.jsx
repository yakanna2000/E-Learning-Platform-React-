import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { supabase, isConfigured } from '../lib/supabase'
import { useApp } from '../context/AppContext'

export function AuthPage({ register = false }) {
  const { session, flash } = useApp()
  const nav = useNavigate()

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'student'
  })

  const [busy, setBusy] = useState(false)

  if (session) {
    return <Navigate to="/dashboard" />
  }

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const submit = async (e) => {
    e.preventDefault()

    if (!isConfigured) {
      return flash(
        'Set the Supabase URL and anon key in .env first.'
      )
    }

    setBusy(true)

    const result = register
      ? await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.full_name,
              role: form.role
            }
          }
        })
      : await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password
        })

    setBusy(false)

    if (result.error) {
      return flash(result.error.message)
    }

    if (register) {
      flash(
        'Account created. Confirm your email, then log in.'
      )
    } else {
      nav('/dashboard')
    }
  }

  return (
    <main className="auth-page">

      {/* ==========================================
          AUTH VISUAL PANEL
      ========================================== */}

      <section className="auth-visual">

        <Link
          className="auth-logo"
          to="/"
        >
          E<span>·</span>Learn
        </Link>

        <div className="auth-visual-content">

          <span className="auth-visual-label">
            LEARN. BUILD. GROW.
          </span>

          <h1>
            Turn your curiosity
            <br />
            into <span>real skills.</span>
          </h1>

          <p>
            Learn from practical courses, build
            projects and grow your skills with
            E-Learn.
          </p>

        </div>

        <div className="auth-visual-footer">
          <span>●</span>
          Learn with momentum.
        </div>

      </section>


      {/* ==========================================
          AUTH FORM
      ========================================== */}

      <section className="auth-form-panel">

        <div className="auth-form-container">

          <div className="auth-mobile-logo">
            <Link
              className="auth-logo"
              to="/"
            >
              E<span>·</span>Learn
            </Link>
          </div>


          {/* HEADER */}

          <div className="auth-heading">

            <span className="auth-eyebrow">
              {register
                ? 'CREATE ACCOUNT'
                : 'WELCOME BACK'}
            </span>

            <h2>
              {register
                ? 'Start learning today'
                : 'Log in to E-Learn'}
            </h2>

            <p>
              {register
                ? 'Create your account and start building your skills.'
                : 'Welcome back. Enter your details to continue learning.'}
            </p>

          </div>


          {/* FORM */}

          <form
            className="auth-form"
            onSubmit={submit}
          >

            {/* FULL NAME */}

            {register && (
              <label className="auth-field">

                <span>Full name</span>

                <input
                  name="full_name"
                  required
                  minLength="2"
                  value={form.full_name}
                  onChange={change}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />

              </label>
            )}


            {/* ACCOUNT TYPE */}

            {register && (
              <label className="auth-field">

                <span>Account type</span>

                <select
                  name="role"
                  value={form.role}
                  onChange={change}
                >
                  <option value="student">
                    Student
                  </option>

                  <option value="instructor">
                    Instructor
                  </option>
                </select>

              </label>
            )}


            {/* EMAIL */}

            <label className="auth-field">

              <span>Email address</span>

              <input
                name="email"
                required
                type="email"
                value={form.email}
                onChange={change}
                placeholder="you@example.com"
                autoComplete="email"
              />

            </label>


            {/* PASSWORD */}

            <label className="auth-field">

              <span>Password</span>

              <input
                name="password"
                required
                minLength="6"
                type="password"
                value={form.password}
                onChange={change}
                placeholder="Enter your password"
                autoComplete={
                  register
                    ? 'new-password'
                    : 'current-password'
                }
              />

            </label>


            {/* SUBMIT */}

            <button
              type="submit"
              className="auth-submit"
              disabled={busy}
            >
              {busy
                ? 'Please wait…'
                : register
                  ? 'Create account'
                  : 'Log in'}
            </button>

          </form>


          {/* SWITCH LOGIN / REGISTER */}

          <div className="auth-switch">

            <span>
              {register
                ? 'Already registered?'
                : 'New here?'}
            </span>

            <Link
              to={
                register
                  ? '/login'
                  : '/register'
              }
            >
              {register
                ? 'Log in'
                : 'Create an account'}
            </Link>

          </div>


          {/* FOOTER */}

          <p className="auth-security">
            Your account information is securely
            handled by E-Learn.
          </p>

        </div>

      </section>

    </main>
  )
}