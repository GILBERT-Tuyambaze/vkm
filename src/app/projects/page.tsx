import { Layout } from '@/components/marketing-layout'
import { ProjectsGrid } from '@/components/projects-grid'
import { Reveal } from '@/components/reveal'
import { images, projects } from '@/content/site'

export const metadata = { 
  title: 'Projects | VIKM GROUP Ltd', 
  description: 'Selected construction, architecture, furniture and interior work by VIKM GROUP in Kigali.' 
}

export default function Projects() {
  return (
    <Layout>
      <main className="pt-20">
        <section className="pt-8 pb-16 md:pt-12 md:pb-20">
          <div className="container">
            {/* 2-Column Header */}
            <div className="grid gap-10 md:grid-cols-[1.1fr_.9fr] md:items-center">
              <Reveal direction="left">
                <div>
                  <p className="eyebrow">Portfolio</p>
                  <h1 className="display mt-3">A selection of our work.</h1>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--graphite)]">
                    A growing collection of spaces, details and ideas. Explore the kind of construction, interiors, furniture and digital work VIKM GROUP delivers across Rwanda.
                  </p>
                </div>
              </Reveal>

              <Reveal direction="right" delay={150}>
                <div className="aspect-[1.5] overflow-hidden bg-[#ddd6cc]">
                  <img 
                    src={images.interior} 
                    alt="Selected project spaces and craftsmanship by VIKM GROUP" 
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]" 
                  />
                </div>
              </Reveal>
            </div>

            {/* Featured Hero Banner */}
            <Reveal direction="up" delay={200}>
              <div className="relative mt-16 min-h-[22rem] overflow-hidden bg-[#2b2925] md:min-h-[28rem]">
                <img 
                  src={images.architecture} 
                  alt="Contemporary architectural space by VIKM GROUP" 
                  className="absolute inset-0 h-full w-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
                <div className="relative flex min-h-[22rem] max-w-xl flex-col justify-end p-7 text-white md:min-h-[28rem] md:p-12">
                  <p className="text-xs font-semibold uppercase tracking-[.2em] text-white/90">Built with intention</p>
                  <h2 className="mt-4 max-w-lg text-3xl leading-tight md:text-5xl text-white">From first idea to the finished space.</h2>
                  <p className="mt-5 max-w-md text-sm leading-6 text-white/90">
                    Our portfolio is growing. Until project photography is complete, this collection shows the materials, spaces and disciplines that shape our work.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Interactive Filterable Projects Grid */}
            <Reveal direction="up" delay={100}>
              <ProjectsGrid projects={projects} />
            </Reveal>
          </div>
        </section>
      </main>
    </Layout>
  )
}
