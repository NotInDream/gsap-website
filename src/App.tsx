import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ProposalSection,
  type ProposalSectionHandle,
} from "./components/organisms/ProposalSection";
import {
  ReasoningSection,
  type ReasoningSectionHandle,
} from "./components/organisms/ReasoningSection";
import { TitleSection } from "./components/organisms/TitleSection";

gsap.registerPlugin(ScrollTrigger);

// 1 "beat" = jarak scroll (px) untuk satu ketukan animasi.
const BEAT = 700;
// Susunan beat sepanjang pengalaman (total dipakai untuk panjang pin).
const COVER = 1; // durasi satu section menutupi section sebelumnya
const HOLD_MID = 0.3; // jeda kecil setelah tiap transisi
const REASONING_STEPS = 4; // jumlah polaroid/alasan di ReasoningSection
const STEPS = REASONING_STEPS - 1; // jumlah pergantian polaroid (3)
const TOTAL_BEATS = COVER + HOLD_MID + STEPS + HOLD_MID + COVER;

// Seberapa jauh section lama "jatuh ke belakang".
const RECEDE_SCALE = 0.9;
const RECEDE_SHADE = 0.5;

function App() {
  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);

  const titleScene = useRef<HTMLDivElement>(null);
  const titleShade = useRef<HTMLDivElement>(null);
  const reasoningWrap = useRef<HTMLDivElement>(null);
  const reasoningScene = useRef<HTMLDivElement>(null);
  const reasoningShade = useRef<HTMLDivElement>(null);
  const proposalWrap = useRef<HTMLDivElement>(null);

  const reasoningApi = useRef<ReasoningSectionHandle>(null);
  const proposalApi = useRef<ProposalSectionHandle>(null);

  useGSAP(
    () => {
      // Section berikutnya menunggu di bawah layar.
      gsap.set([reasoningWrap.current, proposalWrap.current], {
        yPercent: 100,
      });

      const proxy = { p: 0 };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: viewport.current,
          start: "top top",
          end: `+=${TOTAL_BEATS * BEAT}`,
          pin: viewport.current,
          scrub: 0.4, // scroll 1:1 terasa nempel
          // Snap-to polos: saat scroll berhenti di area Reasoning, tersedot ke
          // polaroid terdekat. Arah scroll dibiarkan natural (tanpa manipulasi).
          snap: {
            snapTo: (value) => {
              const firstPhoto = COVER + HOLD_MID; // beat polaroid pertama
              const regionStart = COVER; // setelah Title tertutup
              const regionEnd = firstPhoto + STEPS + HOLD_MID; // sebelum Proposal naik
              const beat = value * TOTAL_BEATS;
              if (beat < regionStart || beat > regionEnd) return value;
              const k = gsap.utils.clamp(0, STEPS, Math.round(beat - firstPhoto));
              return (firstPhoto + k) / TOTAL_BEATS;
            },
            duration: { min: 0.2, max: 0.5 },
            ease: "power1.inOut",
          },
        },
      });

      tl
        // Reasoning naik menutupi Title; Title jatuh ke belakang.
        .to(reasoningWrap.current, { yPercent: 0, duration: COVER })
        .to(titleScene.current, { scale: RECEDE_SCALE, duration: COVER }, "<")
        .to(titleShade.current, { opacity: RECEDE_SHADE, duration: COVER }, "<")
        .to({}, { duration: HOLD_MID })
        // 4 polaroid berganti mengikuti scroll.
        .to(proxy, {
          p: STEPS,
          duration: STEPS,
          onUpdate: () => reasoningApi.current?.setProgress(proxy.p),
        })
        .to({}, { duration: HOLD_MID })
        // Proposal naik menutupi Reasoning; Reasoning jatuh ke belakang.
        .addLabel("proposal")
        .to(proposalWrap.current, { yPercent: 0, duration: COVER }, "proposal")
        .to(
          reasoningScene.current,
          { scale: RECEDE_SCALE, duration: COVER },
          "proposal",
        )
        .to(
          reasoningShade.current,
          { opacity: RECEDE_SHADE, duration: COVER },
          "proposal",
        );

      // Isi Proposal (mawar+cincin & teks) muncul BARENGAN saat panel naik.
      const targets = proposalApi.current?.revealTargets();
      // Foto meluncur masuk dari luar layar KIRI ke posisinya (scrub).
      // yPercent: -50 menjaga centering vertikal (menggantikan -translate-y-1/2
      // yang bisa hilang bila tinggi gambar belum ter-load saat GSAP mengukurnya).
      if (targets?.img) {
        tl.fromTo(
          targets.img,
          { xPercent: -170, yPercent: -50, autoAlpha: 0 },
          {
            xPercent: 0,
            yPercent: -50,
            autoAlpha: 1,
            duration: COVER,
            ease: "power8.out",
          },
          "proposal",
        );
      }
      // Teks meluncur masuk dari luar layar KANAN ke posisinya (scrub).
      if (targets?.text) {
        tl.fromTo(
          targets.text,
          { xPercent: 180, yPercent: -50, autoAlpha: 0 },
          {
            xPercent: 0,
            yPercent: -50,
            autoAlpha: 1,
            duration: COVER,
            ease: "power8.out",
          },
          "proposal",
        );
      }
    },
    { scope: root },
  );

  return (
    <main ref={root} className="relative w-full">
      <div
        ref={viewport}
        className="relative h-screen w-full overflow-hidden bg-black"
      >
        {/* Kartu 1 — Title */}
        <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
          <div ref={titleScene} className="w-full">
            <TitleSection />
          </div>
          <div
            ref={titleShade}
            className="pointer-events-none absolute inset-0 bg-black opacity-0"
          />
        </div>

        {/* Kartu 2 — Reasoning */}
        <div
          ref={reasoningWrap}
          className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
        >
          <div ref={reasoningScene} className="w-full">
            <ReasoningSection ref={reasoningApi} />
          </div>
          <div
            ref={reasoningShade}
            className="pointer-events-none absolute inset-0 bg-black opacity-0"
          />
        </div>

        {/* Kartu 3 — Proposal */}
        <div
          ref={proposalWrap}
          className="absolute inset-0 z-30 flex items-center justify-center overflow-hidden"
        >
          <div className="w-full">
            <ProposalSection ref={proposalApi} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
