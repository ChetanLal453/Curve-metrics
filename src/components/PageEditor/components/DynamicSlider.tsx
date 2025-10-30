import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation, PanInfo } from 'framer-motion'
import { LayoutComponent } from '@/types/page-editor'
import { useSlider } from './hooks/useSlider'
import {
  SliderSettings,
  SliderSlide,
  SlideCTA,
  SliderNavigation,
  SliderAnimation,
  SliderAccessibility,
  SliderPerformance,
  SliderTheme,
  SliderResponsive
} from './types/slider'
import {
} from './utils/sliderUtils'

interface DynamicSliderProps {
  component: LayoutComponent
  onUpdate: (newProps: Record<string, any>) => void
}

const DynamicSlider: React.FC<DynamicSliderProps> = ({ component, onUpdate }) => {
  // Convert old props to new settings format
  const settings: SliderSettings = useMemo(() => {
    const oldProps = component.props || {}

    return {
      slides: oldProps.slides || [createDefaultSlide()],
      navigation: {
        showArrows: oldProps.showArrows !== false,
        arrowStyle: oldProps.arrowStyle || 'default',
        arrowColor: oldProps.arrowColor || '#ffffff',
        arrowBackgroundColor: oldProps.arrowBackgroundColor || 'rgba(0,0,0,0.5)',
        arrowSize: oldProps.arrowSize || 'medium',
        customArrowLeft: oldProps.customArrowLeft,
        customArrowRight: oldProps.customArrowRight,
        showDots: oldProps.showDots !== false,
        dotStyle: oldProps.dotStyle || 'default',
        dotColor: oldProps.dotColor || '#ffffff',
        dotActiveColor: oldProps.dotActiveColor || '#ffffff',
        dotSize: oldProps.dotSize || 'medium',
        paginationType: oldProps.paginationType || 'dots',
        paginationPosition: 'bottom',
        keyboardNavigation: oldProps.keyboardNavigation !== false,
        swipeGestures: oldProps.swipeGestures !== false,
        dragScroll: oldProps.dragScroll || false
      },
      animation: {
        transitionEffect: oldProps.transitionEffect || 'fade',
        transitionDuration: oldProps.transitionDuration || 500,
        transitionEasing: oldProps.transitionEasing || 'ease-out',
        customEasing: oldProps.customEasing,
        autoplay: oldProps.autoplay || false,
        autoplayDelay: oldProps.slideDuration || 3000,
        pauseOnHover: oldProps.pauseOnHover !== false,
        pauseOnFocus: oldProps.pauseOnFocus || false,
        loop: oldProps.loop !== false,
        reverse: oldProps.reverse || false,
        autoHeight: oldProps.autoHeight || false,
        adaptiveHeight: oldProps.adaptiveHeight || false,
        centerMode: oldProps.centerMode || false,
        variableWidth: oldProps.variableWidth || false,
        fadeBackgroundOnTransition: oldProps.fadeBackgroundOnTransition || false
      },
      accessibility: {
        ariaLabel: oldProps.ariaLabel || 'Image slider',
        ariaLive: oldProps.ariaLive || 'polite',
        role: oldProps.role || 'region',
        screenReaderInstructions: oldProps.screenReaderInstructions || 'Use arrow keys to navigate slides',
        focusable: oldProps.focusable !== false,
        reducedMotion: false,
        highContrast: false
      },
      performance: {
        lazyLoad: oldProps.lazyLoad || false,
        preloadSlides: oldProps.preloadSlides || 2,
        virtualize: oldProps.virtualize || false,
        gpuAcceleration: oldProps.gpuAcceleration !== false,
        imageOptimization: oldProps.imageOptimization !== false,
        debounceResize: oldProps.debounceResize || false,
        throttleScroll: oldProps.throttleScroll || false
      },
      theme: {
        preset: oldProps.themePreset || 'light',
        customTheme: oldProps.customTheme,
        globalCSS: oldProps.globalCSS || ''
      },
      responsive: {
        breakpoints: {
          mobile: { min: 0, max: 767, slidesToShow: 1, slidesToScroll: 1 },
          tablet: { min: 768, max: 1023, slidesToShow: 1, slidesToScroll: 1 },
          desktop: { min: 1024, max: 9999, slidesToShow: 1, slidesToScroll: 1 }
        },
        responsiveSettings: {
          mobile: {},
          tablet: {},
          desktop: {}
        }
      },
      width: oldProps.width || '100%',
      height: oldProps.height || '400px',
      maxWidth: oldProps.maxWidth || 'none',
      maxHeight: oldProps.maxHeight || 'none',
      margin: oldProps.margin || '0',
      padding: oldProps.padding || '0',
      backgroundColor: oldProps.backgroundColor || 'transparent',
      backgroundImage: oldProps.backgroundImage || '',
      backgroundGradient: oldProps.backgroundGradient,
      border: oldProps.border || 'none',
      borderRadius: oldProps.borderRadius || '0',
      boxShadow: oldProps.boxShadow || 'none',
      customClass: oldProps.customClass || '',
      customId: oldProps.customId || '',
      customCSS: oldProps.customCSS || '',
      dataSource: oldProps.dataSource || 'static',
      apiEndpoint: oldProps.apiEndpoint,
      cmsCollection: oldProps.cmsCollection,
      dynamicData: oldProps.dynamicData,
      slideCount: oldProps.slideCount || 1,
      groupedProperties: oldProps.groupedProperties || false,
      undoRedoSupport: oldProps.undoRedoSupport || false,
      inlineEditing: oldProps.inlineEditing || false,
      versionControl: oldProps.versionControl || false,
      onSlideChange: oldProps.onSlideChange,
      onSlideClick: oldProps.onSlideClick,
      onAutoplayStart: oldProps.onAutoplayStart,
      onAutoplayStop: oldProps.onAutoplayStop
    }
  }, [component.props])

  const {
    currentSlide,
    isPlaying,
    isTransitioning,
    loadedSlides,
    focused,
    reducedMotion,
    visibleSlides,
    totalSlides,
    progress,
    canGoNext,
    canGoPrev,
    nextSlide,
    prevSlide,
    goToSlide,
    play,
    pause,
    stop,
    addSlide,
    removeSlide,
    duplicateSlide,
    updateSlide,
    updateSettings
  } = useSlider(settings)

  const slidesContainerRef = useRef<HTMLDivElement>(null)

  // Animation controls
  const controls = useAnimation()

  // Update parent component when settings change
  useEffect(() => {
    onUpdate(settings)
  }, [settings, onUpdate])

  // Generate CSS keyframes
  useEffect(() => {
    const keyframes = getAnimationKeyframes(settings.animation.transitionEffect)
    const textKeyframes = getTextAnimationKeyframes('fadeIn')

    const style = document.createElement('style')
    style.textContent = keyframes + textKeyframes
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [settings.animation.transitionEffect])

  // Handle slide change animations
  useEffect(() => {
    if (!reducedMotion) {
      controls.start({
        opacity: [0, 1],
        x: settings.animation.transitionEffect === 'slide' ? [50, 0] : 0,
        scale: settings.animation.transitionEffect === 'zoom' && currentSlide === currentSlide ? 1 : 0.9,
        transition: {
          duration: settings.animation.transitionDuration / 1000,
          ease: settings.animation.transitionEasing
        }
      })
    }
  }, [currentSlide, controls, settings.animation, reducedMotion])

  const showArrows = settings.navigation.showArrows && visibleSlides.length > 1
  const showDots = settings.navigation.showDots && visibleSlides.length > 1

  const animationStyles: Record<string, React.CSSProperties> = {
    fade: { animation: 'fadeIn 0.5s ease-in-out' },
    slide: { animation: 'slideIn 0.5s ease-in-out' },
    zoom: { animation: 'zoomIn 0.5s ease-in-out' },
    cube: { animation: 'cubeRotate 0.8s ease-in-out' }
  }

  return (
    <div style={{ overflow: 'hidden', height: '100%', margin: 0, padding: 0 }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          @keyframes zoomIn {
            from { transform: scale(0.8); }
            to { transform: scale(1); }
          }
          @keyframes cubeRotate {
            0% { transform: rotateY(0deg) translateZ(0); }
            25% { transform: rotateY(90deg) translateZ(50px); }
            50% { transform: rotateY(180deg) translateZ(0); }
            75% { transform: rotateY(270deg) translateZ(-50px); }
            100% { transform: rotateY(360deg) translateZ(0); }
          }
        `
      }} />
      <div className="relative" style={{ height: '100%', margin: 0, padding: 0 }}>
        {/* Slider Container */}
        <div
          id={component.props?.customId || undefined}
          className={`relative overflow-hidden w-full ${component.props?.customClass || ''}`}
          style={{
            width: '100%', // full width
            height: settings.height, // use calculated height to constrain slider
            maxWidth: '100%', // ensure full width
            margin: 0, // remove margin to fully occupy section
            padding: 0, // remove padding to fully occupy section
            backgroundColor: component.props?.backgroundColor || 'transparent',
            border: component.props?.border || 'none',
            borderRadius: 0, // remove border-radius for flush fit
            ...(component.props?.customCSS ? { cssText: component.props.customCSS } : {})
          }}
        >
          {/* Slides */}
          <div
            ref={slidesContainerRef}
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{
              width: `${visibleSlides.length * 100}%`,
              transform: `translateX(-${currentSlide * (100 / visibleSlides.length)}%)`,
              height: '100%', // take full height of container
              willChange: 'transform' // optimize rendering for transforms
            }}
          >
            {settings.slides
              .filter((slide: any) => slide.visibility !== false)
              .map((slide: any, filteredIndex: number) => {
                const originalIndex = settings.slides.findIndex((s: any) => s.id === slide.id)
                const slideStyles: React.CSSProperties = {
                  backgroundColor: slide.backgroundColor || '#3b82f6',
                  color: slide.textColor || '#ffffff',
                  padding: 0, // Remove padding to prevent overflow when adding buttons or content
                  margin: 0, // Remove margin to prevent overflow and ensure proper slide separation
                  borderRadius: 0, // Remove border-radius for flush fit
                  width: '100%', // Always full width for slider slides
                  height: '100%', // Use full height to fit container
                  boxSizing: 'border-box', // Include padding in width calculation
                  overflow: 'hidden', // Prevent content overflow to ensure proper slide separation
                  boxShadow: `0 ${slide.shadowIntensity || 3}px ${slide.shadowIntensity * 2 || 6}px rgba(0,0,0,0.1)`
                }

                const renderMedia = () => {
                  const getObjectPositionClass = (alignment: string) => {
                    switch (alignment) {
                      case 'left': return 'object-left'
                      case 'right': return 'object-right'
                      case 'top': return 'object-top'
                      case 'bottom': return 'object-bottom'
                      case 'center':
                      default: return 'object-center'
                    }
                  }

                  if (slide.mediaType === 'video' && slide.video) {
                    return (
                      <div className="relative w-full h-full overflow-hidden">
                        <video
                          src={slide.video}
                          controls
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )
                  } else if (slide.mediaType === 'image') {
                    return (
                      <div className="relative w-full h-full overflow-hidden">
                        {slide.image ? (
                          <img
                            key={slide.id}
                            src={slide.image}
                            alt={slide.title || `Slide ${filteredIndex + 1}`}
                            className={`w-full h-full object-contain ${getObjectPositionClass(slide.imageAlignment || 'center')}`}
                            loading="eager"
                          />
                        ) : (
                          <div
                            className="w-full h-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400"
                          >
                            <div className="text-center text-gray-500">
                              <div className="text-4xl mb-2">📷</div>
                              <div className="text-sm font-medium">No image</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  }
                  return null
                }

                const renderTextContent = () => (
                  <div className="flex flex-col justify-center">
                    {slide.subtitle && (
                      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
                        {slide.subtitle}
                      </h3>
                    )}
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                      {slide.title}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg mb-4">
                      {slide.content}
                    </p>
                    {slide.caption && <p className="text-sm opacity-80 mb-4">{slide.caption}</p>}

                    {/* CTA Buttons */}
                    {slide.ctaButtons && slide.ctaButtons.length > 0 && slide.layout !== 'full-image' && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {slide.ctaButtons.map((btn: any, btnIndex: number) => (
                          <button
                            key={btnIndex}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (btn.link) window.open(btn.link, btn.openInNewTab ? '_blank' : '_self')
                            }}
                            className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded font-medium transition-colors cursor-pointer"
                          >
                            {btn.label || 'Button'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )

                const slideContent = (
                  <div className="w-full h-full relative" style={slideStyles}>
                    {slide.layout === 'full-width' && (
                      <div className="h-full flex flex-col">
                        {renderMedia() && (
                          <div className="flex-1 mb-4">
                            {renderMedia()}
                          </div>
                        )}
                        <div className="flex-1">
                          {renderTextContent()}
                        </div>
                      </div>
                    )}

                    {slide.layout === 'half-image-half-text' && (
                      <div className="h-full flex">
                        <div className="flex-1 p-4">
                          {renderTextContent()}
                        </div>
                        {renderMedia() && (
                          <div className="flex-1">
                            {renderMedia()}
                          </div>
                        )}
                      </div>
                    )}

                    {slide.layout === 'text-overlay' && renderMedia() && (
                      <div className="h-full relative">
                        {renderMedia()}
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                          <div className="text-center text-white">
                            {renderTextContent()}
                          </div>
                        </div>
                      </div>
                    )}

                    {slide.layout === 'card-style' && (
                      <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
                        {renderMedia() && (
                          <div className="h-1/2">
                            {renderMedia()}
                          </div>
                        )}
                        <div className="text-gray-900">
                          {renderTextContent()}
                        </div>
                      </div>
                    )}

                    {slide.layout === 'full-image' && renderMedia() && (
                      <div className="h-full relative">
                        {renderMedia()}
                        {slide.caption && (
                          <p className="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                            {slide.caption}
                          </p>
                        )}
                        {/* CTA Buttons for full-image layout */}
                        {slide.ctaButtons && slide.ctaButtons.length > 0 && (
                          <div className="absolute bottom-4 right-4 flex flex-wrap gap-2">
                            {slide.ctaButtons.map((btn: any, btnIndex: number) => (
                              <button
                                key={btnIndex}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  if (btn.link) window.open(btn.link, btn.openInNewTab ? '_blank' : '_self')
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition-colors cursor-pointer"
                              >
                                {btn.label || 'Button'}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {slide.layout === 'full-text' && (
                      <div className="h-full flex items-center justify-center text-center">
                        {renderTextContent()}
                      </div>
                    )}

                    {!['full-width', 'half-image-half-text', 'text-overlay', 'card-style', 'full-image', 'full-text'].includes(slide.layout) && (
                      <div className="h-full flex items-center justify-center">
                        <p>Layout "{slide.layout}" not implemented yet.</p>
                      </div>
                    )}
                  </div>
                )

                const wrapperProps = slide.link?.url ? {
                  href: slide.link.url,
                  target: slide.link.openInNewTab ? '_blank' : '_self',
                  className: `h-full block`,
                  style: { flex: `0 0 ${100 / visibleSlides.length}%`, overflow: 'hidden', position: 'relative' as React.CSSProperties['position'] }
                } : {
                  className: `h-full`,
                  style: { flex: `0 0 ${100 / visibleSlides.length}%`, overflow: 'hidden', position: 'relative' as React.CSSProperties['position'] }
                }

                return slide.link?.url ? (
                  <a key={slide.id || filteredIndex} {...wrapperProps}>
                    {slideContent}
                  </a>
                ) : (
                  <div key={slide.id || filteredIndex} {...wrapperProps}>
                    {slideContent}
                  </div>
                )
              })}
          </div>

          {/* Arrows */}
          {showArrows && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center z-10"
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center z-10"
              >
                ›
              </button>
            </>
          )}

          {/* Dots */}
          {showDots && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {settings.slides
                .filter((slide: any) => slide.visibility !== false)
                .map((slide: any, filteredIndex: number) => (
                  <button
                    key={slide.id || filteredIndex}
                    onClick={() => goToSlide(filteredIndex)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentSlide === filteredIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DynamicSlider
