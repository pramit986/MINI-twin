import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Signup() {
  const [step, setStep] = useState(1);
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [ageState, setAgeState] = useState<'valid' | 'under13' | 'minorBlocked' | ''>('');

  const checkAge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 13) {
      setAgeState('under13');
    } else if (age < 18 && import.meta.env.VITE_MINORS_ENABLED !== 'true') {
      setAgeState('minorBlocked');
    } else {
      setAgeState('valid');
      setStep(2);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 10) {
      setError('Password must be at least 10 characters.');
      return;
    }
    setLoading(true);
    setError('');

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          dob,
        },
      }
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setMessage('Check your email to verify your account.');
    }
    setLoading(false);
  };

  if (ageState === 'under13') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)]">
        <div className="w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-line)] p-[32px] text-center">
          <h1 className="text-title mb-[16px]">We're sorry.</h1>
          <p className="text-[var(--color-text-2)] mb-[24px]">Student Twin is not available for users under 13.</p>
          <Link to="/" className="btn-secondary w-full">Go to homepage</Link>
        </div>
      </div>
    );
  }

  if (ageState === 'minorBlocked') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)]">
        <div className="w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-line)] p-[32px] text-center">
          <h1 className="text-title mb-[16px]">Not quite yet.</h1>
          <p className="text-[var(--color-text-2)] mb-[24px]">Student Twin is open to 18+ right now while we finalise our youth safety features.</p>
          <Link to="/demo" className="btn-primary w-full">Try the demo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)]">
      <div className="w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-line)] p-[32px] flex flex-col">
        <h1 className="text-display mb-[8px]">Create account.</h1>
        <p className="text-[var(--color-text-2)] mb-[32px]">
          {step === 1 ? "Let's start with your birthday." : "Set up your credentials."}
        </p>

        {error && (
          <div className="mb-[16px] text-small text-[var(--color-regret)]">
            {error}
          </div>
        )}
        
        {message ? (
          <div className="text-center text-[var(--color-text-2)] py-[32px]">
            {message}
          </div>
        ) : (
          step === 1 ? (
            <form onSubmit={checkAge} className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <label className="text-label" htmlFor="dob">Date of birth</label>
                <input
                  id="dob"
                  type="date"
                  required
                  className="h-[48px]"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary w-full mt-[8px]">Continue</button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <label className="text-label" htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="h-[48px]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="text-label" htmlFor="password">Password (min 10 characters)</label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={10}
                  className="h-[48px]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary w-full mt-[8px]" disabled={loading}>
                {loading ? 'Creating...' : 'Create account'}
              </button>
            </form>
          )
        )}

        <div className="mt-[32px] text-center text-small text-[var(--color-text-2)]">
          Already have an account? <Link to="/login" className="text-[var(--color-text)] hover:text-[var(--color-accent)]">Log in</Link>
        </div>
      </div>
    </div>
  );
}
