'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Project } from '@/content/site'

const filters = ['All', 'Construction', 'Architecture', 'Furniture', 'Interior', 'Digital']

export function ProjectsGrid({ projects }: { projects: readonly Project[] }) {
  const [filter, setFilter] = useState('All')
  const visible = useMemo(() => filter === 'All' ? projects : projects.filter(project => project.category === filter), [filter, projects])
  return <>
    <div className="mt-12 flex gap-2 overflow-x-auto border-b border-[var(--line)] pb-4" aria-label="Project categories">
      {filters.map(item => <button key={item} type="button" onClick={() => setFilter(item)} className={`whitespace-nowrap px-3 py-2 text-xs uppercase tracking-[.12em] transition-colors ${filter === item ? 'bg-[var(--ink)] text-white' : 'text-[var(--stone)] hover:text-[var(--ink)]'}`}>{item}</button>)}
    </div>
    <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      {visible.map(project => <Link href={`/projects/${project.slug}`} key={project.slug} className="group block">
        <div className="relative aspect-[1.15] overflow-hidden bg-[#ddd6cc]"><img src={project.image} alt={project.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />{project.isPlaceholder && <span className="absolute left-3 top-3 bg-[var(--bone)]/90 px-2 py-1 text-[10px] uppercase tracking-[.12em] text-[var(--stone)]">Placeholder image</span>}</div>
        <div className="mt-4 flex justify-between gap-4"><div><h2 className="text-xl font-medium text-[var(--ink)] transition-colors duration-200 group-hover:text-[var(--timber)]">{project.title}</h2><p className="mt-1 text-sm text-[var(--stone)]">{project.category} · {project.location}</p></div><span className="text-xs uppercase tracking-[.12em] text-[var(--timber-dk)] transition-transform duration-200 group-hover:translate-x-1">View →</span></div>
      </Link>)}
    </div>
  </>
}
