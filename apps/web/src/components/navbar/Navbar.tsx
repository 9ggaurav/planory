"use client";

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import type { userBoard as BoardType } from '@repo/shared';
import { useBoards } from "@/providers/BoardContext"
import AddNewBoard from '@/features/board/components/AddNewBoard';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';

const navLinks = [
  { name: "Dashboard", href: "/boards" },
  { name: "Projects", href: "#" },
  { name: "Info", href: "#" },
  // { name: "Account", href: "#" },
];

export default function NavBar() {
  const { addBoard } = useBoards();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [boardData, setBoardData] = useState<BoardType>({
    coverImage: "",
    title: "",
    tag: "",
    isTemplate: false,
    isPublic: false,
    created_at: "",
    updated_at: ""
  });
  const {user} = useAuth();
  console.log("user: ", user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setBoardData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!boardData.title || !boardData.tag) {
      alert("Please fill in all required fields");
      return;
    }

    const newBoard: BoardType = {
      id: crypto.randomUUID(),
      coverImage: boardData.coverImage || "/cover2.jpg",
      title: boardData.title,
      tag: boardData.tag,
      isTemplate: boardData.isTemplate,
      isPublic: boardData.isPublic || false,
      creator: "currentUser",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addBoard(newBoard);
    setBoardData({ coverImage: "", title: "", tag: "", isPublic: false, isTemplate: false, created_at: "", updated_at: "" });
    setIsDialogOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/vercel.svg" alt="Plana logo" width={22} height={22} className="object-contain" />
          <span className="text-[13px] font-extrabold text-neutral-800 tracking-wide">PLANA</span>
        </Link>

        {/* Search — hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-xs">
          <Input
            type="text"
            placeholder="Search..."
            className="h-8 text-[13px] bg-neutral-50 border-neutral-200 placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-300 focus-visible:ring-offset-0 rounded-lg w-full"
          />
        </div>

        {/* Create button — hidden on mobile */}
        <div className="hidden md:block shrink-0">
          <AddNewBoard
            boardData={boardData}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </div>

        {/* Desktop nav links */}
        <div></div>
        <ul className="hidden md:flex items-center gap-5">
          {navLinks.map(link => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="text-[13px] font-medium text-neutral-500 hover:text-neutral-800 transition-colors"
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/me"
              className="text-[13px] font-medium text-neutral-500 hover:text-neutral-800 transition-colors underline"
            >
              {user?.name}
            </Link>
          </li>
        </ul>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

      </div>

      {/* Mobile dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white px-4 py-3 flex flex-col gap-1">
          {/* Mobile search */}
          <Input
            type="text"
            placeholder="Search..."
            className="h-8 text-[13px] bg-neutral-50 border-neutral-200 placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-300 focus-visible:ring-offset-0 rounded-lg mb-2"
          />

          {navLinks.map(link => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[13px] font-medium text-neutral-600 hover:text-neutral-900 py-2 px-2 rounded-lg hover:bg-neutral-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <div className="mt-1">
            <AddNewBoard
              boardData={boardData}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </nav>
  );
}