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
  id
}: {
  coverImage: string;
  title: string;
  tag: string;
  creator?: string;
  id: string | undefined;
}) {
  return (
    <Link draggable={true} href={`/b/${id}`}>
      <Card className="w-54 h-40 overflow-hidden shadow-md">
      
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
          className="absolute top-1 left-1 z-10 text-xs px-2 py-0.5"
        >
          {tag}
        </Badge>
      </div>

      {/* Content Section */}
      <div className="px-2 py-1">
        <h3 className="text-sm font-semibold leading-tight">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">
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