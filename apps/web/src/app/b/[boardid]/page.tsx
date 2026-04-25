"use client";

import InboxBoard from "@/components/sections/ProjectBoard/InboxBoard";
import TasklistBoard from "@/components/sections/ProjectBoard/TasklistBoard";
import { useParams } from "next/navigation";

export default function Board() {
    const params = useParams();
    const id = params.boardid;
    console.log(`params are ${id}`);
    return (
        <div className="w-full flex gap-2 justify-center mx-auto h-full pt-2">
            <InboxBoard />
            <TasklistBoard />
        </div>
    );
}