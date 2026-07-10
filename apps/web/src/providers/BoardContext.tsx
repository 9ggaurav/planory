"use client";
import {createContext, useContext, useState, useEffect} from "react";
import type { userBoard as BoardType } from "@repo/shared";
import {boards as defaultBoards} from "@/lib/mockData";
import api from "@/lib/axiosClient";

const BoardContext = createContext<{
    boards: BoardType[];
    addBoard: (b: BoardType) => void;
} | null> (null);

export function BoardProvider({ children }: {children: React.ReactNode}) {
    const [boards, setBoards] = useState<BoardType[]>([...defaultBoards]);

  const addBoard = (newBoard: BoardType) => {
    setBoards(prev => [...prev, newBoard]);
  };

  return (
    <BoardContext.Provider value={{ boards, addBoard }}>
        {children}
    </BoardContext.Provider>
  )
}

export function useBoards(){
    const ctx = useContext(BoardContext);
    if (!ctx) throw new Error("useBoards must be used inside BoardProvider");
    return ctx;
}