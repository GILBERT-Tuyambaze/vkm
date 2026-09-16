'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  ExternalLink, 
  Trash2, 
  Eye, 
  EyeOff,
  MessageSquare, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Layers,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  UserPlus,
  Loader2,
  Copy,
  Check,
  Send,
  X,
  FileText,
  Sparkles,
  Inbox,
  Users
} from 'lucide-react'
import { 
  fetchAllQuotes, 
  updateQuoteStatus, 
  deleteQuoteSubmission, 
  fetchAdminInvitations,
  saveAdminInvitation,
  deleteAdminInvitation,
  QuoteSubmission, 
  AdminInvitation,
  isSupabaseConfigured,
  signInAdmin,
  signOutAdmin,
  getAdminSession
} from '@/lib/supabase'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminUser, setAdminUser] = useState<{ email: string } | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  
  // Dashboard Navigation Tabs
  const [activeTab, setActiveTab] = useState<'submissions' | 'email_hub' | 'invitations'>('submissions')

  const [quotes, setQuotes] = useState<QuoteSubmission[]>([])
  const [invitations, setInvitations] = useState<AdminInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedQuote, setSelectedQuote] = useState<QuoteSubmission | null>(null)

  // Invite Modal / Form State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Admin')
  const [isSendingInvite, setIsSendingInvite] = useState(false)
  const [inviteFeedback, setInviteFeedback] = useState<{ type: 'success' | 'error'; message: string; link?: string } | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  // Email Hub State (For Client & Staff Communications)
  const [clientEmailRecipient, setClientEmailRecipient] = useState('')
  const [clientEmailName, setClientEmailName] = useState('')
  const [clientEmailSubject, setClientEmailSubject] = useState('')
  const [clientEmailCategory, setClientEmailCategory] = useState<'Quote & Proposal' | 'Status Update' | 'Client Notice' | 'Staff Invitation' | 'General'>('Quote & Proposal')
  const [clientEmailHeading, setClientEmailHeading] = useState('Project Quotation & Scoping Details')
  const [clientEmailMessage, setClientEmailMessage] = useState('')
  const [clientEmailCtaText, setClientEmailCtaText] = useState('Chat with our Team on WhatsApp')
  const [clientEmailCtaUrl, setClientEmailCtaUrl] = useState('https://wa.me/250794399892')
  const [isSendingClientEmail, setIsSendingClientEmail] = useState(false)
  const [clientEmailFeedback, setClientEmailFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    // Check existing session
    const session = getAdminSession()
    if (session) {
      setIsAuthenticated(true)
      setAdminUser({ email: session.email })
      loadQuotes()
      loadInvitations()
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setAuthError('')

    try {
      const res = await signInAdmin(email, password)
      if (res.success && res.user) {
        setIsAuthenticated(true)
        setAdminUser(res.user)
        loadQuotes()
        loadInvitations()
      } else {
        setAuthError(res.error || 'Authentication failed. Please check your credentials.')
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login error occurred.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    await signOutAdmin()
    setIsAuthenticated(false)
    setAdminUser(null)
    setEmail('')
    setPassword('')
  }

  const loadQuotes = async () => {
    setLoading(true)
    try {
      const data = await fetchAllQuotes()
      setQuotes(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadInvitations = async () => {
    try {
      const data = await fetchAdminInvitations()
      setInvitations(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleStatusChange = async (id: string, newStatus: QuoteSubmission['status']) => {
    await updateQuoteStatus(id, newStatus)
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q))
    if (selectedQuote && selectedQuote.id === id) {
      setSelectedQuote(prev => prev ? { ...prev, status: newStatus } : null)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this quotation request?')) {
      await deleteQuoteSubmission(id)
      setQuotes(prev => prev.filter(q => q.id !== id))
      if (selectedQuote && selectedQuote.id === id) {
        setSelectedQuote(null)
      }
    }
  }

  const openEmailComposerForQuote = (q: QuoteSubmission) => {
    setClientEmailRecipient(q.email)
    setClientEmailName(q.client_name)
    setClientEmailSubject(`VIKM GROUP — Quotation Details: ${q.type} (${q.location || 'Kigali'})`)
    setClientEmailHeading(`Quotation & Project Proposal: ${q.type}`)
    setClientEmailCategory('Quote & Proposal')
    setClientEmailMessage(
      `Thank you for contacting VIKM GROUP Ltd regarding your project.\n\n` +
      `We have reviewed your brief for ${q.type}${q.location ? ` in ${q.location}` : ''}.\n` +
      `Our technical and design team would be pleased to assist you with next steps, material selections, and on-site scheduling.`
    )
    setClientEmailCtaText('Discuss via WhatsApp Hotline')
    setClientEmailCtaUrl(`https://wa.me/250794399892?text=${encodeURIComponent(`Hello ${q.client_name}, this is VIKM GROUP regarding your ${q.type} project.`)}`)
    setClientEmailFeedback(null)
    setActiveTab('email_hub')
  }

  const handleSendClientEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientEmailRecipient || !clientEmailSubject || !clientEmailMessage || isSendingClientEmail) return

    setIsSendingClientEmail(true)
    setClientEmailFeedback(null)

    try {
      const res = await fetch('/api/admin/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: clientEmailRecipient,
          recipientName: clientEmailName,
          subject: clientEmailSubject,
          heading: clientEmailHeading,
          category: clientEmailCategory,
          message: clientEmailMessage,
          ctaText: clientEmailCtaText,
          ctaUrl: clientEmailCtaUrl
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setClientEmailFeedback({
          type: 'success',
          message: `Branded email successfully dispatched to ${clientEmailRecipient} via Brevo SMTP.`
        })
      } else {
        setClientEmailFeedback({
          type: 'error',
          message: data.error || 'Failed to dispatch email.'
        })
      }
    } catch (err: any) {
      setClientEmailFeedback({
        type: 'error',
        message: err.message || 'Error occurred while contacting Brevo API.'
      })
    } finally {
      setIsSendingClientEmail(false)
    }
  }

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail || isSendingInvite) return
    setIsSendingInvite(true)
    setInviteFeedback(null)
    setCopiedLink(false)

    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
          invitedBy: adminUser?.email || 'VIKM Administrator'
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        const newInvite: AdminInvitation = {
          id: data.token,
          created_at: new Date().toISOString(),
          email: data.email,
          role: data.role,
          invited_by: adminUser?.email || 'VIKM Administrator',
          token: data.token,
          status: 'Pending',
          expires_at: data.expiresAt
        }
        await saveAdminInvitation(newInvite)
        setInvitations(prev => [newInvite, ...prev])

        setInviteFeedback({
          type: 'success',
          message: data.notice || `Invitation generated for ${data.email}.`,
          link: data.inviteLink
        })
        setInviteEmail('')
      } else {
        setInviteFeedback({
          type: 'error',
          message: data.error || 'Failed to generate invitation.'
        })
      }
    } catch (err: any) {
      setInviteFeedback({
        type: 'error',
        message: err.message || 'Error sending invitation request.'
      })
    } finally {
      setIsSendingInvite(false)
    }
  }

  const handleDeleteInvite = async (id: string) => {
    if (confirm('Revoke this invitation?')) {
      await deleteAdminInvitation(id)
      setInvitations(prev => prev.filter(i => i.id !== id && i.token !== id))
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  const exportCSV = () => {
    if (quotes.length === 0) return
    const headers = ['ID', 'Date', 'Client Name', 'Type', 'Phone', 'WhatsApp', 'Email', 'Location', 'Budget', 'Status', 'Details']
    const rows = quotes.map(q => [
      q.id || '',
      q.created_at ? new Date(q.created_at).toLocaleDateString() : '',
      `"${q.client_name.replace(/"/g, '""')}"`,
      `"${q.type.replace(/"/g, '""')}"`,
      q.phone,
      q.whatsapp || '',
      q.email,
      `"${(q.location || '').replace(/"/g, '""')}"`,
      `"${(q.budget || '').replace(/"/g, '""')}"`,
      q.status || 'Pending',
      `"${(q.details || '').replace(/"/g, '""')}"`
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `vikm_quotes_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filtered quotes
  const filtered = quotes.filter(q => {
    const matchesSearch = 
      q.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.phone.includes(searchQuery) ||
      (q.location && q.location.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === 'All' || q.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // KPIs
  const totalCount = quotes.length
  const pendingCount = quotes.filter(q => q.status === 'Pending').length
  const inReviewCount = quotes.filter(q => q.status === 'In Review').length
  const contactedCount = quotes.filter(q => q.status === 'Contacted' || q.status === 'Completed').length

  // If not authenticated, render Supabase email & password login screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--ink)] px-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#201c18] p-8 shadow-2xl md:p-10">
          <div className="flex justify-between items-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors">
              <ArrowLeft size={14} /> Back to website
            </Link>
            <div className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--timber)]">VIKM GROUP</div>
          </div>

          <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--timber)]/20 text-[var(--timber)] border border-[var(--timber)]/30 shadow-inner">
            <ShieldCheck size={30} />
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight text-white">Administrator Sign In</h1>
          <p className="mt-1 text-xs text-white/60">Enter your credentials to access the project management dashboard.</p>

          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-[.1em] text-white/80">
                Email Address
              </label>
              <div className="relative mt-2">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@vikm.rw"
                  className="w-full rounded-lg border border-white/20 bg-black/40 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-[var(--timber)] focus:outline-none transition-colors"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-[.1em] text-white/80">
                Password
              </label>
              <div className="relative mt-2">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-white/20 bg-black/40 py-3 pl-10 pr-11 text-sm text-white placeholder:text-white/40 focus:border-[var(--timber)] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  title={showPassword ? 'Hide password' : 'View password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--timber)] py-3.5 text-xs font-semibold uppercase tracking-[.12em] text-white transition-all duration-200 hover:bg-[var(--timber-dk)] disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f1ea] text-[var(--ink)]">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[#fbf8f3]/90 backdrop-blur-md">
        <div className="container flex h-18 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold tracking-[.18em]">
              VIKM<span className="text-[var(--timber)]">.</span>
            </Link>
            <span className="rounded-full bg-[var(--timber)]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[.1em] text-[var(--timber-dk)]">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {adminUser && (
              <div className="hidden items-center gap-2 text-xs text-[var(--stone)] md:flex">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--ink)] text-xs text-white font-medium">
                  {adminUser.email.charAt(0).toUpperCase()}
                </div>
                <span className="font-mono text-[11px] text-[var(--graphite)]">{adminUser.email}</span>
              </div>
            )}

            {/* Quick Invite Trigger */}
            <button
              onClick={() => {
                setIsInviteModalOpen(true)
                setInviteFeedback(null)
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--timber)] bg-[var(--timber)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--timber-dk)] hover:bg-[var(--timber)] hover:text-white transition-all"
            >
              <UserPlus size={14} />
              <span className="hidden sm:inline">Invite Admin</span>
            </button>

            <Link 
              href="/" 
              target="_blank" 
              className="hidden items-center gap-1.5 text-xs text-[var(--stone)] hover:text-[var(--ink)] md:inline-flex"
            >
              Live Site <ExternalLink size={13} />
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-[var(--line)] bg-white px-3.5 py-1.5 text-xs font-medium uppercase tracking-[.1em] text-[var(--ink)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:!text-white"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="container py-8 md:py-10">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-[var(--line)] pb-4 mb-8">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-[.1em] transition-colors ${
              activeTab === 'submissions'
                ? 'bg-[var(--ink)] text-white shadow-sm'
                : 'bg-white text-[var(--stone)] border border-[var(--line)] hover:text-[var(--ink)]'
            }`}
          >
            <Inbox size={14} />
            <span>Submissions ({quotes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('email_hub')}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-[.1em] transition-colors ${
              activeTab === 'email_hub'
                ? 'bg-[var(--ink)] text-white shadow-sm'
                : 'bg-white text-[var(--stone)] border border-[var(--line)] hover:text-[var(--ink)]'
            }`}
          >
            <Mail size={14} />
            <span>Email & Client Dispatch</span>
          </button>

          <button
            onClick={() => setActiveTab('invitations')}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-[.1em] transition-colors ${
              activeTab === 'invitations'
                ? 'bg-[var(--ink)] text-white shadow-sm'
                : 'bg-white text-[var(--stone)] border border-[var(--line)] hover:text-[var(--ink)]'
            }`}
          >
            <Users size={14} />
            <span>Team & Access ({invitations.length})</span>
          </button>
        </div>

        {/* TAB 1: SUBMISSIONS TABLE (REAL DATABASE) */}
        {activeTab === 'submissions' && (
          <div>
            {/* Header & Controls */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="eyebrow">Project Enquiries & Quotations</p>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Submissions Management</h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={loadQuotes}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-white px-3.5 py-2 text-xs font-medium uppercase tracking-[.1em] text-[var(--stone)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  Refresh Database
                </button>
                <button
                  onClick={exportCSV}
                  disabled={quotes.length === 0}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--timber)] px-4 py-2 text-xs font-semibold uppercase tracking-[.1em] text-white transition-colors hover:bg-[var(--timber-dk)] disabled:opacity-50"
                >
                  <Download size={14} />
                  Export CSV
                </button>
              </div>
            </div>

            {/* KPI Metrics */}
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-xl border border-[var(--line)] bg-white p-5 shadow-xs">
                <p className="text-xs font-semibold uppercase tracking-[.15em] text-[var(--stone)]">Total Submissions</p>
                <p className="mt-2 text-3xl font-bold text-[var(--ink)]">{totalCount}</p>
                <p className="mt-1 text-xs text-[var(--stone)]">Recorded database briefs</p>
              </div>

              <div className="rounded-xl border border-[var(--line)] bg-white p-5 shadow-xs">
                <p className="text-xs font-semibold uppercase tracking-[.15em] text-amber-700">Pending Review</p>
                <p className="mt-2 text-3xl font-bold text-amber-800">{pendingCount}</p>
                <p className="mt-1 text-xs text-amber-700/80">Awaiting initial evaluation</p>
              </div>

              <div className="rounded-xl border border-[var(--line)] bg-white p-5 shadow-xs">
                <p className="text-xs font-semibold uppercase tracking-[.15em] text-blue-700">In Review</p>
                <p className="mt-2 text-3xl font-bold text-blue-800">{inReviewCount}</p>
                <p className="mt-1 text-xs text-blue-700/80">Under scoping & estimating</p>
              </div>

              <div className="rounded-xl border border-[var(--line)] bg-white p-5 shadow-xs">
                <p className="text-xs font-semibold uppercase tracking-[.15em] text-emerald-700">Contacted / Completed</p>
                <p className="mt-2 text-3xl font-bold text-emerald-800">{contactedCount}</p>
                <p className="mt-1 text-xs text-emerald-700/80">Active client discussions</p>
              </div>
            </div>

            {/* Database Status Notice */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--line)] bg-[#ede7dc] px-4 py-2.5 text-xs text-[var(--graphite)]">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>
                  Database: <strong>{isSupabaseConfigured ? 'Supabase PostgreSQL (Live Database Connected)' : 'Local Storage Mode'}</strong>
                </span>
              </div>
              <div className="flex items-center gap-4 text-[var(--stone)]">
                <span>{quotes.length} total real database records</span>
                <button onClick={loadQuotes} className="font-medium text-[var(--timber)] hover:underline">
                  Sync Database
                </button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 md:max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--stone)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by client name, email, phone, location..."
                  className="w-full rounded-lg border border-[var(--line)] bg-white py-2.5 pl-10 pr-4 text-xs text-[var(--ink)] placeholder:text-[var(--stone)] focus:border-[var(--timber)] focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-[var(--stone)]">Status:</span>
                {['All', 'Pending', 'In Review', 'Contacted', 'Completed'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      statusFilter === status
                        ? 'bg-[var(--ink)] text-white'
                        : 'border border-[var(--line)] bg-white text-[var(--stone)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Real Data Table */}
            <div className="mt-6 overflow-hidden rounded-xl border border-[var(--line)] bg-white shadow-xs">
              {loading ? (
                <div className="flex h-64 items-center justify-center text-sm text-[var(--stone)]">
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin text-[var(--timber)]" /> Retrieving live database records...
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center text-center p-6">
                  <AlertCircle size={36} className="text-[var(--stone)] opacity-40" />
                  <p className="mt-3 font-medium text-[var(--ink)]">No quotation submissions in database</p>
                  <p className="mt-1 text-xs text-[var(--stone)]">
                    New client submissions received at <Link href="/quote" target="_blank" className="text-[var(--timber)] underline">/quote</Link> will automatically populate here in real-time.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-[var(--line)] bg-[#faf7f2] uppercase tracking-[.1em] text-[var(--stone)]">
                      <tr>
                        <th className="px-5 py-3.5">Client & Date</th>
                        <th className="px-5 py-3.5">Discipline</th>
                        <th className="px-5 py-3.5">Contact Details</th>
                        <th className="px-5 py-3.5">Location & Scope</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                      {filtered.map(q => {
                        const dateStr = q.created_at ? new Date(q.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'Recent'

                        return (
                          <tr key={q.id} className="hover:bg-[#fcfaf6] transition-colors">
                            <td className="px-5 py-4">
                              <p className="font-semibold text-sm text-[var(--ink)]">{q.client_name}</p>
                              <span className="text-[11px] text-[var(--stone)]">{dateStr}</span>
                            </td>

                            <td className="px-5 py-4">
                              <span className="inline-block rounded-md bg-[#eee7dc] px-2.5 py-1 text-xs font-medium text-[var(--graphite)]">
                                {q.type}
                              </span>
                            </td>

                            <td className="px-5 py-4 space-y-1">
                              <p className="font-mono text-[var(--ink)]">{q.phone}</p>
                              <p className="text-[11px] text-[var(--stone)]">{q.email}</p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="font-medium text-[var(--graphite)]">{q.location || 'Kigali'}</p>
                              <p className="text-[11px] text-[var(--stone)]">{q.budget ? `Budget: ${q.budget}` : 'Budget not set'}</p>
                            </td>

                            <td className="px-5 py-4">
                              <select
                                value={q.status || 'Pending'}
                                onChange={e => handleStatusChange(q.id!, e.target.value as any)}
                                className={`rounded-md border px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer ${
                                  q.status === 'Completed'
                                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                                    : q.status === 'Contacted'
                                    ? 'border-blue-300 bg-blue-50 text-blue-800'
                                    : q.status === 'In Review'
                                    ? 'border-purple-300 bg-purple-50 text-purple-800'
                                    : 'border-amber-300 bg-amber-50 text-amber-800'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Review">In Review</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Completed">Completed</option>
                                <option value="Archived">Archived</option>
                              </select>
                            </td>

                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {/* Send Branded Email Action */}
                                <button
                                  type="button"
                                  onClick={() => openEmailComposerForQuote(q)}
                                  title="Send Branded Email via Brevo"
                                  className="rounded-md border border-[var(--timber)]/40 bg-[var(--timber)]/10 p-1.5 text-[var(--timber-dk)] hover:bg-[var(--timber)] hover:text-white transition-all"
                                >
                                  <Mail size={14} />
                                </button>

                                {/* WhatsApp Action */}
                                <a
                                  href={`https://wa.me/${(q.whatsapp || q.phone).replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(q.client_name)}%2C%20this%20is%20VIKM%20GROUP%20regarding%20your%20quotation%20request%20for%20${encodeURIComponent(q.type)}.`}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Chat on WhatsApp"
                                  className="rounded-md border border-emerald-300 bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100"
                                >
                                  <MessageSquare size={14} />
                                </a>

                                {/* View Details */}
                                <button
                                  onClick={() => setSelectedQuote(q)}
                                  title="View Full Details"
                                  className="rounded-md border border-[var(--line)] bg-white p-1.5 text-[var(--ink)] hover:border-[var(--ink)]"
                                >
                                  <Eye size={14} />
                                </button>

                                {/* Delete */}
                                <button
                                  onClick={() => handleDelete(q.id!)}
                                  title="Delete Submission"
                                  className="rounded-md border border-rose-200 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CLIENT & STAFF EMAIL DISPATCH HUB (BREVO) */}
        {activeTab === 'email_hub' && (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
            {/* Email Composer */}
            <div className="rounded-2xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={18} className="text-[var(--timber)]" />
                <h2 className="text-xl font-bold text-[var(--ink)]">Branded Email Dispatch Center</h2>
              </div>
              <p className="text-xs text-[var(--stone)] mb-6">
                Send professional, customized emails matching VIKM GROUP brand design to clients, partners, or team members via Brevo SMTP.
              </p>

              <form onSubmit={handleSendClientEmail} className="space-y-4 text-xs">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-medium uppercase tracking-[.1em] text-[var(--stone)]">
                      Recipient Email
                    </label>
                    <input
                      type="email"
                      required
                      value={clientEmailRecipient}
                      onChange={e => setClientEmailRecipient(e.target.value)}
                      placeholder="client@example.com"
                      className="mt-1.5 w-full rounded-lg border border-[var(--line)] bg-[#faf7f2] p-2.5 text-xs text-[var(--ink)] focus:border-[var(--timber)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium uppercase tracking-[.1em] text-[var(--stone)]">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={clientEmailName}
                      onChange={e => setClientEmailName(e.target.value)}
                      placeholder="Client or Partner Name"
                      className="mt-1.5 w-full rounded-lg border border-[var(--line)] bg-[#faf7f2] p-2.5 text-xs text-[var(--ink)] focus:border-[var(--timber)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-medium uppercase tracking-[.1em] text-[var(--stone)]">
                      Communication Category
                    </label>
                    <select
                      value={clientEmailCategory}
                      onChange={e => setClientEmailCategory(e.target.value as any)}
                      className="mt-1.5 w-full rounded-lg border border-[var(--line)] bg-[#faf7f2] p-2.5 text-xs text-[var(--ink)] focus:border-[var(--timber)] focus:outline-none cursor-pointer"
                    >
                      <option value="Quote & Proposal">Quotation & Project Proposal</option>
                      <option value="Status Update">Project Status & Milestones</option>
                      <option value="Client Notice">General Client Communication</option>
                      <option value="Staff Invitation">Staff / Admin Access</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium uppercase tracking-[.1em] text-[var(--stone)]">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      required
                      value={clientEmailSubject}
                      onChange={e => setClientEmailSubject(e.target.value)}
                      placeholder="VIKM GROUP — Official Quotation & Project Details"
                      className="mt-1.5 w-full rounded-lg border border-[var(--line)] bg-[#faf7f2] p-2.5 text-xs text-[var(--ink)] focus:border-[var(--timber)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium uppercase tracking-[.1em] text-[var(--stone)]">
                    Banner Heading (Inside Email)
                  </label>
                  <input
                    type="text"
                    value={clientEmailHeading}
                    onChange={e => setClientEmailHeading(e.target.value)}
                    placeholder="Project Quotation & Scoping Details"
                    className="mt-1.5 w-full rounded-lg border border-[var(--line)] bg-[#faf7f2] p-2.5 text-xs text-[var(--ink)] focus:border-[var(--timber)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium uppercase tracking-[.1em] text-[var(--stone)]">
                    Message Body (Paragraphs will be styled cleanly)
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={clientEmailMessage}
                    onChange={e => setClientEmailMessage(e.target.value)}
                    placeholder="Enter the body of your message here..."
                    className="mt-1.5 w-full rounded-lg border border-[var(--line)] bg-[#faf7f2] p-3 text-xs leading-relaxed text-[var(--ink)] focus:border-[var(--timber)] focus:outline-none font-sans"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-medium uppercase tracking-[.1em] text-[var(--stone)]">
                      CTA Button Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={clientEmailCtaText}
                      onChange={e => setClientEmailCtaText(e.target.value)}
                      placeholder="Chat with Team on WhatsApp"
                      className="mt-1.5 w-full rounded-lg border border-[var(--line)] bg-[#faf7f2] p-2.5 text-xs text-[var(--ink)] focus:border-[var(--timber)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium uppercase tracking-[.1em] text-[var(--stone)]">
                      CTA Button URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={clientEmailCtaUrl}
                      onChange={e => setClientEmailCtaUrl(e.target.value)}
                      placeholder="https://wa.me/250794399892"
                      className="mt-1.5 w-full rounded-lg border border-[var(--line)] bg-[#faf7f2] p-2.5 text-xs text-[var(--ink)] focus:border-[var(--timber)] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingClientEmail || !clientEmailRecipient || !clientEmailMessage}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--timber)] py-3 text-xs font-semibold uppercase tracking-[.12em] text-white hover:bg-[var(--timber-dk)] disabled:opacity-50 transition-colors shadow-md"
                >
                  {isSendingClientEmail ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Dispatching via Brevo...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Dispatch Branded Email
                    </>
                  )}
                </button>
              </form>

              {/* Feedback Alert */}
              {clientEmailFeedback && (
                <div className={`mt-5 rounded-xl border p-4 text-xs ${
                  clientEmailFeedback.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-rose-200 bg-rose-50 text-rose-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {clientEmailFeedback.type === 'success' ? (
                      <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle size={16} className="text-rose-600 shrink-0" />
                    )}
                    <p className="font-medium">{clientEmailFeedback.message}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Live Email Design Preview */}
            <div className="rounded-2xl border border-[var(--line)] bg-[#141312] p-6 text-[#ede8df] shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#2b2824] pb-3 mb-4">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--timber)]">Live Design Preview</span>
                  <span className="text-[10px] text-white/40">VIKM Dark & Gold Template</span>
                </div>

                <div className="rounded-xl border border-[#36322d] bg-[#1f1d1b] p-5 shadow-inner">
                  <div className="text-center pb-4 border-b border-[#36322d]">
                    <div className="text-lg font-bold tracking-[.2em] text-white uppercase">VIKM<span className="text-[var(--timber)]">.</span> GROUP</div>
                    <div className="text-[9px] uppercase tracking-[.15em] text-[var(--timber)] font-semibold mt-1">
                      {clientEmailCategory}
                    </div>
                  </div>

                  <div className="py-4 space-y-3 text-xs leading-relaxed text-[#b5afa6]">
                    <h3 className="text-sm font-semibold text-white">{clientEmailHeading || 'Project Communication'}</h3>
                    <p className="font-medium text-white">{clientEmailName ? `Dear ${clientEmailName},` : 'Dear Valued Client,'}</p>
                    <p className="whitespace-pre-wrap">{clientEmailMessage || 'Your customized email text will appear formatted here with complete brand integrity.'}</p>
                    
                    {clientEmailCtaText && (
                      <div className="text-center pt-3 pb-1">
                        <span className="inline-block bg-[var(--timber)] text-[#141312] font-bold text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-lg">
                          {clientEmailCtaText}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-[#2b2824] pt-3 text-center text-[9px] text-[#78736b]">
                    VIKM GROUP Ltd · Kimironko, Gasabo District, Kigali, Rwanda
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-[#2b2824] bg-[#1a1918] p-3 text-[11px] text-[#999]">
                <p>⚡ <strong>Direct Brevo Integration:</strong> Emails sent from this center are signed with your sender address (<code className="text-[var(--timber)] font-mono">sandrinetech97@gmail.com</code>) and delivered straight to the recipient inbox.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TEAM & ACCESS (BREVO INVITATIONS) */}
        {activeTab === 'invitations' && (
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            {/* Invite Form */}
            <div className="rounded-2xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <UserPlus size={18} className="text-[var(--timber)]" />
                <h2 className="text-xl font-bold text-[var(--ink)]">Invite Administrator</h2>
              </div>
              <p className="text-xs text-[var(--stone)] mb-6">
                Send a personalized email invitation via Brevo to grant team members access to this dashboard.
              </p>

              <form onSubmit={handleSendInvitation} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium uppercase tracking-[.1em] text-[var(--stone)]">
                    Invitee Email Address
                  </label>
                  <div className="relative mt-2">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--stone)]" />
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      placeholder="colleague@vikm.rw"
                      className="w-full rounded-lg border border-[var(--line)] bg-[#faf7f2] py-2.5 pl-10 pr-4 text-xs text-[var(--ink)] placeholder:text-[var(--stone)] focus:border-[var(--timber)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium uppercase tracking-[.1em] text-[var(--stone)]">
                    Assigned Role & Permissions
                  </label>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-[var(--line)] bg-[#faf7f2] py-2.5 px-3.5 text-xs text-[var(--ink)] focus:border-[var(--timber)] focus:outline-none cursor-pointer"
                  >
                    <option value="Admin">Administrator (Full Access)</option>
                    <option value="Project Manager">Project Manager (Quotes & Scoping)</option>
                    <option value="Viewer">Viewer (Read-only)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSendingInvite || !inviteEmail.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--timber)] py-3 text-xs font-semibold uppercase tracking-[.12em] text-white hover:bg-[var(--timber-dk)] disabled:opacity-50 transition-colors shadow-md"
                >
                  {isSendingInvite ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Dispatching via Brevo...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Send Invitation Email
                    </>
                  )}
                </button>
              </form>

              {/* Feedback */}
              {inviteFeedback && (
                <div className={`mt-5 rounded-xl border p-4 text-xs ${
                  inviteFeedback.type === 'success' 
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900' 
                    : 'border-rose-200 bg-rose-50 text-rose-800'
                }`}>
                  <div className="flex items-start gap-2">
                    {inviteFeedback.type === 'success' ? (
                      <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{inviteFeedback.message}</p>
                      
                      {inviteFeedback.link && (
                        <div className="mt-3">
                          <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Direct Access Link:</p>
                          <div className="mt-1 flex items-center gap-2">
                            <input
                              type="text"
                              readOnly
                              value={inviteFeedback.link}
                              className="flex-1 rounded-md border border-emerald-300 bg-white px-2.5 py-1.5 font-mono text-[11px] text-[var(--ink)]"
                            />
                            <button
                              type="button"
                              onClick={() => copyToClipboard(inviteFeedback.link!)}
                              className="inline-flex items-center gap-1 rounded-md bg-emerald-700 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-800 transition-colors"
                            >
                              {copiedLink ? <Check size={12} /> : <Copy size={12} />}
                              {copiedLink ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sent Invitations List */}
            <div className="rounded-2xl border border-[var(--line)] bg-white p-6 md:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-[.1em] text-[var(--ink)]">
                  Active Team Invitations ({invitations.length})
                </h3>
                <button onClick={loadInvitations} className="text-xs text-[var(--timber)] hover:underline flex items-center gap-1">
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>

              {invitations.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center text-center text-xs text-[var(--stone)] border border-dashed border-[var(--line)] rounded-xl">
                  <Users size={28} className="opacity-40 mb-2" />
                  No pending invitations recorded yet.
                </div>
              ) : (
                <div className="divide-y divide-[var(--line)] rounded-xl border border-[var(--line)] bg-[#faf7f2]">
                  {invitations.map(inv => (
                    <div key={inv.id || inv.token} className="flex items-center justify-between p-3.5 text-xs">
                      <div>
                        <p className="font-semibold text-[var(--ink)]">{inv.email}</p>
                        <p className="text-[11px] text-[var(--stone)]">Role: <strong>{inv.role}</strong> · Status: <span className="text-emerald-700">{inv.status || 'Pending'}</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(`${typeof window !== 'undefined' ? window.location.origin : ''}/admin?invite=${inv.token}&email=${encodeURIComponent(inv.email)}`)}
                          title="Copy invitation link"
                          className="rounded-md border border-[var(--line)] bg-white p-1.5 text-[var(--stone)] hover:text-[var(--ink)] shadow-2xs"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteInvite(inv.id || inv.token)}
                          title="Revoke invitation"
                          className="rounded-md border border-rose-200 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Brief Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--line)] bg-white p-6 shadow-2xl md:p-8">
            <div className="flex items-start justify-between border-b border-[var(--line)] pb-5">
              <div>
                <span className="rounded-md bg-[var(--timber)]/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-[.1em] text-[var(--timber-dk)]">
                  {selectedQuote.type}
                </span>
                <h2 className="mt-2 text-2xl font-bold text-[var(--ink)]">{selectedQuote.client_name}</h2>
                <p className="text-xs text-[var(--stone)]">
                  Submitted {selectedQuote.created_at ? new Date(selectedQuote.created_at).toLocaleString() : 'Recently'}
                </p>
              </div>

              <button
                onClick={() => setSelectedQuote(null)}
                className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs uppercase tracking-[.1em] text-[var(--stone)] hover:text-[var(--ink)]"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[.12em] text-[var(--stone)]">Project Brief & Details</h3>
                <p className="mt-2 rounded-lg border border-[var(--line)] bg-[#faf7f2] p-4 text-sm leading-relaxed text-[var(--ink)] whitespace-pre-wrap">
                  {selectedQuote.details}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
                <div className="rounded-lg border border-[var(--line)] p-3">
                  <span className="text-[var(--stone)]">Location</span>
                  <p className="mt-1 font-semibold text-[var(--ink)]">{selectedQuote.location || 'Kigali, Rwanda'}</p>
                </div>
                <div className="rounded-lg border border-[var(--line)] p-3">
                  <span className="text-[var(--stone)]">Scale / Size</span>
                  <p className="mt-1 font-semibold text-[var(--ink)]">{selectedQuote.size || 'Not specified'}</p>
                </div>
                <div className="rounded-lg border border-[var(--line)] p-3">
                  <span className="text-[var(--stone)]">Preferred Start</span>
                  <p className="mt-1 font-semibold text-[var(--ink)]">{selectedQuote.start_date || 'Flexible'}</p>
                </div>
                <div className="rounded-lg border border-[var(--line)] p-3">
                  <span className="text-[var(--stone)]">Budget Estimate</span>
                  <p className="mt-1 font-semibold text-[var(--timber-dk)]">{selectedQuote.budget || 'Open / Discussion'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[.12em] text-[var(--stone)]">Client Contact Information</h3>
                <div className="mt-2 grid gap-3 sm:grid-cols-3 text-xs">
                  <a
                    href={`tel:${selectedQuote.phone}`}
                    className="flex items-center gap-2 rounded-lg border border-[var(--line)] p-3 hover:border-[var(--timber)]"
                  >
                    <Phone size={14} className="text-[var(--timber)]" />
                    <span>{selectedQuote.phone}</span>
                  </a>

                  <a
                    href={`https://wa.me/${(selectedQuote.whatsapp || selectedQuote.phone).replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50/50 p-3 text-emerald-800 hover:bg-emerald-100/60"
                  >
                    <MessageSquare size={14} className="text-emerald-600" />
                    <span>WhatsApp Client</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedQuote(null)
                      openEmailComposerForQuote(selectedQuote)
                    }}
                    className="flex items-center gap-2 rounded-lg border border-[var(--timber)]/40 bg-[var(--timber)]/10 p-3 text-[var(--timber-dk)] hover:bg-[var(--timber)] hover:text-white transition-all text-left"
                  >
                    <Mail size={14} />
                    <span className="truncate">Send Branded Email</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-[var(--line)] pt-5">
              <button
                onClick={() => setSelectedQuote(null)}
                className="rounded-lg bg-[var(--ink)] px-6 py-2.5 text-xs font-semibold uppercase tracking-[.12em] text-white hover:bg-black"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--line)] bg-white p-6 shadow-2xl md:p-8">
            <div className="flex items-start justify-between border-b border-[var(--line)] pb-4">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-[var(--timber)]" />
                <h2 className="text-xl font-bold text-[var(--ink)]">Invite Administrator</h2>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="rounded-lg p-1 text-[var(--stone)] hover:bg-black/5 hover:text-[var(--ink)]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendInvitation} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium uppercase tracking-[.1em] text-[var(--stone)]">
                  Invitee Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="colleague@vikm.rw"
                  className="mt-1.5 w-full rounded-lg border border-[var(--line)] bg-[#faf7f2] py-2.5 px-3.5 text-xs text-[var(--ink)] focus:border-[var(--timber)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium uppercase tracking-[.1em] text-[var(--stone)]">
                  Assigned Role
                </label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[var(--line)] bg-[#faf7f2] py-2.5 px-3.5 text-xs text-[var(--ink)] focus:border-[var(--timber)] focus:outline-none cursor-pointer"
                >
                  <option value="Admin">Administrator (Full Access)</option>
                  <option value="Project Manager">Project Manager (Quotes & Scoping)</option>
                  <option value="Viewer">Viewer (Read-only)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSendingInvite || !inviteEmail.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--timber)] py-3 text-xs font-semibold uppercase tracking-[.12em] text-white hover:bg-[var(--timber-dk)] disabled:opacity-50 transition-colors"
              >
                {isSendingInvite ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Sending Email via Brevo...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Dispatch Invitation Email
                  </>
                )}
              </button>
            </form>

            {inviteFeedback && (
              <div className={`mt-4 rounded-xl border p-3.5 text-xs ${
                inviteFeedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-rose-200 bg-rose-50 text-rose-800'
              }`}>
                <p className="font-medium">{inviteFeedback.message}</p>
                {inviteFeedback.link && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <input
                      type="text"
                      readOnly
                      value={inviteFeedback.link}
                      className="flex-1 rounded border border-emerald-300 bg-white px-2 py-1 font-mono text-[10px]"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(inviteFeedback.link!)}
                      className="rounded bg-emerald-700 px-2.5 py-1 text-[10px] font-semibold text-white"
                    >
                      {copiedLink ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
