'use client';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface Page {
  id: number;
  title: string;
}

interface Section {
  id: number;
  section_type: string;
  content: any;
  enabled: number;
  order?: number;
}

interface Template {
  id: number;
  section_type: string;
}

export default function PageEditor() {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [otherPages, setOtherPages] = useState<Page[]>([]);
  const [selectedOtherPage, setSelectedOtherPage] = useState<Page | null>(null);
  const [otherPageSections, setOtherPageSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editedContent, setEditedContent] = useState<any>({});

  /** Fetch all pages and templates */
  useEffect(() => {
    fetch('/api/get-pages')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPages(data.pages);
          // Default to Home Page
          const homePage = data.pages.find((p: Page) => p.title.toLowerCase() === 'home') || data.pages[0];
          setCurrentPage(homePage);
        }
      });

    fetch('/api/get-templates')
      .then(res => res.json())
      .then(data => { if (data.success) setTemplates(data.templates); });
  }, []);

  /** Fetch sections for current page */
  useEffect(() => {
    if (!currentPage) return;

    fetch(`/api/get-page?page_id=${currentPage.id}`)
      .then(res => res.json())
      .then(data => { if (data.success) setSections(data.sections); });

    const others = pages.filter(p => p.id !== currentPage.id);
    setOtherPages(others);
    setSelectedOtherPage(others[0] || null);
  }, [currentPage, pages]);

  /** Fetch sections from selected other page */
  useEffect(() => {
    if (!selectedOtherPage) return;

    fetch(`/api/get-page-sections?fromPageId=${selectedOtherPage.id}`)
      .then(res => res.json())
      .then(data => { if (data.success) setOtherPageSections(data.sections); });
  }, [selectedOtherPage]);

  /** Drag-and-drop */
  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    if (result.destination.droppableId === 'sections') {
      if (result.source.droppableId === 'sections') {
        // Reordering within sections
        const items = Array.from(sections);
        const [moved] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, moved);
        setSections(items);

        // Persist order
        for (let i = 0; i < items.length; i++) {
          await fetch('/api/update-section', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ section_id: items[i].id, order: i })
          });
        }
      } else if (result.source.droppableId === 'templates') {
        // Adding from templates
        const template = templates[result.source.index];
        await addSection({ templateId: template.id, order: result.destination.index });
      } else if (result.source.droppableId === 'other-sections') {
        // Adding from other sections
        const section = otherPageSections[result.source.index];
        await addSection({ content: section.content, section_type: section.section_type, order: result.destination.index });
      }
    }
  };

  /** Add section */
  const addSection = async ({ templateId = null, content = null, section_type = null, order = null }: { templateId?: number | null, content?: any, section_type?: string | null, order?: number | null }) => {
    if (!currentPage) return;
    setLoading(true);

    const body: any = { page_id: currentPage.id };
    if (templateId) body.template_id = templateId;
    if (content) body.content = content;
    if (section_type) body.section_type = section_type;
    if (order !== null) body.order = order;

    await fetch('/api/create-section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    fetch(`/api/get-page?page_id=${currentPage.id}`)
      .then(res => res.json())
      .then(data => { if (data.success) setSections(data.sections); });

    setLoading(false);
  };

  /** Toggle enable/disable */
  const toggleEnabled = async (section: Section) => {
    const newStatus = section.enabled ? 0 : 1;
    await fetch('/api/update-section', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section_id: section.id, enabled: newStatus })
    });

    setSections(sections.map(s => s.id === section.id ? { ...s, enabled: newStatus } : s));
  };

  /** Open visual editor modal */
  const openEditor = (section: Section) => {
    setEditingSection(section);
    setEditedContent({ ...section.content });
  };

  /** Save edited content */
  const saveEditor = async () => {
    if (!editingSection) return;
    await fetch('/api/update-section', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section_id: editingSection.id, content: editedContent })
    });

    fetch(`/api/get-page?page_id=${currentPage!.id}`)
      .then(res => res.json())
      .then(data => { if (data.success) setSections(data.sections); });

    setEditingSection(null);
    setEditedContent({});
  };

  /** Duplicate section */
  const duplicateSection = async (section: Section) => {
    await addSection({ content: section.content, section_type: section.section_type });
  };

  /** Delete section */
  const deleteSection = async (id: number) => {
    await fetch('/api/delete-section', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section_id: id })
    });
    // Refetch
    if (currentPage) {
      fetch(`/api/get-page?page_id=${currentPage.id}`)
        .then(res => res.json())
        .then(data => { if (data.success) setSections(data.sections); });
    }
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      {/* Page Selector */}
      <div style={{ marginBottom: '1rem' }}>
        <label>Select Page: </label>
        <select
          value={currentPage?.id || ''}
          onChange={(e) =>
            setCurrentPage(pages.find(p => p.id === parseInt(e.target.value)) || null)
          }
        >
          {pages.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
        <button style={{ marginLeft: '1rem' }}>Save Changes</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* Library Sidebar */}
          <div style={{ flex: 1 }}>
            {/* Templates */}
            <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <h3>Available Containers</h3>
              <Droppable droppableId="templates" isDropDisabled={true}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {templates.map((t, index) => (
                      <Draggable key={t.id} draggableId={`template-${t.id}`} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              border: '1px solid #999',
                              padding: '0.5rem',
                              marginBottom: '0.5rem',
                              backgroundColor: '#f0f0f0',
                              ...provided.draggableProps.style
                            }}
                          >
                            {t.section_type}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Other Page Sections */}
            <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
              <h3>Containers from Other Pages</h3>
              <select
                value={selectedOtherPage?.id || ''}
                onChange={(e) =>
                  setSelectedOtherPage(otherPages.find(p => p.id === parseInt(e.target.value)) || null)
                }
              >
                {otherPages.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
              <Droppable droppableId="other-sections" isDropDisabled={true}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {otherPageSections.map((sec, index) => (
                      <Draggable key={sec.id} draggableId={`other-${sec.id}`} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              border: '1px solid #999',
                              padding: '0.5rem',
                              margin: '0.5rem 0',
                              backgroundColor: '#f0f0f0',
                              ...provided.draggableProps.style
                            }}
                          >
                            {sec.section_type}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>

          {/* Page Preview */}
          <div style={{ flex: 2, border: '1px solid #ccc', padding: '1rem' }}>
            <h2>Page Preview: {currentPage?.title}</h2>
            <Droppable droppableId="sections">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {sections.map((sec, index) => (
                    <Draggable key={sec.id} draggableId={sec.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            border: '1px solid #999',
                            padding: '0.5rem',
                            marginBottom: '0.5rem',
                            backgroundColor: sec.enabled ? '#f9f9f9' : '#e0e0e0',
                            ...provided.draggableProps.style
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong>{sec.section_type}</strong>
                            <div>
                              <button onClick={() => duplicateSection(sec)} style={{ marginRight: '0.5rem' }}>Duplicate</button>
                              <button onClick={() => deleteSection(sec.id)} style={{ marginRight: '0.5rem' }}>Delete</button>
                              <button onClick={() => toggleEnabled(sec)} style={{ marginRight: '0.5rem' }}>
                                {sec.enabled ? 'Disable' : 'Enable'}
                              </button>
                              <button onClick={() => openEditor(sec)}>Edit</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      {loading && <p>Loading...</p>}

      {/* Visual Section Editor Modal */}
      {editingSection && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ backgroundColor: 'white', padding: '1rem', width: '600px', maxHeight: '80%', overflowY: 'auto' }}>
            <h3>Edit Container: {editingSection.section_type}</h3>
            {Object.keys(editedContent).map(key => {
              const value = editedContent[key];
              if (typeof value === 'string') {
                if (key.toLowerCase().includes('image') || key.toLowerCase().includes('src')) {
                  return (
                    <div key={key} style={{ marginBottom: '1rem' }}>
                      <label>{key}:</label>
                      <input type="file" onChange={e => setEditedContent({ ...editedContent, [key]: e.target.files?.[0]?.name || value })} />
                    </div>
                  );
                } else if (value.length > 50) {
                  return (
                    <div key={key} style={{ marginBottom: '1rem' }}>
                      <label>{key}:</label>
                      <textarea value={value} onChange={e => setEditedContent({ ...editedContent, [key]: e.target.value })} style={{ width: '100%', height: '100px' }} />
                    </div>
                  );
                } else {
                  return (
                    <div key={key} style={{ marginBottom: '1rem' }}>
                      <label>{key}:</label>
                      <input type="text" value={value} onChange={e => setEditedContent({ ...editedContent, [key]: e.target.value })} style={{ width: '100%' }} />
                    </div>
                  );
                }
              } else {
                return (
                  <div key={key} style={{ marginBottom: '1rem' }}>
                    <label>{key}:</label>
                    <textarea value={JSON.stringify(value, null, 2)} onChange={e => {
                      try {
                        setEditedContent({ ...editedContent, [key]: JSON.parse(e.target.value) });
                      } catch {
                        // invalid JSON
                      }
                    }} style={{ width: '100%', height: '100px' }} />
                  </div>
                );
              }
            })}
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button onClick={() => setEditingSection(null)}>Cancel</button>
              <button onClick={saveEditor}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
