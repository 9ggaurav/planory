import Container from "@/components/custom/Container";
import PublicBoards from "@/components/custom/HomePublic";
import Navbar from "@/components/custom/Navbar";
import UserWorkspace from "@/components/custom/UserWorkspace";

export default function Home() {
  return (
    <>
      <Navbar />
      <Container>
        <PublicBoards />
        <UserWorkspace />
      </Container>
    </>
  );
}
