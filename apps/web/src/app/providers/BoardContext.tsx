"use client";
import {createContext, useContext, useState} from "react";
import type { userBoard as BoardType } from "@/utils/types";

const BoardContext = createContext<{
    boards: BoardType[];
    addBoard: (b: BoardType) => void;
} | null> (null);

export function BoardProvider({ children }: {children: React.ReactNode}) {
    const [boards, setBoards] = useState<BoardType[]>([
    {
      id: "1",
      coverImage: "/vercel.svg",
      title: "Marketing Team",
      tag: "Marketing",
      creator: "user12sdfsfsdf3",
      isPublic: false
    },
    {
      id: "2",
      coverImage: "/logo.png",
      title: "Product Team",
      tag: "Product",
      creator: "user456",
      isPublic: true
    },
  ]);
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