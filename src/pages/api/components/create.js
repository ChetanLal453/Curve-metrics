import { componentRegistry } from '@/lib/componentRegistry'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { component } = req.body

    if (!component || !component.id || !component.name) {
      return res.status(400).json({ error: 'Invalid component data' })
    }

    // Check if component already exists
    if (componentRegistry.getComponent(component.id)) {
      return res.status(409).json({ error: 'Component already exists' })
    }

    // Register the component
    componentRegistry.register(component)

    res.status(201).json({
      message: 'Component created successfully',
      component
    })
  } catch (error) {
    console.error('Error creating component:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
