const fs = require('fs');

const baseCols = `
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
`;

const tables = [
  { name: 'profiles', extraCols: "name text, dob date, sex_for_calc text, timezone text, life_stage text, status text, onboarding_step integer, onboarding_done boolean, units text default 'metric', locale text default 'en', regreter_tone text, regreter_paused_until timestamp with time zone", omitUserId: false },
  { name: 'health_profiles', extraCols: "height_cm numeric, activity_level text, goal text, diet_type text, allergies text[], experience text, workout_days integer, equipment text, injuries text, conditions text[], wake_time time, bedtime time, sleep_hours numeric, target_protein_g numeric, target_water_ml numeric, target_kcal numeric, targets_overridden boolean" },
  { name: 'body_metrics', extraCols: "date date not null, weight_kg numeric, bmi numeric, bmi_percentile numeric, category text", indexes: ['date'] },
  { name: 'academic_profiles', extraCols: "institution text, program text, branch text, specialization text, current_year integer, current_semester integer, grad_year integer, grading_system text, current_gpa numeric, target_gpa numeric, attendance_min_default numeric, daily_study_hours numeric, workload text, primary_goal text, backlogs_count integer, board text, class_level text, stream text" },
  { name: 'subjects', extraCols: "name text, code text, credits numeric, difficulty integer, importance integer, attendance_min numeric, baseline_attended integer, baseline_total integer, is_backlog boolean" },
  { name: 'timetable_slots', extraCols: "subject_id uuid references subjects(id) on delete cascade, weekday integer, start_time time, end_time time, room text" },
  { name: 'attendance', extraCols: "subject_id uuid references subjects(id) on delete cascade, date date, status text", indexes: ['date'] },
  { name: 'assignments', extraCols: "subject_id uuid references subjects(id) on delete cascade, title text, due_at timestamp with time zone, est_minutes integer, progress_pct integer, status text" },
  { name: 'exams', extraCols: "subject_id uuid references subjects(id) on delete cascade, title text, date date, weight numeric, readiness_pct integer" },
  { name: 'grades', extraCols: "subject_id uuid references subjects(id) on delete cascade, term text, component text, score numeric, max_score numeric" },
  { name: 'tasks', extraCols: "title text, category text, priority text, due_at timestamp with time zone, est_minutes integer, progress_pct integer, status text, postponed_count integer, linked_assignment_id uuid references assignments(id) on delete set null, depends_on uuid[]" },
  { name: 'study_sessions', extraCols: "subject_id uuid references subjects(id) on delete cascade, task_id uuid references tasks(id) on delete set null, started_at timestamp with time zone, minutes integer, focus_rating integer" },
  { name: 'task_plans', extraCols: "task_id uuid references tasks(id) on delete cascade, wish text, obstacle text, if_then text" },
  { name: 'habits', extraCols: "name text, frequency text, target integer" },
  { name: 'habit_logs', extraCols: "habit_id uuid references habits(id) on delete cascade, date date, completed boolean, value numeric", indexes: ['date'] },
  { name: 'workouts', extraCols: "date date, name text, duration_min integer", indexes: ['date'] },
  { name: 'workout_exercises', extraCols: "workout_id uuid references workouts(id) on delete cascade, exercise_name text, order_idx integer" },
  { name: 'workout_sets', extraCols: "exercise_id uuid references workout_exercises(id) on delete cascade, reps integer, weight_kg numeric, rpe numeric, order_idx integer" },
  { name: 'foods', extraCols: "id uuid default gen_random_uuid() primary key, name text, local_name text, category text, kcal_100g numeric, protein_100g numeric, carbs_100g numeric, fat_100g numeric, fiber_100g numeric, source text, license_note text, verified boolean", omitUserId: true },
  { name: 'food_portions', extraCols: "id uuid default gen_random_uuid() primary key, food_id uuid references foods(id) on delete cascade, label text, grams numeric", omitUserId: true },
  { name: 'meals', extraCols: "date date, meal_type text, logged_at timestamp with time zone", indexes: ['date'] },
  { name: 'meal_items', extraCols: "meal_id uuid references meals(id) on delete cascade, food_id uuid references foods(id) on delete set null, name text, quantity numeric, unit text, grams numeric, kcal numeric, protein_g numeric, carbs_g numeric, fat_g numeric, is_estimate boolean, confidence numeric" },
  { name: 'water_logs', extraCols: "ml integer, logged_at timestamp with time zone" },
  { name: 'sleep_logs', extraCols: "date date, bedtime timestamp with time zone, wake timestamp with time zone, hours numeric, quality text", indexes: ['date'] },
  { name: 'mood_checkins', extraCols: "date date, mood text, energy text", indexes: ['date'] },
  { name: 'income_sources', extraCols: "name text, amount numeric, frequency text" },
  { name: 'expenses', extraCols: "date date, amount numeric, category text, note text", indexes: ['date'] },
  { name: 'subscriptions', extraCols: "name text, amount numeric, due_day integer" },
  { name: 'budgets', extraCols: "month date, amount numeric" },
  { name: 'savings_goals', extraCols: "name text, amount numeric, deadline date" },
  { name: 'holdings', extraCols: "type text, symbol_or_scheme_code text, name text, units numeric, avg_buy_price numeric, invested_amount numeric, manual_current_value numeric" },
  { name: 'sips', extraCols: "holding_id uuid references holdings(id) on delete cascade, amount numeric, day_of_month integer, active boolean" },
  { name: 'price_cache', extraCols: "symbol_or_scheme_code text primary key, price numeric, as_of timestamp with time zone, source text", omitUserId: true },
  { name: 'career_profiles', extraCols: "target_role text, placement_status text" },
  { name: 'skills', extraCols: "name text, level text, required_level text" },
  { name: 'certifications', extraCols: "name text, issuer text, date_obtained date" },
  { name: 'projects', extraCols: "name text, description text, url text" },
  { name: 'goals', extraCols: "category text, title text, target numeric, unit text, progress numeric, deadline date, hours_per_week numeric" },
  { name: 'regret_events', extraCols: "trigger text, tone text, content_level text, shown_at timestamp with time zone, dismissed boolean, acted_on boolean, outcome text, task_id uuid references tasks(id) on delete set null" },
  { name: 'notifications', extraCols: "type text, title text, body text, read_at timestamp with time zone, channel text" },
  { name: 'reminder_prefs', extraCols: "type text, enabled boolean" },
  { name: 'ai_consent_log', extraCols: "feature text, categories text[], payload_hash text, approved_at timestamp with time zone, model text, status text" },
  { name: 'ai_conversations', extraCols: "title text" },
  { name: 'ai_messages', extraCols: "conversation_id uuid references ai_conversations(id) on delete cascade, role text, content text" },
  { name: 'guardian_links', extraCols: "student_id uuid not null references auth.users(id) on delete cascade, guardian_user_id uuid not null references auth.users(id) on delete cascade, status text, scopes jsonb, consent_recorded_at timestamp with time zone, expires_at timestamp with time zone, id uuid default gen_random_uuid() primary key", omitUserId: true, customRls: true },
  { name: 'account_deletion_requests', extraCols: "status text" }
];

let sql = '-- Supabase Schema Migration: Initial Schema\n-- Generated automatically\n\nCREATE EXTENSION IF NOT EXISTS "pg_trgm";\n\n';

for (const t of tables) {
  if (t.omitUserId) {
    sql += 'CREATE TABLE IF NOT EXISTS public.' + t.name + ' (\n  ' + t.extraCols + '\n);\n';
    sql += 'ALTER TABLE public.' + t.name + ' ENABLE ROW LEVEL SECURITY;\n';
    if (t.name === 'price_cache' || t.name === 'foods' || t.name === 'food_portions') {
      sql += 'CREATE POLICY "Allow read access to authenticated users" ON public.' + t.name + ' FOR SELECT TO authenticated USING (true);\n';
    } else if (t.name === 'guardian_links') {
      sql += 'CREATE POLICY "Student can view and manage their links" ON public.guardian_links FOR ALL TO authenticated USING (auth.uid() = student_id);\n';
      sql += 'CREATE POLICY "Guardian can view their links" ON public.guardian_links FOR SELECT TO authenticated USING (auth.uid() = guardian_user_id);\n';
    }
  } else {
    sql += 'CREATE TABLE IF NOT EXISTS public.' + t.name + ' (\n' + baseCols + ',\n  ' + t.extraCols + '\n);\n';
    sql += 'ALTER TABLE public.' + t.name + ' ENABLE ROW LEVEL SECURITY;\n';
    sql += 'CREATE POLICY "Users can manage their own ' + t.name + '" ON public.' + t.name + ' FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);\n';
    
    if (t.indexes) {
      for (const idx of t.indexes) {
        sql += 'CREATE INDEX idx_' + t.name + '_' + idx + ' ON public.' + t.name + '(user_id, ' + idx + ');\n';
      }
    }
  }
  sql += '\n';
}

fs.writeFileSync('d:/mini twn/supabase/migrations/20261009144022_initial_schema.sql', sql);
console.log('Migration generated.');
