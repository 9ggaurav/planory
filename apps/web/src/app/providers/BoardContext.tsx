"use client";
import {createContext, useContext, useState} from "react";
import type { userBoard as BoardType } from "@repo/shared";

const BoardContext = createContext<{
    boards: BoardType[];
    addBoard: (b: BoardType) => void;
} | null> (null);

export function BoardProvider({ children }: {children: React.ReactNode}) {
    const [boards, setBoards] = useState<BoardType[]>([
    {
      id: "1",
      coverImage: "/cover2.jpg",
      title: "Marketing Team",
      tag: "Marketing",
      isTemplate: false,
      creator: "user12sdfsfsdf3",
      isPublic: false,
      liked: false
    },
    {
      id: "2",
      coverImage: "/cover.jpg",
      title: "Product Team",
      tag: "Product",
      isTemplate: true,
      creator: "user456",
      isPublic: true,
      liked: true

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