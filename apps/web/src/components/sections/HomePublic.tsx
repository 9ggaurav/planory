import DisplayBoardCard from "@/components/custom/DisplayBoardCard";
import type {userBoard as userBoardType} from "@repo/shared";
import { UsersRound } from "lucide-react";

export default function PublicBoards({publicBoards}: {publicBoards: userBoardType[]}) {
    return (
        <section className="mt-8">
            <div className="text-[#1E3F36]">
                <div className="flex gap-2">
                    <UsersRound />
                    <h1 className="text-2xl">Public Boards</h1>
                </div>
                <p className="text-[#5A9E8A]">Explore boards shared by the community</p>
            </div>
            <div>
                <div className="mt-4 grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {publicBoards.map((board, index) => (
                        board.isPublic &&
                        <DisplayBoardCard
                            id={board.id}
                            key={index}
                            coverImage={board.coverImage}
                            title={board.title}
                            tag={board.tag}
                            isTemplate={board.isTemplate}
                            creator={board.creator}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}