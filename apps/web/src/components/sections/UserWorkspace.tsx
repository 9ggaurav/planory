import WorkspaceCard from "@/components/custom/WorkspaceCard";
// import NewBoardCard from "@/components/custom/newBoardCard";
import type { userBoard as UserBoardType } from "@/utils/types";


export default function UserWorkspace({userBoards}: {userBoards: UserBoardType[]}) {
    
    return (
        <section className="mt-8">
            <div className="">
                <h1 className="text-white text-2xl font-bold">YOUR WORKSPACES</h1>
            </div>

            <div className="mt-3">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {
                        userBoards.map((board, index) => (
                            <WorkspaceCard
                                id={board.id}
                                key={index}
                                coverImage={board.coverImage}
                                title={board.title}
                                tag={board.tag}
                                creator={board.creator}
                            />
                        ))
                    }
                </div>
            </div>
        </section>
    );
}