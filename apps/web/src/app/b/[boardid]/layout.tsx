import { TooltipProvider } from "@/components/ui/tooltip";
import { InboxTaskProvider } from "@/app/providers/inboxTaskContext";
import { TasklistProvider } from "@/app/providers/TasklistContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <TooltipProvider>
          <InboxTaskProvider>
            <TasklistProvider>
              {children}
            </TasklistProvider>
          </InboxTaskProvider>
        </TooltipProvider>
  );
}