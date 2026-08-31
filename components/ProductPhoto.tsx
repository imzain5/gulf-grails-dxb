import Image from "next/image";

export default function ProductPhoto({
  src, alt, fit = "contain", padding = 0, sizes = "(max-width: 700px) 50vw, 300px",
}: {
  src: string;
  alt: string;
  fit?: "contain" | "cover";
  padding?: number;
  sizes?: string;
}) {
  return (
    <div style={{ position: "absolute", inset: padding }}>
      <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: fit }} />
    </div>
  );
}
