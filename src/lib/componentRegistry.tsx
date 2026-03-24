import React from 'react'
import { ComponentDefinition } from '@/types/page-editor'
import RichText from '@/components/PageEditor/components/RichText'
import AdvancedHeading from '../components/PageEditor/components/AdvancedHeading'
import { advancedHeadingDefaultProps, advancedHeadingSchema } from '../components/PageEditor/components/AdvancedHeading'
import AdvancedParagraph from '../components/PageEditor/components/AdvancedParagraph'
import SwiperContainer, { swiperContainerDefaultProps, swiperContainerSchema } from '../components/PageEditor/components/SwiperContainer'
import { advancedParagraphDefaultProps, advancedParagraphSchema } from '../components/PageEditor/components/AdvancedParagraph'
import AdvancedImageComponent, { advancedImageDefaultProps, advancedImageSchema } from '../components/PageEditor/components/AdvancedImageComponent'
import AdvancedCardComponent, { advancedCardDefaultProps, advancedCardSchema } from '@/components/PageEditor/components/AdvancedCardComponent'
import AdvancedAccordion, { advancedAccordionDefaultProps, advancedAccordionSchema } from '@/components/PageEditor/components/AdvancedAccordion'
import { Carousel, carouselDefaultProps, carouselSchema } from '@/components/PageEditor/components/Carousel'
import AdvancedList, { advancedListDefaultProps, advancedListSchema } from '@/components/PageEditor/components/AdvancedList'
import NewGridComponent, { newGridDefaultProps, newGridSchema } from '../components/PageEditor/components/NewGrid'
import AdvancedButton, { advancedButtonDefaultProps, advancedButtonSchema } from '../components/PageEditor/components/AdvancedButton'
import { getDisplayValue } from '@/utils/displayValue'

// Card component constants
const cardDefaultProps = {
  title: 'Card Title',
  description: 'Card description goes here',
  image: '',
  buttonText: 'Learn More',
  buttonLink: '#',
  backgroundColor: '#ffffff',
  borderRadius: 8,
  shadow: 'md',
}

const cardSchema = {
  properties: {
    title: {
      type: 'text' as const,
      label: 'Title',
      default: 'Card Title',
    },
    description: {
      type: 'textarea' as const,
      label: 'Description',
      default: 'Card description goes here',
    },
    image: {
      type: 'image' as const,
      label: 'Image',
      default: '',
    },
    buttonText: {
      type: 'text' as const,
      label: 'Button Text',
      default: 'Learn More',
    },
    buttonLink: {
      type: 'text' as const,
      label: 'Button Link',
      default: '#',
    },
    backgroundColor: {
      type: 'color' as const,
      label: 'Background Color',
      default: '#ffffff',
    },
    borderRadius: {
      type: 'number' as const,
      label: 'Border Radius',
      default: 8,
      min: 0,
      max: 50,
    },
    shadow: {
      type: 'select' as const,
      label: 'Shadow',
      default: 'md',
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
}

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
    return this.getAllComponents().filter(
      (component) =>
        component.name.toLowerCase().includes(lowerQuery) ||
        component.description.toLowerCase().includes(lowerQuery) ||
        component.category.toLowerCase().includes(lowerQuery),
    )
  }

  // Get component render function
  getComponentRenderer(id: string): ((props: any) => React.ReactElement) | undefined {
    const component = this.getComponent(id)
    if (component) {
      return component.render
    }
    return undefined
  }
}

// Create global registry instance
export const componentRegistry = new ComponentRegistry()

// ============================================================================
// COMPONENT REGISTRATION FUNCTIONS
// ============================================================================

function registerSpacerComponent(): void {
  componentRegistry.register({
    id: 'spacer',
    name: 'Spacer',
    type: 'spacer',
    category: 'layout',
    icon: '⤸',
    description: 'Create consistent vertical spacing between content sections with responsive controls',
    defaultProps: {
      height: '32px',
      mobileHeight: '24px',
      tabletHeight: '28px',
      desktopHeight: '32px',
      visibility: true,
      backgroundColor: '#ffffff', // Changed from 'transparent' to fix color input
      showInEditor: true,
      className: '',
    },
    schema: {
      properties: {
        // Main Spacing
        height: {
          type: 'text',
          label: 'Height',
          default: '32px',
          description: 'Default height for desktop screens (px, rem, vh)',
          category: 'Spacing',
          placeholder: '32px',
        },

        // Responsive Spacing
        mobileHeight: {
          type: 'text',
          label: 'Mobile Height',
          default: '24px',
          description: 'Height on mobile devices (< 768px)',
          category: 'Responsive',
          placeholder: '24px',
        },
        tabletHeight: {
          type: 'text',
          label: 'Tablet Height',
          default: '28px',
          description: 'Height on tablet devices (768px - 1024px)',
          category: 'Responsive',
          placeholder: '28px',
        },
        desktopHeight: {
          type: 'text',
          label: 'Desktop Height',
          default: '32px',
          description: 'Height on desktop screens (> 1024px)',
          category: 'Responsive',
          placeholder: '32px',
        },

        // Appearance
        backgroundColor: {
          type: 'color',
          label: 'Background Color',
          default: '#ffffff', // Fixed: Use hex color instead of 'transparent'
          description: 'Background color for visual reference in editor',
          category: 'Appearance',
        },
        showInEditor: {
          type: 'toggle',
          label: 'Show in Editor',
          default: true,
          description: 'Display visual representation in page editor',
          category: 'Appearance',
        },

        // Behavior
        visibility: {
          type: 'toggle',
          label: 'Visible on Page',
          default: true,
          description: 'Show or hide the spacer on published page',
          category: 'Behavior',
        },

        // Advanced
        className: {
          type: 'text',
          label: 'CSS Class',
          default: '',
          description: 'Additional CSS classes for custom styling',
          category: 'Advanced',
        },
      },
    },
    render: (props) => {
      // Don't render if hidden
      if (props.visibility === false) {
        return React.createElement('div', {
          style: { display: 'none' },
          'data-component-type': 'spacer',
        })
      }

      const spacerStyle: React.CSSProperties = {
        width: '100%',
        height: props.height || '32px',
        backgroundColor: props.backgroundColor === '#ffffff' ? 'transparent' : props.backgroundColor,
        minHeight: '1px',
        transition: 'all 0.2s ease-in-out',
      }

      return React.createElement('div', {
        style: spacerStyle,
        className: `spacer-component ${props.className || ''}`.trim(),
        'data-component-type': 'spacer',
        'data-spacer-height': props.height || '32px',
      })
    },
  })
}

function registerContainerComponent(): void {
  componentRegistry.register({
    id: 'container',
    name: 'Container',
    type: 'container',
    category: 'layout',
    icon: '📦',
    description: 'Container with max width and centering',
    defaultProps: {
      maxWidth: '1200px',
      padding: '20px',
      margin: '0 auto',
      backgroundColor: 'transparent',
    },
    schema: {
      properties: {
        maxWidth: {
          type: 'text',
          label: 'Max Width',
          default: '1200px',
        },
        padding: {
          type: 'text',
          label: 'Padding',
          default: '20px',
        },
        margin: {
          type: 'text',
          label: 'Margin',
          default: '0 auto',
        },
        backgroundColor: {
          type: 'color',
          label: 'Background Color',
          default: 'transparent',
        },
      },
    },
    render: (props) =>
      React.createElement(
        'div',
        {
          style: {
            maxWidth: props.maxWidth || '1200px',
            margin: props.margin || '0 auto',
            padding: props.padding || '20px',
            backgroundColor: props.backgroundColor || 'transparent',
          },
        },
        'Container content goes here',
      ),
  })
}

function registerFlexBoxComponent(): void {
  componentRegistry.register({
    id: 'flexbox',
    name: 'Flex Container',
    type: 'flexbox',
    category: 'layout',
    icon: '⎸ ☰ ⎹',
    description: 'Create flexible, responsive layouts with advanced alignment controls',
    defaultProps: {
      direction: 'row',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch',
      gap: '16px',
      rowGap: '16px',
      columnGap: '16px',
      wrap: 'nowrap',
      padding: '16px',
      minHeight: 'auto',
      backgroundColor: '#ffffff', // CHANGED: Use hex color instead of 'transparent'
      children: [],
    },
    schema: {
      properties: {
        // Layout Category
        direction: {
          type: 'select',
          label: 'Flex Direction',
          default: 'row',
          options: [
            { value: 'row', label: 'Row →' },
            { value: 'row-reverse', label: 'Row Reverse ←' },
            { value: 'column', label: 'Column ↓' },
            { value: 'column-reverse', label: 'Column Reverse ↑' },
          ],
          category: 'Layout',
          description: 'Main axis direction for flex items',
        },
        wrap: {
          type: 'select',
          label: 'Flex Wrap',
          default: 'nowrap',
          options: [
            { value: 'nowrap', label: 'No Wrap' },
            { value: 'wrap', label: 'Wrap' },
            { value: 'wrap-reverse', label: 'Wrap Reverse' },
          ],
          category: 'Layout',
          description: 'Control how items wrap in the container',
        },

        // Alignment Category
        justifyContent: {
          type: 'select',
          label: 'Justify Content',
          default: 'flex-start',
          options: [
            { value: 'flex-start', label: 'Start' },
            { value: 'flex-end', label: 'End' },
            { value: 'center', label: 'Center' },
            { value: 'space-between', label: 'Space Between' },
            { value: 'space-around', label: 'Space Around' },
            { value: 'space-evenly', label: 'Space Evenly' },
          ],
          category: 'Alignment',
          description: 'Alignment along the main axis',
        },
        alignItems: {
          type: 'select',
          label: 'Align Items',
          default: 'stretch',
          options: [
            { value: 'stretch', label: 'Stretch' },
            { value: 'flex-start', label: 'Start' },
            { value: 'flex-end', label: 'End' },
            { value: 'center', label: 'Center' },
            { value: 'baseline', label: 'Baseline' },
          ],
          category: 'Alignment',
          description: 'Alignment along the cross axis',
        },
        alignContent: {
          type: 'select',
          label: 'Align Content',
          default: 'stretch',
          options: [
            { value: 'stretch', label: 'Stretch' },
            { value: 'flex-start', label: 'Start' },
            { value: 'flex-end', label: 'End' },
            { value: 'center', label: 'Center' },
            { value: 'space-between', label: 'Space Between' },
            { value: 'space-around', label: 'Space Around' },
          ],
          category: 'Alignment',
          description: 'Alignment of lines in multi-line flex containers',
        },

        // Spacing Category
        gap: {
          type: 'text',
          label: 'Gap',
          default: '16px',
          description: 'Space between all items (overrides row/column gap)',
          category: 'Spacing',
          placeholder: '16px',
        },
        rowGap: {
          type: 'text',
          label: 'Row Gap',
          default: '16px',
          description: 'Vertical space between rows',
          category: 'Spacing',
          placeholder: '16px',
        },
        columnGap: {
          type: 'text',
          label: 'Column Gap',
          default: '16px',
          description: 'Horizontal space between columns',
          category: 'Spacing',
          placeholder: '16px',
        },

        // Container Category
        padding: {
          type: 'text',
          label: 'Padding',
          default: '16px',
          description: 'Inner spacing of the container',
          category: 'Container',
          placeholder: '16px',
        },
        minHeight: {
          type: 'text',
          label: 'Minimum Height',
          default: 'auto',
          description: 'Minimum container height (px, rem, vh)',
          category: 'Container',
          placeholder: '200px',
        },
        backgroundColor: {
          type: 'color',
          label: 'Background Color',
          default: '#ffffff', // CHANGED: Use hex color
          description: 'Container background color',
          category: 'Container',
        },
      },
    },
    render: (props: any) => {
      const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: props.direction || 'row',
        justifyContent: props.justifyContent || 'flex-start',
        alignItems: props.alignItems || 'stretch',
        alignContent: props.alignContent || 'stretch',
        flexWrap: props.wrap || 'nowrap',
        gap: props.gap || '16px',
        rowGap: props.rowGap || '16px',
        columnGap: props.columnGap || '16px',
        padding: props.padding || '16px',
        minHeight: props.minHeight || 'auto',
        // CHANGED: Convert #ffffff to transparent for actual rendering
        backgroundColor: props.backgroundColor === '#ffffff' ? 'transparent' : props.backgroundColor,
        transition: 'all 0.2s ease-in-out',
      }

      return React.createElement(
        'div',
        {
          style: containerStyle,
          className: 'flexbox-container',
          'data-component-type': 'flexbox',
          'data-flex-direction': props.direction || 'row',
        },
        // Placeholder content
        React.createElement(
          'div',
          {
            style: {
              width: '100%',
              minHeight: '80px',
              background: 'repeating-linear-gradient(45deg, #f8fafc, #f8fafc 10px, #f1f5f9 10px, #f1f5f9 20px)',
              border: '2px dashed #cbd5e1',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              fontSize: '14px',
              fontWeight: '500',
            },
          },
          'Drop components here',
        ),
      )
    },
  })
}

function registerAdvancedHeadingComponent(): void {
  componentRegistry.register({
    id: 'advancedheading',
    name: 'Advanced Heading',
    type: 'advancedheading',
    category: 'content',
    icon: '📝',
    description: 'Fully customizable heading with rich text, SEO, and accessibility',

    // ✅ USE IMPORTED VALUES
    defaultProps: advancedHeadingDefaultProps,
    schema: advancedHeadingSchema,

    render: (props) => React.createElement(AdvancedHeading, props),
  })
}

function registerAdvancedParagraphComponent(): void {
  componentRegistry.register({
    id: 'advancedparagraph',
    name: 'Advanced Paragraph',
    type: 'advancedparagraph',
    category: 'content',
    icon: '📄',
    description: 'Fully customizable paragraph component with rich text editing and advanced styling',

    // ✅ USE IMPORTED VALUES
    defaultProps: advancedParagraphDefaultProps,
    schema: advancedParagraphSchema,

    render: (props) => React.createElement(AdvancedParagraph, props),
  })
}

function registerRichTextComponent(): void {
  componentRegistry.register({
    id: 'richtext',
    name: 'Rich Text',
    type: 'richtext',
    category: 'content',
    icon: '✏️',
    description: 'Rich text editor with formatting options',
    defaultProps: {
      content: '<p>Start writing your rich text content here...</p>',
    },
    schema: {
      properties: {
        content: {
          type: 'textarea',
          label: 'Content',
          default: '<p>Start writing your rich text content here...</p>',
        },
      },
    },
    render: (props) =>
      React.createElement(RichText, {
        ...props,
        onUpdate: (updatedProps: any) => {
          console.log('Rich text component updated:', updatedProps)
        },
      }),
  })
}

function registerQuoteComponent(): void {
  componentRegistry.register({
    id: 'quote',
    name: 'Quote',
    type: 'quote',
    category: 'content',
    icon: '💬',
    description: 'Display quotes or testimonials',
    defaultProps: {
      text: '"This is a quote or testimonial text."',
      author: 'Author Name',
      align: 'center',
    },
    schema: {
      properties: {
        text: {
          type: 'textarea',
          label: 'Quote Text',
          default: '"This is a quote or testimonial text."',
        },
        author: {
          type: 'text',
          label: 'Author',
          default: 'Author Name',
        },
        align: {
          type: 'select',
          label: 'Alignment',
          default: 'center',
          options: ['left', 'center', 'right'],
        },
      },
    },
    render: (props) =>
      React.createElement(
        'blockquote',
        {
          style: {
            textAlign: props.align || 'center',
            fontStyle: 'italic',
            borderLeft: '4px solid #ccc',
            paddingLeft: '20px',
            margin: '20px 0',
          },
        },
        [
          React.createElement(
            'p',
            {
              key: 'text',
              style: { margin: '0 0 10px 0', fontSize: '18px' },
            },
            props.text || '"This is a quote"',
          ),
          props.author &&
            React.createElement(
              'cite',
              {
                key: 'author',
                style: { fontStyle: 'normal', fontWeight: 'bold' },
              },
              `— ${props.author}`,
            ),
        ].filter(Boolean),
      ),
  })
}

function registerAdvancedButtonComponent(): void {
  componentRegistry.register({
    id: 'advancedbutton',
    name: 'Advanced Button',
    type: 'advancedbutton',
    category: 'interactive',
    icon: '🎯',
    description: 'Enterprise-grade button with full customization, icons, states, and animations',

    // ✅ SINGLE SOURCE FROM COMPONENT FILE
    defaultProps: advancedButtonDefaultProps,
    schema: advancedButtonSchema,

    render: (props) => React.createElement(AdvancedButton, props),
  })
}

function registerVideoComponent(): void {
  componentRegistry.register({
    id: 'video',
    name: 'Video',
    type: 'video',
    category: 'media',
    icon: '🎥',
    description: 'Embed videos from YouTube, Vimeo, or upload',
    defaultProps: {
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      width: '100%',
      height: '315px',
    },
    schema: {
      properties: {
        src: {
          type: 'text',
          label: 'Video URL',
          default: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        },
        width: {
          type: 'text',
          label: 'Width',
          default: '100%',
        },
        height: {
          type: 'text',
          label: 'Height',
          default: '315px',
        },
      },
    },
    render: (props) => {
      return React.createElement(
        'div',
        {
          style: { position: 'relative', paddingBottom: '56.25%', height: 0 },
        },
        React.createElement('iframe', {
          src: props.src || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: props.width || '100%',
            height: props.height || '315px',
            border: 0,
          },
          allowFullScreen: true,
        }),
      )
    },
  })
}

function registerAdvancedListComponent(): void {
  componentRegistry.register({
    id: 'advancedlist',
    name: 'Advanced List',
    type: 'advancedlist',
    category: 'content',
    icon: '📋',
    description: 'Professional list component with icons, numbers, bullets, and custom styling',

    // ✅ SINGLE SOURCE FROM COMPONENT FILE
    defaultProps: advancedListDefaultProps,
    schema: advancedListSchema,

    render: (props) => React.createElement(AdvancedList, props),
  })
}

function registerIconComponent(): void {
  componentRegistry.register({
    id: 'icon',
    name: 'Icon',
    type: 'icon',
    category: 'media',
    icon: '⭐',
    description: 'Display icons with styling options',
    defaultProps: {
      name: 'star',
      size: '24px',
      color: '#000000',
    },
    schema: {
      properties: {
        name: {
          type: 'text',
          label: 'Icon Name',
          default: 'star',
        },
        size: {
          type: 'text',
          label: 'Size',
          default: '24px',
        },
        color: {
          type: 'color',
          label: 'Color',
          default: '#000000',
        },
      },
    },
    render: (props) =>
      React.createElement(
        'div',
        {
          style: {
            fontSize: props.size || '24px',
            color: props.color || '#000000',
            display: 'inline-block',
          },
        },
        props.name || '⭐',
      ),
  })
}

function registerSwiperContainerComponent(): void {
  componentRegistry.register({
    id: 'swipercontainer',
    name: 'Swiper Container',
    type: 'swipercontainer',
    category: 'layout',
    icon: '🔄',
    description: 'Interactive swiper/carousel with all advanced features',
    
    // ✅ UPDATED DEFAULT PROPS
    defaultProps: swiperContainerDefaultProps, // Ye updated default props hain jo maine diye
    schema: swiperContainerSchema, // Ye updated schema hai
    
    render: (props) => React.createElement(SwiperContainer, props),
  })
}

function registerDividerComponent(): void {
  componentRegistry.register({
    id: 'divider',
    name: 'Divider',
    type: 'divider',
    category: 'layout',
    icon: '➖',
    description: 'Horizontal divider line with styling options',
    defaultProps: {
      thickness: '1px',
      color: '#cccccc',
      width: '100%',
      margin: '20px 0',
    },
    schema: {
      properties: {
        thickness: {
          type: 'text',
          label: 'Thickness',
          default: '1px',
        },
        color: {
          type: 'color',
          label: 'Color',
          default: '#cccccc',
        },
        width: {
          type: 'text',
          label: 'Width',
          default: '100%',
        },
        margin: {
          type: 'text',
          label: 'Margin',
          default: '20px 0',
        },
      },
    },
    render: (props) =>
      React.createElement('hr', {
        style: {
          border: 'none',
          borderTop: `${props.thickness || '1px'} solid ${props.color || '#cccccc'}`,
          width: props.width || '100%',
          margin: props.margin || '20px 0',
        },
      }),
  })
}
function registerAdvancedAccordionComponent(): void {
  componentRegistry.register({
    id: 'advancedaccordion',
    name: 'Advanced Accordion',
    type: 'advancedaccordion',
    category: 'interactive',
    icon: '📑',
    description: 'Professional collapsible content sections with smooth animations',

    // ✅ SINGLE SOURCE FROM COMPONENT FILE
    defaultProps: advancedAccordionDefaultProps,
    schema: advancedAccordionSchema,

    render: (props) => React.createElement(AdvancedAccordion, props),
  })
}

function registerTabsComponent(): void {
  componentRegistry.register({
    id: 'tabs',
    name: 'Tabs',
    type: 'tabs',
    category: 'interactive',
    icon: '📂',
    description: 'Tabbed content interface',
    defaultProps: {
      tabs: [
        { title: 'Tab 1', content: 'Content for tab 1' },
        { title: 'Tab 2', content: 'Content for tab 2' },
      ],
    },
    schema: {
      properties: {
        tabs: {
          type: 'list-items',
          label: 'Tabs',
          default: [],
        },
      },
    },
    render: (props) => {
      const tabs = Array.isArray(props.tabs)
        ? props.tabs
        : [
            { title: 'Tab 1', content: 'Content for tab 1' },
            { title: 'Tab 2', content: 'Content for tab 2' },
          ]

      return React.createElement('div', {}, [
        React.createElement(
          'div',
          {
            style: { display: 'flex', borderBottom: '1px solid #ccc' },
          },
          tabs.map((tab: any, index: number) =>
            React.createElement(
              'button',
              {
                key: index,
                style: {
                  padding: '10px 20px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  borderBottom: '2px solid transparent',
                },
              },
              tab.title || `Tab ${index + 1}`,
            ),
          ),
        ),
        React.createElement(
          'div',
          {
            style: { padding: '20px' },
          },
          tabs[0]?.content || 'Content',
        ),
      ])
    },
  })
}

function registerAdvancedCardComponent(): void {
  componentRegistry.register({
    id: 'advancedCard',
    name: 'Advanced Card',
    type: 'advancedCard',
    category: 'content',
    icon: '💳',
    description: 'Ultimate card component with flip feature, animations, and full customization',

    // ✅ YEH IMPORTANT: UPDATED DEFAULT PROPS AUR SCHEMA USE KARO
    defaultProps: advancedCardDefaultProps, // Flip props include hain
    schema: advancedCardSchema, // Flip schema include hai

    render: (props) => React.createElement(AdvancedCardComponent, props),
  })
}

function registerAdvancedImageComponent(): void {
  componentRegistry.register({
    id: 'advancedImage',
    name: 'Advanced Image',
    type: 'advancedImage',
    category: 'media',
    icon: '🖼️',
    description: 'Advanced image component with local upload and editing',

    // ✅ SINGLE SOURCE FROM COMPONENT FILE
    defaultProps: advancedImageDefaultProps,
    schema: advancedImageSchema as any,

    render: (props) => React.createElement(AdvancedImageComponent, props),
  })
}

function registerCarouselComponent(): void {
  componentRegistry.register({
    id: 'carousel',
    name: 'Carousel',
    type: 'carousel',
    category: 'layout',
    icon: '🔄',
    description: 'Single source carousel component with slides',
    supportsChildren: true,

    // ✅ SINGLE SOURCE FROM COMPONENT FILE
    defaultProps: carouselDefaultProps,
    schema: carouselSchema,

    render: (props) => React.createElement(Carousel, props),
  })
}

function registerNewGridComponent(): void {
  componentRegistry.register({
    id: 'NewGrid',
    name: 'Grid',
    type: 'NewGrid',
    category: 'layout',
    icon: '🔳',
    description: 'A clean rebuild of the grid component with drag-and-drop support',

    // ✅ SINGLE SOURCE FROM COMPONENT FILE
    defaultProps: newGridDefaultProps,
    schema: newGridSchema,

    render: (props) => React.createElement(NewGridComponent, props),
  })
}

// ============================================================================
// INITIALIZATION
// ============================================================================

export function initializeComponentRegistry(): void {
  // Register all components
  registerSpacerComponent()
  registerContainerComponent()
  registerFlexBoxComponent()
  registerAdvancedHeadingComponent()
  registerAdvancedParagraphComponent()
  registerRichTextComponent()
  registerQuoteComponent()
  registerAdvancedButtonComponent()
  registerVideoComponent()
  registerIconComponent()
  registerDividerComponent()
  registerAdvancedAccordionComponent()
  registerTabsComponent()
  registerSwiperContainerComponent()
  registerAdvancedListComponent()
  registerAdvancedCardComponent()
  registerAdvancedImageComponent()
  registerCarouselComponent()
  registerNewGridComponent()

  console.log('✅ Component Registry Initialized with', componentRegistry.getAllComponents().length, 'components')
}

// Initialize the registry
initializeComponentRegistry()
