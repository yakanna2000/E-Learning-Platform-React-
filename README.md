# E-Learn — React + Supabase

A modern, responsive online learning platform built with React.js, Vite, and Supabase.

E-Learn allows students to explore courses, enroll in courses, complete lessons, submit assignments, track learning progress, and provide course feedback. Instructors can create courses, add lessons, publish assignments, review student submissions, and view course feedback.

---

## Live Project

Add your deployed Vercel URL here after deployment:

```text
https://your-project-name.vercel.app
```

## GitHub Repository

```text
https://github.com/yakanna2000/E-Learning-Platform-React-
```

---

## Features

### Student Features

* Student registration and login
* Browse published courses
* Search courses by title, category, level, and instructor
* View detailed course information
* Enroll in courses
* View enrolled courses
* Track lesson completion
* View course progress percentage
* Continue learning from the selected lesson
* Complete an entire course
* View assignments
* Submit project URLs
* Add submission notes
* Update assignment submissions
* View submission status
* Submit course ratings and reviews after completion

### Instructor Features

* Instructor registration and login
* Instructor dashboard
* View instructor statistics
* Create new courses
* Add course descriptions and images
* Add lessons to courses
* Set lesson order and duration
* Create assignments
* Set assignment due dates
* View enrolled students
* View student submissions
* Review student projects
* Assign scores from 0 to 100
* Add instructor feedback
* View student course reviews

### General Features

* Responsive design
* Desktop, tablet, and mobile support
* React component-based architecture
* Client-side routing
* Protected routes
* Role-based navigation
* Supabase authentication
* PostgreSQL database
* Row Level Security
* Persistent learning data
* Reusable service functions
* Production build using Vite

---

## Technologies Used

| Technology          | Purpose                                 |
| ------------------- | --------------------------------------- |
| React.js            | Building reusable UI components         |
| Vite                | Development server and production build |
| JavaScript          | Application logic                       |
| JSX                 | Writing React components                |
| CSS3                | Styling and responsive layouts          |
| React Router        | Client-side routing                     |
| Supabase Auth       | User authentication                     |
| Supabase PostgreSQL | Database storage                        |
| Git                 | Version control                         |
| GitHub              | Source-code hosting                     |
| Vercel              | Deployment                              |

---

## Application Architecture

```text
E-Learn
│
├── User Interface
│   ├── React Pages
│   ├── Reusable Components
│   └── Responsive CSS
│
├── Routing
│   └── React Router
│
├── Global State
│   └── React Context API
│
├── Service Layer
│   ├── Course Service
│   └── Learning Service
│
├── Backend
│   └── Supabase
│       ├── Authentication
│       ├── PostgreSQL Database
│       └── Row Level Security
│
└── Deployment
    ├── GitHub
    └── Vercel
```

---

## Project Structure

```text
E_Learning/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── CourseCard.jsx
│   │   ├── Layout.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/
│   │   └── AppContext.jsx
│   │
│   ├── lib/
│   │   ├── courseService.js
│   │   ├── learningService.js
│   │   └── supabase.js
│   │
│   ├── pages/
│   │   ├── AuthPage.jsx
│   │   ├── CoursePage.jsx
│   │   ├── CoursesPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── InstructorPage.jsx
│   │   └── LessonPage.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── extras.css
│   ├── styles.css
│   └── main.jsx
│
├── supabase/
│   └── schema.sql
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

## Page Flow

### Student Flow

```text
Home Page
    ↓
Course Catalog
    ↓
Course Details
    ↓
Register / Login
    ↓
Enroll in Course
    ↓
Student Dashboard
    ↓
Learning Page
    ↓
Complete Lessons
    ↓
Complete Course
    ↓
Submit Course Review
```

### Instructor Flow

```text
Register / Login
    ↓
Instructor Dashboard
    ↓
Create Course
    ↓
Add Lessons
    ↓
Create Assignments
    ↓
View Students
    ↓
View Submissions
    ↓
Review Student Work
    ↓
View Course Feedback
```

---

## Important Components

### Layout Component

The `Layout` component provides the common application structure:

* Header
* Logo
* Navigation
* Authentication actions
* Footer

This avoids duplicating the same header and footer across multiple pages.

### CourseCard Component

The `CourseCard` component displays:

* Course image
* Course category
* Course level
* Course duration
* Course title
* Course description
* Instructor name
* Course details link

### ProtectedRoute Component

`ProtectedRoute` prevents unauthenticated users from accessing private pages such as:

* Student dashboard
* Learning page
* Instructor dashboard
* Course creation page

### AppContext

The application uses React Context API to share:

* Current session
* Current user profile
* User role
* Loading state
* Flash messages

---

## Authentication

Authentication is managed by Supabase Auth.

### Registration

During registration:

1. The user enters their name, email, password, and role.
2. Supabase creates the authentication account.
3. A profile record is created in the `profiles` table.
4. The user can log in using their credentials.

### Login

During login:

1. The user enters their email and password.
2. Supabase validates the credentials.
3. A session is created.
4. The application loads the user profile.
5. The user is redirected according to their role.

### Roles

The application supports two roles:

```text
student
instructor
```

---

## Database Tables

The Supabase database contains the following tables:

```text
profiles
courses
lessons
enrollments
lesson_progress
assignments
submissions
feedback
```

### Profiles

Stores user information.

```text
id
full_name
role
created_at
```

### Courses

Stores course information.

```text
id
instructor_id
instructor_name
title
category
level
description
duration
image_url
published
created_at
```

### Lessons

Stores course lessons.

```text
id
course_id
title
content
duration_minutes
position
```

### Enrollments

Connects students with courses.

```text
id
student_id
course_id
enrolled_at
completed_at
```

### Lesson Progress

Stores completed lessons.

```text
student_id
lesson_id
completed_at
```

### Assignments

Stores instructor-created assignments.

```text
id
course_id
title
description
due_date
created_at
```

### Submissions

Stores student assignment submissions.

```text
id
assignment_id
student_id
project_url
notes
status
score
instructor_feedback
submitted_at
```

### Feedback

Stores student course reviews.

```text
id
course_id
student_id
rating
comment
created_at
```

---

## Learning Progress Calculation

Course progress is calculated using the number of completed lessons.

```text
Progress Percentage =
Completed Lessons / Total Lessons × 100
```

For example:

```text
Total Lessons: 6
Completed Lessons: 3

Progress = 3 / 6 × 100
Progress = 50%
```

When all lessons are completed, the enrollment is marked as completed.

---

## Supabase Setup

### 1. Create a Supabase Project

Open:

```text
https://supabase.com
```

Create a new project.

### 2. Run the Database Schema

Open the Supabase SQL Editor and run:

```text
supabase/schema.sql
```

This creates the required tables, relationships, constraints, and policies.

### 3. Configure Authentication

Open:

```text
Authentication → Providers → Email
```

Enable email authentication.

For local development, email confirmation can be disabled temporarily, or users can confirm their registration email before logging in.

### 4. Configure Environment Variables

Create a local environment file:

```text
.env.local
```

Add:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Never upload `.env.local` to GitHub.

---

## Local Installation

### Clone the Repository

```bash
git clone https://github.com/yakanna2000/E-Learning-Platform-React-.git
```

Move into the project folder:

```bash
cd E-Learning-Platform-React-
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The application will be available at a local URL similar to:

```text
http://localhost:5173
```

---

## Production Build

To create an optimized production build, run:

```bash
npm run build
```

The production files are generated inside:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

---

## Deployment

The application can be deployed using Vercel.

### Deployment Steps

1. Push the project to GitHub.
2. Open Vercel.
3. Import the GitHub repository.
4. Select the Vite framework preset.
5. Add the Supabase environment variables.
6. Deploy the project.

### Vercel Configuration

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Required Vercel Environment Variables

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

After deployment, configure the production URL in Supabase Authentication URL Configuration.

---

## Security

The project uses Supabase Row Level Security to control access to database records.

Examples of access restrictions:

* Students can access their own enrollments.
* Students can update their own lesson progress.
* Students can manage their own submissions.
* Instructors can manage their own courses.
* Instructors can manage lessons belonging to their courses.
* Instructors can review submissions for their courses.
* Instructors can view feedback for their courses.

### Environment File Security

The following files must not be committed to GitHub:

```text
.env
.env.local
.env.*.local
```

The `.gitignore` file should include:

```gitignore
node_modules/
dist/
.env
.env.local
.env.*.local
```

---

## Future Improvements

Possible future improvements include:

* Course video support
* Certificate generation
* Payment integration
* Course categories and advanced filtering
* Search pagination
* Instructor profile pages
* Student profile pages
* Notifications
* Email reminders
* Assignment file uploads
* Course bookmarks
* Discussion forums
* Admin dashboard
* Course completion certificates
* Dark mode
* Automated testing
* Continuous deployment pipeline

---

## Known Limitations

* Course images are currently provided through image URLs.
* Assignment submissions use project URLs instead of direct file uploads.
* Email notifications are not implemented.
* Payment processing is not included.
* The application currently supports student and instructor roles.
* Supabase configuration is required for authentication and persistent data.

---

## Educational Purpose

This project was created for learning and demonstrating:

* React component development
* React Router
* React Context API
* Form handling
* Authentication
* Role-based UI
* CRUD operations
* PostgreSQL relationships
* Supabase integration
* Row Level Security
* Responsive web design
* Git and GitHub workflow
* Vercel deployment

---

## Author

**Yakanna Kadem**

GitHub:

```text
https://github.com/yakanna2000
```

---

## License

This project is intended for educational and portfolio purposes.
