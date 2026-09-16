import type { Metadata, Viewport } from 'next'
import './globals.css'
import 'katex/dist/katex.min.css'

export const metadata: Metadata = { 
  title: { 
    default: 'VIKM GROUP | Construction, Architecture & Interiors', 
    template: '%s | VIKM GROUP' 
  }, 
  description: 'VIKM GROUP builds, designs and furnishes complete spaces in Kigali, Rwanda.', 
  keywords: ['construction company Kigali', 'custom furniture Rwanda', 'interior design Kigali', 'architecture Rwanda', 'branding Kigali', 'software development Rwanda'] 
}

export const viewport: Viewport = { 
  colorScheme: 'light', 
  themeColor: '#F5F2ED' 
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { 
  return (
    <html lang="en">
      <body className="antialiased selection:bg-[#c49a45]/20 selection:text-[#1a1918]">
        {children}
      </body>
    </html>
  ) 
}
