// modules/shared/components/dog/DogFilters.tsx
// 'use client' — usa las clases exactas de catalog.css
// cat-chip, cat-chip--active, cat-select, cat-filter-group, cat-btn-clear

'use client'

import type { CompatibilityAnswer } from './CompatibilityIcon'
import type { DogSex, DogSize } from './DogCard'
import type { EnergyLevel } from './EnergyBar'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type DogStatus = 'disponible' | 'en_proceso' | 'adoptado'

export interface DogFiltersState {
  queryText?:    string | null
  tamano?:       DogSize | null
  sexo?:         DogSex | null
  cachorro?:     boolean | null
  nivelEnergia?: EnergyLevel | null
  estado?:       DogStatus | null
  raza?:         string | null
  compatKids?:   CompatibilityAnswer | null
  compatCats?:   CompatibilityAnswer | null
  compatDogs?:   CompatibilityAnswer | null
}

interface DogFiltersProps {
  filters:         DogFiltersState
  onChange:        (filters: DogFiltersState) => void
  onReset:         () => void
  availableBreeds: string[]
  activeCount?:    number
}

// ─── Sub-components — usan clases exactas de catalog.css ─────────────────────

function GroupTitle({ children }: { children: React.ReactNode }) {
  return <p className="cat-filter-group__title">{children}</p>
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cat-chip ${active ? 'cat-chip--active' : ''}`}
    >
      {label}
    </button>
  )
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function DogFilters({
  filters, onChange, onReset, availableBreeds, activeCount = 0,
}: DogFiltersProps) {

  function toggle<K extends keyof DogFiltersState>(key: K, val: DogFiltersState[K]) {
    onChange({ ...filters, [key]: filters[key] === val ? null : val })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Tamaño ── */}
      <div className="cat-filter-group">
        <GroupTitle>Tamaño</GroupTitle>
        <div className="cat-chip-row">
          {(['pequeño', 'mediano', 'grande', 'gigante'] as DogSize[]).map(s => (
            <Chip key={s} label={s.charAt(0).toUpperCase() + s.slice(1)} active={filters.tamano === s} onClick={() => toggle('tamano', s)} />
          ))}
        </div>
      </div>

      {/* ── Edad ── */}
      <div className="cat-filter-group" style={{ marginTop: '1.1rem' }}>
        <GroupTitle>Edad</GroupTitle>
        <div className="cat-chip-row">
          <Chip
            label="Cachorro (< 1 año)"
            active={filters.cachorro === true}
            onClick={() => onChange({ ...filters, cachorro: filters.cachorro === true ? null : true })}
          />
          <Chip
            label="Adulto"
            active={filters.cachorro === false}
            onClick={() => onChange({ ...filters, cachorro: filters.cachorro === false ? null : false })}
          />
          <Chip
            label="Senior (7+ años)"
            active={false} // placeholder — conectar con edad >= 84 meses
            onClick={() => {}}
          />
        </div>
      </div>

      {/* ── Sexo ── */}
      <div className="cat-filter-group" style={{ marginTop: '1.1rem' }}>
        <GroupTitle>Sexo</GroupTitle>
        <div className="cat-chip-row">
          {(['macho', 'hembra'] as DogSex[]).map(s => (
            <Chip key={s} label={s === 'macho' ? '♂ Macho' : '♀ Hembra'} active={filters.sexo === s} onClick={() => toggle('sexo', s)} />
          ))}
        </div>
      </div>

      {/* ── Nivel de energía ── */}
      <div className="cat-filter-group" style={{ marginTop: '1.1rem' }}>
        <GroupTitle>Nivel de energía</GroupTitle>
        <div className="cat-chip-row">
          {([
            { val: 1, label: 'Bajo' },
            { val: 2, label: 'Moderado' },
            { val: 3, label: 'Alto' },
            { val: 4, label: 'Muy alto' },
            { val: 5, label: 'Extremo' },
          ] as { val: EnergyLevel; label: string }[]).map(({ val, label }) => (
            <Chip key={val} label={label} active={filters.nivelEnergia === val} onClick={() => toggle('nivelEnergia', val)} />
          ))}
        </div>
      </div>

      {/* ── Estado ── */}
      <div className="cat-filter-group" style={{ marginTop: '1.1rem' }}>
        <GroupTitle>Estado</GroupTitle>
        <div className="cat-chip-row">
          {([
            { val: 'disponible', label: 'Disponible' },
            { val: 'en_proceso', label: 'En proceso' },
            { val: 'adoptado',   label: 'Adoptado' },
          ] as { val: DogStatus; label: string }[]).map(({ val, label }) => (
            <Chip key={val} label={label} active={filters.estado === val} onClick={() => toggle('estado', val)} />
          ))}
        </div>
      </div>

      {/* ── Convivencia ── */}
      <div className="cat-filter-group" style={{ marginTop: '1.1rem' }}>
        <GroupTitle>Convive bien con</GroupTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {([
            { key: 'compatKids' as keyof DogFiltersState, icon: 'child_care', label: 'Niños' },
            { key: 'compatCats' as keyof DogFiltersState, icon: 'cruelty_free', label: 'Gatos' },
            { key: 'compatDogs' as keyof DogFiltersState, icon: 'pets', label: 'Otros perros' },
          ]).map(item => (
            <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <div
                style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  border: `1.5px solid ${filters[item.key] === 'yes' ? '#ff6b6b' : '#e4e4e7'}`,
                  background: filters[item.key] === 'yes' ? '#ff6b6b' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 150ms ease', cursor: 'pointer',
                }}
                onClick={() => onChange({ ...filters, [item.key]: filters[item.key] === 'yes' ? null : 'yes' })}
              >
                {filters[item.key] === 'yes' && (
                  <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#fff' }}>check</span>
                )}
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#ff6b6b' }}>{item.icon}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Raza ── */}
      {availableBreeds.length > 0 && (
        <div className="cat-select-wrap" style={{ marginTop: '1.1rem' }}>
          <label className="cat-select-label">Raza</label>
          <select
            className="cat-select"
            value={filters.raza ?? ''}
            onChange={e => onChange({ ...filters, raza: e.target.value || null })}
          >
            <option value="">Todas las razas</option>
            {availableBreeds.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      )}

      {/* ── Limpiar ── */}
      <div className="cat-sidebar__actions" style={{ marginTop: '1rem' }}>
        <button type="button" className="cat-btn-clear" onClick={onReset}>
          Limpiar filtros{activeCount > 0 ? ` (${activeCount})` : ''}
        </button>
      </div>
    </div>
  )
}
