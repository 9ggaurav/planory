import InboxBoardNavbar from "../../../components/sections/ProjectBoard/ProjectBoardComponents/InboxBoardNavbar";
import InboxTaskCards from "@/features/task/components/InboxTaskCards";
import { useTasks } from "@/providers/TaskContext";
import AddNewTask from "@/features/task/components/addNewTask";

export default function InboxBoard() {
    const {createTask} = useTasks();

    function addNewTask(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title");
        if (typeof title !== "string"){
            return;
        }

        createTask(title, 'inbox');
        e.currentTarget.reset()
    }

    return (
        <div className="hidden lg:block lg:min-w-[13vw] bg-[#FFF0E8] border-neutral-900 lg:h-245.25 rounded-2xl h-full">
            <InboxBoardNavbar />
            <main className="h-full">
                <AddNewTask addNewTask={addNewTask}>add a card</AddNewTask>
                <div className="h-full w-full">
                    <InboxTaskCards />
                </div>
            </main>
        </div>
    )
}