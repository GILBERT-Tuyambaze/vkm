import type { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap { return ['', '/services','/projects','/about','/quote','/contact'].map(path => ({ url: `https://vikmgroup.rw${path}`, lastModified: new Date() })) }
