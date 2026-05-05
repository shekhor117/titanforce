"use client"

import { useState, useRef, useEffect } from "react"
import { Pencil, Eraser, Circle, ArrowRight, Undo, Download, Palette } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

type Tool = "draw" | "erase" | "circle" | "arrow"

interface DrawingPoint {
  x: number
  y: number
  color: string
  size: number
  isNewLine?: boolean
}

export function TacticalBoard() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<Tool>("draw")
  const [color, setColor] = useState("#dc2626")
  const [brushSize, setBrushSize] = useState(3)
  const [points, setPoints] = useState<DrawingPoint[]>([])
  const [history, setHistory] = useState<DrawingPoint[][]>([])

  const colors = ["#dc2626", "#ffffff", "#fbbf24", "#22c55e", "#3b82f6"]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw field
    ctx.fillStyle = "#1a472a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Field markings
    ctx.strokeStyle = "rgba(255,255,255,0.4)"
    ctx.lineWidth = 2

    // Border
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)
    
    // Center line
    ctx.beginPath()
    ctx.moveTo(20, canvas.height / 2)
    ctx.lineTo(canvas.width - 20, canvas.height / 2)
    ctx.stroke()

    // Center circle
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2)
    ctx.stroke()

    // Penalty areas
    ctx.strokeRect(canvas.width / 2 - 80, 20, 160, 60)
    ctx.strokeRect(canvas.width / 2 - 80, canvas.height - 80, 160, 60)

    // Goal areas
    ctx.strokeRect(canvas.width / 2 - 40, 20, 80, 25)
    ctx.strokeRect(canvas.width / 2 - 40, canvas.height - 45, 80, 25)

    // Redraw points
    if (points.length > 0) {
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      let lastPoint: DrawingPoint | null = null
      points.forEach(point => {
        if (point.isNewLine || !lastPoint) {
          ctx.beginPath()
          ctx.moveTo(point.x, point.y)
        } else {
          ctx.strokeStyle = point.color
          ctx.lineWidth = point.size
          ctx.lineTo(point.x, point.y)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(point.x, point.y)
        }
        lastPoint = point
      })
    }
  }, [points])

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (tool === "erase") {
      setHistory(prev => [...prev, [...points]])
      setPoints([])
      return
    }

    setIsDrawing(true)
    const coords = getCanvasCoords(e)
    setHistory(prev => [...prev, [...points]])
    setPoints(prev => [
      ...prev,
      { ...coords, color: tool === "draw" ? color : color, size: brushSize, isNewLine: true },
    ])
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || tool === "erase") return

    const coords = getCanvasCoords(e)
    setPoints(prev => [...prev, { ...coords, color, size: brushSize }])
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const handleUndo = () => {
    if (history.length > 0) {
      setPoints(history[history.length - 1])
      setHistory(prev => prev.slice(0, -1))
    }
  }

  const handleClear = () => {
    setHistory(prev => [...prev, [...points]])
    setPoints([])
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "tactical-board.png"
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className={`text-sm uppercase tracking-[0.2em] font-semibold mb-2 text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "কৌশল" : "STRATEGY"}
          </p>
          <h2 className={`text-4xl md:text-5xl tracking-wide text-foreground ${isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"}`}>
            {isBn ? "ট্যাকটিক্যাল বোর্ড" : "TACTICAL BOARD"}
          </h2>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 p-3 rounded-xl bg-card border-2 border-secondary">
          <div className="flex gap-1">
            <button
              onClick={() => setTool("draw")}
              className={`p-2.5 rounded transition ${tool === "draw" ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-foreground hover:bg-secondary"}`}
              title="Draw"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTool("erase")}
              className={`p-2.5 rounded transition ${tool === "erase" ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-foreground hover:bg-secondary"}`}
              title="Erase All"
            >
              <Eraser className="w-5 h-5" />
            </button>
          </div>

          <div className="w-px h-8 bg-border mx-2" />

          <div className="flex items-center gap-1">
            <Palette className="w-4 h-4 text-foreground/60" />
            {colors.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full border-2 transition ${color === c ? "border-white scale-110" : "border-transparent"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="w-px h-8 bg-border mx-2" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground/60">{isBn ? "সাইজ" : "Size"}</span>
            <input
              type="range"
              min="1"
              max="10"
              value={brushSize}
              onChange={e => setBrushSize(Number(e.target.value))}
              className="w-20 accent-primary"
            />
          </div>

          <div className="w-px h-8 bg-border mx-2" />

          <div className="flex gap-1">
            <button
              onClick={handleUndo}
              className="p-2.5 rounded bg-secondary/50 text-foreground hover:bg-secondary transition"
              title="Undo"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button
              onClick={handleClear}
              className="p-2.5 rounded bg-secondary/50 text-foreground hover:bg-secondary transition"
              title="Clear"
            >
              <Eraser className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2.5 rounded bg-primary text-primary-foreground hover:opacity-90 transition"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="rounded-xl overflow-hidden border-2 border-secondary shadow-xl">
          <canvas
            ref={canvasRef}
            width={600}
            height={800}
            className="w-full touch-none cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        <p className={`text-center text-sm text-foreground/60 mt-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "মাঠে আঁকুন এবং আপনার কৌশল ডাউনলোড করুন" : "Draw on the field and download your tactics"}
        </p>
      </div>
    </section>
  )
}
