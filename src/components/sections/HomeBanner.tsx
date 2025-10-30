import React from 'react';

interface HomeBannerProps {
  content: {
    title: string;
    subtitle: string;
    backgroundColor?: string;
    buttonText?: string;
    buttonLink?: string;
  };
}

const HomeBanner: React.FC<HomeBannerProps> = ({ content }) => {
  const { title, subtitle, backgroundColor = '#f0f0f0', buttonText, buttonLink } = content;

  return (
    <section style={{ backgroundColor, padding: '2rem', textAlign: 'center' }}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {buttonText && buttonLink && (
        <a href={buttonLink} style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', textDecoration: 'none' }}>
          {buttonText}
        </a>
      )}
    </section>
  );
};

export default HomeBanner;
