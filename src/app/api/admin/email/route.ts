import { NextRequest, NextResponse } from 'next/server'

interface SendEmailPayload {
  recipientEmail: string
  recipientName?: string
  subject: string
  heading?: string
  message: string
  category?: 'Quote & Proposal' | 'Status Update' | 'Client Notice' | 'Staff Invitation' | 'General'
  details?: Array<{ label: string; value: string }>
  ctaText?: string
  ctaUrl?: string
}

function generateVikmBrandedEmail({
  recipientName,
  heading,
  message,
  category,
  details,
  ctaText,
  ctaUrl
}: {
  recipientName?: string
  heading?: string
  message: string
  category?: string
  details?: Array<{ label: string; value: string }>
  ctaText?: string
  ctaUrl?: string
}): string {
  const detailsHtml = details && details.length > 0
    ? `
      <div style="background-color: #272421; border: 1px solid #423D37; border-left: 4px solid #C49A45; border-radius: 10px; padding: 18px 20px; margin: 24px 0;">
        ${details.map(d => `
          <div style="margin-bottom: 10px;">
            <span style="color: #8C857B; text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em; font-weight: 600; display: block; margin-bottom: 2px;">${d.label}</span>
            <span style="font-size: 13px; color: #EDE8DF; font-weight: 500;">${d.value}</span>
          </div>
        `).join('')}
      </div>
    `
    : ''

  const ctaHtml = ctaText && ctaUrl
    ? `
      <div style="text-align: center; margin: 32px 0 20px;">
        <a href="${ctaUrl}" target="_blank" style="display: inline-block; background-color: #C49A45; color: #141312 !important; text-decoration: none; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; padding: 15px 34px; border-radius: 9px; box-shadow: 0 6px 18px rgba(196, 154, 69, 0.35);">
          ${ctaText}
        </a>
      </div>
    `
    : ''

  const paragraphsHtml = message
    .split('\n')
    .filter(p => p.trim().length > 0)
    .map(p => `<p style="font-size: 14px; line-height: 1.65; color: #B5AFA6; margin: 0 0 16px;">${p}</p>`)
    .join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VIKM GROUP Communication</title>
</head>
<body style="margin:0; padding:0; background-color:#141312; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#EDE8DF; -webkit-font-smoothing:antialiased;">
  <div style="width:100%; background-color:#141312; padding:40px 16px;">
    <div style="max-width:580px; margin:0 auto; background-color:#1F1D1B; border:1px solid #36322D; border-radius:16px; overflow:hidden; box-shadow:0 20px 40px rgba(0, 0, 0, 0.5);">
      
      <!-- Brand Header -->
      <div style="background: linear-gradient(180deg, #2A2622 0%, #1F1D1B 100%); padding: 34px 32px 26px; text-align: center; border-bottom: 1px solid #36322D;">
        <div style="font-size: 22px; font-weight: 700; letter-spacing: 0.2em; color: #FFFFFF; text-transform: uppercase; margin-bottom: 6px;">
          VIKM<span style="color:#C49A45;">.</span> GROUP
        </div>
        <div style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #C49A45; font-weight: 600;">
          ${category || 'Official Client & Project Communication'}
        </div>
      </div>

      <!-- Main Body -->
      <div style="padding: 36px 32px;">
        ${heading ? `<h1 style="font-size: 20px; font-weight: 600; color: #FFFFFF; margin: 0 0 16px; line-height: 1.35;">${heading}</h1>` : ''}
        ${recipientName ? `<p style="font-size: 14px; line-height: 1.6; color: #EDE8DF; font-weight: 600; margin: 0 0 16px;">Dear ${recipientName},</p>` : ''}
        
        ${paragraphsHtml}

        ${detailsHtml}

        ${ctaHtml}
      </div>

      <!-- Footer -->
      <div style="background-color: #171615; padding: 24px 32px; text-align: center; border-top: 1px solid #2B2824; font-size: 11px; color: #78736B; line-height: 1.6;">
        <strong>VIKM GROUP Ltd</strong> · Kimironko, Gasabo District, Kigali, Rwanda<br>
        Phone: +250 794 399 892 / +250 783 156 702 · Email: <a href="mailto:sandrinetech97@gmail.com" style="color:#C49A45; text-decoration:none;">sandrinetech97@gmail.com</a>
        <div style="margin: 12px 0; border-top: 1px solid #2B2824;"></div>
        Architectural Design · Construction · Custom Furniture · Branding · Software Solutions
      </div>
    </div>
  </div>
</body>
</html>
`
}

export async function POST(req: NextRequest) {
  try {
    const body: SendEmailPayload = await req.json()
    const {
      recipientEmail,
      recipientName,
      subject,
      heading,
      message,
      category,
      details,
      ctaText,
      ctaUrl
    } = body

    if (!recipientEmail || !recipientEmail.includes('@')) {
      return NextResponse.json({ error: 'A valid recipient email address is required.' }, { status: 400 })
    }
    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message body are required.' }, { status: 400 })
    }

    const cleanEmail = recipientEmail.trim().toLowerCase()
    const htmlContent = generateVikmBrandedEmail({
      recipientName: recipientName?.trim(),
      heading: heading?.trim(),
      message: message.trim(),
      category,
      details,
      ctaText: ctaText?.trim(),
      ctaUrl: ctaUrl?.trim()
    })

    const brevoApiKey = process.env.BREVO_API_KEY?.trim()
    const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim() || 'paperhubur@gmail.com'
    const senderName = process.env.BREVO_SENDER_NAME?.trim() || 'VIKM GROUP Ltd'

    if (!brevoApiKey || brevoApiKey.includes('placeholder')) {
      return NextResponse.json({
        success: false,
        error: 'Brevo API key is not configured in .env.local.'
      }, { status: 400 })
    }

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
            name: recipientName || cleanEmail.split('@')[0]
          }
        ],
        subject: subject.trim(),
        htmlContent: htmlContent
      })
    })

    const brevoData = await brevoRes.json()

    if (brevoRes.ok) {
      return NextResponse.json({
        success: true,
        messageId: brevoData.messageId,
        recipient: cleanEmail,
        notice: `Branded email successfully dispatched to ${cleanEmail}.`
      })
    } else {
      console.error('Brevo API Error:', brevoData)
      return NextResponse.json({
        success: false,
        error: brevoData.message || 'Brevo API rejected the email request.'
      }, { status: brevoRes.status })
    }
  } catch (err: any) {
    console.error('Email API Error:', err)
    return NextResponse.json({ error: err.message || 'Internal error sending email.' }, { status: 500 })
  }
}

