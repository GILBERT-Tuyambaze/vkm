import { Layout } from '@/components/marketing-layout'
import { Reveal, StaggerReveal } from '@/components/reveal'
import { site } from '@/content/site'

export const metadata = {
  title: 'Contact | VIKM GROUP Ltd',
  description: 'Get in touch with VIKM GROUP in Kimironko, Kigali, Rwanda.'
}

export default function Contact() {
  return (
    <Layout>
      <main className="pt-20">
        <section className="pt-8 pb-16 md:pt-12 md:pb-20">
          <div className="container">
            <Reveal direction="up">
              <p className="eyebrow">Contact</p>
              <h1 className="display mt-5 max-w-3xl">Good work starts with a conversation.</h1>
            </Reveal>

            <StaggerReveal staggerDelay={120} direction="up" className="mt-20 grid gap-12 border-t border-[var(--line)] pt-8 md:grid-cols-3">
              <div>
                <p className="eyebrow">Call or WhatsApp</p>
                <a
                  href={`tel:${site.phone}`}
                  className="mt-4 block text-2xl transition-colors duration-200 hover:text-[var(--timber)]"
                >
                  {site.phone}
                </a>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-[var(--timber-dk)] transition-colors duration-200 hover:text-[var(--timber)]"
                >
                  Message us on WhatsApp →
                </a>
              </div>

              <div>
                <p className="eyebrow">Email</p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-4 block text-lg transition-colors duration-200 hover:text-[var(--timber)]"
                >
                  {site.email}
                </a>
              </div>

              <div>
                <p className="eyebrow">Visit</p>
                <p className="mt-4 text-lg text-[var(--graphite)]">{site.location}</p>
              </div>
            </StaggerReveal>
          </div>
        </section>
      </main>
    </Layout>
  )
}
