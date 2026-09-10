import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import background from "../../assets/backgrounds/background-2.jpg";
import polaroid1 from "../../assets/foregrounds/section-2/polaroid-1.jpeg";
import polaroid2 from "../../assets/foregrounds/section-2/polaroid-2.jpeg";
import polaroid3 from "../../assets/foregrounds/section-2/polaroid-3.jpeg";
import polaroid4 from "../../assets/foregrounds/section-2/polaroid-4.jpeg";
import { PolaroidDeck, type PolaroidDeckHandle } from "../molecules/PolaroidDeck";

gsap.registerPlugin(ScrollTrigger);

// Ganti nama caption tiap polaroid di sini.
const photos = [
  { src: polaroid1, name: "I can't" },
  { src: polaroid2, name: "Get" },
  { src: polaroid3, name: "Over" },
  { src: polaroid4, name: "You" },
];

const reasons = [
  {
    headline: "You’re still my favorite notification.",
    quote: "Even after all this time, your name still hits different.",
  },
  {
    headline: "Apparently, I have terrible taste.",
    quote: "Because somehow… I keep choosing you.",
  },
  {
    headline: "You make me laugh. Unfortunately.",
    quote: "And I hate that you’re still this funny.",
  },
  {
    headline: "Because maybe, we’re worth a sequel.",
    quote: "The first season was chaotic. Let’s make the second one better.",
  },
];

export const ReasoningSection = () => {
  const root = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<PolaroidDeckHandle>(null);
  const [active, setActive] = useState(0);

  // Scroll-driven: animasi diikat ke posisi scroll (scrub) → mulus mengikuti scroll.
  useGSAP(
    () => {
      const steps = reasons.length;
      const proxy = { p: 0 };
      let current = 0;

      gsap.to(proxy, {
        p: steps - 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: `+=${(steps - 1) * 700}`,
          pin: true,
          scrub: 1, // smoothing: proxy menyusul scroll ~1s
          snap: { snapTo: 1 / (steps - 1), duration: { min: 0.2, max: 0.5 } },
        },
        onUpdate: () => {
          deckRef.current?.setProgress(proxy.p);
          const idx = Math.round(proxy.p);
          if (idx !== current) {
            current = idx;
            setActive(idx);
          }
        },
      });
    },
    { scope: root },
  );

  // Swap teks tiap kali `active` berubah.
  useGSAP(
    () => {
      gsap.fromTo(
        textRef.current,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" },
      );
    },
    { dependencies: [active], scope: root },
  );

  const reason = reasons[active];

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
        <div className="absolute inset-0 bg-black/50" />

        <PolaroidDeck
          ref={deckRef}
          items={photos}
          className="absolute z-10 left-45 top-1/2 -translate-y-1/2"
        />

        <div className="absolute z-10 w-257 h-62.25 right-10 top-100">
          {/* Title (statis) */}
          <h1 className="font-cormorant font-normal text-[96px] italic">
            Why I love you? <span className="text-[48px]">(again)</span>
          </h1>

          {/* Subtitle (ganti tiap langkah scroll) */}
          <h2
            ref={textRef}
            className="font-cormorant font-light text-[40px] italic"
          >
            {reason.headline} <br />“{reason.quote}”
          </h2>
        </div>
      </div>
    </div>
  );
};
