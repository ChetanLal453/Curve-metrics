// components/AdvancedParagraph.tsx
'use client'

import React, { useState, useEffect, useCallback } from 'react';
import SafeHtml from '@/components/SafeHtml';
import { sanitizeHtml } from '@/lib/sanitize-markup';

interface AdvancedParagraphProps {
  // Core Content
  text?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  
  // Typography
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through' | 'overline';
  fontStyle?: 'normal' | 'italic' | 'oblique';
  
  // Colors
  textColor?: string;
  backgroundColor?: string;
  hoverColor?: string;
  
  // Spacing
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  
  // Layout
  width?: string;
  maxWidth?: string;
  minHeight?: string;
  display?: 'block' | 'inline' | 'inline-block' | 'none';
  
  // Advanced Styling
  border?: string;
  borderRadius?: string;
  borderColor?: string;
  textShadow?: string;
  boxShadow?: string;
  opacity?: number;
  
  // Responsive
  fontSizeMobile?: string;
  textAlignMobile?: 'left' | 'center' | 'right' | 'justify';
  lineHeightMobile?: string;
  fontSizeTablet?: string;
  textAlignTablet?: 'left' | 'center' | 'right' | 'justify';
  
  // Interactive
  hoverEffect?: 'none' | 'underline' | 'color-change' | 'background-change';
  hoverBackgroundColor?: string;
  hoverTextColor?: string;
  transition?: string;
  
  // Advanced Features
  enableRichText?: boolean;
  allowedFormats?: string[];
  ariaLabel?: string;
  role?: string;
  tabIndex?: number;
  className?: string;
  customId?: string;
  selectable?: boolean;
  editable?: boolean;
  truncate?: boolean;
  maxLines?: number;
  
  // Callbacks
  onUpdate?: (props: Record<string, any>) => void;
  componentId?: string;
  
  [key: string]: any;
}

const AdvancedParagraph: React.FC<AdvancedParagraphProps> = ({
  // Core Content
  text = 'This is a comprehensive paragraph component with rich text support, advanced styling, and smooth animations.',
  textAlign = 'left',
  
  // Typography
  fontSize = '16px',
  fontWeight = 'normal',
  fontFamily = 'inherit',
  lineHeight = '1.6',
  letterSpacing = 'normal',
  textTransform = 'none',
  textDecoration = 'none',
  fontStyle = 'normal',
  
  // Colors
  textColor = 'var(--canvas-muted, #333333)',
  backgroundColor = 'transparent',
  hoverColor = 'var(--canvas-accent2, #0056b3)',
  
  // Spacing
  margin = '0 0 16px 0',
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  padding = '0',
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  
  // Layout
  width = '100%',
  maxWidth = '100%',
  minHeight = 'auto',
  display = 'block',
  
  // Advanced Styling
  border = 'none',
  borderRadius = '0px',
  borderColor = 'transparent',
  textShadow = 'none',
  boxShadow = 'none',
  opacity = 1,
  
  // Responsive
  fontSizeMobile,
  textAlignMobile,
  lineHeightMobile,
  fontSizeTablet,
  textAlignTablet,
  
  // Interactive
  hoverEffect = 'none',
  hoverBackgroundColor,
  hoverTextColor,
  transition = 'all 0.2s ease',
  
  // Advanced Features
  enableRichText = true,
  allowedFormats = ['bold', 'italic', 'underline', 'color'],
  ariaLabel,
  role = 'paragraph',
  tabIndex = 0,
  className = '',
  customId = '',
  selectable = true,
  editable = true,
  truncate = false,
  maxLines,
  
  // Callbacks
  onUpdate,
  componentId,
  
  ...props
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const legacyDefaultText = 'This is a comprehensive paragraph component with rich text support, advanced styling, and smooth animations.';
  const previewText =
    '<p>Lead paragraph text. Slightly larger and higher contrast for introductions.</p>' +
    '<p>Body copy sits here — comfortable line height (1.75) and muted color keeps long reads easy. Configure font size, weight, and line height from the right panel.</p>' +
    '<p>Caption or small text variant. Used for footnotes, disclaimers, and supplemental info.</p>';
  const migrationRef = React.useRef(false);

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

  const resolvedTextColor = React.useMemo(() => {
    if (!isEditor) return textColor;
    return isDarkColorValue(textColor) ? 'var(--canvas-muted, #8b90a8)' : textColor;
  }, [textColor, isEditor]);

  const resolvedHoverColor = React.useMemo(() => {
    if (!isEditor) return hoverColor;
    return isDarkColorValue(hoverColor) ? 'var(--canvas-accent2, #a594ff)' : hoverColor;
  }, [hoverColor, isEditor]);

  const resolvedHoverTextColor = React.useMemo(() => {
    if (!isEditor) return hoverTextColor;
    return isDarkColorValue(hoverTextColor) ? 'var(--canvas-accent2, #a594ff)' : hoverTextColor;
  }, [hoverTextColor, isEditor]);

  // Sync with incoming props
  useEffect(() => {
    setLocalText(text);
  }, [text]);

  useEffect(() => {
    if (!isEditor || migrationRef.current) return;
    const plainText = (text || '').replace(/<[^>]*>/g, '').trim();
    if (plainText === legacyDefaultText) {
      migrationRef.current = true;
      setLocalText(previewText);
      if (onUpdate) {
        onUpdate({ ...props, text: previewText });
      }
    }
  }, [isEditor, text, onUpdate, props]);

  const handleTextUpdate = useCallback((newText: string) => {
    const sanitizedText = sanitizeHtml(newText);
    setLocalText(sanitizedText);
    if (onUpdate) {
      // Security: persist only sanitized rich text from the paragraph editor.
      onUpdate({ ...props, text: sanitizedText });
    }
  }, [onUpdate, props]);

  // Responsive text alignment
  const getResponsiveTextAlign = (): React.CSSProperties['textAlign'] => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 768 && textAlignMobile) {
        return textAlignMobile;
      } else if (width < 1024 && textAlignTablet) {
        return textAlignTablet;
      }
    }
    return textAlign;
  };

  // Responsive font size
  const getResponsiveFontSize = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 768 && fontSizeMobile) {
        return fontSizeMobile;
      } else if (width < 1024 && fontSizeTablet) {
        return fontSizeTablet;
      }
    }
    return fontSize;
  };

  // Responsive line height
  const getResponsiveLineHeight = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 768 && lineHeightMobile) {
        return lineHeightMobile;
      }
    }
    return lineHeight;
  };

  // Hover effects
  const getHoverStyles = (): React.CSSProperties => {
    if (!isHovered) return {};
    
    switch (hoverEffect) {
      case 'underline':
        return { textDecoration: 'underline' };
      case 'color-change':
        return { 
          color: resolvedHoverTextColor || resolvedHoverColor || resolvedTextColor,
          backgroundColor: hoverBackgroundColor || backgroundColor
        };
      case 'background-change':
        return { backgroundColor: hoverBackgroundColor || backgroundColor };
      default:
        return {};
    }
  };

  // Text truncation
  const getTruncationStyles = (): React.CSSProperties => {
    if (!truncate) return {};
    
    if (maxLines && maxLines > 0) {
      return {
        display: '-webkit-box',
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      } as React.CSSProperties;
    }
    
    return {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    };
  };

  // Calculate margin and padding
  const getCalculatedMargin = () => {
    if (marginTop || marginRight || marginBottom || marginLeft) {
      return `${marginTop || '0'} ${marginRight || '0'} ${marginBottom || '0'} ${marginLeft || '0'}`;
    }
    return margin;
  };

  const getCalculatedPadding = () => {
    if (paddingTop || paddingRight || paddingBottom || paddingLeft) {
      return `${paddingTop || '0'} ${paddingRight || '0'} ${paddingBottom || '0'} ${paddingLeft || '0'}`;
    }
    return padding;
  };

  // Paragraph styles
  const paragraphStyle: React.CSSProperties = {
    // Core Typography
    fontSize: getResponsiveFontSize(),
    fontWeight: fontWeight as React.CSSProperties['fontWeight'],
    fontFamily,
    lineHeight: getResponsiveLineHeight(),
    letterSpacing,
    textTransform: textTransform as React.CSSProperties['textTransform'],
    textDecoration: textDecoration as React.CSSProperties['textDecoration'],
    fontStyle: fontStyle as React.CSSProperties['fontStyle'],
    
    // Colors
    color: isHovered && resolvedHoverTextColor ? resolvedHoverTextColor : (isHovered && resolvedHoverColor ? resolvedHoverColor : resolvedTextColor),
    backgroundColor: isHovered && hoverBackgroundColor ? hoverBackgroundColor : backgroundColor,
    
    // Alignment & Layout
    textAlign: getResponsiveTextAlign(),
    width,
    maxWidth,
    minHeight: minHeight === 'auto' ? 'auto' : minHeight,
    display: display as React.CSSProperties['display'],
    
    // Spacing
    margin: getCalculatedMargin(),
    padding: getCalculatedPadding(),
    
    // Advanced Styling
    border,
    borderRadius,
    borderColor,
    textShadow,
    boxShadow,
    opacity,
    
    // Interactive
    transition,
    cursor: (isEditing || editable) ? 'text' : 'pointer',
    userSelect: selectable ? 'text' : 'none',
    outline: 'none',
    
    // Combine hover and truncation styles
    ...getHoverStyles(),
    ...getTruncationStyles()
  };

  // Handle editing styles
  if (isEditing) {
    paragraphStyle.border = '2px solid #3b82f6';
    paragraphStyle.backgroundColor = 'white';
  }

  // Rich Text Editor Component
  const RichTextEditor = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto">
        {/* Toolbar */}
        <div className="border-b p-4 flex flex-wrap gap-2 bg-gray-50 rounded-t-lg">
          {allowedFormats.includes('bold') && (
            <button 
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
              onClick={() => document.execCommand('bold')}
              type="button"
            >
              <strong>B</strong>
            </button>
          )}
          
          {allowedFormats.includes('italic') && (
            <button 
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
              onClick={() => document.execCommand('italic')}
              type="button"
            >
              <em>I</em>
            </button>
          )}
          
          {allowedFormats.includes('underline') && (
            <button 
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
              onClick={() => document.execCommand('underline')}
              type="button"
            >
              <u>U</u>
            </button>
          )}
          
          {allowedFormats.includes('color') && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Color:</span>
              <input 
                type="color"
                className="w-8 h-8 cursor-pointer border rounded"
                onChange={(e) => document.execCommand('foreColor', false, e.target.value)}
              />
            </div>
          )}
          
          <div className="flex-1"></div>
          
          <button 
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-medium"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium"
            onClick={() => {
              const content = document.getElementById('paragraph-rich-text-editor')?.innerHTML || '';
              handleTextUpdate(content);
              setIsEditing(false);
            }}
          >
            Save Changes
          </button>
        </div>
        
        {/* Editor */}
        <div className="p-6">
          <div 
            id="paragraph-rich-text-editor"
            contentEditable
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(localText) }}
            className="min-h-[200px] max-h-[50vh] overflow-y-auto p-4 border rounded focus:outline-none focus:border-blue-400 prose prose-lg max-w-none"
            style={{
              fontSize: getResponsiveFontSize(),
              fontWeight: fontWeight as React.CSSProperties['fontWeight'],
              fontFamily,
              lineHeight: getResponsiveLineHeight(),
              color: textColor
            }}
          />
          
          {/* Character Counter */}
          <div className="mt-3 text-sm text-gray-500 text-right">
            Characters: {localText.replace(/<[^>]*>/g, '').length}
            {truncate && maxLines && (
              <span className="ml-2 text-blue-500">
                • Max lines: {maxLines}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editable && enableRichText) {
      setIsEditing(true);
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const hasBlockTag = /<\s*(p|div|ul|ol|li|h\d|blockquote|pre)\b/i.test(localText || '');
  const contentTagName = isEditor ? 'div' : (hasBlockTag ? 'div' : 'p');
  const displayText = React.useMemo(() => {
    if (!isEditor) return localText;
    const plainText = (localText || '').replace(/<[^>]*>/g, '').trim();
    if (plainText === legacyDefaultText) return previewText;
    if (!/<\s*p\b/i.test(localText || '')) {
      return `<p>${localText || ''}</p>`;
    }
    return localText;
  }, [isEditor, localText, legacyDefaultText, previewText]);

  const paragraphDisplay = (
    <div 
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="ap-display cursor-pointer"
    >
      <SafeHtml
        html={displayText}
        tagName={contentTagName as any}
        id={customId || undefined}
        className={className}
        style={paragraphStyle}
        aria-label={ariaLabel}
        role={role}
        tabIndex={tabIndex}
      />
      
      {/* Hover Edit Hint */}
      {editable && (
        <div className="ap-edit-hint absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-5 transition-all rounded flex items-center justify-center opacity-0 hover:opacity-100 pointer-events-none">
          <div className="ap-edit-hint-box bg-white px-4 py-2 rounded shadow text-sm text-gray-600 border">
            {enableRichText ? 'Double-click to edit rich text' : 'Paragraph'}
          </div>
        </div>
      )}

      {/* Selection Indicator */}
      {!selectable && (
        <div className="ap-nonselectable absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
          Non-selectable
        </div>
      )}

      {/* Truncation Indicator */}
      {truncate && (
        <div className="ap-truncate-badge absolute bottom-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded">
          {maxLines ? `${maxLines} lines` : 'Truncated'}
        </div>
      )}
    </div>
  );

  return (
    <div className="advanced-paragraph relative">
      {/* Display Mode */}
      {!isEditing && (
        isEditor ? (
          <div className="advanced-paragraph-card">
            <div className="advanced-paragraph-header" aria-hidden="true">
              <span className="advanced-paragraph-tag">Content</span>
              <span className="advanced-paragraph-title">Paragraph</span>
              <span className="advanced-paragraph-subtitle">body text block</span>
            </div>
            <div className="advanced-paragraph-body">
              {paragraphDisplay}
            </div>
          </div>
        ) : (
          paragraphDisplay
        )
      )}
      
      {/* Edit Mode Overlay */}
      {isEditing && enableRichText && <RichTextEditor />}

      <style jsx>{`
        .advanced-paragraph-card {
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
        }

        .advanced-paragraph-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          width: 100%;
          background: var(--canvas-surface2, #1a1d28);
          border-bottom: 1px solid var(--canvas-border, rgba(255, 255, 255, 0.07));
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .advanced-paragraph-tag {
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

        .advanced-paragraph-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--canvas-text, #e8eaf0);
        }

        .advanced-paragraph-subtitle {
          font-size: 11.5px;
          color: var(--canvas-text3, #5a5f7a);
          margin-left: auto;
          font-family: 'DM Mono', monospace;
        }

        .advanced-paragraph-body {
          padding: 28px 36px;
          min-height: 120px;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          flex-direction: column;
          gap: 12px;
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .ap-display {
          position: relative;
          width: 100%;
          max-width: 100%;
        }

        .advanced-paragraph-body :global(p) {
          margin: 0;
        }

        .advanced-paragraph-body :global(p + p) {
          margin-top: 12px;
        }

        .advanced-paragraph-body :global(p:nth-child(1)) {
          font-size: 16px;
          color: var(--canvas-text, #e8eaf0);
          line-height: 1.65;
          font-weight: 400;
        }

        .advanced-paragraph-body :global(p:nth-child(2)) {
          font-size: 14px;
          color: var(--canvas-muted, #8b90a8);
          line-height: 1.75;
        }

        .advanced-paragraph-body :global(p:nth-child(3)) {
          font-size: 12.5px;
          color: var(--canvas-text3, #5a5f7a);
          line-height: 1.7;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

// ============================================
// 🚀 SINGLE SOURCE OF TRUTH: EXPORTS
// ============================================

export const advancedParagraphDefaultProps: Partial<AdvancedParagraphProps> = {
  // Core Content
  text:
    '<p>Lead paragraph text. Slightly larger and higher contrast for introductions.</p>' +
    '<p>Body copy sits here — comfortable line height (1.75) and muted color keeps long reads easy. Configure font size, weight, and line height from the right panel.</p>' +
    '<p>Caption or small text variant. Used for footnotes, disclaimers, and supplemental info.</p>',
  textAlign: 'left',

  // Typography
  fontSize: '16px',
  fontWeight: 'normal',
  fontFamily: 'inherit',
  lineHeight: '1.6',
  letterSpacing: 'normal',
  textTransform: 'none',
  textDecoration: 'none',
  fontStyle: 'normal',

  // Colors
  textColor: 'var(--canvas-muted, #333333)',
  backgroundColor: 'transparent',
  hoverColor: 'var(--canvas-accent2, #0056b3)',

  // Spacing
  margin: '0 0 16px 0',
  marginTop: '0',
  marginRight: '0',
  marginBottom: '16px',
  marginLeft: '0',
  padding: '0',
  paddingTop: '0',
  paddingRight: '0',
  paddingBottom: '0',
  paddingLeft: '0',

  // Layout
  width: '100%',
  maxWidth: '100%',
  minHeight: 'auto',
  display: 'block',

  // Advanced Styling
  border: 'none',
  borderRadius: '0px',
  borderColor: 'transparent',
  textShadow: 'none',
  boxShadow: 'none',
  opacity: 1,

  // Responsive
  fontSizeMobile: '',
  textAlignMobile: 'center',
  lineHeightMobile: '',
  fontSizeTablet: '',
  textAlignTablet: 'left',

  // Interactive
  hoverEffect: 'none',
  hoverBackgroundColor: 'var(--canvas-surface, #f5f5f5)',
  hoverTextColor: 'var(--canvas-accent2, #000000)',
  transition: 'all 0.2s ease',

  // Advanced Features
  enableRichText: true,
  allowedFormats: ['bold', 'italic', 'underline', 'color'],
  ariaLabel: '',
  role: 'paragraph',
  tabIndex: 0,
  className: '',
  customId: '',
  selectable: true,
  editable: true,
  truncate: false,
  maxLines: 0,

  // Callbacks
  onUpdate: undefined,
  componentId: '',
};

export const advancedParagraphSchema = {
  properties: {
    // Content Tab
    text: {
      type: 'textarea',
      label: 'Text Content',
      default: 'This is a comprehensive paragraph component with rich text support, advanced styling, and smooth animations.',
      description: 'Main paragraph content with rich text support',
      category: 'Content',
    },
    textAlign: {
      type: 'select',
      label: 'Text Alignment',
      default: 'left',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
        { value: 'justify', label: 'Justify' },
      ],
      category: 'Content',
    },

    // Typography Tab
    fontSize: {
      type: 'text',
      label: 'Font Size',
      default: '16px',
      category: 'Typography',
    },
    fontWeight: {
      type: 'select',
      label: 'Font Weight',
      default: 'normal',
      options: [
        { value: 'normal', label: 'Normal' },
        { value: 'bold', label: 'Bold' },
        { value: 'lighter', label: 'Lighter' },
        { value: 'bolder', label: 'Bolder' },
        { value: '100', label: 'Thin (100)' },
        { value: '300', label: 'Light (300)' },
        { value: '400', label: 'Normal (400)' },
        { value: '500', label: 'Medium (500)' },
        { value: '700', label: 'Bold (700)' },
        { value: '900', label: 'Black (900)' },
      ],
      category: 'Typography',
    },
    fontFamily: {
      type: 'text',
      label: 'Font Family',
      default: 'inherit',
      category: 'Typography',
    },
    lineHeight: {
      type: 'text',
      label: 'Line Height',
      default: '1.6',
      category: 'Typography',
    },
    letterSpacing: {
      type: 'text',
      label: 'Letter Spacing',
      default: 'normal',
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
    textDecoration: {
      type: 'select',
      label: 'Text Decoration',
      default: 'none',
      options: [
        { value: 'none', label: 'None' },
        { value: 'underline', label: 'Underline' },
        { value: 'line-through', label: 'Line Through' },
        { value: 'overline', label: 'Overline' },
      ],
      category: 'Typography',
    },
    fontStyle: {
      type: 'select',
      label: 'Font Style',
      default: 'normal',
      options: [
        { value: 'normal', label: 'Normal' },
        { value: 'italic', label: 'Italic' },
        { value: 'oblique', label: 'Oblique' },
      ],
      category: 'Typography',
    },

    // Colors Tab
    textColor: {
      type: 'color',
      label: 'Text Color',
      default: '#8B90A8',
      category: 'Colors',
    },
    backgroundColor: {
      type: 'color',
      label: 'Background Color',
      default: 'transparent',
      category: 'Colors',
    },
    hoverColor: {
      type: 'color',
      label: 'Hover Color',
      default: '#A594FF',
      category: 'Colors',
    },

    // Spacing Tab
    margin: {
      type: 'text',
      label: 'Margin',
      default: '0 0 16px 0',
      category: 'Spacing',
    },
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
    padding: {
      type: 'text',
      label: 'Padding',
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

    // Layout Tab
    width: {
      type: 'text',
      label: 'Width',
      default: '100%',
      category: 'Layout',
    },
    maxWidth: {
      type: 'text',
      label: 'Max Width',
      default: '100%',
      category: 'Layout',
    },
    minHeight: {
      type: 'text',
      label: 'Min Height',
      default: 'auto',
      category: 'Layout',
    },
    display: {
      type: 'select',
      label: 'Display',
      default: 'block',
      options: [
        { value: 'block', label: 'Block' },
        { value: 'inline', label: 'Inline' },
        { value: 'inline-block', label: 'Inline Block' },
        { value: 'none', label: 'None' },
      ],
      category: 'Layout',
    },

    // Advanced Styling Tab
    border: {
      type: 'text',
      label: 'Border',
      default: 'none',
      category: 'Advanced Styling',
    },
    borderRadius: {
      type: 'text',
      label: 'Border Radius',
      default: '0px',
      category: 'Advanced Styling',
    },
    borderColor: {
      type: 'color',
      label: 'Border Color',
      default: 'transparent',
      category: 'Advanced Styling',
    },
    textShadow: {
      type: 'text',
      label: 'Text Shadow',
      default: 'none',
      category: 'Advanced Styling',
    },
    boxShadow: {
      type: 'text',
      label: 'Box Shadow',
      default: 'none',
      category: 'Advanced Styling',
    },
    opacity: {
      type: 'number',
      label: 'Opacity',
      default: 1,
      min: 0,
      max: 1,
      step: 0.1,
      category: 'Advanced Styling',
    },

    // Responsive Tab
    fontSizeMobile: {
      type: 'text',
      label: 'Font Size (Mobile)',
      default: '',
      category: 'Responsive',
    },
    textAlignMobile: {
      type: 'select',
      label: 'Text Alignment (Mobile)',
      default: 'center',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
        { value: 'justify', label: 'Justify' },
      ],
      category: 'Responsive',
    },
    lineHeightMobile: {
      type: 'text',
      label: 'Line Height (Mobile)',
      default: '',
      category: 'Responsive',
    },
    fontSizeTablet: {
      type: 'text',
      label: 'Font Size (Tablet)',
      default: '',
      category: 'Responsive',
    },
    textAlignTablet: {
      type: 'select',
      label: 'Text Alignment (Tablet)',
      default: 'left',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
        { value: 'justify', label: 'Justify' },
      ],
      category: 'Responsive',
    },

    // Interactive Tab
    hoverEffect: {
      type: 'select',
      label: 'Hover Effect',
      default: 'none',
      options: [
        { value: 'none', label: 'None' },
        { value: 'underline', label: 'Underline' },
        { value: 'color-change', label: 'Color Change' },
        { value: 'background-change', label: 'Background Change' },
      ],
      category: 'Interactive',
    },
    hoverBackgroundColor: {
      type: 'color',
      label: 'Hover Background Color',
      default: '#1A1D28',
      category: 'Interactive',
    },
    hoverTextColor: {
      type: 'color',
      label: 'Hover Text Color',
      default: '#A594FF',
      category: 'Interactive',
    },
    transition: {
      type: 'text',
      label: 'Transition',
      default: 'all 0.2s ease',
      category: 'Interactive',
    },

    // Advanced Features Tab
    enableRichText: {
      type: 'toggle',
      label: 'Enable Rich Text',
      default: true,
      category: 'Advanced',
    },
    allowedFormats: {
      type: 'select',
      label: 'Allowed Formats',
      default: 'bold,italic,underline,color',
      options: [
        { value: 'bold', label: 'Bold' },
        { value: 'italic', label: 'Italic' },
        { value: 'underline', label: 'Underline' },
        { value: 'color', label: 'Color' },
        { value: 'bold,italic,underline,color', label: 'All Formats' },
      ],
      category: 'Advanced',
    },
    ariaLabel: {
      type: 'text',
      label: 'ARIA Label',
      default: '',
      category: 'Advanced',
    },
    role: {
      type: 'text',
      label: 'ARIA Role',
      default: 'paragraph',
      category: 'Advanced',
    },
    tabIndex: {
      type: 'number',
      label: 'Tab Index',
      default: 0,
      category: 'Advanced',
    },
    className: {
      type: 'text',
      label: 'CSS Class',
      default: '',
      category: 'Advanced',
    },
    customId: {
      type: 'text',
      label: 'Custom ID',
      default: '',
      category: 'Advanced',
    },
    selectable: {
      type: 'toggle',
      label: 'Text Selectable',
      default: true,
      category: 'Advanced',
    },
    editable: {
      type: 'toggle',
      label: 'Editable',
      default: true,
      category: 'Advanced',
    },
    truncate: {
      type: 'toggle',
      label: 'Truncate Text',
      default: false,
      category: 'Advanced',
    },
    maxLines: {
      type: 'number',
      label: 'Max Lines',
      default: 0,
      min: 0,
      max: 10,
      category: 'Advanced',
    },

  },
} as any; // ✅ IMPORTANT: 'as any' to fix TypeScript errors

// Attach to component
(AdvancedParagraph as any).schema = advancedParagraphSchema;

export default AdvancedParagraph;
