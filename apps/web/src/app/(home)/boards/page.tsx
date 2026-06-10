"use client";

import Container from "@/components/custom/Container";
import PublicBoards from "@/features/board/components/HomePublic";
import UserWorkspace from "@/features/board/components/UserWorkspace";
import { useBoards} from "@/providers/BoardContext";


export default function Home() {

  const { boards } = useBoards();


  return (
    <>
    <Container>
      <div className="ml-10">
        <PublicBoards publicBoards={boards} />
        <UserWorkspace userBoards={boards} />
      </div>
    </Container>
    </>
    
  );
}