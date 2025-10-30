// pages/[slug].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Import your reusable section components
import HomeBanner from '@/components/sections/HomeBanner';
import Choose from '@/components/sections/Choose';
import Slider from '@/components/sections/Slider';
import Card from '@/components/sections/Card';
// Add other section components as needed

// Map section_type to React component
const SECTION_COMPONENTS = {
  home_banner: HomeBanner,
  banner: HomeBanner, // Alias
  choose: Choose,
  slider: Slider,
  card: Card,
  // Add more mappings here
};

export default function Page() {
  const router = useRouter();
  const { slug } = router.query;

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState('');

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/get-page?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSections(data.sections || []);
          setPageTitle(data.page.title || '');
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!sections.length) return <p>No content found for this page.</p>;

  const enabledSections = sections.filter(section => section.enabled);

  return (
    <div>
      <h1>{pageTitle}</h1>
      {enabledSections.map(section => {
        const Component = SECTION_COMPONENTS[section.section_type];

        if (!Component) {
          return (
            <div key={section.id} style={{ padding: '1rem', color: 'red' }}>
              Unknown section type: {section.section_type}
            </div>
          );
        }

        return <Component key={section.id} content={section.content} />;
      })}
    </div>
  );
}
