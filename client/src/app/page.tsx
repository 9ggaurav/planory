"use client";

import Container from "@/components/custom/Container";
import PublicBoards from "@/components/sections/HomePublic";
import Navbar from "@/components/sections/Navbar";
import UserWorkspace from "@/components/sections/UserWorkspace";
import { useState } from "react";
import type { userBoard as BoardType } from "@/utils/types";


export default function Home() {
  const [Boards, setBoards] = useState<BoardType[]>([
    {
        coverImage: "/vercel.svg",
        title: "Marketing Team",
        tag: "Marketing",
    },
    {
        coverImage: "/logo.png",
        title: "Product Team",
        tag: "Product",
    }
  ]);

  const handleAddBoard = (newBoard: BoardType) => {
    setBoards([...Boards, newBoard]);
    console.log("Board added to Home:", Boards);
  }

  return (
    <>
      <Navbar onAddBoard = {handleAddBoard}/>
      <Container>
        <PublicBoards publicBoards={Boards} />
        <UserWorkspace userBoards={Boards} />
      </Container>
    </>
  );
}
