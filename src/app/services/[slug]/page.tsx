import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Layout } from '@/components/marketing-layout'
import { services, serviceHighlights } from '@/content/site'

export function generateStaticParams() {
  return services.map(s => ({ slug: s.slug }))
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = services.find(s => s.slug === slug)
  if (!service) notFound()
  const included = serviceHighlights[service.slug] ?? []

  return (
    <Layout>
      <main className="pt-20">
        <section className="pt-8 pb-16 md:pt-12 md:pb-20">
          <div className="container grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="eyebrow">VIKM GROUP services</p>
              <h1 className="display mt-3">{service.label}</h1>
              <p className="mt-5 max-w-lg text-lg text-[var(--graphite)]">{service.description}</p>
              <p className="mt-4 max-w-lg leading-7 text-[var(--stone)]">
                We combine practical planning, clear communication and professional execution to create a complete result for your home, business or organisation.
              </p>
            </div>
            <div className="aspect-[1.2] overflow-hidden bg-[#ddd6cc]">
              <img src={service.image} alt={`${service.label} service example`} className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        <section className="section border-t border-[var(--line)]">
          <div className="container grid gap-12 md:grid-cols-2">
            <div>
              <p className="eyebrow">What we can help with</p>
              <h2 className="mt-4 text-4xl">A complete service, shaped around your needs.</h2>
            </div>
            <ul className="border-t border-[var(--line)]">
              {included.map((x, i) => (
                <li key={x} className="flex gap-5 border-b border-[var(--line)] py-5">
                  <span className="text-[var(--timber)]">0{i + 1}</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[var(--timber)] py-20 text-white">
          <div className="container flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <h2 className="text-4xl">Ready to start a conversation?</h2>
            <Link
              href="/quote"
              className="w-fit inline-flex items-center justify-center bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-[.14em] !text-[#171411] shadow-lg transition-all duration-200 hover:bg-[#171411] hover:!text-white"
            >
              Request a quotation
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  )
}
