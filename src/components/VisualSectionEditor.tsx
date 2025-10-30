'use client';
import { useState, useEffect } from 'react';
import PageEditor from '@/components/PageEditor/index-unified';
import { PageLayout, Container, Row, Column, LayoutComponent } from '@/types/page-editor';

interface VisualSectionEditorProps {
  content: any;
  onSave: (content: any) => void;
  onCancel: () => void;
  sectionType: string;
}

const VisualSectionEditor = ({ content, onSave, onCancel, sectionType }: VisualSectionEditorProps) => {
  const [mode, setMode] = useState<'visual' | 'json'>('visual');
  const [jsonContent, setJsonContent] = useState(JSON.stringify(content, null, 2));
  const [currentLayout, setCurrentLayout] = useState<PageLayout>({ id: 'section-editor', name: 'Section Editor', sections: [] });
  const [error, setError] = useState<string | null>(null);

  // Initialize layout when content changes
  useEffect(() => {
    setCurrentLayout(transformToPageBuilderFormat(content));
    setJsonContent(JSON.stringify(content, null, 2));
  }, [content]);

  // Transform content to PageBuilder format
  const transformToPageBuilderFormat = (rawContent: any): PageLayout => {
    try {
      // If content is already in PageLayout format, return it
      if (rawContent && rawContent.id && rawContent.name && rawContent.sections) {
        return rawContent;
      }

      // If content is empty or null, return empty layout
      if (!rawContent || Object.keys(rawContent).length === 0) {
        return { id: 'section-editor', name: 'Section Editor', sections: [] };
      }

      // Transform from database format to PageBuilder format
      // Create a section with the content
      const container: Container = {
        id: `container-${Date.now()}`,
        rows: []
      };

      // Example transformation logic - customize based on your content structure
      if (rawContent.layout) {
        container.rows = rawContent.layout;
      } else if (rawContent.components) {
        // Create a single row with components
        const row: Row = {
          id: `row-${Date.now()}`,
          columns: [
            {
              id: `col-${Date.now()}`,
              components: rawContent.components
            }
          ]
        };
        container.rows = [row];
      }

      const section = {
        id: `section-${Date.now()}`,
        name: sectionType || 'Edited Section',
        type: 'custom' as const,
        container
      };

      return {
        id: 'section-editor',
        name: 'Section Editor',
        sections: [section]
      };
    } catch (err) {
      console.error('Error transforming content:', err);
      return { id: 'section-editor', name: 'Section Editor', sections: [] };
    }
  };

  // Transform PageBuilder format back to database format
  const transformFromPageBuilderFormat = (layout: PageLayout): any => {
    try {
      // Extract the first section's container
      if (layout.sections && layout.sections.length > 0) {
        return { layout: layout.sections[0].container.rows };
      }
      return { layout: [] };
    } catch (err) {
      console.error('Error transforming layout:', err);
      return content;
    }
  };

  const handleVisualSave = (layout: PageLayout) => {
    const transformedContent = transformFromPageBuilderFormat(layout);
    setCurrentLayout(layout);
    onSave(transformedContent);
  };

  const handleLayoutChange = (layout: PageLayout) => {
    setCurrentLayout(layout);
  };

  const handleJsonSave = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      setError(null);
      onSave(parsed);
    } catch (err) {
      setError('Invalid JSON format. Please check your syntax.');
    }
  };

  const handleModeSwitch = (newMode: 'visual' | 'json') => {
    if (newMode === 'json' && mode === 'visual') {
      // Switching from visual to JSON - update JSON content
      setJsonContent(JSON.stringify(content, null, 2));
    }
    setMode(newMode);
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Edit Section: {sectionType}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {mode === 'visual' ? 'Visual Editor' : 'JSON Editor'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleModeSwitch('visual')}
              className={`px-4 py-2 rounded ${
                mode === 'visual'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Visual
            </button>
            <button
              onClick={() => handleModeSwitch('json')}
              className={`px-4 py-2 rounded ${
                mode === 'json'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              JSON
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {mode === 'visual' ? (
            <PageEditor
              initialLayout={currentLayout}
              onSave={handleVisualSave}
              onCancel={onCancel}
              isModal={true}
              showSaveButton={false}
            />
          ) : (
            <div className="p-6 h-full flex flex-col">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              <textarea
                value={jsonContent}
                onChange={(e) => setJsonContent(e.target.value)}
                className="flex-1 w-full p-4 border border-gray-300 rounded font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Edit JSON content"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={mode === 'visual' ? () => handleVisualSave(currentLayout) : handleJsonSave}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisualSectionEditor;
