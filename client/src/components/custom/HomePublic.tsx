import WorspaceCard from "@/components/custom/WorkspaceCard";

const publicBoards = [
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
        title: "Development Team",
        tag: "Development",
    }
];

export default function PublicBoards() {
    return (
        <section className="mt-8">
            <div>
                <h1 className="text-2xl font-bold">Public Boards</h1>
                <p className="text-muted-foreground">Explore boards shared by the community</p>
            </div>
            <div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    {publicBoards.map((board, index) => (
                        <WorspaceCard
                            key={index}
                            coverImage={board.coverImage}
                            title={board.title}
                            tag={board.tag}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}