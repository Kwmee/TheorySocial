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
  const [mode, setMode] = useState("login");
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
    <div className="auth-landing auth-landing-editorial">
      <div className="auth-aurora auth-aurora-left" aria-hidden="true" />
      <div className="auth-aurora auth-aurora-right" aria-hidden="true" />

      <main className="auth-layout auth-layout-editorial">
        <section className="auth-story">
          <div className="auth-hero-panel auth-hero-editorial">
            <div className="auth-hero-copy">
              <p className="brand-mark">{landingContent.hero.eyebrow}</p>
              <span className="hero-badge">Red privada para teorias humanas</span>
              <h1>Una portada con criterio para una comunidad de ideas complejas.</h1>
              <p className="auth-lead">
                Theory Social presenta, ordena y debate teorias humanas en un
                entorno protegido. No enseña el contenido real sin sesion valida,
                pero deja claro el valor: contexto, autoria y trazabilidad.
              </p>

              <div className="hero-actions">
                <button onClick={() => setMode("signup")} type="button">
                  Crear cuenta
                </button>
                <button
                  className="ghost-button"
                  onClick={() => setMode("login")}
                  type="button"
                >
                  Iniciar sesion
                </button>
              </div>
            </div>

            <AuthVisual />

            <div className="hero-metrics hero-metrics-wide">
              {landingContent.hero.metrics.map((metric) => (
                <article className="metric-card" key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </article>
              ))}
            </div>
          </div>

          <section className="auth-section">
            <div className="section-head auth-section-head">
              <div>
                <p className="panel-kicker">Ventajas de entrada</p>
                <h2>Se siente como una red social, pero empieza con una base controlada.</h2>
              </div>
            </div>

            <div className="feature-grid">
              {landingContent.features.map((feature) => (
                <article className="feature-card" key={feature.title}>
                  <div className="feature-icon" aria-hidden="true" />
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="auth-section auth-showcase">
            <div className="section-head auth-section-head">
              <div>
                <p className="panel-kicker">Vista previa de actividad</p>
                <h2>Ejemplos visuales de publicacion, respuesta y sintesis.</h2>
              </div>
              <span className="pill subtle">Solo ejemplos ilustrativos</span>
            </div>

            <div className="showcase-grid">
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

            <div className="journey-panel">
              <div>
                <p className="panel-kicker">Ciclo social</p>
                <h3>La plataforma esta preparada para descubrir temas, publicar y refinar ideas.</h3>
              </div>

              <ol className="journey-list">
                {landingContent.timeline.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </section>
        </section>

        <aside className="panel auth-panel auth-panel-premium">
          <div className="auth-panel-top">
            <div>
              <p className="panel-kicker">Acceso seguro</p>
              <h2>{mode === "login" ? "Vuelve a la comunidad" : "Solicita tu entrada"}</h2>
            </div>
            <p className="auth-panel-copy">
              {mode === "login"
                ? "Recupera tu espacio de trabajo y tus debates guardados."
                : "Crea una cuenta y accede a una experiencia privada donde las teorias se organizan por temas."}
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
                El contenido autentico permanece bloqueado hasta iniciar sesion
                y aceptar terminos dentro de la plataforma.
              </p>
            </div>

            <button type="submit" disabled={submitting}>
              {submitting
                ? "Procesando..."
                : mode === "login"
                  ? "Entrar ahora"
                  : "Crear acceso"}
            </button>
            {error ? <p className="error">{error}</p> : null}
          </form>
        </aside>
      </main>
    </div>
  );
}
