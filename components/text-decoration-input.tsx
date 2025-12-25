"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, Type } from "lucide-react"

interface TextDecorationOptions {
  fontFamily: string
  fontSize: number
  color: string
  fontWeight: string
  fontStyle: string
}

interface TextDecorationInputProps {
  onAddTextDecoration: (text: string, options: TextDecorationOptions) => void
  onClose: () => void
}

const FONT_FAMILIES = [
  { value: "Arial", label: "Arial" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Georgia", label: "Georgia" },
  { value: "Verdana", label: "Verdana" },
  { value: "Comic Sans MS", label: "Comic Sans MS" },
  { value: "Impact", label: "Impact" },
  { value: "Trebuchet MS", label: "Trebuchet MS" },
]

const FONT_WEIGHTS = [
  { value: "normal", label: "正常" },
  { value: "bold", label: "粗体" },
  { value: "lighter", label: "细体" },
]

const FONT_STYLES = [
  { value: "normal", label: "正常" },
  { value: "italic", label: "斜体" },
]

const PRESET_COLORS = [
  "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", 
  "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080"
]

export function TextDecorationInput({
  onAddTextDecoration,
  onClose,
}: TextDecorationInputProps) {
  const [text, setText] = useState("")
  const [fontFamily, setFontFamily] = useState("Arial")
  const [fontSize, setFontSize] = useState(24)
  const [color, setColor] = useState("#FF0000")
  const [fontWeight, setFontWeight] = useState("normal")
  const [fontStyle, setFontStyle] = useState("normal")

  const handleAdd = () => {
    if (!text.trim()) return
    
    const options: TextDecorationOptions = {
      fontFamily,
      fontSize,
      color,
      fontWeight,
      fontStyle,
    }
    
    onAddTextDecoration(text, options)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
      {/* 背景遮罩，用于点击关闭 */}
      <div
        className="absolute inset-0 bg-background/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <Card className="relative z-10 p-4 bg-card/95 backdrop-blur-sm border-2 shadow-lg min-w-[320px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Type className="h-4 w-4" />
            添加文字装饰
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* 文字输入 */}
          <div className="space-y-2">
            <Label htmlFor="text">文字内容</Label>
            <Input
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入装饰文字..."
              maxLength={20}
            />
          </div>

          {/* 字体选择 */}
          <div className="space-y-2">
            <Label>字体</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILIES.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        {/* 字体大小 */}
        <div className="space-y-2">
          <Label htmlFor="fontSize">字体大小: {fontSize}px</Label>
          <input
            id="fontSize"
            type="range"
            min="12"
            max="72"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* 字体粗细 */}
        <div className="space-y-2">
          <Label>字体粗细</Label>
          <Select value={fontWeight} onValueChange={setFontWeight}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_WEIGHTS.map((weight) => (
                <SelectItem key={weight.value} value={weight.value}>
                  {weight.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 字体样式 */}
        <div className="space-y-2">
          <Label>字体样式</Label>
          <Select value={fontStyle} onValueChange={setFontStyle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_STYLES.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 颜色选择 */}
        <div className="space-y-2">
          <Label htmlFor="color">文字颜色</Label>
          <div className="flex items-center gap-2">
            <Input
              id="color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-10 p-1 border rounded cursor-pointer"
            />
            <Input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#FF0000"
              className="flex-1"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => setColor(presetColor)}
                className="w-6 h-6 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors"
                style={{ backgroundColor: presetColor }}
                title={presetColor}
              />
            ))}
          </div>
        </div>

          {/* 预览 */}
          <div className="space-y-2">
            <Label>预览</Label>
            <div className="p-3 bg-muted/30 rounded-lg min-h-[60px] flex items-center justify-center">
              <span
                style={{
                  fontFamily,
                  fontSize: `${Math.min(fontSize, 48)}px`, // 限制最大字体大小
                  color,
                  fontWeight,
                  fontStyle,
                  transform: `scale(0.8)`,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '200px',
                  display: 'inline-block',
                }}
              >
                {text || "预览文字"}
              </span>
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!text.trim()}
              className="flex-1"
            >
              添加文字
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}