'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  KeyRound,
  Sparkles,
  Building
} from 'lucide-react'

function AcceptInviteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || searchParams.get('invite') || ''
  const emailParam = searchParams.get('email') || ''

  const [loading, setLoading] = useState(true)
  const [inviteData, setInviteData] = useState<{
    email: string
    role: string
    invitedBy: string
    expiresAt?: string
  } | null>(null)
  const [inviteError, setInviteError] = useState('')

  // Form Fields
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('+250 ')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  // Verify invitation token on mount
  useEffect(() => {
    if (!token) {
      setInviteError('No invitation token provided. Please check the link from your invitation email.')
      setLoading(false)
      return
    }

    async function verifyToken() {
      try {
        const res = await fetch(`/api/admin/invite/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(emailParam)}`)
        const data = await res.json()

        if (res.ok && data.valid && data.invitation) {
          setInviteData({
            email: data.invitation.email || emailParam,
            role: data.invitation.role || 'Admin',
            invitedBy: data.invitation.invitedBy || 'VIKM Administrator',
            expiresAt: data.invitation.expiresAt
          })
        } else {
          setInviteError(data.error || 'This invitation is invalid or has expired.')
          if (data.email) {
            setInviteData({
              email: data.email,
              role: 'Admin',
              invitedBy: 'VIKM Administrator'
            })
          }
        }
      } catch (err: any) {
        setInviteError('Failed to connect to verification server.')
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [token, emailParam])

  // Password validation rules
  const rules = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[^A-Za-z0-9]/.test(password)
    }
  }, [password])

  // Password Strength Score (0 to 4)
  const strengthScore = useMemo(() => {
    let score = 0
    if (rules.minLength) score++
    if (rules.hasUpper && rules.hasLower) score++
    if (rules.hasNumber) score++
    if (rules.hasSymbol) score++
    return score
  }, [rules])

  const strengthLabel = useMemo(() => {
    if (!password) return ''
    if (strengthScore <= 1) return 'Weak'
    if (strengthScore === 2) return 'Fair'
    if (strengthScore === 3) return 'Good'
    return 'Strong & Secure'
  }, [password, strengthScore])

  const passwordsMatch = password.length > 0 && password === confirmPassword
  const isFormValid =
    fullName.trim().length >= 2 &&
    phone.trim().length >= 8 &&
    strengthScore >= 3 &&
    rules.minLength &&
    rules.hasUpper &&
    rules.hasLower &&
    rules.hasNumber &&
    rules.hasSymbol &&
    passwordsMatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || isSubmitting) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch('/api/admin/invite/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          email: inviteData?.email || emailParam,
          fullName: fullName.trim(),
          phone: phone.trim(),
          password
        })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        // Automatically save session to sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('vikm_admin_session_v1', JSON.stringify({
            email: data.email,
            token: `token_${Date.now()}`,
            provider: 'supabase',
            name: data.fullName,
            role: data.role
          }))
        }

        setIsSuccess(true)
        setTimeout(() => {
          router.push('/admin')
        }, 2200)
      } else {
        setSubmitError(data.error || 'Failed to complete account registration.')
      }
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred while creating your account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#141312] text-white">
        <div className="text-center">
          <Loader2 size={36} className="mx-auto animate-spin text-[#C49A45]" />
          <p className="mt-4 text-sm text-[#A39D93] uppercase tracking-[.15em]">Verifying Invitation Token...</p>
        </div>
      </div>
    )
  }

  if (inviteError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#141312] px-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-[#36322D] bg-[#1F1D1B] p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle size={28} />
          </div>
          <h1 className="mt-5 text-xl font-bold text-white">Invitation Unavailable</h1>
          <p className="mt-2 text-xs leading-relaxed text-[#A39D93]">{inviteError}</p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/admin"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#C49A45] py-3 text-xs font-bold uppercase tracking-[.12em] text-[#141312] hover:bg-[#d9ae58] transition-colors"
            >
              Go to Admin Sign In
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#36322D] bg-[#141312] py-3 text-xs font-semibold text-[#A39D93] hover:text-white transition-colors"
            >
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#141312] px-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-[#C49A45]/40 bg-[#1F1D1B] p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-bounce">
            <CheckCircle2 size={36} />
          </div>
          <span className="mt-5 inline-block rounded-full bg-[#C49A45]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[.15em] text-[#C49A45]">
            Account Activated
          </span>
          <h1 className="mt-3 text-2xl font-bold text-white">Welcome, {fullName}!</h1>
          <p className="mt-2 text-xs leading-relaxed text-[#A39D93]">
            Your administrator account with role <strong className="text-white">{inviteData?.role}</strong> has been created successfully. Redirecting you to the portal...
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#C49A45]">
            <Loader2 size={16} className="animate-spin" /> Launching Admin Portal...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#141312] py-12 px-4 text-white">
      <div className="mx-auto w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="text-2xl font-bold tracking-[.25em] text-white uppercase">
              VIKM<span className="text-[#C49A45]">.</span> GROUP
            </div>
          </Link>
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-[.2em] text-[#C49A45]">
            Administrator Portal Onboarding
          </div>
        </div>

        {/* Card Container */}
        <div className="rounded-2xl border border-[#36322D] bg-[#1F1D1B] p-6 shadow-2xl sm:p-8">
          <div className="flex items-center gap-3 border-b border-[#36322D] pb-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C49A45]/15 text-[#C49A45] border border-[#C49A45]/30">
              <KeyRound size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create Your Account</h2>
              <p className="text-xs text-[#A39D93]">Set up your official administrator credentials to access the management portal.</p>
            </div>
          </div>

          {/* Locked / Verified Invitation Information */}
          <div className="mt-5 rounded-xl border border-[#3D3831] bg-[#171615] p-4">
            <div className="text-[10px] font-bold uppercase tracking-[.15em] text-[#8C857B] mb-2.5">
              Verified Invitation Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="block text-[11px] text-[#8C857B]">Assigned Email:</span>
                <span className="font-semibold text-white break-all flex items-center gap-1 mt-0.5">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  {inviteData?.email}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-[#8C857B]">Assigned Role:</span>
                <span className="inline-block mt-0.5 rounded-full bg-[#C49A45]/20 border border-[#C49A45]/40 px-2.5 py-0.5 text-[11px] font-bold text-[#C49A45] uppercase tracking-[.05em]">
                  {inviteData?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[.1em] text-[#EDE8DF]">
                Full Name <span className="text-[#C49A45]">*</span>
              </label>
              <div className="relative mt-1.5">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C857B]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Jean-Luc Habimana"
                  className="w-full rounded-xl border border-[#36322D] bg-[#141312] py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#5A544C] focus:border-[#C49A45] focus:outline-none transition-colors"
                  autoFocus
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[.1em] text-[#EDE8DF]">
                Phone Number <span className="text-[#C49A45]">*</span>
              </label>
              <div className="relative mt-1.5">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C857B]" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+250 783 156 702"
                  className="w-full rounded-xl border border-[#36322D] bg-[#141312] py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#5A544C] focus:border-[#C49A45] focus:outline-none transition-colors"
                />
              </div>
              <p className="mt-1 text-[10px] text-[#8C857B]">Used for 2-factor notifications and emergency workspace alerts.</p>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold uppercase tracking-[.1em] text-[#EDE8DF]">
                  Create Password <span className="text-[#C49A45]">*</span>
                </label>
                {strengthLabel && (
                  <span className={`text-[10px] font-bold uppercase tracking-[.1em] ${
                    strengthScore >= 3 ? 'text-emerald-400' : strengthScore === 2 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {strengthLabel}
                  </span>
                )}
              </div>
              <div className="relative mt-1.5">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C857B]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 characters with symbol & number"
                  className="w-full rounded-xl border border-[#36322D] bg-[#141312] py-3 pl-10 pr-11 text-sm text-white placeholder:text-[#5A544C] focus:border-[#C49A45] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C857B] hover:text-white transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength Progress Bar */}
              {password && (
                <div className="mt-2 flex gap-1.5">
                  <div className={`h-1.5 flex-1 rounded-full transition-all ${
                    strengthScore >= 1 ? (strengthScore === 1 ? 'bg-rose-500' : strengthScore === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-[#2A2622]'
                  }`} />
                  <div className={`h-1.5 flex-1 rounded-full transition-all ${
                    strengthScore >= 2 ? (strengthScore === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-[#2A2622]'
                  }`} />
                  <div className={`h-1.5 flex-1 rounded-full transition-all ${
                    strengthScore >= 3 ? 'bg-emerald-500' : 'bg-[#2A2622]'
                  }`} />
                  <div className={`h-1.5 flex-1 rounded-full transition-all ${
                    strengthScore >= 4 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-[#2A2622]'
                  }`} />
                </div>
              )}

              {/* Password Rule Checklist */}
              <div className="mt-3 grid grid-cols-2 gap-1.5 rounded-lg bg-[#171615] p-2.5 text-[11px]">
                <div className={`flex items-center gap-1.5 ${rules.minLength ? 'text-emerald-400' : 'text-[#8C857B]'}`}>
                  {rules.minLength ? <CheckCircle2 size={12} /> : <div className="h-2.5 w-2.5 rounded-full border border-[#8C857B]" />}
                  8+ characters
                </div>
                <div className={`flex items-center gap-1.5 ${rules.hasUpper ? 'text-emerald-400' : 'text-[#8C857B]'}`}>
                  {rules.hasUpper ? <CheckCircle2 size={12} /> : <div className="h-2.5 w-2.5 rounded-full border border-[#8C857B]" />}
                  Uppercase (A-Z)
                </div>
                <div className={`flex items-center gap-1.5 ${rules.hasLower ? 'text-emerald-400' : 'text-[#8C857B]'}`}>
                  {rules.hasLower ? <CheckCircle2 size={12} /> : <div className="h-2.5 w-2.5 rounded-full border border-[#8C857B]" />}
                  Lowercase (a-z)
                </div>
                <div className={`flex items-center gap-1.5 ${rules.hasNumber ? 'text-emerald-400' : 'text-[#8C857B]'}`}>
                  {rules.hasNumber ? <CheckCircle2 size={12} /> : <div className="h-2.5 w-2.5 rounded-full border border-[#8C857B]" />}
                  Number (0-9)
                </div>
                <div className={`col-span-2 flex items-center gap-1.5 ${rules.hasSymbol ? 'text-emerald-400' : 'text-[#8C857B]'}`}>
                  {rules.hasSymbol ? <CheckCircle2 size={12} /> : <div className="h-2.5 w-2.5 rounded-full border border-[#8C857B]" />}
                  Special symbol (!@#$%^&*)
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold uppercase tracking-[.1em] text-[#EDE8DF]">
                  Confirm Password <span className="text-[#C49A45]">*</span>
                </label>
                {confirmPassword && (
                  <span className={`text-[10px] font-bold ${passwordsMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                )}
              </div>
              <div className="relative mt-1.5">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C857B]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-type your password"
                  className={`w-full rounded-xl border bg-[#141312] py-3 pl-10 pr-11 text-sm text-white placeholder:text-[#5A544C] focus:outline-none transition-colors ${
                    confirmPassword && !passwordsMatch ? 'border-rose-500/50' : 'border-[#36322D] focus:border-[#C49A45]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C857B] hover:text-white transition-colors"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {submitError && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C49A45] py-4 text-xs font-bold uppercase tracking-[.15em] text-[#141312] transition-all duration-200 hover:bg-[#d9ae58] hover:shadow-[0_8px_24px_rgba(196,154,69,0.35)] disabled:opacity-40 disabled:hover:bg-[#C49A45] disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating Account & Activating Access...
                </>
              ) : (
                <>
                  Activate Account & Enter Dashboard <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="mt-6 pt-5 border-t border-[#36322D] text-center">
            <Link href="/admin" className="text-xs text-[#8C857B] hover:text-[#C49A45] transition-colors">
              Already configured your credentials? <strong className="underline">Sign In here</strong>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#141312] text-white">
        <Loader2 size={36} className="animate-spin text-[#C49A45]" />
      </div>
    }>
      <AcceptInviteContent />
    </Suspense>
  )
}

