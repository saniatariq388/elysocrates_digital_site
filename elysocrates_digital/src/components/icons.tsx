type IconProps = { className?: string };

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect
        x="3.2"
        y="3.2"
        width="17.6"
        height="17.6"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.1" cy="6.9" r="1.15" fill="currentColor" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.53 3h2.97l-6.49 7.42L21.5 21h-5.86l-4.59-6-5.25 6H2.8l6.94-7.94L2.5 3h6.01l4.15 5.48L17.53 3Zm-1.03 16.2h1.65L7.6 4.7H5.83l10.67 14.5Z" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M13.5 21v-7h2.4l.36-2.8H13.5V9.4c0-.81.22-1.36 1.38-1.36h1.47V5.55c-.25-.03-1.13-.11-2.15-.11-2.12 0-3.57 1.3-3.57 3.68v2.08H8.2V14h2.43v7h2.87Z" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M6.94 8.5H4V20h2.94V8.5ZM5.47 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 13.1c0-3.02-1.61-4.42-3.76-4.42-1.73 0-2.51.95-2.94 1.62V8.5H10.4V20h2.94v-6.13c0-1.62.75-2.58 2.12-2.58 1.32 0 1.66.94 1.66 2.65V20H20v-6.9Z" />
    </svg>
  );
}

export function LinkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M10.6 13.4a4 4 0 0 0 5.66 0l2.83-2.83a4 4 0 1 0-5.66-5.66L11.9 6.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M13.4 10.6a4 4 0 0 0-5.66 0l-2.83 2.83a4 4 0 1 0 5.66 5.66l1.53-1.53"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M5.5 5.5l13 13M18.5 5.5l-13 13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
