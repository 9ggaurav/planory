import { TooltipProvider } from "@/components/ui/tooltip";
import { TaskProvider } from "@/app/providers/TaskContext";
import { TasklistProvider } from "@/app/providers/TasklistContext";
import { DragAndDropProvider } from "@/app/providers/DragAndDropContext";

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