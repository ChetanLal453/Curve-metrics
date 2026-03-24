"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react';
import SafeHtml from '@/components/SafeHtml';
import { sanitizeHtml } from '@/lib/sanitize-markup';

interface AdvancedHeadingProps {
  // Content
  text?: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  // Semantic Structure
  semanticLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  ariaLevel?: number;
  ariaLabel?: string;
  role?: string;
  autoId?: boolean;
  customId?: string;
  myNewProp?: string;
  
  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontSizeMobile?: string;
  fontSizeTablet?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  
  // Colors
  color?: string;
  hoverColor?: string;
  
  // Alignment & Layout
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textAlignMobile?: 'left' | 'center' | 'right';
  textAlignTablet?: 'left' | 'center' | 'right';
  maxWidth?: string;
  
  // Spacing
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  
  // Advanced
  className?: string;
  dataTracking?: string;
  enableSeoChecks?: boolean;
  seoMaxLength?: number;
  
  // Interactive
  onSeoWarning?: (warnings: string[]) => void;
  componentId?: string;
  
  [key: string]: any;
}

const AdvancedHeading: React.FC<AdvancedHeadingProps> = ({
  text = 'Advanced Heading',
  level = 'h2',
  semanticLevel,
  ariaLevel,
  ariaLabel,
  role = 'heading',
  autoId = true,
  customId,
  myNewProp,
  fontFamily = 'system-ui, sans-serif',
  fontSize = '',
  fontSizeMobile = '',
  fontSizeTablet = '',
  fontWeight = '700',
  lineHeight = '1.2',
  letterSpacing = '0px',
  textTransform = 'none',
  color = '#000000',
  hoverColor = '#0056b3',
  textAlign = 'left',
  textAlignMobile = 'center',
  textAlignTablet = 'left',
  maxWidth = '100%',
  marginTop = '0',
  marginRight = '0',
  marginBottom = '16px',
  marginLeft = '0',
  paddingTop = '0',
  paddingRight = '0',
  paddingBottom = '0',
  paddingLeft = '0',
  className = '',
  dataTracking = '',
  enableSeoChecks = false,
  seoMaxLength = 60,
  onSeoWarning,
  componentId,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const previousWarningsRef = useRef<string[]>([]);
  const domProps = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(props).filter(([key]) => key.startsWith('data-') || key.startsWith('aria-') || key === 'title'),
      ),
    [props],
  );

  // Generate auto ID if enabled
  const generatedId = useMemo(() => {
    return autoId && componentId ? `heading-${componentId}` : customId;
  }, [autoId, componentId, customId]);

  // 🆕 DYNAMIC FONT SIZE CALCULATION
  const getLevelBasedFontSize = (headingLevel: string) => {
    const sizeMap: Record<string, string> = {
      'h1': '2.5em',
      'h2': '2em',
      'h3': '1.75em',
      'h4': '1.5em',
      'h5': '1.25em',
      'h6': '1em'
    };
    
    return sizeMap[headingLevel] || '2em';
  };

  const getLevelBasedFontSizeMobile = (headingLevel: string) => {
    const sizeMap: Record<string, string> = {
      'h1': '2em',
      'h2': '1.75em',
      'h3': '1.5em',
      'h4': '1.25em',
      'h5': '1.125em',
      'h6': '1em'
    };
    
    return sizeMap[headingLevel] || '1.75em';
  };

  const getLevelBasedFontSizeTablet = (headingLevel: string) => {
    const sizeMap: Record<string, string> = {
      'h1': '2.25em',
      'h2': '2em',
      'h3': '1.625em',
      'h4': '1.375em',
      'h5': '1.1875em',
      'h6': '1em'
    };
    
    return sizeMap[headingLevel] || '2em';
  };

  // 🆕 Use level-based font sizes if no explicit fontSize is provided
  const effectiveFontSize = useMemo(() => {
    return fontSize || getLevelBasedFontSize(level);
  }, [fontSize, level]);

  const effectiveFontSizeMobile = useMemo(() => {
    return fontSizeMobile || getLevelBasedFontSizeMobile(level);
  }, [fontSizeMobile, level]);

  const effectiveFontSizeTablet = useMemo(() => {
    return fontSizeTablet || getLevelBasedFontSizeTablet(level);
  }, [fontSizeTablet, level]);

  // FIX: Use level for both semantic and visual
  const effectiveLevel = useMemo(() => {
    return level;
  }, [level]);

  // Memoized styles
  const headingStyle: React.CSSProperties = useMemo(() => ({
    fontFamily,
    fontSize: effectiveFontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    textTransform,
    color: isHovered ? hoverColor : color,
    textAlign,
    maxWidth,
    margin: `${marginTop} ${marginRight} ${marginBottom} ${marginLeft}`,
    padding: `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`,
    transition: 'all 0.2s ease',
    display: 'block',
    width: '100%'
  }), [
    fontFamily, effectiveFontSize, fontWeight, lineHeight, letterSpacing, textTransform,
    isHovered, hoverColor, color, textAlign, maxWidth,
    marginTop, marginRight, marginBottom, marginLeft,
    paddingTop, paddingRight, paddingBottom, paddingLeft
  ]);

  // Use the effective level for the HTML tag
  const Tag = effectiveLevel as keyof JSX.IntrinsicElements;

  const ariaProps: any = {};
  if (ariaLevel) ariaProps['aria-level'] = ariaLevel;
  if (ariaLabel) ariaProps['aria-label'] = ariaLabel;
  if (role) ariaProps.role = role;

  // SEO Validation - Fixed version
  useEffect(() => {
    if (!enableSeoChecks) return;

    const warnings: string[] = [];

    try {
      // Check heading length
      const cleanText = text?.replace(/<[^>]*>/g, '') || '';
      if (cleanText.length > seoMaxLength) {
        warnings.push(`Heading is ${cleanText.length} characters (recommended: ≤${seoMaxLength})`);
      }

      // Check if heading is empty
      if (!cleanText.trim()) {
        warnings.push('Heading text is empty');
      }

      // Check semantic level vs visual level
      if (semanticLevel && semanticLevel !== level) {
        warnings.push(`Semantic level (${semanticLevel}) doesn't match visual level (${level})`);
      }

      // Only update if warnings actually changed
      const warningsChanged = JSON.stringify(warnings) !== JSON.stringify(previousWarningsRef.current);
      
      if (warningsChanged) {
        previousWarningsRef.current = warnings;
        onSeoWarning?.(warnings);
      }
    } catch (error) {
      console.warn('SEO check error:', error);
    }
  }, [text, level, semanticLevel, enableSeoChecks, seoMaxLength, onSeoWarning]);

  // Render content safely
  const renderContent = () => {
    if (!text) return 'Advanced Heading';
    
    // Security: sanitize heading markup before rendering rich text content.
    if (/<[^>]*>/.test(text)) {
      return sanitizeHtml(text);
    }
    
    // Otherwise, just return plain text
    return text;
  };

  const content = renderContent();
  const isHtmlContent = typeof content === 'string' && /<[^>]*>/.test(content);

  return (
    <div className="advanced-heading-container">
      {/* Main Heading */}
      {isHtmlContent ? (
        <SafeHtml
          html={content}
          tagName={Tag}
          id={generatedId}
          className={`advanced-heading ${className}`}
          style={headingStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          data-tracking={dataTracking || undefined}
          {...ariaProps}
          {...domProps}
        />
      ) : (
        <Tag
          id={generatedId}
          className={`advanced-heading ${className}`}
          style={headingStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          data-tracking={dataTracking || undefined}
          {...ariaProps}
          {...domProps}
        >
          {content}
        </Tag>
      )}

      {/* Responsive CSS */}
      <style jsx>{`
        .advanced-heading-container {
          width: 100%;
        }
        
        /* Ensure heading tags have proper default styles */
        .advanced-heading {
          margin: 0;
          padding: 0;
          font-weight: inherit;
          line-height: inherit;
          letter-spacing: inherit;
          text-transform: inherit;
        }
        
        /* 🆕 Default heading sizes as CSS fallback */
        .advanced-heading.h1,
        h1.advanced-heading {
          font-size: 2.5em !important;
        }
        
        .advanced-heading.h2,
        h2.advanced-heading {
          font-size: 2em !important;
        }
        
        .advanced-heading.h3,
        h3.advanced-heading {
          font-size: 1.75em !important;
        }
        
        .advanced-heading.h4,
        h4.advanced-heading {
          font-size: 1.5em !important;
        }
        
        .advanced-heading.h5,
        h5.advanced-heading {
          font-size: 1.25em !important;
        }
        
        .advanced-heading.h6,
        h6.advanced-heading {
          font-size: 1em !important;
        }
        
        /* Mobile styles */
        @media (max-width: 768px) {
          .advanced-heading {
            font-size: ${effectiveFontSizeMobile} !important;
            text-align: ${textAlignMobile} !important;
          }
        }
        
        /* Tablet styles */
        @media (min-width: 769px) and (max-width: 1024px) {
          .advanced-heading {
            font-size: ${effectiveFontSizeTablet} !important;
            text-align: ${textAlignTablet} !important;
          }
        }
      `}</style>
    </div>
  );
};

// ============================================
// 🚀 SINGLE SOURCE OF TRUTH: EXPORTS
// ============================================

export const advancedHeadingDefaultProps: Partial<AdvancedHeadingProps> = {
  // Content
  text: 'Advanced Heading',
  level: 'h2',
  
  // Semantic Structure
  semanticLevel: 'h2',
  ariaLevel: 2,
  ariaLabel: '',
  role: 'heading',
  autoId: true,
  customId: '',
  myNewProp: '',
  
  // Typography
  fontFamily: 'system-ui, sans-serif',
  fontSize: '',
  fontSizeMobile: '',
  fontSizeTablet: '',
  fontWeight: '700',
  lineHeight: '1.2',
  letterSpacing: '0px',
  textTransform: 'none',
  
  // Colors
  color: '#000000',
  hoverColor: '#0056b3',
  
  // Alignment & Layout
  textAlign: 'left',
  textAlignMobile: 'center',
  textAlignTablet: 'left',
  maxWidth: '100%',
  
  // Spacing
  marginTop: '0',
  marginRight: '0',
  marginBottom: '16px',
  marginLeft: '0',
  paddingTop: '0',
  paddingRight: '0',
  paddingBottom: '0',
  paddingLeft: '0',
  
  // Advanced
  className: '',
  dataTracking: '',
  enableSeoChecks: true,
  seoMaxLength: 60,
  
  // Interactive
  onSeoWarning: undefined,
  componentId: '',
};

export const advancedHeadingSchema = {
  properties: {
    // Content Tab
    text: {
      type: 'richtext',
      label: 'Heading Text',
      default: 'Advanced Heading',
      description: 'Main heading content with rich text support',
      category: 'Content',
      seoMaxLength: 60,
    },
    level: {
      type: 'select',
      label: 'Heading Level',
      default: 'h2',
      options: [
        { value: 'h1', label: 'Heading 1 (Page Title)' },
        { value: 'h2', label: 'Heading 2 (Section Title)' },
        { value: 'h3', label: 'Heading 3 (Sub-section)' },
        { value: 'h4', label: 'Heading 4 (Small Heading)' },
        { value: 'h5', label: 'Heading 5' },
        { value: 'h6', label: 'Heading 6' },
      ],
      category: 'Content',
    },

    // Typography Tab
    fontFamily: {
      type: 'select',
      label: 'Font Family',
      default: 'system-ui, sans-serif',
      options: [
        { value: 'system-ui, sans-serif', label: 'System Default' },
        { value: 'Inter, sans-serif', label: 'Inter' },
        { value: 'Roboto, sans-serif', label: 'Roboto' },
        { value: 'Open Sans, sans-serif', label: 'Open Sans' },
        { value: 'Georgia, serif', label: 'Georgia' },
        { value: 'Times New Roman, serif', label: 'Times New Roman' },
        { value: 'Monaco, monospace', label: 'Monospace' },
      ],
      category: 'Typography',
    },
    fontSize: {
      type: 'text',
      label: 'Font Size (Desktop)',
      default: '',
      category: 'Typography',
      description: 'Leave empty for automatic sizing based on heading level',
    },
    fontSizeMobile: {
      type: 'text',
      label: 'Font Size (Mobile)',
      default: '',
      category: 'Typography',
      description: 'Leave empty for automatic sizing based on heading level',
    },
    fontSizeTablet: {
      type: 'text',
      label: 'Font Size (Tablet)',
      default: '',
      category: 'Typography',
      description: 'Leave empty for automatic sizing based on heading level',
    },
    fontWeight: {
      type: 'select',
      label: 'Font Weight',
      default: '700',
      options: [
        { value: '100', label: 'Thin (100)' },
        { value: '200', label: 'Extra Light (200)' },
        { value: '300', label: 'Light (300)' },
        { value: '400', label: 'Normal (400)' },
        { value: '500', label: 'Medium (500)' },
        { value: '600', label: 'Semi Bold (600)' },
        { value: '700', label: 'Bold (700)' },
        { value: '800', label: 'Extra Bold (800)' },
        { value: '900', label: 'Black (900)' },
      ],
      category: 'Typography',
    },
    lineHeight: {
      type: 'text',
      label: 'Line Height',
      default: '1.2',
      category: 'Typography',
    },
    letterSpacing: {
      type: 'text',
      label: 'Letter Spacing',
      default: '0px',
      category: 'Typography',
    },
    textTransform: {
      type: 'select',
      label: 'Text Transform',
      default: 'none',
      options: [
        { value: 'none', label: 'None' },
        { value: 'uppercase', label: 'Uppercase' },
        { value: 'lowercase', label: 'Lowercase' },
        { value: 'capitalize', label: 'Capitalize' },
      ],
      category: 'Typography',
    },

    // Colors Tab
    color: {
      type: 'color',
      label: 'Text Color',
      default: '#000000',
      category: 'Colors',
    },
    hoverColor: {
      type: 'color',
      label: 'Hover Color',
      default: '#0056b3',
      category: 'Colors',
    },

    // Layout Tab
    textAlign: {
      type: 'select',
      label: 'Text Alignment (Desktop)',
      default: 'left',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
        { value: 'justify', label: 'Justify' },
      ],
      category: 'Layout',
    },
    textAlignMobile: {
      type: 'select',
      label: 'Text Alignment (Mobile)',
      default: 'center',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      category: 'Layout',
    },
    textAlignTablet: {
      type: 'select',
      label: 'Text Alignment (Tablet)',
      default: 'left',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      category: 'Layout',
    },
    maxWidth: {
      type: 'text',
      label: 'Max Width',
      default: '100%',
      category: 'Layout',
    },

    // Spacing Tab
    marginTop: {
      type: 'text',
      label: 'Margin Top',
      default: '0',
      category: 'Spacing',
    },
    marginRight: {
      type: 'text',
      label: 'Margin Right',
      default: '0',
      category: 'Spacing',
    },
    marginBottom: {
      type: 'text',
      label: 'Margin Bottom',
      default: '16px',
      category: 'Spacing',
    },
    marginLeft: {
      type: 'text',
      label: 'Margin Left',
      default: '0',
      category: 'Spacing',
    },
    paddingTop: {
      type: 'text',
      label: 'Padding Top',
      default: '0',
      category: 'Spacing',
    },
    paddingRight: {
      type: 'text',
      label: 'Padding Right',
      default: '0',
      category: 'Spacing',
    },
    paddingBottom: {
      type: 'text',
      label: 'Padding Bottom',
      default: '0',
      category: 'Spacing',
    },
    paddingLeft: {
      type: 'text',
      label: 'Padding Left',
      default: '0',
      category: 'Spacing',
    },

    // Advanced Tab
    semanticLevel: {
      type: 'select',
      label: 'Semantic Level',
      default: 'h2',
      options: [
        { value: 'h1', label: 'Heading 1' },
        { value: 'h2', label: 'Heading 2' },
        { value: 'h3', label: 'Heading 3' },
        { value: 'h4', label: 'Heading 4' },
        { value: 'h5', label: 'Heading 5' },
        { value: 'h6', label: 'Heading 6' },
      ],
      category: 'Advanced',
      description: 'For proper HTML semantics (should match visual level)',
    },
    ariaLevel: {
      type: 'number',
      label: 'ARIA Level',
      default: 2,
      min: 1,
      max: 6,
      category: 'Advanced',
      description: 'For screen readers (1-6)',
    },
    ariaLabel: {
      type: 'text',
      label: 'ARIA Label',
      default: '',
      category: 'Advanced',
      description: 'Additional context for screen readers',
    },
    role: {
      type: 'select',
      label: 'ARIA Role',
      default: 'heading',
      options: [
        { value: 'heading', label: 'Heading' },
        { value: 'presentation', label: 'Presentation' },
        { value: 'none', label: 'None' },
      ],
      category: 'Advanced',
      description: 'ARIA role for accessibility',
    },
    autoId: {
      type: 'toggle',
      label: 'Auto-generate ID',
      default: true,
      category: 'Advanced',
      description: 'Automatically generate ID for anchor links',
    },
    customId: {
      type: 'text',
      label: 'Custom ID',
      default: '',
      category: 'Advanced',
      description: 'Custom HTML ID attribute',
    },
    className: {
      type: 'text',
      label: 'CSS Class',
      default: '',
      category: 'Advanced',
      description: 'Additional CSS classes',
    },
    
  },
} as any; // ✅ CRITICAL: 'as any' to fix TypeScript errors

// Attach to component
(AdvancedHeading as any).schema = advancedHeadingSchema;

export default React.memo(AdvancedHeading);
