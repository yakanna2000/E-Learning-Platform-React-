import { Navigate, Route, Routes } from "react-router-dom";

import { HomePage } from "../pages/HomePage";
import { CoursesPage } from "../pages/CoursesPage";
import { AuthPage } from "../pages/AuthPage";
import { CoursePage } from "../pages/CoursePage";
import { DashboardPage } from "../pages/DashboardPage";
import { InstructorPage } from "../pages/InstructorPage";
import { InstructorCourseEditPage } from "../pages/InstructorCourseEditPage";
import { LessonPage } from "../pages/LessonPage";

import { ProtectedRoute } from "../components/ProtectedRoute";
import { Layout } from "../components/Layout";

import { InstructorSubmissionsPage } from "../pages/InstructorSubmissionsPage";

export function AppRoutes() {
  return (
    <Routes>
      {/* =========================
          HOME
      ========================= */}

      <Route path="/" element={<HomePage />} />

      {/* =========================
          COURSE CATALOG
      ========================= */}

      <Route
        path="/courses"
        element={
          <Layout>
            <CoursesPage />
          </Layout>
        }
      />

      {/* =========================
          COURSE DETAILS
      ========================= */}

      <Route path="/courses/:id" element={<CoursePage />} />

      {/* =========================
          LOGIN
      ========================= */}

      <Route path="/login" element={<AuthPage />} />

      {/* =========================
          REGISTER
      ========================= */}

      <Route path="/register" element={<AuthPage register />} />

      {/* =========================
          DASHBOARD
          Student + Instructor
      ========================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* =========================
          STUDENT LEARNING
      ========================= */}

      <Route
        path="/learn/:courseId"
        element={
          <ProtectedRoute role="student">
            <LessonPage />
          </ProtectedRoute>
        }
      />

      {/* =========================
          INSTRUCTOR
          CREATE COURSE
      ========================= */}

      <Route
        path="/teach"
        element={
          <ProtectedRoute role="instructor">
            <InstructorPage />
          </ProtectedRoute>
        }
      />

      {/* =========================
          INSTRUCTOR
          EDIT COURSE
          
          Add:
          - Lessons
          - Assignments
      ========================= */}

      <Route
        path="/teach/courses/:courseId/edit"
        element={
          <ProtectedRoute role="instructor">
            <InstructorCourseEditPage />
          </ProtectedRoute>
        }
      />

      {/* =========================
          UNKNOWN ROUTES
      ========================= */}

      <Route path="*" element={<Navigate to="/" replace />} />

      <Route
        path="/teach/assignments/:assignmentId/submissions"
        element={
          <ProtectedRoute role="instructor">
            <InstructorSubmissionsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
