import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthVisual } from "../components/AuthVisual";
import { useAuth } from "../hooks/useAuth";
import { getAuthLandingContent } from "../services/authLandingContent";

const initialSignup = {
  username: "",
  email: "",
  password: "",
};

const initialLogin = {
  username: "",
  password: "",
};

const landingContent = getAuthLandingContent();

export function AuthPage() {
  const { isAuthenticated, login, signup } = useAuth();
  const location = useLocation();
  const [mode, setMode] = useState(location.state?.from ? "login" : "signup");
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [signupForm, setSignupForm] = useState(initialSignup);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname ?? "/";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const activeForm = mode === "login" ? loginForm : signupForm;
  const setActiveForm = mode === "login" ? setLoginForm : setSignupForm;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setActiveForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (mode === "login") {
        await login(loginForm);
      } else {
        await signup(signupForm);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <header className="auth-topbar">
        <div className="header-brand-block">
          <p className="brand-mark">Theory Social</p>
          <h2 className="landing-header-title">Teorias Humanas</h2>
          <p className="header-subcopy">
            Debate privado, interfaz limpia y acceso protegido por sesion.
          </p>
        </div>
      </header>

      <main className="auth-page-grid">
        <section className="auth-story-panel">
          <div className="auth-story-copy">
            <span className="hero-badge">Estetica social, debate serio</span>
            <h1>{landingContent.hero.title}</h1>
            <p className="auth-lead">{landingContent.hero.description}</p>
          </div>

          <div className="auth-metric-row">
            {landingContent.hero.metrics.map((metric) => (
              <article className="metric-card" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>

          <AuthVisual />

          <div className="auth-feature-grid">
            {landingContent.features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-icon" aria-hidden="true" />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>

          <div className="auth-showcase-grid">
            {landingContent.examples.map((example) => (
              <article className="showcase-card" key={example.title}>
                <span className="showcase-category">{example.category}</span>
                <h3>{example.title}</h3>
                <p>{example.excerpt}</p>
                <footer className="showcase-footer">
                  <strong>{example.author}</strong>
                  <div className="showcase-stats">
                    {example.stats.map((stat) => (
                      <span key={stat}>{stat}</span>
                    ))}
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </section>

        <aside className="auth-access-panel">
          <div className="auth-panel-top">
            <div>
              <p className="panel-kicker">Acceso</p>
              <h2>{mode === "login" ? "Vuelve a tu feed" : "Crea tu acceso privado"}</h2>
            </div>
            <p className="auth-panel-copy">
              Una sola puerta de entrada para login y registro. Sin modales duplicados ni pasos
              paralelos.
            </p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Acciones de acceso">
            <button
              aria-selected={mode === "login"}
              className={mode === "login" ? "tab active" : "tab"}
              onClick={() => setMode("login")}
              type="button"
            >
              Iniciar sesion
            </button>
            <button
              aria-selected={mode === "signup"}
              className={mode === "signup" ? "tab active" : "tab"}
              onClick={() => setMode("signup")}
              type="button"
            >
              Registrarse
            </button>
          </div>

          <form className="stack auth-form" onSubmit={handleSubmit}>
            <label>
              Usuario
              <input
                name="username"
                onChange={handleChange}
                placeholder="Tu identificador publico"
                value={activeForm.username}
                minLength={3}
                required
              />
            </label>

            {mode === "signup" ? (
              <label>
                Correo
                <input
                  name="email"
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                  type="email"
                  value={signupForm.email}
                  required
                />
              </label>
            ) : null}

            <label>
              Contrasena
              <input
                name="password"
                onChange={handleChange}
                placeholder="Minimo 8 caracteres"
                type="password"
                value={activeForm.password}
                minLength={8}
                required
              />
            </label>

            <div className="auth-form-meta">
              <span className="status-dot" aria-hidden="true" />
              <p>
                El contenido real permanece bloqueado hasta iniciar sesion y aceptar terminos
                dentro de la plataforma.
              </p>
            </div>

            <button type="submit" className="primary-action" disabled={submitting}>
              {submitting
                ? "Procesando..."
                : mode === "login"
                  ? "Entrar ahora"
                  : "Crear acceso"}
            </button>
            {error ? <p className="error">{error}</p> : null}
          </form>

          <ol className="journey-list auth-journey-list">
            {landingContent.timeline.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </aside>
      </main>
    </div>
  );
}
