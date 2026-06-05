import { TooltipProvider } from "@/components/ui/tooltip";
import { InboxTaskProvider } from "@/app/providers/inboxTaskContext";
import { TasklistProvider } from "@/app/providers/TasklistContext";
import { DragAndDropProvider } from "@/app/providers/DragAndDropContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <TooltipProvider>
            <InboxTaskProvider>
              <TasklistProvider>
                <DragAndDropProvider>
                  {children}
                </DragAndDropProvider>
              </TasklistProvider>
            </InboxTaskProvider>
        </TooltipProvider>
  );
}