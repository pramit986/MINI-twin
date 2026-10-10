import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Avoid enumeration; just show a generic message or the specific error
      setMessage('Invalid email or password.');
    } else {
      navigate('/onboarding'); // Let RouteGuard handle redirects if they are onboarded
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)]">
      <div className="w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-line)] p-[32px] flex flex-col">
        <h1 className="text-display mb-[8px]">Welcome back.</h1>
        <p className="text-[var(--color-text-2)] mb-[32px]">Log in to your Student Twin.</p>

        {message && (
          <div className="mb-[16px] text-small text-[var(--color-regret)]">
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-[16px]">
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
            <div className="flex justify-between items-center">
              <label className="text-label" htmlFor="password">Password</label>
              <Link to="/forgot-password" className="text-label text-[var(--color-text-2)] hover:text-[var(--color-text)]">Forgot password?</Link>
            </div>
            <input
              id="password"
              type="password"
              required
              className="h-[48px]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary w-full mt-[8px]" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div className="flex items-center gap-[16px] my-[24px]">
          <div className="flex-1 h-[1px] bg-[var(--color-line)]"></div>
          <span className="text-label text-[var(--color-text-3)]">Or</span>
          <div className="flex-1 h-[1px] bg-[var(--color-line)]"></div>
        </div>

        <button onClick={handleGoogleLogin} className="btn-secondary w-full flex gap-[8px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="mt-[32px] text-center text-small text-[var(--color-text-2)] flex flex-col gap-[8px]">
          <div>
            Don't have an account? <Link to="/signup" className="text-[var(--color-text)] hover:text-[var(--color-accent)]">Create account</Link>
          </div>
          <div>
            <Link to="/demo" className="text-[var(--color-text-3)] hover:text-[var(--color-text)]">Try the demo</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
