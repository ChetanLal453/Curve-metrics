import { useEffect, useRef, useCallback, useState } from 'react';
import toast from 'react-hot-toast';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => void | Promise<void>;
  interval?: number; // milliseconds
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  lastSaved: Date | null;
  isSaving: boolean;
  saveNow: () => void;
}

export function useAutoSave<T>({
  data,
  onSave,
  interval = 30000, // 30 seconds default
  enabled = true,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string>(JSON.stringify(data));

  const saveNow = useCallback(async () => {
    if (isSaving) return;

    const currentData = JSON.stringify(data);
    
    // Don't save if data hasn't changed
    if (currentData === previousDataRef.current) {
      return;
    }

    try {
      setIsSaving(true);
      await onSave(data);
      setLastSaved(new Date());
      previousDataRef.current = currentData;
      toast.success('Auto-saved successfully');
    } catch (error) {
      console.error('Auto-save failed:', error);
      toast.error('Auto-save failed');
    } finally {
      setIsSaving(false);
    }
  }, [data, onSave, isSaving]);

  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      saveNow();
    }, interval);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, interval, saveNow]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (previousDataRef.current !== JSON.stringify(data)) {
        saveNow();
      }
    };
  }, []);

  return {
    lastSaved,
    isSaving,
    saveNow,
  };
}
