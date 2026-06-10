"use client"
import {createContext, useContext} from "react";
import { useDragAndDrop } from "@/providers/useDragAndDrop";

type DragAndDropContextType = ReturnType<typeof useDragAndDrop>;

const DragAndDropContext = createContext<DragAndDropContextType | null>(null);

export function DragAndDropProvider({ children }: { children: React.ReactNode }) {
    const dnd = useDragAndDrop(); // no boardId here — board-specific listIndex passed at call site

    return (
        <DragAndDropContext.Provider value={dnd}>
            {children}
        </DragAndDropContext.Provider>
    );
}

export function useDnD() {
    const ctx = useContext(DragAndDropContext);
    if (!ctx) throw new Error("useDnD must be used inside DragAndDropProvider");
    return ctx;
}