"use client";

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import type { userBoard as BoardType } from '@repo/shared';
import {useBoards} from "@/app/providers/BoardContext"
import AddNewSection from '@/components/custom/AddNew';
import Link from 'next/link';


const navLinks = [
  { name: "Dashboard", href: "/boards" },
  { name: "Projects", href: "#" },
  { name: "Info", href: "#" },
  { name: "Account", href: "#" },
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
    liked: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setBoardData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

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
      liked: boardData.liked
    };

    addBoard(newBoard);
    
    // Reset form state
    setBoardData({ coverImage: "", title: "", tag: "", isPublic: false, isTemplate: false, liked: false});
    setIsDialogOpen(false);
  }

  return (
    <nav className="bg-[#2D5C4F] text-white mx-auto box-border py-1 sticky top-0">
      <div className="w-full py-1 flex justify-start gap-15 pl-50 items-center">
        <div className="max-w-15 flex items-center gap-1 justify-between px-4">
          <Image src="/vercel.svg" alt="Logo" width={30} height={30} className="object-contain" />
          <Link href={'/'}>
            <h1 className="text-1xl font-extrabold text-[#FFFFFF]">PLANA</h1>
          </Link>
  
        </div>


        <div className="flex justify-around gap-2">
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                className="hidden md:block flex-1 min-w-200 max-w-200 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className='hidden lg:inline'>
            <AddNewSection boardData={boardData} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} handleChange={handleChange} handleSubmit={handleSubmit} />
          </div>
        </div>

        {/* desktop nav links */}
        <div>
          <ul className="hidden md:flex md:space-x-6 md:justify-center md:mt-2">
            {navLinks.map(link => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-[#A8CCC4] text-[0.9rem] hover:text-[#FFFFFF] font-medium"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          {isMobileMenuOpen ? (
            <X
              className="md:hidden cursor-pointer"
              size={24}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          ) : (
            <Menu
              className="md:hidden cursor-pointer"
              size={24}
              onClick={() => setIsMobileMenuOpen(true)}
            />
          )}
        </div>
      </div>

      {/* mobile nav links */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <ul className="flex flex-col space-y-2 py-4 px-4">
            {navLinks.map(link => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="block text-gray-700 text-[0.9rem] hover:text-blue-600 font-medium"
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li>
              <AddNewSection boardData={boardData} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} handleChange={handleChange} handleSubmit={handleSubmit} />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}