import React from 'react';

interface Item {
  icon: string;
  title: string;
  description: string;
}

interface ChooseProps {
  content: {
    title: string;
    items: Item[];
  };
}

const Choose: React.FC<ChooseProps> = ({ content }) => {
  const { title, items } = content;

  return (
    <section style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>{title}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {items.map((item, index) => (
          <div key={index} style={{ flex: '1 1 300px', margin: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <img src={item.icon} alt={item.title} style={{ width: '50px', height: '50px' }} />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Choose;
