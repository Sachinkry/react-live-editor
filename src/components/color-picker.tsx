"use client"

import type React from "react"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const colors = [
    "#ef4444", // red
    "#f97316", // orange
    "#22c55e", // green
    "#8b5cf6", // purple
  ]

  return (
    <div className="grid grid-cols-4 ">
      {colors.map((color) => (
        <button
          key={color}
          className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            value === color ? "border-blue-500 ring-1 ring-blue-500 ring-offset-2" : "border-gray-300"
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
          aria-label={`Select color ${color}`}
          title={color}
        />
      ))}
    </div>
  )
}

export default ColorPicker
