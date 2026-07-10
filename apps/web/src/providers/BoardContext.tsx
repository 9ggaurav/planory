'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import type { userBoard as BoardType } from '@repo/shared';
import api from '@/lib/axiosClient';

const BoardContext = createContext<{
  boards: BoardType[];
  userBoards: BoardType[];
  addBoard: (b: BoardType) => void;
} | null>(null);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [userBoards, setUserBoards] = useState<BoardType[]>([]);

  const fetchBoards = async () => {
    const response = await api('/boards/boards');
    setBoards(response.data.data);
  };

  const fetchUserBoards = async () => {
    const response = await api("/boards/user-boards");
    setUserBoards(response.data.data);
  }

  useEffect(() => {
    async function load() {
      await Promise.all([
        fetchBoards(),
        fetchUserBoards()
      ])
    }
    load();
  }, [])

  const addBoard = (newBoard: BoardType) => {
    setBoards(prev => [...prev, newBoard]);
  };

  return <BoardContext.Provider value={{ boards, userBoards,  addBoard }}>{children}</BoardContext.Provider>;
}

export function useBoards() {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error('useBoards must be used inside BoardProvider');
  return ctx;
}
