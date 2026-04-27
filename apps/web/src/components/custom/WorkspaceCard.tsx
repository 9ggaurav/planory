import { Badge } from "@/components/ui/badge"
import {
  Card
} from "@/components/ui/card"
import Image from "next/image";
import Link from "next/link";

export default function WorkspaceCard({
  coverImage,
  title,
  tag,
  creator,
  id,
  liked
}: {
  coverImage: string;
  title: string;
  tag: string;
  creator?: string;
  id: string | undefined;
  liked: boolean | undefined | null
}) {

  return (
    <Link draggable={true} href={`/b/${id}`}>
      <Card className="w-60 h-38 overflow-hidden shadow-md rounded-2xl border-[#D0ECE4] hover:border-[#B8E0D6] hover:bg-[#F5FBF8]">
      
      {/* Image Section */}
      <div className="relative h-28 w-full">
        <Image
          src={coverImage}
          fill
          alt="Event cover"
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-black/30" />

        <Badge
          variant="secondary"
          className="absolute top-1 left-1 z-10 text-xs px-2 py-0.5 bg-[rgba(255,255,255,0.8)] text-[#2D5C4F]"
        >
          {tag}
        </Badge>

        {/* <div className="absolute top-1 right-1 z-10 px-2">
          {liked ? <Star color="#fef620" strokeWidth={3} /> : <Star strokeWidth={3} />}
        </div> */}
      </div>

      {/* Content Section */}
      <div className="px-2 py-1">
        <h3 className="text-sm font-semibold leading-tight text-[#1E3F36]">
          {title}
        </h3>
        <p className="text-xs text-[#7AB8A8]">
          {creator}
        </p>
      </div>

    </Card>
    </Link>
    
  );
}


WorkspaceCard.defaultProps = {
    coverImage: "/logo.png",
}