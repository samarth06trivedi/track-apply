import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
      {/* Header with theme toggle */}
      <header className="w-full p-6 flex justify-end">
        <ThemeToggle />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full mx-auto text-center space-y-12">
          {/* Hero section with animated background element */}
          <div className="relative">
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-200 dark:bg-purple-900/30 blur-3xl opacity-30"></div>
              <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-200 dark:bg-blue-900/30 blur-3xl opacity-30"></div>
            </div>

            <div className="space-y-6 relative z-10">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                Welcome to <span className="text-blue-600 dark:text-blue-400">TrackApply</span>
              </h1>

              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Organize and track all your job applications in one place. Stay focused, stay productive, and land your
                dream job.
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
            {[
              { title: "Organize", description: "Keep all your applications in one place" },
              { title: "Track", description: "Monitor status and follow-ups easily" },
              { title: "Succeed", description: "Improve your application strategy" },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons with improved design */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
            <Link href="/auth" className="group">
              <div className="relative overflow-hidden rounded-lg">
                <div className="absolute inset-0 w-3 bg-blue-600 group-hover:w-full transition-all duration-300 ease-out"></div>
                <button className="relative px-10 py-4 bg-blue-600 text-white font-medium rounded-lg group-hover:text-white transition-colors duration-300 ease-out">
                  Get Started
                </button>
              </div>
            </Link>

            <Link href="/register" className="group">
              <div className="relative overflow-hidden rounded-lg">
                <div className="absolute inset-0 w-3 bg-gray-200 dark:bg-gray-700 group-hover:w-full transition-all duration-300 ease-out"></div>
                <button className="relative px-10 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 font-medium rounded-lg group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300 ease-out">
                  Create Account
                </button>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} TrackApply. All rights reserved.</p>
      </footer>
    </div>
  )
}
