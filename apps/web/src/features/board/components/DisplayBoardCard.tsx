import { Card } from "@/components/ui/card"
import Image from "next/image";
import Link from "next/link";

export default function DisplayBoardCard({
  coverImage,
  title,
  tag,
  isTemplate,
  creator,
  id,
}: {
  coverImage: string;
  title: string;
  tag: string;
  isTemplate: boolean;
  creator?: string;
  id: string | undefined;
}) {
  return (
    <Link draggable={true} href={`/b/${id}`}>
      <Card className="w-56 h-36 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-md hover:border-neutral-300 hover:scale-[1.02] transition-all duration-150 cursor-pointer select-none">

        {/* Image */}
        <div className="relative h-24 w-full">
          <Image
            src={coverImage}
            fill
            alt="Workspace cover"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />

          {/* Tag badge */}
          <span className="absolute top-2 left-2 z-10 inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/85 text-neutral-600 backdrop-blur-sm">
            {tag}
          </span>

          {/* Template badge */}
          {isTemplate && (
            <span className="absolute bottom-2 right-2 z-10 inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/85 text-neutral-600 backdrop-blur-sm">
              Template
            </span>
          )}
        </div>

        {/* Content */}
        <div className="px-3 py-2">
          <h3 className="text-[13px] font-semibold text-neutral-800 leading-snug truncate">
            {title}
          </h3>
          {creator && (
            <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
              {creator}
            </p>
          )}
        </div>

      </Card>
    </Link>
  );
}

DisplayBoardCard.defaultProps = {
  coverImage: "/logo.png",
}