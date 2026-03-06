// modules/shared/components/ui/FileUpload.tsx
'use client'

import Image from 'next/image';
import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from 'react';

interface ExistingFile { url: string; name: string }

interface FileUploadProps {
  accept:          string[]      // e.g. ['image/*'] or ['image/*', '.pdf']
  maxFiles:        number
  maxSizeMB:       number
  onFilesChange:   (files: File[]) => void
  existingFiles?:  ExistingFile[]
  disabled?:       boolean
  showPreview?:    boolean
  variant?:        'dropzone' | 'button'
  label?:          string
  helperText?:     string
}

interface FileEntry {
  file:    File
  preview: string | null
  error?:  string
}

export function FileUpload({
  accept, maxFiles, maxSizeMB, onFilesChange,
  existingFiles = [], disabled, showPreview = true,
  variant = 'dropzone', label, helperText,
}: FileUploadProps) {
  const [entries,   setEntries]   = useState<FileEntry[]>([])
  const [isDragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isImage = (file: File) => file.type.startsWith('image/')

  const validate = (file: File): string | null => {
    if (file.size > maxSizeMB * 1024 * 1024)
      return `El archivo supera el límite de ${maxSizeMB}MB`
    const accepted = accept.some(a =>
      a === '*' || file.type.match(a.replace('*', '.*')) || file.name.endsWith(a)
    )
    if (!accepted) return 'Tipo de archivo no permitido'
    return null
  }

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles)
    const total = entries.length + existingFiles.length + arr.length

    const toAdd: FileEntry[] = arr.slice(0, maxFiles - entries.length - existingFiles.length).map(file => {
      const error   = validate(file)
      const preview = !error && isImage(file) ? URL.createObjectURL(file) : null
      return { file, preview, error: error ?? undefined }
    })

    const next = [...entries, ...toAdd]
    setEntries(next)
    onFilesChange(next.filter(e => !e.error).map(e => e.file))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, existingFiles.length, maxFiles, maxSizeMB])

  const removeEntry = (i: number) => {
    const next = entries.filter((_, idx) => idx !== i)
    setEntries(next)
    onFilesChange(next.filter(e => !e.error).map(e => e.file))
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault(); setDragging(false)
    if (!disabled) addFiles(e.dataTransfer.files)
  }
  const onDragOver  = (e: DragEvent) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = ()              => setDragging(false)
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files)
    e.target.value = ''
  }

  const canAdd = entries.length + existingFiles.length < maxFiles

  return (
    <div className="flex flex-col gap-3">
      {label && <p className="text-[13px] font-[900] text-[#1f2937]">{label}</p>}

      {/* ── Dropzone ── */}
      {variant === 'dropzone' && canAdd && (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => !disabled && inputRef.current?.click()}
          className={[
            'border-2 border-dashed rounded-[1rem] flex flex-col items-center justify-center gap-2',
            'py-8 px-4 text-center cursor-pointer transition-all duration-200',
            isDragging && !disabled
              ? 'border-[var(--brand)] bg-[#fff5f5]'
              : 'border-[#e4e4e7] bg-[#fafafa] hover:border-[#ff6b6b] hover:bg-[#fff5f5]',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
          ].filter(Boolean).join(' ')}
        >
          <span className="material-symbols-outlined text-[#a1a1aa]"
            style={{ fontSize: 32, fontVariationSettings: "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 32" }}>
            upload_file
          </span>
          <p className="text-sm font-[800] text-[#3f3f46]">
            Arrastra tus archivos aquí <span className="text-[#a1a1aa] font-[600]">o haz clic para seleccionar</span>
          </p>
          <p className="text-xs text-[#a1a1aa] font-[600]">
            {accept.join(', ')} · máx {maxSizeMB}MB · hasta {maxFiles} archivo{maxFiles > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* ── Button variant ── */}
      {variant === 'button' && canAdd && (
        <button
          type="button"
          onClick={() => !disabled && inputRef.current?.click()}
          disabled={disabled}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-[1.5px] border-[#e4e4e7]
                     bg-white text-sm font-[800] text-[#3f3f46] hover:border-[#ff6b6b] hover:text-[#ff6b6b]
                     hover:bg-[#fff5f5] transition-all disabled:opacity-50 disabled:cursor-not-allowed w-fit"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>attach_file</span>
          Adjuntar archivo
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept.join(',')}
        multiple={maxFiles > 1}
        onChange={onInputChange}
      />

      {/* ── Previews ── */}
      {showPreview && (entries.length > 0 || existingFiles.length > 0) && (
        <div className="flex flex-wrap gap-2">

          {/* Archivos existentes (ya guardados) */}
          {existingFiles.map((ef, i) => (
            <div key={`exist-${i}`} className="relative group w-20 h-20 rounded-[10px] overflow-hidden border border-[#e4e4e7] bg-[#fafafa]">
              <Image src={ef.url} alt={ef.name} fill className="object-cover object-center" sizes="80px" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px] font-[700] px-1 text-center leading-tight line-clamp-2">{ef.name}</span>
              </div>
            </div>
          ))}

          {/* Archivos nuevos */}
          {entries.map((entry, i) => (
            <div key={i} className={`relative group w-20 h-20 rounded-[10px] overflow-hidden border flex-shrink-0 ${entry.error ? 'border-[#fca5a5] bg-[#fef2f2]' : 'border-[#e4e4e7] bg-[#fafafa]'}`}>
              {entry.preview ? (
                <Image src={entry.preview} alt={entry.file.name} fill className="object-cover" sizes="80px" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1">
                  <span className="material-symbols-outlined text-[#a1a1aa]" style={{ fontSize: 24 }}>description</span>
                  <span className="text-[9px] text-[#71717a] text-center font-[600] leading-tight line-clamp-2">{entry.file.name}</span>
                </div>
              )}

              {/* Tooltip de error */}
              {entry.error && (
                <div className="absolute inset-0 bg-[#fef2f2]/90 flex items-center justify-center p-1">
                  <span className="text-[#b91c1c] text-[9px] font-[800] text-center leading-tight">{entry.error}</span>
                </div>
              )}

              {/* Botón eliminar */}
              <button
                type="button"
                onClick={() => removeEntry(i)}
                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-[#fef2f2]"
              >
                <span className="material-symbols-outlined text-[#71717a]" style={{ fontSize: 12 }}>close</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {helperText && <p className="text-xs text-[#9ca3af] font-[600]">{helperText}</p>}
    </div>
  )
}
