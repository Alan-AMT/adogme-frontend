// modules/home/components/HeroSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useHomeDogs } from "../application/hooks/useHomeContent";
import styles from "../styles/hero.module.css";

// ─── SLIDE DURATION ───────────────────────────────────────────────────────────
const SLIDE_DURATION = 8000;

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

// ─── SLIDE 1 — BUSCADOR RÁPIDO + GRID DE PERROS ───────────────────────────────
const FILTER_OPTIONS = {
  size: ["Pequeño", "Mediano", "Grande"],
  energy: ["Tranquilo", "Moderado", "Activo"],
  age: ["Cachorro", "Joven", "Adulto"],
};

const SIZE_MAP: Record<string, string> = {
  Pequeño: "pequeño", Mediano: "mediano", Grande: "grande",
};
const ENERGY_MAP: Record<string, string[]> = {
  Tranquilo: ["baja"], Moderado: ["moderada"], Activo: ["alta", "muy_alta"],
};
const AGE_MAP: Record<string, string> = {
  Cachorro: "cachorro", Joven: "joven", Adulto: "adulto",
};

type DogLite = {
  id?: string;
  nombre: string;
  raza: string;
  edad: number;
  imageUrl: string;
  tamano: string;
  estado?: string;
  tamanoRaw?: string;
  nivelEnergiaRaw?: string;
  edadCat?: string;
};

// ─── MINI DOG CARD ─────────────────────────────────────────────────────────────

function MiniDogCard({
  dog,
  isTop,
  hasFilters,
  index,
}: {
  dog: DogLite;
  isTop: boolean;
  hasFilters: boolean;
  index: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const isFlipCard = isTop && hasFilters;

  // Reset flip when the top dog changes (different filter result)
  useEffect(() => {
    setFlipped(false);
  }, [dog.nombre]);

  // ── Flip card — solo aparece cuando hay filtros activos ──────────────────
  if (isFlipCard) {
    return (
      <div
        className={cx(
          styles["mini-card"],
          styles["mini-card--flip"],
          flipped && styles["is-flipped"]
        )}
        style={{ animationDelay: `${index * 60}ms` }}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setFlipped((f) => !f);
        }}
        aria-label={`Ver por qué ${dog.nombre} es tu mejor opción`}
      >
        <div className={styles["mini-card__inner"]}>
          {/* Frente */}
          <div className={styles["mini-card__front"]}>
            <div className={styles["mini-card__badge"]}>🐾 Tu mejor opción</div>
            <div className={styles["mini-card__photo"]}>
              <Image
                src={dog.imageUrl}
                alt={dog.nombre}
                fill
                className={styles["mini-card__img"]}
                sizes="180px"
              />
            </div>
            <div className={styles["mini-card__info"]}>
              <div className={styles["mini-card__name"]}>{dog.nombre}</div>
              <div className={styles["mini-card__meta"]}>
                {dog.raza} · {dog.edad}a
              </div>
              <span className={styles["mini-card__size-chip"]}>{dog.tamano}</span>
            </div>
            <div className={styles["mini-card__hint"]}>Toca para saber más →</div>
          </div>

          {/* Reverso */}
          <div className={styles["mini-card__back"]}>
            <div className={styles["mini-card__back-content"]}>
              <div className={styles["mini-card__back-icon"]}>🐾</div>
              <h4 className={styles["mini-card__back-title"]}>
                ¿Por qué {dog.nombre}?
              </h4>
              <ul className={styles["mini-card__back-list"]}>
                <li>✓ Nivel de energía compatible</li>
                <li>✓ Tamaño ideal para tu hogar</li>
                <li>✓ Carácter amigable y sociable</li>
              </ul>
              <Link
                href={dog.nombre ? `/perros/${dog.nombre.toLowerCase().replace(/\s+/g, '-')}` : "/perros"}
                className={styles["mini-card__back-cta"]}
                onClick={(e) => e.stopPropagation()}
              >
                Ver perfil completo
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Card normal — sin badge ──────────────────────────────────────────────
  return (
    <Link
      href={dog.nombre ? `/perros/${dog.nombre.toLowerCase().replace(/\s+/g, '-')}` : "/perros"}
      className={styles["mini-card"]}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={styles["mini-card__photo"]}>
        <Image
          src={dog.imageUrl}
          alt={dog.nombre}
          fill
          className={styles["mini-card__img"]}
          sizes="180px"
        />
      </div>
      <div className={styles["mini-card__info"]}>
        <div className={styles["mini-card__name"]}>{dog.nombre}</div>
        <div className={styles["mini-card__meta"]}>
          {dog.raza} · {dog.edad}a
        </div>
        <span className={styles["mini-card__size-chip"]}>{dog.tamano}</span>
      </div>
    </Link>
  );
}

function MiniCardSkeleton({ index }: { index: number }) {
  return (
    <div
      className={cx(styles["mini-card"], styles["mini-card--skeleton"])}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={styles["mini-card__shimmer"]} />
    </div>
  );
}

function DogGridEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className={styles["dog-grid-empty"]}>
      <div className={styles["dog-grid-empty__icon"]}>🐾</div>
      <p className={styles["dog-grid-empty__text"]}>
        Sin perros con esos filtros
      </p>
      <button
        type="button"
        className={styles["dog-grid-empty__btn"]}
        onClick={onClear}
      >
        Limpiar filtros
      </button>
    </div>
  );
}

// ─── SLIDE 1 ───────────────────────────────────────────────────────────────────

function Slide1({ allDogs, loading }: { allDogs: DogLite[]; loading: boolean }) {
  const router = useRouter();
  const [filters, setFilters] = useState({ size: "", energy: "", age: "" });
  const hasFilters = !!(filters.size || filters.energy || filters.age);

  const filteredDogs = useMemo(() => {
    let result = allDogs;
    if (filters.size) {
      const raw = SIZE_MAP[filters.size];
      result = result.filter(d => (d.tamanoRaw ?? d.tamano.toLowerCase()) === raw);
    }
    if (filters.energy) {
      const raws = ENERGY_MAP[filters.energy] ?? [];
      result = result.filter(d => raws.includes(d.nivelEnergiaRaw ?? ""));
    }
    if (filters.age) {
      const raw = AGE_MAP[filters.age];
      result = result.filter(d => d.edadCat === raw);
    }
    return result.slice(0, 4);
  }, [allDogs, filters]);

  function clearFilters() {
    setFilters({ size: "", energy: "", age: "" });
  }

  function handleSearch() {
    const params = new URLSearchParams();
    if (filters.size) params.set("size", filters.size);
    if (filters.energy) params.set("energy", filters.energy);
    if (filters.age) params.set("age", filters.age);
    router.push(`/perros?${params.toString()}`);
  }

  return (
    <div className={styles["hero-card"]}>
      {/* Copy */}
      <div className={styles["hero-copy"]}>
        <div className={styles["hero-eyebrow"]}>
          <span className={styles["hero-eyebrow__dot"]} />
          Adopción canina · Gustavo A. Madero
        </div>

        <h1 className={styles["hero-title"]}>
          Encuentra a tu
          <br />
          <em className={styles["hero-title__em"]}>compañero</em> ideal
        </h1>

        <p className={styles["hero-desc"]}>
          Adopta un perro y cambia dos vidas. Filtra por lo que necesitas y
          encuentra tu match perfecto.
        </p>

        {/* Chips de filtro */}
        <div className={styles["hero-filters"]}>
          {(["size", "energy", "age"] as const).map((key) => {
            const labels: Record<string, string> = {
              size: "Tamaño",
              energy: "Energía",
              age: "Edad",
            };
            return (
              <div key={key} className={styles["hero-filter"]}>
                <label className={styles["hero-filter__label"]}>
                  {labels[key]}
                </label>
                <div className={styles["hero-filter__chips"]}>
                  {FILTER_OPTIONS[key].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={cx(
                        styles["hero-chip"],
                        filters[key] === opt && styles["is-active"]
                      )}
                      onClick={() =>
                        setFilters((f) => ({
                          ...f,
                          [key]: f[key] === opt ? "" : opt,
                        }))
                      }
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles["hero-ctas"]}>
          <button
            type="button"
            className={cx(styles["hero-btn"], styles["hero-btn--primary"])}
            onClick={handleSearch}
          >
            <span>Buscar mi perro</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>

          <Link
            href="/#proceso"
            className={cx(styles["hero-btn"], styles["hero-btn--ghost"])}
          >
            Cómo funciona
          </Link>
        </div>
      </div>

      {/* Dog Grid */}
      <div className={cx(styles["hero-media"], styles["hero-media--grid"])}>
        {loading ? (
          <div className={styles["dog-grid"]}>
            {[0, 1, 2, 3].map((i) => (
              <MiniCardSkeleton key={i} index={i} />
            ))}
          </div>
        ) : filteredDogs.length === 0 ? (
          <div className={styles["dog-grid"]}>
            <DogGridEmptyState onClear={clearFilters} />
          </div>
        ) : (
          <div
            className={styles["dog-grid"]}
            key={filteredDogs.map((d) => d.nombre).join(",")}
          >
            {filteredDogs.map((dog, i) => (
              <MiniDogCard
                key={dog.id ?? i}
                dog={dog}
                isTop={i === 0}
                hasFilters={hasFilters}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SLIDE 2 — POLAROID STACK CON PARALLAX ────────────────────────────────────

function PolaroidStack({ dogs, loading }: { dogs: DogLite[]; loading: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    }
    function onLeave() {
      setMouse({ x: 0, y: 0 });
    }
    const el = ref.current;
    el?.addEventListener("mousemove", onMove);
    el?.addEventListener("mouseleave", onLeave);
    return () => {
      el?.removeEventListener("mousemove", onMove);
      el?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const layers = [
    {
      depth: 0.08,
      rotate: "-8deg",
      scale: 0.82,
      blur: 3,
      z: 0,
      offsetX: "-60px",
      offsetY: "30px",
    },
    {
      depth: 0.05,
      rotate: "5deg",
      scale: 0.9,
      blur: 1,
      z: 1,
      offsetX: "50px",
      offsetY: "-20px",
    },
    { depth: 0, rotate: "-1deg", scale: 1, blur: 0, z: 2, offsetX: "0px", offsetY: "0px" },
  ];

  const STATUS_COLORS: Record<string, string> = {
    Disponible: "#10b981",
    "En adopción": "#f59e0b",
    "En tratamiento": "#3b82f6",
    Adoptado: "#9ca3af",
  };

  return (
    <div className={styles["polaroid-stack"]} ref={ref}>
      {loading
        ? layers.map((l, i) => (
            <div
              key={i}
              className={cx(styles["polaroid"], styles["polaroid--skeleton"])}
              style={
                {
                  ["--rotate" as any]: l.rotate,
                  ["--scale" as any]: l.scale,
                  ["--blur" as any]: `${l.blur}px`,
                  ["--z" as any]: l.z,
                  ["--ox" as any]: l.offsetX,
                  ["--oy" as any]: l.offsetY,
                } as any
              }
            />
          ))
        : layers.map((l, i) => {
            const dog = dogs[i % Math.max(dogs.length, 1)];
            if (!dog) return null;

            const tx = mouse.x * 18 * l.depth;
            const ty = mouse.y * 14 * l.depth;

            return (
              <div
                key={i}
                className={styles["polaroid"]}
                style={
                  {
                    transform: `translate(calc(${l.offsetX} + ${tx}px), calc(${l.offsetY} + ${ty}px)) rotate(${l.rotate}) scale(${l.scale})`,
                    filter: l.blur ? `blur(${l.blur}px)` : "none",
                    zIndex: l.z + 1,
                    ["--rotate" as any]: l.rotate,
                    ["--scale" as any]: l.scale,
                    ["--blur" as any]: `${l.blur}px`,
                    ["--z" as any]: l.z,
                    ["--ox" as any]: l.offsetX,
                    ["--oy" as any]: l.offsetY,
                  } as any
                }
              >
                <div className={styles["polaroid__photo"]}>
                  <Image
                    src={dog.imageUrl}
                    alt={dog.nombre}
                    fill
                    className={styles["polaroid__img"]}
                    sizes="260px"
                  />
                </div>

                <div className={styles["polaroid__caption"]}>
                  <span className={styles["polaroid__name"]}>{dog.nombre}</span>
                  <span className={styles["polaroid__breed"]}>{dog.raza}</span>
                  <span
                    className={styles["polaroid__status"]}
                    style={{ background: STATUS_COLORS[dog.estado ?? ""] ?? "#9ca3af" }}
                  >
                    {dog.estado ?? "Disponible"}
                  </span>
                </div>
              </div>
            );
          })}
    </div>
  );
}

function Slide2({ dogs, loading }: { dogs: DogLite[]; loading: boolean }) {
  return (
    <div className={styles["hero-card"]}>
      <div className={styles["hero-copy"]}>
        <div className={styles["hero-eyebrow"]}>
          <span className={styles["hero-eyebrow__dot"]} />
          Conoce a nuestros perritos
        </div>

        <h1 className={styles["hero-title"]}>
          Dale hogar a un
          <br />
          <em className={styles["hero-title__em"]}>nuevo amigo</em>
        </h1>

        <p className={styles["hero-desc"]}>
          Cada perro tiene su historia y espera encontrar una familia como la tuya.
        </p>

        <div className={styles["hero-ctas"]}>
          <Link
            href="/perros"
            className={cx(styles["hero-btn"], styles["hero-btn--primary"])}
          >
            <span>Ver catálogo</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            href="/refugios"
            className={cx(styles["hero-btn"], styles["hero-btn--ghost"])}
          >
            Refugios aliados
          </Link>
        </div>
      </div>

      <div className={cx(styles["hero-media"], styles["hero-media--stack"])}>
        <PolaroidStack dogs={dogs} loading={loading} />
      </div>
    </div>
  );
}

// ─── SLIDE 3 — PROCESO DE ADOPCIÓN ────────────────────────────────────────────

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Explora los perfiles",
    desc: "Filtra por tamaño, energía y edad. Guarda favoritos y encuentra tu match ideal.",
    img: "/assets/hero/explorar.jpg",
  },
  {
    num: "02",
    title: "Responde la encuesta",
    desc: "Cuéntanos tu hogar y estilo de vida para recibir recomendaciones personalizadas.",
    img: "/assets/hero/encuesta.jpg",
  },
  {
    num: "03",
    title: "¡Adopta y llévalo a casa!",
    desc: "Envía tu solicitud y el refugio te acompañará en cada paso hasta la entrega.",
    img: "/assets/hero/adopta.webp",
  },
];

function Slide3({ active }: { active: boolean }) {
  return (
    <div className={styles["hero-card"]}>
      <div className={styles["hero-copy"]}>
        <div className={styles["hero-eyebrow"]}>
          <span className={styles["hero-eyebrow__dot"]} />
          Proceso de adopción
        </div>

        <h1 className={styles["hero-title"]}>
          Proceso simple,
          <br />
          <em className={styles["hero-title__em"]}>adopción segura</em>
        </h1>

        <p className={styles["hero-desc"]}>
          En 3 pasos te acompañamos desde conocer a tu perro hasta llevarlo a casa.
        </p>

        <div className={styles["hero-ctas"]}>
          <Link
            href="/proceso-adopcion"
            className={cx(styles["hero-btn"], styles["hero-btn--primary"])}
          >
            <span>Ver proceso completo</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            href="/perros"
            className={cx(styles["hero-btn"], styles["hero-btn--ghost"])}
          >
            Explorar perros
          </Link>
        </div>
      </div>

      {/* Step cards — panel derecho */}
      <div className={cx(styles["hero-media"], styles["hero-media--steps"])}>
        <div className={styles["step-cards"]}>
          {PROCESS_STEPS.map((step, i) => (
            <div
              key={step.num}
              className={styles["step-card"]}
              style={{ animationDelay: active ? `${i * 140}ms` : "0ms" }}
            >
              <div className={styles["step-card__img-wrap"]}>
                <Image
                  src={step.img}
                  alt={step.title}
                  fill
                  className={styles["step-card__img"]}
                  sizes="340px"
                />
                <span className={styles["step-card__badge"]}>{step.num}</span>
              </div>
              <div className={styles["step-card__body"]}>
                <div className={styles["step-card__title"]}>{step.title}</div>
                <p className={styles["step-card__desc"]}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── INDICADORES CON PROGRESS BAR ─────────────────────────────────────────────

function SlideIndicator({
  idx,
  active,
  onClick,
  progress,
}: {
  idx: number;
  active: boolean;
  onClick: () => void;
  progress: number;
}) {
  return (
    <button
      type="button"
      className={cx(styles["hero-indicator"], active && styles["is-active"])}
      onClick={onClick}
      aria-label={`Slide ${idx + 1}`}
    >
      <svg
        className={styles["hero-indicator__bone"]}
        viewBox="0 0 64 28"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="16" y="11" width="32" height="6" rx="3" fill="currentColor" />
        <circle cx="13" cy="10" r="6" fill="currentColor" />
        <circle cx="13" cy="18" r="6" fill="currentColor" />
        <circle cx="51" cy="10" r="6" fill="currentColor" />
        <circle cx="51" cy="18" r="6" fill="currentColor" />
      </svg>

      {active && (
        <div className={styles["hero-indicator__progress"]}>
          <div
            className={styles["hero-indicator__progress-fill"]}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </button>
  );
}

// ─── HERO PRINCIPAL ───────────────────────────────────────────────────────────

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { dogs: allDogs, loading } = useHomeDogs();
  // Slide 2 (polaroids) uses first 3; Slide 1 uses all for filtering
  const polaroidDogs: DogLite[] = (allDogs ?? []).slice(0, 3);

  useEffect(() => {
    setProgress(0);

    let elapsed = 0;
    const tick = 80;

    if (progressRef.current) clearInterval(progressRef.current);
    if (slideRef.current) clearTimeout(slideRef.current);

    progressRef.current = setInterval(() => {
      elapsed += tick;
      setProgress(Math.min((elapsed / SLIDE_DURATION) * 100, 100));
    }, tick);

    slideRef.current = setTimeout(() => {
      goTo((active + 1) % 3);
    }, SLIDE_DURATION);

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
      if (slideRef.current) clearTimeout(slideRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  function goTo(idx: number) {
    if (idx === active || transitioning) return;

    if (progressRef.current) clearInterval(progressRef.current);
    if (slideRef.current) clearTimeout(slideRef.current);

    setTransitioning(true);
    setTimeout(() => {
      setActive(idx);
      setTransitioning(false);
    }, 280);
  }

  return (
    <section className={styles["hero-section"]}>
      {/* Fondo: texture */}
      <div className={styles["hero-bg-texture"]} aria-hidden="true" />
      {/* Fondo: SVG shapes */}
      <div className={styles["hero-bg-svg"]} aria-hidden="true" />
      {/* Wave */}
      <div className={styles["hero-wave"]} aria-hidden="true" />

      <div className={styles["hero-container"]}>
        <div className={styles["hero-carousel"]}>
          {/* Track con fade+slide */}
          <div
            className={cx(
              styles["hero-track-wrapper"],
              transitioning ? styles["is-exiting"] : styles["is-entering"]
            )}
          >
            {active === 0 && <Slide2 dogs={polaroidDogs} loading={loading} />}
            {active === 1 && <Slide1 allDogs={allDogs ?? []} loading={loading} />}
            {active === 2 && <Slide3 active={active === 2} />}
          </div>

          {/* Indicadores */}
          <div className={styles["hero-indicators"]}>
            {[0, 1, 2].map((i) => (
              <SlideIndicator
                key={i}
                idx={i}
                active={active === i}
                onClick={() => goTo(i)}
                progress={active === i ? progress : 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
