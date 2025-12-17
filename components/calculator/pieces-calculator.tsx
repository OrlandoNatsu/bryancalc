'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { calculateNumberOfPieces } from '@/lib/calculator-logic'
import {
  feetAndInchesToInches,
  formatMeasurementWithFractions
} from '@/lib/measurement-utils'
import type { StartEndOption } from '@/types/calculator'
import { SpacingDiagram } from './spacing-diagram'

export function PiecesCalculator() {
  // Estados para los inputs
  const [totalFeet, setTotalFeet] = useState('')
  const [totalInches, setTotalInches] = useState('')
  const [pieceSize, setPieceSize] = useState('')
  const [spacingSize, setSpacingSize] = useState('')
  const [startWith, setStartWith] = useState<StartEndOption>('piece')
  const [cutLastPiece, setCutLastPiece] = useState(false)

  // Calcular resultados
  const calculate = () => {
    const feet = parseFloat(totalFeet) || 0
    const inches = parseFloat(totalInches) || 0
    const totalDistanceInches = feetAndInchesToInches(feet, inches)
    const pieceSizeInches = parseFloat(pieceSize) || 0
    const spacingSizeInches = parseFloat(spacingSize) || 0

    if (totalDistanceInches <= 0 || pieceSizeInches <= 0) {
      return null
    }

    const result = calculateNumberOfPieces({
      totalDistance: totalDistanceInches,
      pieceSize: pieceSizeInches,
      spacingSize: spacingSizeInches,
      startWithPiece: startWith === 'piece',
      endWithPiece: true, // Siempre termina en pieza
      cutLastPiece
    })

    return result
  }

  const result = calculate()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calculate Number of Pieces</CardTitle>
          <CardDescription>
            Enter the total distance and piece/spacing sizes to calculate how
            many pieces you need
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Distance */}
          <div className="space-y-2">
            <Label>Total Distance to Cover</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label
                  htmlFor="total-feet"
                  className="text-xs text-muted-foreground"
                >
                  Feet
                </Label>
                <Input
                  id="total-feet"
                  type="number"
                  placeholder="0"
                  value={totalFeet}
                  onChange={(e) => setTotalFeet(e.target.value)}
                  min="0"
                  step="1"
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="total-inches"
                  className="text-xs text-muted-foreground"
                >
                  Inches
                </Label>
                <Input
                  id="total-inches"
                  type="number"
                  placeholder="0"
                  value={totalInches}
                  onChange={(e) => setTotalInches(e.target.value)}
                  min="0"
                  step="0.0625"
                />
              </div>
            </div>
          </div>

          {/* Piece Size and Spacing Size - En la misma línea */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="piece-size">Piece Size (inches)</Label>
              <Input
                id="piece-size"
                type="number"
                placeholder="6"
                value={pieceSize}
                onChange={(e) => setPieceSize(e.target.value)}
                min="0"
                step="0.0625"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spacing-size">
                Spacing Between Pieces (inches)
              </Label>
              <Input
                id="spacing-size"
                type="number"
                placeholder="4"
                value={spacingSize}
                onChange={(e) => setSpacingSize(e.target.value)}
                min="0"
                step="0.0625"
              />
            </div>
          </div>

          {/* Start With y Cut Last Piece - En la misma línea */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start With */}
            <div className="space-y-3">
              <Label>Start With</Label>
              <RadioGroup
                value={startWith}
                onValueChange={(value) => setStartWith(value as StartEndOption)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="piece" id="start-piece" />
                  <Label
                    htmlFor="start-piece"
                    className="font-normal cursor-pointer"
                  >
                    Piece
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="space" id="start-space" />
                  <Label
                    htmlFor="start-space"
                    className="font-normal cursor-pointer"
                  >
                    Space
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Cut Last Piece Switch */}
            <div className="flex items-start space-x-3 rounded-lg border p-4">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="cut-last-piece" className="cursor-pointer">
                  Cut Last Piece to Fit
                </Label>
                <p className="text-xs text-muted-foreground">
                  Adjust the last piece size for a perfect fit
                </p>
              </div>
              <Switch
                id="cut-last-piece"
                checked={cutLastPiece}
                onCheckedChange={setCutLastPiece}
                className="data-[state=checked]:bg-red-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && result.numberOfPieces > 0 && (
        <Card className="bg-zinc-50 dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-2xl">Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Number of Pieces
                </p>
                <p className="text-3xl font-bold">{result.numberOfPieces}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Number of Spaces
                </p>
                <p className="text-3xl font-bold">{result.numberOfSpaces}</p>
              </div>
            </div>

            {result.lastPieceSize !== undefined && (
              <div className="bg-red-100 dark:bg-red-950/50 border-2 border-red-600 dark:border-red-700 rounded-lg p-3">
                <p className="text-sm text-red-900 dark:text-red-100 font-medium">
                  <strong>Last Piece:</strong> Cut to{' '}
                  {formatMeasurementWithFractions(result.lastPieceSize)}
                </p>
              </div>
            )}

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Total Pieces Length:
                </span>
                <span className="font-medium">
                  {formatMeasurementWithFractions(result.totalPiecesLength)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Total Spaces Length:
                </span>
                <span className="font-medium">
                  {formatMeasurementWithFractions(result.totalSpacesLength)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining Space:</span>
                <span
                  className={`font-medium ${
                    result.isExact ? 'text-green-600 dark:text-green-400' : ''
                  }`}
                >
                  {formatMeasurementWithFractions(
                    Math.abs(result.remainingSpace)
                  )}
                  {result.isExact && ' ✓'}
                </span>
              </div>
            </div>

            {result.isExact && (
              <div className="bg-green-100 dark:bg-green-950/50 border-2 border-green-600 dark:border-green-700 rounded-lg p-3">
                <p className="text-sm text-green-900 dark:text-green-100 font-medium">
                  <strong>✓ Perfect fit!</strong> All pieces fit exactly with
                  the specified spacing.
                </p>
              </div>
            )}

            {!result.isExact &&
              result.remainingSpace > 0.01 &&
              !cutLastPiece && (
                <div className="bg-yellow-100 dark:bg-yellow-950/50 border-2 border-yellow-600 dark:border-yellow-700 rounded-lg p-3">
                  <p className="text-sm text-yellow-900 dark:text-yellow-100 font-medium">
                    <strong>Note:</strong> There will be{' '}
                    {formatMeasurementWithFractions(result.remainingSpace)} of
                    unused space. Enable &quot;Cut Last Piece&quot; for a
                    perfect fit.
                  </p>
                </div>
              )}

            {/* Diagrama visual */}
            <div className="border-t pt-4">
              <SpacingDiagram
                numberOfPieces={result.numberOfPieces}
                numberOfSpaces={result.numberOfSpaces}
                pieceSize={parseFloat(pieceSize) || 0}
                spacingSize={parseFloat(spacingSize) || 0}
                totalDistance={feetAndInchesToInches(
                  parseFloat(totalFeet) || 0,
                  parseFloat(totalInches) || 0
                )}
                lastPieceSize={result.lastPieceSize}
                startWithPiece={startWith === 'piece'}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {result && result.numberOfPieces === 0 && (
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <p className="text-sm text-red-800 dark:text-red-200">
              Unable to fit any pieces with the current measurements. Please
              check your inputs.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
