import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Devuelve un color de texto legible (claro u oscuro) para un fondo dado en hex.
// Se usa para las etiquetas, cuyo fondo es el color elegido por el usuario.
export function readableTextColor(hex: string): string {
  const clean = (hex || '').replace('#', '').trim()
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean

  if (full.length !== 6 || /[^0-9a-fA-F]/.test(full)) return '#151B35'

  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)

  // Luminancia relativa (WCAG)
  const lin = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)

  // Con L > 0.5 el texto oscuro siempre contrasta mucho más que el blanco
  // (p. ej. amarillo #F5C35B); el naranja de marca (L≈0.29) sigue con blanco.
  return L > 0.5 ? '#151B35' : '#FFFFFF'
}
