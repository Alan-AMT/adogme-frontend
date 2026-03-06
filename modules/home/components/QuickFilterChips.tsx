// modules/home/components/QuickFilterChips.tsx
// Fila de filtros rápidos — separador entre hero y sección de perros
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
  { label: "Senior",    icon: "elderly",          href: "/perros?edadCategoria=senior"  },
  { label: "Pequeño",   icon: "close_fullscreen", href: "/perros?tamano=pequeño"        },
  { label: "Grande",    icon: "open_in_full",     href: "/perros?tamano=grande"         },
  { label: "Enérgico",  icon: "bolt",             href: "/perros?nivelEnergia=alta"     },
  { label: "Tranquilo", icon: "self_care",        href: "/perros?nivelEnergia=baja"     },
  { label: "Con niños", icon: "child_care",       href: "/perros?aptoNinos=true"        },
];

export default function QuickFilterChips() {
  return (
    <section className="border-y border-zinc-100 bg-white py-3">
      {/*
        overflow-x-auto aquí (no dentro del flex) para que el scroll
        funcione en mobile sin cortar el inicio del contenido.
        w-max + mx-auto centra en desktop cuando todo cabe.
      */}
      <div className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <div className="flex items-center gap-4 w-max mx-auto px-5 py-0.5">

          {/* Label — oculto en móvil para dar más espacio a los chips */}
          <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400 whitespace-nowrap shrink-0">
            Busca por:
          </span>

          {/* Chips */}
          <div className="flex gap-2">
            {CHIPS.map((chip) => (
              <Link
                key={chip.label}
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
          </div>

        </div>
      </div>
    </section>
  );
}
