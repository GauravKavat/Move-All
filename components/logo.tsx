interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

const sizeMap: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
  xl: 'text-5xl',
};

/**
 * "it" is rendered at a fixed smaller size using a negative top offset,
 * enforcing the required visual contrast hierarchy at all resolutions.
 */
const itSizeMap: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'text-[7px]',
  md: 'text-[9px]',
  lg: 'text-[11px]',
  xl: 'text-[14px]',
};

export function Logo({ size = 'md', className = '', showTagline = false }: LogoProps) {
  return (
    <div className={`flex flex-col items-start ${className}`}>
      <div
        className={`flex items-baseline font-black tracking-tight leading-none ${sizeMap[size]}`}
      >
        <span className="text-white">weMOVE</span>
        <span
          className={`${itSizeMap[size]} font-medium tracking-normal text-[#f37a2a] relative -top-[0.35em] px-[0.15em]`}
        >
          it
        </span>
        <span className="text-white">ALL</span>
      </div>
      {showTagline && (
        <p className="text-[#EDEDDF]/40 font-mono text-[9px] tracking-widest uppercase mt-0.5">
          Multi-Tenant Logistics Platform
        </p>
      )}
    </div>
  );
}
