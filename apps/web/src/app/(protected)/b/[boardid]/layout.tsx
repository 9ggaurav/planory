import { TooltipProvider } from "@/components/ui/tooltip";
import { TaskProvider } from "@/providers/TaskContext";
import { TasklistProvider } from "@/providers/TasklistContext";
import { DragAndDropProvider } from "@/providers/DragAndDropContext";
import { InboxProvider } from "@/providers/inboxContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <TooltipProvider>
            <TaskProvider>
              
                <InboxProvider>
                  <TasklistProvider>
                <DragAndDropProvider>
                  {children}
                </DragAndDropProvider>
              </TasklistProvider>
                </InboxProvider>

            </TaskProvider>
        </TooltipProvider>
  );
}