'use client'

import { formatMeasurementWithFractions } from '@/lib/measurement-utils'

interface SpacingDiagramProps {
  numberOfPieces: number
  numberOfSpaces: number
  pieceSize: number
  spacingSize: number
  totalDistance: number
  lastPieceSize?: number
  startWithPiece: boolean
}

export function SpacingDiagram({
  numberOfPieces,
  numberOfSpaces,
  pieceSize,
  spacingSize,
  totalDistance,
  lastPieceSize,
  startWithPiece
}: SpacingDiagramProps) {
  // Calcular el ancho proporcional de cada elemento
  const maxWidth = 100 // Porcentaje del contenedor

  // Crear array de elementos en orden
  const elements: Array<{
    type: 'piece' | 'space'
    size: number
    index: number
  }> = []

  if (startWithPiece) {
    // Empieza con pieza
    for (let i = 0; i < numberOfPieces; i++) {
      const isLastPiece = i === numberOfPieces - 1
      const size =
        isLastPiece && lastPieceSize !== undefined ? lastPieceSize : pieceSize
      elements.push({ type: 'piece', size, index: i })

      // Agregar espacio después de la pieza si no es la última
      if (i < numberOfPieces - 1) {
        elements.push({ type: 'space', size: spacingSize, index: i })
      }
    }
  } else {
    // Empieza con espacio
    for (let i = 0; i < numberOfSpaces; i++) {
      elements.push({ type: 'space', size: spacingSize, index: i })

      // Agregar pieza después del espacio si no es el último
      if (i < numberOfPieces) {
        const isLastPiece = i === numberOfPieces - 1
        const size =
          isLastPiece && lastPieceSize !== undefined ? lastPieceSize : pieceSize
        elements.push({ type: 'piece', size, index: i })
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Título del diagrama */}
      <div className="text-sm font-medium text-muted-foreground">
        Layout Diagram
      </div>

      {/* Contenedor del diagrama con scroll horizontal en móvil */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-150 space-y-3">
          {/* Cotas superiores */}
          <div className="flex items-end h-8">
            {elements.map((element, idx) => {
              const widthPercent = (element.size / totalDistance) * maxWidth
              return (
                <div
                  key={`cota-${element.type}-${idx}`}
                  className="flex flex-col items-center justify-end"
                  style={{ width: `${widthPercent}%` }}
                >
                  {element.type === 'piece' && (
                    <div className="text-xs text-center text-zinc-900 dark:text-zinc-100 font-medium px-1">
                      {formatMeasurementWithFractions(element.size)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Elementos visuales (piezas y espacios) */}
          <div className="flex items-center h-16 border-y border-zinc-300 dark:border-zinc-700">
            {elements.map((element, idx) => {
              const widthPercent = (element.size / totalDistance) * maxWidth
              const isLastPiece =
                element.type === 'piece' &&
                lastPieceSize !== undefined &&
                element.index === numberOfPieces - 1

              return (
                <div
                  key={`element-${element.type}-${idx}`}
                  className={`h-full flex items-center justify-center text-xs font-medium border-r last:border-r-0 ${
                    element.type === 'piece'
                      ? isLastPiece
                        ? 'bg-red-600 dark:bg-red-700 text-white border-red-700 dark:border-red-800'
                        : 'bg-zinc-900 dark:bg-zinc-800 text-white border-zinc-950 dark:border-zinc-900'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700'
                  }`}
                  style={{ width: `${widthPercent}%` }}
                >
                  {element.type === 'piece' ? (
                    <span className="rotate-0 whitespace-nowrap px-1">
                      {isLastPiece ? 'Cut' : `P${element.index + 1}`}
                    </span>
                  ) : (
                    <span className="text-[10px]">
                      {widthPercent > 3 &&
                        formatMeasurementWithFractions(element.size)}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Cotas inferiores (espacios) */}
          <div className="flex items-start h-8">
            {elements.map((element, idx) => {
              const widthPercent = (element.size / totalDistance) * maxWidth
              return (
                <div
                  key={`cota-bottom-${element.type}-${idx}`}
                  className="flex flex-col items-center justify-start"
                  style={{ width: `${widthPercent}%` }}
                >
                  {element.type === 'space' && (
                    <div className="text-xs text-center text-zinc-600 dark:text-zinc-400 font-medium px-1">
                      {formatMeasurementWithFractions(element.size)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Cota total */}
          <div className="relative pt-2">
            <div className="absolute inset-x-0 top-0 h-px bg-zinc-400 dark:bg-zinc-600" />
            <div className="absolute left-0 top-0 w-2 h-2 border-l-2 border-b-2 border-zinc-400 dark:border-zinc-600" />
            <div className="absolute right-0 top-0 w-2 h-2 border-r-2 border-b-2 border-zinc-400 dark:border-zinc-600" />
            <div className="text-center text-sm font-semibold text-zinc-700 dark:text-zinc-300 pt-3">
              Total: {formatMeasurementWithFractions(totalDistance)}
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-zinc-900 dark:bg-zinc-800 rounded" />
          <span>Piece</span>
        </div>
        {lastPieceSize !== undefined && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 dark:bg-red-700 rounded" />
            <span>Cut Piece</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded" />
          <span>Space</span>
        </div>
      </div>
    </div>
  )
}
