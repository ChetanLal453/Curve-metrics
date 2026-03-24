'use client'

import Link from 'next/link'

const cards = [
  { href: '/content/services', icon: '⚙️', bg: 'var(--pud)', title: 'Services', desc: 'Add and manage your services. These appear in the Services Grid section on your pages.', count: '6 services' },
  { href: '/content/team', icon: '👥', bg: 'var(--grd)', title: 'Team', desc: 'Manage team member profiles — name, role, photo, bio and LinkedIn.', count: '8 members' },
  { href: '/content/blog', icon: '📝', bg: 'var(--amd)', title: 'Blog', desc: 'Write and publish blog posts. Rich text editor with SEO meta fields, categories and tags.', count: '12 posts · 3 draft' },
  { href: '/content/faqs', icon: '❓', bg: 'var(--cyd)', title: 'FAQs', desc: 'Add frequently asked questions. These render in the Accordion component on pages.', count: '15 FAQs' },
  { href: '/content/pricing', icon: '💰', bg: 'var(--pkd)', title: 'Pricing', desc: 'Manage pricing plans. Basic, Pro, Enterprise — with features lists and CTA buttons.', count: '3 plans' },
  { href: '/content/gallery', icon: '🖼️', bg: 'var(--pud)', title: 'Gallery', desc: 'Photo gallery images organized by category. Drag to reorder.', count: '24 images' },
  { href: '/content/partners', icon: '🤝', bg: 'var(--grd)', title: 'Partners', desc: 'Client and partner logos for the "Trusted by" section.', count: '12 logos' },
  { href: '/content/awards', icon: '🏆', bg: 'var(--amd)', title: 'Awards', desc: 'Certifications and awards to build credibility on your about page.', count: '5 awards' },
  { href: '/content/timeline', icon: '📅', bg: 'var(--cyd)', title: 'Timeline', desc: 'Company history milestones. "2020: Founded, 2022: 100 clients" etc.', count: '8 milestones' },
  { href: '/content/stats', icon: '📊', bg: 'var(--pkd)', title: 'Stats', desc: 'Key numbers — "450+ Clients, 98% Satisfaction". Update without code.', count: '4 stats' },
  { href: '/content/projects', icon: '🗂️', bg: 'var(--rdd)', title: 'Projects', desc: 'Portfolio items to showcase. Client name, image, category, link.', count: '9 projects' },
]

const ContentPage = () => (
  <div className="content-wrap">
    <div className="pg-hd">
      <div>
        <h2>Content Manager</h2>
        <p>Manage all your site content — services, team, blog, FAQs and more</p>
      </div>
    </div>

    <div className="content-grid">
      {cards.map((card) => (
        <Link key={card.title} href={card.href} className="c-card">
          <div className="c-icon" style={{ background: card.bg }}>
            {card.icon}
          </div>
          <div className="c-title">{card.title}</div>
          <div className="c-desc">{card.desc}</div>
          <span className="c-count">{card.count}</span>
        </Link>
      ))}
      <div className="c-card c-card-dashed">
        <div className="c-plus">+</div>
        <div className="c-coming">Custom type coming soon</div>
      </div>
    </div>
  </div>
)

export default ContentPage
