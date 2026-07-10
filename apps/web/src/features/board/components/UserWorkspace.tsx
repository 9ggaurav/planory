import DisplayBoardCard from '@/features/board/components/DisplayBoardCard';
import { BriefcaseBusiness } from 'lucide-react';
import { useBoards } from '@/providers/BoardContext';

export default function UserWorkspace() {
  const { userBoards } = useBoards();

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
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {userBoards.map((board, index) => (
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
