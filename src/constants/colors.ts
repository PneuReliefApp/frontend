export const COLORS = {
  primaryBlue: "#10355F",      
  lightBlue: "#D1E5F4",        
  softBlue: "#E8F4FA",         
  accentOrange: "#F97316",     


  white: "#FFFFFF",
  black: "#000000",


  accentPurple: "#4F46E5",
  lightPurple: "#EEF2FF",

  
  darkText: "#111827",         
  grayText: "#6B7280",         
  lightGray: "#9CA3AF",        


  backgroundGray: "#F9FAFB",   
  backgroundLight: "#FFFFFF",


  borderGray: "#E5E7EB",       
  borderLight: "#D1D5DB",

  
  errorRed: "#EF4444",        
  successGreen: "#10B981",    
  warningYellow: "#F59E0B",   
  infoBlue: "#3B82F6",        
} as const;

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
