import DisplayBoardCard from '@/features/board/components/DisplayBoardCard';
import { UsersRound } from 'lucide-react';
import { useBoards } from '@/providers/BoardContext';

export default function PublicBoards() {
  const { boards } = useBoards();

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
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {boards &&
            boards.map(
              (board, index) =>
                board.isPublic && (
                  <DisplayBoardCard
                    key={index}
                    id={board.id}
                    coverImage={board.coverImage}
                    title={board.title}
                    tag={board.tag[0]}
                    isTemplate={board.isTemplate}
                    creator={board.creator}
                  />
                ),
            )}
        </div>
      </div>
    </section>
  );
}
