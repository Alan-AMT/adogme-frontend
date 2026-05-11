// modules/shared/components/ui/FileUpload.tsx
'use client'

import Image from 'next/image';
import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { toast } from 'sonner';

interface ExistingFile { url: string; name: string }

/** Una imagen elegida por el usuario. La URL se crea UNA sola vez al agregar
 *  el archivo y vive en el state del padre — así sobrevive a unmounts del
 *  componente y `<Image>` puede pintarla siempre.
 */
export interface UploadedFile {
  file: File
  url:  string
}

interface FileUploadProps {
  accept:         string[]      // e.g. ['image/*'] or ['image/*', '.pdf']
  maxFiles:       number
  maxSizeMB:      number
  /** Lista controlada por el padre. */
  files:          UploadedFile[]
  onFilesChange:  (files: UploadedFile[]) => void
  existingFiles?: ExistingFile[]
  disabled?:      boolean
  showPreview?:   boolean
  variant?:       'dropzone' | 'button'
  label?:         string
  helperText?:    string
}

export function FileUpload({
  accept, maxFiles, maxSizeMB,
  files, onFilesChange,
  existingFiles = [], disabled, showPreview = true,
  variant = 'dropzone', label, helperText,
}: FileUploadProps) {
  const [isDragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isTypeAccepted = (file: File) =>
    accept.some(a =>
      a === '*' || file.type.match(a.replace('*', '.*')) || file.name.endsWith(a)
    )

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const remaining = maxFiles - files.length - existingFiles.length
    if (remaining <= 0) return

    const arr = Array.from(newFiles).slice(0, remaining)
    const validSlots: UploadedFile[] = []
    let oversized = 0
    let badType   = 0

    for (const file of arr) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        oversized++
        continue
      }
      if (!isTypeAccepted(file)) {
        badType++
        continue
      }
      validSlots.push({ file, url: URL.createObjectURL(file) })
    }

    if (oversized > 0) {
      toast.error(
        oversized === 1
          ? `Esta imagen es mayor a ${maxSizeMB} MB, comprímela primero`
          : `${oversized} imágenes superan ${maxSizeMB} MB. Comprímelas primero.`,
        { duration: 5000 },
      )
    }
    if (badType > 0) {
      toast.error(
        badType === 1
          ? 'Tipo de archivo no permitido'
          : `${badType} archivos no son del tipo permitido`,
        { duration: 4500 },
      )
    }

    if (validSlots.length === 0) return
    onFilesChange([...files, ...validSlots])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, existingFiles.length, maxFiles, maxSizeMB, accept, onFilesChange])

  const removeAt = (i: number) => {
    const slot = files[i]
    if (!slot) return
    try { URL.revokeObjectURL(slot.url) } catch { /* noop */ }
    onFilesChange(files.filter((_, idx) => idx !== i))
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

  const canAdd = files.length + existingFiles.length < maxFiles

  return (
    <div className="flex flex-col gap-3">
      {label && <p className="text-[13px] font-medium text-[#374151]">{label}</p>}

      {/* ── Dropzone ── */}
      {variant === 'dropzone' && canAdd && (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => !disabled && inputRef.current?.click()}
          className={[
            'border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2',
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
          <p className="text-sm font-extrabold text-[#3f3f46]">
            Arrastra tus archivos aquí <span className="text-[#a1a1aa] font-semibold">o haz clic para seleccionar</span>
          </p>
          <p className="text-xs text-[#a1a1aa] font-semibold">
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
                     bg-white text-sm font-extrabold text-[#3f3f46] hover:border-[#ff6b6b] hover:text-[#ff6b6b]
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
      {showPreview && (files.length > 0 || existingFiles.length > 0) && (
        <div className="flex flex-wrap gap-2">

          {/* Archivos existentes (ya guardados) */}
          {existingFiles.map((ef, i) => (
            <div key={`exist-${i}`} className="relative group w-20 h-20 rounded-[10px] overflow-hidden border border-[#e4e4e7] bg-[#fafafa]">
              <Image src={ef.url} alt={ef.name} fill className="object-cover object-center" sizes="80px" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px] font-bold px-1 text-center leading-tight line-clamp-2">{ef.name}</span>
              </div>
            </div>
          ))}

          {/* Archivos nuevos — la URL persiste con la data, así que <Image>
              renderiza correctamente incluso después de unmount/remount. */}
          {files.map((slot, i) => (
            <div
              key={slot.url}
              className="relative w-20 h-20 rounded-[10px] overflow-hidden border shrink-0 border-[#e4e4e7] bg-[#fafafa]"
            >
              <Image
                src={slot.url}
                alt={slot.file.name}
                fill
                className="object-cover"
                sizes="80px"
                unoptimized
              />

              {/* Botón eliminar — siempre visible, no requiere hover */}
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label={`Eliminar ${slot.file.name}`}
                className="absolute top-1 right-1 w-5.5 h-5.5 rounded-full bg-black/55 hover:bg-black/75
                           flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-white" style={{ fontSize: 14 }}>close</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {helperText && <p className="text-xs text-[#9ca3af] font-semibold">{helperText}</p>}
    </div>
  )
}
