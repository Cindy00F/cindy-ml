export function BrandMark({
  className = "size-9",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="12" className="fill-primary" />
      <path
        d="M10 32c6-10 10-10 14 0s8 10 14 0"
        className="stroke-primary-foreground"
        fill="none"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="16" cy="22" r="2.2" className="fill-primary-foreground" />
      <circle cx="24" cy="18" r="2.2" className="fill-primary-foreground" />
      <circle cx="33" cy="23" r="2.2" className="fill-primary-foreground" />
    </svg>
  );
}
