'use client'

import React, { useState, useEffect } from 'react'
import { getDisplayValue } from '@/utils/displayValue'
import * as FaIcons from 'react-icons/fa';

// Types
interface AdvancedCardComponentProps {
  // Image Settings
  showImage?: boolean
  image?: string
  alt?: string
  imagePosition?: 'top' | 'left' | 'right' | 'background'
  imageHeight?: number
  imageWidth?: number
  objectFit?: 'cover' | 'contain' | 'fill' | 'none'
  overlayColor?: string
  overlayOpacity?: number
  imageShadow?: 'none' | 'sm' | 'md' | 'lg'
  imageBorderRadius?: number
  
  // Image Hover (Independent)
  imageHoverEffect?: 'none' | 'zoom' | 'fade' | 'grayscale' | 'brighten'
  imageHoverZoom?: number
  imageHoverBrightness?: number
  imageHoverGrayscale?: number
  imageHoverDuration?: number

  // Icon Settings
  showIcon?: boolean
  icon?: string
  iconSize?: number
  iconColor?: string
  iconBackgroundColor?: string
  iconShape?: 'circle' | 'square' | 'rounded'
  iconBorderRadius?: number
  iconPadding?: number
  iconShadow?: 'none' | 'sm' | 'md' | 'lg'
  iconPosition?: 'top' | 'left' | 'right' | 'background'
  
  // Icon Hover (Independent)
  iconHoverEffect?: 'none' | 'scale' | 'color' | 'bounce' | 'rotate'
  iconHoverScale?: number
  iconHoverColor?: string
  iconBgHoverColor?: string
  iconHoverDuration?: number

  // Title Settings
  showTitle?: boolean
  title?: string
  titleColor?: string
  titleFontSize?: string
  titleFontFamily?: string
  titleAlignment?: 'left' | 'center' | 'right'
  titleHoverEffect?: 'none' | 'color' | 'underline' | 'scale'

  // Subtitle Settings
  showSubtitle?: boolean
  subtitle?: string
  subtitleColor?: string
  subtitleFontSize?: string
  subtitleAlign?: 'left' | 'center' | 'right'
  subtitleHoverEffect?: 'none' | 'color' | 'italic'

  // Description Settings
  showDescription?: boolean
  description?: string
  descriptionColor?: string
  descriptionFontSize?: string
  descriptionAlign?: 'left' | 'center' | 'right'
  descriptionHoverEffect?: 'none' | 'color' | 'opacity'

  // Global Text Settings
  textAlignment?: 'left' | 'center' | 'right'
  lineHeight?: string
  textSpacing?: string
  fontFamily?: string

  // Badge Settings
  showBadge?: boolean
  badgeText?: string
  badgeColor?: string
  badgeTextColor?: string
  badgePosition?: 'top-left' | 'top-right'
  badgeShape?: 'pill' | 'rounded' | 'square'
  badgeHoverEffect?: 'none' | 'scale' | 'glow'

  // Button Settings
  showButton?: boolean
  buttonText?: string
  buttonLink?: string
  buttonStyle?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'glass' | '3d' | 'rounded-full'
  buttonColor?: string
  buttonTextColor?: string
  buttonAlignment?: 'left' | 'center' | 'right' | 'full-width'
  buttonIcon?: string
  buttonSize?: 'sm' | 'md' | 'lg' | 'xl'
  buttonRadius?: number
  buttonFullWidth?: boolean
  
  // Button Hover (Independent)
  buttonHoverEffect?: 'none' | 'scale' | 'glow' | 'slide' | 'bounce' | 'shine'
  buttonHoverColor?: string
  buttonTextHoverColor?: string

  // Whole Card Hover (Independent)
  cardHoverEffect?: 'none' | 'shadow' | 'scale' | 'lift' | 'glow' | 'border-glow' | 'tilt'
  cardHoverShadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  cardHoverScale?: number
  cardHoverTilt?: number
  cardHoverGlowColor?: string
  cardHoverGlowIntensity?: number
  cardHoverGradientFrom?: string
  cardHoverGradientTo?: string
  cardHoverDuration?: number

  // Card Style & Layout
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  padding?: number
  margin?: string
  width?: string
  height?: string

  // Animation
  animationType?: 'none' | 'fade-in' | 'slide-up' | 'zoom-in'
  animationDelay?: number
  hoverAnimation?: 'none' | 'glow' | 'pulse' | 'scale'
  transitionDuration?: number

  // Flip Feature
  enableFlip?: boolean
  flipOn?: 'hover' | 'click'
  flipDirection?: 'horizontal' | 'vertical'
  flipDuration?: number
  flipPerspective?: number

  // Visibility
  visible?: boolean
  id?: string
  
  // Editor Props
  onUpdate?: (props: any) => void
  onSelect?: () => void
  onComponentUpdate?: (props: any) => void
  [key: string]: any
}

// ✅ UPDATED: Default Props with ALL Enhancements
export const advancedCardDefaultProps = {
  // Image Settings
  showImage: true,
  image: "",
  alt: "Card Image",
  imagePosition: "top" as const,
  imageHeight: 200,
  imageWidth: 400,
  objectFit: "cover" as const,
  overlayColor: "rgba(0,0,0,0.4)",
  overlayOpacity: 0.4,
  imageShadow: "none" as const,
  imageBorderRadius: 8,
  
  // Image Hover
  imageHoverEffect: "none" as const,
  imageHoverZoom: 1.1,
  imageHoverBrightness: 1.2,
  imageHoverGrayscale: 100,
  imageHoverDuration: 0.3,

  // Icon Settings
  showIcon: false,
  icon: "FaStar",
  iconSize: 32,
  iconColor: "#ffffff",
  iconBackgroundColor: "#3b82f6",
  iconShape: "circle" as const,
  iconBorderRadius: 8,
  iconPadding: 12,
  iconShadow: "none" as const,
  iconPosition: "top" as const,
  
  // Icon Hover
  iconHoverEffect: "none" as const,
  iconHoverScale: 1.2,
  iconHoverColor: "#ffffff",
  iconBgHoverColor: "#2563eb",
  iconHoverDuration: 0.3,

  // Title Settings
  showTitle: true,
  title: "Elegant Modern Design",
  titleColor: "#000000",
  titleFontSize: "24px",
  titleFontFamily: "inherit",
  titleAlignment: "left" as const,
  titleHoverEffect: "none" as const,

  // Subtitle Settings
  showSubtitle: true,
  subtitle: "Beautiful and customizable card",
  subtitleColor: "#666666",
  subtitleFontSize: "16px",
  subtitleAlign: "left" as const,
  subtitleHoverEffect: "none" as const,

  // Description Settings
  showDescription: true,
  description: "A reusable, editable card component with full live sync.",
  descriptionColor: "#333333",
  descriptionFontSize: "14px",
  descriptionAlign: "left" as const,
  descriptionHoverEffect: "none" as const,

  // Global Text Settings
  textAlignment: "left" as const,
  lineHeight: "1.5",
  textSpacing: "0px",
  fontFamily: "inherit",

  // Badge Settings
  showBadge: true,
  badgeText: "New",
  badgeColor: "#2563eb",
  badgeTextColor: "#ffffff",
  badgePosition: "top-left" as const,
  badgeShape: "rounded" as const,
  badgeHoverEffect: "none" as const,

  // Button Settings
  showButton: true,
  buttonText: "Learn More",
  buttonLink: "#",
  buttonStyle: "primary" as const,
  buttonColor: "#3b82f6",
  buttonTextColor: "#ffffff",
  buttonAlignment: "left" as const,
  buttonIcon: "",
  buttonSize: "md" as const,
  buttonRadius: 8,
  buttonFullWidth: false,
  
  // Button Hover
  buttonHoverEffect: "none" as const,
  buttonHoverColor: "#2563eb",
  buttonTextHoverColor: "#ffffff",

  // Whole Card Hover
  cardHoverEffect: "none" as const,
  cardHoverShadow: "none" as const,
  cardHoverScale: 1.03,
  cardHoverTilt: 3,
  cardHoverGlowColor: "#3b82f6",
  cardHoverGlowIntensity: 0.3,
  cardHoverGradientFrom: "#3b82f6",
  cardHoverGradientTo: "#8b5cf6",
  cardHoverDuration: 0.3,

  // Card Style & Layout
  backgroundColor: "#ffffff",
  borderColor: "#e5e7eb",
  borderWidth: 1,
  borderRadius: 16,
  shadow: "md" as const,
  padding: 24,
  margin: "0px",
  width: "100%",
  height: "auto",

  // Animation
  animationType: "none" as const,
  animationDelay: 0,
  hoverAnimation: "none" as const,
  transitionDuration: 0.3,

  // Flip Feature
  enableFlip: false,
  flipOn: 'hover',
  flipDirection: 'horizontal',
  flipDuration: 0.6,
  flipPerspective: 1000,

  // Visibility
  visible: true,
  id: "",
};

// ✅ UPDATED: Schema with TOGGLE SWITCHES and ALL Enhancements
export const advancedCardSchema = {
  categories: [
    {
      id: 'image-settings',
      label: '📷 Image Settings',
      expanded: true
    },
    {
      id: 'image-hover',
      label: '✨ Image Hover Effects',
      expanded: false
    },
    {
      id: 'icon-settings',
      label: '🎨 Icon Settings',
      expanded: false
    },
    {
      id: 'icon-hover',
      label: '✨ Icon Hover Effects',
      expanded: false
    },
    {
      id: 'title-settings',
      label: '📝 Title Settings',
      expanded: false
    },
    {
      id: 'subtitle-settings',
      label: '📝 Subtitle Settings',
      expanded: false
    },
    {
      id: 'description-settings',
      label: '📝 Description Settings',
      expanded: false
    },
    {
      id: 'global-text',
      label: '🔤 Global Text Settings',
      expanded: false
    },
    {
      id: 'badge-settings',
      label: '🏷️ Badge Settings',
      expanded: false
    },
    {
      id: 'button-settings',
      label: '🔼 Button Settings',
      expanded: false
    },
    {
      id: 'button-hover',
      label: '✨ Button Hover Effects',
      expanded: false
    },
    {
      id: 'card-hover',
      label: '✨ Whole Card Hover Effects',
      expanded: false
    },
    {
      id: 'card-style',
      label: '🎨 Card Style & Layout',
      expanded: false
    },
    {
      id: 'animation',
      label: '🎬 Animation',
      expanded: false
    },
    {
      id: 'flip-feature',
      label: '🔄 Flip Feature',
      expanded: false
    },
    {
      id: 'visibility',
      label: '👁️ Visibility',
      expanded: false
    }
  ],
  properties: {
    // ==================== IMAGE SETTINGS ====================
    showImage: {
      type: 'toggle',
      label: 'Show Image',
      default: advancedCardDefaultProps.showImage,
      category: 'image-settings',
      description: 'Toggle to show/hide image section'
    },
    image: {
      type: 'image',
      label: 'Card Image',
      default: advancedCardDefaultProps.image,
      category: 'image-settings',
      accept: 'image/*',
      dependsOn: 'showImage',
      showIf: (props: any) => props.showImage === true
    },
    alt: {
      type: 'text',
      label: 'Image Alt Text',
      default: advancedCardDefaultProps.alt,
      category: 'image-settings',
      dependsOn: 'showImage',
      showIf: (props: any) => props.showImage === true
    },
    imagePosition: {
      type: 'select',
      label: 'Image Position',
      default: advancedCardDefaultProps.imagePosition,
      options: [
        { value: "top", label: "Top" },
        { value: "left", label: "Left" },
        { value: "right", label: "Right" },
        { value: "background", label: "Background" }
      ],
      category: 'image-settings',
      dependsOn: 'showImage',
      showIf: (props: any) => props.showImage === true
    },
    imageHeight: {
      type: 'number',
      label: 'Image Height (px)',
      min: 50,
      max: 1000,
      step: 10,
      default: advancedCardDefaultProps.imageHeight,
      category: 'image-settings',
      dependsOn: 'showImage',
      showIf: (props: any) => props.showImage === true
    },
    imageWidth: {
      type: 'number',
      label: 'Image Width (px)',
      min: 50,
      max: 2000,
      step: 10,
      default: advancedCardDefaultProps.imageWidth,
      category: 'image-settings',
      dependsOn: 'showImage',
      showIf: (props: any) => props.showImage === true
    },
    objectFit: {
      type: 'select',
      label: 'Object Fit',
      default: advancedCardDefaultProps.objectFit,
      options: [
        { value: 'cover', label: 'Cover' },
        { value: 'contain', label: 'Contain' },
        { value: 'fill', label: 'Fill' },
        { value: 'none', label: 'None' }
      ],
      category: 'image-settings',
      dependsOn: 'showImage',
      showIf: (props: any) => props.showImage === true
    },
    overlayColor: {
      type: 'color',
      label: 'Overlay Color',
      default: advancedCardDefaultProps.overlayColor,
      category: 'image-settings',
      dependsOn: ['showImage', 'imagePosition'],
      showIf: (props: any) => props.showImage === true && props.imagePosition === 'background'
    },
    overlayOpacity: {
      type: 'number',
      label: 'Overlay Opacity',
      min: 0,
      max: 1,
      step: 0.1,
      default: advancedCardDefaultProps.overlayOpacity,
      category: 'image-settings',
      dependsOn: ['showImage', 'imagePosition'],
      showIf: (props: any) => props.showImage === true && props.imagePosition === 'background'
    },
    imageShadow: {
      type: 'select',
      label: 'Image Shadow',
      default: advancedCardDefaultProps.imageShadow,
      options: [
        { value: 'none', label: 'None' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' }
      ],
      category: 'image-settings',
      dependsOn: 'showImage',
      showIf: (props: any) => props.showImage === true
    },
    imageBorderRadius: {
      type: 'number',
      label: 'Image Border Radius (px)',
      min: 0,
      max: 50,
      step: 1,
      default: advancedCardDefaultProps.imageBorderRadius,
      category: 'image-settings',
      dependsOn: 'showImage',
      showIf: (props: any) => props.showImage === true
    },

    // ==================== IMAGE HOVER EFFECTS ====================
    imageHoverEffect: {
      type: 'select',
      label: 'Image Hover Effect',
      default: advancedCardDefaultProps.imageHoverEffect,
      options: [
        { value: 'none', label: 'No Hover Effect' },
        { value: 'zoom', label: 'Zoom In' },
        { value: 'fade', label: 'Fade' },
        { value: 'grayscale', label: 'Grayscale' },
        { value: 'brighten', label: 'Brighten' }
      ],
      category: 'image-hover',
      dependsOn: 'showImage',
      showIf: (props: any) => props.showImage === true
    },
    imageHoverZoom: {
      type: 'number',
      label: 'Zoom Amount',
      min: 1,
      max: 2,
      step: 0.1,
      default: advancedCardDefaultProps.imageHoverZoom,
      category: 'image-hover',
      dependsOn: ['showImage', 'imageHoverEffect'],
      showIf: (props: any) => props.showImage === true && props.imageHoverEffect === 'zoom'
    },
    imageHoverBrightness: {
      type: 'number',
      label: 'Brightness Amount',
      min: 1,
      max: 2,
      step: 0.1,
      default: advancedCardDefaultProps.imageHoverBrightness,
      category: 'image-hover',
      dependsOn: ['showImage', 'imageHoverEffect'],
      showIf: (props: any) => props.showImage === true && props.imageHoverEffect === 'brighten'
    },
    imageHoverGrayscale: {
      type: 'number',
      label: 'Grayscale Amount (%)',
      min: 0,
      max: 100,
      step: 10,
      default: advancedCardDefaultProps.imageHoverGrayscale,
      category: 'image-hover',
      dependsOn: ['showImage', 'imageHoverEffect'],
      showIf: (props: any) => props.showImage === true && props.imageHoverEffect === 'grayscale'
    },
    imageHoverDuration: {
      type: 'number',
      label: 'Hover Duration (s)',
      min: 0.1,
      max: 2,
      step: 0.1,
      default: advancedCardDefaultProps.imageHoverDuration,
      category: 'image-hover',
      dependsOn: ['showImage', 'imageHoverEffect'],
      showIf: (props: any) => props.showImage === true && props.imageHoverEffect !== 'none'
    },

    // ==================== ICON SETTINGS ====================
    showIcon: {
      type: 'toggle',
      label: 'Show Icon',
      default: advancedCardDefaultProps.showIcon,
      category: 'icon-settings',
      description: 'Toggle to show/hide icon section'
    },
    icon: {
      type: 'text',
      label: 'FontAwesome Icon Name',
      default: advancedCardDefaultProps.icon,
      placeholder: 'FaStar, FaReact, FaUser, FaHome...',
      description: 'Enter FontAwesome icon name starting with "Fa"',
      category: 'icon-settings',
      dependsOn: 'showIcon',
      showIf: (props: any) => props.showIcon === true
    },
    iconSize: {
      type: 'number',
      label: 'Icon Size (px)',
      min: 16,
      max: 100,
      step: 2,
      default: advancedCardDefaultProps.iconSize,
      category: 'icon-settings',
      dependsOn: 'showIcon',
      showIf: (props: any) => props.showIcon === true
    },
    iconColor: {
      type: 'color',
      label: 'Icon Color',
      default: advancedCardDefaultProps.iconColor,
      category: 'icon-settings',
      dependsOn: 'showIcon',
      showIf: (props: any) => props.showIcon === true
    },
    iconBackgroundColor: {
      type: 'color',
      label: 'Icon Background Color',
      default: advancedCardDefaultProps.iconBackgroundColor,
      category: 'icon-settings',
      dependsOn: 'showIcon',
      showIf: (props: any) => props.showIcon === true
    },
    iconShape: {
      type: 'select',
      label: 'Icon Shape',
      default: advancedCardDefaultProps.iconShape,
      options: [
        { value: 'circle', label: 'Circle' },
        { value: 'square', label: 'Square' },
        { value: 'rounded', label: 'Rounded' }
      ],
      category: 'icon-settings',
      dependsOn: 'showIcon',
      showIf: (props: any) => props.showIcon === true
    },
    iconBorderRadius: {
      type: 'number',
      label: 'Icon Border Radius (px)',
      min: 0,
      max: 50,
      step: 1,
      default: advancedCardDefaultProps.iconBorderRadius,
      category: 'icon-settings',
      dependsOn: ['showIcon', 'iconShape'],
      showIf: (props: any) => props.showIcon === true && props.iconShape === 'rounded'
    },
    iconPadding: {
      type: 'number',
      label: 'Icon Padding (px)',
      min: 0,
      max: 40,
      step: 2,
      default: advancedCardDefaultProps.iconPadding,
      category: 'icon-settings',
      dependsOn: 'showIcon',
      showIf: (props: any) => props.showIcon === true
    },
    iconShadow: {
      type: 'select',
      label: 'Icon Shadow',
      default: advancedCardDefaultProps.iconShadow,
      options: [
        { value: 'none', label: 'None' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' }
      ],
      category: 'icon-settings',
      dependsOn: 'showIcon',
      showIf: (props: any) => props.showIcon === true
    },
    iconPosition: {
      type: 'select',
      label: 'Icon Position',
      default: advancedCardDefaultProps.iconPosition,
      options: [
        { value: "top", label: "Top" },
        { value: "left", label: "Left" },
        { value: "right", label: "Right" },
        { value: "background", label: "Background" }
      ],
      category: 'icon-settings',
      dependsOn: 'showIcon',
      showIf: (props: any) => props.showIcon === true
    },

    // ==================== ICON HOVER EFFECTS ====================
    iconHoverEffect: {
      type: 'select',
      label: 'Icon Hover Effect',
      default: advancedCardDefaultProps.iconHoverEffect,
      options: [
        { value: 'none', label: 'No Hover Effect' },
        { value: 'scale', label: 'Scale' },
        { value: 'color', label: 'Color Change' },
        { value: 'bounce', label: 'Bounce' },
        { value: 'rotate', label: 'Rotate' }
      ],
      category: 'icon-hover',
      dependsOn: 'showIcon',
      showIf: (props: any) => props.showIcon === true
    },
    iconHoverScale: {
      type: 'number',
      label: 'Scale Amount',
      min: 1,
      max: 2,
      step: 0.1,
      default: advancedCardDefaultProps.iconHoverScale,
      category: 'icon-hover',
      dependsOn: ['showIcon', 'iconHoverEffect'],
      showIf: (props: any) => props.showIcon === true && props.iconHoverEffect === 'scale'
    },
    iconHoverColor: {
      type: 'color',
      label: 'Icon Hover Color',
      default: advancedCardDefaultProps.iconHoverColor,
      category: 'icon-hover',
      dependsOn: ['showIcon', 'iconHoverEffect'],
      showIf: (props: any) => props.showIcon === true && props.iconHoverEffect === 'color'
    },
    iconBgHoverColor: {
      type: 'color',
      label: 'Icon Background Hover Color',
      default: advancedCardDefaultProps.iconBgHoverColor,
      category: 'icon-hover',
      dependsOn: ['showIcon', 'iconHoverEffect'],
      showIf: (props: any) => props.showIcon === true && props.iconHoverEffect === 'color'
    },
    iconHoverDuration: {
      type: 'number',
      label: 'Hover Duration (s)',
      min: 0.1,
      max: 2,
      step: 0.1,
      default: advancedCardDefaultProps.iconHoverDuration,
      category: 'icon-hover',
      dependsOn: ['showIcon', 'iconHoverEffect'],
      showIf: (props: any) => props.showIcon === true && props.iconHoverEffect !== 'none'
    },

    // ==================== TITLE SETTINGS ====================
    showTitle: {
      type: 'toggle',
      label: 'Show Title',
      default: advancedCardDefaultProps.showTitle,
      category: 'title-settings',
      description: 'Toggle to show/hide title'
    },
    title: {
      type: 'text',
      label: 'Title Text',
      default: advancedCardDefaultProps.title,
      category: 'title-settings',
      dependsOn: 'showTitle',
      showIf: (props: any) => props.showTitle === true
    },
    titleColor: {
      type: 'color',
      label: 'Title Color',
      default: advancedCardDefaultProps.titleColor,
      category: 'title-settings',
      dependsOn: 'showTitle',
      showIf: (props: any) => props.showTitle === true
    },
    titleFontSize: {
      type: 'text',
      label: 'Title Font Size',
      default: advancedCardDefaultProps.titleFontSize,
      category: 'title-settings',
      dependsOn: 'showTitle',
      showIf: (props: any) => props.showTitle === true
    },
    titleFontFamily: {
      type: 'text',
      label: 'Title Font Family',
      default: advancedCardDefaultProps.titleFontFamily,
      category: 'title-settings',
      dependsOn: 'showTitle',
      showIf: (props: any) => props.showTitle === true
    },
    titleAlignment: {
      type: 'select',
      label: 'Title Alignment',
      default: advancedCardDefaultProps.titleAlignment,
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" }
      ],
      category: 'title-settings',
      dependsOn: 'showTitle',
      showIf: (props: any) => props.showTitle === true
    },
    titleHoverEffect: {
      type: 'select',
      label: 'Title Hover Effect',
      default: advancedCardDefaultProps.titleHoverEffect,
      options: [
        { value: 'none', label: 'No Hover Effect' },
        { value: 'color', label: 'Color Change' },
        { value: 'underline', label: 'Underline' },
        { value: 'scale', label: 'Scale' }
      ],
      category: 'title-settings',
      dependsOn: 'showTitle',
      showIf: (props: any) => props.showTitle === true
    },

    // ==================== SUBTITLE SETTINGS ====================
    showSubtitle: {
      type: 'toggle',
      label: 'Show Subtitle',
      default: advancedCardDefaultProps.showSubtitle,
      category: 'subtitle-settings',
      description: 'Toggle to show/hide subtitle'
    },
    subtitle: {
      type: 'text',
      label: 'Subtitle Text',
      default: advancedCardDefaultProps.subtitle,
      category: 'subtitle-settings',
      dependsOn: 'showSubtitle',
      showIf: (props: any) => props.showSubtitle === true
    },
    subtitleColor: {
      type: 'color',
      label: 'Subtitle Color',
      default: advancedCardDefaultProps.subtitleColor,
      category: 'subtitle-settings',
      dependsOn: 'showSubtitle',
      showIf: (props: any) => props.showSubtitle === true
    },
    subtitleFontSize: {
      type: 'text',
      label: 'Subtitle Font Size',
      default: advancedCardDefaultProps.subtitleFontSize,
      category: 'subtitle-settings',
      dependsOn: 'showSubtitle',
      showIf: (props: any) => props.showSubtitle === true
    },
    subtitleAlign: {
      type: 'select',
      label: 'Subtitle Alignment',
      default: advancedCardDefaultProps.subtitleAlign,
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" }
      ],
      category: 'subtitle-settings',
      dependsOn: 'showSubtitle',
      showIf: (props: any) => props.showSubtitle === true
    },
    subtitleHoverEffect: {
      type: 'select',
      label: 'Subtitle Hover Effect',
      default: advancedCardDefaultProps.subtitleHoverEffect,
      options: [
        { value: 'none', label: 'No Hover Effect' },
        { value: 'color', label: 'Color Change' },
        { value: 'italic', label: 'Italic' }
      ],
      category: 'subtitle-settings',
      dependsOn: 'showSubtitle',
      showIf: (props: any) => props.showSubtitle === true
    },

    // ==================== DESCRIPTION SETTINGS ====================
    showDescription: {
      type: 'toggle',
      label: 'Show Description',
      default: advancedCardDefaultProps.showDescription,
      category: 'description-settings',
      description: 'Toggle to show/hide description'
    },
    description: {
      type: 'textarea',
      label: 'Description Text',
      default: advancedCardDefaultProps.description,
      category: 'description-settings',
      dependsOn: 'showDescription',
      showIf: (props: any) => props.showDescription === true
    },
    descriptionColor: {
      type: 'color',
      label: 'Description Color',
      default: advancedCardDefaultProps.descriptionColor,
      category: 'description-settings',
      dependsOn: 'showDescription',
      showIf: (props: any) => props.showDescription === true
    },
    descriptionFontSize: {
      type: 'text',
      label: 'Description Font Size',
      default: advancedCardDefaultProps.descriptionFontSize,
      category: 'description-settings',
      dependsOn: 'showDescription',
      showIf: (props: any) => props.showDescription === true
    },
    descriptionAlign: {
      type: 'select',
      label: 'Description Alignment',
      default: advancedCardDefaultProps.descriptionAlign,
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" }
      ],
      category: 'description-settings',
      dependsOn: 'showDescription',
      showIf: (props: any) => props.showDescription === true
    },
    descriptionHoverEffect: {
      type: 'select',
      label: 'Description Hover Effect',
      default: advancedCardDefaultProps.descriptionHoverEffect,
      options: [
        { value: 'none', label: 'No Hover Effect' },
        { value: 'color', label: 'Color Change' },
        { value: 'opacity', label: 'Opacity Change' }
      ],
      category: 'description-settings',
      dependsOn: 'showDescription',
      showIf: (props: any) => props.showDescription === true
    },

    // ==================== GLOBAL TEXT SETTINGS ====================
    textAlignment: {
      type: 'select',
      label: 'Global Text Alignment',
      default: advancedCardDefaultProps.textAlignment,
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" }
      ],
      category: 'global-text'
    },
    lineHeight: {
      type: 'text',
      label: 'Line Height',
      default: advancedCardDefaultProps.lineHeight,
      category: 'global-text'
    },
    textSpacing: {
      type: 'text',
      label: 'Text Spacing',
      default: advancedCardDefaultProps.textSpacing,
      category: 'global-text'
    },
    fontFamily: {
      type: 'text',
      label: 'Global Font Family',
      default: advancedCardDefaultProps.fontFamily,
      category: 'global-text'
    },

    // ==================== BADGE SETTINGS ====================
    showBadge: {
      type: 'toggle',
      label: 'Show Badge',
      default: advancedCardDefaultProps.showBadge,
      category: 'badge-settings',
      description: 'Toggle to show/hide badge'
    },
    badgeText: {
      type: 'text',
      label: 'Badge Text',
      default: advancedCardDefaultProps.badgeText,
      category: 'badge-settings',
      dependsOn: 'showBadge',
      showIf: (props: any) => props.showBadge === true
    },
    badgeColor: {
      type: 'color',
      label: 'Badge Color',
      default: advancedCardDefaultProps.badgeColor,
      category: 'badge-settings',
      dependsOn: 'showBadge',
      showIf: (props: any) => props.showBadge === true
    },
    badgeTextColor: {
      type: 'color',
      label: 'Badge Text Color',
      default: advancedCardDefaultProps.badgeTextColor,
      category: 'badge-settings',
      dependsOn: 'showBadge',
      showIf: (props: any) => props.showBadge === true
    },
    badgePosition: {
      type: 'select',
      label: 'Badge Position',
      default: advancedCardDefaultProps.badgePosition,
      options: [
        { value: "top-left", label: "Top Left" },
        { value: "top-right", label: "Top Right" }
      ],
      category: 'badge-settings',
      dependsOn: 'showBadge',
      showIf: (props: any) => props.showBadge === true
    },
    badgeShape: {
      type: 'select',
      label: 'Badge Shape',
      default: advancedCardDefaultProps.badgeShape,
      options: [
        { value: 'pill', label: 'Pill' },
        { value: 'rounded', label: 'Rounded' },
        { value: 'square', label: 'Square' }
      ],
      category: 'badge-settings',
      dependsOn: 'showBadge',
      showIf: (props: any) => props.showBadge === true
    },
    badgeHoverEffect: {
      type: 'select',
      label: 'Badge Hover Effect',
      default: advancedCardDefaultProps.badgeHoverEffect,
      options: [
        { value: 'none', label: 'No Hover Effect' },
        { value: 'scale', label: 'Scale' },
        { value: 'glow', label: 'Glow' }
      ],
      category: 'badge-settings',
      dependsOn: 'showBadge',
      showIf: (props: any) => props.showBadge === true
    },

    // ==================== BUTTON SETTINGS ====================
    showButton: {
      type: 'toggle',
      label: 'Show Button',
      default: advancedCardDefaultProps.showButton,
      category: 'button-settings',
      description: 'Toggle to show/hide button'
    },
    buttonText: {
      type: 'text',
      label: 'Button Text',
      default: advancedCardDefaultProps.buttonText,
      category: 'button-settings',
      dependsOn: 'showButton',
      showIf: (props: any) => props.showButton === true
    },
    buttonLink: {
      type: 'text',
      label: 'Button Link',
      default: advancedCardDefaultProps.buttonLink,
      category: 'button-settings',
      dependsOn: 'showButton',
      showIf: (props: any) => props.showButton === true
    },
    buttonStyle: {
      type: 'select',
      label: 'Button Style',
      default: advancedCardDefaultProps.buttonStyle,
      options: [
        { value: "primary", label: "Primary" },
        { value: "secondary", label: "Secondary" },
        { value: "outline", label: "Outline" },
        { value: "ghost", label: "Ghost" },
        { value: "gradient", label: "Gradient" },
        { value: "glass", label: "Glass" },
        { value: "3d", label: "3D Effect" },
        { value: "rounded-full", label: "Pill (Rounded Full)" }
      ],
      category: 'button-settings',
      dependsOn: 'showButton',
      showIf: (props: any) => props.showButton === true
    },
    buttonColor: {
      type: 'color',
      label: 'Button Color',
      default: advancedCardDefaultProps.buttonColor,
      category: 'button-settings',
      dependsOn: 'showButton',
      showIf: (props: any) => props.showButton === true
    },
    buttonTextColor: {
      type: 'color',
      label: 'Button Text Color',
      default: advancedCardDefaultProps.buttonTextColor,
      category: 'button-settings',
      dependsOn: 'showButton',
      showIf: (props: any) => props.showButton === true
    },
    buttonAlignment: {
      type: 'select',
      label: 'Button Alignment',
      default: advancedCardDefaultProps.buttonAlignment,
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
        { value: "full-width", label: "Full Width" }
      ],
      category: 'button-settings',
      dependsOn: 'showButton',
      showIf: (props: any) => props.showButton === true
    },
    buttonIcon: {
      type: 'text',
      label: 'Button Icon',
      default: advancedCardDefaultProps.buttonIcon,
      category: 'button-settings',
      dependsOn: 'showButton',
      showIf: (props: any) => props.showButton === true
    },
    buttonSize: {
      type: 'select',
      label: 'Button Size',
      default: advancedCardDefaultProps.buttonSize,
      options: [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' }
      ],
      category: 'button-settings',
      dependsOn: 'showButton',
      showIf: (props: any) => props.showButton === true
    },
    buttonRadius: {
      type: 'number',
      label: 'Button Border Radius (px)',
      min: 0,
      max: 50,
      step: 1,
      default: advancedCardDefaultProps.buttonRadius,
      category: 'button-settings',
      dependsOn: 'showButton',
      showIf: (props: any) => props.showButton === true
    },
    buttonFullWidth: {
      type: 'toggle',
      label: 'Full Width Button',
      default: advancedCardDefaultProps.buttonFullWidth,
      category: 'button-settings',
      dependsOn: 'showButton',
      showIf: (props: any) => props.showButton === true
    },

    // ==================== BUTTON HOVER EFFECTS ====================
    buttonHoverEffect: {
      type: 'select',
      label: 'Button Hover Effect',
      default: advancedCardDefaultProps.buttonHoverEffect,
      options: [
        { value: 'none', label: 'No Hover Effect' },
        { value: 'scale', label: 'Scale' },
        { value: 'glow', label: 'Glow' },
        { value: 'slide', label: 'Slide' },
        { value: 'bounce', label: 'Bounce' },
        { value: 'shine', label: 'Shine' }
      ],
      category: 'button-hover',
      dependsOn: 'showButton',
      showIf: (props: any) => props.showButton === true
    },
    buttonHoverColor: {
      type: 'color',
      label: 'Button Hover Color',
      default: advancedCardDefaultProps.buttonHoverColor,
      category: 'button-hover',
      dependsOn: ['showButton', 'buttonHoverEffect'],
      showIf: (props: any) => props.showButton === true && props.buttonHoverEffect !== 'none'
    },
    buttonTextHoverColor: {
      type: 'color',
      label: 'Button Text Hover Color',
      default: advancedCardDefaultProps.buttonTextHoverColor,
      category: 'button-hover',
      dependsOn: ['showButton', 'buttonHoverEffect'],
      showIf: (props: any) => props.showButton === true && props.buttonHoverEffect !== 'none'
    },

    // ==================== WHOLE CARD HOVER EFFECTS ====================
    cardHoverEffect: {
      type: 'select',
      label: 'Card Hover Effect',
      default: advancedCardDefaultProps.cardHoverEffect,
      options: [
        { value: 'none', label: 'No Hover Effect' },
        { value: 'shadow', label: 'Shadow' },
        { value: 'scale', label: 'Scale Up' },
        { value: 'lift', label: 'Lift Up' },
        { value: 'glow', label: 'Glow' },
        { value: 'border-glow', label: 'Border Glow' },
        { value: 'tilt', label: '3D Tilt' }
      ],
      category: 'card-hover'
    },
    cardHoverShadow: {
      type: 'select',
      label: 'Hover Shadow',
      default: advancedCardDefaultProps.cardHoverShadow,
      options: [
        { value: 'none', label: 'None' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' }
      ],
      category: 'card-hover',
      dependsOn: 'cardHoverEffect',
      showIf: (props: any) => props.cardHoverEffect === 'shadow' || props.cardHoverEffect === 'lift'
    },
    cardHoverScale: {
      type: 'number',
      label: 'Scale Amount',
      min: 1,
      max: 1.5,
      step: 0.01,
      default: advancedCardDefaultProps.cardHoverScale,
      category: 'card-hover',
      dependsOn: 'cardHoverEffect',
      showIf: (props: any) => props.cardHoverEffect === 'scale'
    },
    cardHoverTilt: {
      type: 'number',
      label: 'Tilt Angle (degrees)',
      min: 0,
      max: 20,
      step: 1,
      default: advancedCardDefaultProps.cardHoverTilt,
      category: 'card-hover',
      dependsOn: 'cardHoverEffect',
      showIf: (props: any) => props.cardHoverEffect === 'tilt'
    },
    cardHoverGlowColor: {
      type: 'color',
      label: 'Glow Color',
      default: advancedCardDefaultProps.cardHoverGlowColor,
      category: 'card-hover',
      dependsOn: 'cardHoverEffect',
      showIf: (props: any) => props.cardHoverEffect === 'glow' || props.cardHoverEffect === 'border-glow'
    },
    cardHoverGlowIntensity: {
      type: 'number',
      label: 'Glow Intensity',
      min: 0,
      max: 1,
      step: 0.1,
      default: advancedCardDefaultProps.cardHoverGlowIntensity,
      category: 'card-hover',
      dependsOn: 'cardHoverEffect',
      showIf: (props: any) => props.cardHoverEffect === 'glow' || props.cardHoverEffect === 'border-glow'
    },
    cardHoverGradientFrom: {
      type: 'color',
      label: 'Gradient Start Color',
      default: advancedCardDefaultProps.cardHoverGradientFrom,
      category: 'card-hover',
      dependsOn: 'cardHoverEffect',
      showIf: (props: any) => props.cardHoverEffect === 'gradient-shift'
    },
    cardHoverGradientTo: {
      type: 'color',
      label: 'Gradient End Color',
      default: advancedCardDefaultProps.cardHoverGradientTo,
      category: 'card-hover',
      dependsOn: 'cardHoverEffect',
      showIf: (props: any) => props.cardHoverEffect === 'gradient-shift'
    },
    cardHoverDuration: {
      type: 'number',
      label: 'Hover Duration (s)',
      min: 0.1,
      max: 2,
      step: 0.1,
      default: advancedCardDefaultProps.cardHoverDuration,
      category: 'card-hover',
      dependsOn: 'cardHoverEffect',
      showIf: (props: any) => props.cardHoverEffect !== 'none'
    },

    // ==================== CARD STYLE & LAYOUT ====================
    backgroundColor: {
      type: 'color',
      label: 'Background Color',
      default: advancedCardDefaultProps.backgroundColor,
      category: 'card-style'
    },
    borderColor: {
      type: 'color',
      label: 'Border Color',
      default: advancedCardDefaultProps.borderColor,
      category: 'card-style'
    },
    borderWidth: {
      type: 'number',
      label: 'Border Width (px)',
      min: 0,
      max: 10,
      step: 1,
      default: advancedCardDefaultProps.borderWidth,
      category: 'card-style'
    },
    borderRadius: {
      type: 'number',
      label: 'Border Radius (px)',
      min: 0,
      max: 50,
      default: advancedCardDefaultProps.borderRadius,
      category: 'card-style'
    },
    shadow: {
      type: 'select',
      label: 'Card Shadow',
      default: advancedCardDefaultProps.shadow,
      options: [
        { value: 'none', label: 'None' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' }
      ],
      category: 'card-style'
    },
    padding: {
      type: 'number',
      label: 'Padding (px)',
      min: 0,
      max: 100,
      default: advancedCardDefaultProps.padding,
      category: 'card-style'
    },
    margin: {
      type: 'text',
      label: 'Margin',
      default: advancedCardDefaultProps.margin,
      category: 'card-style'
    },
    width: {
      type: 'text',
      label: 'Width',
      default: advancedCardDefaultProps.width,
      category: 'card-style'
    },
    height: {
      type: 'text',
      label: 'Height',
      default: advancedCardDefaultProps.height,
      category: 'card-style'
    },

    // ==================== ANIMATION ====================
    animationType: {
      type: 'select',
      label: 'Entrance Animation',
      default: advancedCardDefaultProps.animationType,
      options: [
        { value: "none", label: "None" },
        { value: "fade-in", label: "Fade In" },
        { value: "slide-up", label: "Slide Up" },
        { value: "zoom-in", label: "Zoom In" }
      ],
      category: 'animation'
    },
    animationDelay: {
      type: 'number',
      label: 'Animation Delay (ms)',
      default: advancedCardDefaultProps.animationDelay,
      category: 'animation',
      dependsOn: 'animationType',
      showIf: (props: any) => props.animationType !== 'none'
    },
    hoverAnimation: {
      type: 'select',
      label: 'Hover Animation',
      default: advancedCardDefaultProps.hoverAnimation,
      options: [
        { value: "none", label: "None" },
        { value: "glow", label: "Glow" },
        { value: "pulse", label: "Pulse" },
        { value: "scale", label: "Scale" }
      ],
      category: 'animation'
    },
    transitionDuration: {
      type: 'number',
      label: 'Transition Duration (s)',
      min: 0.1,
      max: 5,
      step: 0.1,
      default: advancedCardDefaultProps.transitionDuration,
      category: 'animation'
    },

    // ==================== FLIP FEATURE ====================
    enableFlip: {
      type: 'toggle',
      label: 'Enable Flip Effect',
      default: advancedCardDefaultProps.enableFlip,
      category: 'flip-feature',
      description: 'Toggle to enable/disable flip feature'
    },
    flipOn: {
      type: 'select',
      label: 'Flip Trigger',
      default: advancedCardDefaultProps.flipOn,
      options: [
        { value: 'hover', label: 'On Hover' },
        { value: 'click', label: 'On Click' }
      ],
      category: 'flip-feature',
      dependsOn: 'enableFlip',
      showIf: (props: any) => props.enableFlip === true
    },
    flipDirection: {
      type: 'select',
      label: 'Flip Direction',
      default: advancedCardDefaultProps.flipDirection,
      options: [
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'vertical', label: 'Vertical' }
      ],
      category: 'flip-feature',
      dependsOn: 'enableFlip',
      showIf: (props: any) => props.enableFlip === true
    },
    flipDuration: {
      type: 'number',
      label: 'Flip Duration (s)',
      min: 0.1,
      max: 5,
      step: 0.1,
      default: advancedCardDefaultProps.flipDuration,
      category: 'flip-feature',
      dependsOn: 'enableFlip',
      showIf: (props: any) => props.enableFlip === true
    },
    flipPerspective: {
      type: 'number',
      label: '3D Perspective (px)',
      min: 0,
      max: 5000,
      step: 100,
      default: advancedCardDefaultProps.flipPerspective,
      category: 'flip-feature',
      dependsOn: 'enableFlip',
      showIf: (props: any) => props.enableFlip === true
    },

    // ==================== VISIBILITY ====================
    visible: {
      type: 'toggle',
      label: 'Visible',
      default: advancedCardDefaultProps.visible,
      category: 'visibility'
    },
    id: {
      type: 'text',
      label: 'Element ID',
      default: advancedCardDefaultProps.id,
      category: 'visibility'
    },
  },
} as any;

// Advanced Card Component
const AdvancedCardComponent: React.FC<AdvancedCardComponentProps> = (props) => {
  const [imageError, setImageError] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isIconHovered, setIsIconHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isBadgeHovered, setIsBadgeHovered] = useState(false);
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [isSubtitleHovered, setIsSubtitleHovered] = useState(false);
  const [isDescriptionHovered, setIsDescriptionHovered] = useState(false);
  const [isEditor, setIsEditor] = useState(false);

  // Merge props with defaults
  const componentProps = { ...advancedCardDefaultProps, ...props };

  useEffect(() => {
    setImageError(false);
  }, [componentProps.image]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsEditor(Boolean(document.querySelector('.cm-page-editor')));
    }
  }, []);

  // ✅ Function to get ANY FontAwesome icon
  const getIconComponent = () => {
    let iconName = componentProps.icon || 'FaStar';
    
    if (!iconName.startsWith('Fa')) {
      iconName = 'Fa' + iconName.charAt(0).toUpperCase() + iconName.slice(1);
    }
    
    const IconComponent = FaIcons[iconName as keyof typeof FaIcons];
    
    if (!IconComponent) {
      return <FaIcons.FaStar size={componentProps.iconSize} color={componentProps.iconColor} />;
    }
    
    return <IconComponent size={componentProps.iconSize} color={componentProps.iconColor} />;
  };

  // ✅ WHOLE CARD HOVER EFFECTS
  const getCardHoverStyle = () => {
    if (!isCardHovered || componentProps.cardHoverEffect === 'none') return {};
    
    const baseTransition = `all ${componentProps.cardHoverDuration}s ease`;
    
    switch (componentProps.cardHoverEffect) {
      case 'scale':
        return {
          transform: `scale(${componentProps.cardHoverScale})`,
          transition: baseTransition,
          zIndex: 10
        };
        
      case 'lift':
        return {
          transform: 'translateY(-8px)',
          boxShadow: getCardHoverShadow(),
          transition: baseTransition,
          zIndex: 10
        };
        
      case 'shadow':
        return {
          boxShadow: getCardHoverShadow(),
          transition: baseTransition
        };
        
      case 'glow':
        const opacity = Math.round(componentProps.cardHoverGlowIntensity * 255).toString(16).padStart(2, '0');
        return {
          boxShadow: `0 0 20px ${componentProps.cardHoverGlowColor}${opacity}`,
          transition: baseTransition
        };
        
      case 'border-glow':
        const borderOpacity = Math.round(componentProps.cardHoverGlowIntensity * 255).toString(16).padStart(2, '0');
        return {
          boxShadow: `0 0 0 2px ${componentProps.cardHoverGlowColor}${borderOpacity}`,
          transition: baseTransition
        };
        
      case 'tilt':
        return {
          transform: `perspective(1000px) rotateX(${componentProps.cardHoverTilt}deg) rotateY(${componentProps.cardHoverTilt}deg)`,
          transition: baseTransition,
          zIndex: 10
        };
        
      default:
        return {};
    }
  };

  const getCardHoverShadow = () => {
    switch (componentProps.cardHoverShadow) {
      case 'none': return 'none';
      case 'sm': return '0 4px 12px rgba(0,0,0,0.15)';
      case 'md': return '0 8px 24px rgba(0,0,0,0.15)';
      case 'lg': return '0 12px 36px rgba(0,0,0,0.15)';
      case 'xl': return '0 20px 48px rgba(0,0,0,0.15)';
      default: return '0 8px 24px rgba(0,0,0,0.15)';
    }
  };

  // ✅ IMAGE HOVER EFFECTS (Independent)
  const getImageHoverStyle = () => {
    if (!isImageHovered || componentProps.imageHoverEffect === 'none') return {};
    
    switch (componentProps.imageHoverEffect) {
      case 'zoom':
        return {
          transform: `scale(${componentProps.imageHoverZoom})`,
          transition: `transform ${componentProps.imageHoverDuration}s ease`
        };
      case 'fade':
        return {
          opacity: 0.7,
          transition: `opacity ${componentProps.imageHoverDuration}s ease`
        };
      case 'grayscale':
        return {
          filter: `grayscale(${componentProps.imageHoverGrayscale}%)`,
          transition: `filter ${componentProps.imageHoverDuration}s ease`
        };
      case 'brighten':
        return {
          filter: `brightness(${componentProps.imageHoverBrightness})`,
          transition: `filter ${componentProps.imageHoverDuration}s ease`
        };
      default:
        return {};
    }
  };

  // ✅ ICON HOVER EFFECTS (Independent)
  const getIconHoverStyle = () => {
    if (!isIconHovered || componentProps.iconHoverEffect === 'none') return {};
    
    switch (componentProps.iconHoverEffect) {
      case 'scale':
        return {
          transform: `scale(${componentProps.iconHoverScale})`,
          transition: `transform ${componentProps.iconHoverDuration}s ease`
        };
      case 'color':
        return {
          color: componentProps.iconHoverColor,
          backgroundColor: componentProps.iconBgHoverColor,
          transition: `all ${componentProps.iconHoverDuration}s ease`
        };
      case 'bounce':
        return {
          animation: `bounce ${componentProps.iconHoverDuration}s ease infinite`
        };
      case 'rotate':
        return {
          transform: 'rotate(360deg)',
          transition: `transform ${componentProps.iconHoverDuration}s ease`
        };
      default:
        return {};
    }
  };

  // ✅ ENHANCED BUTTON HOVER EFFECTS
  const getButtonHoverStyle = () => {
    if (!isButtonHovered || componentProps.buttonHoverEffect === 'none') return {};
    
    switch (componentProps.buttonHoverEffect) {
      case 'scale':
        return {
          transform: 'scale(1.05)',
          transition: 'transform 0.2s ease'
        };
      case 'glow':
        return {
          boxShadow: `0 0 15px ${componentProps.buttonHoverColor || componentProps.buttonColor}80`,
          transition: 'box-shadow 0.2s ease'
        };
      case 'slide':
        return {
          transform: 'translateX(5px)',
          transition: 'transform 0.2s ease'
        };
      case 'bounce':
        return {
          transform: 'translateY(-2px)',
          transition: 'transform 0.2s ease'
        };
      case 'shine':
        return {
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
          backgroundSize: '200% 100%',
          animation: 'shine 1.5s ease'
        };
      default:
        return {};
    }
  };

  // ✅ TEXT HOVER EFFECTS (Independent)
  const getTitleHoverStyle = () => {
    if (!isTitleHovered || componentProps.titleHoverEffect === 'none') return {};
    
    switch (componentProps.titleHoverEffect) {
      case 'color':
        return {
          color: componentProps.cardHoverGlowColor || '#3b82f6',
          transition: 'color 0.3s ease'
        };
      case 'underline':
        return {
          textDecoration: 'underline',
          transition: 'text-decoration 0.3s ease'
        };
      case 'scale':
        return {
          transform: 'scale(1.02)',
          transition: 'transform 0.3s ease'
        };
      default:
        return {};
    }
  };

  const getSubtitleHoverStyle = () => {
    if (!isSubtitleHovered || componentProps.subtitleHoverEffect === 'none') return {};
    
    switch (componentProps.subtitleHoverEffect) {
      case 'color':
        return {
          color: componentProps.cardHoverGlowColor || '#3b82f6',
          transition: 'color 0.3s ease'
        };
      case 'italic':
        return {
          fontStyle: 'italic',
          transition: 'font-style 0.3s ease'
        };
      default:
        return {};
    }
  };

  const getDescriptionHoverStyle = () => {
    if (!isDescriptionHovered || componentProps.descriptionHoverEffect === 'none') return {};
    
    switch (componentProps.descriptionHoverEffect) {
      case 'color':
        return {
          color: componentProps.cardHoverGlowColor || '#3b82f6',
          transition: 'color 0.3s ease'
        };
      case 'opacity':
        return {
          opacity: 0.8,
          transition: 'opacity 0.3s ease'
        };
      default:
        return {};
    }
  };

  // ✅ BADGE HOVER EFFECTS
  const getBadgeHoverStyle = () => {
    if (!isBadgeHovered || componentProps.badgeHoverEffect === 'none') return {};
    
    switch (componentProps.badgeHoverEffect) {
      case 'scale':
        return {
          transform: 'scale(1.1)',
          transition: 'transform 0.2s ease'
        };
      case 'glow':
        return {
          boxShadow: `0 0 10px ${componentProps.badgeColor}80`,
          transition: 'box-shadow 0.2s ease'
        };
      default:
        return {};
    }
  };

  // Get icon shape style
  const getIconShapeStyle = () => {
    switch (componentProps.iconShape) {
      case 'circle': return { borderRadius: '50%' };
      case 'square': return { borderRadius: '0px' };
      case 'rounded': return { borderRadius: `${componentProps.iconBorderRadius}px` };
      default: return { borderRadius: '50%' };
    }
  };

  // Get image source
  const getImageSrc = () => {
    try {
      if (componentProps.image && typeof componentProps.image === 'string' && componentProps.image.startsWith('data:')) {
        return componentProps.image;
      }
      const displayValue = getDisplayValue(componentProps.image);
      return String(displayValue);
    } catch (error) {
      return componentProps.image || '';
    }
  };

  // Handle flip
  const handleFlip = () => {
    if (componentProps.enableFlip && componentProps.flipOn === 'click') {
      setIsFlipped(!isFlipped);
    }
  };

  // Get layout classes based on position
  const getLayoutClasses = (position: 'top' | 'left' | 'right' | 'background', type: 'image' | 'icon') => {
    if (position === 'background') return 'flex-col relative';
    
    if (type === 'image') {
      switch (position) {
        case 'left': return 'flex-row';
        case 'right': return 'flex-row-reverse';
        case 'top': 
        default: return 'flex-col';
      }
    } else {
      // For icon, use the same logic
      switch (position) {
        case 'left': return 'flex-row';
        case 'right': return 'flex-row-reverse';
        case 'top': 
        default: return 'flex-col';
      }
    }
  };

  // Get button styles with ENHANCED styles
  const getButtonStyles = () => {
    const baseStyle: React.CSSProperties = {
      transition: `all ${componentProps.transitionDuration}s ease`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      cursor: 'pointer',
      border: 'none',
      fontWeight: '600',
      textDecoration: 'none',
      fontFamily: 'inherit',
      ...getButtonHoverStyle()
    };

    // Size
    switch (componentProps.buttonSize) {
      case 'sm':
        baseStyle.padding = '6px 12px';
        baseStyle.fontSize = '14px';
        break;
      case 'md':
        baseStyle.padding = '10px 20px';
        baseStyle.fontSize = '16px';
        break;
      case 'lg':
        baseStyle.padding = '14px 28px';
        baseStyle.fontSize = '18px';
        break;
      case 'xl':
        baseStyle.padding = '18px 36px';
        baseStyle.fontSize = '20px';
        break;
    }

    // Enhanced button styles
    switch (componentProps.buttonStyle) {
      case 'primary':
        baseStyle.backgroundColor = componentProps.buttonColor;
        baseStyle.color = componentProps.buttonTextColor;
        break;
      case 'secondary':
        baseStyle.backgroundColor = '#6b7280';
        baseStyle.color = '#ffffff';
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.color = componentProps.buttonColor;
        baseStyle.border = `2px solid ${componentProps.buttonColor}`;
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.color = componentProps.buttonColor;
        break;
      case 'gradient':
        baseStyle.background = `linear-gradient(135deg, ${componentProps.buttonColor}, ${componentProps.buttonHoverColor || '#2563eb'})`;
        baseStyle.color = componentProps.buttonTextColor;
        break;
      case 'glass':
        baseStyle.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        baseStyle.color = componentProps.buttonTextColor || componentProps.buttonColor;
        baseStyle.backdropFilter = 'blur(10px)';
        baseStyle.border = '1px solid rgba(255, 255, 255, 0.2)';
        break;
      case '3d':
        baseStyle.backgroundColor = componentProps.buttonColor;
        baseStyle.color = componentProps.buttonTextColor;
        baseStyle.boxShadow = `0 4px 0 ${componentProps.buttonHoverColor || '#2563eb'}, 0 6px 10px rgba(0,0,0,0.2)`;
        baseStyle.transform = 'translateY(0)';
        break;
      case 'rounded-full':
        baseStyle.backgroundColor = componentProps.buttonColor;
        baseStyle.color = componentProps.buttonTextColor;
        baseStyle.borderRadius = '9999px';
        break;
    }

    // Full width button
    if (componentProps.buttonFullWidth || componentProps.buttonAlignment === 'full-width') {
      baseStyle.width = '100%';
      baseStyle.display = 'block';
      baseStyle.textAlign = 'center';
    }

    // Border radius
    if (componentProps.buttonStyle !== 'rounded-full') {
      baseStyle.borderRadius = `${componentProps.buttonRadius}px`;
    }

    return baseStyle;
  };

  // Render Icon Section
  const renderIconSection = () => {
    if (!componentProps.showIcon) return null;

    return (
      <div 
        className="flex items-center justify-center transition-all duration-300"
        style={{
          backgroundColor: componentProps.iconBackgroundColor,
          padding: `${componentProps.iconPadding}px`,
          ...getIconShapeStyle(),
          ...getIconHoverStyle()
        }}
        onMouseEnter={() => setIsIconHovered(true)}
        onMouseLeave={() => setIsIconHovered(false)}
      >
        {getIconComponent()}
      </div>
    );
  };

  // Render Image Section
  const renderImageSection = () => {
    if (!componentProps.showImage || componentProps.imagePosition === 'background') return null;

    return (
      <div className={componentProps.imagePosition === 'top' ? 'w-full' : 'flex-1 min-w-0'}>
        {componentProps.image && componentProps.image !== '' && !imageError ? (
          <img
            src={getImageSrc()}
            alt={String(getDisplayValue(componentProps.alt))}
            className="rounded-lg w-full h-auto transition-all duration-300"
            style={{
              height: `${componentProps.imageHeight || 200}px`,
              width: '100%',
              objectFit: componentProps.objectFit,
              borderRadius: `${componentProps.imageBorderRadius}px`,
              maxWidth: '100%',
              display: 'block',
              ...getImageHoverStyle()
            }}
            onError={() => setImageError(true)}
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          />
        ) : (
          <div
            className="rounded-lg bg-gray-200 flex items-center justify-center transition-all duration-300 w-full"
            style={{
              height: `${componentProps.imageHeight || 200}px`,
              width: '100%',
              borderRadius: `${componentProps.imageBorderRadius}px`,
              maxWidth: '100%'
            }}
          >
            <div className="text-center text-gray-500">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="text-sm mt-2">
                {imageError ? 'Image failed to load' : (String(getDisplayValue(componentProps.alt)) || 'Upload an image')}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Determine which visual content to show (Image or Icon)
  const getVisualContent = () => {
    // Priority: Image > Icon
    if (componentProps.showImage && componentProps.image && componentProps.image !== '' && !imageError) {
      return renderImageSection();
    } else if (componentProps.showIcon) {
      return renderIconSection();
    }
    return null;
  };

  // Get actual position for visual content
  const getVisualPosition = () => {
    if (componentProps.showImage && componentProps.image && componentProps.image !== '' && !imageError) {
      return componentProps.imagePosition;
    } else if (componentProps.showIcon) {
      return componentProps.iconPosition;
    }
    return 'top';
  };

  // Get background image/icon for background position
  const getBackgroundContent = () => {
    if (componentProps.showImage && componentProps.image && componentProps.image !== '' && !imageError && componentProps.imagePosition === 'background') {
      return getImageSrc();
    } else if (componentProps.showIcon && componentProps.iconPosition === 'background') {
      // For icon background, we create a div with icon
      return null;
    }
    return null;
  };

  // Check if background mode is active
  const isBackgroundMode = () => {
    return (componentProps.showImage && componentProps.imagePosition === 'background') || 
           (componentProps.showIcon && componentProps.iconPosition === 'background');
  };

  // Main render
  const baseCardNode = (
    <div
      className={`w-full rounded-2xl overflow-hidden relative transition-all duration-300`}
      style={{
        backgroundColor: isBackgroundMode() ? 'transparent' : componentProps.backgroundColor,
        backgroundImage: getBackgroundContent() ? `url(${getBackgroundContent()})` : 'none',
        backgroundSize: isBackgroundMode() ? 'cover' : 'auto',
        backgroundPosition: isBackgroundMode() ? 'center' : 'auto',
        minHeight: isBackgroundMode() ? '300px' : 'auto',
        borderRadius: `${componentProps.borderRadius}px`,
        padding: isBackgroundMode() ? '0px' : `${componentProps.padding}px`,
        border: `${componentProps.borderWidth}px solid ${componentProps.borderColor}`,
        width: componentProps.width,
        height: componentProps.height === 'auto' ? 'auto' : componentProps.height,
        margin: componentProps.margin,
        opacity: componentProps.visible ? 1 : 0.5,
        transition: `all ${componentProps.transitionDuration}s ease`,
        boxSizing: 'border-box',
        perspective: componentProps.enableFlip ? `${componentProps.flipPerspective}px` : 'none',
        cursor: componentProps.enableFlip && componentProps.flipOn === 'click' ? 'pointer' : 'default',
        boxShadow: getCardHoverShadow(),
        ...getCardHoverStyle(),
      }}
      id={componentProps.id}
      onClick={handleFlip}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      {componentProps.enableFlip ? (
        <div
          className="w-full h-full relative"
          style={{
            transformStyle: 'preserve-3d',
            transition: `transform ${componentProps.flipDuration}s`,
            transform: isFlipped ? 
              (componentProps.flipDirection === 'horizontal' ? 'rotateY(180deg)' : 'rotateX(180deg)') : 
              'none',
            height: componentProps.height === 'auto' ? 'auto' : '100%',
            minHeight: '300px',
          }}
        >
          {/* FRONT SIDE */}
          <div
            className="w-full h-full absolute"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              backgroundColor: componentProps.backgroundColor,
              borderRadius: `${componentProps.borderRadius}px`,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Badge */}
            {componentProps.showBadge && (
              <span
                className="absolute text-xs font-semibold px-3 py-1 z-20 transition-all duration-300"
                style={{
                  backgroundColor: componentProps.badgeColor,
                  color: componentProps.badgeTextColor,
                  top: componentProps.badgePosition === 'top-left' ? '12px' : '12px',
                  left: componentProps.badgePosition === 'top-left' ? '12px' : 'auto',
                  right: componentProps.badgePosition === 'top-right' ? '12px' : 'auto',
                  borderRadius: componentProps.badgeShape === 'pill' ? '9999px' : 
                               componentProps.badgeShape === 'square' ? '0px' : '8px',
                  ...getBadgeHoverStyle()
                }}
                onMouseEnter={() => setIsBadgeHovered(true)}
                onMouseLeave={() => setIsBadgeHovered(false)}
              >
                {String(getDisplayValue(componentProps.badgeText))}
              </span>
            )}

            {/* Visual content */}
            <div className="w-full h-full flex items-center justify-center p-8">
              {getVisualContent()}
            </div>
          </div>

          {/* BACK SIDE */}
          <div
            className="w-full h-full absolute flex flex-col justify-center p-6"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              backgroundColor: componentProps.backgroundColor,
              borderRadius: `${componentProps.borderRadius}px`,
              transform: componentProps.flipDirection === 'horizontal' ? 'rotateY(180deg)' : 'rotateX(180deg)',
              overflow: 'auto',
            }}
          >
            <div className="flex flex-col w-full h-full justify-center gap-4">
              {/* Title */}
              {componentProps.showTitle && (
                <h3
                  className="font-bold break-words"
                  style={{
                    color: componentProps.titleColor,
                    fontSize: componentProps.titleFontSize,
                    fontFamily: componentProps.titleFontFamily || componentProps.fontFamily,
                    lineHeight: componentProps.lineHeight,
                    letterSpacing: componentProps.textSpacing,
                    textAlign: componentProps.titleAlignment as any,
                    ...getTitleHoverStyle()
                  }}
                  onMouseEnter={() => setIsTitleHovered(true)}
                  onMouseLeave={() => setIsTitleHovered(false)}
                >
                  {String(getDisplayValue(componentProps.title))}
                </h3>
              )}

              {/* Subtitle */}
              {componentProps.showSubtitle && (
                <h4
                  className="break-words"
                  style={{
                    color: componentProps.subtitleColor,
                    fontSize: componentProps.subtitleFontSize,
                    fontFamily: componentProps.fontFamily,
                    lineHeight: componentProps.lineHeight,
                    letterSpacing: componentProps.textSpacing,
                    textAlign: componentProps.subtitleAlign as any,
                    ...getSubtitleHoverStyle()
                  }}
                  onMouseEnter={() => setIsSubtitleHovered(true)}
                  onMouseLeave={() => setIsSubtitleHovered(false)}
                >
                  {String(getDisplayValue(componentProps.subtitle))}
                </h4>
              )}

              {/* Description */}
              {componentProps.showDescription && (
                <p
                  className="break-words"
                  style={{
                    color: componentProps.descriptionColor,
                    fontSize: componentProps.descriptionFontSize,
                    fontFamily: componentProps.fontFamily,
                    lineHeight: componentProps.lineHeight,
                    letterSpacing: componentProps.textSpacing,
                    textAlign: componentProps.descriptionAlign as any,
                    ...getDescriptionHoverStyle()
                  }}
                  onMouseEnter={() => setIsDescriptionHovered(true)}
                  onMouseLeave={() => setIsDescriptionHovered(false)}
                >
                  {String(getDisplayValue(componentProps.description))}
                </p>
              )}

              {/* Button */}
              {componentProps.showButton && (
                <div className={`mt-2 ${
                  componentProps.buttonAlignment === 'center' ? 'text-center' : 
                  componentProps.buttonAlignment === 'right' ? 'text-right' : 
                  componentProps.buttonAlignment === 'full-width' ? 'w-full' : 'text-left'
                }`}>
                  <a
                    href={String(getDisplayValue(componentProps.buttonLink))}
                    style={getButtonStyles()}
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                  >
                    {componentProps.buttonIcon && <span>{componentProps.buttonIcon}</span>}
                    {String(getDisplayValue(componentProps.buttonText))}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // NON-FLIP CONTENT
        <>
          {/* Badge */}
          {componentProps.showBadge && (
            <span
              className="absolute text-xs font-semibold px-3 py-1 z-20 transition-all duration-300"
              style={{
                backgroundColor: componentProps.badgeColor,
                color: componentProps.badgeTextColor,
                top: componentProps.badgePosition === 'top-left' ? '12px' : '12px',
                left: componentProps.badgePosition === 'top-left' ? '12px' : 'auto',
                right: componentProps.badgePosition === 'top-right' ? '12px' : 'auto',
                borderRadius: componentProps.badgeShape === 'pill' ? '9999px' : 
                             componentProps.badgeShape === 'square' ? '0px' : '8px',
                ...getBadgeHoverStyle()
              }}
              onMouseEnter={() => setIsBadgeHovered(true)}
              onMouseLeave={() => setIsBadgeHovered(false)}
            >
              {String(getDisplayValue(componentProps.badgeText))}
            </span>
          )}

          {/* Background overlay for background mode */}
          {isBackgroundMode() && (
            <div
              className="absolute inset-0 transition-all duration-300"
              style={{
                backgroundColor: componentProps.overlayColor,
                opacity: componentProps.overlayOpacity,
                borderRadius: `${componentProps.borderRadius}px`,
              }}
            />
          )}

          {/* Main Content Container */}
          <div className={`flex ${getLayoutClasses(getVisualPosition(), 
            componentProps.showImage && componentProps.image && componentProps.image !== '' && !imageError ? 'image' : 'icon')} 
            gap-4 relative z-10 w-full`}>
            
            {/* Visual Content (if not in background mode) */}
            {(componentProps.showImage || componentProps.showIcon) && !isBackgroundMode() && (
              <div className={`${getVisualPosition() === 'top' ? 'w-full flex justify-center mb-4' : 'flex-1 min-w-0 flex items-center'}`}>
                {getVisualContent()}
              </div>
            )}

            {/* Text Content */}
            <div className={`flex flex-col ${getVisualPosition() === 'top' || isBackgroundMode() ? 'w-full' : 'flex-1 min-w-0'}`}
                 style={{
                   color: isBackgroundMode() ? '#ffffff' : 'inherit',
                   textAlign: componentProps.textAlignment as any
                 }}>
              {/* Title */}
              {componentProps.showTitle && (
                <h3
                  className="font-bold mb-2 break-words transition-all duration-300"
                  style={{
                    color: isBackgroundMode() ? '#ffffff' : componentProps.titleColor,
                    fontSize: componentProps.titleFontSize,
                    fontFamily: componentProps.titleFontFamily || componentProps.fontFamily,
                    lineHeight: componentProps.lineHeight,
                    letterSpacing: componentProps.textSpacing,
                    ...getTitleHoverStyle()
                  }}
                  onMouseEnter={() => setIsTitleHovered(true)}
                  onMouseLeave={() => setIsTitleHovered(false)}
                >
                  {String(getDisplayValue(componentProps.title))}
                </h3>
              )}

              {/* Subtitle */}
              {componentProps.showSubtitle && (
                <h4
                  className="mb-2 break-words transition-all duration-300"
                  style={{
                    color: isBackgroundMode() ? '#ffffff' : componentProps.subtitleColor,
                    fontSize: componentProps.subtitleFontSize,
                    fontFamily: componentProps.fontFamily,
                    lineHeight: componentProps.lineHeight,
                    letterSpacing: componentProps.textSpacing,
                    ...getSubtitleHoverStyle()
                  }}
                  onMouseEnter={() => setIsSubtitleHovered(true)}
                  onMouseLeave={() => setIsSubtitleHovered(false)}
                >
                  {String(getDisplayValue(componentProps.subtitle))}
                </h4>
              )}

              {/* Description */}
              {componentProps.showDescription && (
                <p
                  className="mb-4 break-words transition-all duration-300"
                  style={{
                    color: isBackgroundMode() ? '#ffffff' : componentProps.descriptionColor,
                    fontSize: componentProps.descriptionFontSize,
                    fontFamily: componentProps.fontFamily,
                    lineHeight: componentProps.lineHeight,
                    letterSpacing: componentProps.textSpacing,
                    ...getDescriptionHoverStyle()
                  }}
                  onMouseEnter={() => setIsDescriptionHovered(true)}
                  onMouseLeave={() => setIsDescriptionHovered(false)}
                >
                  {String(getDisplayValue(componentProps.description))}
                </p>
              )}

              {/* Button */}
              {componentProps.showButton && (
                <div className={`mt-auto ${
                  componentProps.buttonAlignment === 'center' ? 'text-center' : 
                  componentProps.buttonAlignment === 'right' ? 'text-right' : 
                  componentProps.buttonAlignment === 'full-width' ? 'w-full' : 'text-left'
                }`}>
                  <a
                    href={String(getDisplayValue(componentProps.buttonLink))}
                    style={getButtonStyles()}
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                  >
                    {componentProps.buttonIcon && <span>{componentProps.buttonIcon}</span>}
                    {String(getDisplayValue(componentProps.buttonText))}
                  </a>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (isEditor) {
    const previewSubtitle =
      componentProps.enableFlip
        ? 'flip card'
        : componentProps.showImage
          ? 'media card'
          : componentProps.showIcon
            ? 'icon card'
            : 'content card';

    return (
      <div style={{ width: '100%' }}>
        <div
          style={{
            width: '100%',
            borderRadius: '12px',
            border: '1px solid var(--canvas-border, rgba(255,255,255,0.07))',
            overflow: 'hidden',
            background: 'var(--canvas-surface, #13161e)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              background: 'var(--canvas-surface2, #1a1d28)',
              borderBottom: '1px solid var(--canvas-border, rgba(255,255,255,0.07))',
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--canvas-accent2, #a594ff)',
                background: 'var(--canvas-accentbg, rgba(124,109,250,0.12))',
                border: '1px solid rgba(124,109,250,0.2)',
                padding: '2px 8px',
                borderRadius: '20px',
              }}
            >
              Content
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--canvas-text, #e8eaf0)' }}>Card</span>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '11.5px',
                color: 'var(--canvas-text3, #5a5f7a)',
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {previewSubtitle}
            </span>
          </div>

          <div
            style={{
              padding: '28px 36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '120px',
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            {baseCardNode}
          </div>
        </div>
      </div>
    );
  }

  return baseCardNode;
};

// Attach schema to component
(AdvancedCardComponent as any).schema = advancedCardSchema;

export default AdvancedCardComponent;
export { AdvancedCardComponent as AdvancedCard };

// CSS for animations
const styles = `
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes zoom-in {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px currentColor; }
  50% { box-shadow: 0 0 20px currentColor; }
}

@keyframes shine {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

// Add styles to document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
