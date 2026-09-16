'use client'

import Link from 'next/link'
import { ArrowUpRight, Menu, X, MessageCircle, ShieldCheck } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { site, services } from '@/content/site'
import { GilbertAssistant } from '@/components/ai-assistant'

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'
  const tone = isHome ? 'text-white border-white/20' : 'bg-[var(--bone)] text-[var(--ink)] border-[var(--line)]'
  const muted = isHome ? 'text-white/80 hover:text-white' : 'text-[var(--graphite)] hover:text-[var(--ink)]'
  const button = isHome ? 'border-white/60 text-white hover:border-white hover:bg-white hover:!text-[var(--ink)]' : 'border-[var(--line)] text-[var(--ink)] hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:!text-white'

  return (
    <header className={`inset-x-0 top-0 z-20 border-b ${isHome ? 'absolute bg-black/20 backdrop-blur-[2px]' : 'fixed'} ${tone}`}>
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-[.18em]">
          VIKM<span className="text-[var(--timber)]">.</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {site.nav.map(item => (
            <Link key={item.href} href={item.href} className={`text-xs uppercase tracking-[.12em] transition-colors duration-200 ${muted}`}>
              {item.label}
            </Link>
          ))}
          <Link href="/quote" className={`border px-4 py-2 text-xs uppercase tracking-[.12em] transition-colors duration-200 ${button}`}>
            Start a project
          </Link>
        </nav>
        <button aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="container flex flex-col gap-5 border-t border-white/20 bg-[var(--ink)] py-6 md:hidden">
          {site.nav.map(item => (
            <Link onClick={() => setOpen(false)} key={item.href} href={item.href} className="text-sm uppercase tracking-[.12em] transition-colors hover:text-[var(--timber)]">
              {item.label}
            </Link>
          ))}
          <Link href="/quote" onClick={() => setOpen(false)} className="text-sm uppercase tracking-[.12em] text-[var(--timber)] transition-colors hover:text-white">
            Start a project →
          </Link>
        </nav>
      )}
    </header>
  )
}

export function Footer() {
  return (
    <footer className="bg-[var(--ink)] py-16 text-[var(--bone)]">
      <div className="container grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div>
          <div className="text-sm font-semibold tracking-[.18em]">
            VIKM<span className="text-[var(--timber)]">.</span>
          </div>
          <p className="mt-6 max-w-xs text-sm leading-7 text-white/70">
            Construction, architecture, bespoke furniture, interior design, and digital software solutions in Kigali, Rwanda.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-white/85">Explore</p>
          <div className="mt-5 grid gap-3 text-sm text-white/80">
            {site.nav.map(item => (
              <Link key={item.href} href={item.href} className="transition-colors duration-200 hover:text-white">
                {item.label}
              </Link>
            ))}
            <Link href="/quote" className="transition-colors duration-200 hover:text-white">
              Start a Project
            </Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-white/85">Services</p>
          <div className="mt-5 grid gap-3 text-sm text-white/80">
            {services.map(s => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="transition-colors duration-200 hover:text-white">
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-white/85">Get in touch</p>
          <div className="mt-5 grid gap-2 text-sm text-white/80">
            <a href={`tel:${site.phone}`} className="transition-colors duration-200 hover:text-white">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="transition-colors duration-200 hover:text-white">
              {site.email}
            </a>
            <span className="text-white/70">{site.location}</span>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 text-xs font-medium text-[var(--timber)] hover:text-white transition-colors"
            >
              Direct WhatsApp →
            </a>
          </div>
        </div>
      </div>

      <div className="container mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/60 md:flex-row">
        <div>
          © {new Date().getFullYear()} VIKM GROUP Ltd. All rights reserved.
        </div>

        <div>
          Designed &amp; Developed by{' '}
          <a
            href="https://tuyambaze-gilbert.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[var(--timber)] hover:text-white transition-colors underline decoration-dotted"
          >
            Gilbert Tuyambaze
          </a>
        </div>

        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-[11px] text-white/70 transition-colors hover:border-white hover:bg-white/10 hover:text-white"
          >
            <ShieldCheck size={13} className="text-[var(--timber)]" />
            Sign in
          </Link>
        </div>
      </div>
    </footer>
  )
}

export function WhatsAppFab() {
  return (
    <a
      aria-label="Chat with VIKM on WhatsApp"
      href={`https://wa.me/${site.whatsapp}?text=Hello%20VIKM%20GROUP%2C%20I%27d%20like%20to%20discuss%20a%20project.`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center bg-[var(--timber)] text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-[var(--timber-dk)] rounded-full"
    >
      <MessageCircle size={22} />
    </a>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <GilbertAssistant />
      <WhatsAppFab />
      <Footer />
    </>
  )
}

export function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 text-xs uppercase tracking-[.12em] text-[var(--timber-dk)]">
      {children}
      <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
    </Link>
  )
}
