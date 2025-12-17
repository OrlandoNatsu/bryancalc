/**
 * Utilidades para trabajar con medidas en pies y pulgadas
 */

// Constantes
export const INCHES_PER_FOOT = 12

/**
 * Convierte pies a pulgadas
 */
export function feetToInches(feet: number): number {
  return feet * INCHES_PER_FOOT
}

/**
 * Convierte pulgadas a pies
 */
export function inchesToFeet(inches: number): number {
  return inches / INCHES_PER_FOOT
}

/**
 * Convierte pulgadas totales a un objeto con pies y pulgadas
 */
export function inchesToFeetAndInches(totalInches: number): {
  feet: number
  inches: number
} {
  const feet = Math.floor(totalInches / INCHES_PER_FOOT)
  const inches = totalInches % INCHES_PER_FOOT
  return { feet, inches }
}

/**
 * Convierte pies y pulgadas a pulgadas totales
 */
export function feetAndInchesToInches(feet: number, inches: number): number {
  return feetToInches(feet) + inches
}

/**
 * Formatea una medida en pulgadas a un string legible (ej: "10' 6\"")
 */
export function formatMeasurement(totalInches: number): string {
  const { feet, inches } = inchesToFeetAndInches(totalInches)

  if (feet === 0) {
    return `${inches.toFixed(2)}"`
  }

  if (inches === 0) {
    return `${feet}'`
  }

  return `${feet}' ${inches.toFixed(2)}"`
}

/**
 * Parsea un string de medida a pulgadas totales
 * Acepta formatos como: "10", "10'", "6\"", "10' 6\"", "10ft 6in"
 */
export function parseMeasurement(input: string): number {
  if (!input || input.trim() === '') {
    return 0
  }

  // Limpiar el input
  let cleaned = input.trim().toLowerCase()

  // Reemplazar variaciones de pies y pulgadas
  cleaned = cleaned
    .replace(/feet/g, "'")
    .replace(/foot/g, "'")
    .replace(/ft/g, "'")
    .replace(/inches/g, '"')
    .replace(/inch/g, '"')
    .replace(/in/g, '"')

  let totalInches = 0

  // Buscar pies
  const feetMatch = cleaned.match(/(\d+\.?\d*)\s*'/)
  if (feetMatch) {
    const feet = parseFloat(feetMatch[1])
    totalInches += feetToInches(feet)
  }

  // Buscar pulgadas
  const inchesMatch = cleaned.match(/(\d+\.?\d*)\s*"/)
  if (inchesMatch) {
    const inches = parseFloat(inchesMatch[1])
    totalInches += inches
  }

  // Si no hay símbolo, asumir que son pulgadas
  if (!feetMatch && !inchesMatch) {
    const number = parseFloat(cleaned)
    if (!isNaN(number)) {
      totalInches = number
    }
  }

  return totalInches
}

/**
 * Valida que un valor de medida sea válido (mayor a 0)
 */
export function isValidMeasurement(value: number): boolean {
  return !isNaN(value) && isFinite(value) && value > 0
}

/**
 * Redondea un número a un número específico de decimales
 */
export function roundToDecimals(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Convierte un decimal de pulgadas a fracción (hasta 1/16)
 * Ej: 4.0625 -> "4 1/16"
 */
export function decimalToFraction(decimal: number): string {
  const wholeNumber = Math.floor(decimal)
  const fractionalPart = decimal - wholeNumber

  // Si no hay parte fraccionaria, retornar solo el número entero
  if (fractionalPart < 0.001) {
    return wholeNumber.toString()
  }

  // Buscar la fracción más cercana en 16avos
  const sixteenths = Math.round(fractionalPart * 16)

  // Si es 16/16, agregar 1 al número entero
  if (sixteenths === 16) {
    return (wholeNumber + 1).toString()
  }

  // Si es 0/16, retornar solo el número entero
  if (sixteenths === 0) {
    return wholeNumber.toString()
  }

  // Simplificar la fracción
  const { numerator, denominator } = simplifyFraction(sixteenths, 16)

  if (wholeNumber === 0) {
    return `${numerator}/${denominator}`
  }

  return `${wholeNumber} ${numerator}/${denominator}`
}

/**
 * Simplifica una fracción
 */
function simplifyFraction(
  numerator: number,
  denominator: number
): { numerator: number; denominator: number } {
  const gcd = greatestCommonDivisor(numerator, denominator)
  return {
    numerator: numerator / gcd,
    denominator: denominator / gcd
  }
}

/**
 * Calcula el máximo común divisor
 */
function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b)
}

/**
 * Formatea una medida en pulgadas con fracciones (ej: "10' 6 1/2\"")
 */
export function formatMeasurementWithFractions(totalInches: number): string {
  const { feet, inches } = inchesToFeetAndInches(totalInches)
  const inchesStr = decimalToFraction(inches)

  if (feet === 0) {
    return `${inchesStr}"`
  }

  if (inches === 0) {
    return `${feet}'`
  }

  return `${feet}' ${inchesStr}"`
}
