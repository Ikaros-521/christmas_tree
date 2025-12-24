"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { X, RotateCw, ZoomIn, Trash2 } from "lucide-react"

interface Decoration {
  id: string
  type: "emoji" | "image" | "text"
  content: string
  x: number
  y: number
  rotation: number
  scale: number
  fontFamily?: string
  fontSize?: number
  color?: string
  fontWeight?: string
  fontStyle?: string
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
  const [text, setText] = useState(decoration.content)
  const [fontFamily, setFontFamily] = useState(decoration.fontFamily || "Arial")
  const [fontSize, setFontSize] = useState(decoration.fontSize || 24)
  const [color, setColor] = useState(decoration.color || "#FF0000")
  const [fontWeight, setFontWeight] = useState(decoration.fontWeight || "normal")
  const [fontStyle, setFontStyle] = useState(decoration.fontStyle || "normal")

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
      className="absolute z-40 p-4 bg-card/95 backdrop-blur-sm border-2 shadow-lg min-w-[450px] max-w-[500px]"
      style={{
        left: `${Math.min(Math.max(20, decoration.x + 20), 300)}px`,
        top: `${Math.min(Math.max(20, decoration.y + 20), 300)}px`,
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
      <div className="flex justify-center mb-4 p-3 bg-muted/30 rounded-lg min-h-[80px] flex items-center">
        <div
          className="transition-all duration-300"
          style={{
            transform: `rotate(${rotation}deg) scale(${scale})`,
          }}
        >
          {decoration.type === "emoji" ? (
            <span className="text-4xl">{decoration.content}</span>
          ) : decoration.type === "text" ? (
            <span
              style={{
                fontFamily,
                fontSize: `${fontSize}px`,
                color,
                fontWeight,
                fontStyle,
              }}
            >
              {text}
            </span>
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

      {/* 文字装饰专用控制 */}
      {decoration.type === "text" && (
        <div className="space-y-4 mt-4 pt-3 border-t">
          {/* 第一行：文字内容和字体大小 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">文字内容</label>
              <input
                type="text"
                value={text}
                onChange={(e) => {
                  const newText = e.target.value
                  setText(newText)
                  onUpdate(decoration.id, { content: newText })
                }}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
                maxLength={20}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">字体大小: {fontSize}px</label>
              <input
                type="range"
                min="12"
                max="72"
                value={fontSize}
                onChange={(e) => {
                  const newSize = Number(e.target.value)
                  setFontSize(newSize)
                  onUpdate(decoration.id, { fontSize: newSize })
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* 第二行：字体和字体粗细 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">字体</label>
              <select
                value={fontFamily}
                onChange={(e) => {
                  const newFont = e.target.value
                  setFontFamily(newFont)
                  onUpdate(decoration.id, { fontFamily: newFont })
                }}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
                <option value="Impact">Impact</option>
                <option value="Trebuchet MS">Trebuchet MS</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">粗细</label>
              <select
                value={fontWeight}
                onChange={(e) => {
                  const newWeight = e.target.value
                  setFontWeight(newWeight)
                  onUpdate(decoration.id, { fontWeight: newWeight })
                }}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
              >
                <option value="normal">正常</option>
                <option value="bold">粗体</option>
                <option value="lighter">细体</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">样式</label>
              <select
                value={fontStyle}
                onChange={(e) => {
                  const newStyle = e.target.value
                  setFontStyle(newStyle)
                  onUpdate(decoration.id, { fontStyle: newStyle })
                }}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
              >
                <option value="normal">正常</option>
                <option value="italic">斜体</option>
              </select>
            </div>
          </div>

          {/* 第三行：颜色选择 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">文字颜色</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  const newColor = e.target.value
                  setColor(newColor)
                  onUpdate(decoration.id, { color: newColor })
                }}
                className="w-10 h-10 p-1 border rounded cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => {
                  const newColor = e.target.value
                  setColor(newColor)
                  onUpdate(decoration.id, { color: newColor })
                }}
                className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-sm"
              />
              <div className="flex gap-1 flex-wrap">
                {["#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"].map((presetColor) => (
                  <button
                    key={presetColor}
                    onClick={() => {
                      setColor(presetColor)
                      onUpdate(decoration.id, { color: presetColor })
                    }}
                    className="w-6 h-6 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: presetColor }}
                    title={presetColor}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
