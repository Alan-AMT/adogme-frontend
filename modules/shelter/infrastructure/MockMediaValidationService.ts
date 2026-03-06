// modules/shelter/infrastructure/MockMediaValidationService.ts
// Archivo 169 — Servicio mock de validación de imágenes de perros.
//
// Simula la respuesta de un microservicio de Computer Vision:
// 2s de espera → 90% válida / 10% error de detección.
//
// Para conectar la validación real: reemplazar el body de validate()
// por: const form = new FormData(); form.append('file', file)
//      return fetch('/api/media/validate', { method: 'POST', body: form }).then(r => r.json())

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface ValidationResult {
  valid:   boolean
  reason?: string   // solo presente cuando valid === false
}

export interface IMediaValidationService {
  validate(file: File): Promise<ValidationResult>
}

// ─── Implementación mock ──────────────────────────────────────────────────────

export class MockMediaValidationService implements IMediaValidationService {
  async validate(_file: File): Promise<ValidationResult> {
    // Simula latencia del microservicio de CV
    await new Promise<void>((r) => setTimeout(r, 2000))

    if (Math.random() < 0.9) {
      return { valid: true }
    }

    return {
      valid:  false,
      reason: 'No se detectó un canino en la imagen. Verifica que la foto muestre claramente al perro.',
    }
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────

export const mediaValidationService: IMediaValidationService = new MockMediaValidationService()
