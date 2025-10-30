import { componentRegistry } from '@/lib/componentRegistry'

export default function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ error: 'Component ID is required' })
    }

    // Check if component exists
    const component = componentRegistry.getComponent(id)
    if (!component) {
      return res.status(404).json({ error: 'Component not found' })
    }

    // For now, we'll just return success since the registry doesn't support deletion
    // In a real implementation, you'd need to modify the registry to support deletion
    res.status(200).json({
      message: 'Component deletion not implemented',
      component
    })
  } catch (error) {
    console.error('Error deleting component:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
