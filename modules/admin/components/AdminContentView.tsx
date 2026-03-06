'use client'
// modules/admin/components/AdminContentView.tsx
// Archivo 205 — Gestión de contenido: proceso de adopción, chatbot FAQs y contenido general.

import { useState, useRef, useCallback, useEffect, type ChangeEvent } from 'react'
import { useAdminContent } from '../application/hooks/useAdminContent'
import type { AdoptionStep, ChatbotFAQ } from '@/modules/shared/mockData/content.mock'
import '../styles/admin.css'

// ─── Types & Constants ────────────────────────────────────────────────────────

type ContentTab = 'proceso' | 'faqs' | 'general'

const CATEGORIA_LABELS: Record<string, string> = {
  adopcion:   'Adopción',
  requisitos: 'Requisitos',
  proceso:    'Proceso',
  cuidados:   'Cuidados',
  plataforma: 'Plataforma',
  donaciones: 'Donaciones',
}

const CATEGORIAS = ['adopcion', 'requisitos', 'proceso', 'cuidados', 'plataforma', 'donaciones'] as const

// ─── Shared inline styles ─────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  padding: '0.55rem 0.85rem',
  border: '1.5px solid #e4e4e7',
  borderRadius: '0.7rem',
  fontSize: '0.85rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box' as const,
  fontFamily: 'inherit',
  color: '#18181b',
  background: '#fff',
}

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  lineHeight: 1.5,
}

const primaryBtnStyle: React.CSSProperties = {
  background: '#ff6b6b',
  color: '#fff',
  border: 'none',
  borderRadius: 999,
  padding: '0.5rem 1.1rem',
  fontWeight: 900,
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '0.82rem',
}

const ghostBtnStyle: React.CSSProperties = {
  border: '1.5px solid #e4e4e7',
  background: '#fff',
  borderRadius: 999,
  padding: '0.5rem 1.1rem',
  fontWeight: 900,
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '0.82rem',
  color: '#52525b',
}

const dangerBtnStyle: React.CSSProperties = {
  background: '#fee2e2',
  color: '#dc2626',
  border: 'none',
  borderRadius: '0.5rem',
  padding: '0.35rem 0.65rem',
  fontWeight: 900,
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '0.78rem',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.2rem',
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1.5px solid #f0f0f0',
  borderRadius: '1.2rem',
  overflow: 'hidden',
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
}

const successBannerStyle: React.CSSProperties = {
  background: '#dcfce7',
  border: '1.5px solid #bbf7d0',
  borderRadius: '0.75rem',
  padding: '0.65rem 1rem',
  color: '#166534',
  fontSize: '0.82rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div style={cardStyle}>
      <div style={{ padding: '1.1rem 1.25rem 0.75rem', borderBottom: '1px solid #f4f4f5', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ height: 20, width: 180, borderRadius: '0.5rem', background: '#f4f4f5' }} />
        <div style={{ height: 32, width: 100, borderRadius: 999, background: '#f4f4f5' }} />
      </div>
      <div style={{ padding: '0.5rem 1.25rem' }}>
        <div className="ad-skel-row" />
        <div className="ad-skel-row" />
        <div className="ad-skel-row" />
      </div>
    </div>
  )
}

// ─── Tab 1: Proceso de Adopción ───────────────────────────────────────────────

interface ProcesoTabProps {
  localSteps: AdoptionStep[]
  setLocalSteps: (steps: AdoptionStep[]) => void
  isSaving: boolean
  saveAdoptionProcess: (steps: AdoptionStep[]) => Promise<void>
}

function ProcesoTab({ localSteps, setLocalSteps, isSaving, saveAdoptionProcess }: ProcesoTabProps) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)
  const dragRef = useRef<number | null>(null)

  const onDragStart = useCallback((idx: number) => {
    dragRef.current = idx
  }, [])

  const onDragOver = useCallback((e: React.DragEvent, idx: number) => {
    e.preventDefault()
    setDragOver(idx)
  }, [])

  const onDrop = useCallback((idx: number) => {
    const from = dragRef.current
    if (from === null || from === idx) { setDragOver(null); return }
    const arr = [...localSteps]
    const [moved] = arr.splice(from, 1)
    arr.splice(idx, 0, moved)
    setLocalSteps(arr.map((s, i) => ({ ...s, numero: i + 1 })))
    setDragOver(null)
    dragRef.current = null
  }, [localSteps, setLocalSteps])

  const updateStep = useCallback((idx: number, field: keyof AdoptionStep, value: string | string[]) => {
    const arr = [...localSteps]
    arr[idx] = { ...arr[idx], [field]: value }
    setLocalSteps(arr)
  }, [localSteps, setLocalSteps])

  const deleteStep = useCallback((idx: number) => {
    const arr = localSteps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, numero: i + 1 }))
    setLocalSteps(arr)
    if (editingIdx === idx) setEditingIdx(null)
    else if (editingIdx !== null && editingIdx > idx) setEditingIdx(editingIdx - 1)
  }, [localSteps, setLocalSteps, editingIdx])

  const addStep = useCallback(() => {
    const newStep: AdoptionStep = {
      numero: localSteps.length + 1,
      titulo: 'Nuevo paso',
      descripcion: '',
      icono: 'star',
      documentos: [],
      duracionEstimada: '',
    }
    setLocalSteps([...localSteps, newStep])
    setEditingIdx(localSteps.length)
  }, [localSteps, setLocalSteps])

  const handleSave = useCallback(async () => {
    await saveAdoptionProcess(localSteps)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }, [localSteps, saveAdoptionProcess])

  const stepColors = ['#ff6b6b', '#ff8e53', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa']

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '0.82rem', color: '#71717a', fontWeight: 600, marginBottom: '0.2rem' }}>
            Arrastra los pasos para reordenarlos. Los cambios se guardan al presionar "Guardar".
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {saved && (
            <div style={successBannerStyle}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Proceso guardado
            </div>
          )}
          <button
            onClick={addStep}
            style={ghostBtnStyle}
          >
            + Agregar paso
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{ ...primaryBtnStyle, opacity: isSaving ? 0.7 : 1 }}
          >
            {isSaving ? 'Guardando…' : 'Guardar proceso'}
          </button>
        </div>
      </div>

      {/* Steps list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {localSteps.map((step, i) => {
          const color = stepColors[i % stepColors.length]
          const isDragTarget = dragOver === i
          return (
            <div
              key={step.numero}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={(e) => onDragOver(e, i)}
              onDrop={() => onDrop(i)}
              onDragLeave={() => setDragOver(null)}
              style={{
                ...cardStyle,
                borderColor: isDragTarget ? 'rgba(255,107,107,0.3)' : '#f0f0f0',
                borderStyle: isDragTarget ? 'dashed' : 'solid',
                background: isDragTarget ? 'rgba(255,107,107,0.04)' : '#fff',
                borderTop: `3px solid ${color}`,
                transition: 'all 150ms ease',
              }}
            >
              {/* Row header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem' }}>
                {/* Drag handle */}
                <span
                  className="material-symbols-outlined"
                  style={{ color: '#d4d4d8', cursor: 'grab', fontSize: 20, flexShrink: 0, userSelect: 'none' }}
                >
                  drag_indicator
                </span>

                {/* Step number chip */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: color,
                  color: '#fff', fontSize: '0.78rem', fontWeight: 900,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {step.numero}
                </div>

                {/* Icon */}
                <span className="material-symbols-outlined" style={{ color, fontSize: 20, flexShrink: 0, fontVariationSettings: "'FILL' 1" }}>
                  {step.icono}
                </span>

                {/* Title */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#18181b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {step.titulo}
                  </div>
                  {step.duracionEstimada && (
                    <div style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 600, marginTop: '0.1rem' }}>
                      {step.duracionEstimada}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <button
                  onClick={() => setEditingIdx(editingIdx === i ? null : i)}
                  style={{
                    ...ghostBtnStyle,
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.78rem',
                    background: editingIdx === i ? 'rgba(255,107,107,0.08)' : '#fff',
                    borderColor: editingIdx === i ? '#ff6b6b' : '#e4e4e7',
                    color: editingIdx === i ? '#ff6b6b' : '#52525b',
                  }}
                >
                  {editingIdx === i ? 'Cerrar' : 'Editar'}
                </button>
                <button onClick={() => deleteStep(i)} style={dangerBtnStyle}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                </button>
              </div>

              {/* Inline edit panel */}
              {editingIdx === i && (
                <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid #f4f4f5', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="ad-field">
                      <label className="ad-field__label">Título del paso</label>
                      <input
                        style={inputStyle}
                        value={step.titulo}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => updateStep(i, 'titulo', e.target.value)}
                        placeholder="Título"
                      />
                    </div>
                    <div className="ad-field">
                      <label className="ad-field__label">Ícono (Material Symbol)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          style={{ ...inputStyle, flex: 1 }}
                          value={step.icono}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => updateStep(i, 'icono', e.target.value)}
                          placeholder="search, assignment…"
                        />
                        <span className="material-symbols-outlined" style={{ color, fontSize: 22, flexShrink: 0, fontVariationSettings: "'FILL' 1" }}>
                          {step.icono || 'star'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ad-field">
                    <label className="ad-field__label">Duración estimada</label>
                    <input
                      style={inputStyle}
                      value={step.duracionEstimada}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => updateStep(i, 'duracionEstimada', e.target.value)}
                      placeholder="ej. 15–30 minutos"
                    />
                  </div>

                  <div className="ad-field">
                    <label className="ad-field__label">Descripción</label>
                    <textarea
                      style={{ ...textareaStyle }}
                      rows={3}
                      value={step.descripcion}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateStep(i, 'descripcion', e.target.value)}
                      placeholder="Describe este paso del proceso…"
                    />
                  </div>

                  <div className="ad-field">
                    <label className="ad-field__label">Documentos requeridos (uno por línea)</label>
                    <textarea
                      style={{ ...textareaStyle }}
                      rows={3}
                      value={step.documentos.join('\n')}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        updateStep(i, 'documentos', e.target.value.split('\n').filter(d => d.trim() !== ''))
                      }
                      placeholder="Identificación oficial&#10;Comprobante de domicilio"
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => setEditingIdx(null)} style={primaryBtnStyle}>
                      Guardar este paso
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {localSteps.length === 0 && (
          <div className="ad-empty">
            <span className="material-symbols-outlined" style={{ fontSize: 32, display: 'block', marginBottom: '0.5rem', color: '#d4d4d8' }}>list_alt</span>
            No hay pasos definidos. Agrega el primero.
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Tab 2: Chatbot FAQs ──────────────────────────────────────────────────────

interface FaqsTabProps {
  localFaqs: ChatbotFAQ[]
  setLocalFaqs: (faqs: ChatbotFAQ[]) => void
  isSaving: boolean
  saveFaqs: (faqs: ChatbotFAQ[]) => Promise<void>
}

function FaqsTab({ localFaqs, setLocalFaqs, isSaving, saveFaqs }: FaqsTabProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [newFaq, setNewFaq] = useState<Partial<ChatbotFAQ> | null>(null)
  const [previewFaq, setPreviewFaq] = useState<ChatbotFAQ | null>(null)
  const [savedFaqs, setSavedFaqs] = useState(false)

  const updateFaq = useCallback((id: number, field: keyof ChatbotFAQ, value: string | string[]) => {
    setLocalFaqs(localFaqs.map(f => f.id === id ? { ...f, [field]: value } : f))
  }, [localFaqs, setLocalFaqs])

  const deleteFaq = useCallback((id: number) => {
    setLocalFaqs(localFaqs.filter(f => f.id !== id))
    if (expandedFaq === id) setExpandedFaq(null)
    if (previewFaq?.id === id) setPreviewFaq(null)
  }, [localFaqs, setLocalFaqs, expandedFaq, previewFaq])

  const addNewFaq = useCallback(() => {
    if (!newFaq?.pregunta || !newFaq?.respuesta) return
    const maxId = localFaqs.reduce((m, f) => Math.max(m, f.id), 0)
    const faq: ChatbotFAQ = {
      id: maxId + 1,
      pregunta: newFaq.pregunta ?? '',
      respuesta: newFaq.respuesta ?? '',
      keywords: newFaq.keywords ?? [],
      categoria: (newFaq.categoria as ChatbotFAQ['categoria']) ?? 'adopcion',
    }
    setLocalFaqs([...localFaqs, faq])
    setNewFaq(null)
  }, [localFaqs, setLocalFaqs, newFaq])

  const handleSave = useCallback(async () => {
    await saveFaqs(localFaqs)
    setSavedFaqs(true)
    setTimeout(() => setSavedFaqs(false), 2500)
  }, [localFaqs, saveFaqs])

  return (
    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
      {/* Main area */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.82rem', color: '#71717a', fontWeight: 600 }}>
            {localFaqs.length} preguntas frecuentes configuradas
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {savedFaqs && (
              <div style={successBannerStyle}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                FAQs guardadas
              </div>
            )}
            {!newFaq && (
              <button onClick={() => setNewFaq({ categoria: 'adopcion', keywords: [] })} style={ghostBtnStyle}>
                + Agregar FAQ
              </button>
            )}
            <button onClick={handleSave} disabled={isSaving} style={{ ...primaryBtnStyle, opacity: isSaving ? 0.7 : 1 }}>
              {isSaving ? 'Guardando…' : 'Guardar FAQs'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={cardStyle}>
          <table className="ad-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: 36 }}>#</th>
                <th style={{ width: 110 }}>Categoría</th>
                <th>Pregunta</th>
                <th style={{ width: 200 }}>Respuesta</th>
                <th style={{ width: 100 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {localFaqs.map((faq) => (
                <>
                  <tr key={faq.id}>
                    <td style={{ color: '#a1a1aa', fontWeight: 700, fontSize: '0.75rem' }}>{faq.id}</td>
                    <td>
                      <span style={{
                        background: '#f4f4f5', color: '#52525b', borderRadius: 999,
                        padding: '0.2rem 0.6rem', fontSize: '0.72rem', fontWeight: 800,
                      }}>
                        {CATEGORIA_LABELS[faq.categoria] ?? faq.categoria}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.83rem', fontWeight: 700, color: '#18181b', maxWidth: 240 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {faq.pregunta}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#71717a', maxWidth: 200 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {faq.respuesta.slice(0, 80)}{faq.respuesta.length > 80 ? '…' : ''}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                          style={{
                            ...ghostBtnStyle, padding: '0.3rem 0.55rem', fontSize: '0.75rem',
                            background: expandedFaq === faq.id ? 'rgba(255,107,107,0.08)' : '#fff',
                            borderColor: expandedFaq === faq.id ? '#ff6b6b' : '#e4e4e7',
                            color: expandedFaq === faq.id ? '#ff6b6b' : '#52525b',
                          }}
                          title="Editar"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span>
                        </button>
                        <button
                          onClick={() => setPreviewFaq(previewFaq?.id === faq.id ? null : faq)}
                          style={{
                            ...ghostBtnStyle, padding: '0.3rem 0.55rem', fontSize: '0.75rem',
                            background: previewFaq?.id === faq.id ? 'rgba(96,165,250,0.08)' : '#fff',
                            borderColor: previewFaq?.id === faq.id ? '#60a5fa' : '#e4e4e7',
                            color: previewFaq?.id === faq.id ? '#2563eb' : '#52525b',
                          }}
                          title="Vista previa"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>visibility</span>
                        </button>
                        <button onClick={() => deleteFaq(faq.id)} style={{ ...dangerBtnStyle, borderRadius: '0.5rem' }} title="Eliminar">
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Inline edit row */}
                  {expandedFaq === faq.id && (
                    <tr key={`edit-${faq.id}`}>
                      <td colSpan={5} style={{ background: '#fafafa', padding: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div className="ad-field">
                            <label className="ad-field__label">Pregunta</label>
                            <input
                              style={inputStyle}
                              value={faq.pregunta}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => updateFaq(faq.id, 'pregunta', e.target.value)}
                            />
                          </div>
                          <div className="ad-field">
                            <label className="ad-field__label">Respuesta</label>
                            <textarea
                              style={textareaStyle}
                              rows={4}
                              value={faq.respuesta}
                              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateFaq(faq.id, 'respuesta', e.target.value)}
                            />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div className="ad-field">
                              <label className="ad-field__label">Keywords (separadas por coma)</label>
                              <input
                                style={inputStyle}
                                value={faq.keywords.join(', ')}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                  updateFaq(faq.id, 'keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))
                                }
                                placeholder="costo, precio, gratis"
                              />
                            </div>
                            <div className="ad-field">
                              <label className="ad-field__label">Categoría</label>
                              <select
                                style={{ ...inputStyle, cursor: 'pointer' }}
                                value={faq.categoria}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                  updateFaq(faq.id, 'categoria', e.target.value)
                                }
                              >
                                {CATEGORIAS.map(cat => (
                                  <option key={cat} value={cat}>{CATEGORIA_LABELS[cat]}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button onClick={() => setExpandedFaq(null)} style={ghostBtnStyle}>Cancelar</button>
                            <button onClick={() => setExpandedFaq(null)} style={primaryBtnStyle}>Guardar</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>

          {localFaqs.length === 0 && (
            <div className="ad-empty">No hay FAQs configuradas.</div>
          )}
        </div>

        {/* Add FAQ form */}
        {newFaq !== null && (
          <div style={{ ...cardStyle, marginTop: '1rem', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#18181b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#ff6b6b', fontVariationSettings: "'FILL' 1" }}>add_circle</span>
              Nueva pregunta frecuente
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="ad-field">
                <label className="ad-field__label">Pregunta</label>
                <input
                  style={inputStyle}
                  value={newFaq.pregunta ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFaq({ ...newFaq, pregunta: e.target.value })}
                  placeholder="¿Cuánto cuesta adoptar?"
                />
              </div>
              <div className="ad-field">
                <label className="ad-field__label">Respuesta</label>
                <textarea
                  style={textareaStyle}
                  rows={4}
                  value={newFaq.respuesta ?? ''}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewFaq({ ...newFaq, respuesta: e.target.value })}
                  placeholder="La adopción es gratuita…"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="ad-field">
                  <label className="ad-field__label">Keywords (separadas por coma)</label>
                  <input
                    style={inputStyle}
                    value={(newFaq.keywords ?? []).join(', ')}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setNewFaq({ ...newFaq, keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) })
                    }
                    placeholder="costo, precio"
                  />
                </div>
                <div className="ad-field">
                  <label className="ad-field__label">Categoría</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={newFaq.categoria ?? 'adopcion'}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setNewFaq({ ...newFaq, categoria: e.target.value as ChatbotFAQ['categoria'] })
                    }
                  >
                    {CATEGORIAS.map(cat => (
                      <option key={cat} value={cat}>{CATEGORIA_LABELS[cat]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button onClick={() => setNewFaq(null)} style={ghostBtnStyle}>Cancelar</button>
                <button onClick={addNewFaq} style={primaryBtnStyle} disabled={!newFaq.pregunta || !newFaq.respuesta}>
                  Agregar FAQ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview panel */}
      {previewFaq && (
        <div style={{
          width: 280, flexShrink: 0,
          ...cardStyle,
          position: 'sticky', top: '1rem',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.85rem 1rem 0.6rem', borderBottom: '1px solid #f4f4f5',
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#18181b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#ff6b6b', fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              Vista previa
            </div>
            <button
              onClick={() => setPreviewFaq(null)}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#a1a1aa', fontSize: '1rem', lineHeight: 1, padding: '0.2rem' }}
            >
              ×
            </button>
          </div>

          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: 200 }}>
            {/* User bubble */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{
                background: '#ff6b6b', color: '#fff',
                borderRadius: '1rem 1rem 0 1rem',
                padding: '0.6rem 0.85rem',
                fontSize: '0.78rem', fontWeight: 600,
                maxWidth: '90%', lineHeight: 1.45,
              }}>
                {previewFaq.pregunta}
              </div>
            </div>

            {/* Bot bubble */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                background: '#18181b', color: '#fff',
                borderRadius: '1rem 1rem 1rem 0',
                padding: '0.6rem 0.85rem',
                fontSize: '0.78rem', fontWeight: 500,
                maxWidth: '90%', lineHeight: 1.5,
              }}>
                {previewFaq.respuesta}
              </div>
            </div>

            {/* Keywords */}
            {previewFaq.keywords.length > 0 && (
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 900, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                  Keywords
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {previewFaq.keywords.map((kw, ki) => (
                    <span key={ki} style={{
                      background: '#f4f4f5', color: '#52525b',
                      borderRadius: 999, padding: '0.18rem 0.55rem',
                      fontSize: '0.7rem', fontWeight: 700,
                    }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Tab 3: Contenido general ─────────────────────────────────────────────────

function GeneralTab() {
  const [generalContent, setGeneralContent] = useState({
    plataformaNombre: 'aDOGme',
    plataformaDescripcion: 'La plataforma de adopción responsable de mascotas más grande de México.',
    correoContacto: 'hola@adogme.mx',
    correoSoporte: 'soporte@adogme.mx',
    mensajeBienvenida: '¡Bienvenido a aDOGme! Aquí encontrarás a tu compañero ideal.',
    textoPolitica: 'Todas las adopciones son gratuitas. El refugio puede solicitar una cuota simbólica.',
  })
  const [savedGeneral, setSavedGeneral] = useState(false)

  const handleSave = () => {
    // Mock save
    setTimeout(() => {
      setSavedGeneral(true)
      setTimeout(() => setSavedGeneral(false), 2500)
    }, 600)
  }

  const fields: Array<{ key: keyof typeof generalContent; label: string; multiline?: boolean }> = [
    { key: 'plataformaNombre',       label: 'Nombre de la plataforma' },
    { key: 'plataformaDescripcion',  label: 'Descripción de la plataforma', multiline: true },
    { key: 'correoContacto',         label: 'Correo de contacto' },
    { key: 'correoSoporte',          label: 'Correo de soporte' },
    { key: 'mensajeBienvenida',      label: 'Mensaje de bienvenida', multiline: true },
    { key: 'textoPolitica',          label: 'Texto de política de adopción', multiline: true },
  ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ fontSize: '0.82rem', color: '#71717a', fontWeight: 600 }}>
          Información general mostrada en toda la plataforma.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {savedGeneral && (
            <div style={successBannerStyle}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Contenido guardado
            </div>
          )}
          <button onClick={handleSave} style={primaryBtnStyle}>
            Guardar contenido
          </button>
        </div>
      </div>

      <div style={{ ...cardStyle, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        {fields.map(({ key, label, multiline }) => (
          <div key={key} className="ad-field">
            <label className="ad-field__label">{label}</label>
            {multiline ? (
              <textarea
                style={{ ...textareaStyle }}
                rows={3}
                value={generalContent[key]}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setGeneralContent(prev => ({ ...prev, [key]: e.target.value }))
                }
              />
            ) : (
              <input
                style={inputStyle}
                value={generalContent[key]}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setGeneralContent(prev => ({ ...prev, [key]: e.target.value }))
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TAB_CONFIG: Array<{ id: ContentTab; label: string; icon: string }> = [
  { id: 'proceso',  label: 'Proceso de adopción', icon: 'route' },
  { id: 'faqs',     label: 'Chatbot FAQs',         icon: 'smart_toy' },
  { id: 'general',  label: 'Contenido general',    icon: 'settings' },
]

export default function AdminContentView() {
  const { steps, faqs, isLoading, isSaving, error, saveAdoptionProcess, saveFaqs } = useAdminContent()
  const [activeTab, setActiveTab] = useState<ContentTab>('proceso')

  const [localSteps, setLocalSteps] = useState<AdoptionStep[]>([])
  const [localFaqs,  setLocalFaqs]  = useState<ChatbotFAQ[]>([])

  useEffect(() => { if (steps.length) setLocalSteps(steps) }, [steps])
  useEffect(() => { if (faqs.length)  setLocalFaqs(faqs)   }, [faqs])

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <>
      {/* Error banner */}
      {error && (
        <div style={{
          background: '#fee2e2', border: '1.5px solid #fca5a5', borderRadius: '0.75rem',
          padding: '0.65rem 1rem', color: '#991b1b', fontSize: '0.82rem', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>error</span>
          {error}
        </div>
      )}

      {/* Tab bar */}
      <div className="ad-tabs">
        {TAB_CONFIG.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.7rem 1.1rem',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: '0.83rem',
                fontWeight: isActive ? 900 : 600,
                color: isActive ? '#ff6b6b' : '#71717a',
                borderBottom: isActive ? '2.5px solid #ff6b6b' : '2.5px solid transparent',
                marginBottom: -1.5,
                transition: 'color 150ms ease, border-color 150ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 16,
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {tab.icon}
              </span>
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'proceso' && (
        <ProcesoTab
          localSteps={localSteps}
          setLocalSteps={setLocalSteps}
          isSaving={isSaving}
          saveAdoptionProcess={saveAdoptionProcess}
        />
      )}

      {activeTab === 'faqs' && (
        <FaqsTab
          localFaqs={localFaqs}
          setLocalFaqs={setLocalFaqs}
          isSaving={isSaving}
          saveFaqs={saveFaqs}
        />
      )}

      {activeTab === 'general' && (
        <GeneralTab />
      )}
    </>
  )
}
