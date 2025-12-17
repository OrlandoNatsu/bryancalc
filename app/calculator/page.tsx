import Link from 'next/link'
import { CalculatorTabs } from '@/components/calculator/calculator-tabs'
import { Button } from '@/components/ui/button'

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Spacing Calculator</h1>
              <p className="text-sm text-muted-foreground">
                Calculate pieces and spacing for your construction projects
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <CalculatorTabs />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            BryanCalc Tools • Spacing Calculator
          </p>
        </div>
      </footer>
    </div>
  )
}
