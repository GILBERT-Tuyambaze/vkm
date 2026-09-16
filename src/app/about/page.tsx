import Link from 'next/link'
import { Layout } from '@/components/marketing-layout'
import { Reveal } from '@/components/reveal'

export const metadata = {
  title: 'About | VIKM GROUP Ltd',
  description: 'Multidisciplinary construction, architecture, furniture and interiors in Kigali, Rwanda.'
}

export default function About() {
  return (
    <Layout>
      <main className="pt-20">
        <section className="pt-8 pb-16 md:pt-12 md:pb-20">
          <div className="container grid gap-12 md:grid-cols-2">
            <Reveal direction="left">
              <div>
                <p className="eyebrow">About VIKM GROUP</p>
                <h1 className="display mt-5">Practical expertise. Considered detail.</h1>
              </div>
            </Reveal>

            <Reveal direction="right" delay={150}>
              <div className="pt-2 text-lg leading-8 text-[var(--graphite)]">
                <p>
                  VIKM GROUP is a multidisciplinary company based in Kigali, Rwanda. We bring construction, architecture, furniture and interiors together so clients can work with one team from the first conversation to the finished space.
                </p>
                <p className="mt-6">
                  Our approach is straightforward: understand what matters, plan clearly, coordinate the work and deliver with care.
                </p>
                <Link
                  href="/quote"
                  className="mt-8 inline-block bg-[var(--timber)] px-6 py-3 text-xs uppercase tracking-[.12em] text-white transition-colors duration-200 hover:bg-[var(--timber-dk)] rounded-md"
                >
                  Work with us
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </Layout>
  )
}
