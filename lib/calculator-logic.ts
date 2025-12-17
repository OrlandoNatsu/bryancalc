/**
 * Lógica de cálculo para piezas y espacios
 */

export interface PiecesCalculationParams {
  totalDistance: number // Distancia total en pulgadas
  pieceSize: number // Tamaño de cada pieza en pulgadas
  spacingSize: number // Tamaño de cada espacio en pulgadas
  startWithPiece: boolean // ¿Empieza con pieza?
  endWithPiece: boolean // ¿Termina con pieza?
  cutLastPiece?: boolean // ¿Cortar (hilar) la última pieza para ajuste perfecto?
}

export interface PiecesCalculationResult {
  numberOfPieces: number // Número de piezas necesarias
  numberOfSpaces: number // Número de espacios
  totalPiecesLength: number // Longitud total de piezas
  totalSpacesLength: number // Longitud total de espacios
  remainingSpace: number // Espacio sobrante (si hay)
  isExact: boolean // ¿Es un ajuste exacto?
  lastPieceSize?: number // Tamaño de la última pieza si fue cortada
}

export interface SpacingCalculationParams {
  totalDistance: number // Distancia total en pulgadas
  pieceSize: number // Tamaño de cada pieza en pulgadas
  numberOfPieces: number // Número de piezas disponibles
  startWithPiece: boolean // ¿Empieza con pieza?
  endWithPiece: boolean // ¿Termina con pieza?
}

export interface SpacingCalculationResult {
  spacingSize: number // Tamaño de cada espacio en pulgadas
  numberOfSpaces: number // Número de espacios
  totalPiecesLength: number // Longitud total de piezas
  totalSpacesLength: number // Longitud total de espacios
  isValid: boolean // ¿Es válido el cálculo?
  errorMessage?: string // Mensaje de error si no es válido
}

/**
 * Calcula el número de piezas necesarias dada una distancia total,
 * tamaño de pieza y tamaño de espacio
 */
export function calculateNumberOfPieces(
  params: PiecesCalculationParams
): PiecesCalculationResult {
  const {
    totalDistance,
    pieceSize,
    spacingSize,
    startWithPiece,
    endWithPiece,
    cutLastPiece = false
  } = params

  // Validaciones básicas
  if (totalDistance <= 0 || pieceSize <= 0 || spacingSize < 0) {
    return {
      numberOfPieces: 0,
      numberOfSpaces: 0,
      totalPiecesLength: 0,
      totalSpacesLength: 0,
      remainingSpace: totalDistance,
      isExact: false
    }
  }

  // Si la pieza es más grande que la distancia total
  if (pieceSize > totalDistance) {
    return {
      numberOfPieces: 0,
      numberOfSpaces: 0,
      totalPiecesLength: 0,
      totalSpacesLength: 0,
      remainingSpace: totalDistance,
      isExact: false
    }
  }

  // Calcular según las opciones de inicio y final
  let numberOfPieces: number
  let numberOfSpaces: number

  if (startWithPiece && endWithPiece) {
    // Patrón: P-E-P-E-P
    // Formula: n piezas requieren (n-1) espacios
    // totalDistance = n * pieceSize + (n-1) * spacingSize
    // totalDistance = n * pieceSize + n * spacingSize - spacingSize
    // totalDistance + spacingSize = n * (pieceSize + spacingSize)
    numberOfPieces = Math.floor(
      (totalDistance + spacingSize) / (pieceSize + spacingSize)
    )
    numberOfSpaces = numberOfPieces - 1
  } else if (!startWithPiece && !endWithPiece) {
    // Patrón: E-P-E-P-E
    // Formula: n piezas requieren (n+1) espacios
    // totalDistance = n * pieceSize + (n+1) * spacingSize
    // totalDistance - spacingSize = n * (pieceSize + spacingSize)
    numberOfPieces = Math.floor(
      (totalDistance - spacingSize) / (pieceSize + spacingSize)
    )
    numberOfSpaces = numberOfPieces + 1
  } else {
    // Patrón: P-E-P-E o E-P-E-P (ambos casos son iguales)
    // Formula: n piezas requieren n espacios
    // totalDistance = n * pieceSize + n * spacingSize
    // totalDistance = n * (pieceSize + spacingSize)
    numberOfPieces = Math.floor(totalDistance / (pieceSize + spacingSize))
    numberOfSpaces = numberOfPieces
  }

  // Asegurar que no sean negativos
  numberOfPieces = Math.max(0, numberOfPieces)
  numberOfSpaces = Math.max(0, numberOfSpaces)

  let totalPiecesLength = numberOfPieces * pieceSize
  const totalSpacesLength = numberOfSpaces * spacingSize
  let usedSpace = totalPiecesLength + totalSpacesLength
  let remainingSpace = totalDistance - usedSpace
  let lastPieceSize: number | undefined
  let isExact = Math.abs(remainingSpace) < 0.01 // Tolerancia de 0.01 pulgadas

  // Si cutLastPiece está activado y hay espacio sobrante
  if (cutLastPiece && remainingSpace > 0.01 && numberOfPieces > 0) {
    // Agregar una pieza más y calcular su tamaño
    numberOfPieces += 1

    // Recalcular espacios si es necesario
    if (startWithPiece && endWithPiece) {
      numberOfSpaces = numberOfPieces - 1
    } else if (!startWithPiece && !endWithPiece) {
      numberOfSpaces = numberOfPieces + 1
    } else {
      numberOfSpaces = numberOfPieces
    }

    // Calcular el espacio disponible para la última pieza
    const spaceForLastPiece =
      totalDistance -
      (numberOfPieces - 1) * pieceSize -
      numberOfSpaces * spacingSize
    lastPieceSize = Math.max(0, spaceForLastPiece)

    totalPiecesLength = (numberOfPieces - 1) * pieceSize + lastPieceSize
    usedSpace = totalPiecesLength + numberOfSpaces * spacingSize
    remainingSpace = totalDistance - usedSpace
    isExact = Math.abs(remainingSpace) < 0.01
  }

  return {
    numberOfPieces,
    numberOfSpaces,
    totalPiecesLength,
    totalSpacesLength,
    remainingSpace,
    isExact,
    lastPieceSize
  }
}

/**
 * Calcula el tamaño de espacios necesarios dado un número fijo de piezas
 */
export function calculateSpacingSize(
  params: SpacingCalculationParams
): SpacingCalculationResult {
  const {
    totalDistance,
    pieceSize,
    numberOfPieces,
    startWithPiece,
    endWithPiece
  } = params

  // Validaciones básicas
  if (totalDistance <= 0 || pieceSize <= 0 || numberOfPieces <= 0) {
    return {
      spacingSize: 0,
      numberOfSpaces: 0,
      totalPiecesLength: 0,
      totalSpacesLength: 0,
      isValid: false,
      errorMessage: 'Invalid input values'
    }
  }

  const totalPiecesLength = numberOfPieces * pieceSize

  // Verificar que las piezas no excedan la distancia total
  if (totalPiecesLength > totalDistance) {
    return {
      spacingSize: 0,
      numberOfSpaces: 0,
      totalPiecesLength,
      totalSpacesLength: 0,
      isValid: false,
      errorMessage: 'Pieces are too large for the total distance'
    }
  }

  // Calcular número de espacios según las opciones
  let numberOfSpaces: number

  if (startWithPiece && endWithPiece) {
    // Patrón: P-E-P-E-P
    numberOfSpaces = numberOfPieces - 1
  } else if (!startWithPiece && !endWithPiece) {
    // Patrón: E-P-E-P-E
    numberOfSpaces = numberOfPieces + 1
  } else {
    // Patrón: P-E-P-E o E-P-E-P
    numberOfSpaces = numberOfPieces
  }

  // Verificar que haya al menos un espacio
  if (numberOfSpaces <= 0) {
    if (startWithPiece && endWithPiece && numberOfPieces === 1) {
      // Caso especial: una sola pieza que empieza y termina
      return {
        spacingSize: 0,
        numberOfSpaces: 0,
        totalPiecesLength,
        totalSpacesLength: 0,
        isValid: true
      }
    }
    return {
      spacingSize: 0,
      numberOfSpaces: 0,
      totalPiecesLength,
      totalSpacesLength: 0,
      isValid: false,
      errorMessage: 'Not enough pieces for the selected pattern'
    }
  }

  // Calcular el tamaño de cada espacio
  const totalSpacesLength = totalDistance - totalPiecesLength
  const spacingSize = totalSpacesLength / numberOfSpaces

  // Verificar que el spacing sea positivo
  if (spacingSize < 0) {
    return {
      spacingSize: 0,
      numberOfSpaces,
      totalPiecesLength,
      totalSpacesLength: 0,
      isValid: false,
      errorMessage: 'Not enough space for the pieces'
    }
  }

  return {
    spacingSize,
    numberOfSpaces,
    totalPiecesLength,
    totalSpacesLength,
    isValid: true
  }
}
