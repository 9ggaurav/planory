import DisplayBoardCard from "@/features/board/components/DisplayBoardCard";
// import NewBoardCard from "@/components/custom/newBoardCard";
import type { userBoard as UserBoardType } from "@repo/shared";
import { BriefcaseBusiness } from "lucide-react";


export default function UserWorkspace({userBoards}: {userBoards: UserBoardType[]}) {
    
    return (
        <section className="mt-8">
            <div className="text-[#1E3F36] mb-4">
                <div className="flex gap-2">
                    <BriefcaseBusiness />
                    <h1 className="text-[#1E3F36] text-2xl">WORKSPACE</h1>
                </div>
                <p className="text-[#5A9E8A]">Boards you own and collaborate on</p>
            </div>

            <div className="mt-1">
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {
                        userBoards.map((board, index) => (
                            <DisplayBoardCard
                                id={board.id}
                                key={index}
                                coverImage={board.coverImage}
                                title={board.title}
                                tag={board.tag}
                                isTemplate={board.isTemplate}
                                creator={board.creator}
                                // created_at={board.created_at}
                                // updated_at={board.updated_at}
                            />
                        ))
                    }
                </div>
            </div>
        </section>
    );
}