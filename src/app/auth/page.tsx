'use client';
import { ThemeToggle } from '@/components/theme-toggle';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/dashboard');
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
            onSubmit={handleLogin}
            className="w-full max-w-sm space-y-4 p-6 rounded-xl bg-card shadow-lg border border-gray-200 dark:border-white/10 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_4px_20px_rgba(255,255,255,0.08)] transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold text-center">Login</h2>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-md border bg-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded-md border bg-input"
              required
            />

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground p-2 rounded-md hover:opacity-90 transition"
            >
              Sign In
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
              Sign in with Google
            </button>

            <p className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </form>
        </main>
      </div>
    </ThemeProvider>
  );
}
