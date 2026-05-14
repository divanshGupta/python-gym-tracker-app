// packages/tailwind-config/tokens.d.ts
export declare const tokens: {
  readonly colors: {
    readonly accent:         string;
    readonly accentLight:    string;
    readonly accentSubtle:   string;
    readonly void:           string;
    readonly surface:        string;
    readonly elevated:       string;
    readonly offWhite:       string;
    readonly textPrimary:    string;
    readonly textSecondary:  string;
    readonly textTertiary:   string;
    readonly borderDefault:  string;
    readonly borderStrong:   string;
    readonly success:        string;
    readonly danger:         string;
    readonly warning:        string;
  };
  readonly radius: {
    readonly xs:   number;
    readonly sm:   number;
    readonly md:   number;
    readonly lg:   number;
    readonly xl:   number;
    readonly full: number;
  };
  readonly spacing: {
    readonly 1:  number;
    readonly 2:  number;
    readonly 3:  number;
    readonly 4:  number;
    readonly 5:  number;
    readonly 6:  number;
    readonly 8:  number;
    readonly 10: number;
    readonly 12: number;
    readonly 16: number;
  };
  readonly fontSize: {
    readonly "2xs": number;
    readonly xs:    number;
    readonly sm:    number;
    readonly base:  number;
    readonly md:    number;
    readonly lg:    number;
    readonly xl:    number;
    readonly "2xl": number;
  };
};

export type Tokens = typeof tokens;

// Also export what tokens.js exports via module.exports
export declare const colors:     Record<string, string>;
export declare const fontFamily: { sans: string[] };
export declare const radius:     Record<string, string>;
export declare const spacing:    Record<string, string>;
export declare const fontSize:   Record<string, unknown>;