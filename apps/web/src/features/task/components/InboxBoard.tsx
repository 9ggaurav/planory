import InboxBoardNavbar from "@/components/navbar/InboxBoardNavbar";
import InboxTaskCards from "@/features/task/components/InboxTaskCards";
import { useTasks } from "@/providers/TaskContext";
import AddNewTask from "@/features/task/components/addNewTask";

export default function InboxBoard() {
    const {createTask} = useTasks();

    async function addNewTask(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget; // capture before awaiting to avoid synthetic event reuse
        const formData = new FormData(form);
        const title = formData.get("title");
        if (typeof title !== "string"){
            return;
        }

        await createTask(title, 'inbox');
        form.reset();
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