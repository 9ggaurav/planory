import { useTasklist } from "@/app/providers/TasklistContext"
import AddNewTask from "@/components/sections/ProjectBoard/components/addNewTask";

export default function TaskListBoardMain() {
    const {tasklist, createTasklist} = useTasklist();

    function addNewTasklist(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title");
        if (typeof title !== "string") return;
        createTasklist(title);
        e.currentTarget.reset();
    }
    return (
        <div className="flex justify-start gap-3">
            <div id="tasklist-card" className="w-full h-full flex justify-start gap-3">
                {
                    tasklist && tasklist.map((task, index) => (
                        <div 
                            key={index}
                            className="w-75 min-w-60 bg-amber-600 h-full"
                            >
                            {task.title}
                        </div>
                    ))
                }
                <div className="w-75 min-w-60">
                    <AddNewTask addNewTask={addNewTasklist} />
                </div>
            </div>
        </div>
    )
}