import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand-info">
            <Link href="/" className="footer-logo-link" aria-label="Ir al inicio">
              <Image
                src="/assets/logos/adogme-logo.png"
                alt="ADOGME"
                width={44}
                height={44}
                className="footer-logo"
                priority
              />
              <span className="footer-brand-text">aDOGme</span>
            </Link>

            <p className="footer-tagline">
              Uniendo corazones en la Gustavo A. Madero. Dale una segunda oportunidad a quien más lo necesita.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Explorar</h4>
            <ul className="footer-links">
              <li>
                <Link href="/perros" className="footer-link">
                  Perros en adopción
                </Link>
              </li>
              <li>
                <Link href="/refugios" className="footer-link">
                  Nuestros Refugios
                </Link>
              </li>
              <li>
                <Link href="/historias" className="footer-link">
                  Historias de éxito
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Ayuda</h4>
            <ul className="footer-links">
              <li>
                <Link href="/faq" className="footer-link">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="footer-link">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Legal</h4>
            <ul className="footer-links">
              <li>
                <Link href="/privacidad" className="footer-link">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="footer-link">
                  Términos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} ADOGME. Hecho con ❤️ en CDMX.</p>
        </div>
      </div>
    </footer>
  );
}
