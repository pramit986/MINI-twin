# Student Twin v2 - Build Plan & Documentation

## 0. AUDIT & MIGRATION PLAN

### Files Using Seed Data, Mock Services, Hard-coded Numbers, or localStorage:
1. **`backend/src/data/mockData.ts`**: Contains all seed arrays and objects (`student`, `subjects`, `tasks`, `workouts`, `meals`, `expenses`, `goals`, etc.).
2. **`backend/src/routes/api.ts`**: Express endpoints exposing the mock data.
3. **`backend/src/services/*.ts`**: Mock AI and algorithm services (e.g., `aiCoachService.ts`, `regreterService.ts`, `recoveryService.ts`, `riskPredictionService.ts`).
4. **`frontend/src/services/api.ts`**: Frontend client wrapper calling the mock backend.
5. **`frontend/src/App.tsx` & `frontend/src/pages/Onboarding.tsx`**: Uses `localStorage.getItem('studentTwin_onboarded')` to track initial setup.
6. **Frontend Pages (`Dashboard.tsx`, `Academic.tsx`, etc.)**: Store fetched data in local React state (`useState`) without a global Zustand store in the current configuration.

### Migration Plan
Since the current app relies on a mock Express backend and `useState` instead of a central Zustand store, the equivalent "store slices/entities" map as follows:

**Supabase Tables (replacing Mock Data entities):**
- `profiles` (from `student` object)
- `health_profiles` (for fitness/nutrition goals)
- `body_metrics` (for weight/BMI history)
- `academic_profiles`, `subjects`, `timetable_slots`, `attendance`, `assignments`, `exams`, `grades` (from AcademicData & Subjects)
- `study_sessions`, `tasks`, `task_plans`, `habits`, `habit_logs`
- `workouts`, `workout_exercises`, `workout_sets` (from FitnessData)
- `foods`, `food_portions`, `meals`, `meal_items`, `water_logs`, `sleep_logs`, `mood_checkins`
- `income_sources`, `expenses`, `subscriptions`, `budgets`, `savings_goals`, `holdings`, `sips`, `price_cache`
- `career_profiles`, `skills`, `certifications`, `projects`
- `goals`
- `regret_events`, `notifications`, `reminder_prefs`
- `ai_consent_log`, `ai_conversations`, `ai_messages`
- `guardian_links`

**React Query (replacing frontend API calls & component state):**
- We will install TanStack Query.
- The `api.ts` fetchers will be replaced with React Query custom hooks (e.g., `useDashboardData`, `useTasks`) that query Supabase directly using `@supabase/supabase-js`.
- UI selectors will become deterministic derived state functions inside the hooks, keeping their shapes (e.g., `DashboardData`) so UI components do not break.

**Edge Functions (replacing backend express services):**
- `parse_meal` (Gemini-powered nutrition extraction)
- `ai/preview` & `ai/run` (Replacing `aiCoachService.ts`)
- `refresh_prices` (For investment tracking)
- `send_reminders` (Replacing mock notifications)
- `account_deletion` (Cascade delete logic)

---

## 19. Architecture & Setup Guide (WIP)
*(This section will be expanded as we implement the features).*

### Assumptions Made & Steps Completed:
- Completed Step 1 (Project Audit): Documented above.
- Completed Step 2 (Supabase Wiring & DB): `initial_schema.sql` migration generated handling all constraints (RLS, cascading deletes, enums, etc). RLS tests written. However, local Supabase (`npx supabase start`) requires Docker, which is not running on this system. Tests logic is implemented and skipped for now.
- Completed Step 3 (Auth Pages): `Login`, `Signup`, `ForgotPassword`, `ResetPassword`, `AuthCallback`, and `RouteGuard` implemented with strict design adherence.
  - Implemented Age Gate in `Signup`: <13 blocked entirely (memory-only state), 13-17 blocked with `VITE_MINORS_ENABLED` variable check.
  - Auth route redirects verified.
- Completed Step 4 (Onboarding Wizard): 8-step wizard saving progress iteratively to Supabase.
- Completed Step 5 (Replace Mock Store): Eliminated `backend/` mock express server. Rewrote `frontend/src/services/api.ts` to fetch and parse from Supabase client while maintaining original types, satisfying UI dependencies without breaking components.
- Completed Step 6 (Demo Mode): Moved mock data into `frontend/src/demo`.
- Completed Step 7 (Health Calculators & UI): Added BMI, Protein, Water, and Calorie functions logic matching WHO/CDC and ICMR guidelines into `src/health/`. Vitest unit tests added. Created `Health.tsx` with 3-tab UI saving directly to `health_profiles` and `body_metrics`.
- Completed Step 8 (Academic & Productivity Persistence): Wired up `Academic.tsx` and `Productivity.tsx` to real data. Implemented Zod + React Hook Form modals for creating Tasks and Subjects. Implemented quick-action buttons for Attendance (Present/Absent) and Task states (Complete/Delay).
- Completed Step 9 (Nutrition): Implemented `Nutrition.tsx` UI with natural language meal logging modal. Added `parseMeal` and `addMeal` logic in `api.ts` to convert AI estimates into persistent macro tracking. Macros dynamically aggregate against user targets from `health_profiles`.
- Completed Step 10 (Edge Functions): Implemented Deno edge function `ai/index.ts` handling Gemini API calls for `preview` and `run` endpoints, logging consent payloads.
- Completed Step 11 (Finance): Wired up `Finance.tsx` to `expenses` table. Implemented Add Expense modal with Zod validation. Dynamic calculation of `spent`, `remaining`, and `projectedMonthEnd` based on current day run-rate and category breakdown.
- Completed Step 12 (Regreter & Weekly Review): Wired `Regreter.tsx` to read real pending tasks and calculate real estimated workload consequences. Wired `WeeklyReview.tsx` to analyze the last 7 days of tasks and expenses in Supabase to determine wins and slips dynamically.
- Skipped Step 13 Implementation (Email & Reminders): Requires active Resend API key and pg_cron extension enablement in Supabase cloud dashboard. Left as a documented future capability.
- Completed Step 14 (Settings & Privacy): Added "Export My Data (JSON)" which iterates over all major tables and downloads a raw JSON dump. Added "Delete Account" which wipes user profile and signs out.
- The existing design system (Tailwind classes, CSS variables in `App.css`/`index.css`) will remain entirely untouched.
- Zustand was mentioned in the prompt, but the codebase uses React `useState` and `fetch`. We migrated `api.ts` to directly query Supabase instead.
- For BMI LMS calculations, standard WHO definitions implemented.

