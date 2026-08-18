"use client";
import {Group, Panel, Separator } from "react-resizable-panels";
import InboxBoard from "@/features/task/components/InboxBoard";
import TasklistBoard from "@/features/tasklist/components/TasklistBoard";
import { useSearchParams } from "next/navigation";
import DisplayTaskModal from "@/features/task/components/DisplayTaskModal";

export default function Board() {
    const searchParams = useSearchParams();
    const selectedTaskId = searchParams.get('taskId');


    return (

        <div className="w-full flex gap-2 justify-center mx-auto h-full overflow-hidden">
            <Group className="w-full flex gap-1 justify-center h-full overflow-hidden mx-3">
                <Panel id="Inbox-board-panel" collapsible defaultSize="14%" minSize="14%">
                    <div className=" no-scrollbar overflow-y-auto">
                        <InboxBoard />
                    </div>
                </Panel>
                <Separator className="w-2 flex items-center justify-center group cursor-col-resize active:cursor-grabbing">
                    <div
                        className="
                            w-0.5 h-4 rounded outline-0 border-0
                            bg-gray-300
                            transition-all duration-200
                            group-hover:bg-sky-400 
                            group-hover:h-240
                             "
                        />
                </Separator>

                <Panel minSize="28%">
                    <div className="overflow-hidden">
                        <TasklistBoard />
                    </div>
                </Panel>
            </Group>
            <DisplayTaskModal selectedTaskId={selectedTaskId} />
        </div>

    );
}