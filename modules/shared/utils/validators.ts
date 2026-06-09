export const PERSON_NAME_RE =
  /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const POSTAL_CODE_RE = /^\d{5}$/;
export const ADDRESS_RE =
  /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .,#'°º/-]{8,180}$/;
export const SHELTER_NAME_RE =
  /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .,'&()/-]{3,80}$/;
export const DOG_NAME_RE =
  /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .'-]{2,60}$/;
export const SIMPLE_TEXT_RE =
  /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .,:;¿?¡!'"()#°º%&/-]+$/;
export const SCHEDULE_RE =
  /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .,:;()/-]{3,80}$/;
export const CLABE_RE = /^\d{18}$/;

export function normalizeMxPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("52")
    ? digits.slice(2)
    : digits;
}

export function isValidMxPhone(phone: string): boolean {
  const normalized = normalizeMxPhone(phone);
  return /^\d{10}$/.test(normalized) && !/^(\d)\1{9}$/.test(normalized);
}

export function isValidPersonName(value: string): boolean {
  return PERSON_NAME_RE.test(value.trim());
}

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isValidPostalCode(value: string): boolean {
  return POSTAL_CODE_RE.test(value.trim());
}

export function isValidAddress(value: string): boolean {
  return ADDRESS_RE.test(value.trim());
}

export function isValidShelterName(value: string): boolean {
  return SHELTER_NAME_RE.test(value.trim());
}

export function isValidDogName(value: string): boolean {
  return DOG_NAME_RE.test(value.trim());
}

export function isValidSimpleText(value: string): boolean {
  return SIMPLE_TEXT_RE.test(value.trim());
}

export function isValidSchedule(value: string): boolean {
  return SCHEDULE_RE.test(value.trim());
}

export function isValidOptionalEmail(value: string): boolean {
  return !value.trim() || isValidEmail(value);
}

export function isValidOptionalUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;

  try {
    const parsed = new URL(
      /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`,
    );
    return ["http:", "https:"].includes(parsed.protocol) && !!parsed.hostname;
  } catch {
    return false;
  }
}

export function isValidSocialReference(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (/^@[A-Za-z0-9._]{2,30}$/.test(trimmed)) return true;
  return isValidOptionalUrl(trimmed);
}

export function isValidClabe(value: string): boolean {
  return CLABE_RE.test(value.replace(/\s/g, ""));
}

export function isValidMoneyAmount(value: string, max = 100000): boolean {
  if (!value.trim()) return true;
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 && amount <= max;
}

export function isValidDogAgeMonths(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 300;
}

export function isValidDogWeightKg(value: number | undefined): boolean {
  if (value === undefined) return true;
  return Number.isFinite(value) && value >= 0.5 && value <= 100;
}

export function isStrongPassword(value: string): boolean {
  return (
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
}
