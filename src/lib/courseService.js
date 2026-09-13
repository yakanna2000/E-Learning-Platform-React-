import { supabase } from './supabase'

export const getCourses = async () => {
  return supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
}

export const getCourse = async (id) => {
  return supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()
}

export const getLessons = async (courseId) => {
  return supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('position', { ascending: true })
}

export const createCourse = async (values) => {
  return supabase
    .from('courses')
    .insert(values)
    .select()
    .single()
}

export const createLesson = async (values) => {
  return supabase
    .from('lessons')
    .insert(values)
    .select()
    .single()
}

export const enroll = async (courseId, studentId) => {
  return supabase
    .from('enrollments')
    .insert({
      course_id: courseId,
      student_id: studentId
    })
}

export const getEnrollment = async (courseId, studentId) => {
  return supabase
    .from('enrollments')
    .select('*')
    .eq('course_id', courseId)
    .eq('student_id', studentId)
    .maybeSingle()
}

export const getMyEnrollments = async (studentId) => {
  return supabase
    .from('enrollments')
    .select('*, courses(*)')
    .eq('student_id', studentId)
    .order('enrolled_at', { ascending: false })
}

export const getCompletedLessonIds = async (studentId, ids) => {
  if (!ids.length) {
    return {
      data: [],
      error: null
    }
  }

  const result = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('student_id', studentId)
    .in('lesson_id', ids)

  return {
    data: result.data?.map((x) => x.lesson_id) || [],
    error: result.error
  }
}

export const completeLesson = async (studentId, lessonId) => {
  return supabase
    .from('lesson_progress')
    .upsert({
      student_id: studentId,
      lesson_id: lessonId
    })
}

export const completeEnrollment = async (
  courseId,
  studentId
) => {
  return supabase
    .from('enrollments')
    .update({
      completed_at: new Date().toISOString()
    })
    .eq('course_id', courseId)
    .eq('student_id', studentId)
}