// modules/home/components/QuickFilterChips.tsx
// Fila de filtros rápidos — marquee infinito entre hero y sección de perros
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

// 4 copias con spacer entre cada una.
// La animación mueve -25% (= 1 copia), garantizando cobertura total del viewport.
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
      {/* spacer entre tandas */}
      <span className="inline-block w-20 shrink-0" aria-hidden="true" />
    </>
  );
}

export default function QuickFilterChips() {
  return (
    <section className="border-y border-zinc-100 bg-white py-3">
      <div className="chips-track-wrapper">
        <div className="chips-track">
          <ChipSet offset={0} />
          <ChipSet offset={100} />
          <ChipSet offset={200} />
          <ChipSet offset={300} />
        </div>
      </div>
    </section>
  );
}
