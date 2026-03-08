export function AuthVisual() {
  return (
    <div className="auth-visual" aria-hidden="true">
      <svg
        className="auth-visual-svg"
        viewBox="0 0 640 720"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="igFrame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#feda75" />
            <stop offset="35%" stopColor="#fa7e1e" />
            <stop offset="68%" stopColor="#d62976" />
            <stop offset="100%" stopColor="#962fbf" />
          </linearGradient>
          <linearGradient id="igCard" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.68)" />
          </linearGradient>
          <radialGradient id="igGlow" cx="50%" cy="38%" r="58%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96" />
            <stop offset="45%" stopColor="#f8b8cf" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="86" y="94" width="468" height="532" rx="44" fill="url(#igFrame)" opacity="0.22" />
        <rect x="104" y="112" width="432" height="496" rx="34" fill="url(#igCard)" />
        <rect
          x="104"
          y="112"
          width="432"
          height="496"
          rx="34"
          fill="none"
          stroke="url(#igFrame)"
          strokeOpacity="0.45"
        />

        <circle cx="320" cy="246" r="136" fill="url(#igGlow)" />
        <circle cx="320" cy="244" r="90" fill="#fff8fb" />
        <path
          d="M248 252c0-62 36-114 82-114 67 0 118 52 118 114 0 34-13 58-34 80-14-19-36-31-66-31-29 0-52 11-69 31-21-21-31-45-31-80Z"
          fill="#2c173d"
        />
        <path
          d="M236 378c25-48 62-72 104-72s80 24 104 72c20 39 28 82 28 122H208c0-40 9-83 28-122Z"
          fill="#fff4fa"
        />

        <rect x="144" y="178" width="122" height="98" rx="24" fill="#ffffff" fillOpacity="0.9" />
        <rect x="162" y="200" width="58" height="10" rx="5" fill="#962fbf" />
        <rect x="162" y="225" width="78" height="10" rx="5" fill="#d62976" fillOpacity="0.72" />
        <rect x="162" y="250" width="52" height="10" rx="5" fill="#fa7e1e" fillOpacity="0.76" />

        <rect x="372" y="182" width="118" height="108" rx="24" fill="#ffffff" fillOpacity="0.94" />
        <rect x="392" y="206" width="62" height="10" rx="5" fill="#d62976" />
        <rect x="392" y="232" width="74" height="10" rx="5" fill="#962fbf" fillOpacity="0.72" />
        <rect x="392" y="258" width="48" height="10" rx="5" fill="#feda75" fillOpacity="0.88" />

        <rect x="184" y="522" width="272" height="18" rx="9" fill="#ffffff" fillOpacity="0.45" />
        <circle cx="500" cy="494" r="54" fill="#d62976" fillOpacity="0.16" />
        <circle cx="156" cy="550" r="42" fill="#fa7e1e" fillOpacity="0.14" />
      </svg>

      <div className="auth-photo-caption">
        <strong>Entrada curada</strong>
        <span>Una interfaz social mas limpia para ideas complejas y debates con contexto.</span>
      </div>
    </div>
  );
}
