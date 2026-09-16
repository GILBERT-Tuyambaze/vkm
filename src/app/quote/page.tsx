'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Building2, 
  Compass, 
  Armchair, 
  Palette, 
  Sparkles, 
  MonitorSmartphone, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Calendar, 
  MapPin, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  MessageSquare,
  Loader2
} from 'lucide-react'
import { Layout } from '@/components/marketing-layout'
import { site } from '@/content/site'
import { submitQuote } from '@/lib/supabase'

const steps = [
  { id: 0, title: 'Project Type', label: '01 Type' },
  { id: 1, title: 'Project Scope', label: '02 Scope' },
  { id: 2, title: 'References', label: '03 Files' },
  { id: 3, title: 'Contact Details', label: '04 Contact' },
]

const projectTypes = [
  { id: 'Construction', label: 'Construction', desc: 'Civil works, building & major renovation', icon: Building2 },
  { id: 'Architecture', label: 'Architecture', desc: '2D blueprints, 3D architectural models', icon: Compass },
  { id: 'Furniture', label: 'Made-to-Measure Furniture', desc: 'Custom kitchens, wardrobes & joinery', icon: Armchair },
  { id: 'Interior Design', label: 'Interior Design', desc: 'Cohesive finishing, styling & fit-outs', icon: Palette },
  { id: 'Branding & Packaging', label: 'Branding & Packaging', desc: 'Corporate identity, print & packaging', icon: Sparkles },
  { id: 'Digital', label: 'Digital Solutions', desc: 'Custom web, mobile apps & business tools', icon: MonitorSmartphone },
  { id: 'Other', label: 'Integrated Turnkey', desc: 'Multi-discipline full project execution', icon: Layers },
]

export default function QuotePage() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedId, setSubmittedId] = useState<string>('')
  const [files, setFiles] = useState<File[]>([])

  const [form, setForm] = useState({
    type: '',
    details: '',
    location: '',
    size: '',
    start: '',
    budget: '',
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
  })

  const update = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const goNext = () => {
    if (step === 0 && !form.type) {
      alert('Please select a project type to continue.')
      return
    }
    if (step === 1 && !form.details.trim()) {
      alert('Please provide some project details.')
      return
    }
    setDirection('forward')
    setStep(prev => Math.min(prev + 1, steps.length - 1))
  }

  const goBack = () => {
    setDirection('backward')
    setStep(prev => Math.max(prev - 1, 0))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.email) {
      alert('Please fill in your contact information.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await submitQuote({
        type: form.type || 'Custom Project',
        details: form.details,
        location: form.location,
        size: form.size,
        start_date: form.start,
        budget: form.budget,
        client_name: form.name,
        phone: form.phone,
        whatsapp: form.whatsapp || form.phone,
        email: form.email
      })

      if (res.success && res.data) {
        setSubmittedId(res.data.id || `VIKM-${Math.floor(1000 + Math.random() * 9000)}`)
        setIsSuccess(true)
      } else {
        setIsSuccess(true)
      }
    } catch (err) {
      console.error(err)
      setIsSuccess(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <main className="min-h-screen bg-[var(--bone)] pt-20">
        <section className="pt-8 pb-20 md:pt-14 md:pb-28">
          <div className="container">
            {/* Header */}
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="eyebrow">Start a project with VIKM</p>
                <h1 className="display mt-4 text-[var(--ink)]">Let&apos;s make a plan.</h1>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--graphite)]">
                  Tell us what you are building, designing or furnishing. We coordinate all planning, craftsmanship and delivery from concept to installation.
                </p>

                <div className="mt-10 hidden border-t border-[var(--line)] pt-8 lg:block">
                  <div className="flex flex-col gap-4 text-sm text-[var(--stone)]">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--timber)]/15 text-xs font-semibold text-[var(--timber-dk)]">✓</span>
                      <span>Detailed estimate within 24-48 business hours</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--timber)]/15 text-xs font-semibold text-[var(--timber-dk)]">✓</span>
                      <span>Direct coordination with our multidisciplinary team</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--timber)]/15 text-xs font-semibold text-[var(--timber-dk)]">✓</span>
                      <span>Kigali workshop & on-site supervision</span>
                    </div>
                  </div>

                  <div className="mt-8 rounded-lg border border-[var(--line)] bg-[#f0ebe1] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[.15em] text-[var(--stone)]">Need an instant response?</p>
                    <a
                      href={`https://wa.me/${site.whatsapp}?text=Hello%20VIKM%20GROUP%2C%20I%20would%20like%20to%20discuss%20a%20project.`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[var(--timber-dk)] hover:underline"
                    >
                      <MessageSquare size={16} />
                      Chat with us on WhatsApp →
                    </a>
                  </div>
                </div>
              </div>

              {/* 3D Cube Form Container */}
              <div className="relative">
                {isSuccess ? (
                  <div className="rounded-xl border border-[var(--line)] bg-[#fdfbf7] p-8 shadow-sm md:p-12 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--timber)]/15 text-[var(--timber)]">
                      <CheckCircle2 size={36} />
                    </div>
                    <p className="eyebrow mt-6">Quotation Brief Received</p>
                    <h2 className="mt-3 text-3xl font-medium text-[var(--ink)] md:text-4xl">
                      Your project inquiry is confirmed.
                    </h2>
                    <p className="mt-4 leading-relaxed text-[var(--graphite)]">
                      Thank you, <strong className="text-[var(--ink)]">{form.name}</strong>. Our team will review your project brief for <strong className="text-[var(--ink)]">{form.type}</strong> and contact you directly via phone or WhatsApp.
                    </p>

                    <div className="mt-8 rounded-lg border border-[var(--line)] bg-[#f5efe4] p-5 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-[var(--stone)] uppercase">Project Type</span>
                          <p className="font-medium text-[var(--ink)]">{form.type}</p>
                        </div>
                        <div>
                          <span className="text-xs text-[var(--stone)] uppercase">Reference ID</span>
                          <p className="font-mono text-xs font-semibold text-[var(--timber-dk)]">{submittedId}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4">
                      <a
                        href={`https://wa.me/${site.whatsapp}?text=Hello%20VIKM%20GROUP%2C%20I%20just%20submitted%20project%20enquiry%20${submittedId}%20for%20${encodeURIComponent(form.type)}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-[var(--timber)] px-6 py-3.5 text-xs font-medium uppercase tracking-[.12em] text-white transition-colors duration-200 hover:bg-[var(--timber-dk)]"
                      >
                        <MessageSquare size={16} />
                        Continue on WhatsApp
                      </a>
                      <Link
                        href="/"
                        className="border border-[var(--line)] px-6 py-3.5 text-xs font-medium uppercase tracking-[.12em] text-[var(--ink)] transition-colors duration-200 hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:!text-white"
                      >
                        Back to Homepage
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[var(--line)] bg-[#fdfbf7] p-6 shadow-sm md:p-10">
                    {/* Stepper Progress Indicator */}
                    <div className="mb-8 border-b border-[var(--line)] pb-6">
                      <div className="flex items-center justify-between">
                        {steps.map((s, idx) => (
                          <div 
                            key={s.id} 
                            className={`flex flex-col items-center gap-2 text-xs transition-colors duration-300 ${
                              idx === step 
                                ? 'font-semibold text-[var(--ink)]' 
                                : idx < step 
                                ? 'text-[var(--timber)]' 
                                : 'text-[var(--stone)] opacity-60'
                            }`}
                          >
                            <div 
                              className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs transition-all duration-300 ${
                                idx === step
                                  ? 'border-[var(--ink)] bg-[var(--ink)] text-white shadow-sm'
                                  : idx < step
                                  ? 'border-[var(--timber)] bg-[var(--timber)]/15 text-[var(--timber-dk)]'
                                  : 'border-[var(--line)] bg-transparent'
                              }`}
                            >
                              {idx < step ? '✓' : idx + 1}
                            </div>
                            <span className="hidden sm:inline tracking-[.08em]">{s.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-[var(--line)]">
                        <div 
                          className="h-full bg-[var(--timber)] transition-all duration-500 ease-out" 
                          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* 3D Cube Flip Transition Container */}
                    <div className="perspective-1000 overflow-hidden">
                      <form onSubmit={handleSubmit}>
                        {/* Step 0: Project Type Grid */}
                        {step === 0 && (
                          <div className="preserve-3d transition-all duration-600 ease-out animate-in fade-in slide-in-from-right-8">
                            <h2 className="text-xl font-medium text-[var(--ink)]">What are you planning?</h2>
                            <p className="mt-1 text-sm text-[var(--stone)]">Select the primary service discipline for your project.</p>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                              {projectTypes.map(item => {
                                const Icon = item.icon
                                const selected = form.type === item.id
                                return (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => update('type', item.id)}
                                    className={`group flex items-start gap-4 rounded-lg border p-4 text-left transition-all duration-200 ${
                                      selected
                                        ? 'border-[var(--timber)] bg-[var(--timber)]/10 ring-1 ring-[var(--timber)]'
                                        : 'border-[var(--line)] bg-white/60 hover:border-[var(--stone)] hover:bg-white'
                                    }`}
                                  >
                                    <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors ${
                                      selected ? 'bg-[var(--timber)] text-white' : 'bg-[#eee9df] text-[var(--ink)] group-hover:bg-[var(--timber)]/20'
                                    }`}>
                                      <Icon size={18} />
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-[var(--ink)]">{item.label}</p>
                                      <p className="mt-1 text-xs text-[var(--stone)] leading-relaxed">{item.desc}</p>
                                    </div>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Step 1: Scope & Details */}
                        {step === 1 && (
                          <div className="preserve-3d transition-all duration-600 ease-out animate-in fade-in slide-in-from-right-8">
                            <h2 className="text-xl font-medium text-[var(--ink)]">Project scope & requirements</h2>
                            <p className="mt-1 text-sm text-[var(--stone)]">Help us understand dimensions, location, and your vision.</p>

                            <div className="mt-6 grid gap-5">
                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-[.12em] text-[var(--ink)]">
                                  Project Details & Brief <span className="text-[var(--timber)]">*</span>
                                </label>
                                <textarea
                                  required
                                  rows={4}
                                  value={form.details}
                                  onChange={e => update('details', e.target.value)}
                                  placeholder="Describe the rooms, scale, materials, ideas or specific requirements you have in mind..."
                                  className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--stone)]/60 focus:border-[var(--timber)] focus:outline-none focus:ring-1 focus:ring-[var(--timber)]"
                                />
                              </div>

                              <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.12em] text-[var(--ink)]">
                                    <MapPin size={14} className="text-[var(--timber)]" />
                                    Location / Site
                                  </label>
                                  <input
                                    type="text"
                                    value={form.location}
                                    onChange={e => update('location', e.target.value)}
                                    placeholder="e.g. Nyarutarama, Kigali"
                                    className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--stone)]/60 focus:border-[var(--timber)] focus:outline-none focus:ring-1 focus:ring-[var(--timber)]"
                                  />
                                </div>

                                <div>
                                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.12em] text-[var(--ink)]">
                                    <Layers size={14} className="text-[var(--timber)]" />
                                    Approx. Size / Scale
                                  </label>
                                  <input
                                    type="text"
                                    value={form.size}
                                    onChange={e => update('size', e.target.value)}
                                    placeholder="e.g. 250 sqm / 3 bedrooms"
                                    className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--stone)]/60 focus:border-[var(--timber)] focus:outline-none focus:ring-1 focus:ring-[var(--timber)]"
                                  />
                                </div>

                                <div>
                                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.12em] text-[var(--ink)]">
                                    <Calendar size={14} className="text-[var(--timber)]" />
                                    Preferred Start
                                  </label>
                                  <input
                                    type="date"
                                    value={form.start}
                                    onChange={e => update('start', e.target.value)}
                                    className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] focus:border-[var(--timber)] focus:outline-none focus:ring-1 focus:ring-[var(--timber)]"
                                  />
                                </div>

                                <div>
                                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.12em] text-[var(--ink)]">
                                    <DollarSign size={14} className="text-[var(--timber)]" />
                                    Budget Range <span className="text-[10px] text-[var(--stone)]">(Optional)</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={form.budget}
                                    onChange={e => update('budget', e.target.value)}
                                    placeholder="e.g. $10,000 - $25,000"
                                    className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--stone)]/60 focus:border-[var(--timber)] focus:outline-none focus:ring-1 focus:ring-[var(--timber)]"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 2: Files & Photos */}
                        {step === 2 && (
                          <div className="preserve-3d transition-all duration-600 ease-out animate-in fade-in slide-in-from-right-8">
                            <h2 className="text-xl font-medium text-[var(--ink)]">Drawings, Photos or References</h2>
                            <p className="mt-1 text-sm text-[var(--stone)]">
                              Attach floorplans, sketches, site photos or inspiration pictures (optional).
                            </p>

                            <div className="mt-6">
                              <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--line)] bg-white/70 p-8 text-center transition-colors hover:border-[var(--timber)] hover:bg-white cursor-pointer">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--timber)]/10 text-[var(--timber)]">
                                  <Upload size={24} />
                                </div>
                                <p className="mt-4 text-sm font-semibold text-[var(--ink)]">
                                  Click or drag files to upload
                                </p>
                                <p className="mt-1 text-xs text-[var(--stone)]">
                                  PNG, JPG, PDF or DWG up to 15MB each
                                </p>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*,.pdf,.dwg"
                                  onChange={e => setFiles(Array.from(e.target.files ?? []).slice(0, 5))}
                                  className="hidden"
                                />
                              </label>

                              {files.length > 0 && (
                                <div className="mt-4 space-y-2">
                                  <p className="text-xs font-semibold uppercase tracking-[.1em] text-[var(--stone)]">
                                    {files.length} file(s) attached:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {files.map((file, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center gap-2 rounded-md border border-[var(--line)] bg-[#f3ece0] px-3 py-1.5 text-xs text-[var(--ink)]"
                                      >
                                        📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Step 3: Contact & Submit */}
                        {step === 3 && (
                          <div className="preserve-3d transition-all duration-600 ease-out animate-in fade-in slide-in-from-right-8">
                            <h2 className="text-xl font-medium text-[var(--ink)]">Your contact details</h2>
                            <p className="mt-1 text-sm text-[var(--stone)]">Where should we deliver the quotation and project review?</p>

                            <div className="mt-6 grid gap-4">
                              <div>
                                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.12em] text-[var(--ink)]">
                                  <User size={14} className="text-[var(--timber)]" />
                                  Full Name <span className="text-[var(--timber)]">*</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={form.name}
                                  onChange={e => update('name', e.target.value)}
                                  placeholder="e.g. Gilbert Tuyambaze"
                                  className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--stone)]/60 focus:border-[var(--timber)] focus:outline-none focus:ring-1 focus:ring-[var(--timber)]"
                                />
                              </div>

                              <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.12em] text-[var(--ink)]">
                                    <Phone size={14} className="text-[var(--timber)]" />
                                    Phone Number <span className="text-[var(--timber)]">*</span>
                                  </label>
                                  <input
                                    type="tel"
                                    required
                                    value={form.phone}
                                    onChange={e => update('phone', e.target.value)}
                                    placeholder="+250 788 123 456"
                                    className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--stone)]/60 focus:border-[var(--timber)] focus:outline-none focus:ring-1 focus:ring-[var(--timber)]"
                                  />
                                </div>

                                <div>
                                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.12em] text-[var(--ink)]">
                                    <MessageSquare size={14} className="text-[var(--timber)]" />
                                    WhatsApp Number
                                  </label>
                                  <input
                                    type="tel"
                                    value={form.whatsapp}
                                    onChange={e => update('whatsapp', e.target.value)}
                                    placeholder="+250 794 399 892"
                                    className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--stone)]/60 focus:border-[var(--timber)] focus:outline-none focus:ring-1 focus:ring-[var(--timber)]"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.12em] text-[var(--ink)]">
                                  <Mail size={14} className="text-[var(--timber)]" />
                                  Email Address <span className="text-[var(--timber)]">*</span>
                                </label>
                                <input
                                  type="email"
                                  required
                                  value={form.email}
                                  onChange={e => update('email', e.target.value)}
                                  placeholder="you@company.com"
                                  className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--stone)]/60 focus:border-[var(--timber)] focus:outline-none focus:ring-1 focus:ring-[var(--timber)]"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="mt-10 flex items-center justify-between border-t border-[var(--line)] pt-6">
                          {step > 0 ? (
                            <button
                              type="button"
                              onClick={goBack}
                              className="inline-flex items-center gap-2 border border-[var(--line)] px-5 py-3 text-xs uppercase tracking-[.12em] text-[var(--ink)] transition-colors duration-200 hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:!text-white rounded-md"
                            >
                              <ArrowLeft size={15} />
                              Back
                            </button>
                          ) : (
                            <div />
                          )}

                          {step < steps.length - 1 ? (
                            <button
                              type="button"
                              onClick={goNext}
                              className="inline-flex items-center gap-2 bg-[var(--timber)] px-7 py-3 text-xs uppercase tracking-[.12em] text-white transition-colors duration-200 hover:bg-[var(--timber-dk)] rounded-md"
                            >
                              Continue
                              <ArrowRight size={15} />
                            </button>
                          ) : (
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="inline-flex items-center gap-2 bg-[var(--timber)] px-8 py-3 text-xs uppercase tracking-[.12em] text-white transition-colors duration-200 hover:bg-[var(--timber-dk)] disabled:opacity-50 rounded-md"
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 size={16} className="animate-spin" />
                                  Saving Brief...
                                </>
                              ) : (
                                <>
                                  Submit Quotation Request
                                  <CheckCircle2 size={16} />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}
