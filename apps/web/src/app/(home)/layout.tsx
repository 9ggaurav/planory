import HomeSidebar from "@/components/navbar/HomeSidebar";

export default  function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <section className="w-full h-250">
          <section className="mx-auto max-w-[80vw] h-246 flex justify-start bg-[#FFF0E8] rounded-2xl">
          <HomeSidebar />
          {children}
        </section>
        </section>
  );
}