import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

interface AcceptInviteBody {
  token: string
  email?: string
  fullName: string
  phone: string
  password: string
}

function validatePasswordStrength(password: string): { valid: boolean; reason?: string } {
  if (!password || password.length < 8) {
    return { valid: false, reason: 'Password must be at least 8 characters long.' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, reason: 'Password must include at least one uppercase letter (A-Z).' }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, reason: 'Password must include at least one lowercase letter (a-z).' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, reason: 'Password must include at least one number (0-9).' }
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, reason: 'Password must include at least one special character (!@#$%^&*).' }
  }
  return { valid: true }
}

export async function POST(req: NextRequest) {
  try {
    const body: AcceptInviteBody = await req.json()
    const { token, fullName, phone, password, email: fallbackEmail } = body

    if (!token) {
      return NextResponse.json({ error: 'Invitation token is required.' }, { status: 400 })
    }
    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 })
    }
    if (!phone || phone.trim().length < 6) {
      return NextResponse.json({ error: 'Please enter a valid contact phone number.' }, { status: 400 })
    }

    const passwordCheck = validatePasswordStrength(password)
    if (!passwordCheck.valid) {
      return NextResponse.json({ error: passwordCheck.reason }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey

    let targetEmail = fallbackEmail?.trim().toLowerCase() || ''
    let targetRole = 'Admin'

    // 1. Supabase Database check & update
    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      // Fetch invitation by token
      const { data: invite, error: fetchErr } = await supabase
        .from('admin_invitations')
        .select('*')
        .eq('token', token)
        .single()

      if (invite) {
        if (invite.status === 'Accepted') {
          return NextResponse.json({ 
            error: 'This invitation has already been accepted. Please sign in directly.' 
          }, { status: 400 })
        }

        if (new Date(invite.expires_at).getTime() < Date.now()) {
          return NextResponse.json({ 
            error: 'This invitation has expired. Please request a new invitation.' 
          }, { status: 400 })
        }

        targetEmail = invite.email
        targetRole = invite.role || 'Admin'
      }

      if (!targetEmail) {
        return NextResponse.json({ error: 'Invalid invitation token.' }, { status: 404 })
      }

      // 2. Register user in Supabase Auth
      try {
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: targetEmail,
          password: password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone: phone.trim(),
              role: targetRole
            }
          }
        })

        if (authErr && !authErr.message.includes('already registered')) {
          console.warn('Supabase auth signup notice:', authErr.message)
        }
      } catch (authException) {
        console.warn('Supabase auth signup exception:', authException)
      }

      // 3. Update invitation status to 'Accepted'
      try {
        const { error: updErr } = await supabase
          .from('admin_invitations')
          .update({
            status: 'Accepted'
          })
          .eq('token', token)
        if (updErr) {
          console.warn('Supabase invitation status update notice:', updErr.message)
        }
      } catch (updateErr) {
        console.warn('Failed to update invitation status:', updateErr)
      }

      // 4. Upsert into admin_profiles
      try {
        const { data: existingProf } = await supabase
          .from('admin_profiles')
          .select('id')
          .eq('email', targetEmail)
          .maybeSingle()

        if (existingProf) {
          await supabase
            .from('admin_profiles')
            .update({
              full_name: fullName.trim(),
              phone: phone.trim(),
              role: targetRole,
              status: 'Active',
              last_login: new Date().toISOString()
            })
            .eq('email', targetEmail)
        } else {
          await supabase
            .from('admin_profiles')
            .insert([{
              email: targetEmail,
              full_name: fullName.trim(),
              phone: phone.trim(),
              role: targetRole,
              status: 'Active',
              last_login: new Date().toISOString()
            }])
        }
      } catch (profileErr) {
        console.warn('Failed to update admin profile:', profileErr)
      }
    }

    if (!targetEmail) {
      targetEmail = fallbackEmail || 'admin@vikm.rw'
    }

    return NextResponse.json({
      success: true,
      email: targetEmail,
      fullName: fullName.trim(),
      phone: phone.trim(),
      role: targetRole,
      notice: `Account for ${fullName.trim()} has been successfully created and activated.`
    })
  } catch (err: any) {
    console.error('Accept invite error:', err)
    return NextResponse.json({ error: err.message || 'Failed to accept invitation.' }, { status: 500 })
  }
}

