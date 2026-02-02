"use client";

import Container from "@/components/custom/Container";
import PublicBoards from "@/components/sections/HomePublic";
import UserWorkspace from "@/components/sections/UserWorkspace";
import { useState } from "react";
import type { userBoard as BoardType } from "@/utils/types";
import NavBar from "@/components/sections/Navbar";


export default function Home() {
  const [Boards, setBoards] = useState<BoardType[]>([
    {   
        id: "1",
        coverImage: "/vercel.svg",
        title: "Marketing Team",
        tag: "Marketing",
        creator: "user123",
    },
    {   
        id: "2",
        coverImage: "/logo.png",
        title: "Product Team",
        tag: "Product",
        creator: "user456",
    }
  ]);

  const handleAddBoard = (newBoard: BoardType) => {
    setBoards([...Boards, newBoard]);
  };

  return (
    <>
    <NavBar onAddBoard={handleAddBoard} />
    <Container>
      <PublicBoards publicBoards={Boards} />
      <UserWorkspace userBoards={Boards} />
    </Container>
    </>
    
  );
}
