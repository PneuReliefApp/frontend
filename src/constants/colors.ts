/**
 * PneuRelief App - Centralized Color Palette
 *
 * This file contains all color constants used throughout the application.
 * Use these constants to maintain consistent branding and styling.
 */

export const COLORS = {
  // Primary Brand Colors
  primaryBlue: "#10355F",      // Main brand blue (logo, headings)
  lightBlue: "#D1E5F4",        // Light blue for backgrounds
  softBlue: "#E8F4FA",         // Soft blue for gradients
  accentOrange: "#F97316",     // Orange accent (from logo)

  // UI Colors
  white: "#FFFFFF",
  black: "#000000",

  // Purple Accents (for interactive elements)
  accentPurple: "#4F46E5",
  lightPurple: "#EEF2FF",

  // Text Colors
  darkText: "#111827",         // Primary text
  grayText: "#6B7280",         // Secondary text
  lightGray: "#9CA3AF",        // Placeholder text

  // Background Colors
  backgroundGray: "#F9FAFB",   // Light background for inputs
  backgroundLight: "#FFFFFF",

  // Border Colors
  borderGray: "#E5E7EB",       // Borders and dividers
  borderLight: "#D1D5DB",

  // Status Colors
  errorRed: "#EF4444",         // Error messages
  successGreen: "#10B981",     // Success messages
  warningYellow: "#F59E0B",    // Warning messages
  infoBlue: "#3B82F6",         // Info messages
} as const;

// Export individual color groups for convenience
export const BrandColors = {
  primary: COLORS.primaryBlue,
  light: COLORS.lightBlue,
  soft: COLORS.softBlue,
  accent: COLORS.accentOrange,
} as const;

export const TextColors = {
  primary: COLORS.darkText,
  secondary: COLORS.grayText,
  placeholder: COLORS.lightGray,
} as const;

export const StatusColors = {
  error: COLORS.errorRed,
  success: COLORS.successGreen,
  warning: COLORS.warningYellow,
  info: COLORS.infoBlue,
} as const;
