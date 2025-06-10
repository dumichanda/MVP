// components/ui/slider.tsx - Minimal replacement for @radix-ui/react-slider
"use client"

import * as React from "react"

// Simple utility function
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}

interface SliderProps {
  className?: string
  min?: number
  max?: number
  step?: number
  value?: number[]
  onValueChange?: (value: number[]) => void
  disabled?: boolean
}

const Slider = React.forwardRef<
  React.ElementRef<"div">,
  SliderProps
>(({ className, min = 0, max = 100, step = 1, value = [0], onValueChange, disabled, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = [parseInt(e.target.value)]
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }

  const currentValue = value?.[0] ?? internalValue[0] ?? min

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((currentValue - min) / (max - min)) * 100}%, hsl(var(--secondary)) ${((currentValue - min) / (max - min)) * 100}%, hsl(var(--secondary)) 100%)`
        }}
      />
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid hsl(var(--background));
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid hsl(var(--background));
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
})
Slider.displayName = "Slider"

export { Slider }
