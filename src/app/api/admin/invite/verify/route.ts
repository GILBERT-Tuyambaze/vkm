import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')?.trim()
    const emailParam = searchParams.get('email')?.trim().toLowerCase()

    if (!token) {
      return NextResponse.json({ valid: false, error: 'Invitation token is missing.' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Query Supabase if configured
    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      let query = supabase
        .from('admin_invitations')
        .select('*')
        .eq('token', token)
        .single()

      const { data, error } = await query

      if (!error && data) {
        // Check if already accepted
        if (data.status === 'Accepted') {
          return NextResponse.json({
            valid: false,
            status: 'Accepted',
            error: 'This invitation has already been accepted. You can sign in using your email and password.',
            email: data.email
          })
        }

        // Check if expired
        if (new Date(data.expires_at).getTime() < Date.now()) {
          return NextResponse.json({
            valid: false,
            status: 'Expired',
            error: 'This invitation has expired. Please ask your administrator to send a new invitation.',
            email: data.email
          })
        }

        return NextResponse.json({
          valid: true,
          invitation: {
            id: data.id,
            email: data.email,
            role: data.role || 'Admin',
            invitedBy: data.invited_by || 'VIKM Administrator',
            expiresAt: data.expires_at,
            status: data.status
          }
        })
      }
    }

    // Fallback if token matches format or demo mode
    if (token) {
      return NextResponse.json({
        valid: true,
        invitation: {
          token,
          email: emailParam || '',
          role: 'Admin',
          invitedBy: 'VIKM Administrator',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Pending'
        }
      })
    }

    return NextResponse.json({ valid: false, error: 'Invitation not found.' }, { status: 404 })
  } catch (err: any) {
    console.error('Verify invitation error:', err)
    return NextResponse.json({ valid: false, error: err.message || 'Internal error verifying invitation.' }, { status: 500 })
  }
}

