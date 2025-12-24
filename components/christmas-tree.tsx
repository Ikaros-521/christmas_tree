"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Star, Sparkles } from "lucide-react"

interface Decoration {
  id: string
  type: "emoji" | "image"
  content: string
  x: number
  y: number
  rotation: number
  scale: number
}

interface ChristmasTreeProps {
  lightColor: "rainbow" | "warm" | "cool"
  isPlaying: boolean
  decorations: Decoration[]
  onDecorationUpdate: (id: string, updates: Partial<Decoration>) => void
  onDecorationRemove: (id: string) => void
}

export function ChristmasTree({
  lightColor,
  isPlaying,
  decorations,
  onDecorationUpdate,
  onDecorationRemove,
}: ChristmasTreeProps) {
  const [clickedOrnaments, setClickedOrnaments] = useState<Set<number>>(new Set())
  const [draggedDecoration, setDraggedDecoration] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const treeRef = useRef<HTMLDivElement>(null)

  const handleOrnamentClick = (id: number) => {
    setClickedOrnaments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleDecorationMouseDown = (e: React.MouseEvent, id: string, currentX: number, currentY: number) => {
    e.preventDefault()
    e.stopPropagation()

    if (!treeRef.current) return

    const rect = treeRef.current.getBoundingClientRect()
    setDraggedDecoration(id)
    setDragOffset({
      x: e.clientX - rect.left - currentX,
      y: e.clientY - rect.top - currentY,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedDecoration || !treeRef.current) return

    const rect = treeRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - dragOffset.x
    const y = e.clientY - rect.top - dragOffset.y

    onDecorationUpdate(draggedDecoration, { x, y })
  }

  const handleMouseUp = () => {
    setDraggedDecoration(null)
  }

  const handleWheel = (e: React.WheelEvent, id: string, currentScale: number) => {
    e.preventDefault()
    e.stopPropagation()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newScale = Math.max(0.3, Math.min(3, currentScale + delta))
    onDecorationUpdate(id, { scale: newScale })
  }

  const handleDoubleClick = (e: React.MouseEvent, id: string, currentRotation: number) => {
    e.preventDefault()
    e.stopPropagation()
    const newRotation = (currentRotation + 45) % 360
    onDecorationUpdate(id, { rotation: newRotation })
  }

  const handleRightClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    onDecorationRemove(id)
  }

  const getLightColor = (index: number) => {
    if (lightColor === "rainbow") {
      const colors = ["#FF6B9D", "#C44569", "#FFA502", "#FFD93D", "#6BCB77", "#4D96FF", "#A569BD", "#EC7063"]
      return colors[index % colors.length]
    } else if (lightColor === "warm") {
      const colors = ["#FFD93D", "#FFA502", "#FF6B6B", "#C44569"]
      return colors[index % colors.length]
    } else {
      const colors = ["#4D96FF", "#6BCB77", "#A569BD", "#48C9B0"]
      return colors[index % colors.length]
    }
  }

  const ornaments = [
    { top: "12%", left: "50%", size: 12, type: "star" as const },
    { top: "18%", left: "45%", size: 8, type: "ball" as const },
    { top: "18%", left: "55%", size: 8, type: "ball" as const },
    { top: "26%", left: "38%", size: 10, type: "ball" as const },
    { top: "26%", left: "62%", size: 10, type: "ball" as const },
    { top: "30%", left: "50%", size: 9, type: "star" as const },
    { top: "32%", left: "42%", size: 8, type: "ball" as const },
    { top: "32%", left: "58%", size: 8, type: "ball" as const },
    { top: "40%", left: "33%", size: 11, type: "ball" as const },
    { top: "40%", left: "67%", size: 11, type: "ball" as const },
    { top: "44%", left: "44%", size: 9, type: "star" as const },
    { top: "44%", left: "56%", size: 9, type: "star" as const },
    { top: "48%", left: "38%", size: 8, type: "ball" as const },
    { top: "48%", left: "50%", size: 10, type: "ball" as const },
    { top: "48%", left: "62%", size: 8, type: "ball" as const },
    { top: "56%", left: "28%", size: 11, type: "ball" as const },
    { top: "56%", left: "72%", size: 11, type: "ball" as const },
    { top: "60%", left: "40%", size: 10, type: "star" as const },
    { top: "60%", left: "60%", size: 10, type: "star" as const },
    { top: "62%", left: "50%", size: 12, type: "ball" as const },
    { top: "64%", left: "34%", size: 9, type: "ball" as const },
    { top: "64%", left: "66%", size: 9, type: "ball" as const },
    { top: "70%", left: "25%", size: 10, type: "ball" as const },
    { top: "70%", left: "75%", size: 10, type: "ball" as const },
    { top: "72%", left: "38%", size: 8, type: "star" as const },
    { top: "72%", left: "50%", size: 9, type: "ball" as const },
    { top: "72%", left: "62%", size: 8, type: "star" as const },
    { top: "76%", left: "32%", size: 8, type: "ball" as const },
    { top: "76%", left: "68%", size: 8, type: "ball" as const },
  ]

  return (
    <div
      ref={treeRef}
      className="relative w-full max-w-3xl h-[700px] animate-in zoom-in duration-1000 delay-300"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="absolute -top-12 left-1/2 -translate-x-1/2 z-30"
        style={{
          animation: isPlaying
            ? "float 3s ease-in-out infinite, rotate-slow 20s linear infinite"
            : "float 3s ease-in-out infinite",
        }}
      >
        <Star className="w-20 h-20 fill-yellow-300 text-yellow-400 drop-shadow-[0_0_25px_rgba(253,224,71,0.9)]" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center pt-4">
        {/* Top section */}
        <div
          className="relative"
          style={{
            width: 0,
            height: 0,
            borderLeft: "100px solid transparent",
            borderRight: "100px solid transparent",
            borderBottom: "140px solid #2D5016",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
          }}
        >
          <div
            className="absolute"
            style={{
              width: 0,
              height: 0,
              borderLeft: "95px solid transparent",
              borderRight: "95px solid transparent",
              borderBottom: "135px solid #3D6B1F",
              left: "-95px",
              top: "2px",
            }}
          />
        </div>

        {/* Second section */}
        <div
          className="relative -mt-6"
          style={{
            width: 0,
            height: 0,
            borderLeft: "140px solid transparent",
            borderRight: "140px solid transparent",
            borderBottom: "150px solid #2D5016",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
          }}
        >
          <div
            className="absolute"
            style={{
              width: 0,
              height: 0,
              borderLeft: "135px solid transparent",
              borderRight: "135px solid transparent",
              borderBottom: "145px solid #3D6B1F",
              left: "-135px",
              top: "2px",
            }}
          />
        </div>

        {/* Third section */}
        <div
          className="relative -mt-6"
          style={{
            width: 0,
            height: 0,
            borderLeft: "180px solid transparent",
            borderRight: "180px solid transparent",
            borderBottom: "170px solid #2D5016",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
          }}
        >
          <div
            className="absolute"
            style={{
              width: 0,
              height: 0,
              borderLeft: "175px solid transparent",
              borderRight: "175px solid transparent",
              borderBottom: "165px solid #3D6B1F",
              left: "-175px",
              top: "2px",
            }}
          />
        </div>

        {/* Bottom section */}
        <div
          className="relative -mt-6"
          style={{
            width: 0,
            height: 0,
            borderLeft: "220px solid transparent",
            borderRight: "220px solid transparent",
            borderBottom: "180px solid #2D5016",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
          }}
        >
          <div
            className="absolute"
            style={{
              width: 0,
              height: 0,
              borderLeft: "215px solid transparent",
              borderRight: "215px solid transparent",
              borderBottom: "175px solid #3D6B1F",
              left: "-215px",
              top: "2px",
            }}
          />
        </div>

        <div className="relative mt-2">
          <div
            className="w-20 h-24 rounded-md relative"
            style={{
              background: "linear-gradient(to right, #5D4037, #6D4C41, #5D4037)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4), inset -2px 0 4px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      </div>

      {ornaments.map((ornament, index) => {
        const color = getLightColor(index)
        const isClicked = clickedOrnaments.has(index)

        return (
          <button
            key={index}
            onClick={() => handleOrnamentClick(index)}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer hover:scale-125 z-20 focus:outline-none"
            style={{
              top: ornament.top,
              left: ornament.left,
              width: `${ornament.size}px`,
              height: `${ornament.size}px`,
              animation: isPlaying ? `twinkle 2s ease-in-out infinite ${index * 0.15}s` : undefined,
            }}
          >
            {ornament.type === "ball" ? (
              <div
                className="w-full h-full rounded-full transition-all duration-300"
                style={{
                  background: isClicked
                    ? `radial-gradient(circle at 30% 30%, ${color}dd, ${color})`
                    : `radial-gradient(circle at 30% 30%, ${color}88, ${color}cc)`,
                  boxShadow: isClicked
                    ? `0 0 15px ${color}, 0 0 30px ${color}, inset -2px -2px 8px rgba(0,0,0,0.3), inset 2px 2px 8px rgba(255,255,255,0.3)`
                    : `0 0 8px ${color}88, inset -2px -2px 6px rgba(0,0,0,0.2), inset 2px 2px 6px rgba(255,255,255,0.2)`,
                  animation: isClicked && isPlaying ? "pulse-glow 1.5s ease-in-out infinite" : undefined,
                }}
              />
            ) : (
              <Sparkles
                className="w-full h-full transition-all duration-300"
                style={{
                  color: color,
                  filter: isClicked ? `drop-shadow(0 0 8px ${color}) brightness(1.5)` : `drop-shadow(0 0 4px ${color})`,
                }}
              />
            )}
          </button>
        )
      })}

      {decorations.map((decoration) => (
        <div
          key={decoration.id}
          className="absolute z-30 select-none transition-shadow hover:drop-shadow-lg hover:brightness-110"
          style={{
            left: `${decoration.x}px`,
            top: `${decoration.y}px`,
            transform: `rotate(${decoration.rotation}deg) scale(${decoration.scale})`,
            cursor: draggedDecoration === decoration.id ? "grabbing" : "grab",
          }}
          onMouseDown={(e) => handleDecorationMouseDown(e, decoration.id, decoration.x, decoration.y)}
          onWheel={(e) => handleWheel(e, decoration.id, decoration.scale)}
          onDoubleClick={(e) => handleDoubleClick(e, decoration.id, decoration.rotation)}
          onContextMenu={(e) => handleRightClick(e, decoration.id)}
        >
          {decoration.type === "emoji" ? (
            <span className="text-4xl pointer-events-none">{decoration.content}</span>
          ) : (
            <img
              src={decoration.content || "/placeholder.svg"}
              alt="decoration"
              className="w-16 h-16 object-contain pointer-events-none"
              draggable={false}
            />
          )}
        </div>
      ))}

      <div
        className="absolute inset-0 -z-10 blur-3xl opacity-30"
        style={{
          background: "radial-gradient(ellipse at center, #6BCB77 0%, transparent 70%)",
        }}
      />
    </div>
  )
}
