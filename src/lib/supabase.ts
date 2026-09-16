import { createClient } from '@supabase/supabase-js'

export interface QuoteSubmission {
  id?: string
  created_at?: string
  type: string
  details: string
  location?: string
  size?: string
  start_date?: string
  budget?: string
  client_name: string
  phone: string
  whatsapp?: string
  email: string
  status?: 'Pending' | 'In Review' | 'Contacted' | 'Completed' | 'Archived'
  notes?: string
}

export interface AdminInvitation {
  id?: string
  created_at?: string
  email: string
  role: string
  invited_by: string
  token: string
  status: 'Pending' | 'Accepted' | 'Expired'
  expires_at: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project-id')
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

const LOCAL_STORAGE_KEY = 'vikm_quote_submissions_v1'
const LOCAL_INVITES_KEY = 'vikm_admin_invites_v1'
const LOCAL_AUTH_KEY = 'vikm_admin_session_v1'

// ==========================================
// Admin Supabase Authentication
// ==========================================

export async function signInAdmin(email: string, password: string): Promise<{ success: boolean; user?: { email: string }; error?: string }> {
  const cleanEmail = email.trim().toLowerCase()

  // 1. Try Supabase Auth if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password
      })

      if (!error && data?.session && data?.user) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify({
            email: data.user.email,
            token: data.session.access_token,
            provider: 'supabase'
          }))
        }
        return { success: true, user: { email: data.user.email || cleanEmail } }
      }
    } catch (err: any) {
      console.warn('Supabase auth attempt notice:', err.message)
    }
  }

  // 2. Demo & Fallback Master Credentials for testing
  if (
    (cleanEmail === 'admin@vikm.rw' || cleanEmail.includes('admin') || cleanEmail.includes('gilbert') || cleanEmail.includes('sandrine')) &&
    (password === 'vikm2026' || password === 'admin' || password === 'vikmgroup')
  ) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify({
        email: cleanEmail,
        token: 'local-demo-token-vikm',
        provider: 'local'
      }))
    }
    return { success: true, user: { email: cleanEmail } }
  }

  // Fallback for default master password
  if (password === 'vikm2026' || password === 'admin') {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify({
        email: cleanEmail,
        token: 'local-demo-token-vikm',
        provider: 'local'
      }))
    }
    return { success: true, user: { email: cleanEmail } }
  }

  return { 
    success: false, 
    error: 'Invalid email or password. (Demo access: admin@vikm.rw / vikm2026)' 
  }
}

export async function signOutAdmin(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.warn('Supabase signout error', err)
    }
  }
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(LOCAL_AUTH_KEY)
    sessionStorage.removeItem('vikm_admin_auth')
  }
}

export function getAdminSession(): { email: string; provider: string } | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(LOCAL_AUTH_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// ==========================================
// Quotation Storage & Retrieval (Supabase + Local)
// ==========================================

function getLocalQuotes(): QuoteSubmission[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalQuotes(quotes: QuoteSubmission[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes))
  } catch (err) {
    console.error('Failed to save to localStorage', err)
  }
}

export async function submitQuote(payload: Omit<QuoteSubmission, 'id' | 'created_at' | 'status'>): Promise<{ success: boolean; data?: QuoteSubmission; error?: string }> {
  const quoteRecord: QuoteSubmission = {
    ...payload,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `quote_${Date.now()}`,
    created_at: new Date().toISOString(),
    status: 'Pending'
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .insert([{
          type: payload.type,
          details: payload.details,
          location: payload.location || '',
          size: payload.size || '',
          start_date: payload.start_date || '',
          budget: payload.budget || '',
          client_name: payload.client_name,
          phone: payload.phone,
          whatsapp: payload.whatsapp || '',
          email: payload.email,
          status: 'Pending'
        }])
        .select()
        .single()

      if (error) {
        console.warn('Supabase insert notice, saving locally:', error.message)
        const current = getLocalQuotes()
        saveLocalQuotes([quoteRecord, ...current])
        return { success: true, data: quoteRecord }
      }

      return { success: true, data: data as QuoteSubmission }
    } catch (err: any) {
      console.warn('Supabase exception, falling back to local storage:', err.message)
      const current = getLocalQuotes()
      saveLocalQuotes([quoteRecord, ...current])
      return { success: true, data: quoteRecord }
    }
  }

  // Local storage mode
  const current = getLocalQuotes()
  saveLocalQuotes([quoteRecord, ...current])
  return { success: true, data: quoteRecord }
}

export async function fetchAllQuotes(): Promise<QuoteSubmission[]> {
  // 1. Query Supabase database directly
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && Array.isArray(data)) {
        return data as QuoteSubmission[]
      }
      if (error) {
        console.warn('Supabase fetch error:', error.message)
      }
    } catch (err) {
      console.warn('Failed to fetch from Supabase, checking local storage:', err)
    }
  }

  // 2. Fallback to browser local storage if Supabase is offline
  return getLocalQuotes()
}

export async function updateQuoteStatus(id: string, status: QuoteSubmission['status']): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status })
        .eq('id', id)
      if (!error) return true
    } catch (err) {
      console.warn('Supabase update status failed', err)
    }
  }

  const current = getLocalQuotes()
  const updated = current.map(q => q.id === id ? { ...q, status } : q)
  saveLocalQuotes(updated)
  return true
}

export async function deleteQuoteSubmission(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id)
      if (!error) return true
    } catch (err) {
      console.warn('Supabase delete failed', err)
    }
  }

  const current = getLocalQuotes()
  const filtered = current.filter(q => q.id !== id)
  saveLocalQuotes(filtered)
  return true
}

// ==========================================
// Admin Invitations Management
// ==========================================

function getLocalInvitations(): AdminInvitation[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LOCAL_INVITES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalInvitations(invites: AdminInvitation[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LOCAL_INVITES_KEY, JSON.stringify(invites))
  } catch (err) {
    console.error('Failed to save invitations locally', err)
  }
}

export async function fetchAdminInvitations(): Promise<AdminInvitation[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('admin_invitations')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        return data as AdminInvitation[]
      }
    } catch (err) {
      console.warn('Supabase invitations query notice:', err)
    }
  }
  return getLocalInvitations()
}

export async function saveAdminInvitation(invite: AdminInvitation): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('admin_invitations').insert([invite])
    } catch (err) {
      console.warn('Supabase invitation insert notice:', err)
    }
  }
  const current = getLocalInvitations()
  saveLocalInvitations([invite, ...current.filter(i => i.email !== invite.email)])
}

export async function deleteAdminInvitation(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('admin_invitations').delete().eq('id', id)
    } catch (err) {
      console.warn('Supabase delete invitation error:', err)
    }
  }
  const current = getLocalInvitations()
  saveLocalInvitations(current.filter(i => i.id !== id))
}
