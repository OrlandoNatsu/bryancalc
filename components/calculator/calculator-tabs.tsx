'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PiecesCalculator } from './pieces-calculator'
import { SpacingCalculator } from './spacing-calculator'

export function CalculatorTabs() {
  return (
    <Tabs defaultValue="pieces" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="pieces">Calculate Pieces</TabsTrigger>
        <TabsTrigger value="spacing">Calculate Spacing</TabsTrigger>
      </TabsList>

      <TabsContent value="pieces" className="mt-6">
        <PiecesCalculator />
      </TabsContent>

      <TabsContent value="spacing" className="mt-6">
        <SpacingCalculator />
      </TabsContent>
    </Tabs>
  )
}
