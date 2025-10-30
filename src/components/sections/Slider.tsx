import React, { useState } from 'react';

interface Slide {
  image: string;
  title: string;
  description: string;
}

interface SliderProps {
  content: {
    slides: Slide[];
  };
}

const Slider: React.FC<SliderProps> = ({ content }) => {
  const { slides } = content;
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  return (
    <section style={{ position: 'relative', width: '100%', height: '400px', maxWidth: '1200px', margin: '0 auto', overflow: 'hidden' }}>
      <div style={{ backgroundImage: `url(${currentSlide.image})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        <div style={{ textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: '1rem' }}>
          <h2>{currentSlide.title}</h2>
          <p>{currentSlide.description}</p>
        </div>
      </div>
      <button onClick={prevSlide} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', padding: '0.5rem' }}>‹</button>
      <button onClick={nextSlide} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', padding: '0.5rem' }}>›</button>
    </section>
  );
};

export default Slider;
