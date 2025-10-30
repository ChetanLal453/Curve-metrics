import React from 'react'
import { ComponentDefinition } from '@/types/page-editor'
import RichTextEditor from '@/components/PageEditor/RichTextEditor'
import RichText from '@/components/PageEditor/components/RichText'
import DynamicCard from '@/components/PageEditor/components/DynamicCard'
import DynamicSlider from '@/components/PageEditor/components/DynamicSlider'
import DynamicSliderNew from '@/components/PageEditor/components/DynamicSliderNew'
import DynamicList from '@/components/PageEditor/components/DynamicList'
import Heading from '@/components/PageEditor/components/Heading'
import Paragraph from '@/components/PageEditor/components/Paragraph'
import ImageComponent, { imageComponentSchema } from '@/components/PageEditor/components/ImageComponent'
import AdvancedCardComponent, { advancedCardDefaultProps, advancedCardSchema } from '@/components/PageEditor/components/AdvancedCard'
import AdvancedSliderComponent, { advancedSliderDefaultProps, advancedSliderSchema } from '@/components/PageEditor/components/AdvancedSlider'
import { getDisplayValue } from '@/utils/displayValue'

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

// Initialize component registry with all components
export function initializeComponentRegistry(): void {
  // Register all components
  registerSliderComponent()
  registerAdvancedHeadingComponent()
  registerAdvancedParagraphComponent()
  registerRichTextComponent()
  registerQuoteComponent()
  registerListComponent()
  registerButtonComponent()
  registerImageGalleryComponent()
  registerVideoComponent()
  registerIconComponent()
  registerDividerComponent()
  registerFormComponent()
  registerAccordionComponent()
  registerTabsComponent()
  registerModalTriggerComponent()
  registerScrollerComponent()
  registerSpacerComponent()
  registerContainerComponent()
  registerGridComponent()
  registerFlexBoxComponent()
  registerCardComponent()
  registerAdvancedCardComponent()
  registerAdvancedSliderComponent()
  registerImageComponent()
}





function registerSliderComponent(): void {
  componentRegistry.register({
    id: 'dynamic-slider',
    name: 'Dynamic Slider',
    type: 'dynamic-slider',
    category: 'advanced',
    icon: 'FaImages',
    description: 'Advanced image and content slider with customizable slides, animations, and navigation',
    defaultProps: {
      slides: [
        {
          id: 'slide-1',
          title: 'Welcome to Our Platform',
          subtitle: 'Transform Your Workflow',
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
          layout: 'half-image-half-text',
          imageAlignment: 'center',
          imageToTextRatio: 50,
          slideWidth: 'auto',
          slideHeight: 400,
          autoHeight: false,
          padding: 10,
          margin: 10,
          borderRadius: 5,
          shadowIntensity: 3,
          customCSS: ''
        },
        {
          id: 'slide-2',
          title: 'Second Slide',
          subtitle: 'More Details Await',
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
          layout: 'full-width',
          imageAlignment: 'center',
          imageToTextRatio: 50,
          slideWidth: 'auto',
          slideHeight: 400,
          autoHeight: false,
          padding: 10,
          margin: 10,
          borderRadius: 5,
          shadowIntensity: 3,
          customCSS: ''
        }
      ],
      // Navigation
      showArrows: true,
      showDots: true,
      arrowColor: '#ffffff',
      dotActiveColor: '#ffffff',

      // Animation
      autoplay: false,
      loop: true,
      transitionEffect: 'fade',
      transitionSpeed: 500,

      // Styling
      sliderHeight: '400px',
      backgroundColor: 'transparent',
      customCSS: '',

      // Legacy compatibility
      slideDuration: 3000,
      width: '100%',
      height: '400px',
      backgroundImage: '',
      border: 'none'
    },
    schema: {
      properties: {
        // Slides Management
        slides: {
          type: 'slide-array',
          label: 'Slides',
          default: []
        },

        // Navigation Controls
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
        arrowColor: {
          type: 'color',
          label: 'Arrow Color',
          default: '#ffffff'
        },
        dotActiveColor: {
          type: 'color',
          label: 'Active Dot Color',
          default: '#ffffff'
        },

        // Animation Settings
        autoplay: {
          type: 'toggle',
          label: 'Autoplay',
          default: false
        },
        loop: {
          type: 'toggle',
          label: 'Loop',
          default: true
        },
        transitionEffect: {
          type: 'select',
          label: 'Transition Effect',
          default: 'fade',
          options: ['fade', 'slide', 'zoom', 'cube', 'flip', 'coverflow', 'cards']
        },
        transitionSpeed: {
          type: 'number',
          label: 'Transition Speed (ms)',
          default: 500,
          min: 100,
          max: 2000,
          step: 50
        },

        // Dimensions & Layout
        sliderHeight: {
          type: 'text',
          label: 'Slider Height',
          default: '400px'
        },
        width: {
          type: 'text',
          label: 'Width',
          default: '100%'
        },
        height: {
          type: 'text',
          label: 'Height',
          default: '400px'
        },

        // Styling
        backgroundColor: {
          type: 'color',
          label: 'Background Color',
          default: 'transparent'
        },
        backgroundImage: {
          type: 'text',
          label: 'Background Image URL',
          default: ''
        },
        border: {
          type: 'text',
          label: 'Border',
          default: 'none'
        },

        // Advanced
        customCSS: {
          type: 'textarea',
          label: 'Custom CSS',
          default: ''
        },

        // Legacy (for backward compatibility)
        slideDuration: {
          type: 'number',
          label: 'Slide Duration (ms)',
          default: 3000,
          min: 1000,
          max: 10000
        }
      }
    },
    render: (props: any) => React.createElement(DynamicSlider, { component: { id: 'dynamic-slider', type: 'dynamic-slider', label: 'Dynamic Slider', props }, onUpdate: () => {} })
  })
}

// Component Registration Functions
function registerAdvancedHeadingComponent(): void {
  componentRegistry.register({
    id: 'advanced-heading',
    name: 'Advanced Heading',
    type: 'advanced-heading',
    category: 'content',
    icon: 'FaHeading',
    description: 'Fully customizable heading component with advanced typography, animations, gradients, and CMS integration',
    defaultProps: {
      // Basic Content
      text: 'Advanced Heading',
      subheading: '',
      level: 'h2',
      tag: 'h2',
      prefixIcon: '',
      suffixIcon: '',
      prefixEmoji: '',
      suffixEmoji: '',

      // Links & Navigation
      linkUrl: '',
      openInNewTab: false,
      linkAriaLabel: '',

      // Visibility & Conditional Logic
      visible: true,
      conditionalVisibility: '',

      // Data Binding
      dataBinding: '',
      dynamicText: '',

      // Typography - Basic
      fontFamily: 'inherit',
      fontSize: '32px',
      fontWeight: 'bold',
      lineHeight: '1.2',
      letterSpacing: '0px',
      textTransform: 'none',
      textAlign: 'left',

      // Typography - Advanced
      fontSizeMobile: '24px',
      fontSizeTablet: '28px',
      fontSizeDesktop: '32px',
      responsiveTypography: true,

      // Colors
      textColor: '#000000',
      textColorDark: '#ffffff',
      textColorLight: '#000000',
      gradientText: false,
      gradientStart: '#667eea',
      gradientEnd: '#764ba2',
      gradientDirection: '45deg',
      gradientType: 'linear',

      // Effects
      textShadow: 'none',
      textStroke: 'none',
      textGlow: false,
      glowColor: '#3b82f6',
      glowIntensity: 10,

      // Background
      backgroundColor: 'transparent',
      backgroundGradient: false,
      backgroundGradientStart: '#f0f0f0',
      backgroundGradientEnd: '#e0e0e0',
      backgroundImage: '',
      backgroundClip: false,

      // Spacing & Layout
      padding: '0px',
      margin: '0px 0px 16px 0px',
      width: 'auto',
      maxWidth: 'none',
      display: 'block',

      // Border & Shadow
      border: 'none',
      borderRadius: '0px',
      boxShadow: 'none',

      // Animations - Entrance
      entranceAnimation: 'none',
      animationDelay: 0,
      animationDuration: 0.6,
      animationEasing: 'easeOut',
      staggerChildren: false,

      // Animations - Hover
      hoverEffect: 'none',
      hoverColor: '#3b82f6',
      hoverScale: 1.05,
      hoverDuration: 0.3,

      // Animations - Scroll Based
      scrollAnimation: 'none',
      scrollTriggerOffset: 50,
      scrollOnce: true,

      // Animations - Typewriter
      typewriterEffect: false,
      typewriterSpeed: 100,
      typewriterDelay: 1000,
      typewriterPhrases: ['Advanced Heading', 'Dynamic Text', 'Animated Content'],
      typewriterLoop: false,
      typewriterCursor: '|',

      // Animations - Advanced
      maskReveal: false,
      gradientReveal: false,
      revealDirection: 'left',
      revealDuration: 0.8,

      // Accessibility
      ariaLabel: '',
      ariaLevel: 2,
      role: 'heading',
      tabIndex: -1,
      screenReaderText: '',

      // Multi-language & Localization
      lang: '',
      dir: 'ltr',

      // Developer Features
      customClass: '',
      customId: '',
      customCSS: '',
      dataAttributes: '{}',

      // Event Handlers
      onClick: '',
      onHover: '',
      onFocus: '',
      onBlur: '',

      // AI & Advanced Features
      aiPlaceholder: false,
      aiPlaceholderText: 'Enter your heading text...',
      wordWrap: true,
      textOverflow: 'clip',
      textSelection: true,

      // Theme Adaptation
      themeAware: false,
      darkMode: false,
      highContrast: false,

      // Performance
      lazyLoad: false,
      priority: false
    },
    schema: {
      properties: {
        // 1. Content & Structure
        level: {
          type: 'select',
          label: 'Heading Level Selector (H1–H6)',
          default: 'h2',
          options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        },
        text: {
          type: 'text',
          label: 'Editable Text (supports dynamic data binding)',
          default: 'Advanced Heading'
        },
        subheading: {
          type: 'textarea',
          label: 'Optional Subheading / Description',
          default: ''
        },

        // 2. Typography & Styling
        fontFamily: {
          type: 'text',
          label: 'Font Family',
          default: 'inherit'
        },
        fontSize: {
          type: 'text',
          label: 'Font Size',
          default: '32px'
        },
        fontWeight: {
          type: 'select',
          label: 'Font Weight',
          default: 'bold',
          options: ['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900']
        },
        textColor: {
          type: 'color',
          label: 'Text Color',
          default: '#000000'
        },
        textAlign: {
          type: 'select',
          label: 'Text Alignment',
          default: 'left',
          options: ['left', 'center', 'right']
        },
        gradientText: {
          type: 'toggle',
          label: 'Gradient Text / Solid Color Toggle',
          default: false
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
        fontSizeMobile: {
          type: 'text',
          label: 'Responsive Font Size (Mobile)',
          default: '24px'
        },
        fontSizeTablet: {
          type: 'text',
          label: 'Responsive Font Size (Tablet)',
          default: '28px'
        },
        fontSizeDesktop: {
          type: 'text',
          label: 'Responsive Font Size (Desktop)',
          default: '32px'
        },

        // 3. Layout & Background
        padding: {
          type: 'text',
          label: 'Padding',
          default: '0px'
        },
        margin: {
          type: 'text',
          label: 'Margin',
          default: '0px 0px 16px 0px'
        },
        backgroundColor: {
          type: 'color',
          label: 'Background (Solid)',
          default: 'transparent'
        },
        backgroundGradient: {
          type: 'toggle',
          label: 'Background Gradient',
          default: false
        },
        backgroundGradientStart: {
          type: 'color',
          label: 'Background Gradient Start',
          default: '#f0f0f0'
        },
        backgroundGradientEnd: {
          type: 'color',
          label: 'Background Gradient End',
          default: '#e0e0e0'
        },
        backgroundImage: {
          type: 'text',
          label: 'Background Image URL',
          default: ''
        },

        // 4. Animation & Effects
        entranceAnimation: {
          type: 'select',
          label: 'Entrance Animation',
          default: 'none',
          options: ['none', 'fade', 'slide', 'zoom']
        },
        hoverEffect: {
          type: 'select',
          label: 'Hover Animation',
          default: 'none',
          options: ['none', 'underline', 'glow', 'scale']
        },

        // 5. Behavior & Visibility
        visible: {
          type: 'toggle',
          label: 'Visibility Toggle',
          default: true
        },
        linkUrl: {
          type: 'text',
          label: 'Clickable Action (Link URL)',
          default: ''
        },
        openInNewTab: {
          type: 'toggle',
          label: 'Open Link in New Tab',
          default: false
        },

        // 6. Accessibility
        ariaLabel: {
          type: 'text',
          label: 'ARIA Label',
          default: ''
        },
        role: {
          type: 'text',
          label: 'Semantic Role',
          default: 'heading'
        }
      }
    },
    render: (props) => React.createElement(Heading, props)
  })
}

function registerAdvancedParagraphComponent(): void {
  componentRegistry.register({
    id: 'advanced-paragraph',
    name: 'AdvancedParagraph',
    type: 'advanced-paragraph',
    category: 'content',
    icon: 'FaParagraph',
    description: 'Fully customizable paragraph component with rich text, animations, lists, and CMS integration',
    defaultProps: {
      // Basic Content
      text: 'This is a comprehensive paragraph component with rich text support, advanced styling, and smooth animations. It can display multiple paragraphs with customizable spacing and formatting options.',
      richText: false,
      formattedText: '',
      paragraphs: [],
      tag: 'p',
      prefixIcon: '',
      suffixIcon: '',
      prefixEmoji: '',
      suffixEmoji: '',

      // Links & Navigation
      linkUrl: '',
      openInNewTab: false,
      linkAriaLabel: '',
      inlineLinks: [],

      // Lists
      isList: false,
      listType: 'unordered',
      listItems: [],
      listStyle: 'disc',
      indentation: 0,

      // Truncation
      truncate: false,
      maxLength: 150,
      showReadMore: true,
      readMoreText: 'Read More',
      readLessText: 'Read Less',

      // Visibility & Conditional Logic
      visible: true,
      conditionalVisibility: '',

      // Data Binding
      dataBinding: '',
      dynamicText: '',

      // Typography - Basic
      fontFamily: 'inherit',
      fontSize: '16px',
      fontWeight: 'normal',
      lineHeight: '1.6',
      letterSpacing: '0px',
      textAlign: 'left',

      // Typography - Advanced
      fontSizeMobile: '14px',
      fontSizeTablet: '15px',
      fontSizeDesktop: '16px',
      responsiveTypography: true,

      // Colors
      textColor: '#333333',
      textColorDark: '#ffffff',
      textColorLight: '#333333',
      gradientText: false,
      gradientStart: '#667eea',
      gradientEnd: '#764ba2',
      gradientDirection: '45deg',
      gradientType: 'linear',

      // Rich Text Styles
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      highlight: false,
      highlightColor: '#ffff00',

      // Effects
      textShadow: 'none',
      textStroke: 'none',
      textGlow: false,
      glowColor: '#3b82f6',
      glowIntensity: 10,

      // Background
      backgroundColor: 'transparent',
      backgroundGradient: false,
      backgroundGradientStart: '#f0f0f0',
      backgroundGradientEnd: '#e0e0e0',
      backgroundImage: '',
      backgroundClip: false,
      backgroundOpacity: 1,

      // Spacing & Layout
      padding: '0px',
      margin: '0px 0px 16px 0px',
      width: 'auto',
      maxWidth: 'none',
      display: 'block',

      // Border & Shadow
      border: 'none',
      borderRadius: '0px',
      boxShadow: 'none',

      // Animations - Entrance
      entranceAnimation: 'none',
      animationDelay: 0,
      animationDuration: 0.6,
      animationEasing: 'easeOut',
      staggerChildren: false,

      // Animations - Hover
      hoverEffect: 'none',
      hoverColor: '#3b82f6',
      hoverScale: 1.05,
      hoverDuration: 0.3,

      // Animations - Scroll Based
      scrollAnimation: 'none',
      scrollTriggerOffset: 50,
      scrollOnce: true,

      // Animations - Typewriter
      typewriterEffect: false,
      typewriterSpeed: 100,
      typewriterDelay: 1000,
      typewriterPhrases: ['Advanced Paragraph', 'Dynamic Text', 'Animated Content'],
      typewriterLoop: false,
      typewriterCursor: '|',

      // Animations - Reveal
      revealEffect: 'none',
      revealDirection: 'left',
      revealDuration: 0.8,

      // Accessibility
      ariaLabel: '',
      ariaLevel: 1,
      role: 'paragraph',
      tabIndex: -1,
      screenReaderText: '',

      // Multi-language & Localization
      lang: '',
      dir: 'ltr',

      // Developer Features
      customClass: '',
      customId: '',
      customCSS: '',
      dataAttributes: '{}',

      // Event Handlers
      onClick: '',
      onHover: '',
      onFocus: '',
      onBlur: '',

      // AI & Advanced Features
      aiPlaceholder: false,
      aiPlaceholderText: 'Enter your paragraph text...',
      wordWrap: true,
      textOverflow: 'clip',
      textSelection: true,

      // Theme Adaptation
      themeAware: false,
      darkMode: false,
      highContrast: false,

      // Performance
      lazyLoad: false,
      priority: false,

      // Spacing between paragraphs
      paragraphSpacing: '16px'
    },
    schema: {
      properties: {
        // Basic Content
        text: {
          type: 'textarea',
          label: 'Paragraph Text',
          default: 'This is a comprehensive paragraph component with rich text support, advanced styling, and smooth animations. It can display multiple paragraphs with customizable spacing and formatting options.'
        },
        richText: {
          type: 'toggle',
          label: 'Rich Text',
          default: false
        },
        formattedText: {
          type: 'textarea',
          label: 'Formatted Text (HTML)',
          default: ''
        },
        paragraphs: {
          type: 'list',
          label: 'Multiple Paragraphs',
          default: []
        },
        tag: {
          type: 'select',
          label: 'HTML Tag',
          default: 'p',
          options: ['p', 'span', 'div']
        },
        prefixIcon: {
          type: 'text',
          label: 'Prefix Icon Class',
          default: ''
        },
        suffixIcon: {
          type: 'text',
          label: 'Suffix Icon Class',
          default: ''
        },
        prefixEmoji: {
          type: 'text',
          label: 'Prefix Emoji',
          default: ''
        },
        suffixEmoji: {
          type: 'text',
          label: 'Suffix Emoji',
          default: ''
        },

        // Links & Navigation
        linkUrl: {
          type: 'text',
          label: 'Link URL',
          default: ''
        },
        openInNewTab: {
          type: 'toggle',
          label: 'Open in New Tab',
          default: false
        },
        linkAriaLabel: {
          type: 'text',
          label: 'Link Aria Label',
          default: ''
        },
        inlineLinks: {
          type: 'list',
          label: 'Inline Links',
          default: []
        },

        // Lists
        isList: {
          type: 'toggle',
          label: 'Is List',
          default: false
        },
        listType: {
          type: 'select',
          label: 'List Type',
          default: 'unordered',
          options: ['unordered', 'ordered']
        },
        listItems: {
          type: 'list',
          label: 'List Items',
          default: []
        },
        listStyle: {
          type: 'select',
          label: 'List Style',
          default: 'disc',
          options: ['disc', 'circle', 'square', 'decimal', 'lower-alpha', 'upper-alpha']
        },
        indentation: {
          type: 'number',
          label: 'Indentation',
          default: 0,
          min: 0,
          max: 10,
          step: 1
        },

        // Truncation
        truncate: {
          type: 'toggle',
          label: 'Truncate Text',
          default: false
        },
        maxLength: {
          type: 'number',
          label: 'Max Length',
          default: 150,
          min: 10,
          max: 1000,
          step: 10
        },
        showReadMore: {
          type: 'toggle',
          label: 'Show Read More',
          default: true
        },
        readMoreText: {
          type: 'text',
          label: 'Read More Text',
          default: 'Read More'
        },
        readLessText: {
          type: 'text',
          label: 'Read Less Text',
          default: 'Read Less'
        },

        // Visibility & Conditional Logic
        visible: {
          type: 'toggle',
          label: 'Visible',
          default: true
        },
        conditionalVisibility: {
          type: 'text',
          label: 'Conditional Visibility (JS Expression)',
          default: ''
        },

        // Data Binding
        dataBinding: {
          type: 'text',
          label: 'Data Binding (JS Expression)',
          default: ''
        },
        dynamicText: {
          type: 'text',
          label: 'Dynamic Text',
          default: ''
        },

        // Typography - Basic
        fontFamily: {
          type: 'text',
          label: 'Font Family',
          default: 'inherit'
        },
        fontSize: {
          type: 'text',
          label: 'Font Size',
          default: '16px'
        },
        fontWeight: {
          type: 'select',
          label: 'Font Weight',
          default: 'normal',
          options: ['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900']
        },
        lineHeight: {
          type: 'text',
          label: 'Line Height',
          default: '1.6'
        },
        letterSpacing: {
          type: 'text',
          label: 'Letter Spacing',
          default: '0px'
        },
        textAlign: {
          type: 'select',
          label: 'Text Alignment',
          default: 'left',
          options: ['left', 'center', 'right', 'justify']
        },

        // Typography - Advanced
        responsiveTypography: {
          type: 'toggle',
          label: 'Responsive Typography',
          default: true
        },
        fontSizeMobile: {
          type: 'text',
          label: 'Font Size (Mobile)',
          default: '14px'
        },
        fontSizeTablet: {
          type: 'text',
          label: 'Font Size (Tablet)',
          default: '15px'
        },
        fontSizeDesktop: {
          type: 'text',
          label: 'Font Size (Desktop)',
          default: '16px'
        },

        // Colors
        textColor: {
          type: 'color',
          label: 'Text Color',
          default: '#333333'
        },
        textColorDark: {
          type: 'color',
          label: 'Text Color (Dark Mode)',
          default: '#ffffff'
        },
        textColorLight: {
          type: 'color',
          label: 'Text Color (Light Mode)',
          default: '#333333'
        },
        gradientText: {
          type: 'toggle',
          label: 'Gradient Text',
          default: false
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
        gradientDirection: {
          type: 'text',
          label: 'Gradient Direction',
          default: '45deg'
        },
        gradientType: {
          type: 'select',
          label: 'Gradient Type',
          default: 'linear',
          options: ['linear', 'radial', 'conic']
        },

        // Rich Text Styles
        bold: {
          type: 'toggle',
          label: 'Bold',
          default: false
        },
        italic: {
          type: 'toggle',
          label: 'Italic',
          default: false
        },
        underline: {
          type: 'toggle',
          label: 'Underline',
          default: false
        },
        strikethrough: {
          type: 'toggle',
          label: 'Strikethrough',
          default: false
        },
        highlight: {
          type: 'toggle',
          label: 'Highlight',
          default: false
        },
        highlightColor: {
          type: 'color',
          label: 'Highlight Color',
          default: '#ffff00'
        },

        // Effects
        textShadow: {
          type: 'text',
          label: 'Text Shadow',
          default: 'none'
        },
        textStroke: {
          type: 'text',
          label: 'Text Stroke',
          default: 'none'
        },
        textGlow: {
          type: 'toggle',
          label: 'Text Glow',
          default: false
        },
        glowColor: {
          type: 'color',
          label: 'Glow Color',
          default: '#3b82f6'
        },
        glowIntensity: {
          type: 'number',
          label: 'Glow Intensity',
          default: 10,
          min: 0,
          max: 50,
          step: 1
        },

        // Background
        backgroundColor: {
          type: 'color',
          label: 'Background Color',
          default: 'transparent'
        },
        backgroundGradient: {
          type: 'toggle',
          label: 'Background Gradient',
          default: false
        },
        backgroundGradientStart: {
          type: 'color',
          label: 'Background Gradient Start',
          default: '#f0f0f0'
        },
        backgroundGradientEnd: {
          type: 'color',
          label: 'Background Gradient End',
          default: '#e0e0e0'
        },
        backgroundImage: {
          type: 'text',
          label: 'Background Image URL',
          default: ''
        },
        backgroundClip: {
          type: 'toggle',
          label: 'Background Clip to Text',
          default: false
        },
        backgroundOpacity: {
          type: 'number',
          label: 'Background Opacity',
          default: 1,
          min: 0,
          max: 1,
          step: 0.1
        },

        // Spacing & Layout
        padding: {
          type: 'text',
          label: 'Padding',
          default: '0px'
        },
        margin: {
          type: 'text',
          label: 'Margin',
          default: '0px 0px 16px 0px'
        },
        width: {
          type: 'text',
          label: 'Width',
          default: 'auto'
        },
        maxWidth: {
          type: 'text',
          label: 'Max Width',
          default: 'none'
        },
        display: {
          type: 'select',
          label: 'Display',
          default: 'block',
          options: ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid']
        },

        // Border & Shadow
        border: {
          type: 'text',
          label: 'Border',
          default: 'none'
        },
        borderRadius: {
          type: 'text',
          label: 'Border Radius',
          default: '0px'
        },
        boxShadow: {
          type: 'text',
          label: 'Box Shadow',
          default: 'none'
        },

        // Animations - Entrance
        entranceAnimation: {
          type: 'select',
          label: 'Entrance Animation',
          default: 'none',
          options: ['none', 'fadeIn', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'zoomIn', 'zoomOut', 'bounce', 'flip', 'rotate']
        },
        animationDelay: {
          type: 'number',
          label: 'Animation Delay (seconds)',
          default: 0,
          min: 0,
          max: 10,
          step: 0.1
        },
        animationDuration: {
          type: 'number',
          label: 'Animation Duration (seconds)',
          default: 0.6,
          min: 0.1,
          max: 5,
          step: 0.1
        },
        animationEasing: {
          type: 'select',
          label: 'Animation Easing',
          default: 'easeOut',
          options: ['easeOut', 'easeIn', 'easeInOut', 'linear', 'bounce', 'elastic']
        },
        staggerChildren: {
          type: 'toggle',
          label: 'Stagger Children',
          default: false
        },

        // Animations - Hover
        hoverEffect: {
          type: 'select',
          label: 'Hover Effect',
          default: 'none',
          options: ['none', 'underline', 'glow', 'colorShift', 'scale', 'rotate', 'skew']
        },
        hoverColor: {
          type: 'color',
          label: 'Hover Color',
          default: '#3b82f6'
        },
        hoverScale: {
          type: 'number',
          label: 'Hover Scale',
          default: 1.05,
          min: 0.5,
          max: 2,
          step: 0.05
        },
        hoverDuration: {
          type: 'number',
          label: 'Hover Duration (seconds)',
          default: 0.3,
          min: 0.1,
          max: 2,
          step: 0.1
        },

        // Animations - Scroll Based
        scrollAnimation: {
          type: 'select',
          label: 'Scroll Animation',
          default: 'none',
          options: ['none', 'fadeIn', 'slideUp', 'slideDown', 'zoomIn', 'bounce']
        },
        scrollTriggerOffset: {
          type: 'number',
          label: 'Scroll Trigger Offset (px)',
          default: 50,
          min: 0,
          max: 500,
          step: 10
        },
        scrollOnce: {
          type: 'toggle',
          label: 'Animate Once',
          default: true
        },

        // Animations - Typewriter
        typewriterEffect: {
          type: 'toggle',
          label: 'Typewriter Effect',
          default: false
        },
        typewriterSpeed: {
          type: 'number',
          label: 'Typewriter Speed (ms)',
          default: 100,
          min: 10,
          max: 500,
          step: 10
        },
        typewriterDelay: {
          type: 'number',
          label: 'Typewriter Delay (ms)',
          default: 1000,
          min: 0,
          max: 5000,
          step: 100
        },
        typewriterPhrases: {
          type: 'list',
          label: 'Typewriter Phrases',
          default: ['Advanced Paragraph', 'Dynamic Text', 'Animated Content']
        },
        typewriterLoop: {
          type: 'toggle',
          label: 'Typewriter Loop',
          default: false
        },
        typewriterCursor: {
          type: 'text',
          label: 'Typewriter Cursor',
          default: '|'
        },

        // Animations - Reveal
        revealEffect: {
          type: 'select',
          label: 'Reveal Effect',
          default: 'none',
          options: ['none', 'fade', 'slide', 'line-by-line', 'word-by-word', 'char-by-char']
        },
        revealDirection: {
          type: 'select',
          label: 'Reveal Direction',
          default: 'left',
          options: ['left', 'right', 'top', 'bottom']
        },
        revealDuration: {
          type: 'number',
          label: 'Reveal Duration (seconds)',
          default: 0.8,
          min: 0.1,
          max: 3,
          step: 0.1
        },

        // Accessibility
        ariaLabel: {
          type: 'text',
          label: 'Aria Label',
          default: ''
        },
        ariaLevel: {
          type: 'number',
          label: 'Aria Level',
          default: 1,
          min: 1,
          max: 6,
          step: 1
        },
        role: {
          type: 'text',
          label: 'Role',
          default: 'paragraph'
        },
        tabIndex: {
          type: 'number',
          label: 'Tab Index',
          default: -1,
          min: -1,
          max: 100,
          step: 1
        },
        screenReaderText: {
          type: 'text',
          label: 'Screen Reader Text',
          default: ''
        },

        // Multi-language & Localization
        lang: {
          type: 'text',
          label: 'Language',
          default: ''
        },
        dir: {
          type: 'select',
          label: 'Text Direction',
          default: 'ltr',
          options: ['ltr', 'rtl']
        },

        // Developer Features
        customClass: {
          type: 'text',
          label: 'Custom CSS Class',
          default: ''
        },
        customId: {
          type: 'text',
          label: 'Custom ID',
          default: ''
        },
        customCSS: {
          type: 'textarea',
          label: 'Custom CSS',
          default: ''
        },
        dataAttributes: {
          type: 'textarea',
          label: 'Data Attributes (JSON)',
          default: '{}'
        },

        // Event Handlers
        onClick: {
          type: 'text',
          label: 'On Click Handler (JS)',
          default: ''
        },
        onHover: {
          type: 'text',
          label: 'On Hover Handler (JS)',
          default: ''
        },
        onFocus: {
          type: 'text',
          label: 'On Focus Handler (JS)',
          default: ''
        },
        onBlur: {
          type: 'text',
          label: 'On Blur Handler (JS)',
          default: ''
        },

        // AI & Advanced Features
        aiPlaceholder: {
          type: 'toggle',
          label: 'AI Placeholder',
          default: false
        },
        aiPlaceholderText: {
          type: 'text',
          label: 'AI Placeholder Text',
          default: 'Enter your paragraph text...'
        },
        wordWrap: {
          type: 'toggle',
          label: 'Word Wrap',
          default: true
        },
        textOverflow: {
          type: 'select',
          label: 'Text Overflow',
          default: 'clip',
          options: ['clip', 'ellipsis']
        },
        textSelection: {
          type: 'toggle',
          label: 'Text Selection',
          default: true
        },

        // Theme Adaptation
        themeAware: {
          type: 'toggle',
          label: 'Theme Aware',
          default: false
        },
        darkMode: {
          type: 'toggle',
          label: 'Dark Mode',
          default: false
        },
        highContrast: {
          type: 'toggle',
          label: 'High Contrast',
          default: false
        },

        // Performance
        lazyLoad: {
          type: 'toggle',
          label: 'Lazy Load',
          default: false
        },
        priority: {
          type: 'toggle',
          label: 'Priority',
          default: false
        },

        // Spacing between paragraphs
        paragraphSpacing: {
          type: 'text',
          label: 'Paragraph Spacing',
          default: '16px'
        }
      }
    },
    render: (props) => React.createElement(Paragraph, props)
  })
}

function registerRichTextComponent(): void {
  componentRegistry.register({
    id: 'rich-text',
    name: 'Advanced Rich Text',
    type: 'rich-text',
    category: 'content',
    icon: 'FaEdit',
    description: 'Fully customizable rich text editor with advanced formatting, media support, and dynamic content features',
    defaultProps: {
      // Basic Content
      content: '<p>Start writing your rich text content here...</p>',
      placeholder: 'Start writing your rich text content here...',
      editable: true,

      // Typography - Basic
      fontFamily: 'inherit',
      fontSize: '16px',
      fontWeight: 'normal',
      lineHeight: '1.6',
      letterSpacing: '0px',
      textAlign: 'left',

      // Typography - Advanced
      fontSizeMobile: '14px',
      fontSizeTablet: '15px',
      fontSizeDesktop: '16px',
      responsiveTypography: true,

      // Colors
      textColor: '#333333',
      textColorDark: '#ffffff',
      textColorLight: '#333333',
      gradientText: false,
      gradientStart: '#667eea',
      gradientEnd: '#764ba2',
      gradientDirection: '45deg',
      gradientType: 'linear',

      // Effects
      textShadow: 'none',
      textStroke: 'none',
      textGlow: false,
      glowColor: '#3b82f6',
      glowIntensity: 10,

      // Background
      backgroundColor: 'transparent',
      backgroundGradient: false,
      backgroundGradientStart: '#f0f0f0',
      backgroundGradientEnd: '#e0e0e0',
      backgroundImage: '',
      backgroundClip: false,
      backgroundOpacity: 1,

      // Spacing & Layout
      padding: '16px',
      margin: '0px',
      width: '100%',
      maxWidth: 'none',
      display: 'block',

      // Border & Shadow
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: 'none',

      // Animations - Entrance
      entranceAnimation: 'none',
      animationDelay: 0,
      animationDuration: 0.6,
      animationEasing: 'easeOut',
      staggerChildren: false,

      // Animations - Hover
      hoverEffect: 'none',
      hoverColor: '#3b82f6',
      hoverScale: 1.05,
      hoverDuration: 0.3,

      // Animations - Scroll Based
      scrollAnimation: 'none',
      scrollTriggerOffset: 50,
      scrollOnce: true,

      // Animations - Typewriter
      typewriterEffect: false,
      typewriterSpeed: 100,
      typewriterDelay: 1000,
      typewriterPhrases: ['Advanced Rich Text', 'Dynamic Content', 'Animated Text'],
      typewriterLoop: false,
      typewriterCursor: '|',

      // Animations - Advanced
      maskReveal: false,
      gradientReveal: false,
      revealDirection: 'left',
      revealDuration: 0.8,

      // Accessibility
      ariaLabel: '',
      ariaLevel: 1,
      role: 'textbox',
      tabIndex: 0,
      screenReaderText: '',

      // Multi-language & Localization
      lang: '',
      dir: 'ltr',

      // Developer Features
      customClass: '',
      customId: '',
      customCSS: '',
      dataAttributes: '{}',

      // Event Handlers
      onClick: '',
      onHover: '',
      onFocus: '',
      onBlur: '',

      // AI & Advanced Features
      aiPlaceholder: false,
      aiPlaceholderText: 'Enter your rich text content...',
      wordWrap: true,
      textOverflow: 'clip',
      textSelection: true,

      // Theme Adaptation
      themeAware: false,
      darkMode: false,
      highContrast: false,

      // Performance
      lazyLoad: false,
      priority: false,

      // Editor Configuration
      showToolbar: true,
      toolbarPosition: 'top',
      toolbarMode: 'full',
      placeholderText: 'Start writing your rich text content here...',
      minHeight: '200px',
      maxHeight: '',
      autoFocus: false,
      readOnly: false,

      // Advanced Editor Features
      enableSlashCommands: false,
      enableMarkdown: false,
      enableKeyboardShortcuts: true,
      enableDragDrop: true,
      enablePaste: true,
      enableCollaboration: false,

      // Content Features
      enableTables: true,
      enableCodeBlocks: true,
      enableBlockquotes: true,
      enableLists: true,
      enableLinks: true,
      enableImages: true,
      enableVideos: false,
      enableEmbeds: false,

      // Styling Features
      enableColors: true,
      enableHighlights: true,
      enableFonts: true,
      enableSizes: true,
      enableAlignments: true,

      // Dynamic Features
      enableVariables: false,
      enableDynamicContent: false,
      enableConditionalContent: false,

      // Media & Assets
      mediaLibrary: false,
      dragDropUpload: true,
      altTextRequired: false,
      captionSupport: true,

      // Export & Import
      enableHTMLExport: true,
      enableMarkdownExport: false,
      enableJSONExport: false,
      enableImport: false,

      // Version Control
      enableVersionHistory: false,
      enableAutoSave: false,
      autoSaveInterval: 30000,

      // Word Count & Limits
      showWordCount: false,
      showCharCount: false,
      maxWords: 0,
      maxChars: 0,

      // SEO & Meta
      enableSEO: false,
      metaTitle: '',
      metaDescription: '',
      keywords: [],

      // Security
      sanitizeHTML: true,
      allowedTags: [],
      allowedAttributes: {},

      // Performance
      debouncedInput: true,
      inputDebounceMs: 300,
      virtualized: false,
      lazyRender: false,

      // Integration
      apiEndpoint: '',
      webhookUrl: '',
      dataSource: '',
      dynamicBindings: {},
    },
    schema: {
      properties: {
        // Basic Content
        content: {
          type: 'richtext',
          label: 'Content',
          default: '<p>Start writing your rich text content here...</p>'
        },
        placeholder: {
          type: 'text',
          label: 'Placeholder Text',
          default: 'Start writing your rich text content here...'
        },
        editable: {
          type: 'toggle',
          label: 'Editable',
          default: true
        },

        // Typography - Basic
        fontFamily: {
          type: 'text',
          label: 'Font Family',
          default: 'inherit'
        },
        fontSize: {
          type: 'text',
          label: 'Font Size',
          default: '16px'
        },
        fontWeight: {
          type: 'select',
          label: 'Font Weight',
          default: 'normal',
          options: ['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900']
        },
        lineHeight: {
          type: 'text',
          label: 'Line Height',
          default: '1.6'
        },
        letterSpacing: {
          type: 'text',
          label: 'Letter Spacing',
          default: '0px'
        },
        textAlign: {
          type: 'select',
          label: 'Text Alignment',
          default: 'left',
          options: ['left', 'center', 'right', 'justify']
        },

        // Typography - Advanced
        responsiveTypography: {
          type: 'toggle',
          label: 'Responsive Typography',
          default: true
        },
        fontSizeMobile: {
          type: 'text',
          label: 'Font Size (Mobile)',
          default: '14px'
        },
        fontSizeTablet: {
          type: 'text',
          label: 'Font Size (Tablet)',
          default: '15px'
        },
        fontSizeDesktop: {
          type: 'text',
          label: 'Font Size (Desktop)',
          default: '16px'
        },

        // Colors
        textColor: {
          type: 'color',
          label: 'Text Color',
          default: '#333333'
        },
        textColorDark: {
          type: 'color',
          label: 'Text Color (Dark Mode)',
          default: '#ffffff'
        },
        textColorLight: {
          type: 'color',
          label: 'Text Color (Light Mode)',
          default: '#333333'
        },
        gradientText: {
          type: 'toggle',
          label: 'Gradient Text',
          default: false
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
        gradientDirection: {
          type: 'text',
          label: 'Gradient Direction',
          default: '45deg'
        },
        gradientType: {
          type: 'select',
          label: 'Gradient Type',
          default: 'linear',
          options: ['linear', 'radial', 'conic']
        },

        // Effects
        textShadow: {
          type: 'text',
          label: 'Text Shadow',
          default: 'none'
        },
        textStroke: {
          type: 'text',
          label: 'Text Stroke',
          default: 'none'
        },
        textGlow: {
          type: 'toggle',
          label: 'Text Glow',
          default: false
        },
        glowColor: {
          type: 'color',
          label: 'Glow Color',
          default: '#3b82f6'
        },
        glowIntensity: {
          type: 'number',
          label: 'Glow Intensity',
          default: 10,
          min: 0,
          max: 50,
          step: 1
        },

        // Background
        backgroundColor: {
          type: 'color',
          label: 'Background Color',
          default: 'transparent'
        },
        backgroundGradient: {
          type: 'toggle',
          label: 'Background Gradient',
          default: false
        },
        backgroundGradientStart: {
          type: 'color',
          label: 'Background Gradient Start',
          default: '#f0f0f0'
        },
        backgroundGradientEnd: {
          type: 'color',
          label: 'Background Gradient End',
          default: '#e0e0e0'
        },
        backgroundImage: {
          type: 'text',
          label: 'Background Image URL',
          default: ''
        },
        backgroundClip: {
          type: 'toggle',
          label: 'Background Clip to Text',
          default: false
        },
        backgroundOpacity: {
          type: 'number',
          label: 'Background Opacity',
          default: 1,
          min: 0,
          max: 1,
          step: 0.1
        },

        // Spacing & Layout
        padding: {
          type: 'text',
          label: 'Padding',
          default: '16px'
        },
        margin: {
          type: 'text',
          label: 'Margin',
          default: '0px'
        },
        width: {
          type: 'text',
          label: 'Width',
          default: '100%'
        },
        maxWidth: {
          type: 'text',
          label: 'Max Width',
          default: 'none'
        },
        display: {
          type: 'select',
          label: 'Display',
          default: 'block',
          options: ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid']
        },

        // Border & Shadow
        border: {
          type: 'text',
          label: 'Border',
          default: '1px solid #e5e7eb'
        },
        borderRadius: {
          type: 'text',
          label: 'Border Radius',
          default: '8px'
        },
        boxShadow: {
          type: 'text',
          label: 'Box Shadow',
          default: 'none'
        },

        // Animations - Entrance
        entranceAnimation: {
          type: 'select',
          label: 'Entrance Animation',
          default: 'none',
          options: ['none', 'fadeIn', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'zoomIn', 'zoomOut', 'bounce', 'flip', 'rotate']
        },
        animationDelay: {
          type: 'number',
          label: 'Animation Delay (seconds)',
          default: 0,
          min: 0,
          max: 10,
          step: 0.1
        },
        animationDuration: {
          type: 'number',
          label: 'Animation Duration (seconds)',
          default: 0.6,
          min: 0.1,
          max: 5,
          step: 0.1
        },
        animationEasing: {
          type: 'select',
          label: 'Animation Easing',
          default: 'easeOut',
          options: ['easeOut', 'easeIn', 'easeInOut', 'linear', 'bounce', 'elastic']
        },
        staggerChildren: {
          type: 'toggle',
          label: 'Stagger Children',
          default: false
        },

        // Animations - Hover
        hoverEffect: {
          type: 'select',
          label: 'Hover Effect',
          default: 'none',
          options: ['none', 'underline', 'glow', 'colorShift', 'scale', 'rotate', 'skew']
        },
        hoverColor: {
          type: 'color',
          label: 'Hover Color',
          default: '#3b82f6'
        },
        hoverScale: {
          type: 'number',
          label: 'Hover Scale',
          default: 1.05,
          min: 0.5,
          max: 2,
          step: 0.05
        },
        hoverDuration: {
          type: 'number',
          label: 'Hover Duration (seconds)',
          default: 0.3,
          min: 0.1,
          max: 2,
          step: 0.1
        },

        // Animations - Scroll Based
        scrollAnimation: {
          type: 'select',
          label: 'Scroll Animation',
          default: 'none',
          options: ['none', 'fadeIn', 'slideUp', 'slideDown', 'zoomIn', 'bounce']
        },
        scrollTriggerOffset: {
          type: 'number',
          label: 'Scroll Trigger Offset (px)',
          default: 50,
          min: 0,
          max: 500,
          step: 10
        },
        scrollOnce: {
          type: 'toggle',
          label: 'Animate Once',
          default: true
        },

        // Animations - Typewriter
        typewriterEffect: {
          type: 'toggle',
          label: 'Typewriter Effect',
          default: false
        },
        typewriterSpeed: {
          type: 'number',
          label: 'Typewriter Speed (ms)',
          default: 100,
          min: 10,
          max: 500,
          step: 10
        },
        typewriterDelay: {
          type: 'number',
          label: 'Typewriter Delay (ms)',
          default: 1000,
          min: 0,
          max: 5000,
          step: 100
        },
        typewriterPhrases: {
          type: 'list',
          label: 'Typewriter Phrases',
          default: ['Advanced Rich Text', 'Dynamic Content', 'Animated Text']
        },
        typewriterLoop: {
          type: 'toggle',
          label: 'Typewriter Loop',
          default: false
        },
        typewriterCursor: {
          type: 'text',
          label: 'Typewriter Cursor',
          default: '|'
        },

        // Animations - Advanced
        maskReveal: {
          type: 'toggle',
          label: 'Mask Reveal',
          default: false
        },
        gradientReveal: {
          type: 'toggle',
          label: 'Gradient Reveal',
          default: false
        },
        revealDirection: {
          type: 'select',
          label: 'Reveal Direction',
          default: 'left',
          options: ['left', 'right', 'top', 'bottom']
        },
        revealDuration: {
          type: 'number',
          label: 'Reveal Duration (seconds)',
          default: 0.8,
          min: 0.1,
          max: 3,
          step: 0.1
        },

        // Accessibility
        ariaLabel: {
          type: 'text',
          label: 'Aria Label',
          default: ''
        },
        ariaLevel: {
          type: 'number',
          label: 'Aria Level',
          default: 1,
          min: 1,
          max: 6,
          step: 1
        },
        role: {
          type: 'text',
          label: 'Role',
          default: 'textbox'
        },
        tabIndex: {
          type: 'number',
          label: 'Tab Index',
          default: 0,
          min: -1,
          max: 100,
          step: 1
        },
        screenReaderText: {
          type: 'text',
          label: 'Screen Reader Text',
          default: ''
        },

        // Multi-language & Localization
        lang: {
          type: 'text',
          label: 'Language',
          default: ''
        },
        dir: {
          type: 'select',
          label: 'Text Direction',
          default: 'ltr',
          options: ['ltr', 'rtl']
        },

        // Developer Features
        customClass: {
          type: 'text',
          label: 'Custom CSS Class',
          default: ''
        },
        customId: {
          type: 'text',
          label: 'Custom ID',
          default: ''
        },
        customCSS: {
          type: 'textarea',
          label: 'Custom CSS',
          default: ''
        },
        dataAttributes: {
          type: 'textarea',
          label: 'Data Attributes (JSON)',
          default: '{}'
        },

        // Event Handlers
        onClick: {
          type: 'text',
          label: 'On Click Handler (JS)',
          default: ''
        },
        onHover: {
          type: 'text',
          label: 'On Hover Handler (JS)',
          default: ''
        },
        onFocus: {
          type: 'text',
          label: 'On Focus Handler (JS)',
          default: ''
        },
        onBlur: {
          type: 'text',
          label: 'On Blur Handler (JS)',
          default: ''
        },

        // AI & Advanced Features
        aiPlaceholder: {
          type: 'toggle',
          label: 'AI Placeholder',
          default: false
        },
        aiPlaceholderText: {
          type: 'text',
          label: 'AI Placeholder Text',
          default: 'Enter your rich text content...'
        },
        wordWrap: {
          type: 'toggle',
          label: 'Word Wrap',
          default: true
        },
        textOverflow: {
          type: 'select',
          label: 'Text Overflow',
          default: 'clip',
          options: ['clip', 'ellipsis']
        },
        textSelection: {
          type: 'toggle',
          label: 'Text Selection',
          default: true
        },

        // Theme Adaptation
        themeAware: {
          type: 'toggle',
          label: 'Theme Aware',
          default: false
        },
        darkMode: {
          type: 'toggle',
          label: 'Dark Mode',
          default: false
        },
        highContrast: {
          type: 'toggle',
          label: 'High Contrast',
          default: false
        },

        // Performance
        lazyLoad: {
          type: 'toggle',
          label: 'Lazy Load',
          default: false
        },
        priority: {
          type: 'toggle',
          label: 'Priority',
          default: false
        },

        // Editor Configuration
        showToolbar: {
          type: 'toggle',
          label: 'Show Toolbar',
          default: true
        },
        toolbarPosition: {
          type: 'select',
          label: 'Toolbar Position',
          default: 'top',
          options: ['top', 'bottom', 'floating']
        },
        toolbarMode: {
          type: 'select',
          label: 'Toolbar Mode',
          default: 'full',
          options: ['full', 'basic', 'minimal']
        },
        placeholderText: {
          type: 'text',
          label: 'Placeholder Text',
          default: 'Start writing your rich text content here...'
        },
        minHeight: {
          type: 'text',
          label: 'Minimum Height',
          default: '200px'
        },
        maxHeight: {
          type: 'text',
          label: 'Maximum Height',
          default: ''
        },
        autoFocus: {
          type: 'toggle',
          label: 'Auto Focus',
          default: false
        },
        readOnly: {
          type: 'toggle',
          label: 'Read Only',
          default: false
        },

        // Advanced Editor Features
        enableSlashCommands: {
          type: 'toggle',
          label: 'Enable Slash Commands',
          default: false
        },
        enableMarkdown: {
          type: 'toggle',
          label: 'Enable Markdown',
          default: false
        },
        enableKeyboardShortcuts: {
          type: 'toggle',
          label: 'Enable Keyboard Shortcuts',
          default: true
        },
        enableDragDrop: {
          type: 'toggle',
          label: 'Enable Drag & Drop',
          default: true
        },
        enablePaste: {
          type: 'toggle',
          label: 'Enable Paste',
          default: true
        },
        enableCollaboration: {
          type: 'toggle',
          label: 'Enable Collaboration',
          default: false
        },

        // Content Features
        enableTables: {
          type: 'toggle',
          label: 'Enable Tables',
          default: true
        },
        enableCodeBlocks: {
          type: 'toggle',
          label: 'Enable Code Blocks',
          default: true
        },
        enableBlockquotes: {
          type: 'toggle',
          label: 'Enable Blockquotes',
          default: true
        },
        enableLists: {
          type: 'toggle',
          label: 'Enable Lists',
          default: true
        },
        enableLinks: {
          type: 'toggle',
          label: 'Enable Links',
          default: true
        },
        enableImages: {
          type: 'toggle',
          label: 'Enable Images',
          default: true
        },
        enableVideos: {
          type: 'toggle',
          label: 'Enable Videos',
          default: false
        },
        enableEmbeds: {
          type: 'toggle',
          label: 'Enable Embeds',
          default: false
        },

        // Styling Features
        enableColors: {
          type: 'toggle',
          label: 'Enable Colors',
          default: true
        },
        enableHighlights: {
          type: 'toggle',
          label: 'Enable Highlights',
          default: true
        },
        enableFonts: {
          type: 'toggle',
          label: 'Enable Fonts',
          default: true
        },
        enableSizes: {
          type: 'toggle',
          label: 'Enable Sizes',
          default: true
        },
        enableAlignments: {
          type: 'toggle',
          label: 'Enable Alignments',
          default: true
        },

        // Dynamic Features
        enableVariables: {
          type: 'toggle',
          label: 'Enable Variables',
          default: false
        },
        enableDynamicContent: {
          type: 'toggle',
          label: 'Enable Dynamic Content',
          default: false
        },
        enableConditionalContent: {
          type: 'toggle',
          label: 'Enable Conditional Content',
          default: false
        },

        // Media & Assets
        mediaLibrary: {
          type: 'toggle',
          label: 'Media Library',
          default: false
        },
        dragDropUpload: {
          type: 'toggle',
          label: 'Drag & Drop Upload',
          default: true
        },
        altTextRequired: {
          type: 'toggle',
          label: 'Alt Text Required',
          default: false
        },
        captionSupport: {
          type: 'toggle',
          label: 'Caption Support',
          default: true
        },

        // Export & Import
        enableHTMLExport: {
          type: 'toggle',
          label: 'Enable HTML Export',
          default: true
        },
        enableMarkdownExport: {
          type: 'toggle',
          label: 'Enable Markdown Export',
          default: false
        },
        enableJSONExport: {
          type: 'toggle',
          label: 'Enable JSON Export',
          default: false
        },
        enableImport: {
          type: 'toggle',
          label: 'Enable Import',
          default: false
        },

        // Version Control
        enableVersionHistory: {
          type: 'toggle',
          label: 'Enable Version History',
          default: false
        },
        enableAutoSave: {
          type: 'toggle',
          label: 'Enable Auto Save',
          default: false
        },
        autoSaveInterval: {
          type: 'number',
          label: 'Auto Save Interval (ms)',
          default: 30000,
          min: 5000,
          max: 300000,
          step: 5000
        },

        // Word Count & Limits
        showWordCount: {
          type: 'toggle',
          label: 'Show Word Count',
          default: false
        },
        showCharCount: {
          type: 'toggle',
          label: 'Show Character Count',
          default: false
        },
        maxWords: {
          type: 'number',
          label: 'Max Words',
          default: 0,
          min: 0,
          max: 10000,
          step: 10
        },
        maxChars: {
          type: 'number',
          label: 'Max Characters',
          default: 0,
          min: 0,
          max: 100000,
          step: 100
        },

        // SEO & Meta
        enableSEO: {
          type: 'toggle',
          label: 'Enable SEO',
          default: false
        },
        metaTitle: {
          type: 'text',
          label: 'Meta Title',
          default: ''
        },
        metaDescription: {
          type: 'text',
          label: 'Meta Description',
          default: ''
        },
        keywords: {
          type: 'list',
          label: 'Keywords',
          default: []
        },

        // Security
        sanitizeHTML: {
          type: 'toggle',
          label: 'Sanitize HTML',
          default: true
        },
        allowedTags: {
          type: 'list',
          label: 'Allowed Tags',
          default: []
        },
        allowedAttributes: {
          type: 'textarea',
          label: 'Allowed Attributes (JSON)',
          default: '{}'
        },

        // Performance
        debouncedInput: {
          type: 'toggle',
          label: 'Debounced Input',
          default: true
        },
        inputDebounceMs: {
          type: 'number',
          label: 'Input Debounce (ms)',
          default: 300,
          min: 50,
          max: 2000,
          step: 50
        },
        virtualized: {
          type: 'toggle',
          label: 'Virtualized',
          default: false
        },
        lazyRender: {
          type: 'toggle',
          label: 'Lazy Render',
          default: false
        },

        // Integration
        apiEndpoint: {
          type: 'text',
          label: 'API Endpoint',
          default: ''
        },
        webhookUrl: {
          type: 'text',
          label: 'Webhook URL',
          default: ''
        },
        dataSource: {
          type: 'text',
          label: 'Data Source',
          default: ''
        },
        dynamicBindings: {
          type: 'textarea',
          label: 'Dynamic Bindings (JSON)',
          default: '{}'
        },
      }
    },
    render: (props) => React.createElement(RichText, {
      ...props,
      onUpdate: (updatedProps: any) => {
        // This will be handled by the property panel
        console.log('Rich text component updated:', updatedProps)
      }
    })
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
        textAlign: {
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
    render: (props) => React.createElement('blockquote', {
      style: {
        textAlign: props.align || 'center',
        fontStyle: 'italic',
        borderLeft: props.style === 'default' ? '4px solid #ccc' : 'none',
        paddingLeft: props.style === 'default' ? '20px' : '0',
        fontSize: props.style === 'large' ? '24px' : '18px',
        margin: '20px 0'
      }
    }, [
      React.createElement('p', {
        key: 'text',
        style: { margin: '0 0 10px 0', fontSize: 'inherit' }
      }, props.text || '"This is a quote"'),
      props.author && React.createElement('cite', {
        key: 'author',
        style: { fontStyle: 'normal', fontWeight: 'bold' }
      }, `— ${props.author}`)
    ].filter(Boolean))
  })
}

function registerListComponent(): void {
  componentRegistry.register({
    id: 'list',
    name: 'Dynamic List',
    type: 'list',
    category: 'content',
    icon: 'FaList',
    description: 'Advanced dynamic list component with full styling, animations, and CMS integration',
    defaultProps: {
      items: [
        { id: 'item-1', content: 'List item 1', richText: false, visible: true },
        { id: 'item-2', content: 'List item 2', richText: false, visible: true },
        { id: 'item-3', content: 'List item 3', richText: false, visible: true }
      ],
      listType: 'unordered',
      styling: {
        itemPadding: '8px 0',
        itemMargin: '0',
        itemBorder: 'none',
        itemBorderRadius: '0',
        itemBackgroundColor: 'transparent',
        itemBoxShadow: 'none',
        itemHoverBackgroundColor: 'transparent',
        itemHoverBorder: 'none',
        itemHoverBoxShadow: 'none',
        itemActiveBackgroundColor: 'transparent',
        zebraStripe: false,
        zebraStripeColor: '#f9f9f9',
        zebraStripeOpacity: 0.5,
        fontFamily: 'inherit',
        fontSize: '16px',
        fontWeight: 'normal',
        lineHeight: '1.5',
        letterSpacing: '0px',
        textAlign: 'left',
        textColor: '#333333',
        gradientText: false,
        gradientTextStart: '#667eea',
        gradientTextEnd: '#764ba2',
        textShadow: 'none',
        textStroke: 'none',
        textGlow: false,
        glowColor: '#3b82f6',
        glowIntensity: 10,
        bulletType: 'disc',
        bulletSize: '16px',
        bulletColor: '#333333',
        bulletPosition: 'outside',
        customBulletIcon: '',
        customBulletEmoji: '',
        customBulletImage: '',
        bulletSpacing: '8px',
        orientation: 'vertical',
        layout: 'list',
        gridColumns: 3,
        gridGap: '16px',
        flexDirection: 'row',
        flexWrap: false,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        containerPadding: '0',
        containerMargin: '0',
        containerBorder: 'none',
        containerBorderRadius: '0',
        containerBackgroundColor: 'transparent',
        containerBoxShadow: 'none',
        containerMaxWidth: 'none',
        containerWidth: '100%'
      },
      animation: {
        entranceAnimation: 'none',
        animationDelay: 0,
        animationDuration: 0.6,
        animationEasing: 'easeOut',
        staggerDelay: 0.1,
        hoverAnimation: 'none',
        hoverDuration: 0.3,
        collapseAnimation: 'slide',
        collapseDuration: 0.3
      },
      behavior: {
        allowAddRemove: true,
        allowReorder: true,
        allowDuplicate: true,
        allowInlineEditing: true,
        allowCollapsible: false,
        allowToggleVisibility: false,
        maxItems: undefined,
        minItems: undefined,
        clickableItems: false,
        hoverEffects: true,
        keyboardNavigation: true,
        dragDropReorder: false,
        dataSource: 'static',
        apiEndpoint: '',
        cmsCollection: '',
        dynamicData: undefined,
        autoRefresh: false,
        refreshInterval: 30000,
        pagination: false,
        itemsPerPage: 10,
        sorting: false,
        sortBy: undefined,
        sortOrder: 'asc',
        filtering: false,
        filterCriteria: undefined
      },
      accessibility: {
        ariaLabel: 'List',
        ariaLevel: 1,
        role: 'list',
        screenReaderText: '',
        keyboardShortcuts: true,
        focusManagement: true,
        announceChanges: true,
        semanticMarkup: true,
        landmarkRole: undefined
      },
      performance: {
        virtualize: false,
        lazyLoad: false,
        debounceUpdates: true,
        throttleScroll: false,
        preloadItems: 5,
        imageOptimization: true,
        reduceMotion: false
      },
      advanced: {
        customClass: '',
        customId: '',
        customCSS: '',
        dataAttributes: undefined,
        onItemClick: undefined,
        onItemHover: undefined,
        onItemAdd: undefined,
        onItemRemove: undefined,
        onItemReorder: undefined,
        onCollapseToggle: undefined,
        onDataLoad: undefined,
        onError: undefined,
        cmsIntegration: true,
        undoRedoSupport: false,
        versionControl: false,
        inlineEditing: true,
        dragDropUpload: false,
        mediaLibrary: false
      },
      width: '100%',
      height: 'auto',
      maxWidth: 'none',
      maxHeight: 'none',
      margin: '0',
      padding: '0',
      backgroundColor: 'transparent',
      backgroundImage: undefined,
      backgroundGradient: undefined,
      border: 'none',
      borderRadius: '0',
      boxShadow: 'none'
    },
    schema: {
      properties: {
        // List Items Management
        items: {
          type: 'list',
          label: 'List Items',
          default: []
        },

        // List Type
        listType: {
          type: 'select',
          label: 'List Type',
          default: 'unordered',
          options: ['unordered', 'ordered', 'checklist', 'definition', 'nested', 'grid', 'inline']
        },

        // General Settings
        allowAddRemove: {
          type: 'toggle',
          label: 'Allow Add/Remove Items',
          default: true
        },
        allowReorder: {
          type: 'toggle',
          label: 'Allow Reorder Items',
          default: true
        },
        allowInlineEditing: {
          type: 'toggle',
          label: 'Allow Inline Editing',
          default: true
        },
        allowCollapsible: {
          type: 'toggle',
          label: 'Allow Collapsible Items',
          default: false
        },

        // Typography
        fontFamily: {
          type: 'text',
          label: 'Font Family',
          default: 'inherit'
        },
        fontSize: {
          type: 'text',
          label: 'Font Size',
          default: '16px'
        },
        fontWeight: {
          type: 'select',
          label: 'Font Weight',
          default: 'normal',
          options: ['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900']
        },
        lineHeight: {
          type: 'text',
          label: 'Line Height',
          default: '1.5'
        },
        textAlign: {
          type: 'select',
          label: 'Text Alignment',
          default: 'left',
          options: ['left', 'center', 'right', 'justify']
        },
        textColor: {
          type: 'color',
          label: 'Text Color',
          default: '#333333'
        },
        gradientText: {
          type: 'toggle',
          label: 'Gradient Text',
          default: false
        },
        gradientTextStart: {
          type: 'color',
          label: 'Gradient Start Color',
          default: '#667eea'
        },
        gradientTextEnd: {
          type: 'color',
          label: 'Gradient End Color',
          default: '#764ba2'
        },

        // Bullets & Icons
        bulletType: {
          type: 'select',
          label: 'Bullet Type',
          default: 'disc',
          options: ['disc', 'circle', 'square', 'decimal', 'lower-alpha', 'upper-alpha', 'lower-roman', 'upper-roman', 'custom', 'icon', 'emoji', 'image', 'none']
        },
        bulletSize: {
          type: 'text',
          label: 'Bullet Size',
          default: '16px'
        },
        bulletColor: {
          type: 'color',
          label: 'Bullet Color',
          default: '#333333'
        },
        customBulletIcon: {
          type: 'text',
          label: 'Custom Bullet Icon Class',
          default: ''
        },
        customBulletEmoji: {
          type: 'text',
          label: 'Custom Bullet Emoji',
          default: ''
        },
        customBulletImage: {
          type: 'text',
          label: 'Custom Bullet Image URL',
          default: ''
        },

        // Layout
        orientation: {
          type: 'select',
          label: 'Orientation',
          default: 'vertical',
          options: ['vertical', 'horizontal']
        },
        layout: {
          type: 'select',
          label: 'Layout Type',
          default: 'list',
          options: ['list', 'grid', 'inline', 'flex']
        },
        gridColumns: {
          type: 'number',
          label: 'Grid Columns',
          default: 3,
          min: 1,
          max: 12
        },
        gridGap: {
          type: 'text',
          label: 'Grid Gap',
          default: '16px'
        },

        // Styling
        itemPadding: {
          type: 'text',
          label: 'Item Padding',
          default: '8px 0'
        },
        itemMargin: {
          type: 'text',
          label: 'Item Margin',
          default: '0'
        },
        itemBorder: {
          type: 'text',
          label: 'Item Border',
          default: 'none'
        },
        itemBorderRadius: {
          type: 'text',
          label: 'Item Border Radius',
          default: '0'
        },
        itemBackgroundColor: {
          type: 'color',
          label: 'Item Background Color',
          default: 'transparent'
        },
        itemHoverBackgroundColor: {
          type: 'color',
          label: 'Item Hover Background',
          default: 'transparent'
        },
        zebraStripe: {
          type: 'toggle',
          label: 'Zebra Stripes',
          default: false
        },
        zebraStripeColor: {
          type: 'color',
          label: 'Zebra Stripe Color',
          default: '#f9f9f9'
        },

        // Animations
        entranceAnimation: {
          type: 'select',
          label: 'Entrance Animation',
          default: 'none',
          options: ['none', 'fadeIn', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'zoomIn', 'zoomOut', 'bounce', 'flip', 'rotate', 'stagger']
        },
        animationDuration: {
          type: 'number',
          label: 'Animation Duration (seconds)',
          default: 0.6,
          min: 0.1,
          max: 5,
          step: 0.1
        },
        hoverAnimation: {
          type: 'select',
          label: 'Hover Animation',
          default: 'none',
          options: ['none', 'scale', 'translate', 'rotate', 'glow', 'underline', 'background']
        },

        // Data Integration
        dataSource: {
          type: 'select',
          label: 'Data Source',
          default: 'static',
          options: ['static', 'api', 'cms']
        },
        apiEndpoint: {
          type: 'text',
          label: 'API Endpoint',
          default: ''
        },
        cmsCollection: {
          type: 'text',
          label: 'CMS Collection',
          default: ''
        },
        autoRefresh: {
          type: 'toggle',
          label: 'Auto Refresh',
          default: false
        },
        refreshInterval: {
          type: 'number',
          label: 'Refresh Interval (ms)',
          default: 30000,
          min: 5000,
          max: 300000
        },

        // Accessibility
        ariaLabel: {
          type: 'text',
          label: 'Aria Label',
          default: 'List'
        },
        role: {
          type: 'select',
          label: 'Role',
          default: 'list',
          options: ['list', 'listbox', 'menu', 'tablist', 'tree']
        },
        keyboardNavigation: {
          type: 'toggle',
          label: 'Keyboard Navigation',
          default: true
        },

        // Performance
        virtualize: {
          type: 'toggle',
          label: 'Virtualize Large Lists',
          default: false
        },
        lazyLoad: {
          type: 'toggle',
          label: 'Lazy Load',
          default: false
        },

        // Advanced
        customClass: {
          type: 'text',
          label: 'Custom CSS Class',
          default: ''
        },
        customId: {
          type: 'text',
          label: 'Custom ID',
          default: ''
        },
        customCSS: {
          type: 'textarea',
          label: 'Custom CSS',
          default: ''
        }
      }
    },
    render: (props: any) => React.createElement(DynamicList, { component: { id: 'list', type: 'list', label: 'Dynamic List', props }, onUpdate: () => {} })
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
    render: (props: any) => {
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

      return React.createElement('a', {
        href: props.link || '#',
        target: props.openInNewTab ? '_blank' : '_self',
        rel: props.openInNewTab ? 'noopener noreferrer' : undefined,
        style: getButtonStyles()
      }, props.text || 'Click Me')
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
    description: 'Display multiple images in a responsive gallery with full editing capabilities',
    defaultProps: {
      images: [
        { src: 'https://via.placeholder.com/300x200?text=Image+1', alt: 'Image 1', caption: '', linkUrl: '' },
        { src: 'https://via.placeholder.com/300x200?text=Image+2', alt: 'Image 2', caption: '', linkUrl: '' },
        { src: 'https://via.placeholder.com/300x200?text=Image+3', alt: 'Image 3', caption: '', linkUrl: '' }
      ],
      columns: 3,
      gap: '10px',
      alignment: 'center',
      imageWidth: '100%',
      imageHeight: 'auto',
      maxWidth: '100%',
      maxHeight: 'none',
      border: 'none',
      borderRadius: '4px',
      padding: '0px',
      margin: '20px 0px',
      customClass: '',
      customId: ''
    },
    schema: {
      properties: {
        images: {
          type: 'image-array',
          label: 'Images',
          default: [
            { src: 'https://via.placeholder.com/300x200?text=Image+1', alt: 'Image 1', caption: '', linkUrl: '' },
            { src: 'https://via.placeholder.com/300x200?text=Image+2', alt: 'Image 2', caption: '', linkUrl: '' },
            { src: 'https://via.placeholder.com/300x200?text=Image+3', alt: 'Image 3', caption: '', linkUrl: '' }
          ]
        },
        columns: {
          type: 'select',
          label: 'Columns',
          default: 3,
          options: [1, 2, 3, 4, 5, 6]
        },
        gap: {
          type: 'text',
          label: 'Gap Between Images',
          default: '10px'
        },
        alignment: {
          type: 'select',
          label: 'Gallery Alignment',
          default: 'center',
          options: ['left', 'center', 'right']
        },
        imageWidth: {
          type: 'text',
          label: 'Image Width',
          default: '100%'
        },
        imageHeight: {
          type: 'text',
          label: 'Image Height',
          default: 'auto'
        },
        maxWidth: {
          type: 'text',
          label: 'Max Width',
          default: '100%'
        },
        maxHeight: {
          type: 'text',
          label: 'Max Height',
          default: 'none'
        },
        border: {
          type: 'text',
          label: 'Border',
          default: 'none'
        },
        borderRadius: {
          type: 'text',
          label: 'Border Radius',
          default: '4px'
        },
        padding: {
          type: 'text',
          label: 'Padding',
          default: '0px'
        },
        margin: {
          type: 'text',
          label: 'Margin',
          default: '20px 0px'
        },
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
    render: (props) => {
      const images = Array.isArray(props.images) ? props.images : [
        { src: 'https://via.placeholder.com/300x200?text=Image+1', alt: 'Image 1', caption: '', linkUrl: '' },
        { src: 'https://via.placeholder.com/300x200?text=Image+2', alt: 'Image 2', caption: '', linkUrl: '' },
        { src: 'https://via.placeholder.com/300x200?text=Image+3', alt: 'Image 3', caption: '', linkUrl: '' }
      ]

      const containerStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${props.columns || 3}, 1fr)`,
        gap: props.gap || '10px',
        justifyItems: props.alignment === 'center' ? 'center' : props.alignment === 'right' ? 'end' : 'start',
        padding: props.padding || '0px',
        margin: props.margin || '20px 0px'
      }

      const imageStyle: React.CSSProperties = {
        width: props.imageWidth || '100%',
        height: props.imageHeight || 'auto',
        maxWidth: props.maxWidth || '100%',
        maxHeight: props.maxHeight || 'none',
        border: props.border || 'none',
        borderRadius: props.borderRadius || '4px',
        cursor: 'pointer'
      }

      return React.createElement('div', {
        id: props.customId || undefined,
        className: props.customClass || undefined,
        style: containerStyle
      }, images.map((image: { src: string; alt: string; caption?: string; linkUrl?: string }, index: number) => {
        const imageElement = React.createElement('img', {
          src: image.src,
          alt: image.alt,
          style: imageStyle
        })

        const wrappedImage = image.linkUrl ?
          React.createElement('a', {
            href: image.linkUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
            style: { display: 'inline-block' }
          }, imageElement) :
          imageElement

        return React.createElement('div', { key: index }, [
          wrappedImage,
          image.caption && React.createElement('p', {
            style: {
              margin: '5px 0 0 0',
              fontSize: '14px',
              textAlign: 'center',
              color: '#666'
            }
          }, image.caption)
        ].filter(Boolean))
      }))
    }
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
    defaultProps: {
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      type: 'youtube',
      width: '100%',
      height: '315px',
      autoplay: false,
      controls: true
    },
    schema: {
      properties: {
        src: {
          type: 'text',
          label: 'Video URL',
          default: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        type: {
          type: 'select',
          label: 'Video Type',
          default: 'youtube',
          options: ['youtube', 'vimeo', 'direct']
        },
        width: {
          type: 'text',
          label: 'Width',
          default: '100%'
        },
        height: {
          type: 'text',
          label: 'Height',
          default: '315px'
        },
        autoplay: {
          type: 'toggle',
          label: 'Autoplay',
          default: false
        },
        controls: {
          type: 'toggle',
          label: 'Show Controls',
          default: true
        }
      }
    },
    render: (props) => {
      const getEmbedUrl = () => {
        let url = props.src || 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        if (props.type === 'youtube' && url.includes('youtube.com/watch')) {
          const videoId = url.split('v=')[1]?.split('&')[0]
          url = `https://www.youtube.com/embed/${videoId}`
        } else if (props.type === 'vimeo' && url.includes('vimeo.com/')) {
          const videoId = url.split('/').pop()
          url = `https://player.vimeo.com/video/${videoId}`
        }
        if (props.autoplay) {
          url += (url.includes('?') ? '&' : '?') + 'autoplay=1'
        }
        return url
      }

      return React.createElement('div', {
        style: { position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }
      }, React.createElement('iframe', {
        src: getEmbedUrl(),
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: props.width || '100%',
          height: props.height || '315px',
          border: 0
        },
        allow: props.autoplay ? 'autoplay; encrypted-media' : 'encrypted-media',
        allowFullScreen: true
      }))
    }
  })
}

function registerIconComponent(): void {
  componentRegistry.register({
    id: 'icon',
    name: 'Icon',
    type: 'icon',
    category: 'media',
    icon: 'FaStar',
    description: 'Display icons from icon libraries or upload custom SVGs with full styling control',
    defaultProps: {
      name: 'star',
      library: 'fa',
      customSvg: '',
      size: '24px',
      width: '24px',
      height: '24px',
      color: '#000000',
      fillColor: '#000000',
      strokeColor: 'transparent',
      strokeWidth: '0px',
      alignment: 'left',
      rotation: '0deg',
      padding: '0px',
      margin: '0px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0px',
      opacity: '1',
      linkUrl: '',
      openInNewTab: false,
      customClass: '',
      customId: '',
      hoverColor: '',
      hoverScale: '1',
      animation: 'none',
      animationDuration: '0.3s'
    },
    schema: {
      properties: {
        name: {
          type: 'text',
          label: 'Icon Name',
          default: 'star'
        },
        library: {
          type: 'select',
          label: 'Icon Library',
          default: 'fa',
          options: ['fa', 'material', 'heroicons', 'custom']
        },
        customSvg: {
          type: 'textarea',
          label: 'Custom SVG Code',
          default: ''
        },
        size: {
          type: 'text',
          label: 'Size',
          default: '24px'
        },
        width: {
          type: 'text',
          label: 'Width',
          default: '24px'
        },
        height: {
          type: 'text',
          label: 'Height',
          default: '24px'
        },
        textColor: {
          type: 'color',
          label: 'Color',
          default: '#000000'
        },
        fillColor: {
          type: 'color',
          label: 'Fill Color',
          default: '#000000'
        },
        strokeColor: {
          type: 'color',
          label: 'Stroke Color',
          default: 'transparent'
        },
        strokeWidth: {
          type: 'text',
          label: 'Stroke Width',
          default: '0px'
        },
        alignment: {
          type: 'select',
          label: 'Alignment',
          default: 'left',
          options: ['left', 'center', 'right']
        },
        rotation: {
          type: 'text',
          label: 'Rotation (deg)',
          default: '0deg'
        },
        padding: {
          type: 'text',
          label: 'Padding',
          default: '0px'
        },
        margin: {
          type: 'text',
          label: 'Margin',
          default: '0px'
        },
        backgroundColor: {
          type: 'color',
          label: 'Background Color',
          default: 'transparent'
        },
        border: {
          type: 'text',
          label: 'Border',
          default: 'none'
        },
        borderRadius: {
          type: 'text',
          label: 'Border Radius',
          default: '0px'
        },
        opacity: {
          type: 'text',
          label: 'Opacity',
          default: '1'
        },
        linkUrl: {
          type: 'text',
          label: 'Link URL',
          default: ''
        },
        openInNewTab: {
          type: 'toggle',
          label: 'Open in New Tab',
          default: false
        },
        customClass: {
          type: 'text',
          label: 'Custom CSS Class',
          default: ''
        },
        customId: {
          type: 'text',
          label: 'Custom ID',
          default: ''
        },
        hoverColor: {
          type: 'color',
          label: 'Hover Color',
          default: ''
        },
        hoverScale: {
          type: 'text',
          label: 'Hover Scale',
          default: '1'
        },
        animation: {
          type: 'select',
          label: 'Animation',
          default: 'none',
          options: ['none', 'bounce', 'pulse', 'spin', 'fade']
        },
        animationDuration: {
          type: 'text',
          label: 'Animation Duration',
          default: '0.3s'
        }
      }
    },
    render: (props) => {
      const iconStyle: React.CSSProperties = {
        fontSize: props.size || '24px',
        width: props.width || props.size || '24px',
        height: props.height || props.size || '24px',
        color: props.color || props.fillColor || '#000000',
        fill: props.fillColor || props.color || '#000000',
        stroke: props.strokeColor || 'transparent',
        strokeWidth: props.strokeWidth || '0px',
        padding: props.padding || '0px',
        margin: props.margin || '0px',
        backgroundColor: props.backgroundColor || 'transparent',
        border: props.border || 'none',
        borderRadius: props.borderRadius || '0px',
        opacity: props.opacity || '1',
        transform: `rotate(${props.rotation || '0deg'}) scale(${props.hoverScale || '1'})`,
        transition: `all ${props.animationDuration || '0.3s'} ease`,
        display: 'inline-block',
        textAlign: props.alignment || 'left',
        cursor: props.linkUrl ? 'pointer' : 'default'
      }

      // Add hover styles
      const hoverStyle = props.hoverColor ? {
        ':hover': {
          color: props.hoverColor,
          fill: props.hoverColor
        }
      } : {}

      // Animation classes
      const animationClass = props.animation && props.animation !== 'none' ? `animate-${props.animation}` : ''

      let iconElement: JSX.Element

      if (props.library === 'custom' && props.customSvg) {
        // Render custom SVG
        iconElement = React.createElement('div', {
          id: props.customId || undefined,
          className: `${props.customClass || ''} ${animationClass}`.trim(),
          style: iconStyle,
          dangerouslySetInnerHTML: { __html: props.customSvg }
        })
      } else {
        // Render from library
        const className = `fa fa-${props.name || 'star'} ${props.customClass || ''} ${animationClass}`.trim()
        iconElement = React.createElement('i', {
          id: props.customId || undefined,
          className,
          style: iconStyle
        })
      }

      // Wrap in link if URL provided
      if (props.linkUrl) {
        return React.createElement('a', {
          href: props.linkUrl,
          target: props.openInNewTab ? '_blank' : '_self',
          rel: props.openInNewTab ? 'noopener noreferrer' : undefined,
          style: { display: 'inline-block' }
        }, iconElement)
      }

      return iconElement
    }
  })
}

// Placeholder implementations for remaining components
function registerDividerComponent(): void {
  componentRegistry.register({
    id: 'divider',
    name: 'Divider',
    type: 'divider',
    category: 'media',
    icon: 'FaMinus',
    description: 'Horizontal divider line with styling options',
    defaultProps: {
      thickness: '1px',
      color: '#cccccc',
      width: '100%',
      margin: '20px 0',
      style: 'solid'
    },
    schema: {
      properties: {
        thickness: {
          type: 'text',
          label: 'Thickness',
          default: '1px'
        },
        color: {
          type: 'color',
          label: 'Color',
          default: '#cccccc'
        },
        width: {
          type: 'text',
          label: 'Width',
          default: '100%'
        },
        margin: {
          type: 'text',
          label: 'Margin',
          default: '20px 0'
        },
        style: {
          type: 'select',
          label: 'Line Style',
          default: 'solid',
          options: ['solid', 'dashed', 'dotted']
        }
      }
    },
    render: (props) => React.createElement('hr', {
      style: {
        border: 'none',
        borderTop: `${props.thickness || '1px'} ${props.style || 'solid'} ${props.color || '#cccccc'}`,
        width: props.width || '100%',
        margin: props.margin || '20px 0'
      }
    })
  })
}

function registerFormComponent(): void {
  componentRegistry.register({
    id: 'form',
    name: 'Form',
    type: 'form',
    category: 'interactive',
    icon: 'FaWpforms',
    description: 'Contact form with customizable fields',
    defaultProps: {
      fields: [
        { type: 'text', label: 'Name', required: true },
        { type: 'email', label: 'Email', required: true },
        { type: 'textarea', label: 'Message', required: true }
      ],
      submitText: 'Submit',
      submitUrl: '#'
    },
    schema: {
      properties: {
        fields: {
          type: 'textarea',
          label: 'Form Fields (JSON)',
          default: '[{"type": "text", "label": "Name", "required": true}, {"type": "email", "label": "Email", "required": true}, {"type": "textarea", "label": "Message", "required": true}]'
        },
        submitText: {
          type: 'text',
          label: 'Submit Button Text',
          default: 'Submit'
        },
        submitUrl: {
          type: 'text',
          label: 'Submit URL',
          default: '#'
        }
      }
    },
    render: (props) => {
      const fields = Array.isArray(props.fields) ? props.fields : [
        { type: 'text', label: 'Name', required: true },
        { type: 'email', label: 'Email', required: true },
        { type: 'textarea', label: 'Message', required: true }
      ]

      return React.createElement('form', {
        action: props.submitUrl || '#',
        method: 'POST',
        style: { maxWidth: '500px', margin: '0 auto' }
      }, [
        ...fields.map((field: any, index: number) => {
          const inputProps = {
            type: field.type || 'text',
            name: field.label.toLowerCase().replace(' ', '_'),
            placeholder: field.label,
            required: field.required || false,
            style: {
              width: '100%',
              padding: '8px',
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }
          }

          if (field.type === 'textarea') {
            return React.createElement('textarea', {
              ...inputProps,
              rows: 4
            })
          }

          return React.createElement('input', inputProps)
        }),
        React.createElement('button', {
          type: 'submit',
          style: {
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }
        }, props.submitText || 'Submit')
      ])
    }
  })
}

function registerAccordionComponent(): void {
  componentRegistry.register({
    id: 'accordion',
    name: 'Advanced Accordion',
    type: 'accordion',
    category: 'interactive',
    icon: 'FaChevronDown',
    description: 'Fully customizable accordion with animations, accessibility, and dynamic content support',
    defaultProps: {
      items: '[{"id": "item-1", "title": "Section 1", "content": "Content for section 1", "iconBefore": "", "iconAfter": "", "expanded": false}, {"id": "item-2", "title": "Section 2", "content": "Content for section 2", "iconBefore": "", "iconAfter": "", "expanded": false}]',
      allowMultipleOpen: false,
      backgroundColor: '#ffffff',
      textColor: '#333333',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '0px',
      margin: '16px 0px',
      animationType: 'slide',
      animationDuration: 300,
      multiExpandMode: false,
      exclusiveMode: true,
      startCollapsed: true,
      interactionMode: 'click',
      ariaLabel: 'Accordion',
      ariaExpanded: true,
      ariaControls: true,
      tabIndex: 0,
      role: 'accordion',
      customCSS: '',
      customId: '',
      componentVisibility: true,
      searchFilter: false,
      nestedAccordion: false,
      persistentState: false,
      analytics: false
    },
    schema: {
      properties: {
        items: {
          type: 'textarea',
          label: 'Accordion Items (JSON)',
          default: '[{"id": "item-1", "title": "Section 1", "content": "Content for section 1", "iconBefore": "", "iconAfter": "", "expanded": false}, {"id": "item-2", "title": "Section 2", "content": "Content for section 2", "iconBefore": "", "iconAfter": "", "expanded": false}]'
        },
        allowMultipleOpen: {
          type: 'toggle',
          label: 'Allow Multiple Open',
          default: false
        },
        backgroundColor: {
          type: 'color',
          label: 'Background Color',
          default: '#ffffff'
        },
        textColor: {
          type: 'color',
          label: 'Text Color',
          default: '#333333'
        },
        border: {
          type: 'text',
          label: 'Border',
          default: '1px solid #e5e7eb'
        },
        borderRadius: {
          type: 'text',
          label: 'Border Radius',
          default: '8px'
        },
        padding: {
          type: 'text',
          label: 'Padding',
          default: '0px'
        },
        margin: {
          type: 'text',
          label: 'Margin',
          default: '16px 0px'
        },
        animationType: {
          type: 'select',
          label: 'Animation Type',
          default: 'slide',
          options: ['slide', 'fade', 'scale', 'bounce', 'none']
        },
        animationDuration: {
          type: 'number',
          label: 'Animation Duration (ms)',
          default: 300,
          min: 0,
          max: 2000,
          step: 50
        },
        multiExpandMode: {
          type: 'toggle',
          label: 'Multi Expand Mode',
          default: false
        },
        exclusiveMode: {
          type: 'toggle',
          label: 'Exclusive Mode',
          default: true
        },
        startCollapsed: {
          type: 'toggle',
          label: 'Start Collapsed',
          default: true
        },
        interactionMode: {
          type: 'select',
          label: 'Interaction Mode',
          default: 'click',
          options: ['click', 'hover']
        },
        ariaLabel: {
          type: 'text',
          label: 'Aria Label',
          default: 'Accordion'
        },
        ariaExpanded: {
          type: 'toggle',
          label: 'Aria Expanded',
          default: true
        },
        ariaControls: {
          type: 'toggle',
          label: 'Aria Controls',
          default: true
        },
        tabIndex: {
          type: 'number',
          label: 'Tab Index',
          default: 0,
          min: -1,
          max: 100
        },
        role: {
          type: 'select',
          label: 'Role',
          default: 'accordion',
          options: ['accordion', 'button', 'region']
        },
        customCSS: {
          type: 'textarea',
          label: 'Custom CSS',
          default: ''
        },
        customId: {
          type: 'text',
          label: 'Custom ID',
          default: ''
        },
        componentVisibility: {
          type: 'toggle',
          label: 'Component Visibility',
          default: true
        },
        searchFilter: {
          type: 'toggle',
          label: 'Search/Filter',
          default: false
        },
        nestedAccordion: {
          type: 'toggle',
          label: 'Nested Accordion',
          default: false
        },
        persistentState: {
          type: 'toggle',
          label: 'Persistent State',
          default: false
        },
        analytics: {
          type: 'toggle',
          label: 'Analytics Tracking',
          default: false
        }
      }
    },
    render: (props: any) => {
      // Basic accordion implementation for backward compatibility
      let items = []
      try {
        items = JSON.parse(props.items || '[]')
      } catch (e) {
        items = [
          { title: 'Section 1', content: 'Content for section 1' },
          { title: 'Section 2', content: 'Content for section 2' }
        ]
      }

      return React.createElement('div', {
        id: props.customId || undefined,
        style: {
          border: props.border || '1px solid #ccc',
          borderRadius: props.borderRadius || '4px',
          backgroundColor: props.backgroundColor || '#ffffff',
          color: props.textColor || '#333333',
          padding: props.padding || '0px',
          margin: props.margin || '16px 0px'
        }
      }, items.map((item: any, index: number) =>
        React.createElement('div', { key: index }, [
          React.createElement('button', {
            style: {
              width: '100%',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer'
            }
          }, item.title || `Section ${index + 1}`),
          React.createElement('div', {
            style: { padding: '10px', borderTop: '1px solid #eee' }
          }, item.content || 'Content')
        ])
      ))
    }
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
    defaultProps: {
      tabs: [
        { title: 'Tab 1', content: 'Content for tab 1' },
        { title: 'Tab 2', content: 'Content for tab 2' }
      ]
    },
    schema: {
      properties: {
        tabs: {
          type: 'textarea',
          label: 'Tabs (JSON)',
          default: '[{"title": "Tab 1", "content": "Content for tab 1"}, {"title": "Tab 2", "content": "Content for tab 2"}]'
        }
      }
    },
    render: (props) => {
      const tabs = Array.isArray(props.tabs) ? props.tabs : [
        { title: 'Tab 1', content: 'Content for tab 1' },
        { title: 'Tab 2', content: 'Content for tab 2' }
      ]

      return React.createElement('div', {}, [
        React.createElement('div', {
          style: { display: 'flex', borderBottom: '1px solid #ccc' }
        }, tabs.map((tab: any, index: number) =>
          React.createElement('button', {
            key: index,
            style: {
              padding: '10px 20px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderBottom: '2px solid transparent'
            }
          }, tab.title || `Tab ${index + 1}`)
        )),
        React.createElement('div', {
          style: { padding: '20px' }
        }, tabs[0]?.content || 'Content')
      ])
    }
  })
}

function registerModalTriggerComponent(): void {
  componentRegistry.register({
    id: 'modal-trigger',
    name: 'Modal Trigger',
    type: 'modal-trigger',
    category: 'interactive',
    icon: 'FaWindowMaximize',
    description: 'Button that opens a modal dialog',
    defaultProps: {
      buttonText: 'Open Modal',
      modalTitle: 'Modal Title',
      modalContent: 'Modal content goes here',
      buttonStyle: 'primary'
    },
    schema: {
      properties: {
        buttonText: {
          type: 'text',
          label: 'Button Text',
          default: 'Open Modal'
        },
        modalTitle: {
          type: 'text',
          label: 'Modal Title',
          default: 'Modal Title'
        },
        modalContent: {
          type: 'textarea',
          label: 'Modal Content',
          default: 'Modal content goes here'
        },
        buttonStyle: {
          type: 'select',
          label: 'Button Style',
          default: 'primary',
          options: ['primary', 'secondary', 'outline']
        }
      }
    },
    render: (props) => React.createElement('button', {
      style: {
        padding: '10px 20px',
        backgroundColor: props.buttonStyle === 'secondary' ? '#6b7280' : props.buttonStyle === 'outline' ? 'transparent' : '#3b82f6',
        color: props.buttonStyle === 'outline' ? '#3b82f6' : 'white',
        border: props.buttonStyle === 'outline' ? '2px solid #3b82f6' : 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }
    }, props.buttonText || 'Open Modal')
  })
}

function registerScrollerComponent(): void {
  componentRegistry.register({
    id: 'scroller',
    name: 'Scroller',
    type: 'scroller',
    category: 'interactive',
    icon: 'FaArrowUp',
    description: 'Scroll to top button',
    defaultProps: {
      text: '↑',
      position: 'bottom-right',
      size: 'medium'
    },
    schema: {
      properties: {
        text: {
          type: 'text',
          label: 'Button Text',
          default: '↑'
        },
        position: {
          type: 'select',
          label: 'Position',
          default: 'bottom-right',
          options: ['bottom-right', 'bottom-left', 'top-right', 'top-left']
        },
        size: {
          type: 'select',
          label: 'Size',
          default: 'medium',
          options: ['small', 'medium', 'large']
        }
      }
    },
    render: (props) => React.createElement('button', {
      style: {
        position: 'fixed',
        bottom: props.position.includes('bottom') ? '20px' : 'auto',
        top: props.position.includes('top') ? '20px' : 'auto',
        right: props.position.includes('right') ? '20px' : 'auto',
        left: props.position.includes('left') ? '20px' : 'auto',
        width: props.size === 'small' ? '40px' : props.size === 'large' ? '60px' : '50px',
        height: props.size === 'small' ? '40px' : props.size === 'large' ? '60px' : '50px',
        borderRadius: '50%',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: props.size === 'small' ? '16px' : props.size === 'large' ? '24px' : '20px'
      },
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' })
    }, props.text || '↑')
  })
}

// Layout Components
function registerSpacerComponent(): void {
  componentRegistry.register({
    id: 'spacer',
    name: 'Spacer',
    type: 'spacer',
    category: 'layout',
    icon: 'FaArrowsAltV',
    description: 'Add vertical spacing between elements',
    defaultProps: {
      height: '20px'
    },
    schema: {
      properties: {
        height: {
          type: 'text',
          label: 'Height',
          default: '20px'
        }
      }
    },
    render: (props) => React.createElement('div', {
      style: { height: props.height || '20px' }
    })
  })
}

function registerContainerComponent(): void {
  componentRegistry.register({
    id: 'container',
    name: 'Container',
    type: 'container',
    category: 'layout',
    icon: 'FaSquare',
    description: 'Container with max width and centering',
    defaultProps: {
      maxWidth: '1200px',
      padding: '20px',
      margin: '0 auto',
      backgroundColor: 'transparent'
    },
    schema: {
      properties: {
        maxWidth: {
          type: 'text',
          label: 'Max Width',
          default: '1200px'
        },
        padding: {
          type: 'text',
          label: 'Padding',
          default: '20px'
        },
        margin: {
          type: 'text',
          label: 'Margin',
          default: '0 auto'
        },
        backgroundColor: {
          type: 'color',
          label: 'Background Color',
          default: 'transparent'
        }
      }
    },
    render: (props) => React.createElement('div', {
      style: {
        maxWidth: props.maxWidth || '1200px',
        margin: props.margin || '0 auto',
        padding: props.padding || '20px',
        backgroundColor: props.backgroundColor || 'transparent'
      }
    }, 'Container content goes here')
  })
}

function registerGridComponent(): void {
  componentRegistry.register({
    id: 'grid',
    name: 'Grid',
    type: 'grid',
    category: 'layout',
    icon: 'FaTh',
    description: 'CSS Grid layout container',
    defaultProps: {
      columns: 3,
      gap: '10px',
      minColumnWidth: '200px'
    },
    schema: {
      properties: {
        columns: {
          type: 'number',
          label: 'Columns',
          default: 3
        },
        gap: {
          type: 'text',
          label: 'Gap',
          default: '10px'
        },
        minColumnWidth: {
          type: 'text',
          label: 'Min Column Width',
          default: '200px'
        }
      }
    },
    render: (props) => React.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${props.minColumnWidth || '200px'}, 1fr))`,
        gap: props.gap || '10px'
      }
    }, 'Grid content goes here')
  })
}

function registerFlexBoxComponent(): void {
  componentRegistry.register({
    id: 'flexbox',
    name: 'Flexbox',
    type: 'flexbox',
    category: 'layout',
    icon: 'FaAlignJustify',
    description: 'Flexbox layout container',
    defaultProps: {
      direction: 'row',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      gap: '10px',
      wrap: false
    },
    schema: {
      properties: {
        direction: {
          type: 'select',
          label: 'Direction',
          default: 'row',
          options: ['row', 'column', 'row-reverse', 'column-reverse']
        },
        justifyContent: {
          type: 'select',
          label: 'Justify Content',
          default: 'flex-start',
          options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly']
        },
        alignItems: {
          type: 'select',
          label: 'Align Items',
          default: 'stretch',
          options: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline']
        },
        gap: {
          type: 'text',
          label: 'Gap',
          default: '10px'
        },
        wrap: {
          type: 'toggle',
          label: 'Wrap',
          default: false
        }
      }
    },
    render: (props) => React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: props.direction || 'row',
        justifyContent: props.justifyContent || 'flex-start',
        alignItems: props.alignItems || 'stretch',
        gap: props.gap || '10px',
        flexWrap: props.wrap ? 'wrap' : 'nowrap'
      }
    }, 'Flexbox content goes here')
  })
}

// Card component schema and default props
const cardSchema = {
  properties: {
    image: {
      type: 'image',
      label: 'Card Image',
      default: 'https://via.placeholder.com/300x200?text=Card+Image'
    },
    title: {
      type: 'text',
      label: 'Title',
      default: 'Elegant Modern Design'
    },
    description: {
      type: 'textarea',
      label: 'Description',
      default: 'A reusable, editable card component with full live sync'
    },
    buttonText: {
      type: 'text',
      label: 'Button Text',
      default: 'Learn More'
    },
    buttonLink: {
      type: 'url',
      label: 'Button Link',
      default: '#'
    },
    backgroundColor: {
      type: 'color',
      label: 'Background Color',
      default: '#ffffff'
    },
    borderRadius: {
      type: 'range',
      label: 'Border Radius',
      min: 0,
      max: 40,
      default: 8
    },
    shadow: {
      type: 'select',
      label: 'Shadow',
      options: ['none', 'sm', 'md', 'lg'],
      default: 'md'
    }
  }
}

const cardDefaultProps = {
  image: 'https://via.placeholder.com/300x200?text=Card+Image',
  title: 'Elegant Modern Design',
  description: 'A reusable, editable card component with full live sync',
  buttonText: 'Learn More',
  buttonLink: '#',
  backgroundColor: '#ffffff',
  borderRadius: 8,
  shadow: 'md'
}

const CardComponent = (props: any) => {
  // Merge props with defaultProps to ensure defaults are always applied
  const mergedProps = { ...cardDefaultProps, ...props }

  const getShadowClass = (shadow: string) => {
    switch (shadow) {
      case 'none': return 'shadow-none'
      case 'sm': return 'shadow-sm'
      case 'md': return 'shadow-md'
      case 'lg': return 'shadow-lg'
      default: return 'shadow-md'
    }
  }

  return React.createElement('div', {
    className: `p-4 rounded-lg ${getShadowClass(mergedProps.shadow)} text-center`,
    style: {
      backgroundColor: mergedProps.backgroundColor,
      borderRadius: `${mergedProps.borderRadius}px`
    }
  }, [
    mergedProps.image && React.createElement('img', {
      key: 'image',
      src: mergedProps.image,
      alt: getDisplayValue(mergedProps.title),
      className: 'w-full h-48 object-cover rounded-md mb-3'
    }),
    React.createElement('h3', {
      key: 'title',
      className: 'text-xl font-semibold mb-2'
    }, getDisplayValue(mergedProps.title)),
    React.createElement('p', {
      key: 'description',
      className: 'text-gray-600 mb-3'
    }, getDisplayValue(mergedProps.description)),
    mergedProps.buttonText && React.createElement('a', {
      key: 'button',
      href: getDisplayValue(mergedProps.buttonLink),
      className: 'inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'
    }, getDisplayValue(mergedProps.buttonText))
  ].filter(Boolean))
}

CardComponent.defaultProps = cardDefaultProps

function registerCardComponent(): void {
  componentRegistry.register({
    id: 'card',
    name: 'Card',
    type: 'card',
    category: 'content',
    icon: 'FaSquare',
    description: 'A reusable, editable card component with full live sync',
    defaultProps: cardDefaultProps,
    schema: cardSchema,
    render: CardComponent
  })
}

function registerAdvancedCardComponent(): void {
  componentRegistry.register({
    id: 'advancedCard',
    name: 'Advanced Card',
    type: 'advancedCard',
    category: 'content',
    icon: 'FaSquare',
    description: 'Advanced card component with full property editing, live sync, and customizable layout',
    defaultProps: advancedCardDefaultProps,
    schema: advancedCardSchema,
    render: (props: any) => React.createElement(AdvancedCardComponent, props)
  })
}

function registerImageComponent(): void {
  componentRegistry.register({
    id: 'image',
    name: 'Image',
    type: 'image',
    category: 'media',
    icon: 'FaImage',
    description: 'Display images with advanced styling and interaction options',
    defaultProps: {
      src: 'https://via.placeholder.com/400x300?text=Click+to+upload',
      alt: 'Image',
      title: '',
      caption: '',
      linkUrl: '',
      openInNewTab: false,
      lazyLoading: true,
      tooltip: '',
      width: '100%',
      height: 'auto',
      autoSize: true,
      aspectRatio: 'auto',
      objectFit: 'cover',
      objectPosition: 'center',
      responsiveControls: true,
      autoHeight: false,
      borderRadius: '0px',
      borderColor: 'transparent',
      borderWidth: '0px',
      borderStyle: 'solid',
      boxShadow: 'none',
      backgroundOverlay: 'transparent',
      opacity: 1,
      blendMode: 'normal',
      filter: 'none',
      hoverZoom: 1,
      hoverLift: false,
      hoverGlow: false,
      hoverFade: false,
      hoverTilt: false,
      hoverTransitionDuration: 300,
      hoverOverlay: false,
      hoverOverlayText: '',
      hoverOverlayIcon: '',
      alignment: 'left',
      margin: '20px 0px',
      padding: '0px',
      zIndex: 0,
      positioning: 'static',
      layerOrder: 0,
      gradientOverlay: false,
      gradientStart: '#000000',
      gradientEnd: '#ffffff',
      gradientDirection: 'to bottom',
      patternOverlay: '',
      glassmorphism: false,
      neumorphism: false,
      duotoneFilter: false,
      duotoneLight: '#ffffff',
      duotoneDark: '#000000',
      backgroundVideo: '',
      dataBinding: '',
      conditionalVisibility: '',
      galleryMode: false,
      lightbox: false,
      preload: false,
      fallbackImage: '',
      responsiveSources: [],
      ariaLabel: '',
      ariaDescribedBy: '',
      altAutoGenerate: false,
      lazyLoadFade: true,
      entranceAnimation: 'fadeIn',
      animationDelay: 0,
      animationDuration: 600,
      animationEasing: 'easeOut',
      hoverAnimation: 'none',
      parallaxScroll: false,
      customCSS: '',
      stylePresets: [],
      undoRedo: true,
      copyPaste: true,
      visibility: true,
      lock: false,
      aiEnhancement: false,
      backgroundRemoval: false,
      colorPalette: false,
      cdnOptimization: true,
      nextImageOptimization: true
    },
    schema: imageComponentSchema,
    render: (props) => React.createElement(ImageComponent, props)
  })
}

function registerAdvancedSliderComponent(): void {
  componentRegistry.register({
    id: 'advancedSlider',
    name: 'Advanced Slider',
    type: 'advancedSlider',
    category: 'advanced',
    icon: 'FaImages',
    description: 'Advanced slider component with full property editing, live sync, and customizable layout',
    defaultProps: advancedSliderDefaultProps,
    schema: advancedSliderSchema,
    render: (props: any) => React.createElement(AdvancedSliderComponent, props)
  })
}
