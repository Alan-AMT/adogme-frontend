"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { DogCard } from "../domain/DogCard";
import { MockHomedogsListRepository } from "../infrastructure/MockDogsList";

function DogStampCard({ dog }: { dog: DogCard }) {
  return (
    <article className="stamp-card" aria-label={`Perro ${dog.nombre}`}>
      <div className="stamp-card__inner">
        <div className="stamp-card__frame">
          <div className="stamp-card__photo">
            <Image
              src={dog.imageUrl}
              alt={dog.nombre}
              fill
              className="stamp-card__photoImg"
              sizes="(max-width: 768px) 160px, 280px"
              priority
            />
          </div>

          <Image
            src="/assets/hero/marcoe.png"
            alt=""
            fill
            className="stamp-card__frameImg"
            sizes="(max-width: 768px) 160px, 280px"
          />
        </div>

        {/* Solo visible en Desktop */}
        <div className="stamp-card__info hidden lg:block">
          <h3 className="stamp-card__name">{dog.nombre}</h3>
          <p className="stamp-card__meta">
            {dog.edad} año{dog.edad === 1 ? "" : "s"} • {dog.tamano}
          </p>
          <Link href="/perros" className="stamp-card__link">
            Ver perfil
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function HeroCarousel() {
  const slides = useMemo(
    () => [
      {
        title: (
          <>
            Encuentra a tu <br className="hidden md:block" /> compañero ideal
          </>
        ),
        desc: (
          <>
            Adopta un perro en <span className="font-bold">Gustavo A. Madero</span> y cambia una
            vida.
          </>
        ),
        img: "/assets/hero/hero1.png",
        ctaHref: "/perros",
        ctaText: "Explorar perros",
        tipo: "img" as const,
      },
      {
        title: (
          <>
            Dale hogar a un <br className="hidden md:block" /> nuevo amigo
          </>
        ),
        desc: <>Filtra por tamaño y edad para encontrar el match perfecto.</>,
        img: null,
        ctaHref: "/perros",
        ctaText: "Ver catálogo",
        tipo: "marcos" as const,
      },
      {
        title: (
          <>
            Proceso simple, <br className="hidden md:block" /> adopción segura
          </>
        ),
        desc: <>Conoce el proceso paso a paso con acompañamiento de refugios.</>,
        img: null,
        ctaHref: "/#proceso",
        ctaText: "Ver proceso",
        tipo: "pasos" as const,
      },
    ],
    []
  );

  const [active, setActive] = useState(0);
  const [heroDogs, setHeroDogs] = useState<DogCard[]>([]);
  const [loadingDogs, setLoadingDogs] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % slides.length), 8000);
    return () => clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    (async () => {
      try {
        const repo = new MockHomedogsListRepository();
        const dogs = await repo.getMainDogs();
        setHeroDogs(dogs.slice(0, 2));
      } finally {
        setLoadingDogs(false);
      }
    })();
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-wave" aria-hidden="true" />

      <div className="hero-container">
        <div className="hero-carousel">
          <div className="hero-track" style={{ transform: `translateX(-${active * 100}%)` }}>
            {slides.map((s, idx) => (
              <div key={idx} className="hero-slide">
                <div className="hero-card">
                  <div className="hero-copy">
                    <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl">{s.title}</h1>
                    <p className="hero-desc text-slate-800 text-lg mt-6 font-medium">{s.desc}</p>

                    <div className="hero-ctas">
                      <Link href={s.ctaHref} className="w-full sm:w-auto">
                        <button className="hero-btn hero-btn--primary">{s.ctaText}</button>
                      </Link>
                      <button className="hero-btn hero-btn--ghost">Cómo funciona</button>
                    </div>
                  </div>

                  <div className="hero-media">
                    {s.tipo === "marcos" ? (
                      <div className="hero-dog-stamps">
                        {loadingDogs ? (
                          <div className="stamp-skeleton" />
                        ) : (
                          heroDogs.map((dog) => <DogStampCard key={dog.id} dog={dog} />)
                        )}
                      </div>
                    ) : s.tipo === "pasos" ? (
                      <div className="hero-steps">
                        <div className="hero-step hero-step--left">
                          <div className="hero-step__content">
                            <span className="hero-step__num">1</span>
                            <div className="hero-step__body">
                              <p className="hero-step__title">Explora</p>
                              <p className="hero-step__desc">
                                Descubre perros en refugios de Gustavo A. Madero
                              </p>
                            </div>
                          </div>
                          <div className="hero-step__img">
                            <img src="/assets/hero/explorar.jpg" alt="Explorar perros" />
                          </div>
                        </div>

                        <div className="hero-step hero-step--right">
                          <div className="hero-step__content">
                            <span className="hero-step__num">2</span>
                            <div className="hero-step__body">
                              <p className="hero-step__title">Encuesta</p>
                              <p className="hero-step__desc">Rellena el formulario de estilo de vida</p>
                            </div>
                          </div>
                          <div className="hero-step__img">
                            <img src="/assets/hero/encuesta.jpg" alt="Encuesta de adopción" />
                          </div>
                        </div>

                        <div className="hero-step hero-step--left">
                          <div className="hero-step__content">
                            <span className="hero-step__num">3</span>
                            <div className="hero-step__body">
                              <p className="hero-step__title">Adopta</p>
                              <p className="hero-step__desc">Lleva a tu nuevo amigo a casa</p>
                            </div>
                          </div>
                          <div className="hero-step__img">
                            <img src="/assets/hero/adopta.webp" alt="Adoptar un perro" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="hero-media__img">
                        <Image
                          src={s.img!}
                          alt=""
                          fill
                          className="object-contain object-bottom"
                          priority={idx === 0}
                          sizes="(max-width: 768px) 260px, 440px"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hero-indicators">
            {slides.map((_, idx) => (
              <button
                key={idx}
                className={`hero-indicator ${active === idx ? "is-active" : ""}`}
                onClick={() => setActive(idx)}
                aria-label={`Ir al slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
