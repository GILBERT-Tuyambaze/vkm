import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { targetEmail } = await req.json()
    const testRecipient = targetEmail?.trim() || 'paperhubur@gmail.com'

    const apiKey = process.env.BREVO_API_KEY?.trim()
    const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim() || 'paperhubur@gmail.com'
    const senderName = process.env.BREVO_SENDER_NAME?.trim() || 'VIKM GROUP Ltd'

    if (!apiKey || apiKey.includes('placeholder')) {
      return NextResponse.json({
        configured: false,
        error: 'BREVO_API_KEY environment variable is not defined on this server. Add it to Vercel Project Settings.'
      }, { status: 400 })
    }

    // 1. Check account info
    const accountRes = await fetch('https://api.brevo.com/v3/account', {
      headers: { 'api-key': apiKey }
    })
    const accountData = await accountRes.json()

    if (!accountRes.ok) {
      return NextResponse.json({
        configured: false,
        brevoStatus: accountRes.status,
        error: accountData.message || 'Brevo API rejected the API key.'
      }, { status: accountRes.status })
    }

    // 2. Dispatch a test diagnostic email
    const sendRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail
        },
        to: [
          {
            email: testRecipient,
            name: 'VIKM Administrator'
          }
        ],
        subject: `VIKM GROUP — Brevo SMTP Production Verification (${new Date().toLocaleTimeString()})`,
        htmlContent: `
          <div style="background-color:#141312; color:#EDE8DF; padding:30px; font-family:sans-serif; border-radius:12px;">
            <h2 style="color:#C49A45; margin:0 0 10px;">VIKM GROUP SMTP Test Successful</h2>
            <p>This automated test confirms that your Brevo API credentials and sender (<strong>${senderEmail}</strong>) are properly configured and operational on this deployment.</p>
            <p style="font-size:12px; color:#8C857B;">Timestamp: ${new Date().toISOString()}</p>
          </div>
        `
      })
    })

    const sendData = await sendRes.json()

    return NextResponse.json({
      configured: true,
      apiKeyMasked: `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`,
      senderEmail,
      senderName,
      accountEmail: accountData.email,
      creditsRemaining: accountData.plan?.[0]?.credits,
      emailSent: sendRes.ok,
      messageId: sendData.messageId,
      notice: sendRes.ok 
        ? `Verification test email sent to ${testRecipient}. (Check Inbox or Spam).` 
        : `Brevo send error: ${sendData.message || 'Could not send test email'}`
    })
  } catch (err: any) {
    return NextResponse.json({
      configured: false,
      error: err.message || 'Internal connection error to Brevo.'
    }, { status: 500 })
  }
}

