import { NextRequest, NextResponse } from 'next/server'

interface InviteRequestBody {
  email: string
  role?: string
  invitedBy?: string
}

function generateVikmInvitationEmailHtml({
  email,
  role,
  invitedBy,
  inviteLink,
  expiresDate
}: {
  email: string
  role: string
  invitedBy: string
  inviteLink: string
  expiresDate: string
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VIKM GROUP — Admin Portal Invitation</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #141312;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #EDE8DF;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #141312;
      padding: 40px 16px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #1F1D1B;
      border: 1px solid #36322D;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    }
    .header {
      background: linear-gradient(180deg, #2A2622 0%, #1F1D1B 100%);
      padding: 36px 32px 28px;
      text-align: center;
      border-bottom: 1px solid #36322D;
    }
    .logo-badge {
      display: inline-block;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: #FFFFFF;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .logo-dot {
      color: #C49A45;
    }
    .header-tagline {
      font-size: 11px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #C49A45;
      font-weight: 600;
    }
    .content {
      padding: 36px 32px;
    }
    h1 {
      font-size: 20px;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0 0 16px;
      line-height: 1.35;
    }
    p {
      font-size: 14px;
      line-height: 1.65;
      color: #B5AFA6;
      margin: 0 0 20px;
    }
    .highlight-card {
      background-color: #272421;
      border: 1px solid #423D37;
      border-left: 4px solid #C49A45;
      border-radius: 10px;
      padding: 18px 20px;
      margin: 24px 0;
    }
    .highlight-item {
      font-size: 13px;
      color: #EDE8DF;
      margin-bottom: 8px;
    }
    .highlight-item:last-child {
      margin-bottom: 0;
    }
    .highlight-label {
      color: #8C857B;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.1em;
      font-weight: 600;
      display: block;
      margin-bottom: 2px;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0 24px;
    }
    .btn {
      display: inline-block;
      background-color: #C49A45;
      color: #141312 !important;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      padding: 16px 36px;
      border-radius: 10px;
      box-shadow: 0 6px 20px rgba(196, 154, 69, 0.35);
      transition: background-color 0.2s ease;
    }
    .alt-link-card {
      background-color: #171615;
      border: 1px dashed #3D3934;
      border-radius: 8px;
      padding: 12px 16px;
      margin: 20px 0;
      word-break: break-all;
      font-family: monospace;
      font-size: 11px;
      color: #A39D93;
    }
    .footer {
      background-color: #171615;
      padding: 24px 32px;
      text-align: center;
      border-top: 1px solid #2B2824;
      font-size: 11px;
      color: #78736B;
      line-height: 1.6;
    }
    .footer a {
      color: #C49A45;
      text-decoration: none;
    }
    .footer-divider {
      margin: 12px 0;
      border: 0;
      border-top: 1px solid #2B2824;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="logo-badge">VIKM<span class="logo-dot">.</span> GROUP</div>
        <div class="header-tagline">Architectural & Construction Management Portal</div>
      </div>

      <!-- Main Content -->
      <div class="content">
        <h1>Administrator Access Invitation</h1>
        <p>Hello,</p>
        <p>You have been formally invited by <strong>${invitedBy}</strong> to join the <strong>VIKM GROUP Ltd</strong> Administrator Portal as a designated <strong>${role}</strong>.</p>
        
        <p>Through this dashboard, you will have access to incoming client quotation requests, architectural submissions, bespoke furniture orders, and project scoping management across Kigali and East Africa.</p>

        <!-- Details Card -->
        <div class="highlight-card">
          <div class="highlight-item">
            <span class="highlight-label">Invited Email</span>
            <strong>${email}</strong>
          </div>
          <div class="highlight-item" style="margin-top: 12px;">
            <span class="highlight-label">Assigned Role</span>
            <strong>${role}</strong>
          </div>
          <div class="highlight-item" style="margin-top: 12px;">
            <span class="highlight-label">Invitation Expiration</span>
            <span>${expiresDate} (Valid for 7 days)</span>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="btn-container">
          <a href="${inviteLink}" class="btn" target="_blank">Accept Invitation & Access Portal</a>
        </div>

        <p style="font-size: 12px; color: #8C857B; text-align: center;">
          If the button above does not work, copy and paste this link into your browser:
        </p>
        <div class="alt-link-card">
          ${inviteLink}
        </div>

        <p style="font-size: 12px; color: #78736B; margin-top: 24px;">
          Security Notice: If you were not expecting this invitation, you can safely disregard this message. This link is unique to your email address and should not be shared.
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <strong>VIKM GROUP Ltd</strong> · Kimironko, Gasabo District, Kigali, Rwanda<br>
        Phone: +250 794 399 892 / +250 783 156 702 · Email: <a href="mailto:sandrinetech97@gmail.com">sandrinetech97@gmail.com</a>
        <hr class="footer-divider">
        System Engineering & Lead Architecture by <a href="https://tuyambaze-gilbert.vercel.app/" target="_blank">Gilbert Tuyambaze</a>
      </div>
    </div>
  </div>
</body>
</html>
`
}

export async function POST(req: NextRequest) {
  try {
    const body: InviteRequestBody = await req.json()
    const { email, role = 'Admin', invitedBy = 'VIKM Administrator' } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()
    const token = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `invite_${Date.now()}`
    
    // 7 days expiration
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const expiresDateStr = expiresAt.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })

    // Construct invitation URL
    const origin = req.nextUrl.origin || 'http://localhost:3000'
    const inviteLink = `${origin}/admin?invite=${token}&email=${encodeURIComponent(cleanEmail)}`

    // Generate custom-branded HTML email
    const htmlContent = generateVikmInvitationEmailHtml({
      email: cleanEmail,
      role,
      invitedBy,
      inviteLink,
      expiresDate: expiresDateStr
    })

    const brevoApiKey = process.env.BREVO_API_KEY?.trim()
    const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim() || 'sandrinetech97@gmail.com'
    const senderName = process.env.BREVO_SENDER_NAME?.trim() || 'VIKM GROUP Ltd'

    let brevoSent = false
    let brevoMessageId: string | undefined
    let brevoError: string | undefined

    // Send via Brevo API if key is configured
    if (brevoApiKey && !brevoApiKey.includes('placeholder') && !brevoApiKey.includes('your_brevo')) {
      try {
        const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': brevoApiKey,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            sender: {
              name: senderName,
              email: senderEmail
            },
            to: [
              {
                email: cleanEmail,
                name: cleanEmail.split('@')[0]
              }
            ],
            subject: `VIKM GROUP — Invitation to join Admin Portal (${role})`,
            htmlContent: htmlContent
          })
        })

        const brevoData = await brevoRes.json()
        if (brevoRes.ok) {
          brevoSent = true
          brevoMessageId = brevoData.messageId
        } else {
          console.warn('Brevo API error response:', brevoData)
          brevoError = brevoData.message || 'Brevo API returned an error.'
        }
      } catch (sendErr: any) {
        console.error('Brevo fetch exception:', sendErr)
        brevoError = sendErr.message
      }
    }

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      role,
      token,
      inviteLink,
      expiresAt: expiresAt.toISOString(),
      emailSent: brevoSent,
      brevoMessageId,
      brevoConfigured: Boolean(brevoApiKey && !brevoApiKey.includes('placeholder')),
      notice: brevoSent 
        ? `Invitation email successfully dispatched to ${cleanEmail} via Brevo.`
        : (brevoError 
            ? `Brevo API notice: ${brevoError}. The invitation record and link have been generated.`
            : `Invitation link generated. (Configure BREVO_API_KEY in .env.local to dispatch live emails automatically).`)
    })
  } catch (err: any) {
    console.error('Invite handler error:', err)
    return NextResponse.json({ error: err.message || 'Failed to process invitation.' }, { status: 500 })
  }
}

