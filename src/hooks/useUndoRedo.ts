import { useState, useCallback } from 'react';

interface UseUndoRedoReturn<T> {
  state: T;
  setState: (newState: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: (newState: T) => void;
  clear: () => void;
}

export function useUndoRedo<T>(initialState: T, maxHistory: number = 50): UseUndoRedoReturn<T> {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const state = history[currentIndex];
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    setHistory((prevHistory) => {
      const currentState = prevHistory[currentIndex];
      const nextState = typeof newState === 'function'
        ? (newState as (prev: T) => T)(currentState)
        : newState;

      // Remove any future history when making a new change
      const newHistory = prevHistory.slice(0, currentIndex + 1);
      newHistory.push(nextState);

      // Limit history size
      if (newHistory.length > maxHistory) {
        newHistory.shift();
        setCurrentIndex(currentIndex);
        return newHistory;
      }

      setCurrentIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [currentIndex, maxHistory]);

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [canRedo]);

  const reset = useCallback((newState: T) => {
    setHistory([newState]);
    setCurrentIndex(0);
  }, []);

  const clear = useCallback(() => {
    setHistory([history[currentIndex]]);
    setCurrentIndex(0);
  }, [history, currentIndex]);

  return {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    clear,
  };
}
