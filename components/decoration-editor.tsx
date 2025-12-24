"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { X, RotateCw, ZoomIn, Trash2 } from "lucide-react"

interface Decoration {
  id: string
  type: "emoji" | "image"
  content: string
  x: number
  y: number
  rotation: number
  scale: number
}

interface DecorationEditorProps {
  decoration: Decoration
  onUpdate: (id: string, updates: Partial<Decoration>) => void
  onDelete: (id: string) => void
  onClose: () => void
}

export function DecorationEditor({
  decoration,
  onUpdate,
  onDelete,
  onClose,
}: DecorationEditorProps) {
  const [rotation, setRotation] = useState(decoration.rotation)
  const [scale, setScale] = useState(decoration.scale)

  const handleRotationChange = (value: number[]) => {
    const newRotation = value[0]
    setRotation(newRotation)
    onUpdate(decoration.id, { rotation: newRotation })
  }

  const handleScaleChange = (value: number[]) => {
    const newScale = value[0]
    setScale(newScale)
    onUpdate(decoration.id, { scale: newScale })
  }

  const handleRotate45 = () => {
    const newRotation = (rotation + 45) % 360
    setRotation(newRotation)
    onUpdate(decoration.id, { rotation: newRotation })
  }

  const handleDelete = () => {
    onDelete(decoration.id)
    onClose()
  }

  const handleQuickScale = (factor: number) => {
    const newScale = Math.max(0.3, Math.min(3, scale * factor))
    setScale(newScale)
    onUpdate(decoration.id, { scale: newScale })
  }

  return (
    <Card 
      className="absolute z-40 p-4 bg-card/95 backdrop-blur-sm border-2 shadow-lg min-w-[280px]"
      style={{
        left: `${Math.min(Math.max(20, decoration.x + 20), 400)}px`,
        top: `${Math.min(Math.max(20, decoration.y + 20), 400)}px`,
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">编辑装饰物</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* 预览装饰物 */}
      <div className="flex justify-center mb-4 p-3 bg-muted/30 rounded-lg">
        <div
          className="transition-all duration-300"
          style={{
            transform: `rotate(${rotation}deg) scale(${scale})`,
          }}
        >
          {decoration.type === "emoji" ? (
            <span className="text-4xl">{decoration.content}</span>
          ) : (
            <img
              src={decoration.content || "/placeholder.svg"}
              alt="decoration"
              className="w-16 h-16 object-contain"
              draggable={false}
            />
          )}
        </div>
      </div>

      {/* 旋转控制 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium flex items-center gap-2">
            <RotateCw className="h-4 w-4" />
            旋转
          </label>
          <span className="text-sm text-muted-foreground">{rotation}°</span>
        </div>
        <Slider
          value={[rotation]}
          onValueChange={handleRotationChange}
          max={360}
          min={0}
          step={1}
          className="w-full"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRotationChange([0])}
            className="flex-1 text-xs"
          >
            重置
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRotate45}
            className="flex-1 text-xs gap-1"
          >
            <RotateCw className="h-3 w-3" />
            +45°
          </Button>
        </div>
      </div>

      {/* 缩放控制 */}
      <div className="space-y-3 mt-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium flex items-center gap-2">
            <ZoomIn className="h-4 w-4" />
            缩放
          </label>
          <span className="text-sm text-muted-foreground">{scale.toFixed(1)}x</span>
        </div>
        <Slider
          value={[scale]}
          onValueChange={handleScaleChange}
          max={3}
          min={0.3}
          step={0.1}
          className="w-full"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickScale(0.8)}
            className="flex-1 text-xs"
          >
            缩小
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickScale(1.2)}
            className="flex-1 text-xs"
          >
            放大
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleScaleChange([1])}
            className="flex-1 text-xs"
          >
            重置
          </Button>
        </div>
      </div>

      {/* 删除按钮 */}
      <div className="mt-4 pt-3 border-t">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="w-full gap-2"
        >
          <Trash2 className="h-4 w-4" />
          删除装饰物
        </Button>
      </div>
    </Card>
  )
}
