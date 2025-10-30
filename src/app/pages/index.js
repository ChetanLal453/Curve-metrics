import { useEffect, useState } from 'react';
import HomeBanner from '../components/HomeBanner';
import Choose from '../components/Choose';

export default function HomePage() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch('/api/get-page')
      .then(res => res.json())
      .then(setSections)
      .catch(console.error);
  }, []);

  return (
    <div>
      {sections.map(section => {
        const content = JSON.parse(section.content);
        switch (section.type) {
          case 'homeBanner':
            return <HomeBanner key={section.id} content={content} />;
          case 'choose':
            return <Choose key={section.id} content={content} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
