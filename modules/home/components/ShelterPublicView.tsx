// modules/home/components/ShelterPublicView.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { getShelterBySlug } from "@/modules/shared/mockData/shelters.mock";
import { MOCK_DOGS } from "@/modules/shared/mockData/dogs.mock";
import "../styles/shelterPublic.css";

interface Props {
  slug: string;
}

export default function ShelterPublicView({ slug }: Props) {
  const shelter = getShelterBySlug(slug);

  if (!shelter || !shelter.aprobado) {
    return (
      <div className="sp-not-found">
        <span className="material-symbols-outlined sp-not-found__icon">
          search_off
        </span>
        <h1 className="sp-not-found__title">Refugio no encontrado</h1>
        <p className="sp-not-found__desc">
          El refugio que buscas no existe o no está disponible actualmente.
        </p>
        <Link href="/refugios" className="sp-not-found__link">
          Ver todos los refugios
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            arrow_forward
          </span>
        </Link>
      </div>
    );
  }

  const dogs = MOCK_DOGS.filter(
    (d) => d.refugioId === shelter.id && d.estado === "disponible"
  );

  return (
    <div>
      {/* ── Banner ── */}
      <div className="sp-banner">
        <Image
          src={shelter.imagenPortada}
          alt={`Banner de ${shelter.nombre}`}
          fill
          className="sp-banner__img"
          sizes="100vw"
          priority
        />
        <div className="sp-banner__overlay" />

        <div className="sp-banner__content">
          {shelter.logo && (
            <div className="sp-banner__logo">
              <Image
                src={shelter.logo}
                alt={`Logo ${shelter.nombre}`}
                fill
                style={{ objectFit: "contain", padding: "6px" }}
              />
            </div>
          )}

          <div className="sp-banner__info">
            <h1 className="sp-banner__name">{shelter.nombre}</h1>
            <p className="sp-banner__city">
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                location_on
              </span>
              {shelter.ciudad}, {shelter.estado}
            </p>

            <div className="sp-banner__stats">
              <div>
                <span className="sp-banner__stat-val">
                  {shelter.adopcionesRealizadas ?? 0}
                </span>
                <span className="sp-banner__stat-lbl">Adopciones</span>
              </div>
              <div>
                <span className="sp-banner__stat-val">
                  {shelter.perrosDisponibles ?? 0}
                </span>
                <span className="sp-banner__stat-lbl">Disponibles</span>
              </div>
              {shelter.calificacion && (
                <div>
                  <span className="sp-banner__stat-val">
                    {shelter.calificacion.toFixed(1)} ★
                  </span>
                  <span className="sp-banner__stat-lbl">Calificación</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="sp-body">
        {/* Main: description + dogs */}
        <div className="sp-main">
          <p className="sp-section-kicker">Sobre el refugio</p>
          <h2 className="sp-section-title">Quiénes somos</h2>
          <p className="sp-desc">{shelter.descripcion}</p>

          {dogs.length > 0 && (
            <>
              <p className="sp-section-kicker">Perros disponibles</p>
              <h2 className="sp-section-title">
                {dogs.length} perro{dogs.length !== 1 ? "s" : ""} esperando un hogar
              </h2>
              <div className="sp-dogs-grid">
                {dogs.map((dog) => (
                  <Link key={dog.id} href={`/perros/${dog.nombre.toLowerCase().replace(/\s+/g, '-')}`} className="sp-dog-card">
                    <div className="sp-dog-card__media">
                      <Image
                        src={dog.foto}
                        alt={dog.nombre}
                        fill
                        className="sp-dog-card__img"
                        sizes="(max-width: 640px) 50vw, 200px"
                      />
                    </div>
                    <div className="sp-dog-card__body">
                      <p className="sp-dog-card__name">{dog.nombre}</p>
                      <p className="sp-dog-card__breed">{dog.raza}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar: contact + donate */}
        <div className="sp-sidebar">
          {/* Contact */}
          <div className="sp-contact-card">
            <h3 className="sp-contact-title">Contacto</h3>

            <a href={`tel:${shelter.telefono}`} className="sp-contact-item">
              <span className="material-symbols-outlined sp-contact-icon">call</span>
              {shelter.telefono}
            </a>
            <a href={`mailto:${shelter.correo}`} className="sp-contact-item">
              <span className="material-symbols-outlined sp-contact-icon">mail</span>
              {shelter.correo}
            </a>
            <div className="sp-contact-item">
              <span className="material-symbols-outlined sp-contact-icon">
                location_on
              </span>
              {shelter.ubicacion}
            </div>

            {/* Social links */}
            {shelter.redesSociales &&
              Object.keys(shelter.redesSociales).length > 0 && (
                <div className="sp-social">
                  {shelter.redesSociales.instagram && (
                    <a
                      href={shelter.redesSociales.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sp-social-link"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                        photo_camera
                      </span>
                      Instagram
                    </a>
                  )}
                  {shelter.redesSociales.facebook && (
                    <a
                      href={shelter.redesSociales.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sp-social-link"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                        thumb_up
                      </span>
                      Facebook
                    </a>
                  )}
                  {shelter.redesSociales.web && (
                    <a
                      href={shelter.redesSociales.web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sp-social-link"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                        language
                      </span>
                      Sitio web
                    </a>
                  )}
                </div>
              )}
          </div>

          {/* Donate */}
          {shelter.donationConfig.aceptaDonaciones && (
            <div className="sp-donate-card">
              <p className="sp-donate-kicker">¿Quieres ayudar?</p>
              <h3 className="sp-donate-title">Dona y apoya a este refugio</h3>
              <p className="sp-donate-desc">
                {shelter.donationConfig.descripcionCausa}
              </p>
              <Link
                href={`/refugios/${shelter.slug}/donar`}
                className="sp-donate-btn"
              >
                Donar ahora
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  favorite
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
