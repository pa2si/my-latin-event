import Image from "next/image";

function ImageContainer({
  mainImage,
  name,
}: {
  mainImage: string;
  name: string;
}) {
  return (
    <section className="relative h-[300px] md:h-[500px]">
      <Image
        src={mainImage}
        fill
        sizes="100vw"
        alt={name}
        className="rounded-md object-cover"
        priority
      />
    </section>
  );
}
export default ImageContainer;
