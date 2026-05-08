"use client";
import { useRef, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/modules/shared/components/ui/Icon";

type Chip = {
  label: string;
  icon: string;
  href: string;
};

const CHIPS: Chip[] = [
  { label: "Cachorro",  icon: "cruelty_free",     href: "/perros?edadCategoria=cachorro" },
  { label: "Joven",     icon: "directions_run",   href: "/perros?edadCategoria=joven"   },
  { label: "Adulto",    icon: "pets",             href: "/perros?edadCategoria=adulto"  },
  { label: "Pequeño",   icon: "close_fullscreen", href: "/perros?tamano=pequeño"        },
  { label: "Grande",    icon: "open_in_full",     href: "/perros?tamano=grande"         },
  { label: "Enérgico",  icon: "bolt",             href: "/perros?nivelEnergia=alta"     },
  { label: "Tranquilo", icon: "self_care",        href: "/perros?nivelEnergia=baja"     },
  { label: "Con niños", icon: "child_care",       href: "/perros?aptoNinos=true"        },
];

function ChipSet({ offset }: { offset: number }) {
  return (
    <>
      {CHIPS.map((chip, i) => (
        <Link
          key={offset + i}
          href={chip.href}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                     border border-zinc-200 bg-white
                     hover:border-[#C92A2A] hover:bg-[#FFF1F1] hover:-translate-y-px
                     transition-all duration-150
                     text-xs font-semibold text-zinc-700 hover:text-[#C92A2A]
                     whitespace-nowrap no-underline"
        >
          <Icon name={chip.icon} size={14} color="#C92A2A" />
          {chip.label}
        </Link>
      ))}
      <span className="inline-block w-20 shrink-0" aria-hidden="true" />
    </>
  );
}

const DURATION_MS = 34000;

export default function QuickFilterChips() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let x = 0;
    let lastTime: number | null = null;
    let paused = false;
    let rafId: number;

    const tick = (now: number) => {
      if (!paused) {
        if (lastTime !== null) {
          const oneSet = track.scrollWidth / 4;
          x -= (oneSet / DURATION_MS) * (now - lastTime);
          if (x <= -oneSet) x += oneSet;
          track.style.transform = `translate3d(${x}px, 0, 0)`;
        }
        lastTime = now;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    const pause  = () => { paused = true; };
    const resume = () => { paused = false; lastTime = null; };

    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(rafId);
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", resume);
    };
  }, []);

  return (
    <section className="border-y border-zinc-100 bg-white py-3">
      <div className="chips-track-wrapper">
        <div className="chips-track" ref={trackRef}>
          <ChipSet offset={0} />
          <ChipSet offset={100} />
          <ChipSet offset={200} />
          <ChipSet offset={300} />
        </div>
      </div>
    </section>
  );
}
