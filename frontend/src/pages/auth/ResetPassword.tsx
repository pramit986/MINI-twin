import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // We are ready to accept new password
      }
    });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 10) {
      setMessage('Password must be at least 10 characters.');
      return;
    }
    setLoading(true);
    
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) {
      setMessage(error.message);
    } else {
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)]">
      <div className="w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-line)] p-[32px] flex flex-col">
        <h1 className="text-display mb-[8px]">New password.</h1>
        <p className="text-[var(--color-text-2)] mb-[32px]">Please enter a new secure password.</p>

        {message && (
          <div className="mb-[16px] text-small text-[var(--color-regret)]">
            {message}
          </div>
        )}

        <form onSubmit={handleUpdate} className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[8px]">
            <label className="text-label" htmlFor="password">New Password (min 10 characters)</label>
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
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}
