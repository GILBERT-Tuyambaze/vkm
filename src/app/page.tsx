import Link from 'next/link'
import { ArrowLink, Layout } from '@/components/marketing-layout'
import { TickerBackground } from '@/components/ticker-background'
import { Reveal, StaggerReveal } from '@/components/reveal'
import { capabilities, images, process, projects, services } from '@/content/site'

function Image({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden bg-[#ddd6cc] ${className}`}>
      <img src={src} alt={alt} className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]" />
    </div>
  )
}

export default function Home() {
  return (
    <Layout>
      <main>
        {/* Hero Section */}
        <section className="relative flex min-h-[620px] items-end overflow-hidden bg-[var(--ink)] text-white md:min-h-[680px]">
          <Image src="/images/hero.png" alt="Warm contemporary living space designed for everyday life" className="absolute inset-0 opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
          
          <div className="container relative z-10 pb-16 pt-32 md:pb-24">
            <Reveal direction="down" duration={600}>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-white">
                Construction · Architecture · Furniture · Interiors · Digital
              </p>
            </Reveal>

            <Reveal direction="up" delay={100} duration={750}>
              <h1 className="display mt-5 max-w-4xl text-white">
                We build, design and furnish complete spaces.
              </h1>
            </Reveal>

            <Reveal direction="up" delay={200} duration={750}>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/90">
                VIKM GROUP combines practical construction, considered design, custom furniture, home equipment and digital solutions for residential and commercial clients in Rwanda and beyond.
              </p>
            </Reveal>

            <Reveal direction="up" delay={300} duration={750}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/quote"
                  className="bg-[var(--timber)] px-6 py-3 text-xs uppercase tracking-[.12em] text-white transition-colors duration-200 hover:bg-[var(--timber-dk)]"
                >
                  Request a quotation
                </Link>
                <Link
                  href="/projects"
                  className="border border-white/60 px-6 py-3 text-xs uppercase tracking-[.12em] text-white transition-colors duration-200 hover:border-white hover:bg-white hover:!text-[var(--ink)]"
                >
                  View our work
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="absolute bottom-8 right-8 hidden text-[10px] uppercase tracking-[.2em] text-white/80 md:block">
            Scroll to explore ↓
          </div>
        </section>

        {/* One Partner, Many Disciplines Section */}
        <section className="section pb-20">
          <div className="container grid gap-10 md:grid-cols-[.9fr_1.1fr] md:items-center">
            <Reveal direction="left" duration={800}>
              <Image src={images.interior} alt="Finished interior with coordinated furniture and lighting" className="aspect-[1.2]" />
            </Reveal>

            <Reveal direction="right" delay={150} duration={800}>
              <div>
                <p className="eyebrow">One partner, many disciplines</p>
                <h2 className="mt-4 max-w-xl text-4xl tracking-[-.03em] md:text-5xl">
                  From the first sketch to the final installation.
                </h2>
                <p className="mt-6 max-w-lg leading-7 text-[var(--graphite)]">
                  We help homeowners, developers, businesses and institutions move from an idea to a functional, attractive space. Our team coordinates the design, making, execution and specialist partners required to deliver the whole picture.
                </p>
                <div className="mt-7">
                  <ArrowLink href="/about">Learn about VIKM</ArrowLink>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* What We Do Services Grid */}
        <section className="section border-t border-[var(--line)]">
          <div className="container">
            <div className="mb-12 flex items-end justify-between">
              <Reveal direction="up">
                <div>
                  <p className="eyebrow">What we do</p>
                  <h2 className="mt-4 text-4xl tracking-[-.03em]">Built around your vision.</h2>
                </div>
              </Reveal>
              <Reveal direction="left" delay={100}>
                <ArrowLink href="/services">All services</ArrowLink>
              </Reveal>
            </div>

            <StaggerReveal staggerDelay={120} direction="up" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map(service => (
                <article key={service.slug} className="group">
                  <div className="aspect-[1.35] overflow-hidden bg-[#ddd6cc]">
                    <img
                      src={service.image}
                      alt={service.label}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex items-start justify-between border-b border-[var(--line)] py-5">
                    <div>
                      <h3 className="text-xl font-medium text-[var(--ink)] transition-colors duration-200 group-hover:text-[var(--timber)]">
                        {service.label}
                      </h3>
                      <p className="mt-2 max-w-sm text-sm text-[var(--stone)]">{service.description}</p>
                    </div>
                    <ArrowLink href={`/services/${service.slug}`}>Explore</ArrowLink>
                  </div>
                </article>
              ))}
            </StaggerReveal>
          </div>
        </section>

        {/* Software & Digital Solutions */}
        <section className="section border-t border-[var(--line)] bg-[#eee9df]">
          <div className="container grid gap-10 md:grid-cols-[1.05fr_.95fr] md:items-center">
            <Reveal direction="left" duration={800}>
              <div className="overflow-hidden bg-[var(--ink)]">
                <Image src={images.kitchen} alt="Digital workspace and technology supporting a modern business" className="aspect-[1.15]" />
              </div>
            </Reveal>

            <Reveal direction="right" delay={150} duration={800}>
              <div>
                <p className="eyebrow">Software & digital solutions</p>
                <h2 className="mt-4 max-w-xl text-4xl tracking-[-.03em] md:text-5xl">
                  The digital systems behind better businesses.
                </h2>
                <p className="mt-6 max-w-lg leading-7 text-[var(--graphite)]">
                  VIKM GROUP also builds practical software for businesses, institutions and growing teams. We turn manual processes into clear, reliable digital tools that are easier to use and ready to grow.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="border-t border-[var(--line)] pt-4">
                    <p className="font-medium">Websites & applications</p>
                    <p className="mt-1 text-sm text-[var(--stone)]">Digital experiences built around your customers and workflow.</p>
                  </div>
                  <div className="border-t border-[var(--line)] pt-4">
                    <p className="font-medium">Business systems</p>
                    <p className="mt-1 text-sm text-[var(--stone)]">Custom tools, document solutions, seals and signatures.</p>
                  </div>
                </div>
                <div className="mt-8">
                  <ArrowLink href="/services/digital">Explore digital services</ArrowLink>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Why VIKM with Animated Ticker Background */}
        <section className="relative overflow-hidden bg-[var(--ink)] py-24 text-[var(--bone)]">
          <TickerBackground />
          <div className="container relative z-10">
            <Reveal direction="up">
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--timber)]">Why VIKM</p>
            </Reveal>

            <StaggerReveal staggerDelay={140} direction="up" className="mt-12 grid gap-10 md:grid-cols-4">
              {[
                'Tailored to your needs and budget',
                'Clear communication from idea to delivery',
                'Coordination of every stage',
                'Professional execution with trusted specialists',
              ].map((text, i) => (
                <div key={text} className="border-t border-white/20 pt-5">
                  <span className="text-sm font-semibold text-[var(--timber)]">0{i + 1}</span>
                  <p className="mt-6 text-lg leading-7 text-white/95">{text}</p>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </section>

        {/* Selected Work Grid */}
        <section className="section">
          <div className="container">
            <div className="flex items-end justify-between">
              <Reveal direction="up">
                <div>
                  <p className="eyebrow">Selected work</p>
                  <h2 className="mt-4 text-4xl tracking-[-.03em]">Spaces with purpose.</h2>
                </div>
              </Reveal>
              <Reveal direction="left" delay={100}>
                <ArrowLink href="/projects">View all work</ArrowLink>
              </Reveal>
            </div>

            <StaggerReveal staggerDelay={150} direction="up" className="mt-12 grid gap-8 md:grid-cols-3">
              {projects.slice(0, 3).map(project => (
                <Link key={project.slug} href={`/projects/${project.slug}`} className="group block">
                  <div className="aspect-[1.25] overflow-hidden bg-[#ddd6cc]">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="pt-4">
                    <h3 className="text-xl font-medium text-[var(--ink)] transition-colors duration-200 group-hover:text-[var(--timber)]">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--stone)]">
                      {project.category} · {project.location}
                    </p>
                  </div>
                </Link>
              ))}
            </StaggerReveal>
          </div>
        </section>

        {/* Capabilities Ticker Strip */}
        <section className="border-y border-[var(--line)] py-8 overflow-hidden">
          <Reveal direction="up">
            <div className="container flex snap-x gap-8 overflow-x-auto md:grid md:grid-cols-6">
              {capabilities.map(item => (
                <span key={item} className="min-w-max snap-start text-sm text-[var(--graphite)]">
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Our Process Section */}
        <section className="section">
          <div className="container grid gap-12 md:grid-cols-[.7fr_1.3fr]">
            <Reveal direction="left">
              <div>
                <p className="eyebrow">Our process</p>
                <h2 className="mt-4 text-4xl tracking-[-.03em]">A clear path forward.</h2>
              </div>
            </Reveal>

            <StaggerReveal staggerDelay={90} direction="right">
              {process.map((step, i) => (
                <div key={step} className="flex gap-6 border-t border-[var(--line)] py-5">
                  <span className="text-sm text-[var(--timber)]">0{i + 1}</span>
                  <p className="text-lg text-[var(--ink)]">{step}</p>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-[var(--timber)] py-20 text-white overflow-hidden">
          <div className="container flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <Reveal direction="up">
              <h2 className="max-w-xl text-4xl tracking-[-.03em] md:text-5xl">
                Tell us about your project.
              </h2>
            </Reveal>

            <Reveal direction="up" delay={150}>
              <div className="flex flex-wrap items-center gap-3.5">
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center bg-white px-7 py-3.5 text-xs font-semibold uppercase tracking-[.14em] text-[var(--ink)] shadow-md transition-all duration-200 hover:bg-[var(--ink)] hover:text-white"
                >
                  Request a quotation
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center border border-white px-7 py-3.5 text-xs font-semibold uppercase tracking-[.14em] text-white transition-all duration-200 hover:bg-white hover:text-[var(--timber-dk)]"
                >
                  Contact us
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </Layout>
  )
}
