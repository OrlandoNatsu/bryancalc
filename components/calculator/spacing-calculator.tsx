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
import { calculateSpacingSize } from '@/lib/calculator-logic'
import {
  feetAndInchesToInches,
  formatMeasurementWithFractions
} from '@/lib/measurement-utils'
import type { StartEndOption } from '@/types/calculator'
import { SpacingDiagram } from './spacing-diagram'

export function SpacingCalculator() {
  // Estados para los inputs
  const [totalFeet, setTotalFeet] = useState('')
  const [totalInches, setTotalInches] = useState('')
  const [pieceSize, setPieceSize] = useState('')
  const [numberOfPieces, setNumberOfPieces] = useState('')
  const [startWith, setStartWith] = useState<StartEndOption>('piece')
  const [endWith, setEndWith] = useState<StartEndOption>('piece')

  // Calcular el número máximo de piezas que caben
  const calculateMaxPieces = () => {
    const feet = parseFloat(totalFeet) || 0
    const inches = parseFloat(totalInches) || 0
    const totalDistanceInches = feetAndInchesToInches(feet, inches)
    const pieceSizeInches = parseFloat(pieceSize) || 0

    if (totalDistanceInches <= 0 || pieceSizeInches <= 0) {
      return null
    }

    // Calcular cuántas piezas caben como máximo (sin espacios)
    return Math.floor(totalDistanceInches / pieceSizeInches)
  }

  // Calcular resultados
  const calculate = () => {
    const feet = parseFloat(totalFeet) || 0
    const inches = parseFloat(totalInches) || 0
    const totalDistanceInches = feetAndInchesToInches(feet, inches)
    const pieceSizeInches = parseFloat(pieceSize) || 0
    const pieces = parseInt(numberOfPieces) || 0

    if (totalDistanceInches <= 0 || pieceSizeInches <= 0 || pieces <= 0) {
      return null
    }

    const result = calculateSpacingSize({
      totalDistance: totalDistanceInches,
      pieceSize: pieceSizeInches,
      numberOfPieces: pieces,
      startWithPiece: startWith === 'piece',
      endWithPiece: endWith === 'piece'
    })

    return result
  }

  const result = calculate()
  const maxPieces = calculateMaxPieces()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calculate Spacing Size</CardTitle>
          <CardDescription>
            Enter the total distance, piece size, and number of pieces to
            calculate the spacing needed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Distance */}
          <div className="space-y-2">
            <Label>Total Distance to Cover</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label
                  htmlFor="spacing-total-feet"
                  className="text-xs text-muted-foreground"
                >
                  Feet
                </Label>
                <Input
                  id="spacing-total-feet"
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
                  htmlFor="spacing-total-inches"
                  className="text-xs text-muted-foreground"
                >
                  Inches
                </Label>
                <Input
                  id="spacing-total-inches"
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

          {/* Piece Size and Number of Pieces - En la misma línea */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="spacing-piece-size">Piece Size (inches)</Label>
              <Input
                id="spacing-piece-size"
                type="number"
                placeholder="6"
                value={pieceSize}
                onChange={(e) => setPieceSize(e.target.value)}
                min="0"
                step="0.0625"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="number-of-pieces">Number of Pieces</Label>
              <Input
                id="number-of-pieces"
                type="number"
                placeholder="10"
                value={numberOfPieces}
                onChange={(e) => setNumberOfPieces(e.target.value)}
                min="1"
                step="1"
              />
            </div>
          </div>

          {/* Start With y End With - En la misma línea */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start With */}
            <div className="space-y-3">
              <Label>Start With</Label>
              <RadioGroup
                value={startWith}
                onValueChange={(value) => setStartWith(value as StartEndOption)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="piece" id="spacing-start-piece" />
                  <Label
                    htmlFor="spacing-start-piece"
                    className="font-normal cursor-pointer"
                  >
                    Piece
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="space" id="spacing-start-space" />
                  <Label
                    htmlFor="spacing-start-space"
                    className="font-normal cursor-pointer"
                  >
                    Space
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* End With */}
            <div className="space-y-3">
              <Label>End With</Label>
              <RadioGroup
                value={endWith}
                onValueChange={(value) => setEndWith(value as StartEndOption)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="piece" id="spacing-end-piece" />
                  <Label
                    htmlFor="spacing-end-piece"
                    className="font-normal cursor-pointer"
                  >
                    Piece
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="space" id="spacing-end-space" />
                  <Label
                    htmlFor="spacing-end-space"
                    className="font-normal cursor-pointer"
                  >
                    Space
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && result.isValid && (
        <Card className="bg-zinc-50 dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-2xl">Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Spacing Size</p>
              <p className="text-4xl font-bold">
                {formatMeasurementWithFractions(result.spacingSize)}
              </p>
              <p className="text-xs text-muted-foreground">
                ({result.spacingSize.toFixed(4)} inches per space)
              </p>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Number of Spaces:</span>
                <span className="font-medium">{result.numberOfSpaces}</span>
              </div>
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
            </div>

            {result.spacingSize > 0 && (
              <div className="bg-green-100 dark:bg-green-950/50 border-2 border-green-600 dark:border-green-700 rounded-lg p-3">
                <p className="text-sm text-green-900 dark:text-green-100 font-medium">
                  <strong>✓ Perfect fit!</strong> Each space should be exactly{' '}
                  {formatMeasurementWithFractions(result.spacingSize)}.
                </p>
              </div>
            )}

            {/* Diagrama visual */}
            <div className="border-t pt-4">
              <SpacingDiagram
                numberOfPieces={parseInt(numberOfPieces) || 0}
                numberOfSpaces={result.numberOfSpaces}
                pieceSize={parseFloat(pieceSize) || 0}
                spacingSize={result.spacingSize}
                totalDistance={feetAndInchesToInches(
                  parseFloat(totalFeet) || 0,
                  parseFloat(totalInches) || 0
                )}
                startWithPiece={startWith === 'piece'}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {result && !result.isValid && (
        <Card className="bg-red-100 dark:bg-red-950/50 border-2 border-red-600 dark:border-red-700">
          <CardContent className="pt-6 space-y-3">
            <p className="text-sm text-red-900 dark:text-red-100 font-medium">
              <strong>Error:</strong>{' '}
              {result.errorMessage ||
                'Unable to calculate spacing with the current measurements.'}
            </p>
            {maxPieces !== null && maxPieces > 0 && (
              <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3 border border-red-300 dark:border-red-800">
                <p className="text-sm text-red-900 dark:text-red-100">
                  <strong>Maximum pieces that fit:</strong> {maxPieces} pieces
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
