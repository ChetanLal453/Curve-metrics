import { useState, useEffect, useCallback } from 'react';
import { Page, Section, PageLayout } from '../types/page-editor';

interface UsePageDataReturn {
  pages: Page[];
  currentPageId: string | null;
  setCurrentPageId: (pageId: string | null) => void;
  layout: PageLayout;
  setLayout: (layout: PageLayout) => void;
  loading: boolean;
  error: string | null;
  fetchPages: () => Promise<void>;
  saveLayout: (layout: PageLayout) => Promise<boolean>;
  createPage: (name: string) => Promise<Page | null>;
  deletePage: (pageId: string) => Promise<boolean>;
  disablePage: (pageId: string, disabled: boolean) => Promise<boolean>;
}

export const usePageData = (initialPageId?: string): UsePageDataReturn => {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageId, setCurrentPageId] = useState<string | null>(initialPageId || null);
  const [layout, setLayout] = useState<PageLayout>({ id: '', name: '', sections: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all pages (without sections for performance)
  const fetchPages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/get-pages');
      const data = await response.json();
      if (data.success) {
        const pagesData: Page[] = data.pages.map((p: any) => ({
          id: p.id.toString(),
          name: p.name || p.title,
          sections: [], // Will be loaded on demand
          active: p.active !== false,
          disabled: p.disabled || false
        }));
        setPages(pagesData);

        // Set default current page if none selected
        if (!currentPageId && pagesData.length > 0) {
          const defaultPage = pagesData.find(p => p.name.toLowerCase() === 'home') || pagesData[0];
          setCurrentPageId(defaultPage.id);
        }
      } else {
        setError('Failed to fetch pages');
      }
    } catch (err) {
      setError('Error fetching pages');
      console.error('Error fetching pages:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPageId]);

  // Load sections for a specific page
  const loadPageSections = useCallback(async (pageId: string): Promise<Section[]> => {
    try {
      const response = await fetch(`/api/get-page-sections?pageId=${pageId}`);
      const data = await response.json();
      if (data.success) {
        return data.sections || [];
      }
      return [];
    } catch (err) {
      console.error('Error loading page sections:', err);
      return [];
    }
  }, []);

  // Set current page ID and load its layout
  const setCurrentPageIdHandler = useCallback(async (pageId: string | null) => {
    setCurrentPageId(pageId);
    if (!pageId) {
      setLayout({ id: '', name: '', sections: [] });
      return;
    }

    const page = pages.find(p => p.id === pageId);
    if (page) {
      // Load sections if not already loaded
      let sections = page.sections;
      if (!sections || sections.length === 0) {
        sections = await loadPageSections(pageId);
        // Update the page in pages array
        setPages(prevPages =>
          prevPages.map(p => p.id === pageId ? { ...p, sections } : p)
        );
      }
      setLayout({ id: page.id, name: page.name, sections });
    }
  }, [pages, loadPageSections]);

  // Save layout (updates the current page's sections)
  const saveLayout = useCallback(async (newLayout: PageLayout): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/save-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newLayout, active: true }) // Assume active
      });
      const data = await response.json();
      if (data.success) {
        // Update the page in pages array
        setPages(prevPages =>
          prevPages.map(p => p.id === newLayout.id ? { ...p, sections: newLayout.sections } : p)
        );
        return true;
      } else {
        setError('Failed to save layout');
        return false;
      }
    } catch (err) {
      setError('Error saving layout');
      console.error('Error saving layout:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new page
  const createPage = useCallback(async (name: string): Promise<Page | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/create-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await response.json();
      if (data.success) {
        const newPage: Page = {
          id: data.page.id.toString(),
          name: data.page.name,
          sections: [],
          active: true,
          disabled: false
        };
        setPages(prevPages => [...prevPages, newPage]);
        return newPage;
      } else {
        setError('Failed to create page');
        return null;
      }
    } catch (err) {
      setError('Error creating page');
      console.error('Error creating page:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete page
  const deletePage = useCallback(async (pageId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setPages(prevPages => prevPages.filter(p => p.id !== pageId));
        if (currentPageId === pageId) {
          setCurrentPageId(null);
        }
        return true;
      } else {
        setError('Failed to delete page');
        return false;
      }
    } catch (err) {
      setError('Error deleting page');
      console.error('Error deleting page:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentPageId]);

  // Disable/Enable page
  const disablePage = useCallback(async (pageId: string, disabled: boolean): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/pages/${pageId}/disable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disabled })
      });
      const data = await response.json();
      if (data.success) {
        setPages(prevPages =>
          prevPages.map(p => p.id === pageId ? { ...p, disabled } : p)
        );
        return true;
      } else {
        setError('Failed to update page status');
        return false;
      }
    } catch (err) {
      setError('Error updating page status');
      console.error('Error updating page status:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPages();
  }, [fetchPages]);



  // Load layout when currentPageId changes
  useEffect(() => {
    if (currentPageId) {
      setCurrentPageIdHandler(currentPageId);
    }
  }, [currentPageId, setCurrentPageIdHandler]);

  return {
    pages,
    currentPageId,
    setCurrentPageId: setCurrentPageIdHandler,
    layout,
    setLayout,
    loading,
    error,
    fetchPages,
    saveLayout,
    createPage,
    deletePage,
    disablePage
  };
};
