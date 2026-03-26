// modules/home/components/TestimonialsSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useAdoptionStories } from "../application/hooks/useHomeContent";
import "../styles/homeStories.css";

function Skeleton() {
  return (
    <div className="home-stories__list">
      {[1, 2, 3].map((i) => (
        <div key={i} className="story-skel-frame">
          <div className="story-skel-photo" />
          <div className="story-skel-body">
            <div className="story-skel-line is-wide" />
            <div className="story-skel-line is-mid" />
            <div className="story-skel-line is-wide" />
            <div className="story-skel-line is-short" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SuccessStoriesList() {
  const { stories, loading } = useAdoptionStories();

  return (
    <section className="home-stories container mx-auto px-5">
      {/* Header — mismo patrón que Perros y Refugios */}
      <div className="home-stories__header">
        <div>
          <p className="home-stories__kicker">Finales felices</p>
          <h2 className="home-stories__title">Historias de éxito</h2>
          <p className="home-stories__subtitle">
            Perros que encontraron su hogar para siempre
          </p>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <Skeleton />
      ) : (
        <div className="home-stories__list">
          {stories.slice(0, 3).map((story) => (
            <div key={story.id} className="story-frame">
              <div className="story-panel">
                {/* Foto izquierda */}
                <div className="story-photo">
                  <Image
                    src={story.imageUrl}
                    alt={`${story.dogName} — historia de adopción`}
                    fill
                    className="story-photo__img"
                    sizes="(max-width: 480px) 160px, 200px"
                  />
                </div>

                {/* Contenido derecho */}
                <div className="story-body">
                  <span className="story-body__quote-mark" aria-hidden="true">
                    "
                  </span>
                  <p className="story-body__text">{story.storyShort}"</p>
                  <p className="story-body__dog">{story.dogName}</p>
                  <p className="story-body__adopter">
                    Adoptado por {story.adopterName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
