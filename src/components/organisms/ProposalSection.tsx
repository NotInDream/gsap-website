import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import background from "../../assets/backgrounds/background-3.jpg";
import flowerRing from "../../assets/foregrounds/section-3/flower-and-ring-cropped.png";

gsap.registerPlugin(ScrollTrigger);

export const ProposalSection = () => {
  const root = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const dodges = useRef(0);
  const [accepted, setAccepted] = useState(false);

  // Reveal sinematik: jalan sekali saat section masuk viewport.
  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root.current, start: "top 60%", once: true },
      });

      tl.from(imgRef.current, {
        xPercent: -14,
        autoAlpha: 0,
        duration: 1.2,
        ease: "power2.out",
      }).from(
        textRef.current,
        { y: 48, autoAlpha: 0, duration: 0.9 },
        "-=0.65",
      );

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: root },
  );

  // Tombol "No" yang jahil: melompat ke posisi acak & mengecil tiap didekati.
  const dodge = () => {
    if (accepted) return;
    dodges.current += 1;
    gsap.to(noRef.current, {
      x: gsap.utils.random(-280, 240),
      y: gsap.utils.random(-150, 150),
      rotation: gsap.utils.random(-12, 12),
      scale: Math.max(0.45, 1 - dodges.current * 0.07),
      duration: 0.35,
      ease: "power2.out",
    });
  };

  // "Yes": kunci pilihan (motion perayaan dijalankan di useGSAP bawah).
  const accept = () => {
    if (accepted) return;
    setAccepted(true);
  };

  // Motion saat "Yes" dipilih: teks penutup meluncur masuk dari luar layar kanan
  // ke tempat semestinya (gambar dibiarkan diam).
  useGSAP(
    () => {
      if (!accepted) return;

      gsap.fromTo(
        textRef.current,
        { x: 1100, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 1, ease: "power3.out" },
      );
    },
    { dependencies: [accepted], scope: root },
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
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${background})` }}
        />
        {/* Gelapkan sisi kanan agar teks putih terbaca di atas taman terang. */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/75 via-black/35 to-black/10" />

        {/* Mawar, cincin & surat */}
        <img
          ref={imgRef}
          src={flowerRing}
          alt="A rose, a ring, and a letter"
          className="absolute z-10 left-24 top-1/2 -translate-y-1/2 w-[560px] rounded-2xl shadow-2xl shadow-black/60"
        />

        {/* Blok pertanyaan / pesan penutup */}
        <div
          ref={textRef}
          className="absolute z-20 right-30 top-1/2 -translate-y-1/2 w-[820px] text-right"
        >
          {!accepted ? (
            <>
              <p className="font-cormorant font-light text-[32px] italic opacity-80">
                One last question…
              </p>
              <h1 className="mt-2 font-cormorant font-normal text-[80px] italic leading-tight">
                Will you give us <br />a second chance?
              </h1>

              <div className="mt-12 flex items-center justify-end gap-8">
                <button
                  onClick={accept}
                  className="cursor-pointer rounded-full bg-white px-16 py-4 font-cormorant text-[34px] italic text-neutral-900 shadow-xl shadow-black/40 transition-transform hover:scale-105"
                >
                  Yes
                </button>
                <button
                  ref={noRef}
                  onMouseEnter={dodge}
                  onFocus={dodge}
                  onClick={dodge}
                  className="cursor-pointer rounded-full border border-white/70 px-16 py-4 font-cormorant text-[34px] italic text-white/90"
                >
                  No
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-cormorant font-normal text-[88px] italic leading-tight">
                I knew it.
              </h1>
              <p className="mt-4 font-cormorant font-light text-[40px] italic opacity-90">
                Season two — let’s make this one better.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
