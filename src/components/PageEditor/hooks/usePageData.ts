import { useState, useEffect, useCallback } from 'react';
import { Page, Section, PageLayout } from '@/types/page-editor';

export const usePageData = (initialPageId?: string) => {
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

  // Load layout for a specific page
  const loadPageLayout = useCallback(async (pageId: string): Promise<PageLayout> => {
    try {
      const response = await fetch(`/api/get-page-layout?page_id=${pageId}`);
      const data = await response.json();
      if (data.success && data.layout) {
        return data.layout;
      }
      // Return default layout
      return {
        id: pageId,
        name: 'New Page',
        sections: []
      };
    } catch (err) {
      console.error('Error loading page layout:', err);
      return {
        id: pageId,
        name: 'New Page',
        sections: []
      };
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
      const pageLayout = await loadPageLayout(pageId);
      setLayout(pageLayout);
    }
  }, [pages, loadPageLayout]);

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

  // Toggle page active status
  const togglePageActive = useCallback((pageId: string, active: boolean) => {
    setPages(prevPages =>
      prevPages.map(p => p.id === pageId ? { ...p, active } : p)
    );
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
    disablePage,
    togglePageActive
  };
};
