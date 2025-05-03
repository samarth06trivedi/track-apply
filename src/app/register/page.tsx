'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
        <header className="w-full p-6 flex justify-end">
          <ThemeToggle />
        </header>

        <main className="flex-1 flex items-center justify-center">
          <form className="w-full max-w-sm space-y-4 p-6 rounded-xl bg-card shadow-lg border border-gray-200 dark:border-white/10 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_4px_20px_rgba(255,255,255,0.08)] transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-center">Register</h2>

            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 rounded-md border bg-input"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 rounded-md border bg-input"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 rounded-md border bg-input"
            />

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
              onClick={() => alert('Google login not implemented')}
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
