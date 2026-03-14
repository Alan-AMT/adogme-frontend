// modules/shared/domain/Donation.ts
// Entidad Donacion — basada en tabla Donacion del diagrama ER
// Tabla: id, adoptante_id, refugio_id, monto, metodoPago, fecha, confirmado

// ─── Métodos de pago ─────────────────────────────────────────────────────────

export type PaymentMethod =
  | 'tarjeta'       // Stripe card
  | 'paypal'
  | 'transferencia' // SPEI / wire
  | 'efectivo'      // pago en refugio

export type DonationStatus = 'pending' | 'confirmed' | 'failed' | 'refunded'

// ─── Entidad completa ─────────────────────────────────────────────────────────

export interface Donation {
  id: number
  adoptanteId: number      // FK → Adoptante (del diagrama)
  refugioId: number        // FK → Refugio (del diagrama)
  monto: number            // float del diagrama — en MXN
  metodoPago: PaymentMethod // varchar del diagrama
  fecha: string            // ISO date del diagrama
  confirmado: boolean      // boolean del diagrama

  // Campos enriquecidos
  status: DonationStatus   // derivado de confirmado + lógica de error
  transactionId?: string   // ID de Stripe / PayPal
  concepto?: string        // mensaje libre del donante
  esAnonima: boolean

  // Datos relacionados (joins — para recibos y listados)
  refugioNombre?: string
  refugioLogo?: string
  adoptanteNombre?: string
}

// ─── Configuración del refugio para recibir donaciones ───────────────────────

export interface DonationConfig {
  aceptaDonaciones: boolean
  descripcionCausa?: string    // texto que aparece en la página de donación
  cuentaClabe?: string         // CLABE interbancaria (18 dígitos)
  banco?: string               // nombre del banco de la cuenta CLABE
  titularCuenta?: string       // nombre del titular de la cuenta
  paypalLink?: string          // URL directa de PayPal.me o pago
  mercadoPagoLink?: string     // URL de MercadoPago (link de cobro)
}

