import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black p-4">
      <main className="flex flex-col items-center justify-center gap-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            BryanCalc Tools
          </h1>
          <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
            Professional calculation tools for construction projects
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Link
            href="/calculator"
            className="flex h-14 items-center justify-center rounded-lg bg-zinc-900 px-6 text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Spacing Calculator
          </Link>

          {/* Futuros botones para otras herramientas */}
        </div>
      </main>
    </div>
  )
}
