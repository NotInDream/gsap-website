import { forwardRef, useImperativeHandle, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import background from "../../assets/backgrounds/background-2.jpg";
import polaroid1 from "../../assets/foregrounds/section-2/polaroid-1.jpeg";
import polaroid2 from "../../assets/foregrounds/section-2/polaroid-2.jpeg";
import polaroid3 from "../../assets/foregrounds/section-2/polaroid-3.jpeg";
import polaroid4 from "../../assets/foregrounds/section-2/polaroid-4.jpeg";
import {
  PolaroidDeck,
  type PolaroidDeckHandle,
} from "../molecules/PolaroidDeck";

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

export type ReasoningSectionHandle = {
  /** progress kontinu 0..(REASONING_STEPS-1); dipanggil master-timeline di App. */
  setProgress: (p: number) => void;
};

export const ReasoningSection = forwardRef<ReasoningSectionHandle>(
  (_props, ref) => {
    const root = useRef<HTMLDivElement>(null);
    const deckRef = useRef<PolaroidDeckHandle>(null);
    const subs = useRef<(HTMLHeadingElement | null)[]>([]);

    // Tiap subtitle terikat ke polaroid ke-i lewat `rel` yang SAMA dengan deck,
    // jadi siklus pergantian teks identik dengan siklus pergantian polaroid:
    // teks depan keluar ke kiri (mengikuti kartu), teks berikutnya datang dari kanan.
    const applyText = (p: number) => {
      subs.current.forEach((el, i) => {
        if (!el) return;
        const rel = i - p; // 0 = terdepan, <0 keluar kiri, >0 menunggu di kanan
        const dist = Math.abs(rel);
        gsap.set(el, {
          // Hanya yang terdepan yang terbaca; kurva tajam agar tak tumpang tindih.
          autoAlpha: gsap.utils.clamp(0, 1, (0.5 - dist) / 0.14),
          x: rel * 200, // searah kartu: keluar kiri (rel<0), datang dari kanan (rel>0)
        });
      });
    };

    // App yang mengendalikan progres (via pin + scrub di master-timeline).
    useImperativeHandle(
      ref,
      () => ({
        setProgress: (p) => {
          deckRef.current?.setProgress(p);
          applyText(p);
        },
      }),
      [],
    );

    // Posisi awal (sebelum di-scrub): hanya subtitle pertama yang tampil.
    useGSAP(() => applyText(0), { scope: root });

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
            {/* Title (statis) — left-0 sebagai patokan tepi kiri. */}
            <h1 className="absolute top-0 -left-4 font-cormorant font-normal text-[96px] italic">
              Why I love you? <span className="text-[48px]">(again)</span>
            </h1>

            {/* Subtitle: 4 teks bertumpuk. left-0 SAMA dengan title → sejajar. */}
            <div className="absolute left-4 top-32 w-full">
              {reasons.map((r, i) => (
                <h2
                  key={i}
                  ref={(el) => {
                    subs.current[i] = el;
                  }}
                  className="absolute top-0 left-0 w-full font-cormorant font-light text-[40px] italic"
                >
                  {r.headline}
                  <br />“{r.quote}”
                </h2>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
