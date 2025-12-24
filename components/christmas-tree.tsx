"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Star, Sparkles } from "lucide-react"
import { DecorationEditor } from "./decoration-editor"

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
  showLights: boolean
  isPlaying: boolean
  decorations: Decoration[]
  onDecorationUpdate: (id: string, updates: Partial<Decoration>) => void
  onDecorationRemove: (id: string) => void
  treeRef?: React.RefObject<HTMLDivElement>
  treeStyle?: "classic" | "snowy" | "minimal" | "pine"
}

export function ChristmasTree({
  lightColor,
  showLights,
  isPlaying,
  decorations,
  onDecorationUpdate,
  onDecorationRemove,
  treeRef: treeRefProp,
  treeStyle = "classic",
}: ChristmasTreeProps) {
  const [clickedOrnaments, setClickedOrnaments] = useState<Set<number>>(new Set())
  const [editingDecoration, setEditingDecoration] = useState<string | null>(null)
  const [draggedDecoration, setDraggedDecoration] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const localTreeRef = useRef<HTMLDivElement>(null)
  const treeRef = treeRefProp ?? localTreeRef
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const dragStartPositionRef = useRef({ x: 0, y: 0 })
  const hasMovedRef = useRef(false)

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

  const handleDecorationClick = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    setEditingDecoration(id)
  }

  const handleCloseEditor = () => {
    setEditingDecoration(null)
  }

  const handleBackgroundClick = () => {
    setEditingDecoration(null)
  }

  const handleDecorationMouseDown = (e: React.MouseEvent, id: string, currentX: number, currentY: number) => {
    e.stopPropagation()

    if (!treeRef.current) return

    const rect = treeRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - currentX
    const offsetY = e.clientY - rect.top - currentY
    
    // 记录初始位置，用于检测是否真的在拖拽
    dragStartPositionRef.current = { x: e.clientX, y: e.clientY }
    hasMovedRef.current = false
    
    setDraggedDecoration(id)
    setDragOffset({ x: offsetX, y: offsetY })
    dragOffsetRef.current = { x: offsetX, y: offsetY }
    isDraggingRef.current = false // 初始设置为false，移动后才设为true
  }

  // 触摸开始：记录偏移并准备拖拽
  const handleDecorationTouchStart = (e: React.TouchEvent, id: string, currentX: number, currentY: number) => {
    e.stopPropagation()

    if (!treeRef.current || e.touches.length === 0) return

    const touch = e.touches[0]
    const rect = treeRef.current.getBoundingClientRect()
    const offsetX = touch.clientX - rect.left - currentX
    const offsetY = touch.clientY - rect.top - currentY

    dragStartPositionRef.current = { x: touch.clientX, y: touch.clientY }
    hasMovedRef.current = false

    setDraggedDecoration(id)
    setDragOffset({ x: offsetX, y: offsetY })
    dragOffsetRef.current = { x: offsetX, y: offsetY }
    isDraggingRef.current = false
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedDecoration || !treeRef.current) return

    // 检测移动距离
    const deltaX = Math.abs(e.clientX - dragStartPositionRef.current.x)
    const deltaY = Math.abs(e.clientY - dragStartPositionRef.current.y)
    
    // 如果移动距离超过5像素，才认为是拖拽
    if (deltaX > 5 || deltaY > 5) {
      isDraggingRef.current = true
      hasMovedRef.current = true
    }

    // 只有在确认是拖拽时才更新位置
    if (isDraggingRef.current) {
      // 使用 requestAnimationFrame 来优化性能
      requestAnimationFrame(() => {
        if (!treeRef.current || !draggedDecoration) return
        
        const rect = treeRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left - dragOffsetRef.current.x
        const y = e.clientY - rect.top - dragOffsetRef.current.y

        onDecorationUpdate(draggedDecoration, { x, y })
      })
    }
  }

  // 触摸移动：更新位置与拖拽状态
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedDecoration || !treeRef.current || e.touches.length === 0) return

    const touch = e.touches[0]

    if (e.cancelable) e.preventDefault() // 阻止页面滚动，提升拖拽体验

    const deltaX = Math.abs(touch.clientX - dragStartPositionRef.current.x)
    const deltaY = Math.abs(touch.clientY - dragStartPositionRef.current.y)

    if (deltaX > 5 || deltaY > 5) {
      isDraggingRef.current = true
      hasMovedRef.current = true
    }

    if (isDraggingRef.current) {
      requestAnimationFrame(() => {
        if (!treeRef.current || !draggedDecoration) return
        const rect = treeRef.current.getBoundingClientRect()
        const x = touch.clientX - rect.left - dragOffsetRef.current.x
        const y = touch.clientY - rect.top - dragOffsetRef.current.y
        onDecorationUpdate(draggedDecoration, { x, y })
      })
    }
  }

  const handleMouseUp = () => {
    // 如果没有移动且正在拖拽某个装饰品，则认为是点击
    if (!hasMovedRef.current && draggedDecoration) {
      // 延迟一点时间再触发点击，避免与mouseup冲突
      setTimeout(() => {
        if (draggedDecoration) {
          handleDecorationClick(draggedDecoration)
        }
      }, 10)
    }
    
    setDraggedDecoration(null)
    isDraggingRef.current = false
    hasMovedRef.current = false
  }

  // 触摸结束：可能触发点击或结束拖拽
  const handleTouchEnd = () => {
    if (!hasMovedRef.current && draggedDecoration) {
      setTimeout(() => {
        if (draggedDecoration) {
          handleDecorationClick(draggedDecoration)
        }
      }, 10)
    }
    setDraggedDecoration(null)
    isDraggingRef.current = false
    hasMovedRef.current = false
  }

  // 全局鼠标事件监听，确保拖拽的流畅性
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!draggedDecoration || !treeRef.current || !isDraggingRef.current) return

      requestAnimationFrame(() => {
        if (!treeRef.current || !draggedDecoration) return
        
        const rect = treeRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left - dragOffsetRef.current.x
        const y = e.clientY - rect.top - dragOffsetRef.current.y

        onDecorationUpdate(draggedDecoration, { x, y })
      })
    }

    const handleGlobalMouseUp = () => {
      setDraggedDecoration(null)
      isDraggingRef.current = false
    }

    const handleGlobalTouchMove = (e: TouchEvent) => {
      // 防止页面在移动端拖拽时滚动
      if (e.cancelable) {
        e.preventDefault()
      }
      if (!draggedDecoration || !treeRef.current || !isDraggingRef.current || e.touches.length === 0) return
      const touch = e.touches[0]
      requestAnimationFrame(() => {
        if (!treeRef.current || !draggedDecoration) return
        const rect = treeRef.current.getBoundingClientRect()
        const x = touch.clientX - rect.left - dragOffsetRef.current.x
        const y = touch.clientY - rect.top - dragOffsetRef.current.y
        onDecorationUpdate(draggedDecoration, { x, y })
      })
    }

    const handleGlobalTouchEnd = () => {
      setDraggedDecoration(null)
      isDraggingRef.current = false
    }

    if (draggedDecoration) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false })
      document.addEventListener('touchend', handleGlobalTouchEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
      document.removeEventListener('touchmove', handleGlobalTouchMove)
      document.removeEventListener('touchend', handleGlobalTouchEnd)
    }
  }, [draggedDecoration, onDecorationUpdate])

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
      className="relative w-full max-w-3xl h-[700px] animate-in zoom-in duration-1000 delay-300 select-none"
      style={{ touchAction: "none", overscrollBehavior: "contain" }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleBackgroundClick}
    >
      <div
        data-export-star
        className="absolute -top-12 left-1/2 -translate-x-1/2 z-30"
        style={{
          animation: isPlaying
            ? "float 3s ease-in-out infinite, rotate-slow 20s linear infinite"
            : "float 3s ease-in-out infinite",
        }}
      >
        <Star
          className="w-20 h-20 drop-shadow-[0_0_25px_rgba(253,224,71,0.9)]"
          style={{ fill: "#FDE047", stroke: "#FACC15" }}
        />
      </div>

      <div className="absolute inset-0 flex flex-col items-center pt-4">
        {treeStyle === "pine" && (
          <>
            <svg
              width="420"
              height="420"
              viewBox="0 0 420 420"
              className="filter drop-shadow-md"
              style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.35))" }}
            >
              <path
                d="M210 10 C 190 40, 170 55, 160 70 C 150 90, 130 95, 120 110 C 110 130, 90 135, 80 150 C 70 170, 55 180, 50 195 C 45 210, 60 220, 70 235 C 85 250, 95 260, 90 275 C 85 290, 95 300, 110 312 C 130 325, 150 335, 160 345 C 180 360, 190 370, 210 385 C 230 370, 240 360, 260 345 C 270 335, 290 325, 310 312 C 325 300, 335 290, 330 275 C 325 260, 335 250, 350 235 C 360 220, 375 210, 370 195 C 365 180, 350 170, 340 150 C 330 135, 310 130, 300 110 C 290 95, 270 90, 260 70 C 250 55, 230 40, 210 10 Z"
                fill="#2D5016"
              />
              <path
                d="M210 35 C 195 55, 175 70, 165 85 C 155 100, 135 105, 125 120 C 115 135, 95 140, 85 155 C 75 170, 65 180, 60 195 C 58 205, 66 212, 74 222 C 86 236, 95 245, 92 258 C 90 268, 98 279, 112 290 C 128 302, 148 313, 168 325 C 186 336, 198 346, 210 355 C 222 346, 234 336, 252 325 C 272 313, 292 302, 308 290 C 322 279, 330 268, 328 258 C 325 245, 334 236, 346 222 C 354 212, 362 205, 360 195 C 355 180, 345 170, 335 155 C 325 140, 305 135, 295 120 C 285 105, 265 100, 255 85 C 245 70, 225 55, 210 35 Z"
                fill="#3D6B1F"
              />
            </svg>
            <div className="relative mt-2 flex justify-center">
              <div
                className="w-20 h-24 rounded-md"
                style={{
                  background: "linear-gradient(to right, #5D4037, #6D4C41, #5D4037)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4), inset -2px 0 4px rgba(0,0,0,0.3)",
                }}
              />
            </div>
          </>
        )}
        {/* Top section */}
        <div
          className="relative"
          style={{
            display: treeStyle === "pine" ? "none" : undefined,
            width: 0,
            height: 0,
            borderLeft: "100px solid transparent",
            borderRight: "100px solid transparent",
            borderBottom: "140px solid #2D5016",
            filter: treeStyle === "minimal" ? "none" : "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
          }}
        >
          {treeStyle !== "minimal" && (
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
          )}
          {/* 雪景整体下移：顶层不再加雪帽 */}
        </div>

        {/* Second section */}
        <div
          className="relative -mt-6"
          style={{
            display: treeStyle === "pine" ? "none" : undefined,
            width: 0,
            height: 0,
            borderLeft: "140px solid transparent",
            borderRight: "140px solid transparent",
            borderBottom: "150px solid #2D5016",
            filter: treeStyle === "minimal" ? "none" : "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
          }}
        >
          {treeStyle !== "minimal" && (
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
          )}
          {treeStyle === "snowy" && (
            <div
              className="absolute"
              style={{
                width: 0,
                height: 0,
                borderLeft: "120px solid transparent",
                borderRight: "120px solid transparent",
                borderBottom: "22px solid rgba(255,255,255,0.95)",
                left: "-120px",
                top: "6px",
              }}
            />
          )}
        </div>

        {/* Third section */}
        <div
          className="relative -mt-6"
          style={{
            display: treeStyle === "pine" ? "none" : undefined,
            width: 0,
            height: 0,
            borderLeft: "180px solid transparent",
            borderRight: "180px solid transparent",
            borderBottom: "170px solid #2D5016",
            filter: treeStyle === "minimal" ? "none" : "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
          }}
        >
          {treeStyle !== "minimal" && (
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
          )}
          {treeStyle === "snowy" && (
            <div
              className="absolute"
              style={{
                width: 0,
                height: 0,
                borderLeft: "160px solid transparent",
                borderRight: "160px solid transparent",
                borderBottom: "24px solid rgba(255,255,255,0.95)",
                left: "-160px",
                top: "6px",
              }}
            />
          )}
        </div>

        {/* Bottom section */}
        <div
          className="relative -mt-6"
          style={{
            display: treeStyle === "pine" ? "none" : undefined,
            width: 0,
            height: 0,
            borderLeft: "220px solid transparent",
            borderRight: "220px solid transparent",
            borderBottom: "180px solid #2D5016",
            filter: treeStyle === "minimal" ? "none" : "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
          }}
        >
          {treeStyle !== "minimal" && (
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
          )}
          {treeStyle === "snowy" && (
            <div
              className="absolute"
              style={{
                width: 0,
                height: 0,
                borderLeft: "200px solid transparent",
                borderRight: "200px solid transparent",
                borderBottom: "24px solid rgba(255,255,255,0.95)",
                left: "-200px",
                top: "6px",
                zIndex: 5,
              }}
            />
          )}
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

      {showLights && ornaments.map((ornament, index) => {
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
            className={`absolute z-30 select-none hover:drop-shadow-lg hover:brightness-110 hover:scale-105 ${
              draggedDecoration === decoration.id 
                ? "cursor-grabbing transition-none" 
                : "cursor-grab transition-all"
            }`}
            style={{
              left: `${decoration.x}px`,
              top: `${decoration.y}px`,
              transform: `rotate(${decoration.rotation}deg) scale(${decoration.scale})`,
              willChange: draggedDecoration === decoration.id ? "transform" : "auto",
            }}
          onMouseDown={(e) => handleDecorationMouseDown(e, decoration.id, decoration.x, decoration.y)}
          onTouchStart={(e) => handleDecorationTouchStart(e, decoration.id, decoration.x, decoration.y)}
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

      {/* 编辑器弹窗 */}
      {editingDecoration && (() => {
        const decoration = decorations.find(d => d.id === editingDecoration)
        if (!decoration) return null

        return (
          <DecorationEditor
            decoration={decoration}
            onUpdate={onDecorationUpdate}
            onDelete={onDecorationRemove}
            onClose={handleCloseEditor}
          />
        )
      })()}

      <div
        className="absolute inset-0 -z-10 blur-3xl opacity-30"
        style={{
          background: "radial-gradient(ellipse at center, #6BCB77 0%, transparent 70%)",
        }}
      />
    </div>
  )
}
