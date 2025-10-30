import { componentRegistry } from '@/lib/componentRegistry'

export default function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { id, component } = req.body

    if (!id || !component) {
      return res.status(400).json({ error: 'Invalid component data' })
    }

    // Check if component exists
    const existingComponent = componentRegistry.getComponent(id)
    if (!existingComponent) {
      return res.status(404).json({ error: 'Component not found' })
    }

    // For now, we'll just return success since the registry doesn't support updates
    // In a real implementation, you'd need to modify the registry to support updates
    res.status(200).json({
      message: 'Component update not implemented',
      component
    })
  } catch (error) {
    console.error('Error updating component:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
