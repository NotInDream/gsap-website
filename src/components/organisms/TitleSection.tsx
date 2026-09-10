import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ayaPaint from "../../assets/foregrounds/section-1/Aya_paint.png";
import background from "../../assets/backgrounds/background-1.jpg";
import adamHand from "../../assets/foregrounds/section-1/adam-hand.png";
import zeusHand from "../../assets/foregrounds/section-1/zeus-hand.png";

const capital = "font-kapakana text-9xl tracking-normal font-normal";

export const TitleSection = () => {
  const root = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ayaRef = useRef<HTMLImageElement>(null);
  const adamRef = useRef<HTMLDivElement>(null);
  const zeusRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Background dibesarkan sedikit agar ada ruang saat digeser (tepi tak bolong).
      gsap.set(bgRef.current, { scale: 1.12 });

      // Pivot tiap tangan di sudut yang menempel → ujung bebasnya yang naik-turun.
      gsap.set(adamRef.current, { transformOrigin: "left bottom" });
      gsap.set(zeusRef.current, { transformOrigin: "right top" });

      let onMove: ((e: MouseEvent) => void) | undefined;

      const startAmbient = () => {
        // Float idle: ayunan rotasi halus dari posisi diam (0) → tanpa lompatan.
        gsap.to(adamRef.current, {
          rotation: 3.5,
          duration: 1.25,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        gsap.to(zeusRef.current, {
          rotation: -3.5,
          duration: 1.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        // Parallax kursor. factor positif = searah kursor (background),
        // negatif = berlawanan (objek depan). Makin besar |factor|, makin "depan".
        const layers = [
          { el: bgRef.current, factor: 30 },
          { el: textRef.current, factor: -25 },
          { el: adamRef.current, factor: -55 },
          { el: zeusRef.current, factor: -55 },
          { el: ayaRef.current, factor: -85 },
        ].map(({ el, factor }) => ({
          factor,
          x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" }),
        }));

        onMove = (e: MouseEvent) => {
          const r = root.current!.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
          const ny = (e.clientY - r.top) / r.height - 0.5;
          layers.forEach(({ x, y, factor }) => {
            x(nx * factor);
            y(ny * factor);
          });
        };
        root.current!.addEventListener("mousemove", onMove);
      };

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: startAmbient,
      });

      tl.from(textRef.current, { y: -140, autoAlpha: 0, duration: 1 }, 0.4)
        .from(
          adamRef.current,
          { x: -520, rotation: -22, autoAlpha: 0, duration: 1.1 },
          "-=0.35",
        )
        .from(
          zeusRef.current,
          { x: 520, rotation: 22, autoAlpha: 0, duration: 1.1 },
          "<",
        )
        .from(
          ayaRef.current,
          { yPercent: 100, autoAlpha: 0, duration: 1.1 },
          "<",
        );

      return () => {
        if (onMove) root.current?.removeEventListener("mousemove", onMove);
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="@container relative w-full aspect-1920/1080 overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 origin-top-left w-[1920px] h-270 overflow-hidden text-white"
        style={{ transform: "scale(calc(100cqw / 1920))" }}
      >
        <div
          ref={bgRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${background})` }}
        />
        <div className="absolute inset-0 bg-black/50" />

        <div
          ref={textRef}
          className="absolute z-10 w-169 h-62.5 text-center top-72.5 left-155.5"
        >
          {/* Title */}
          <h1 className="font-cormorant font-medium text-6xl tracking-[-0.01em]">
            <span className={capital}>M</span>y{" "}
            <span className={capital}>B</span>
            ini <span className={capital}>G</span>weh
          </h1>

          {/* Subtitle */}
          <h2 className="-mt-7.25 font-cormorant font-light text-[40px] italic">
            (in future I hope...)
          </h2>

          {/* Name */}
          <h2 className="mt-2.25 font-cormorant font-light text-2xl tracking-wide">
            Athaya Narani Listya Dewi
          </h2>
        </div>

        <img
          ref={ayaRef}
          src={ayaPaint}
          alt=""
          className="absolute z-30 -bottom-8.75 right-177.5 w-126.75"
        />

        {/* Tangan kiri — pivot bottom-left */}
        <div
          ref={adamRef}
          className="absolute z-20 bottom-[46.78px] -left-21.5 w-[591.07px]"
        >
          <img src={adamHand} alt="" className="w-full rotate-[-15.47deg]" />
        </div>

        {/* Tangan kanan — pivot top-right */}
        <div
          ref={zeusRef}
          className="absolute z-20 bottom-[99.33px] right-[-26.2px] w-[542.21px]"
        >
          <img src={zeusHand} alt="" className="w-full rotate-[5.08deg]" />
        </div>
      </div>
    </div>
  );
};
