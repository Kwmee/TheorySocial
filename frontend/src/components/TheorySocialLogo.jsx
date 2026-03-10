export function TheorySocialLogo({ className = "" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <linearGradient id="theory-social-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fa7e1e" />
          <stop offset="50%" stopColor="#d62976" />
          <stop offset="100%" stopColor="#962fbf" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="18" fill="url(#theory-social-logo-gradient)" />
      <path
        d="M20 22h24v6H35v20h-6V28h-9z"
        fill="#fff"
      />
      <circle cx="46" cy="18" r="4" fill="#fff" fillOpacity="0.82" />
    </svg>
  );
}
