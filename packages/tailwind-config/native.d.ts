export interface TokenColors {
  accent: string;
  warning: string;
  background: string;
  surface: string;
  borderDefault: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  elevated: string;
  [key: string]: string;
}

export interface Tokens {
  colors: TokenColors;
  spacing: Record<string, string | number>;
  [key: string]: any;
}

declare const tokensData: {
  tokens: Tokens;
};

export default tokensData;