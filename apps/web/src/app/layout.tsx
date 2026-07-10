import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/navbar/Navbar';
import { BoardProvider } from '@/providers/BoardContext';
import { AuthProvider } from '@/providers/AuthProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <BoardProvider>
            <div className="bg-neutral-50">
              <NavBar />
              {children}
            </div>
          </BoardProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
