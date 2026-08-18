'use client';
import { useTasks } from '@/providers/TaskContext';
import { useDnD } from '@/providers/DragAndDropContext';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { inboxTask as SharedInboxTask } from '@repo/shared'; 

export default function InboxTaskCards() {
  // const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
//   const [modalPosition, setModalPosition] = useState<{ top: number; left: number }>({
//     top: 0,
//     left: 0,
//   });
  const { Tasks } = useTasks();
  const { handleTaskDragStart, handleTaskDrop, handleListContainerDrop } = useDnD();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // const selectedTaskId = searchParams.get('taskId');

  function handleTaskClick(e: React.MouseEvent<HTMLDivElement>, taskId: string | number) {
    e.stopPropagation();
    e.preventDefault();
    // const rect = e.currentTarget.getBoundingClientRect();
    // setModalPosition({
    //   top: rect.bottom + window.scrollY - 24,
    //   // top: 200,
    //   left: rect.left + window.scrollX + 500,
    // });
    const params = new URLSearchParams(searchParams.toString());
    params.set('taskId', taskId.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  const InboxOnlyTasks = (Tasks as SharedInboxTask[]).filter(task => task.taskListId?.toString() === 'inbox').sort(
    (a, b) => a.position - b.position,
  );

  return (
    <div 
      className="w-full flex flex-col gap-1.5 px-2 overflow-y-auto"
      onDragOver={e => e.preventDefault()}
      onDrop={() => handleListContainerDrop('inbox')}
      >
      {InboxOnlyTasks.map((task, index) => (
        <div
          onClick={e => handleTaskClick(e, task.id)}
          id="new-inbox-task-card"
          draggable={true}
          key={task.id}
          onDragStart={() => handleTaskDragStart('inbox', index, task.id)}
          onDragOver={e => e.preventDefault()}
          onDrop={() => handleTaskDrop('inbox', index)}
          className={`
                        group flex items-start gap-2 bg-white rounded-xl border px-3 py-2.5
                        cursor-pointer select-none transition-all duration-150
                        hover:border-neutral-300 hover:shadow-sm active:scale-[0.98]
                        ${
                          task.isDone
                            ? 'border-neutral-200/60 bg-neutral-50/80'
                            : 'border-neutral-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                        }
                    `}
        >
          <div
            className={`mt-0.75 w-3 h-3 rounded-full border shrink-0 flex items-center justify-center transition-colors ${
              task.isDone
                ? 'bg-emerald-500 border-emerald-500'
                : 'border-neutral-300 group-hover:border-neutral-400'
            }`}
          >
            {task.isDone && (
              <svg width="7" height="5.5" viewBox="0 0 8 6" fill="none" aria-hidden="true">
                <path
                  d="M1 3L3 5L7 1"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <p
            className={`text-[13px] leading-snug flex-1 ${
              task.isDone ? 'line-through text-neutral-400' : 'text-neutral-700'
            }`}
          >
            {task.title}
          </p>
        </div>
      ))}

      {/* <DisplayTaskModal selectedTaskId={selectedTaskId} /> */}
    </div>
  );
}
