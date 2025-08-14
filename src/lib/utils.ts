import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the correct path for static assets considering the base URL
 * @param path - The path relative to the public directory (e.g., 'images/logo.png')
 * @returns The full path with base URL
 */
export function getAssetPath(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`
}
