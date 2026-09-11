import { forwardRef, useLayoutEffect, useRef, type ReactNode } from "react";

type StageProps = {
  children: ReactNode;
  /** Kelas tambahan untuk kanvas 1920×1080 (mis. warna teks khusus). */
  className?: string;
};

// Ukuran kanvas desain. Semua artwork diposisikan px pada basis ini.
const W = 1920;
const H = 1080;

/**
 * Panggung berukuran-tetap 1920×1080 untuk artwork posisi-tetap.
 *
 * Kanvas diskalakan dengan strategi COVER: `scale = max(vw/1920, vh/1080)` →
 * kanvas SELALU mengisi penuh viewport (tanpa bar hitam), dan kelebihan pada
 * satu sumbu sengaja "bleed" keluar layar. Ini penting karena beberapa aset
 * foreground (tangan, Aya) memang ditaruh menembus tepi untuk menyembunyikan
 * kesan "buntung" — jadi komposisi tak boleh diperkecil-muat (contain), tapi
 * dibiarkan terpotong di tepi seperti aslinya.
 *
 * Anchor: TOP-CENTER (kiri-kanan dipusatkan, tepi atas dikunci) → judul di area
 * atas selalu utuh; kelebihan tinggi "jatuh" ke bawah (bagian tangan/Aya yang
 * memang dirancang bleed). Pada layar 1920×1080 pas, scale = 1 → identik dengan
 * tampilan "rapih" di monitor.
 *
 * Skala dihitung di JS (bukan CSS), sebab `scale(calc(<length>/<number>))` tidak
 * valid — argumen `scale()` harus <number>, sehingga transform berbasis unit cq
 * diam-diam diabaikan browser (penyebab layout berantakan di resolusi ≠ 1920).
 *
 * `ref` diteruskan ke elemen LUAR (viewport penuh) untuk dipakai sebagai scope
 * GSAP dan patokan `getBoundingClientRect()` (parallax kursor).
 */
export const Stage = forwardRef<HTMLDivElement, StageProps>(
  ({ children, className = "" }, ref) => {
    const outer = useRef<HTMLDivElement | null>(null);
    const canvas = useRef<HTMLDivElement>(null);

    // Teruskan node luar ke ref milik parent SEKALIGUS simpan untuk pengukuran.
    const setOuter = (node: HTMLDivElement | null) => {
      outer.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    useLayoutEffect(() => {
      const box = outer.current;
      const cv = canvas.current;
      if (!box || !cv) return;

      const fit = () => {
        const w = box.clientWidth;
        const h = box.clientHeight;
        const scale = Math.max(w / W, h / H); // COVER
        const x = (w - W * scale) / 2; // pusatkan horizontal
        cv.style.transform = `translate(${x}px, 0px) scale(${scale})`;
      };

      fit();
      const ro = new ResizeObserver(fit);
      ro.observe(box);
      return () => ro.disconnect();
    }, []);

    return (
      <div
        ref={setOuter}
        className="relative h-full w-full overflow-hidden bg-black"
      >
        <div
          ref={canvas}
          style={{ transformOrigin: "0 0", transform: "scale(1)" }}
          className={`absolute left-0 top-0 w-[1920px] h-[1080px] overflow-hidden text-white ${className}`}
        >
          {children}
        </div>
      </div>
    );
  },
);
