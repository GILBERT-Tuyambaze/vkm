import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const VIKM_MASTER_KNOWLEDGE_SYSTEM_PROMPT = `
You are "Gilbert", the official AI assistant and digital representative for VIKM GROUP Ltd.
You represent VIKM GROUP with warmth, architectural precision, high professionalism, helpfulness, and strict factual accuracy.

==================================================
1. OFFICIAL COMPANY PROFILE & CONTACT DETAILS
==================================================
- Company Name: VIKM GROUP Ltd
- Country & City: Kigali, Rwanda
- Physical Location: Kimironko, Gasabo District, Kigali, Rwanda
- Phone Numbers: 0794399892 / 0783156702
- WhatsApp Hotline: +250 794 399 892 (https://wa.me/250794399892)
- Official Email: sandrinetech97@gmail.com
- Lead Full-Stack Developer: Gilbert Tuyambaze (Portfolio: https://tuyambaze-gilbert.vercel.app/)
- Website Quotation Portal: /quote
- Services Overview: /services
- Projects Showcase: /projects

==================================================
2. MULTIDISCIPLINARY SERVICE ECOSYSTEM
==================================================
VIKM GROUP Ltd unites design, practical construction, bespoke production, and digital solutions under one roof:
1. Construction: Residential houses, duplexes, commercial buildings, structural renovations, building extensions, interior/exterior finishing, contractor specialist coordination.
2. Architecture: 2D blueprints & floor plans, 3D architectural models (ArchiCAD), exterior & interior renders, building concept design, architectural redesign/modifications.
3. Interior Design: Complete interior fit-outs, space planning, turnkey finishing, lighting & material coordination.
4. Exterior Design: Facade treatments, compound finishing, exterior visualization & remodeling.
5. Custom Made-to-Measure Furniture: Fitted kitchens with quartz/granite tops, built-in wardrobes, closets, TV entertainment units, executive desks, reception joinery, dining tables, sofas, restaurant/hotel furniture.
6. Renovation & Remodeling: Residential & commercial structural renovations, room conversions, modern upgrades.
7. Home Equipment & Fittings: Integration of high-grade fixtures, appliances, hardware, and complete turnkey fittings.
8. Branding & Graphic Design: Logos, brand visual identity, business cards, flyers, posters, labels, stickers, digital seals, and company stamps.
9. Packaging & Printing Coordination: Custom branded paper bags, bread bags, product packaging artwork, print-ready production & manufacturer coordination.
10. Software Development & Digital Solutions: Custom web applications, enterprise business systems, databases, APIs, digital signatures & seals, document workflows, mobile apps, website maintenance & fixes.

==================================================
3. OFFICIAL STARTING PRICE DATABASE (RWF)
==================================================
All prices marked "From" are STARTING RATES. Final quotation depends on project scope, dimensions, materials, and complexity.

A. ARCHITECTURE & DESIGN:
- House / Building Concept Design: From 100,000 RWF
- 2D Floor Plan: From 70,000 RWF
- 3D ArchiCAD Model: From 150,000 RWF
- 3D Exterior / Interior Visualization: From 100,000 RWF
- Architectural Modification / Redesign: From 70,000 RWF

B. SOFTWARE & DIGITAL SOLUTIONS:
- Business / Informational Website: From 150,000 RWF
- Professional Website + Admin Dashboard: From 250,000 RWF
- Website Redesign / Professional Upgrade: From 80,000 RWF
- Website Fixes & Troubleshooting: From 30,000 RWF
- Mobile Application Development: From 300,000 RWF
- Custom Web App / Business System: From 300,000 RWF
- Database Design & Integration: From 80,000 RWF
- API & System Integration: From 80,000 RWF
- Digital Seal / Digital Stamp: From 25,000 RWF
- Digital Signature & Document Workflow: From 50,000 RWF
- Software Maintenance & Updates: From 30,000 RWF
- UI/UX & Responsive Layout Design: From 50,000 RWF

C. BRANDING & GRAPHIC DESIGN:
- Logo Design / Redesign: From 30,000 RWF
- Business Card Design: From 15,000 RWF
- Flyer / Poster Design: From 15,000 RWF
- Label / Sticker Design: From 15,000 RWF
- Digital Seal / Stamp Design: From 25,000 RWF
- Branded Paper Bag / Packaging Design: From 25,000 RWF
- Custom Printing Coordination: Quotation based on quantity & specifications

D. FURNITURE & CONSTRUCTION:
- Custom quoted according to dimensions, materials (Solid wood, MDF, Plywood, Melamine, Laminate, Metal, Glass, Fabric/Leather), and site specifications. Recommend submitting details at /quote or via WhatsApp.

==================================================
4. FORMATTING, TABLES, MATHEMATICS & LINKS CAPABILITIES
==================================================
You have FULL CAPABILITY and are HIGHLY ENCOURAGED to format your responses cleanly:
1. **Markdown Tables**: Freely create structured tables whenever presenting prices, package options, feature comparisons, material specifications, or timelines. Example:
| Service | Starting Price | Key Inclusions |
|---|---|---|
| 2D Floor Plan | From 70,000 RWF | Dimensional layouts & sections |

2. **Mathematical Calculations & Estimations**:
You can perform cost calculations, area multiplications (e.g. Area = Length × Width, Total = Area × Rate), unit pricing, and mathematical formulas. You may format formulas clearly or use LaTeX math notation like \\( 120 \\text{ m}^2 \\times 2,500 = 300,000 \\text{ RWF} \\).

3. **Structured Navigation Links**:
Always include relevant markdown links to direct the client:
- Interactive Quotation: [/quote](/quote)
- Direct WhatsApp Hotline: [WhatsApp (+250 794 399 892)](https://wa.me/250794399892)
- Specific Service Pages: [/services/construction](/services/construction), [/services/architecture](/services/architecture), [/services/furniture](/services/furniture), [/services/interior](/services/interior), [/services/branding](/services/branding), [/services/software](/services/software)
- Projects Portfolio: [/projects](/projects)
- Contact & Office Location: [/contact](/contact)
- Lead Developer: [Gilbert Tuyambaze](https://tuyambaze-gilbert.vercel.app/)

4. **Response Structure**:
Use clean headings (###), bold highlights, bullet points, and callouts so information is readable and organized.

==================================================
5. STRICT ACCURACY RULES
==================================================
- When stating prices, always specify they are starting rates ("From ... RWF").
- Direct clients to [/quote](/quote) to submit exact requirements or [WhatsApp (+250 794 399 892)](https://wa.me/250794399892) for customized project proposals.
- Never invent unverified certifications, awards, customer testimonials, or fake social media accounts.
`

function getLocalFallbackResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase()

  // Pricing intent
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('starting') || lower.includes('table') || lower.includes('rate')) {
    if (lower.includes('website') || lower.includes('software') || lower.includes('app') || lower.includes('digital')) {
      return `### 💻 Software & Digital Services Starting Rates\n\n` +
        `| Service | Starting Price (RWF) | Key Inclusions |\n` +
        `|---|---|---|\n` +
        `| **Business / Informational Website** | From 150,000 RWF | Responsive 3-5 pages, SEO, contact form |\n` +
        `| **Professional Website + Admin Dashboard** | From 250,000 RWF | Custom admin portal, user management |\n` +
        `| **Mobile Application (iOS & Android)** | From 300,000 RWF | Cross-platform mobile app with backend API |\n` +
        `| **Custom Web App / Business System** | From 300,000 RWF | Workflows, inventory, database systems |\n` +
        `| **Website Redesign / Upgrade** | From 80,000 RWF | UI overhaul, speed & modern stack |\n` +
        `| **Digital Seal / Digital Stamp** | From 25,000 RWF | Secure corporate seal with verification |\n` +
        `| **Digital Signature & Workflow** | From 50,000 RWF | Document signing & verification pipeline |\n` +
        `| **Website Fixes & Maintenance** | From 30,000 RWF | Bug fixes, security patches & updates |\n\n` +
        `👉 **[Start a Project Quotation](/quote)** to get a tailored estimate for your business, or chat with us on **[WhatsApp (+250 794 399 892)](https://wa.me/250794399892)**.`
    }

    if (lower.includes('architecture') || lower.includes('floor plan') || lower.includes('3d') || lower.includes('plan')) {
      return `### 📐 Architecture & 3D Design Starting Rates\n\n` +
        `| Architectural Service | Starting Price (RWF) | Deliverables |\n` +
        `|---|---|---|\n` +
        `| **2D Floor Plan** | From 70,000 RWF | Detailed architectural layouts & dimensions |\n` +
        `| **House / Building Concept Design** | From 100,000 RWF | Master spatial planning & layout ideas |\n` +
        `| **3D ArchiCAD Model** | From 150,000 RWF | Complete 3D digital model of the structure |\n` +
        `| **3D Exterior / Interior Visualization** | From 100,000 RWF | Photorealistic lighting & texture renders |\n` +
        `| **Architectural Redesign / Modifications** | From 70,000 RWF | Plan updates, renovations & extensions |\n\n` +
        `*Note: Final quote depends on plot dimensions and architectural complexity.*\n\n` +
        `👉 Submit your plot dimensions at **[/quote](/quote)** or consult on **[WhatsApp (+250 794 399 892)](https://wa.me/250794399892)**.`
    }

    if (lower.includes('logo') || lower.includes('brand') || lower.includes('flyer') || lower.includes('business card') || lower.includes('packaging')) {
      return `### 🎨 Branding & Packaging Design Starting Rates\n\n` +
        `| Branding Service | Starting Price (RWF) | Inclusions |\n` +
        `|---|---|---|\n` +
        `| **Logo Design / Redesign** | From 30,000 RWF | Vector files, color palettes & guidelines |\n` +
        `| **Business Card Design** | From 15,000 RWF | Double-sided print-ready artwork |\n` +
        `| **Flyer / Poster Design** | From 15,000 RWF | Marketing graphics & event flyers |\n` +
        `| **Label / Sticker Design** | From 15,000 RWF | Custom product labels & die-cut stickers |\n` +
        `| **Digital Seal / Stamp Design** | From 25,000 RWF | High-resolution corporate digital seal |\n` +
        `| **Branded Paper Bag / Packaging** | From 25,000 RWF | Custom packaging artwork & die-lines |\n\n` +
        `👉 View past projects at **[/projects](/projects)** or contact us at **[/contact](/contact)**.`
    }

    return `### 📊 VIKM GROUP Ltd Price Guide (Starting Rates)\n\n` +
      `| Discipline | Starting Rate | Next Step |\n` +
      `|---|---|---|\n` +
      `| **Architecture & 2D Plans** | From 70,000 RWF | [/services/architecture](/services/architecture) |\n` +
      `| **3D ArchiCAD & Renders** | From 100,000 – 150,000 RWF | [/services/architecture](/services/architecture) |\n` +
      `| **Websites & Digital Systems** | From 150,000 – 300,000 RWF | [/services/software](/services/software) |\n` +
      `| **Visual Branding & Logos** | From 30,000 RWF | [/services/branding](/services/branding) |\n` +
      `| **Digital Seals & Signatures** | From 25,000 – 50,000 RWF | [/services/software](/services/software) |\n` +
      `| **Custom Furniture & Construction** | Custom quoted by dimensions | [/quote](/quote) |\n\n` +
      `Would you like an accurate proposal? Please submit your project at **[/quote](/quote)** or message us directly on **[WhatsApp (+250 794 399 892)](https://wa.me/250794399892)**.`
  }

  if (lower.includes('service') || lower.includes('what do you do') || lower.includes('offer')) {
    return `**VIKM GROUP Ltd** is a Kigali-based multidisciplinary firm providing 6 core disciplines:\n\n` +
      `1. **[Construction & Civil Works](/services/construction)** — Residential houses, duplexes, commercial buildings & structural finishing.\n` +
      `2. **[Architectural Design](/services/architecture)** — 2D floor plans, 3D ArchiCAD modeling & photorealistic visualization.\n` +
      `3. **[Made-to-Measure Furniture](/services/furniture)** — Custom kitchens, wardrobes, dining sets, executive office desks & reception joinery.\n` +
      `4. **[Interior & Exterior Design](/services/interior)** — Turnkey interior styling, lighting fit-outs, space planning & facade finishing.\n` +
      `5. **[Branding & Packaging](/services/branding)** — Visual identity, logos, branded paper bags, product labels & print coordination.\n` +
      `6. **[Software & Digital Solutions](/services/software)** — Custom web applications, enterprise business systems, digital stamps/signatures & websites.\n\n` +
      `Explore our work at **[/projects](/projects)** or request an estimate at **[/quote](/quote)**.`
  }

  if (lower.includes('kitchen') || lower.includes('furniture') || lower.includes('wardrobe') || lower.includes('cabinet') || lower.includes('desk')) {
    return `### 🛋️ Made-to-Measure Bespoke Furniture in Kigali\n\n` +
      `| Category | Features & Materials | Tailoring |\n` +
      `|---|---|---|\n` +
      `| **Custom Kitchens** | Quartz/granite countertops, waterproof cabinetry, soft-close hinges | Made to exact kitchen dimensions |\n` +
      `| **Built-in Wardrobes** | Seamless floor-to-ceiling sliding or hinged doors | Customized interior drawers & lighting |\n` +
      `| **Office Joinery** | Executive desks, reception counters, conference tables | Integrated cable management |\n` +
      `| **Living & Dining** | Dining sets, TV units, luxury sofas | Solid wood, metal, MDF, leather/fabric |\n\n` +
      `👉 Send your room measurements and photos to us via **[WhatsApp (+250 794 399 892)](https://wa.me/250794399892)** or submit a request at **[/quote](/quote)**.`
  }

  if (lower.includes('location') || lower.includes('where') || lower.includes('office') || lower.includes('address') || lower.includes('contact')) {
    return `### 📍 VIKM GROUP Ltd Contact Information\n\n` +
      `| Detail | Information |\n` +
      `|---|---|\n` +
      `| **Physical Office** | Kimironko, Gasabo District, Kigali, Rwanda |\n` +
      `| **Phone Numbers** | 0794399892 / 0783156702 |\n` +
      `| **WhatsApp Direct** | [+250 794 399 892](https://wa.me/250794399892) |\n` +
      `| **Official Email** | sandrinetech97@gmail.com |\n` +
      `| **Working Hours** | Monday – Saturday, 8:00 AM – 6:00 PM |\n\n` +
      `You can also request a quotation directly online at **[/quote](/quote)** or view our **[/contact](/contact)** page.`
  }

  if (lower.includes('developer') || lower.includes('built') || lower.includes('gilbert') || lower.includes('author') || lower.includes('who made')) {
    return `This website and digital platform was engineered by **Gilbert Tuyambaze** — Lead Full-Stack Engineer and Digital Solutions Specialist.\n\n` +
      `👉 Explore Gilbert's portfolio, web systems, and engineering background:\n` +
      `**[https://tuyambaze-gilbert.vercel.app/](https://tuyambaze-gilbert.vercel.app/)**`
  }

  return `Thank you for reaching out to **VIKM GROUP Ltd** in Kigali, Rwanda!\n\n` +
    `I can assist you with:\n` +
    `• **Construction & Architecture**: Building, 2D floor plans & 3D ArchiCAD designs\n` +
    `• **Bespoke Furniture**: Custom kitchens, wardrobes, and commercial joinery\n` +
    `• **Software & Digital**: Custom web apps, websites, digital seals & signatures\n` +
    `• **Branding & Packaging**: Logos, packaging bags & corporate identity\n` +
    `• **Quotations & Pricing**: Official starting prices, math calculations & tailored estimates\n\n` +
    `Feel free to ask a question, start a project at **[/quote](/quote)**, or message our team directly on **[WhatsApp at +250 794 399 892](https://wa.me/250794399892)**.`
}

const CANDIDATE_MODELS = [
  process.env.GROQ_MODEL,
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
  'groq/compound-mini',
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant'
].filter(Boolean) as string[]

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required.' }, { status: 400 })
    }

    const lastUserMessage = messages[messages.length - 1]?.content || ''
    const rawApiKey = process.env.GROQ_API_KEY
    const apiKey = rawApiKey ? rawApiKey.trim() : ''

    // If Groq API Key is configured, attempt calling candidate models
    if (apiKey && !apiKey.includes('placeholder') && !apiKey.includes('your_groq_api_key')) {
      const groq = new Groq({ apiKey })
      const formattedMessages = [
        { role: 'system' as const, content: VIKM_MASTER_KNOWLEDGE_SYSTEM_PROMPT },
        ...messages.map((m: any) => ({
          role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: String(m.content || '')
        }))
      ]

      // Try candidate models in order until one succeeds
      for (const modelName of CANDIDATE_MODELS) {
        try {
          const completion = await groq.chat.completions.create({
            model: modelName,
            messages: formattedMessages,
            temperature: 0.45,
            max_tokens: 850
          })

          const reply = completion.choices[0]?.message?.content
          if (reply && reply.trim().length > 0) {
            return NextResponse.json({ 
              reply: reply.trim(),
              provider: 'groq',
              model: modelName
            })
          }
        } catch (modelErr: any) {
          console.warn(`Groq model ${modelName} attempt failed (${modelErr.status || modelErr.message}), checking next model...`)
        }
      }
    }

    // Offline / Local knowledge base fallback using help/info.text rules
    const fallbackReply = getLocalFallbackResponse(lastUserMessage)
    return NextResponse.json({ 
      reply: fallbackReply,
      provider: 'fallback',
      model: 'local-knowledge-engine'
    })
  } catch (err: any) {
    console.error('Chat API Handler Error:', err)
    return NextResponse.json({ 
      reply: 'Hello! I am Gilbert, your VIKM GROUP assistant. You can reach our team directly at +250 794 399 892 or start a project at /quote.',
      provider: 'fallback',
      model: 'local-error-recovery'
    })
  }
}
