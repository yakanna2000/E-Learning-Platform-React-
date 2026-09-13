-- Run this once in Supabase SQL Editor before starting the app.

create table public.profiles (
    id uuid primary key references auth.users on delete cascade,
    full_name text not null,
    role text not null default 'student'
        check (role in ('student', 'instructor')),
    created_at timestamptz default now()
);

create table public.courses (
    id uuid primary key default gen_random_uuid(),
    instructor_id uuid references public.profiles(id) on delete cascade not null,
    instructor_name text not null,
    title text not null,
    category text not null,
    level text not null,
    description text not null,
    duration text not null default '6 hours',
    image_url text,
    published boolean default true,
    created_at timestamptz default now()
);

create table public.lessons (
    id uuid primary key default gen_random_uuid(),
    course_id uuid references public.courses(id) on delete cascade not null,
    title text not null,
    content text,
    duration_minutes integer default 10,
    position integer not null
);

create table public.enrollments (
    id uuid primary key default gen_random_uuid(),
    student_id uuid references public.profiles(id) on delete cascade not null,
    course_id uuid references public.courses(id) on delete cascade not null,
    enrolled_at timestamptz default now(),
    completed_at timestamptz,
    unique(student_id, course_id)
);

create table public.lesson_progress (
    student_id uuid references public.profiles(id) on delete cascade,
    lesson_id uuid references public.lessons(id) on delete cascade,
    completed_at timestamptz default now(),
    primary key(student_id, lesson_id)
);

create table public.assignments (
    id uuid primary key default gen_random_uuid(),
    course_id uuid references public.courses(id) on delete cascade not null,
    title text not null,
    description text not null,
    due_date date,
    created_at timestamptz default now()
);

create table public.submissions (
    id uuid primary key default gen_random_uuid(),
    assignment_id uuid references public.assignments(id) on delete cascade not null,
    student_id uuid references public.profiles(id) on delete cascade not null,
    project_url text not null,
    notes text,
    status text not null default 'submitted',
    score integer check (score between 0 and 100),
    instructor_feedback text,
    submitted_at timestamptz default now(),
    unique(assignment_id, student_id)
);

create table public.feedback (
    id uuid primary key default gen_random_uuid(),
    course_id uuid references public.courses(id) on delete cascade not null,
    student_id uuid references public.profiles(id) on delete cascade not null,
    rating integer not null check (rating between 1 and 5),
    comment text not null,
    created_at timestamptz default now(),
    unique(course_id, student_id)
);

-- Enable Row Level Security

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;
alter table public.feedback enable row level security;

-- Profiles policies

create policy "profiles readable"
on public.profiles
for select
using (true);

create policy "own profile"
on public.profiles
for update
using (auth.uid() = id);

-- Courses policies

create policy "published courses readable"
on public.courses
for select
using (published or instructor_id = auth.uid());

create policy "instructors create courses"
on public.courses
for insert
with check (
    instructor_id = auth.uid()
    and
    (select role from public.profiles where id = auth.uid()) = 'instructor'
);

-- Lessons

create policy "lessons readable"
on public.lessons
for select
using (true);

-- Enrollments

create policy "students own enrollments"
on public.enrollments
for all
using (student_id = auth.uid())
with check (student_id = auth.uid());

-- Lesson progress

create policy "students own progress"
on public.lesson_progress
for all
using (student_id = auth.uid())
with check (student_id = auth.uid());

-- Assignments

create policy "assignments readable"
on public.assignments
for select
using (true);

-- Submissions

create policy "students own submissions"
on public.submissions
for all
using (student_id = auth.uid())
with check (student_id = auth.uid());

-- Feedback

create policy "feedback readable"
on public.feedback
for select
using (true);

create policy "students own feedback"
on public.feedback
for all
using (student_id = auth.uid())
with check (student_id = auth.uid());

-- Automatically create a profile when a user registers

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (
        id,
        full_name,
        role
    )
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', 'Learner'),
        coalesce(new.raw_user_meta_data->>'role', 'student')
    );

    return new;
end;
$$;

-- Trigger

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();