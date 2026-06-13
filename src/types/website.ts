// ─── Website Builder Types ─────────────────────────────────────────────

export interface WebsiteTemplate {
  id: string
  name: string
  description: string
  industry: string
  category: 'lead-gen' | 'service' | 'ecom' | 'portfolio' | 'coaching' | 'local'
  pages: WebsitePage[]
  colorScheme: { primary: string; secondary: string; accent: string; background: string; text: string }
  fontFamily: string
  previewImage: string // emoji or icon placeholder
}

export interface WebsitePage {
  id: string
  name: string
  slug: string
  sections: WebsiteSection[]
}

export interface WebsiteSection {
  id: string
  type: 'hero' | 'features' | 'testimonials' | 'pricing' | 'faq' | 'cta' | 'contact' | 'gallery' | 'about' | 'services' | 'stats' | 'logos' | 'footer'
  heading?: string
  subheading?: string
  content?: string
  items?: { title: string; description: string; icon?: string; imageUrl?: string }[]
  imageUrl?: string
  bgColor?: string
  textColor?: string
  layout?: 'left' | 'center' | 'grid-2' | 'grid-3' | 'grid-4'
  ctaText?: string
  ctaUrl?: string
  show?: boolean
  order: number
}

export interface Website {
  id: string
  clientId: string // ties to a client, or '' for standalone
  name: string
  domain: string // custom domain or subdomain
  published: boolean
  publishedUrl: string
  templateId: string
  colorScheme: { primary: string; secondary: string; accent: string; background: string; text: string }
  fontFamily: string
  pages: WebsitePage[]
  seoSettings: {
    title: string
    description: string
    keywords: string
    googleAnalyticsId: string
  }
  createdAt: string
  updatedAt: string
  lastPublishedAt?: string
}

// ── Site Templates ─────────────────────────────────────────────────────

export const SITE_TEMPLATES: WebsiteTemplate[] = [
  {
    id: 'local-service',
    name: 'Local Service Pro',
    description: 'Perfect for plumbers, roofers, electricians, auto shops — services, testimonials, instant quote',
    industry: 'Home Services',
    category: 'service',
    fontFamily: 'Inter, sans-serif',
    colorScheme: { primary: '#2563eb', secondary: '#1e40af', accent: '#f59e0b', background: '#ffffff', text: '#1e293b' },
    previewImage: '🔧',
    pages: [
      {
        id: 'home', name: 'Home', slug: '', sections: [
          { id: 'hero', type: 'hero', heading: 'Professional {Service} You Can Trust', subheading: 'Serving {City} for over 15 years. Call us today for a free estimate.', ctaText: 'Get a Free Quote', ctaUrl: '#contact', layout: 'center', show: true, order: 0 },
          { id: 'stats', type: 'stats', heading: 'By the Numbers', items: [{ title: '15+', description: 'Years Experience' }, { title: '5,000+', description: 'Happy Customers' }, { title: '99%', description: 'Satisfaction Rate' }], layout: 'center', show: true, order: 1 },
          { id: 'services', type: 'services', heading: 'Our Services', subheading: 'Everything you need under one roof', items: [{ title: 'Service One', description: 'Full-service expert care' }, { title: 'Service Two', description: 'Fast and reliable' }, { title: 'Service Three', description: 'Premium quality guaranteed' }], layout: 'grid-3', show: true, order: 2 },
          { id: 'testimonials', type: 'testimonials', heading: 'What Our Customers Say', items: [{ title: '⭐ ⭐ ⭐ ⭐ ⭐', description: '"Best service I\'ve ever had. Highly recommend!"', imageUrl: '👤' }, { title: '⭐ ⭐ ⭐ ⭐ ⭐', description: '"Quick, professional, and affordable."', imageUrl: '👤' }], layout: 'center', show: true, order: 3 },
          { id: 'cta', type: 'cta', heading: 'Ready to Get Started?', subheading: 'Call now or book online', ctaText: 'Call (555) 123-4567', ctaUrl: 'tel:5551234567', show: true, order: 4 },
          { id: 'contact', type: 'contact', heading: 'Get In Touch', subheading: 'We\'ll get back to you within 24 hours', show: true, order: 5 },
          { id: 'footer', type: 'footer', content: '{Business Name}. All rights reserved.', show: true, order: 6 },
        ]
      },
    ],
  },
  {
    id: 'coaching-personal',
    name: 'Coach & Guru',
    description: 'Life coaches, business consultants, fitness trainers — build authority, sell programs',
    industry: 'Coaching',
    category: 'coaching',
    fontFamily: 'Merriweather, serif',
    colorScheme: { primary: '#7c3aed', secondary: '#5b21b6', accent: '#f59e0b', background: '#faf5ff', text: '#1e293b' },
    previewImage: '🎯',
    pages: [
      {
        id: 'home', name: 'Home', slug: '', sections: [
          { id: 'hero', type: 'hero', heading: 'Transform Your {Goal} in 90 Days', subheading: 'Proven system. Personal coaching. Real results.', ctaText: 'Book a Free Call', ctaUrl: '#contact', layout: 'center', show: true, order: 0, bgColor: '#7c3aed', textColor: '#ffffff' },
          { id: 'about', type: 'about', heading: 'Meet Your Coach', content: 'With over a decade of experience helping {type} achieve their goals, I\'ve developed a system that works.', layout: 'left', show: true, order: 1 },
          { id: 'features', type: 'features', heading: 'What You\'ll Get', items: [{ title: '1-on-1 Coaching', description: 'Weekly personalized sessions' }, { title: 'Proven Framework', description: 'Step-by-step system' }, { title: 'Community Access', description: 'Private group support' }], layout: 'grid-3', show: true, order: 2 },
          { id: 'testimonials', type: 'testimonials', heading: 'Success Stories', items: [{ title: '⭐ ⭐ ⭐ ⭐ ⭐', description: '"Completely changed my business. Worth every penny!"', imageUrl: '👤' }], layout: 'center', show: true, order: 3 },
          { id: 'cta', type: 'cta', heading: 'Your Transformation Starts Today', subheading: 'Limited spots available. Apply now.', ctaText: 'Book Your Free Discovery Call', ctaUrl: '#contact', show: true, order: 4 },
          { id: 'footer', type: 'footer', content: '© {Business Name}. All rights reserved.', show: true, order: 5 },
        ]
      },
    ],
  },
  {
    id: 'agency-portfolio',
    name: 'Digital Agency',
    description: 'Marketing agencies, freelancers, web designers — showcase work, attract clients',
    industry: 'Marketing',
    category: 'portfolio',
    fontFamily: 'Inter, sans-serif',
    colorScheme: { primary: '#0f172a', secondary: '#334155', accent: '#06b6d4', background: '#ffffff', text: '#0f172a' },
    previewImage: '🚀',
    pages: [
      {
        id: 'home', name: 'Home', slug: '', sections: [
          { id: 'hero', type: 'hero', heading: 'We Build Brands That Matter', subheading: 'Strategy. Design. Growth.', ctaText: 'View Our Work', ctaUrl: '#services', layout: 'left', bgColor: '#0f172a', textColor: '#ffffff', show: true, order: 0 },
          { id: 'logos', type: 'logos', heading: 'Trusted By', items: [{ title: 'Brand A', icon: '🏢' }, { title: 'Brand B', icon: '🏢' }, { title: 'Brand C', icon: '🏢' }], layout: 'center', show: true, order: 1 },
          { id: 'services', type: 'services', heading: 'What We Do', items: [
            { title: 'Web Design', description: 'Custom websites that convert' },
            { title: 'SEO', description: 'Dominate search results' },
            { title: 'Paid Media', description: 'ROI-driven ad campaigns' },
            { title: 'Content', description: 'Strategy that drives engagement' }
          ], layout: 'grid-4', show: true, order: 2 },
          { id: 'gallery', type: 'gallery', heading: 'Recent Work', items: [{ title: 'Project Alpha', description: 'Web redesign', imageUrl: '🖼️' }, { title: 'Project Beta', description: 'SEO campaign', imageUrl: '🖼️' }], layout: 'grid-2', show: true, order: 3 },
          { id: 'cta', type: 'cta', heading: 'Ready to Grow?', subheading: 'Let\'s talk about your next project', ctaText: 'Get a Free Audit', ctaUrl: '#contact', show: true, order: 4 },
          { id: 'footer', type: 'footer', content: '© {Business Name}. All rights reserved.', show: true, order: 5 },
        ]
      },
    ],
  },
  {
    id: 'lead-gen-landing',
    name: 'Lead Gen Machine',
    description: 'High-converting single-page lead capture — perfect for webinars, ebooks, consultations',
    industry: 'Lead Generation',
    category: 'lead-gen',
    fontFamily: 'Inter, sans-serif',
    colorScheme: { primary: '#dc2626', secondary: '#b91c1c', accent: '#f59e0b', background: '#ffffff', text: '#1e293b' },
    previewImage: '📋',
    pages: [
      {
        id: 'home', name: 'Home', slug: '', sections: [
          { id: 'hero', type: 'hero', heading: 'Free Guide: {Topic}', subheading: 'Learn the proven strategy that {benefit}', ctaText: 'Download Now', ctaUrl: '#form', layout: 'center', bgColor: '#1e293b', textColor: '#ffffff', show: true, order: 0 },
          { id: 'features', type: 'features', heading: 'What\'s Inside', items: [{ title: 'Chapter 1', description: 'The fundamentals' }, { title: 'Chapter 2', description: 'Advanced strategies' }, { title: 'Bonus', description: 'Checklist template' }], layout: 'grid-3', show: true, order: 1 },
          { id: 'testimonials', type: 'testimonials', heading: 'What Readers Say', items: [{ title: '⭐ ⭐ ⭐ ⭐ ⭐', description: '"This guide changed everything."', imageUrl: '👤' }], layout: 'center', show: true, order: 2 },
          { id: 'cta', type: 'cta', heading: 'Get Instant Access', subheading: 'Enter your email below', ctaText: 'Send Me the Free Guide', ctaUrl: '#form', show: true, order: 3 },
          { id: 'contact', type: 'contact', heading: 'Get Your Free Copy', subheading: 'No spam, unsubscribe anytime', show: true, order: 4 },
          { id: 'footer', type: 'footer', content: '© {Business Name}', show: true, order: 5 },
        ]
      },
    ],
  },
  {
    id: 'ecom-minimal',
    name: 'Simple Storefront',
    description: 'Small product showcase — service packages, digital products, booking',
    industry: 'E-commerce',
    category: 'ecom',
    fontFamily: 'Inter, sans-serif',
    colorScheme: { primary: '#059669', secondary: '#047857', accent: '#f59e0b', background: '#ffffff', text: '#1e293b' },
    previewImage: '🛍️',
    pages: [
      {
        id: 'home', name: 'Home', slug: '', sections: [
          { id: 'hero', type: 'hero', heading: '{Product} — Built for {Audience}', subheading: 'Starting at $XX. Free shipping.', ctaText: 'Shop Now', ctaUrl: '#pricing', layout: 'center', show: true, order: 0 },
          { id: 'features', type: 'features', heading: 'Why Choose {Product}', items: [{ title: 'Quality', description: 'Premium materials' }, { title: 'Support', description: '24/7 customer care' }, { title: 'Guarantee', description: '100% satisfaction' }], layout: 'grid-3', show: true, order: 1 },
          { id: 'pricing', type: 'pricing', heading: 'Choose Your Plan', items: [
            { title: 'Starter', description: '$29/mo', icon: '🌱' },
            { title: 'Pro', description: '$79/mo', icon: '🔥' },
            { title: 'Enterprise', description: '$199/mo', icon: '🏢' }
          ], layout: 'grid-3', show: true, order: 2 },
          { id: 'cta', type: 'cta', heading: 'Start Your Free Trial', subheading: 'No credit card required', ctaText: 'Get Started', ctaUrl: '#', show: true, order: 3 },
          { id: 'footer', type: 'footer', content: '© {Business Name}', show: true, order: 4 },
        ]
      },
    ],
  },
]

export function buildSampleSites(): Website[] { return [] }