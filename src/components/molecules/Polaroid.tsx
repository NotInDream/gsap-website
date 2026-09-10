type PolaroidProps = {
  src: string;
  name: string;
  alt?: string;
  /** Untuk penempatan & rotasi saat di-stack oleh parent (mis. "absolute rotate-[-6deg]"). */
  className?: string;
};

export const Polaroid = ({
  src,
  name,
  alt = "",
  className = "",
}: PolaroidProps) => {
  return (
    <figure
      className={`w-[300px] bg-white p-4 pb-16 shadow-2xl shadow-black/40 ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="block aspect-square w-full object-cover"
      />
      <figcaption className="mt-4 text-center font-cormorant text-2xl italic text-neutral-800">
        {name}
      </figcaption>
    </figure>
  );
};
