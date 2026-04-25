"use client";

import Container from "@/components/custom/Container";
import PublicBoards from "@/components/sections/HomePublic";
import UserWorkspace from "@/components/sections/UserWorkspace";
import { useBoards} from "@/app/providers/BoardContext";


export default function Home() {

  const { boards } = useBoards();


  return (
    <>
    <Container>
      <PublicBoards publicBoards={boards} />
      <UserWorkspace userBoards={boards} />
    </Container>
    </>
    
  );
}
