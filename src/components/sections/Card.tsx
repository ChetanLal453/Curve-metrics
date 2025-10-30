import React from 'react';

interface CardItem {
  image?: string;
  title: string;
  description: string;
  link?: string;
}

interface CardProps {
  content: {
    title?: string;
    cards: CardItem[];
  };
}

const Card: React.FC<CardProps> = ({ content }) => {
  const { title, cards } = content;

  return (
    <section style={{ padding: '2rem' }}>
      {title && <h2 style={{ textAlign: 'center' }}>{title}</h2>}
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {cards.map((card, index) => (
          <div key={index} style={{ flex: '1 1 300px', margin: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            {card.image && <img src={card.image} alt={card.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />}
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            {card.link && <a href={card.link} style={{ color: '#007bff' }}>Learn More</a>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Card;
