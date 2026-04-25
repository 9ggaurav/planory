"use client";
import {Group, Panel, Separator } from "react-resizable-panels";
import InboxBoard from "@/components/sections/ProjectBoard/InboxBoard";
import TasklistBoard from "@/components/sections/ProjectBoard/TasklistBoard";
import { useParams } from "next/navigation";

export default function Board() {
    const params = useParams();
    const id = params.boardid;
    console.log(`params are ${id}`);


    return (

        <div className="w-full flex gap-2 justify-center mx-auto h-full overflow-hidden">
            <Group className="w-full flex gap-1 justify-center h-full overflow-hidden mx-3">
                <Panel id="Inbox-board-panel" collapsible defaultSize="14%" minSize="14%">
                    <div className="overflow-auto">
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
                    <div className="overflow-auto">
                        <TasklistBoard />
                    </div>
                </Panel>
            </Group>
        </div>

    );
}