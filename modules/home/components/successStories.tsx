"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AdoptionStory } from "../domain/AdoptionStory";
import { MockAdoptionStoriesRepository } from "../infrastructure/MockAdoptionStories";

export default function SuccessStoriesList() {
  const [stories, setStories] = useState<AdoptionStory[]>([]);

  useEffect(() => {
    const repo = new MockAdoptionStoriesRepository();
    repo.getLatestStories().then(setStories);
  }, []);

  return (
    <section className="home-stories">
      <header className="home-stories__header">
        <div>
          {/* Kicker en rojo idéntico a las otras secciones */}
          <p className="home-stories__kicker">Finales Felices</p>
          <h2 className="home-stories__title">Historias de éxito</h2>
        </div>
      </header>

      <div className="home-stories__grid">
        {stories.map((story) => (
          <article key={story.id} className="story-card">
            {/* Contenedor de imagen con altura fija para evitar cortes extraños */}
            <div className="story-card__image-container">
              <Image
                src={story.imageUrl}
                alt={`Historia de ${story.dogName}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="story-card__img"
                priority={story.id === 1}
              />
            </div>

            <div className="story-card__content">
              <h3 className="story-card__dog">{story.dogName}</h3>
              <p className="story-card__adopter">Adoptado por {story.adopterName}</p>
              <div className="home-stories__divider" />
              <p className="story-card__text">"{story.storyShort}"</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
