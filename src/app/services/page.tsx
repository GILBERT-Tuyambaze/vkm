import Link from 'next/link'
import { Layout } from '@/components/marketing-layout'
import { Reveal, StaggerReveal } from '@/components/reveal'
import { services } from '@/content/site'

export const metadata = {
  title: 'Services | VIKM GROUP Ltd',
  description: 'Multidisciplinary construction, architecture, furniture, interiors and digital services in Kigali.'
}

export default function Services() {
  return (
    <Layout>
      <main className="pt-20">
        <section className="pt-8 pb-16 md:pt-12 md:pb-20">
          <div className="container">
            <div className="grid gap-10 md:grid-cols-[1.1fr_.9fr] md:items-center">
              <Reveal direction="left">
                <div>
                  <p className="eyebrow">What we do</p>
                  <h1 className="display mt-3">One team for the whole picture.</h1>
                  <p className="mt-5 max-w-lg text-lg text-[var(--graphite)]">
                    From construction and architecture to bespoke furniture, interior styling and custom digital systems, we coordinate every stage with care.
                  </p>
                </div>
              </Reveal>

              <Reveal direction="right" delay={150}>
                <div className="aspect-[1.5] overflow-hidden bg-[#ddd6cc]">
                  <img
                    src={services[0].image}
                    alt="VIKM services showcase"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                </div>
              </Reveal>
            </div>

            <StaggerReveal staggerDelay={120} direction="up" className="mt-16 grid gap-8 md:grid-cols-2">
              {services.map(s => (
                <Link href={`/services/${s.slug}`} key={s.slug} className="group block border-t border-[var(--line)] pt-5">
                  <div className="aspect-[1.5] overflow-hidden bg-[#ddd6cc]">
                    <img
                      src={s.image}
                      alt={s.label}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h2 className="mt-5 text-2xl font-medium text-[var(--ink)] transition-colors duration-200 group-hover:text-[var(--timber)]">
                    {s.label}
                  </h2>
                  <p className="mt-2 max-w-md text-[var(--stone)]">{s.description}</p>
                </Link>
              ))}
            </StaggerReveal>
          </div>
        </section>
      </main>
    </Layout>
  )
}
