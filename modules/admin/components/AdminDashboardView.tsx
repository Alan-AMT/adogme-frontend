// modules/admin/components/AdminDashboardView.tsx
// Archivo 201 — KPIs globales, gráfica de adopciones por mes (LineChart SVG), distribución de refugios por estado (BarChart), tabla de refugios pendientes.

'use client';

import Link from 'next/link';
import { StatsCard } from '@/modules/shared/components/charts/StatsCard';
import { useAdminDashboard } from '../application/hooks/useAdminDashboard';
import { useAdminShelters } from '../application/hooks/useAdminShelters';
import '@/modules/shelter/styles/shelterDashboard.css';
import '@/modules/shelter/styles/shelterViews.css';
import '../styles/admin.css';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const ADOPTION_DATA = [32, 38, 45, 41, 52, 58, 61, 55, 48, 63, 57, 47];


function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function buildPolylinePoints(data: number[]): string {
  const viewW = 380;
  const viewH = 100;
  const padLeft = 10;
  const padRight = 10;
  const padTop = 10;
  const padBottom = 20;
  const chartW = viewW - padLeft - padRight;
  const chartH = viewH - padTop - padBottom;
  const maxVal = Math.max(...data);
  return data
    .map((v, i) => {
      const x = padLeft + (i / (data.length - 1)) * chartW;
      const y = padTop + chartH - (v / maxVal) * chartH;
      return `${x},${y}`;
    })
    .join(' ');
}

function buildAreaPoints(data: number[]): string {
  const viewW = 380;
  const viewH = 100;
  const padLeft = 10;
  const padRight = 10;
  const padTop = 10;
  const padBottom = 20;
  const chartW = viewW - padLeft - padRight;
  const chartH = viewH - padTop - padBottom;
  const maxVal = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = padLeft + (i / (data.length - 1)) * chartW;
    const y = padTop + chartH - (v / maxVal) * chartH;
    return `${x},${y}`;
  });
  const firstX = padLeft;
  const lastX = padLeft + chartW;
  const baseY = padTop + chartH;
  return `${firstX},${baseY} ${pts.join(' ')} ${lastX},${baseY}`;
}

function getDotCoords(data: number[]): Array<{ cx: number; cy: number }> {
  const viewW = 380;
  const viewH = 100;
  const padLeft = 10;
  const padRight = 10;
  const padTop = 10;
  const padBottom = 20;
  const chartW = viewW - padLeft - padRight;
  const chartH = viewH - padTop - padBottom;
  const maxVal = Math.max(...data);
  return data.map((v, i) => ({
    cx: padLeft + (i / (data.length - 1)) * chartW,
    cy: padTop + chartH - (v / maxVal) * chartH,
  }));
}

function getMonthLabelCoords(data: number[]): Array<{ x: number; label: string }> {
  const viewW = 380;
  const padLeft = 10;
  const padRight = 10;
  const chartW = viewW - padLeft - padRight;
  return data.map((_, i) => ({
    x: padLeft + (i / (data.length - 1)) * chartW,
    label: MONTHS[i],
  }));
}

export default function AdminDashboardView() {
  const { stats, isLoading: statsLoading, error: statsError } = useAdminDashboard();
  const { shelters, isLoading: sheltersLoading } = useAdminShelters();

  const isLoading = statsLoading || sheltersLoading;

  if (isLoading) {
    return (
      <div>
        <div className="sd-stats" style={{ marginBottom: '1.5rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="sd-skel-stat" />
          ))}
        </div>
        <div className="sd-charts-row" style={{ marginBottom: '1.5rem' }}>
          <div className="sd-skel-stat" style={{ height: 200 }} />
          <div className="sd-skel-stat" style={{ height: 200 }} />
        </div>
        <div className="sd-card">
          <div className="sd-card__header">
            <span className="sd-card__title">Pendientes de aprobación</span>
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="sd-skel-row" />
          ))}
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <p style={{ color: '#dc2626', padding: '1rem' }}>
        Error al cargar el panel: {statsError}
      </p>
    );
  }

  const pendingShelters = shelters.filter((s) => s.status === 'pending');

  // Agrupar refugios aprobados por alcaldía/ciudad
  const cityMap = new Map<string, number>()
  shelters
    .filter(s => s.status === 'approved')
    .forEach(s => {
      const city = s.alcaldia || s.ubicacion || 'Sin ciudad'
      cityMap.set(city, (cityMap.get(city) ?? 0) + 1)
    })
  const cityData = Array.from(cityMap.entries())
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
  const maxCity = Math.max(...cityData.map(d => d.count), 1)

  const polyline = buildPolylinePoints(ADOPTION_DATA);
  const area = buildAreaPoints(ADOPTION_DATA);
  const dots = getDotCoords(ADOPTION_DATA);
  const monthLabels = getMonthLabelCoords(ADOPTION_DATA);

  const gridLines = [25, 50, 75].map((pct) => {
    const y = 10 + (70 * pct) / 100;
    return y;
  });

  return (
    <>
      {/* KPI cards */}
      <div className="sd-stats">
        <StatsCard
          title="Total adopciones"
          value={stats?.adopcionesTotales ?? 0}
          icon={<span className="material-symbols-outlined" style={{ fontSize: 22 }}>favorite</span>}
          color="#ff6b6b"
          trend={{ value: 12, direction: 'up' }}
        />
        <StatsCard
          title="Refugios activos"
          value={stats?.refugiosActivos ?? 0}
          icon={<span className="material-symbols-outlined" style={{ fontSize: 22 }}>home_work</span>}
          color="#10b981"
        />
        <StatsCard
          title="Perros disponibles"
          value={stats?.perrosDisponibles ?? 0}
          icon={<span className="material-symbols-outlined" style={{ fontSize: 22 }}>pets</span>}
          color="#3b82f6"
        />
        <StatsCard
          title="Usuarios registrados"
          value={stats?.usuariosRegistrados ?? 0}
          icon={<span className="material-symbols-outlined" style={{ fontSize: 22 }}>group</span>}
          color="#8b5cf6"
        />
        <StatsCard
          title="Adopciones este mes"
          value={stats?.adopcionesEsteMes ?? 0}
          icon={<span className="material-symbols-outlined" style={{ fontSize: 22 }}>calendar_month</span>}
          color="#f59e0b"
          subtitle="Mes actual"
        />
        <StatsCard
          title="Tasa de éxito"
          value={stats ? `${stats.tasaExito}%` : '0%'}
          icon={<span className="material-symbols-outlined" style={{ fontSize: 22 }}>verified</span>}
          color="#16a34a"
        />
      </div>

      {/* Charts row */}
      <div className="sd-charts-row">
        {/* Line chart card */}
        <div className="sd-card">
          <div className="sd-card__header">
            <span className="sd-card__title">Adopciones por mes</span>
          </div>
          <svg
            viewBox="0 0 380 100"
            width="100%"
            height={120}
            style={{ display: 'block', overflow: 'visible' }}
          >
            {/* Grid lines */}
            {gridLines.map((y, i) => (
              <line
                key={i}
                x1={10}
                y1={y}
                x2={370}
                y2={y}
                stroke="#f4f4f5"
                strokeWidth={1}
              />
            ))}

            {/* Area fill */}
            <polygon points={area} fill="rgba(255,107,107,0.1)" />

            {/* Line */}
            <polyline
              points={polyline}
              fill="none"
              stroke="#ff6b6b"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Dots */}
            {dots.map((d, i) => (
              <circle key={i} cx={d.cx} cy={d.cy} r={3} fill="#ff6b6b" />
            ))}

            {/* Month labels */}
            {monthLabels.map((m, i) => (
              <text
                key={i}
                x={m.x}
                y={98}
                textAnchor="middle"
                fontSize={8}
                fill="#a1a1aa"
              >
                {m.label}
              </text>
            ))}
          </svg>
        </div>

        {/* Bar chart card */}
        <div className="sd-card">
          <div className="sd-card__header">
            <span className="sd-card__title">Refugios por ciudad</span>
          </div>
          <div className="ad-bar-chart">
            {cityData.length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: '#a1a1aa', textAlign: 'center', padding: '1rem 0' }}>
                Sin refugios aprobados
              </p>
            ) : cityData.map((item) => (
              <div key={item.city} className="ad-bar-row">
                <span className="ad-bar-row__label">{item.city}</span>
                <div className="ad-bar-row__track">
                  <div
                    className="ad-bar-row__fill"
                    style={{ width: `${(item.count / maxCity) * 100}%` }}
                  />
                </div>
                <span className="ad-bar-row__count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending shelters table */}
      <div className="sd-card">
        <div className="sd-card__header">
          <span className="sd-card__title">Pendientes de aprobación</span>
          <Link href="/admin/refugios?tab=pendientes" className="sd-card__link">
            Ver todos
          </Link>
        </div>

        {pendingShelters.length === 0 ? (
          <div className="sd-empty">
            <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#a1a1aa', display: 'block', marginBottom: '0.5rem' }}>
              check_circle
            </span>
            <p style={{ color: '#71717a', margin: 0 }}>No hay refugios pendientes de aprobación.</p>
          </div>
        ) : (
          <table className="sv-table">
            <thead>
              <tr>
                <th>Refugio</th>
                <th>Ciudad</th>
                <th>Fecha registro</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pendingShelters.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="ad-shelter-cell">
                      {s.logo ? (
                        <img
                          src={s.logo}
                          alt={s.nombre}
                          className="ad-shelter-cell__img"
                          width={36}
                          height={36}
                          style={{ borderRadius: '0.5rem', objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className="ad-shelter-cell__img"
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '0.5rem',
                            background: '#f4f4f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#a1a1aa' }}>home_work</span>
                        </div>
                      )}
                      <span className="ad-shelter-cell__name">{s.nombre}</span>
                    </div>
                  </td>
                  <td>
                    <span className="ad-shelter-cell__city">{s.alcaldia ?? s.ubicacion}</span>
                  </td>
                  <td>{formatDate(s.fechaRegistro)}</td>
                  <td>
                    <span className="sd-badge sd-badge--pending">Pendiente</span>
                  </td>
                  <td>
                    <Link href={`/admin/refugios/${s.id}`} className="ad-action-link">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
                      Revisar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
