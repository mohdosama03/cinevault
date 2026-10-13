import React, { useState } from 'react';
import { Film, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { signIn, signUp } from '../services/auth';

export default function AuthGate({ onAuthenticated }) {
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignUp = mode === 'signup';

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const user = isSignUp
        ? await signUp({ name, email, password })
        : await signIn({ email, password });
      onAuthenticated(user);
    } catch (err) {
      setError(err.message || 'Could not complete sign-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-backdrop" aria-hidden="true" />
      <section className="auth-card" aria-labelledby="auth-title">
        <a className="auth-brand" href="#signin" onClick={(event) => { event.preventDefault(); switchMode('signin'); }}>
          <span className="auth-brand-icon"><Film size={22} /></span>
          <span>CINE<span className="auth-brand-accent">VAULT</span></span>
        </a>

        <div className="auth-intro">
          <p className="auth-eyebrow">YOUR CINEMA, YOUR SEAT</p>
          <h1 id="auth-title">{isSignUp ? 'Create your account' : 'Welcome back'}</h1>
          <p>{isSignUp ? 'Join CineVault to discover films and manage your bookings.' : 'Sign in to continue to the CineVault movie experience.'}</p>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Account access">
          <button type="button" role="tab" aria-selected={!isSignUp} className={!isSignUp ? 'active' : ''} onClick={() => switchMode('signin')}>Sign in</button>
          <button type="button" role="tab" aria-selected={isSignUp} className={isSignUp ? 'active' : ''} onClick={() => switchMode('signup')}>Sign up</button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <label className="auth-field">
              <span>Full name</span>
              <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required maxLength={80} />
            </label>
          )}
          <label className="auth-field">
            <span>Email address</span>
            <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
          </label>
          <label className="auth-field">
            <span>Password</span>
            <span className="auth-password-wrap">
              <input type={showPassword ? 'text' : 'password'} autoComplete={isSignUp ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isSignUp ? 'At least 8 characters' : 'Enter your password'} minLength={isSignUp ? 8 : undefined} required />
              <button className="auth-password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
            {!isSubmitting && <ArrowRight size={17} />}
          </button>
        </form>

        <p className="auth-switch">
          {isSignUp ? 'Already have an account?' : 'New to CineVault?'}{' '}
          <button type="button" onClick={() => switchMode(isSignUp ? 'signin' : 'signup')}>{isSignUp ? 'Sign in' : 'Create an account'}</button>
        </p>
        <p className="auth-local-note">Demo accounts are saved in this browser.</p>
      </section>
    </main>
  );
}
