"use client";

import { useParams } from "next/navigation";

export default function Board() {
    const params = useParams();
    const id = params.boardid;
    console.log(`params are ${id}`);
    return (
        <div>
            board
        </div>
    );
}