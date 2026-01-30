"use client";

import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import type { userBoard as BoardType } from '@/utils/types';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"


const navLinks = [
  { name: "Dashboard", href: "#" },
  { name: "Projects", href: "#" },
  { name: "Info", href: "#" },
  { name: "Account", href: "#" },
];

export default function NavBar({onAddBoard}: {onAddBoard?: (newBoard: BoardType) => void}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [boardData, setBoardData] = useState<BoardType>({
    coverImage: "",
    title: "",
    tag: "",
    isPublic: false,
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
    
    // Use FormData to get current input values directly
    // const formData = new FormData(e.currentTarget);
    
    const newBoard: BoardType = {
      coverImage: boardData.coverImage || "/logo.png",
      title: boardData.title,
      tag: boardData.tag,
      isPublic: boardData.isPublic,
      creator: "currentUser", // Replace with actual current user identifier
    };

    console.log("New Board Created:", newBoard);

    if (onAddBoard) {
      onAddBoard(newBoard);
    }

    setIsDialogOpen(false);
    setBoardData({ coverImage: "", title: "", tag: "", isPublic: false });
    e.currentTarget.reset();
  }

  return (
    <nav className='bg-white mx-auto shadow-md box-border'>
      <div className="w-full py-1 flex justify-around items-center">

        <div className="max-w-15 flex items-center justify-between px-4">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain"
          />

          <h1 className='text-1xl font-extrabold'>TaskFlow</h1>
        </div>

        {/* desktop nav links */}
        <div>
          <ul className="hidden md:flex md:space-x-6 md:justify-center md:mt-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-gray-700 text-[0.9rem] hover:text-blue-600 font-medium"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className='flex justify-around gap-2'>
          <Search className='md:hidden' />
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                className="max-w-140 min-w-80 shrink pl-2 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} /> */}
            </div>
          </div>
          {/* {} */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogTrigger asChild>
    <Button className="hidden hover:cursor-pointer md:block bg-blue-600 text-white hover:bg-blue-700">
      Create
    </Button>
  </DialogTrigger>
  
  <DialogContent className="sm:max-w-106.25">
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Create Board</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="title">Title</Label>
          <Input required id="title" name="title" value={boardData.title} onChange={handleChange} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="tag">Tag</Label>
          <Input required id="tag" name="tag" value={boardData.tag} onChange={handleChange} />
        </div>
        <div className="grid gap-3">
          <FieldLabel>
            <Field orientation="horizontal">
              <Input className='size-[0.9rem]' type='checkbox' id="checkbox" name="isPublic" checked={boardData.isPublic} onChange={handleChange} />
              <FieldContent>
                <FieldTitle>Publish Board</FieldTitle>
                <FieldDescription>
                  Make this board public so that others can see it too.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">Create</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
        </div>

        <div>
            {isMobileMenuOpen ? (
              <X
                className="md:hidden cursor-pointer"
                size={24}
                onClick={() => setIsMobileMenuOpen(false)} />
            ) : (
              <Menu
                className="md:hidden cursor-pointer"
                size={24}
                onClick={() => setIsMobileMenuOpen(true)} />
            )}  
        </div>

      </div>

      {/* mobile nav links */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <ul className="flex flex-col space-y-2 py-4 px-4">
            {navLinks.map((link) => (
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
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Create
              </Button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}