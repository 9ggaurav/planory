import WorspaceCard from "@/components/custom/WorkspaceCard";
import type {userBoard as userBoardType} from "@/utils/types";


export default function PublicBoards({publicBoards}: {publicBoards: userBoardType[]}) {
    return (
        <section className="mt-8">
            <div>
                <h1 className="text-2xl font-bold">Public Boards</h1>
                <p className="text-muted-foreground">Explore boards shared by the community</p>
            </div>
            <div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    {publicBoards.map((board, index) => (
                        board.isPublic &&
                        <WorspaceCard
                            id={board.id}
                            key={index}
                            coverImage={board.coverImage}
                            title={board.title}
                            tag={board.tag}
                            creator={board.creator}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}