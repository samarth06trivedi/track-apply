'use client';
import { ThemeToggle } from '@/components/theme-toggle';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/auth'); // Redirect to login page
    } else {
      const data = await res.json();
      setError(data.error || 'Registration failed');
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
        <header className="w-full p-6 flex justify-end">
          <ThemeToggle />
        </header>

        <main className="flex-1 flex items-center justify-center">
          <form
            className="w-full max-w-sm space-y-4 p-6 rounded-xl bg-card shadow-lg border border-gray-200 dark:border-white/10 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_4px_20px_rgba(255,255,255,0.08)] transition-shadow duration-300"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-semibold text-center">Register</h2>

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 rounded-md border bg-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 rounded-md border bg-input"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 rounded-md border bg-input"
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground p-2 rounded-md hover:opacity-90 transition"
            >
              Create Account
            </button>

            <div className="flex items-center justify-center">
              <span className="text-sm text-muted-foreground">or</span>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5" />
              Sign up with Google
            </button>

            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </form>
        </main>
      </div>
    </ThemeProvider>
  );
}
