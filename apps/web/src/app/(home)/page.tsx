import Image from "next/image";

export default function PlanaEmptyState() {
  return (
    <div className="flex items-center justify-center py-12 px-4 relative top-6 left-50">
      <div className="bg-[#2D5C4F] text-white max-w-xl w-full rounded-xl shadow-lg shadow-black/30 p-8 text-center">
        
        <Image
          height={100}
          width={100}
          src="https://illustrations.popsy.co/gray/work-from-home.svg"
          alt="Plana illustration"
          className="w-36 mx-auto mb-6"
        />

        <h2 className="text-xl font-semibold mb-2">
          Stay organized with Plana
        </h2>

        <p className="text-sm opacity-90 leading-relaxed">
          Plana helps you plan, organize, and collaborate effortlessly. 
          Create boards, manage tasks, and track progress—all in one place. 
          Keep your workflow clear and stay focused on what matters.
        </p>

      </div>
    </div>
  );
}