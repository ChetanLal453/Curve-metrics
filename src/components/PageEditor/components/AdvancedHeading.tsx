"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react';
import SafeHtml from '@/components/SafeHtml';
import { sanitizeHtml } from '@/lib/sanitize-markup';

interface AdvancedHeadingProps {
  // Content
  text?: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  highlightText?: string;
  highlightColor?: string;
  usePresetStyles?: boolean;
  htmlTag?: 'auto' | keyof JSX.IntrinsicElements;
  
  // Semantic Structure
  semanticLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  ariaLevel?: number;
  ariaLabel?: string;
  role?: string;
  autoId?: boolean;
  customId?: string;
  
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

const DEFAULT_FONT_WEIGHT = '700';
const DEFAULT_LINE_HEIGHT = '1.2';
const DEFAULT_COLOR = 'var(--canvas-text, #111111)';
const DEFAULT_HIGHLIGHT_COLOR = 'var(--canvas-accent2, #a594ff)';

const PRESET_STYLES: Record<
  string,
  {
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    color?: string;
  }
> = {
  h1: {
    fontSize: '36px',
    fontWeight: '700',
    lineHeight: '1.15',
    color: 'var(--canvas-text, #e8eaf0)',
  },
  h2: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--canvas-text, #e8eaf0)',
  },
  h3: {
    fontSize: '17px',
    fontWeight: '600',
    color: 'var(--canvas-muted, #8b90a8)',
  },
};

const AdvancedHeading: React.FC<AdvancedHeadingProps> = ({
  text = 'Advanced Heading',
  level = 'h2',
  highlightText = '',
  highlightColor = DEFAULT_HIGHLIGHT_COLOR,
  usePresetStyles = true,
  htmlTag = 'auto',
  semanticLevel,
  ariaLevel,
  ariaLabel,
  role = 'heading',
  autoId = true,
  customId,
  fontFamily = "'DM Sans', system-ui, sans-serif",
  fontSize = '',
  fontSizeMobile = '',
  fontSizeTablet = '',
  fontWeight = DEFAULT_FONT_WEIGHT,
  lineHeight = DEFAULT_LINE_HEIGHT,
  letterSpacing = '0px',
  textTransform = 'none',
  color = DEFAULT_COLOR,
  hoverColor = 'var(--canvas-accent2, #0056b3)',
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
  enableSeoChecks = true,
  seoMaxLength = 60,
  onSeoWarning,
  componentId,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const previousWarningsRef = useRef<string[]>([]);
  const [isEditor, setIsEditor] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsEditor(Boolean(document.querySelector('.cm-page-editor')));
  }, []);

  const isDarkColorValue = (value?: string) => {
    if (!value) return false;
    const normalized = value.trim().toLowerCase();
    if (normalized.startsWith('var(') || normalized === 'transparent') return false;
    if (normalized === 'black') return true;

    const hexMatch = normalized.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
      const hex = hexMatch[1].length === 3
        ? hexMatch[1].split('').map((c) => c + c).join('')
        : hexMatch[1];
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      return luminance < 0.35;
    }

    const rgbMatch = normalized.match(/^rgb\\s*\\((\\d+),\\s*(\\d+),\\s*(\\d+)\\)$/);
    if (rgbMatch) {
      const r = Number(rgbMatch[1]);
      const g = Number(rgbMatch[2]);
      const b = Number(rgbMatch[3]);
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      return luminance < 0.35;
    }

    return false;
  };
  const domProps = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(props).filter(([key]) => key.startsWith('data-') || key.startsWith('aria-') || key === 'title'),
      ),
    [props],
  );

  // Generate auto ID if enabled
  const generatedId = useMemo(() => {
    if (autoId && componentId) return `heading-${componentId}`;
    if (customId && customId.trim()) return customId;
    return undefined;
  }, [autoId, componentId, customId]);

  // 🆕 DYNAMIC FONT SIZE CALCULATION
  const getLevelBasedFontSize = (headingLevel: string) => {
    const sizeMap: Record<string, string> = {
      'h1': '36px',
      'h2': '24px',
      'h3': '17px',
      'h4': '15px',
      'h5': '13.5px',
      'h6': '12px',
    };
    
    return sizeMap[headingLevel] || '24px';
  };

  const getLevelBasedFontSizeMobile = (headingLevel: string) => {
    const sizeMap: Record<string, string> = {
      'h1': '30px',
      'h2': '22px',
      'h3': '16px',
      'h4': '14px',
      'h5': '13px',
      'h6': '12px',
    };
    
    return sizeMap[headingLevel] || '22px';
  };

  const getLevelBasedFontSizeTablet = (headingLevel: string) => {
    const sizeMap: Record<string, string> = {
      'h1': '32px',
      'h2': '24px',
      'h3': '17px',
      'h4': '15px',
      'h5': '13.5px',
      'h6': '12px',
    };
    
    return sizeMap[headingLevel] || '24px';
  };

  const presetStyles = useMemo(() => {
    if (!usePresetStyles) return undefined;
    return PRESET_STYLES[level];
  }, [usePresetStyles, level]);

  // 🆕 Use level-based font sizes if no explicit fontSize is provided
  const effectiveFontSize = useMemo(() => {
    return fontSize || presetStyles?.fontSize || getLevelBasedFontSize(level);
  }, [fontSize, presetStyles, level]);

  const effectiveFontSizeMobile = useMemo(() => {
    return fontSizeMobile || getLevelBasedFontSizeMobile(level);
  }, [fontSizeMobile, level]);

  const effectiveFontSizeTablet = useMemo(() => {
    return fontSizeTablet || getLevelBasedFontSizeTablet(level);
  }, [fontSizeTablet, level]);

  const effectiveFontWeight = useMemo(() => {
    if (usePresetStyles && presetStyles?.fontWeight && fontWeight === DEFAULT_FONT_WEIGHT) {
      return presetStyles.fontWeight;
    }
    return fontWeight || presetStyles?.fontWeight || DEFAULT_FONT_WEIGHT;
  }, [usePresetStyles, presetStyles, fontWeight]);

  const effectiveLineHeight = useMemo(() => {
    if (usePresetStyles && presetStyles?.lineHeight && lineHeight === DEFAULT_LINE_HEIGHT) {
      return presetStyles.lineHeight;
    }
    return lineHeight || presetStyles?.lineHeight || DEFAULT_LINE_HEIGHT;
  }, [usePresetStyles, presetStyles, lineHeight]);

  const effectiveColor = useMemo(() => {
    const normalizedColor = color?.trim().toLowerCase();
    const isDefaultColor =
      normalizedColor === DEFAULT_COLOR.toLowerCase() ||
      normalizedColor === '#e8eaf0' ||
      normalizedColor === 'var(--canvas-text)';

    if (usePresetStyles && presetStyles?.color && isDefaultColor) {
      return presetStyles.color;
    }
    return color || presetStyles?.color || DEFAULT_COLOR;
  }, [usePresetStyles, presetStyles, color]);

  const effectiveHighlightColor = useMemo(() => {
    return highlightColor || DEFAULT_HIGHLIGHT_COLOR;
  }, [highlightColor]);

  // Use level for visual styling, semanticLevel for the actual tag when auto
  const effectiveLevel = useMemo(() => {
    return level;
  }, [level]);

  // Memoized styles
  const resolvedColor = useMemo(() => {
    if (!isEditor) return effectiveColor;
    return isDarkColorValue(effectiveColor) ? 'var(--canvas-text, #e8eaf0)' : effectiveColor;
  }, [effectiveColor, isEditor]);

  const resolvedHoverColor = useMemo(() => {
    if (!isEditor) return hoverColor;
    return isDarkColorValue(hoverColor) ? 'var(--canvas-accent2, #a594ff)' : hoverColor;
  }, [hoverColor, isEditor]);

  const headingStyle: React.CSSProperties = useMemo(() => ({
    fontFamily,
    fontSize: effectiveFontSize,
    fontWeight: effectiveFontWeight,
    lineHeight: effectiveLineHeight,
    letterSpacing,
    textTransform,
    color: isHovered ? resolvedHoverColor : resolvedColor,
    textAlign,
    maxWidth,
    margin: `${marginTop} ${marginRight} ${marginBottom} ${marginLeft}`,
    padding: `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`,
    transition: 'all 0.2s ease',
    display: 'block',
    width: '100%',
    ['--heading-highlight' as any]: effectiveHighlightColor,
  }), [
    fontFamily, effectiveFontSize, effectiveFontWeight, effectiveLineHeight, letterSpacing, textTransform,
    isHovered, resolvedHoverColor, resolvedColor, textAlign, maxWidth,
    marginTop, marginRight, marginBottom, marginLeft,
    paddingTop, paddingRight, paddingBottom, paddingLeft,
    effectiveHighlightColor,
  ]);

  // Use semanticLevel for HTML tag when auto, keep visual level for styles
  const Tag = (htmlTag === 'auto' ? (semanticLevel || effectiveLevel) : htmlTag) as keyof JSX.IntrinsicElements;
  const headingClassName = useMemo(() => {
    return ['advanced-heading', 'heading', `heading-${level}`, `h-${level}`, className].filter(Boolean).join(' ');
  }, [className, level]);

  const showEditorHeader = useMemo(() => isEditor, [isEditor]);
  const levelLabel = useMemo(() => String(Tag || 'h2').toUpperCase(), [Tag]);

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
  const normalizedHighlight = highlightText.trim();

  const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const renderHighlightedText = (value: string) => {
    if (!normalizedHighlight) return value;
    const regex = new RegExp(`(${escapeRegExp(normalizedHighlight)})`, 'g');
    const parts = value.split(regex);

    if (parts.length === 1) return value;

    return parts.map((part, index) =>
      part === normalizedHighlight ? (
        <span key={`highlight-${index}`} className="heading-highlight">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const highlightedContent = useMemo(() => {
    if (isHtmlContent || typeof content !== 'string') return content;
    return renderHighlightedText(content);
  }, [content, isHtmlContent, normalizedHighlight]);

  const headingNode = isHtmlContent ? (
    <SafeHtml
      html={content}
      tagName={Tag}
      id={generatedId || undefined}
      className={headingClassName}
      style={headingStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-tracking={dataTracking || undefined}
      {...ariaProps}
      {...domProps}
    />
  ) : (
    <Tag
      id={generatedId || undefined}
      className={headingClassName}
      style={headingStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-tracking={dataTracking || undefined}
      {...ariaProps}
      {...domProps}
    >
      {highlightedContent}
    </Tag>
  );

  return (
    <div className="advanced-heading-container">
      {showEditorHeader && (
        <div className="advanced-heading-header" aria-hidden="true">
          <span className="advanced-heading-tag">Content</span>
          <span className="advanced-heading-title">Heading</span>
          <span className="advanced-heading-subtitle">{levelLabel}</span>
        </div>
      )}
      {isEditor ? <div className="advanced-heading-body">{headingNode}</div> : headingNode}

      {/* Responsive CSS */}
      <style jsx>{`
        .advanced-heading-container {
          width: 100%;
        }

        .advanced-heading-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          width: 100%;
          background: var(--canvas-surface2, #1a1d28);
          border-bottom: 1px solid var(--canvas-border, rgba(255, 255, 255, 0.07));
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .advanced-heading-tag {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--canvas-accent2, #a594ff);
          background: var(--canvas-accentbg, rgba(124, 109, 250, 0.12));
          border: 1px solid rgba(124, 109, 250, 0.2);
          padding: 2px 8px;
          border-radius: 20px;
        }

        .advanced-heading-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--canvas-text, #e8eaf0);
        }

        .advanced-heading-subtitle {
          font-size: 11.5px;
          color: var(--canvas-text3, #5a5f7a);
          margin-left: auto;
          font-family: 'DM Mono', monospace;
        }

        .advanced-heading-body {
          padding: 28px 36px;
          min-height: 120px;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        /* Ensure heading tags have proper default styles */
        .advanced-heading,
        .heading {
          margin: 0;
          padding: 0;
          font-weight: inherit;
          line-height: inherit;
          letter-spacing: inherit;
          text-transform: inherit;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Preset heading styles (matches HTML preview) */
        .heading.h-h1,
        .heading.heading-h1 {
          font-size: 36px;
          font-weight: 700;
          line-height: 1.15;
          color: var(--canvas-text, #e8eaf0);
        }
        
        .heading.h-h2,
        .heading.heading-h2 {
          font-size: 24px;
          font-weight: 700;
          color: var(--canvas-text, #e8eaf0);
        }
        
        .heading.h-h3,
        .heading.heading-h3 {
          font-size: 17px;
          font-weight: 600;
          color: var(--canvas-muted, #8b90a8);
        }

        .heading.h-h1 span {
          color: var(--heading-highlight, var(--canvas-accent2, #a594ff));
        }

        .heading .heading-highlight {
          color: var(--heading-highlight, var(--canvas-accent2, #a594ff));
        }
        
        /* Mobile styles */
        @media (max-width: 768px) {
          .advanced-heading,
          .heading {
            font-size: ${effectiveFontSizeMobile} !important;
            text-align: ${textAlignMobile} !important;
          }
        }
        
        /* Tablet styles */
        @media (min-width: 769px) and (max-width: 1024px) {
          .advanced-heading,
          .heading {
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
  highlightText: '',
  highlightColor: DEFAULT_HIGHLIGHT_COLOR,
  usePresetStyles: true,
  htmlTag: 'auto',
  
  // Semantic Structure
  semanticLevel: 'h2',
  ariaLevel: 2,
  ariaLabel: '',
  role: 'heading',
  autoId: true,
  customId: '',
  
  // Typography
  fontFamily: "'DM Sans', system-ui, sans-serif",
  fontSize: '',
  fontSizeMobile: '',
  fontSizeTablet: '',
  fontWeight: '700',
  lineHeight: '1.2',
  letterSpacing: '0px',
  textTransform: 'none',
  
  // Colors
  color: 'var(--canvas-text, #111111)',
  hoverColor: 'var(--canvas-accent2, #0056b3)',
  
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
    usePresetStyles: {
      type: 'toggle',
      label: 'Use Preset Styles',
      default: true,
      description: 'Apply the default heading presets (H1/H2/H3) from the design system',
      category: 'Content',
    },
    highlightText: {
      type: 'text',
      label: 'Highlight Text',
      default: '',
      description: 'Text to highlight inside the heading',
      category: 'Content',
    },
    highlightColor: {
      type: 'color',
      label: 'Highlight Color',
      default: DEFAULT_HIGHLIGHT_COLOR,
      description: 'Accent color for highlighted text',
      category: 'Content',
    },

    // Typography Tab
    fontFamily: {
      type: 'select',
      label: 'Font Family',
      default: "'DM Sans', system-ui, sans-serif",
      options: [
        { value: "'DM Sans', system-ui, sans-serif", label: 'DM Sans' },
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
      default: DEFAULT_COLOR,
      category: 'Colors',
    },
    hoverColor: {
      type: 'color',
      label: 'Hover Color',
      default: 'var(--canvas-accent2, #0056b3)',
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
    htmlTag: {
      type: 'select',
      label: 'HTML Tag',
      default: 'auto',
      options: [
        { value: 'auto', label: 'Auto (semantic or level)' },
        { value: 'h1', label: 'H1' },
        { value: 'h2', label: 'H2' },
        { value: 'h3', label: 'H3' },
        { value: 'h4', label: 'H4' },
        { value: 'h5', label: 'H5' },
        { value: 'h6', label: 'H6' },
        { value: 'p', label: 'Paragraph' },
        { value: 'div', label: 'Div' },
        { value: 'span', label: 'Span' },
      ],
      category: 'Advanced',
      description: 'Override the rendered HTML tag while keeping the visual level',
    },
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
      description: 'Used when HTML Tag is Auto (should match visual level)',
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
    dataTracking: {
      type: 'text',
      label: 'Tracking Data Attribute',
      default: '',
      category: 'Advanced',
      description: 'Value for data-tracking attribute',
    },
    enableSeoChecks: {
      type: 'toggle',
      label: 'Enable SEO Checks',
      default: true,
      category: 'Advanced',
      description: 'Warn on long, empty, or mismatched headings',
    },
    seoMaxLength: {
      type: 'number',
      label: 'SEO Max Length',
      default: 60,
      min: 1,
      max: 200,
      category: 'Advanced',
      description: 'Recommended max length for the heading',
    },
    
  },
} as any; // ✅ CRITICAL: 'as any' to fix TypeScript errors

// Attach to component
(AdvancedHeading as any).schema = advancedHeadingSchema;

export default React.memo(AdvancedHeading);
