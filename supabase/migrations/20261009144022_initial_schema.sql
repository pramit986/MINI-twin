-- Supabase Schema Migration: Initial Schema
-- Generated automatically

CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TABLE IF NOT EXISTS public.profiles (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  name text, dob date, sex_for_calc text, timezone text, life_stage text, status text, onboarding_step integer, onboarding_done boolean, units text default 'metric', locale text default 'en', regreter_tone text, regreter_paused_until timestamp with time zone
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own profiles" ON public.profiles;
CREATE POLICY "Users can manage their own profiles" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.health_profiles (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  height_cm numeric, activity_level text, goal text, diet_type text, allergies text[], experience text, workout_days integer, equipment text, injuries text, conditions text[], wake_time time, bedtime time, sleep_hours numeric, target_protein_g numeric, target_water_ml numeric, target_kcal numeric, targets_overridden boolean
);
ALTER TABLE public.health_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own health_profiles" ON public.health_profiles;
CREATE POLICY "Users can manage their own health_profiles" ON public.health_profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.body_metrics (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  date date not null, weight_kg numeric, bmi numeric, bmi_percentile numeric, category text
);
ALTER TABLE public.body_metrics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own body_metrics" ON public.body_metrics;
CREATE POLICY "Users can manage their own body_metrics" ON public.body_metrics FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_body_metrics_date ON public.body_metrics(user_id, date);

CREATE TABLE IF NOT EXISTS public.academic_profiles (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  institution text, program text, branch text, specialization text, current_year integer, current_semester integer, grad_year integer, grading_system text, current_gpa numeric, target_gpa numeric, attendance_min_default numeric, daily_study_hours numeric, workload text, primary_goal text, backlogs_count integer, board text, class_level text, stream text
);
ALTER TABLE public.academic_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own academic_profiles" ON public.academic_profiles;
CREATE POLICY "Users can manage their own academic_profiles" ON public.academic_profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.subjects (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  name text, code text, credits numeric, difficulty integer, importance integer, attendance_min numeric, baseline_attended integer, baseline_total integer, is_backlog boolean
);
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own subjects" ON public.subjects;
CREATE POLICY "Users can manage their own subjects" ON public.subjects FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.timetable_slots (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  subject_id uuid references subjects(id) on delete cascade, weekday integer, start_time time, end_time time, room text
);
ALTER TABLE public.timetable_slots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own timetable_slots" ON public.timetable_slots;
CREATE POLICY "Users can manage their own timetable_slots" ON public.timetable_slots FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.attendance (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  subject_id uuid references subjects(id) on delete cascade, date date, status text
);
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own attendance" ON public.attendance;
CREATE POLICY "Users can manage their own attendance" ON public.attendance FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(user_id, date);

CREATE TABLE IF NOT EXISTS public.assignments (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  subject_id uuid references subjects(id) on delete cascade, title text, due_at timestamp with time zone, est_minutes integer, progress_pct integer, status text
);
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own assignments" ON public.assignments;
CREATE POLICY "Users can manage their own assignments" ON public.assignments FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.exams (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  subject_id uuid references subjects(id) on delete cascade, title text, date date, weight numeric, readiness_pct integer
);
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own exams" ON public.exams;
CREATE POLICY "Users can manage their own exams" ON public.exams FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.grades (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  subject_id uuid references subjects(id) on delete cascade, term text, component text, score numeric, max_score numeric
);
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own grades" ON public.grades;
CREATE POLICY "Users can manage their own grades" ON public.grades FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.tasks (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  title text, category text, priority text, due_at timestamp with time zone, est_minutes integer, progress_pct integer, status text, postponed_count integer, linked_assignment_id uuid references assignments(id) on delete set null, depends_on uuid[]
);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own tasks" ON public.tasks;
CREATE POLICY "Users can manage their own tasks" ON public.tasks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.study_sessions (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  subject_id uuid references subjects(id) on delete cascade, task_id uuid references tasks(id) on delete set null, started_at timestamp with time zone, minutes integer, focus_rating integer
);
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own study_sessions" ON public.study_sessions;
CREATE POLICY "Users can manage their own study_sessions" ON public.study_sessions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.task_plans (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  task_id uuid references tasks(id) on delete cascade, wish text, obstacle text, if_then text
);
ALTER TABLE public.task_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own task_plans" ON public.task_plans;
CREATE POLICY "Users can manage their own task_plans" ON public.task_plans FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.habits (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  name text, frequency text, target integer
);
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own habits" ON public.habits;
CREATE POLICY "Users can manage their own habits" ON public.habits FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.habit_logs (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  habit_id uuid references habits(id) on delete cascade, date date, completed boolean, value numeric
);
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own habit_logs" ON public.habit_logs;
CREATE POLICY "Users can manage their own habit_logs" ON public.habit_logs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON public.habit_logs(user_id, date);

CREATE TABLE IF NOT EXISTS public.workouts (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  date date, name text, duration_min integer
);
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own workouts" ON public.workouts;
CREATE POLICY "Users can manage their own workouts" ON public.workouts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON public.workouts(user_id, date);

CREATE TABLE IF NOT EXISTS public.workout_exercises (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  workout_id uuid references workouts(id) on delete cascade, exercise_name text, order_idx integer
);
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own workout_exercises" ON public.workout_exercises;
CREATE POLICY "Users can manage their own workout_exercises" ON public.workout_exercises FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.workout_sets (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  exercise_id uuid references workout_exercises(id) on delete cascade, reps integer, weight_kg numeric, rpe numeric, order_idx integer
);
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own workout_sets" ON public.workout_sets;
CREATE POLICY "Users can manage their own workout_sets" ON public.workout_sets FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.foods (
  id uuid default gen_random_uuid() primary key, name text, local_name text, category text, kcal_100g numeric, protein_100g numeric, carbs_100g numeric, fat_100g numeric, fiber_100g numeric, source text, license_note text, verified boolean
);
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.foods;
CREATE POLICY "Allow read access to authenticated users" ON public.foods FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.food_portions (
  id uuid default gen_random_uuid() primary key, food_id uuid references foods(id) on delete cascade, label text, grams numeric
);
ALTER TABLE public.food_portions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.food_portions;
CREATE POLICY "Allow read access to authenticated users" ON public.food_portions FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.meals (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  date date, meal_type text, logged_at timestamp with time zone
);
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own meals" ON public.meals;
CREATE POLICY "Users can manage their own meals" ON public.meals FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_meals_date ON public.meals(user_id, date);

CREATE TABLE IF NOT EXISTS public.meal_items (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  meal_id uuid references meals(id) on delete cascade, food_id uuid references foods(id) on delete set null, name text, quantity numeric, unit text, grams numeric, kcal numeric, protein_g numeric, carbs_g numeric, fat_g numeric, is_estimate boolean, confidence numeric
);
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own meal_items" ON public.meal_items;
CREATE POLICY "Users can manage their own meal_items" ON public.meal_items FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.water_logs (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  ml integer, logged_at timestamp with time zone
);
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own water_logs" ON public.water_logs;
CREATE POLICY "Users can manage their own water_logs" ON public.water_logs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.sleep_logs (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  date date, bedtime timestamp with time zone, wake timestamp with time zone, hours numeric, quality text
);
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own sleep_logs" ON public.sleep_logs;
CREATE POLICY "Users can manage their own sleep_logs" ON public.sleep_logs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_date ON public.sleep_logs(user_id, date);

CREATE TABLE IF NOT EXISTS public.mood_checkins (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  date date, mood text, energy text
);
ALTER TABLE public.mood_checkins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own mood_checkins" ON public.mood_checkins;
CREATE POLICY "Users can manage their own mood_checkins" ON public.mood_checkins FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_mood_checkins_date ON public.mood_checkins(user_id, date);

CREATE TABLE IF NOT EXISTS public.income_sources (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  name text, amount numeric, frequency text
);
ALTER TABLE public.income_sources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own income_sources" ON public.income_sources;
CREATE POLICY "Users can manage their own income_sources" ON public.income_sources FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.expenses (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  date date, amount numeric, category text, note text
);
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own expenses" ON public.expenses;
CREATE POLICY "Users can manage their own expenses" ON public.expenses FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(user_id, date);

CREATE TABLE IF NOT EXISTS public.subscriptions (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  name text, amount numeric, due_day integer
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can manage their own subscriptions" ON public.subscriptions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.budgets (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  month date, amount numeric
);
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own budgets" ON public.budgets;
CREATE POLICY "Users can manage their own budgets" ON public.budgets FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.savings_goals (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  name text, amount numeric, deadline date
);
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own savings_goals" ON public.savings_goals;
CREATE POLICY "Users can manage their own savings_goals" ON public.savings_goals FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.holdings (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  type text, symbol_or_scheme_code text, name text, units numeric, avg_buy_price numeric, invested_amount numeric, manual_current_value numeric
);
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own holdings" ON public.holdings;
CREATE POLICY "Users can manage their own holdings" ON public.holdings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.sips (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  holding_id uuid references holdings(id) on delete cascade, amount numeric, day_of_month integer, active boolean
);
ALTER TABLE public.sips ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own sips" ON public.sips;
CREATE POLICY "Users can manage their own sips" ON public.sips FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.price_cache (
  symbol_or_scheme_code text primary key, price numeric, as_of timestamp with time zone, source text
);
ALTER TABLE public.price_cache ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.price_cache;
CREATE POLICY "Allow read access to authenticated users" ON public.price_cache FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.career_profiles (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  target_role text, placement_status text
);
ALTER TABLE public.career_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own career_profiles" ON public.career_profiles;
CREATE POLICY "Users can manage their own career_profiles" ON public.career_profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.skills (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  name text, level text, required_level text
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own skills" ON public.skills;
CREATE POLICY "Users can manage their own skills" ON public.skills FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.certifications (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  name text, issuer text, date_obtained date
);
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own certifications" ON public.certifications;
CREATE POLICY "Users can manage their own certifications" ON public.certifications FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.projects (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  name text, description text, url text
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own projects" ON public.projects;
CREATE POLICY "Users can manage their own projects" ON public.projects FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.goals (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  category text, title text, target numeric, unit text, progress numeric, deadline date, hours_per_week numeric
);
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own goals" ON public.goals;
CREATE POLICY "Users can manage their own goals" ON public.goals FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.regret_events (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  trigger text, tone text, content_level text, shown_at timestamp with time zone, dismissed boolean, acted_on boolean, outcome text, task_id uuid references tasks(id) on delete set null
);
ALTER TABLE public.regret_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own regret_events" ON public.regret_events;
CREATE POLICY "Users can manage their own regret_events" ON public.regret_events FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.notifications (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  type text, title text, body text, read_at timestamp with time zone, channel text
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own notifications" ON public.notifications;
CREATE POLICY "Users can manage their own notifications" ON public.notifications FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.reminder_prefs (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  type text, enabled boolean
);
ALTER TABLE public.reminder_prefs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own reminder_prefs" ON public.reminder_prefs;
CREATE POLICY "Users can manage their own reminder_prefs" ON public.reminder_prefs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.ai_consent_log (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  feature text, categories text[], payload_hash text, approved_at timestamp with time zone, model text, status text
);
ALTER TABLE public.ai_consent_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own ai_consent_log" ON public.ai_consent_log;
CREATE POLICY "Users can manage their own ai_consent_log" ON public.ai_consent_log FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.ai_conversations (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  title text
);
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own ai_conversations" ON public.ai_conversations;
CREATE POLICY "Users can manage their own ai_conversations" ON public.ai_conversations FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.ai_messages (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  conversation_id uuid references ai_conversations(id) on delete cascade, role text, content text
);
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own ai_messages" ON public.ai_messages;
CREATE POLICY "Users can manage their own ai_messages" ON public.ai_messages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.guardian_links (
  student_id uuid not null references auth.users(id) on delete cascade, guardian_user_id uuid not null references auth.users(id) on delete cascade, status text, scopes jsonb, consent_recorded_at timestamp with time zone, expires_at timestamp with time zone, id uuid default gen_random_uuid() primary key
);
ALTER TABLE public.guardian_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Student can view and manage their links" ON public.guardian_links;
CREATE POLICY "Student can view and manage their links" ON public.guardian_links FOR ALL TO authenticated USING (auth.uid() = student_id);
DROP POLICY IF EXISTS "Guardian can view their links" ON public.guardian_links;
CREATE POLICY "Guardian can view their links" ON public.guardian_links FOR SELECT TO authenticated USING (auth.uid() = guardian_user_id);

CREATE TABLE IF NOT EXISTS public.account_deletion_requests (

  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
,
  status text
);
ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own account_deletion_requests" ON public.account_deletion_requests;
CREATE POLICY "Users can manage their own account_deletion_requests" ON public.account_deletion_requests FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

