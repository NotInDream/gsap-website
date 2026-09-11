import { forwardRef, type ReactNode } from "react";

type StageProps = {
  children: ReactNode;
  /** Kelas tambahan untuk kanvas 1920×1080 (mis. warna teks khusus). */
  className?: string;
};

/**
 * Panggung berukuran-tetap 1920×1080 untuk artwork posisi-tetap.
 *
 * Kanvas diskalakan agar MUAT (contain) pada kedua sumbu:
 * `min(100cqw/1920, 100cqh/1080)` → komposisi selalu utuh & terpusat di
 * resolusi/aspek rasio desktop mana pun; sisa ruang jadi margin hitam
 * (letterbox). Ini menggantikan pola lama yang hanya menyekala berdasarkan
 * lebar (`100cqw / 1920`) sehingga terpotong vertikal saat viewport bukan 16:9.
 *
 * `container-type: size` (bukan `inline-size`) dibutuhkan agar `cqh` tersedia —
 * valid karena elemen luar mengisi penuh induknya yang berukuran pasti.
 *
 * `ref` diteruskan ke elemen LUAR (viewport penuh) untuk dipakai sebagai scope
 * GSAP dan patokan `getBoundingClientRect()` (parallax kursor).
 */
export const Stage = forwardRef<HTMLDivElement, StageProps>(
  ({ children, className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black [container-type:size]"
      >
        <div
          className={`w-[1920px] h-[1080px] shrink-0 origin-center overflow-hidden text-white ${className}`}
          style={{ transform: "scale(min(100cqw / 1920, 100cqh / 1080))" }}
        >
          {children}
        </div>
      </div>
    );
  },
);
