// modules/shared/domain/Donation.ts

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
