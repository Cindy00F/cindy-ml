export function DeskDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 280 220"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M38 188h204" />
      <path d="M58 188v-44h70v44" />
      <rect x="70" y="118" width="46" height="30" />
      <path d="M78 118v-10h30v10" />
      <circle cx="93" cy="128" r="3" fill="currentColor" stroke="none" />
      <path d="M168 188v-70" />
      <path d="M168 128c18-2 28-18 26-34" />
      <circle cx="196" cy="88" r="12" />
      <path d="M188 98c6 10 16 22 16 36v54" />
      <path d="M204 134h22" />
      <path d="M210 188v-28h28v28" />
      <path d="M224 160v-18" />
      <path d="M214 142c6-16 16-16 22 0" />
      <path d="M218 142c4-8 10-8 14 0" />
      <circle cx="52" cy="150" r="7" />
      <path d="M52 157v18" />
    </svg>
  );
}
