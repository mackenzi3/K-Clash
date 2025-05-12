"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  fallbackSrc?: string
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
  objectPosition?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  fallbackSrc = "/placeholder.svg",
  objectFit = "cover",
  objectPosition = "center",
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Handle placeholder images
  const imageSrc = src || fallbackSrc

  // If it's a placeholder URL, extract dimensions
  if (!src && !width && !height && fallbackSrc.includes("placeholder.svg")) {
    const params = new URLSearchParams(fallbackSrc.split("?")[1] || "")
    width = Number.parseInt(params.get("width") || "300")
    height = Number.parseInt(params.get("height") || "300")
  }

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ width: fill ? "100%" : width, height: fill ? "100%" : height }}
    >
      {isLoading && <Skeleton className="absolute inset-0 z-10" />}

      <Image
        src={error ? fallbackSrc : imageSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          `object-${objectFit}`,
        )}
        style={{ objectPosition }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true)
          setIsLoading(false)
        }}
      />
    </div>
  )
}
