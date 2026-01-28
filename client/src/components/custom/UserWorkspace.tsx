import WorkspaceCard from "@/components/custom/WorkspaceCard";

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
        title: "Development Team",
        tag: "Development",
    }
];

export default function UserWorkspace() {
    
    return (
        <section className="mt-8">
            <div>
            <h1 className="text-neutral-950 text-2xl font-bold">YOUR WORKSPACES</h1>
        </div>

        <div>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {
                    userBoards.map((board, index) => (
                        <WorkspaceCard
                            key={index}
                            coverImage={board.coverImage}
                            title={board.title}
                            tag={board.tag}
                            />
                    ))
                }
            </div>
        </div>
        </section>
    );
}