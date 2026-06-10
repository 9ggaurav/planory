import TaskListBoardMain from './TaskListBoardMain';
import TasklistBoardNavbar from '@/components/navbar/TasklistBoardNavbar';

export default function TasklistBoard() {
  return (
    <div className="bg-[#E8F7F2] border-neutral-900 h-245.25 rounded-2xl">
      <TasklistBoardNavbar />
      <main className="h-full w-full overflow-x-auto overflow-y-auto">
        <TaskListBoardMain />
      </main>
    </div>
  );
}
