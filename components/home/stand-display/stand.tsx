import Image from "next/image";
import standbarT from "@/public/images/standbar_t-removebg-preview.png";
import standT from "@/public/images/stand_t-removebg-preview.png";

export default function Stand({
  isActive,
  alt,
}: {
  isActive: boolean;
  alt?: string;
}) {
  const standImage = isActive ? standbarT : standT;

  return (
    <div>
      <Image
        src={standImage}
        alt={alt || "Mill Stand"}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        priority={true}
      />
    </div>
  );
}
