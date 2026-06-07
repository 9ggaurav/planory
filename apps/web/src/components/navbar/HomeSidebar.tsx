"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, LayoutGrid, Star, File } from "lucide-react";

const navLinks = [
        { name: "Home", href: "/", icon: <House />},
        { name: "Boards", href: "/boards", icon: <LayoutGrid />},
        { name: "Likes", href: "#", icon: <Star />},
        { name: "Templates", href: "#", icon: <File />}
]

export default function HomeSidebar() {
    const pathname = usePathname();

    return (
         <section className="hidden md:block px-2 py-3 w-80 text-[#2D5C4F] bg-[white] border-2 border-neutral-200 rounded-2xl">
              <div className="text-[#C0604A] text-[20px] font-medium mb-5">
                <p>Menu</p>
              </div>
              <ul className="flex flex-col gap-0.5">
                {navLinks.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-4 px-3.5 py-2.5 rounded-lg
                                  text-sm font-medium w-full text-[18px]
                                  ${pathname === link.href
                                    ? 'text-emerald-700 bg-emerald-50'
                                    : 'bg-[#E8F7F2] text-[#1E3F36]'
                                  }`}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
        </section>
    )
}