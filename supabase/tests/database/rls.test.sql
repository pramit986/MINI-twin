BEGIN;
select plan(3);

-- Create a mock user
select * from tests.create_supabase_user('test1');
select * from tests.create_supabase_user('test2');

-- Authenticate as test1
select tests.authenticate_as('test1');

-- Insert a profile
INSERT INTO profiles (user_id, name) VALUES (tests.get_supabase_uid('test1'), 'Test One');

-- Should be able to read own profile
select results_eq(
  'SELECT name FROM profiles',
  ARRAY['Test One'],
  'User 1 can read own profile'
);

-- Authenticate as test2
select tests.authenticate_as('test2');

-- Should NOT be able to read user1's profile
select is_empty(
  'SELECT name FROM profiles',
  'User 2 cannot read User 1 profile'
);

-- Should NOT be able to insert for user1
PREPARE insert_other AS INSERT INTO profiles (user_id, name) VALUES (tests.get_supabase_uid('test1'), 'Hacked');
select throws_ok(
  'insert_other',
  'new row violates row-level security policy for table "profiles"',
  'User 2 cannot insert profile for User 1'
);

select * from finish();
ROLLBACK;
