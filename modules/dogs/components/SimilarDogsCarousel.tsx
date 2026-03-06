"use client";

// modules/dogs/components/SimilarDogsCarousel.tsx
import Image from "next/image";
import Link from "next/link";
import type { DogListItem } from "../../shared/domain/Dog";

function edadLabel(meses: number) {
  if (meses < 12) return `${meses}m`;
  return `${Math.floor(meses / 12)}a`;
}

export default function SimilarDogsCarousel({
  dogs,
  title = "Perros similares",
}: {
  dogs: DogListItem[];
  title?: string;
}) {
  if (dogs.length === 0) return null;

  return (
    <section style={{ padding: "2rem 0" }}>
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 900,
          color: "#18181b",
          marginBottom: "1rem",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
          paddingBottom: "0.75rem",
          scrollbarWidth: "none",
        }}
      >
        {dogs.map((dog) => (
          <Link
            key={dog.id}
            href={`/perros/${dog.id}`}
            style={{
              flexShrink: 0,
              width: 160,
              borderRadius: "1rem",
              border: "1.5px solid #f0f0f0",
              overflow: "hidden",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              textDecoration: "none",
              transition: "transform 150ms ease, box-shadow 150ms ease",
            }}
          >
            <div style={{ position: "relative", width: "100%", height: 130 }}>
              <Image
                src={dog.foto}
                alt={dog.nombre}
                fill
                style={{ objectFit: "cover" }}
                sizes="160px"
              />
            </div>
            <div style={{ padding: "0.65rem 0.75rem" }}>
              <p
                style={{
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  color: "#18181b",
                  marginBottom: "0.15rem",
                }}
              >
                {dog.nombre}
              </p>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "#71717a",
                  fontWeight: 500,
                }}
              >
                {dog.raza} · {edadLabel(dog.edad)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
