/**
 * Tipos y interfaces para la calculadora
 */

export interface MeasurementInput {
  feet: string
  inches: string
}

export type StartEndOption = 'piece' | 'space'

export interface PiecesFormData {
  totalDistance: MeasurementInput
  pieceSize: string // En pulgadas
  spacingSize: string // En pulgadas
  startWith: StartEndOption
  endWith: StartEndOption
}

export interface SpacingFormData {
  totalDistance: MeasurementInput
  pieceSize: string // En pulgadas
  numberOfPieces: string
  startWith: StartEndOption
  endWith: StartEndOption
}
