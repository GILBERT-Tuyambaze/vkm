export const site = {
  name: 'VIKM GROUP Ltd',
  tagline: 'We build, design and furnish complete spaces.',
  description: 'VIKM GROUP Ltd is a multidisciplinary construction, architecture, furniture, interior design and home-solutions company based in Kigali, Rwanda.',
  phone: '0794399892 / 0783156702',
  whatsapp: '250794399892',
  email: 'sandrinetech97@gmail.com',
  location: 'Kimironko, Gasabo District, Kigali, Rwanda',
  showSocials: false,
  showPrices: false,
  nav: [
    { label: 'Services', href: '/services' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
} as const

export const images = {
  hero: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=85',
  interior: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
  architecture: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
  furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80',
  kitchen: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80',
  project: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80',
} as const

export const services = [
  { slug: 'construction', label: 'Construction', description: 'From structure to finishing, we coordinate the details that make a space last.', image: images.architecture },
  { slug: 'architecture', label: 'Architecture', description: 'Clear plans and considered visualisations that turn ideas into buildable direction.', image: images.hero },
  { slug: 'furniture', label: 'Furniture', description: 'Made-to-measure kitchens, wardrobes and furniture for the way you live.', image: images.furniture },
  { slug: 'interior-design', label: 'Interior Design', description: 'Complete, cohesive interiors for homes, offices and businesses.', image: images.interior },
  { slug: 'branding-packaging', label: 'Branding & Packaging', description: 'Practical brand systems, print and packaging for growing businesses.', image: images.project },
  { slug: 'digital', label: 'Digital', description: 'Websites, applications and systems that support modern businesses.', image: images.kitchen },
] as const

export const serviceHighlights: Record<string, string[]> = {
  construction: ['Residential houses, apartments and commercial buildings', 'Renovation, extensions and interior or exterior finishing', 'Coordination of specialists from planning through delivery'],
  architecture: ['2D floor plans and structural or architectural planning', '3D architectural design and interior visualisation', 'Modern house, commercial and institutional concepts'],
  furniture: ['Kitchens, cabinets, wardrobes and storage units', 'Sofas, beds, tables, desks, reception and office furniture', 'Made-to-measure production and installation'],
  'interior-design': ['Interior and exterior design for homes and businesses', 'Complete finishing, furniture coordination and space planning', 'Practical, attractive environments shaped around your budget'],
  'branding-packaging': ['Logo, business card, flyer, poster, label and sticker design', 'Branded bags, food packaging and custom packaging artwork', 'Print-ready preparation and production coordination'],
  digital: ['Business systems, websites and web applications', 'Mobile applications and digital document solutions', 'Digital seals, signatures and customised software solutions'],
} as const

export const process = ['Consultation', 'Assessment & Planning', 'Design / Proposal', 'Quotation & Approval', 'Execution / Production', 'Quality Check', 'Delivery & Installation', 'Follow-up'] as const

export const capabilities = ['2D plans', '3D visualisation', 'Kitchens & wardrobes', 'Renovation', 'Office fit-out', 'Packaging & branding'] as const

export const projects = [
  { slug: 'complete-interior', title: 'Complete interior', category: 'Interior', location: 'Kigali', image: images.interior, isPlaceholder: true },
  { slug: 'made-to-measure', title: 'Made-to-measure furniture', category: 'Furniture', location: 'Kigali', image: images.furniture, isPlaceholder: true },
  { slug: 'architectural-direction', title: 'Architectural direction', category: 'Architecture', location: 'Rwanda', image: images.architecture, isPlaceholder: true },
  { slug: 'kitchen-fit-out', title: 'Kitchen fit-out', category: 'Furniture', location: 'Kigali', image: images.kitchen, isPlaceholder: true },
  { slug: 'renovation-study', title: 'Renovation study', category: 'Construction', location: 'Kigali', image: images.project, isPlaceholder: true },
  { slug: 'commercial-space', title: 'Commercial space concept', category: 'Interior', location: 'Rwanda', image: images.hero, isPlaceholder: true },
] as const

export type Service = (typeof services)[number]
export type Project = (typeof projects)[number]
