import { notFound } from 'next/navigation'
import { PageRenderer } from '@/components/PageRenderer'
import { getPageRecord, normalizeLayout } from '@/lib/layout-sync.js'

export default async function PreviewPage({ params }: { params: { slug: string } }) {
  const page = await getPageRecord({ pageId: undefined, slug: params.slug })

  if (!page) {
    notFound()
  }

  const draftLayout = normalizeLayout(page.layout, page)

  return <PageRenderer layout={draftLayout} />
}
