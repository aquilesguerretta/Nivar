// ARCHITECT — Identidade de Plataforma, Wave 1: `SignupCredentialsPage`
// SAIU DA ROTA `/signup`, que agora é o `SignupGate`.
//
// Ela pedia nome, email e senha, validava a senha com no mínimo 8
// caracteres e a DESCARTAVA — `setCredentials` gravava só nome e email
// num store de sessionStorage. Com a conta de plataforma real (Wave 9
// do backend), essa coleta virou redundante e a senha passou a existir
// de verdade.
//
// O ARQUIVO PERMANECE porque `ProgressDots` mora aqui e é importado
// por SignupProfilePage e SignupDetailsPage. O componente abaixo fica
// sem consumidor de propósito, não por esquecimento: apagá-lo é uma
// decisão sobre o fluxo legado que esta wave não tomou sozinha.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { C, F } from '@/design/tokens';
import { Eyebrow } from '@/components/editorial/Eyebrow';
import { DisplayHeading } from '@/components/editorial/DisplayHeading';
import { FormField } from '@/components/editorial/FormField';
import { useAuthStore } from '@/stores/authStore';
import { PrimaryButton } from './LoginPage';

export function SignupCredentialsPage() {
  const navigate = useNavigate();
  const store = useAuthStore();
  const [name, setName] = useState(store.name);
  const [email, setEmail] = useState(store.email);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Tell us your name.';
    if (!email.includes('@')) next.email = 'Enter a valid email.';
    if (password.length < 8) next.password = 'At least 8 characters.';
    setErrors(next);
    if (Object.keys(next).length === 0) {
      store.setCredentials({ name: name.trim(), email: email.trim() });
      store.advanceStep();
      navigate('/signup/profile');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <ProgressDots step={1} label="STEP 1 OF 3 · CREDENTIALS" />

      <div style={{ marginTop: 40 }}>
        <Eyebrow>CREATE ACCOUNT</Eyebrow>
        <div style={{ marginTop: 16 }}>
          <DisplayHeading line1="Let's get you in." />
        </div>
        <p
          style={{
            marginTop: 16,
            fontFamily: F.sans,
            fontSize: 15,
            lineHeight: 1.6,
            color: C.textSecondary,
          }}
        >
          Thirty seconds. Then you pick what you watch.
        </p>
      </div>

      <form
        onSubmit={submit}
        style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 20 }}
      >
        <FormField
          label="Name"
          placeholder="Your name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <FormField
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          helperText="We send alerts here. Make it one you check."
        />
        <FormField
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          helperText="At least 8 characters."
        />
        <PrimaryButton type="submit">Continue</PrimaryButton>
      </form>

      <div
        style={{
          marginTop: 24,
          textAlign: 'center',
          fontFamily: F.sans,
          fontSize: 14,
          color: C.textSecondary,
        }}
      >
        Already have an account?{' '}
        <Link
          to="/login"
          className="group inline-flex items-center gap-1"
          style={{ color: C.electricBlue, textDecoration: 'none' }}
        >
          <span>Sign in</span>
          <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  );
}

/**
 * Inline progress indicator for the 3-step signup flow. Three 32px line
 * segments, mono label above. Active segments fill with C.electricBlue;
 * remaining segments carry a muted border.
 */
export function ProgressDots({ step, label }: { step: 1 | 2 | 3; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 10,
          letterSpacing: '0.14em',
          color: C.textMuted,
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: 32,
              height: 2,
              background: i <= step ? C.electricBlue : 'rgba(255,255,255,0.12)',
              transition: 'background 180ms ease-out',
            }}
          />
        ))}
      </div>
    </div>
  );
}
