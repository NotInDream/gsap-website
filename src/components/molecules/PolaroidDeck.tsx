import { forwardRef, useImperativeHandle, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Polaroid } from "./Polaroid";

type DeckItem = {
  src: string;
  name: string;
  alt?: string;
};

type PolaroidDeckProps = {
  items: DeckItem[];
  className?: string;
};

export type PolaroidDeckHandle = {
  /** progress kontinu 0..(items.length-1); pecahannya = transisi antar polaroid. */
  setProgress: (p: number) => void;
};

// Offset & rotasi per kedalaman tumpukan (0 = paling depan).
const depth = [
  { x: 0, y: 0, r: -3 },
  { x: 26, y: 20, r: 5 },
  { x: 50, y: 38, r: -7 },
  { x: 72, y: 54, r: 9 },
];

// Posisi kartu di dalam tumpukan untuk kedalaman pecahan (interpolasi linear).
const stackPos = (relative: number) => {
  const c = Math.min(Math.max(relative, 0), depth.length - 1);
  const i0 = Math.floor(c);
  const i1 = Math.min(i0 + 1, depth.length - 1);
  const f = c - i0;
  const a = depth[i0];
  const b = depth[i1];
  return {
    x: a.x + (b.x - a.x) * f,
    y: a.y + (b.y - a.y) * f,
    r: a.r + (b.r - a.r) * f,
  };
};

export const PolaroidDeck = forwardRef<PolaroidDeckHandle, PolaroidDeckProps>(
  ({ items, className = "" }, ref) => {
    const scope = useRef<HTMLDivElement>(null);
    const cards = useRef<(HTMLDivElement | null)[]>([]);

    const apply = (p: number) => {
      items.forEach((_, i) => {
        const el = cards.current[i];
        if (!el) return;

        const rel = i - p; // 0 = terdepan, negatif = sedang keluar kiri
        let x: number, y: number, rotate: number, alpha: number;

        if (rel >= 0) {
          const s = stackPos(rel);
          x = s.x;
          y = s.y;
          rotate = s.r;
          alpha = 1;
        } else {
          const t = Math.min(-rel, 1); // 0..1 progres keluar
          x = t * -1500;
          y = t * -40;
          rotate = -3 + t * -15;
          alpha = 1 - t;
        }

        gsap.set(el, { xPercent: -50, yPercent: -50, x, y, rotate, autoAlpha: alpha });
      });
    };

    useImperativeHandle(ref, () => ({ setProgress: apply }), [items]);

    // Posisi awal.
    useGSAP(() => apply(0), { scope });

    return (
      <div ref={scope} className={`relative h-[460px] w-[360px] ${className}`}>
        {items.map((item, i) => (
          <div
            key={i}
            ref={(el) => {
              cards.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2"
            style={{ zIndex: items.length - i }}
          >
            <Polaroid src={item.src} name={item.name} alt={item.alt} />
          </div>
        ))}
      </div>
    );
  }
);
