import { ComponentDefinition } from '@/types/page-editor'
import DynamicSlider from '@/components/PageEditor/components/DynamicSlider'
import DynamicCard from '@/components/PageEditor/components/DynamicCard'

// Component Registry - Central registry for all available components
class ComponentRegistry {
  private components: Map<string, ComponentDefinition> = new Map()
  private categories: Map<string, ComponentDefinition[]> = new Map()

  // Register a component
  register(component: ComponentDefinition): void {
    this.components.set(component.id, component)

    // Add to category
    if (!this.categories.has(component.category)) {
      this.categories.set(component.category, [])
    }
    this.categories.get(component.category)!.push(component)
  }

  // Get component by ID
  getComponent(id: string): ComponentDefinition | undefined {
    return this.components.get(id)
  }

  // Get all components
  getAllComponents(): ComponentDefinition[] {
    return Array.from(this.components.values())
  }

  // Get components by category
  getComponentsByCategory(category: string): ComponentDefinition[] {
    return this.categories.get(category) || []
  }

  // Get all categories
  getCategories(): string[] {
    return Array.from(this.categories.keys())
  }

  // Search components
  searchComponents(query: string): ComponentDefinition[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllComponents().filter(component =>
      component.name.toLowerCase().includes(lowerQuery) ||
      component.description.toLowerCase().includes(lowerQuery) ||
      component.category.toLowerCase().includes(lowerQuery)
    )
  }

  // Get component render function
  getComponentRenderer(id: string) {
    const component = this.getComponent(id)
    return component?.render
  }
}

// Create global registry instance
export const componentRegistry = new ComponentRegistry()

// Initialize with default components
export function initializeComponentRegistry(): void {
  // Content Components
  registerHeadingComponent()
  registerParagraphComponent()
  registerRichTextComponent()
  registerQuoteComponent()
  registerListComponent()

  // Media Components
  registerImageComponent()
  registerImageGalleryComponent()
  registerVideoComponent()
  registerIconComponent()
  registerDividerComponent()

  // Interactive Components
  registerButtonComponent()
  registerFormComponent()
  registerAccordionComponent()
  registerTabsComponent()
  registerModalTriggerComponent()

  // Layout Components
  registerSpacerComponent()
  registerContainerComponent()
  registerGridComponent()
  registerFlexBoxComponent()
  registerCardComponent()

  // Advanced Components
  registerSliderComponent()
  registerTestimonialComponent()
  registerPricingTableComponent()
  registerCounterComponent()
  registerTimelineComponent()
  registerMapComponent()
  registerSocialMediaComponent()
}

// Component Registration Functions
function registerHeadingComponent(): void {
  componentRegistry.register({
    id: 'heading',
    name: 'Heading',
    type: 'heading',
    category: 'content',
    icon: 'FaHeading',
    description: 'Display headings with different levels',
    defaultProps: {
      text: 'Heading Text',
      level: 'h2',
      align: 'left',
      color: '#000000',
    },
    schema: {
      properties: {
        text: {
          type: 'text',
          label: 'Heading Text',
          default: 'Heading Text'
        },
        level: {
          type: 'select',
          label: 'Heading Level',
          default: 'h2',
          options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        },
        align: {
          type: 'select',
          label: 'Text Alignment',
          default: 'left',
          options: ['left', 'center', 'right']
        },
        color: {
          type: 'color',
          label: 'Text Color',
          default: '#000000'
        }
      }
    },
    render: (props) => {
      const Tag = props.level || 'h2'
      return (
        <Tag
          style={{
            textAlign: props.align || 'left',
            color: props.color || '#000000',
            margin: 0
          }}
        >
          {props.text || 'Heading Text'}
        </Tag>
      )
    }
  })
}

function registerParagraphComponent(): void {
  componentRegistry.register({
    id: 'paragraph',
    name: 'Paragraph',
    type: 'paragraph',
    category: 'content',
    icon: 'FaParagraph',
    description: 'Display text paragraphs',
    defaultProps: {
      text: 'This is a paragraph of text. You can edit this content to display your message.',
      align: 'left',
      color: '#333333',
      fontSize: '16px',
    },
    schema: {
      properties: {
        text: {
          type: 'textarea',
          label: 'Paragraph Text',
          default: 'This is a paragraph of text. You can edit this content to display your message.'
        },
        align: {
          type: 'select',
          label: 'Text Alignment',
          default: 'left',
          options: ['left', 'center', 'right', 'justify']
        },
        color: {
          type: 'color',
          label: 'Text Color',
          default: '#333333'
        },
        fontSize: {
          type: 'text',
          label: 'Font Size',
          default: '16px'
        }
      }
    },
    render: (props) => (
      <p
        style={{
          textAlign: props.align || 'left',
          color: props.color || '#333333',
          fontSize: props.fontSize || '16px',
          margin: 0,
          lineHeight: 1.6
        }}
      >
        {props.text || 'This is a paragraph of text.'}
      </p>
    )
  })
}

function registerRichTextComponent(): void {
  componentRegistry.register({
    id: 'rich-text',
    name: 'Rich Text',
    type: 'rich-text',
    category: 'content',
    icon: 'FaEdit',
    description: 'Rich text editor with formatting options',
    defaultProps: {
      content: '<p>Start writing your rich text content here...</p>',
    },
    schema: {
      properties: {
        content: {
          type: 'richtext',
          label: 'Content',
          default: '<p>Start writing your rich text content here...</p>'
        }
      }
    },
    render: (props) => (
      <div
        dangerouslySetInnerHTML={{ __html: props.content || '<p>Rich text content</p>' }}
        style={{ minHeight: '50px' }}
      />
    )
  })
}

function registerQuoteComponent(): void {
  componentRegistry.register({
    id: 'quote',
    name: 'Quote',
    type: 'quote',
    category: 'content',
    icon: 'FaQuoteLeft',
    description: 'Display quotes or testimonials',
    defaultProps: {
      text: '"This is a quote or testimonial text."',
      author: 'Author Name',
      align: 'center',
      style: 'default',
    },
    schema: {
      properties: {
        text: {
          type: 'textarea',
          label: 'Quote Text',
          default: '"This is a quote or testimonial text."'
        },
        author: {
          type: 'text',
          label: 'Author',
          default: 'Author Name'
        },
        align: {
          type: 'select',
          label: 'Alignment',
          default: 'center',
          options: ['left', 'center', 'right']
        },
        style: {
          type: 'select',
          label: 'Quote Style',
          default: 'default',
          options: ['default', 'large', 'minimal']
        }
      }
    },
    render: (props) => (
      <blockquote
        style={{
          textAlign: props.align || 'center',
          fontStyle: 'italic',
          borderLeft: props.style === 'default' ? '4px solid #ccc' : 'none',
          paddingLeft: props.style === 'default' ? '20px' : '0',
          fontSize: props.style === 'large' ? '24px' : '18px',
          margin: '20px 0'
        }}
      >
        <p style={{ margin: '0 0 10px 0', fontSize: 'inherit' }}>
          {props.text || '"This is a quote"'}
        </p>
        {props.author && (
          <cite style={{ fontStyle: 'normal', fontWeight: 'bold' }}>
            — {props.author}
          </cite>
        )}
      </blockquote>
    )
  })
}

function registerListComponent(): void {
  componentRegistry.register({
    id: 'list',
    name: 'List',
    type: 'list',
    category: 'content',
    icon: 'FaList',
    description: 'Ordered or unordered lists',
    defaultProps: {
      type: 'unordered',
      items: ['List item 1', 'List item 2', 'List item 3'],
    },
    schema: {
      properties: {
        type: {
          type: 'select',
          label: 'List Type',
          default: 'unordered',
          options: ['unordered', 'ordered']
        },
        items: {
          type: 'text',
          label: 'List Items (one per line)',
          default: 'List item 1\nList item 2\nList item 3'
        }
      }
    },
    render: (props) => {
      const items = (Array.isArray(props.items)
        ? props.items as string[]
        : (props.items || 'List item 1\nList item 2\nList item 3').split('\n').filter((item: string) => item.trim())) as string[]

      if (props.type === 'ordered') {
        return (
          <ol style={{ paddingLeft: '20px', margin: '10px 0' }}>
            {items.map((item: string, index: number) => (
              <li key={index} style={{ marginBottom: '5px' }}>{item}</li>
            ))}
          </ol>
        )
      }

      return (
        <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
          {items.map((item: string, index: number) => (
            <li key={index} style={{ marginBottom: '5px' }}>{item}</li>
          ))}
        </ul>
      )
    }
  })
}

function registerImageComponent(): void {
  componentRegistry.register({
    id: 'image',
    name: 'Image',
    type: 'image',
    category: 'media',
    icon: 'FaImage',
    description: 'Display images with captions',
    defaultProps: {
      src: 'https://via.placeholder.com/400x300?text=Image',
      alt: 'Image description',
      caption: '',
      width: '100%',
      height: 'auto',
    },
    schema: {
      properties: {
        src: {
          type: 'image',
          label: 'Image URL',
          default: 'https://via.placeholder.com/400x300?text=Image'
        },
        alt: {
          type: 'text',
          label: 'Alt Text',
          default: 'Image description'
        },
        caption: {
          type: 'text',
          label: 'Caption',
          default: ''
        },
        width: {
          type: 'text',
          label: 'Width',
          default: '100%'
        },
        height: {
          type: 'text',
          label: 'Height',
          default: 'auto'
        }
      }
    },
    render: (props) => (
      <figure style={{ margin: '20px 0', textAlign: 'center' }}>
        <img
          src={props.src || 'https://via.placeholder.com/400x300?text=Image'}
          alt={props.alt || 'Image'}
          style={{
            width: props.width || '100%',
            height: props.height || 'auto',
            maxWidth: '100%',
            display: 'block',
            margin: '0 auto'
          }}
        />
        {props.caption && (
          <figcaption style={{
            marginTop: '10px',
            fontSize: '14px',
            color: '#666',
            fontStyle: 'italic'
          }}>
            {props.caption}
          </figcaption>
        )}
      </figure>
    )
  })
}

function registerButtonComponent(): void {
  componentRegistry.register({
    id: 'button',
    name: 'Button',
    type: 'button',
    category: 'interactive',
    icon: 'FaMousePointer',
    description: 'Clickable buttons with different styles',
    defaultProps: {
      text: 'Click Me',
      variant: 'primary',
      size: 'medium',
      link: '#',
      openInNewTab: false,
    },
    schema: {
      properties: {
        text: {
          type: 'text',
          label: 'Button Text',
          default: 'Click Me'
        },
        variant: {
          type: 'select',
          label: 'Style',
          default: 'primary',
          options: ['primary', 'secondary', 'outline', 'ghost']
        },
        size: {
          type: 'select',
          label: 'Size',
          default: 'medium',
          options: ['small', 'medium', 'large']
        },
        link: {
          type: 'text',
          label: 'Link URL',
          default: '#'
        },
        openInNewTab: {
          type: 'toggle',
          label: 'Open in New Tab',
          default: false
        }
      }
    },
    render: (props) => {
      const getButtonStyles = () => {
        const baseStyles = {
          display: 'inline-block',
          padding: props.size === 'small' ? '8px 16px' : props.size === 'large' ? '16px 32px' : '12px 24px',
          borderRadius: '4px',
          textDecoration: 'none',
          fontWeight: '500',
          cursor: 'pointer',
          border: 'none',
          transition: 'all 0.2s ease',
          textAlign: 'center' as const,
        }

        switch (props.variant) {
          case 'secondary':
            return {
              ...baseStyles,
              backgroundColor: '#6b7280',
              color: 'white',
            }
          case 'outline':
            return {
              ...baseStyles,
              backgroundColor: 'transparent',
              color: '#3b82f6',
              border: '2px solid #3b82f6',
            }
          case 'ghost':
            return {
              ...baseStyles,
              backgroundColor: 'transparent',
              color: '#3b82f6',
            }
          default: // primary
            return {
              ...baseStyles,
              backgroundColor: '#3b82f6',
              color: 'white',
            }
        }
      }

      return (
        <a
          href={props.link || '#'}
          target={props.openInNewTab ? '_blank' : '_self'}
          rel={props.openInNewTab ? 'noopener noreferrer' : undefined}
          style={getButtonStyles()}
        >
          {props.text || 'Click Me'}
        </a>
      )
    }
  })
}

// Placeholder implementations for remaining components
function registerImageGalleryComponent(): void {
  componentRegistry.register({
    id: 'image-gallery',
    name: 'Image Gallery',
    type: 'image-gallery',
    category: 'media',
    icon: 'FaImages',
    description: 'Display multiple images in a gallery',
    defaultProps: { images: [] },
    schema: { properties: {} },
    render: () => <div>Image Gallery Component</div>
  })
}

function registerVideoComponent(): void {
  componentRegistry.register({
    id: 'video',
    name: 'Video',
    type: 'video',
    category: 'media',
    icon: 'FaVideo',
    description: 'Embed videos from YouTube, Vimeo, or upload',
    defaultProps: { src: '' },
    schema: { properties: {} },
    render: () => <div>Video Component</div>
  })
}

function registerIconComponent(): void {
  componentRegistry.register({
    id: 'icon',
    name: 'Icon',
    type: 'icon',
    category: 'media',
    icon: 'FaStar',
    description: 'Display icons from icon libraries',
    defaultProps: { name: 'star' },
    schema: { properties: {} },
    render: () => <div>Icon Component</div>
  })
}

function registerDividerComponent(): void {
  componentRegistry.register({
    id: 'divider',
    name: 'Divider',
    type: 'divider',
    category: 'media',
    icon: 'FaMinus',
    description: 'Visual separator line',
    defaultProps: { style: 'solid' },
    schema: { properties: {} },
    render: () => <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ccc' }} />
  })
}

function registerFormComponent(): void {
  componentRegistry.register({
    id: 'form',
    name: 'Form',
    type: 'form',
    category: 'interactive',
    icon: 'FaWpforms',
    description: 'Contact forms and data collection',
    defaultProps: { fields: [] },
    schema: { properties: {} },
    render: () => <div>Form Component</div>
  })
}

function registerAccordionComponent(): void {
  componentRegistry.register({
    id: 'accordion',
    name: 'Accordion',
    type: 'accordion',
    category: 'interactive',
    icon: 'FaChevronDown',
    description: 'Collapsible content sections',
    defaultProps: { items: [] },
    schema: { properties: {} },
    render: () => <div>Accordion Component</div>
  })
}

function registerTabsComponent(): void {
  componentRegistry.register({
    id: 'tabs',
    name: 'Tabs',
    type: 'tabs',
    category: 'interactive',
    icon: 'FaFolder',
    description: 'Tabbed content interface',
    defaultProps: { tabs: [] },
    schema: { properties: {} },
    render: () => <div>Tabs Component</div>
  })
}

function registerModalTriggerComponent(): void {
  componentRegistry.register({
    id: 'modal-trigger',
    name: 'Modal Trigger',
    type: 'modal-trigger',
    category: 'interactive',
    icon: 'FaWindowMaximize',
    description: 'Button that opens modal dialogs',
    defaultProps: { text: 'Open Modal' },
    schema: { properties: {} },
    render: () => <div>Modal Trigger Component</div>
  })
}

function registerSpacerComponent(): void {
  componentRegistry.register({
    id: 'spacer',
    name: 'Spacer',
    type: 'spacer',
    category: 'layout',
    icon: 'FaArrowsAltV',
    description: 'Add vertical spacing between elements',
    defaultProps: { height: '20px' },
    schema: { properties: {} },
    render: (props) => <div style={{ height: props.height || '20px' }} />
  })
}

function registerContainerComponent(): void {
  componentRegistry.register({
    id: 'container',
    name: 'Container',
    type: 'container',
    category: 'layout',
    icon: 'FaSquare',
    description: 'Group elements in a container',
    defaultProps: { maxWidth: '1200px' },
    schema: { properties: {} },
    render: (props) => (
      <div style={{
        maxWidth: props.maxWidth || '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        Container Content
      </div>
    )
  })
}

function registerGridComponent(): void {
  componentRegistry.register({
    id: 'grid',
    name: 'Grid',
    type: 'grid',
    category: 'layout',
    icon: 'FaTh',
    description: 'CSS Grid layout system',
    defaultProps: { columns: 3 },
    schema: { properties: {} },
    render: () => <div>Grid Component</div>
  })
}

function registerFlexBoxComponent(): void {
  componentRegistry.register({
    id: 'flex-box',
    name: 'Flex Box',
    type: 'flex-box',
    category: 'layout',
    icon: 'FaAlignJustify',
    description: 'Flexible box layout',
    defaultProps: { direction: 'row' },
    schema: { properties: {} },
    render: () => <div>Flex Box Component</div>
  })
}

function registerCardComponent(): void {
  componentRegistry.register({
    id: 'card',
    name: 'Dynamic Card',
    type: 'card',
    category: 'layout',
    icon: 'FaIdCard',
    description: 'Advanced content cards with multiple layouts, animations, and styling options',
    defaultProps: {
      layout: 'imageTop',
      title: 'Card Title',
      subtitle: '',
      content: 'Card content goes here. This can be customized with different layouts and styles.',
      image: '',
      icon: '',
      avatar: '',
      quote: '',
      author: '',
      position: '',
      price: '$99',
      buttonText: 'Learn More',
      link: { url: '#', text: 'Learn More', openInNewTab: false },
      width: '100%',
      maxWidth: '400px',
      minHeight: 'auto',
      padding: '20px',
      margin: '0',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      backgroundColor: '#ffffff',
      backgroundImage: '',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      transition: 'all 0.3s ease',
      hoverEffect: 'none',
      glowColor: '#3b82f6',
      hoverBorderColor: '#3b82f6',
      glassmorphism: false,
      gradient: false,
      gradientDirection: '45deg',
      gradientStart: '#667eea',
      gradientEnd: '#764ba2',
      scrollAnimation: false,
      customClass: '',
      customId: ''
    },
    schema: {
      properties: {
        layout: {
          type: 'select',
          label: 'Card Layout',
          default: 'imageTop',
          options: [
            { value: 'imageTop', label: 'Image Top' },
            { value: 'imageLeft', label: 'Image Left' },
            { value: 'imageRight', label: 'Image Right' },
            { value: 'overlay', label: 'Image Overlay' },
            { value: 'iconCard', label: 'Icon Card' },
            { value: 'testimonial', label: 'Testimonial' },
            { value: 'product', label: 'Product Card' },
            { value: 'feature', label: 'Feature Card' }
          ]
        },
        // Content fields
        title: {
          type: 'text',
          label: 'Title',
          default: 'Card Title'
        },
        subtitle: {
          type: 'text',
          label: 'Subtitle',
          default: ''
        },
        content: {
          type: 'textarea',
          label: 'Content',
          default: 'Card content goes here. This can be customized with different layouts and styles.'
        },
        image: {
          type: 'image',
          label: 'Image URL',
          default: ''
        },
        icon: {
          type: 'text',
          label: 'Icon (emoji or class)',
          default: ''
        },
        // Testimonial fields
        avatar: {
          type: 'image',
          label: 'Avatar Image',
          default: ''
        },
        quote: {
          type: 'textarea',
          label: 'Quote/Testimonial',
          default: ''
        },
        author: {
          type: 'text',
          label: 'Author Name',
          default: ''
        },
        position: {
          type: 'text',
          label: 'Author Position',
          default: ''
        },
        // Product fields
        price: {
          type: 'text',
          label: 'Price',
          default: '$99'
        },
        buttonText: {
          type: 'text',
          label: 'Button Text',
          default: 'Learn More'
        },
        // Link configuration (nested object)
        linkUrl: {
          type: 'text',
          label: 'Link URL',
          default: '#'
        },
        linkText: {
          type: 'text',
          label: 'Link Text',
          default: 'Learn More'
        },
        linkOpenInNewTab: {
          type: 'toggle',
          label: 'Open Link in New Tab',
          default: false
        },
        // Layout & Sizing
        width: {
          type: 'text',
          label: 'Width',
          default: '100%'
        },
        maxWidth: {
          type: 'text',
          label: 'Max Width',
          default: '400px'
        },
        minHeight: {
          type: 'text',
          label: 'Min Height',
          default: 'auto'
        },
        padding: {
          type: 'text',
          label: 'Padding',
          default: '20px'
        },
        margin: {
          type: 'text',
          label: 'Margin',
          default: '0'
        },
        // Styling
        borderRadius: {
          type: 'text',
          label: 'Border Radius',
          default: '8px'
        },
        border: {
          type: 'text',
          label: 'Border',
          default: '1px solid #e5e7eb'
        },
        boxShadow: {
          type: 'text',
          label: 'Box Shadow',
          default: '0 1px 3px rgba(0,0,0,0.1)'
        },
        backgroundColor: {
          type: 'color',
          label: 'Background Color',
          default: '#ffffff'
        },
        backgroundImage: {
          type: 'image',
          label: 'Background Image',
          default: ''
        },
        backgroundSize: {
          type: 'select',
          label: 'Background Size',
          default: 'cover',
          options: ['cover', 'contain', 'auto']
        },
        backgroundPosition: {
          type: 'text',
          label: 'Background Position',
          default: 'center'
        },
        transition: {
          type: 'text',
          label: 'Transition',
          default: 'all 0.3s ease'
        },
        // Hover Effects
        hoverEffect: {
          type: 'select',
          label: 'Hover Effect',
          default: 'none',
          options: [
            { value: 'none', label: 'None' },
            { value: 'lift', label: 'Lift' },
            { value: 'glow', label: 'Glow' },
            { value: 'scale', label: 'Scale' },
            { value: 'border', label: 'Border Highlight' }
          ]
        },
        glowColor: {
          type: 'color',
          label: 'Glow Color',
          default: '#3b82f6'
        },
        hoverBorderColor: {
          type: 'color',
          label: 'Hover Border Color',
          default: '#3b82f6'
        },
        // Advanced Effects
        glassmorphism: {
          type: 'toggle',
          label: 'Glassmorphism Effect',
          default: false
        },
        gradient: {
          type: 'toggle',
          label: 'Gradient Background',
          default: false
        },
        gradientDirection: {
          type: 'text',
          label: 'Gradient Direction',
          default: '45deg'
        },
        gradientStart: {
          type: 'color',
          label: 'Gradient Start Color',
          default: '#667eea'
        },
        gradientEnd: {
          type: 'color',
          label: 'Gradient End Color',
          default: '#764ba2'
        },
        // Animations
        scrollAnimation: {
          type: 'toggle',
          label: 'Scroll Animation',
          default: false
        },
        // Custom Classes & IDs
        customClass: {
          type: 'text',
          label: 'Custom CSS Class',
          default: ''
        },
        customId: {
          type: 'text',
          label: 'Custom ID',
          default: ''
        }
      }
    },
    render: (props: any) => <DynamicCard component={{ id: 'card', type: 'card', label: 'Dynamic Card', props }} onUpdate={() => {}} />
  })
}

function registerSliderComponent(): void {
  componentRegistry.register({
    id: 'slider',
    name: 'Dynamic Slider',
    type: 'dynamic-slider',
    category: 'advanced',
    icon: 'FaImages',
    description: 'Advanced image and content slider with customizable slides',
    defaultProps: {
      slides: [
        {
          id: 'slide-1',
          title: 'Welcome to Our Platform',
          subtitle: 'Transform Your Workflow',
          description: 'Discover amazing features and capabilities that will transform your workflow.',
          content: 'Discover amazing features and capabilities that will transform your workflow.',
          mediaType: 'image',
          image: 'https://via.placeholder.com/800x400/3b82f6/ffffff?text=Slide+1',
          video: '',
          caption: 'First slide caption',
          link: { url: '#', text: 'Learn More', openInNewTab: false },
          ctaButtons: [
            { label: 'Learn More', link: '#', openInNewTab: false },
            { label: 'Get Started', link: '#', openInNewTab: true }
          ],
          visibility: true,
          backgroundColor: '#3b82f6',
          textColor: '#ffffff',
          layout: 'half-image-half-text'
        },
        {
          id: 'slide-2',
          title: 'Second Slide',
          subtitle: 'More Details Await',
          description: 'Second slide content with more details.',
          content: 'Second slide content with more details.',
          mediaType: 'image',
          image: 'https://via.placeholder.com/800x400/10b981/ffffff?text=Slide+2',
          video: '',
          caption: 'Second slide caption',
          link: { url: '#', text: 'Get Started', openInNewTab: false },
          ctaButtons: [
            { label: 'Contact Us', link: '#', openInNewTab: false }
          ],
          visibility: true,
          backgroundColor: '#10b981',
          textColor: '#ffffff',
          layout: 'full-width'
        }
      ],
      autoplay: false,
      slideDuration: 3000,
      showArrows: true,
      showDots: true,
      width: 800,
      height: 400,
      backgroundColor: 'transparent',
      backgroundImage: '',
      border: 'none'
    },
    schema: {
      properties: {
        slides: {
          type: 'slide-array',
          label: 'Slides',
          default: []
        },
        autoplay: {
          type: 'toggle',
          label: 'Autoplay',
          default: false
        },
        slideDuration: {
          type: 'number',
          label: 'Slide Duration (ms)',
          default: 3000,
          min: 1000,
          max: 10000
        },
        showArrows: {
          type: 'toggle',
          label: 'Show Navigation Arrows',
          default: true
        },
        showDots: {
          type: 'toggle',
          label: 'Show Dots',
          default: true
        },
        width: {
          type: 'number',
          label: 'Width',
          default: 800
        },
        height: {
          type: 'number',
          label: 'Height',
          default: 400
        },
        backgroundColor: {
          type: 'color',
          label: 'Background Color',
          default: 'transparent'
        },
        backgroundImage: {
          type: 'image',
          label: 'Background Image',
          default: ''
        },
        border: {
          type: 'text',
          label: 'Border',
          default: 'none'
        }
      }
    },
    render: (props: any) => <DynamicSlider component={{ id: 'slider', type: 'dynamic-slider', label: 'Dynamic Slider', props }} onUpdate={() => {}} />
  })
}

function registerTestimonialComponent(): void {
  componentRegistry.register({
    id: 'testimonial',
    name: 'Testimonial',
    type: 'testimonial',
    category: 'advanced',
    icon: 'FaQuoteRight',
    description: 'Customer testimonials and reviews',
    defaultProps: { testimonials: [] },
    schema: { properties: {} },
    render: () => <div>Testimonial Component</div>
  })
}

function registerPricingTableComponent(): void {
  componentRegistry.register({
    id: 'pricing-table',
    name: 'Pricing Table',
    type: 'pricing-table',
    category: 'advanced',
    icon: 'FaDollarSign',
    description: 'Pricing plans and comparisons',
    defaultProps: { plans: [] },
    schema: { properties: {} },
    render: () => <div>Pricing Table Component</div>
  })
}

function registerCounterComponent(): void {
  componentRegistry.register({
    id: 'counter',
    name: 'Counter/Stats',
    type: 'counter',
    category: 'advanced',
    icon: 'FaCalculator',
    description: 'Animated counters and statistics',
    defaultProps: { value: 0 },
    schema: { properties: {} },
    render: () => <div>Counter Component</div>
  })
}

function registerTimelineComponent(): void {
  componentRegistry.register({
    id: 'timeline',
    name: 'Timeline',
    type: 'timeline',
    category: 'advanced',
    icon: 'FaHistory',
    description: 'Timeline of events or processes',
    defaultProps: { events: [] },
    schema: { properties: {} },
    render: () => <div>Timeline Component</div>
  })
}

function registerMapComponent(): void {
  componentRegistry.register({
    id: 'map',
    name: 'Map',
    type: 'map',
    category: 'advanced',
    icon: 'FaMapMarkerAlt',
    description: 'Interactive maps and location display',
    defaultProps: { lat: 0, lng: 0 },
    schema: { properties: {} },
    render: () => <div>Map Component</div>
  })
}

function registerSocialMediaComponent(): void {
  componentRegistry.register({
    id: 'social-media',
    name: 'Social Media Feed',
    type: 'social-media',
    category: 'advanced',
    icon: 'FaShareAlt',
    description: 'Social media feeds and sharing buttons',
    defaultProps: { platform: 'twitter' },
    schema: { properties: {} },
    render: () => <div>Social Media Component</div>
  })
}

