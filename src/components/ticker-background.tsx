'use client'

import React from 'react'

const row1 = [
  'VIKM GROUP',
  'ARCHITECTURE',
  'CONSTRUCTION',
  'CUSTOM FURNITURE',
  'INTERIOR DESIGN',
  'DIGITAL SOLUTIONS',
  'KIGALI · RWANDA',
  'BRANDING & PACKAGING',
]

const row2 = [
  '01 PLANNING',
  '02 DESIGN',
  '03 COORDINATION',
  '04 EXECUTION',
  '05 CRAFTSMANSHIP',
  '06 DELIVERY',
  '1°57\'S 30°06\'E',
  'RESIDENTIAL & COMMERCIAL',
]

const row3 = [
  'BESPOKE CABINETRY',
  'STRUCTURAL ENGINEERING',
  '3D VISUALISATION',
  'MADE TO MEASURE',
  'SUSTAINABLE MATERIALS',
  'KITCHEN FIT-OUT',
  'TURNKEY FINISHING',
]

export function TickerBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-20" aria-hidden="true">
      {/* Subtle architectural grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.15]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Ambient gradient lighting */}
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[var(--timber)]/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-[var(--timber)]/15 blur-3xl" />

      {/* Ticker rows */}
      <div className="flex h-full flex-col justify-around py-4">
        {/* Track 1: Moving left */}
        <div className="overflow-hidden py-1">
          <div className="animate-ticker-left text-xs font-semibold uppercase tracking-[0.35em] text-white/40">
            {[...row1, ...row1, ...row1, ...row1].map((item, idx) => (
              <span key={idx} className="mx-6 flex items-center gap-6">
                <span>{item}</span>
                <span className="text-[var(--timber)] opacity-70">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Track 2: Large ghost outline text moving right */}
        <div className="overflow-hidden py-2">
          <div className="animate-ticker-right text-3xl font-extrabold uppercase tracking-[0.25em] text-white/10 md:text-5xl">
            {[...row2, ...row2, ...row2, ...row2].map((item, idx) => (
              <span key={idx} className="mx-8 flex items-center gap-8">
                <span>{item}</span>
                <span className="text-[var(--timber)] opacity-50">///</span>
              </span>
            ))}
          </div>
        </div>

        {/* Track 3: Moving left */}
        <div className="overflow-hidden py-1">
          <div className="animate-ticker-slow text-xs font-medium uppercase tracking-[0.3em] text-white/35">
            {[...row3, ...row3, ...row3, ...row3].map((item, idx) => (
              <span key={idx} className="mx-6 flex items-center gap-6">
                <span>{item}</span>
                <span className="text-[var(--timber)] opacity-70">+</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Vignette gradients on top and bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--ink)] via-transparent to-[var(--ink)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)]/80 via-transparent to-[var(--ink)]/80" />
    </div>
  )
}

