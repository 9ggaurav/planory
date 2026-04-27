import WorkspaceCard from "@/components/custom/WorkspaceCard";
// import NewBoardCard from "@/components/custom/newBoardCard";
import type { userBoard as UserBoardType } from "@/utils/types";
import { BriefcaseBusiness } from "lucide-react";


export default function UserWorkspace({userBoards}: {userBoards: UserBoardType[]}) {
    
    return (
        <section className="mt-8">
            <div className="text-[#1E3F36] flex gap-2">
                <BriefcaseBusiness />
                <h1 className="text-[#1E3F36] text-2xl">WORKSPACE</h1>
            </div>

            <div className="mt-1">
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {
                        userBoards.map((board, index) => (
                            <WorkspaceCard
                                id={board.id}
                                key={index}
                                coverImage={board.coverImage}
                                title={board.title}
                                tag={board.tag}
                                creator={board.creator}
                                liked={board.liked}
                            />
                        ))
                    }
                </div>
            </div>
        </section>
    );
}