interface InstitutionLogoProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  accentHex: string;
  isDark: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

/**
 * Renders an official institution logo via CSS alpha masking so its color
 * harmonizes directly with the active chapter's background and accent palette
 * while maintaining high editorial contrast over the sculpted 3D silk backdrop.
 */
export function InstitutionLogo({
  src,
  alt,
  width,
  height,
  accentHex,
  isDark,
  align = 'center',
  className = '',
}: InstitutionLogoProps) {
  const harmonicTint = isDark
    ? `color-mix(in srgb, ${accentHex} 22%, #f8fafc)`
    : `color-mix(in srgb, ${accentHex} 30%, #0f172a)`;

  const maskPosition =
    align === 'right' ? 'right center' : align === 'left' ? 'left center' : 'center center';

  const shadowFilter = isDark
    ? 'drop-shadow(0 14px 32px rgba(0, 0, 0, 0.52))'
    : 'drop-shadow(0 8px 22px rgba(244, 239, 230, 0.72))';

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ filter: shadowFilter }}
    >
      <span
        role="img"
        aria-label={`${alt} logo`}
        data-testid="trajectory-institution-logo"
        className="inline-block transition-colors duration-300 max-w-full"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: harmonicTint,
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskPosition: maskPosition,
          maskPosition,
        }}
      />
    </span>
  );
}
