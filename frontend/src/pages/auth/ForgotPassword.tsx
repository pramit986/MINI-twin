import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    // Do not enumerate whether email exists
    setMessage('If an account exists, a password reset link has been sent.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)]">
      <div className="w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-line)] p-[32px] flex flex-col">
        <h1 className="text-display mb-[8px]">Reset password.</h1>
        <p className="text-[var(--color-text-2)] mb-[32px]">Enter your email to receive a reset link.</p>

        {message ? (
          <div className="text-center text-[var(--color-text-2)] py-[16px]">
            {message}
          </div>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-[16px]">
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
            <button type="submit" className="btn-primary w-full mt-[8px]" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}

        <div className="mt-[32px] text-center text-small text-[var(--color-text-2)]">
          <Link to="/login" className="text-[var(--color-text)] hover:text-[var(--color-accent)]">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
