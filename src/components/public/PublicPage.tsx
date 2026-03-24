import Link from 'next/link'
import { PageRenderer } from '@/components/PageRenderer'

function NavigationList({ items = [] }) {
  if (!items.length) {
    return null
  }

  return (
    <ul className="m-0 flex list-none flex-wrap gap-4 p-0">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <Link href={item.href || '/'} target={item.open_new_tab ? '_blank' : undefined} rel={item.open_new_tab ? 'noreferrer noopener' : undefined} className="text-sm font-medium text-slate-700 no-underline">
            {item.label || 'Link'}
          </Link>
          {item.children?.length ? (
            <div className="mt-2 border-l border-slate-200 pl-4">
              <NavigationList items={item.children} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

function PublicHeader({ header }) {
  if (!header) {
    return null
  }

  return (
    <header className="border-b border-slate-200 bg-white/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4">
        <div className="flex items-center gap-3">
          {header.logo ? <img src={header.logo} alt={header.name || 'Site logo'} className="h-10 w-auto" /> : null}
          <div className="text-base font-semibold text-slate-900">{header.name || 'Header'}</div>
        </div>
        <div className="hidden flex-1 justify-center md:flex">
          <NavigationList items={header.navigation_items} />
        </div>
        {header.cta_label ? (
          <Link href={header.cta_link || '/'} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white no-underline">
            {header.cta_label}
          </Link>
        ) : null}
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-4 md:hidden">
        <NavigationList items={header.navigation_items} />
      </div>
    </header>
  )
}

function PublicBanner({ banner }) {
  if (!banner) {
    return null
  }

  const content = banner.content || {}

  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{banner.name}</div>
        {content.title ? <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">{content.title}</h1> : null}
        {content.subtitle ? <p className="mt-3 text-lg text-slate-600">{content.subtitle}</p> : null}
        {content.description ? <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{content.description}</p> : null}
        {(content.buttonText || content.button_text) && (content.buttonLink || content.button_link) ? (
          <Link href={content.buttonLink || content.button_link} className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white no-underline">
            {content.buttonText || content.button_text}
          </Link>
        ) : null}
      </div>
    </section>
  )
}

function PublicFooter({ footer }) {
  if (!footer) {
    return null
  }

  const columns = Array.isArray(footer.columns) ? footer.columns : []
  const socialLinks = Array.isArray(footer.social_links) ? footer.social_links : []

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <div className="text-lg font-semibold text-slate-900">{footer.name || 'Footer'}</div>
          {footer.settings?.logo_url ? <img src={footer.settings.logo_url} alt={footer.name || 'Footer logo'} className="mt-4 h-10 w-auto" /> : null}
        </div>
        {columns.map((column, index) => (
          <div key={column.id || `footer-column-${index + 1}`}>
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">{column.heading || `Column ${index + 1}`}</div>
            <div className="mt-3 flex flex-col gap-2">
              {(column.links || []).map((link, linkIndex) => (
                <Link key={link.id || `footer-link-${index + 1}-${linkIndex + 1}`} href={link.href || '/'} className="text-sm text-slate-700 no-underline">
                  {link.label || 'Link'}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      {socialLinks.length ? (
        <div className="mx-auto flex max-w-7xl flex-wrap gap-4 px-4 pb-4">
          {socialLinks.map((link, index) => (
            <Link key={link.id || `social-${index + 1}`} href={link.url || '#'} className="text-sm text-slate-600 no-underline">
              {link.platform || 'Social'}
            </Link>
          ))}
        </div>
      ) : null}
      <div className="mx-auto max-w-7xl px-4 pb-8 text-sm text-slate-500">
        {footer.settings?.copyright_text || footer.copyright || ''}
      </div>
    </footer>
  )
}

export function PublicPage({ bundle }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicHeader header={bundle.header} />
      <PublicBanner banner={bundle.banner} />
      <PageRenderer layout={bundle.layout} />
      <PublicFooter footer={bundle.footer} />
    </div>
  )
}
