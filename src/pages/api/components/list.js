import { componentRegistry } from '@/lib/componentRegistry'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const components = componentRegistry.getAllComponents()
    const categories = componentRegistry.getCategories()

    res.status(200).json({
      components,
      categories
    })
  } catch (error) {
    console.error('Error fetching components:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
