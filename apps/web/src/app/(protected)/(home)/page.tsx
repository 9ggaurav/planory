"use client";
import Image from "next/image";

export default function PlanaEmptyState() {
  return (
    <div className="flex items-center justify-center w-fit h-fit px-4">
      <div className=" text-white max-w-xl w-full rounded-xl p-8 text-center">
        
        <Image
          height={100}
          width={100}
          src="https://illustrations.popsy.co/gray/work-from-home.svg"
          alt="Plana illustration"
          className="w-36 mx-auto mb-6"
        />

        <h2 className="text-xl font-semibold mb-2 text-[#1E3F36]">
          Stay organized with Plana
        </h2>

        <p className="text-[16px] opacity-90 leading-relaxed text-[#5A9E8A]">
          Plana helps you plan, organize, and collaborate effortlessly. 
          Create boards, manage tasks, and track progress—all in one place. 
          Keep your workflow clear and stay focused on what matters.
        </p>

      </div>
    </div>
  );
}