import DisplayBoardCard from "@/features/board/components/DisplayBoardCard";
import { UsersRound } from "lucide-react";
import api from "../../../lib/axiosClient";
import { useEffect, useState } from "react";
import type { userBoard as userBoardtype } from "@repo/shared";


export default function PublicBoards() {
    const [boards, setBoards] = useState<userBoardtype[] | null>();
    useEffect(() => {
        async function fetchPublicBoards() {
            try {
                const response = await api("/boards/boards");
                const parsedResponse = response.data;
                setBoards(parsedResponse.data);
            } catch(error) {
                console.error(error);
            }
        }

        fetchPublicBoards();
    }, [])

    console.log(boards);

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
                    {boards && boards?.map((board, index) => (
                        board.isPublic &&
                        <DisplayBoardCard
                            id={board.id}
                            key={index}
                            coverImage={board.coverImage}
                            title={board.title}
                            tag={board.tag[0]}
                            isTemplate={board.isTemplate}
                            creator={board.creator}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}