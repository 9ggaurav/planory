import Container from "@/components/custom/Container";
import PublicBoards from "@/components/sections/HomePublic";
import Navbar from "@/components/sections/Navbar";
import UserWorkspace from "@/components/sections/UserWorkspace";

const userBoards = [
    {
        coverImage: "/vercel.svg",
        title: "Marketing Team",
        tag: "Marketing",
    },
    {
        coverImage: "/logo.png",
        title: "Product Team",
        tag: "Product",
    },
    {
        coverImage: "/logo.png",
        title: "Design Team",
        tag: "Design",
    },
    {
        coverImage: "/vercel.svg",
        title: "Developmmment Team",
        tag: "Development",
    }
];

export default function Home() {
  return (
    <>
      <Navbar />
      <Container>
        <PublicBoards publicBoards={userBoards} />
        <UserWorkspace userBoards={userBoards} />
      </Container>
    </>
  );
}
