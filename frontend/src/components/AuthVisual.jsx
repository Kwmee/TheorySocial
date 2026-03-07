export function AuthVisual() {
  return (
    <div className="auth-visual" aria-hidden="true">
      <svg
        className="auth-visual-svg"
        viewBox="0 0 640 720"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="panelGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3e6ff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#a66eff" stopOpacity="0.28" />
          </linearGradient>
          <linearGradient id="cardFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3d225d" />
            <stop offset="100%" stopColor="#170a27" />
          </linearGradient>
          <radialGradient id="portraitGlow" cx="50%" cy="38%" r="58%">
            <stop offset="0%" stopColor="#ffefff" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#ca95ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#12051a" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="88" y="96" width="464" height="528" rx="36" fill="url(#cardFill)" />
        <rect
          x="88"
          y="96"
          width="464"
          height="528"
          rx="36"
          fill="none"
          stroke="url(#panelGlow)"
          strokeOpacity="0.45"
        />

        <circle cx="320" cy="236" r="134" fill="url(#portraitGlow)" />
        <path
          d="M246 370c22-50 59-73 102-73 44 0 82 23 105 73 18 38 24 80 24 116H220c0-36 8-78 26-116Z"
          fill="#f0ddff"
          fillOpacity="0.93"
        />
        <circle cx="320" cy="244" r="86" fill="#f6ecff" fillOpacity="0.94" />
        <path
          d="M246 245c0-57 33-104 74-104 62 0 112 47 112 104 0 35-11 57-28 74-12-18-30-28-57-28-26 0-48 10-65 28-23-21-36-43-36-74Z"
          fill="#2b153f"
        />
        <path
          d="M236 492h168c24 0 44 20 44 44v24H192v-24c0-24 20-44 44-44Z"
          fill="#231132"
          fillOpacity="0.88"
        />
        <rect x="356" y="184" width="132" height="112" rx="22" fill="#f7eeff" fillOpacity="0.96" />
        <rect x="376" y="206" width="72" height="10" rx="5" fill="#ad72ff" />
        <rect x="376" y="232" width="90" height="10" rx="5" fill="#d4b4ff" fillOpacity="0.72" />
        <rect x="376" y="258" width="56" height="10" rx="5" fill="#d4b4ff" fillOpacity="0.72" />
        <rect x="144" y="182" width="122" height="92" rx="22" fill="#241136" fillOpacity="0.96" />
        <rect x="164" y="204" width="58" height="10" rx="5" fill="#f4e7ff" fillOpacity="0.95" />
        <rect x="164" y="230" width="74" height="10" rx="5" fill="#8f5ae3" />
        <rect x="164" y="252" width="50" height="10" rx="5" fill="#a57adb" fillOpacity="0.78" />
        <circle cx="516" cy="474" r="56" fill="#a469ff" fillOpacity="0.18" />
        <circle cx="144" cy="552" r="42" fill="#ffffff" fillOpacity="0.08" />
      </svg>

      <div className="auth-photo-caption">
        <strong>Curaduria visual</strong>
        <span>Una portada editorial para una red privada de ideas humanas.</span>
      </div>
    </div>
  );
}
