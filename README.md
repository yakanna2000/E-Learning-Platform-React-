# E-Learn — React + Supabase

The app is now a Vite React single-page application with responsive routing, Supabase Authentication, role-aware student/instructor views, published courses, enrollments, and persisted learning data.

## Setup

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in its SQL Editor.
3. Copy `.env.example` to `.env`, then enter your project URL and anon key.
4. Run `npm install` and `npm run dev`.

For a new Supabase project, either turn off email confirmation during local development or confirm the registration email before logging in.

---

# Legacy browser-only project

E-Learn is a responsive, front-end-only learning platform built with HTML5, CSS3, and vanilla JavaScript. It uses `localStorage` as its runtime database, so it needs no Node modules, database, or backend.

## Run the project

1. Open this folder in VS Code or a terminal.
2. Start a local web server (recommended):

   ```powershell
   python -m http.server 8080
   ```

3. Open `http://localhost:8080` in a browser.

Alternatively, open `index.html` directly in a browser. Using a local server gives the most consistent browser storage behaviour.

## First-use walkthrough

1. Select **Get started** and register as a **Student**.
2. Browse a course, select **Enroll**, then open lessons and mark them complete.
3. Submit an assignment with a GitHub/project link and post feedback.
4. Register another account as an **Instructor** to publish a course and review student submissions.

All data is stored per browser. Clearing the site data/local storage resets registrations, progress, submissions, feedback, and courses you created. Seed courses are recreated on the next visit.

## Main files

- `js/storage.js` — reusable LocalStorage data access and initialization
- `js/storage.js` — reusable LocalStorage data access and initialization
- `js/auth.js`, `js/course.js`, `js/lesson.js`, `js/assignment.js`, and `js/feedback.js` — modular page functionality
- `*.html` — the requested page architecture

## Notes

This is an educational front-end project. Passwords are stored locally in plain text because there is no backend; do not use real passwords. Production deployments should use a secure backend, hashed passwords, and server-side authorization.
