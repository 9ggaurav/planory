// Types (keep these — they'll help a lot later)

export type Board = {
  id: string;
  title: string;
  created_at: string;
};

export type TaskList = {
  id: string;
  board_id: string;
  title: string;
  position: number;
  created_at: string;
};

export type Task = {
  id: string;
  task_list_id: string;
  title: string;
  description: string;
  position: number;
  created_at: string;
};

// Mock Data

export const boards: Board[] = [
  {
    id: "1",
    title: "Project Alpha",
    created_at: "2026-04-25T10:00:00Z",
  },
];

export const taskLists: TaskList[] = [
  {
    id: "l1",
    board_id: "b1",
    title: "To Do",
    position: 1,
    created_at: "2026-04-25T10:01:00Z",
  },
  {
    id: "l2",
    board_id: "b1",
    title: "In Progress",
    position: 2,
    created_at: "2026-04-25T10:02:00Z",
  },
  {
    id: "l3",
    board_id: "b1",
    title: "Done",
    position: 3,
    created_at: "2026-04-25T10:03:00Z",
  },
];

export const tasks: Task[] = [
  {
    id: "t1",
    task_list_id: "l1",
    title: "Setup project repo",
    description: "Initialize git and README",
    position: 1,
    created_at: "2026-04-25T10:05:00Z",
  },
  {
    id: "t2",
    task_list_id: "l1",
    title: "Design database schema",
    description: "Boards, lists, tasks",
    position: 2,
    created_at: "2026-04-25T10:06:00Z",
  },
  {
    id: "t3",
    task_list_id: "l2",
    title: "Build API endpoints",
    description: "CRUD for boards and tasks",
    position: 1,
    created_at: "2026-04-25T10:10:00Z",
  },
  {
    id: "t4",
    task_list_id: "l2",
    title: "Implement drag & drop UI",
    description: "Use dnd-kit or similar",
    position: 2,
    created_at: "2026-04-25T10:12:00Z",
  },
  {
    id: "t5",
    task_list_id: "l3",
    title: "Project setup complete",
    description: "Initial setup done",
    position: 1,
    created_at: "2026-04-25T10:15:00Z",
  },
];