'use client'

import React, { useEffect, useRef, useState } from 'react'

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur-up' | 'none'

interface RevealProps {
  children: React.ReactNode
  direction?: RevealDirection
  delay?: number
  duration?: number
  distance?: number
  threshold?: number
  className?: string
  once?: boolean
}

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 750,
  distance = 36,
  threshold = 0.12,
  className = '',
  once = true
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Intersection Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px'
      }
    )

    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [threshold, once])

  // Get initial transform style based on direction
  const getInitialStyle = (): React.CSSProperties => {
    let transform = 'none'

    switch (direction) {
      case 'up':
        transform = `translate3d(0, ${distance}px, 0)`
        break
      case 'down':
        transform = `translate3d(0, -${distance}px, 0)`
        break
      case 'left':
        transform = `translate3d(-${distance}px, 0, 0)`
        break
      case 'right':
        transform = `translate3d(${distance}px, 0, 0)`
        break
      case 'scale':
        transform = 'scale3d(0.92, 0.92, 1)'
        break
      case 'blur-up':
        transform = `translate3d(0, ${distance}px, 0)`
        break
      default:
        transform = 'none'
    }

    return {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translate3d(0, 0, 0) scale3d(1, 1, 1)' : transform,
      filter: direction === 'blur-up' ? (isVisible ? 'blur(0px)' : 'blur(8px)') : undefined,
      transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      willChange: 'opacity, transform'
    }
  }

  return (
    <div ref={ref} style={getInitialStyle()} className={className}>
      {children}
    </div>
  )
}

interface StaggerRevealProps {
  children: React.ReactNode
  staggerDelay?: number
  baseDelay?: number
  direction?: RevealDirection
  className?: string
}

export function StaggerReveal({
  children,
  staggerDelay = 120,
  baseDelay = 0,
  direction = 'up',
  className = ''
}: StaggerRevealProps) {
  const items = React.Children.toArray(children)

  return (
    <div className={className}>
      {items.map((child, index) => (
        <Reveal
          key={index}
          direction={direction}
          delay={baseDelay + index * staggerDelay}
        >
          {child}
        </Reveal>
      ))}
    </div>
  )
}
