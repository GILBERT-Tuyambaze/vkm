import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Layout } from '@/components/marketing-layout'
import { projects } from '@/content/site'

export function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }))
}

export default async function Project({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = projects.find(x => x.slug === slug)
  if (!p) notFound()

  return (
    <Layout>
      <main className="pt-20">
        <section className="pt-8 pb-16 md:pt-12 md:pb-20">
          <div className="container">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">{p.category} · {p.location}</p>
                <h1 className="display mt-3">{p.title}</h1>
              </div>
              <Link href="/projects" className="text-xs uppercase tracking-[.12em] text-[var(--stone)] transition-colors hover:text-[var(--ink)]">
                ← Back to projects
              </Link>
            </div>
            <div className="mt-10 aspect-[1.8] overflow-hidden bg-[#ddd6cc]">
              <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <p className="text-2xl leading-snug">
                A considered project shaped around the client&apos;s needs, the character of the space and the details that make it feel complete.
              </p>
              <p className="text-[var(--graphite)]">
                Project photography and extended case study details will be added as the portfolio grows. If you have a similar project in mind, we would love to hear about it.
              </p>
            </div>
            <Link href="/quote" className="mt-10 inline-block bg-[var(--timber)] px-6 py-3 text-xs uppercase tracking-[.12em] text-white transition-colors duration-200 hover:bg-[var(--timber-dk)]">
              Discuss your project
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  )
}
