import { TooltipProvider } from "@/components/ui/tooltip";
import { InboxTaskProvider } from "@/app/providers/inboxTaskContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <TooltipProvider>
          <InboxTaskProvider>
            {children}
          </InboxTaskProvider>
        </TooltipProvider>
  );
}