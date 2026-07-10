import { TooltipProvider } from "@/components/ui/tooltip";
import { TaskProvider } from "@/providers/TaskContext";
import { TasklistProvider } from "@/providers/TasklistContext";
import { DragAndDropProvider } from "@/providers/DragAndDropContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <TooltipProvider>
            <TaskProvider>
              <TasklistProvider>
                <DragAndDropProvider>
                  {children}
                </DragAndDropProvider>
              </TasklistProvider>
            </TaskProvider>
        </TooltipProvider>
  );
}