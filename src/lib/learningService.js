import { supabase } from './supabase'


// =========================
// GET ALL ASSIGNMENTS
// =========================

export const getAssignments = async () => {
  return supabase
    .from('assignments')
    .select('*, courses(title)')
    .order('due_date', {
      ascending: true
    })
}

export const getStudentAssignments = async (
  courseIds
) => {
  if (!courseIds || courseIds.length === 0) {
    return {
      data: [],
      error: null
    }
  }

  return supabase
    .from('assignments')
    .select('*, courses(title)')
    .in('course_id', courseIds)
    .order('due_date', {
      ascending: true
    })
}

// =========================
// CREATE ASSIGNMENT
// Instructor
// =========================

export const createAssignment = async (values) => {
  return supabase
    .from('assignments')
    .insert(values)
    .select()
    .single()
}


// =========================
// GET STUDENT SUBMISSIONS
// =========================

export const getMySubmissions = async (studentId) => {
  return supabase
    .from('submissions')
    .select('*, assignments(title)')
    .eq('student_id', studentId)
}


// =========================
// SAVE / UPDATE SUBMISSION
// Student
// =========================

export const saveSubmission = async (values) => {
  return supabase
    .from('submissions')
    .upsert(
      values,
      {
        onConflict: 'assignment_id,student_id'
      }
    )
}


// =========================
// GET COURSE FEEDBACK
// =========================

export const getFeedback = async (courseId) => {
  return supabase
    .from('feedback')
    .select('*, profiles(full_name)')
    .eq('course_id', courseId)
    .order('created_at', {
      ascending: false
    })
}


// =========================
// SAVE / UPDATE FEEDBACK
// Student
// =========================

export const saveFeedback = async (values) => {
  return supabase
    .from('feedback')
    .upsert(
      values,
      {
        onConflict: 'course_id,student_id'
      }
    )
}

// =========================
// GET SUBMISSIONS
// Instructor
// =========================

export const getAssignmentSubmissions = async (
  assignmentId
) => {
  return supabase
    .from('submissions')
    .select(`
      *,
      profiles(full_name, id),
      assignments(title)
    `)
    .eq(
      'assignment_id',
      assignmentId
    )
    .order('submitted_at', {
      ascending: false
    })
}


// =========================
// REVIEW SUBMISSION
// Instructor
// =========================

export const reviewSubmission = async (
  submissionId,
  score,
  instructorFeedback
) => {

  return supabase
    .from('submissions')
    .update({
      score: Number(score),
      instructor_feedback:
        instructorFeedback,
      status: 'reviewed'
    })
    .eq('id', submissionId)
}
export const getInstructorFeedback = async (courseIds) => {
  if (!courseIds || courseIds.length === 0) {
    return {
      data: [],
      error: null
    }
  }

  return supabase
    .from('feedback')
    .select(`
      *,
      profiles(full_name),
      courses(title)
    `)
    .in('course_id', courseIds)
    .order('created_at', {
      ascending: false
    })
}



