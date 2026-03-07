import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const initialSignup = {
  username: "",
  email: "",
  password: "",
};

const initialLogin = {
  username: "",
  password: "",
};

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

  const activeForm = mode === "login" ? loginForm : signupForm;
  const setActiveForm = mode === "login" ? setLoginForm : setSignupForm;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setActiveForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="fullscreen-state auth-screen">
      <section className="auth-hero">
        <p className="brand-mark">Theory Social</p>
        <h1>Acceso privado para debatir teorias humanas.</h1>
        <p>
          Todo el contenido de la red social queda bloqueado hasta que exista una
          sesion valida.
        </p>
      </section>

      <section className="panel auth-panel">
        <div className="auth-tabs">
          <button
            className={mode === "login" ? "tab active" : "tab"}
            onClick={() => setMode("login")}
            type="button"
          >
            Iniciar sesion
          </button>
          <button
            className={mode === "signup" ? "tab active" : "tab"}
            onClick={() => setMode("signup")}
            type="button"
          >
            Registrarse
          </button>
        </div>

        <form className="stack" onSubmit={handleSubmit}>
          <label>
            Usuario
            <input
              name="username"
              value={activeForm.username}
              onChange={handleChange}
              minLength={3}
              required
            />
          </label>

          {mode === "signup" ? (
            <label>
              Email
              <input
                name="email"
                type="email"
                value={signupForm.email}
                onChange={handleChange}
                required
              />
            </label>
          ) : null}

          <label>
            Contrasena
            <input
              name="password"
              type="password"
              value={activeForm.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </label>

          <button type="submit" disabled={submitting}>
            {submitting
              ? "Procesando..."
              : mode === "login"
                ? "Entrar"
                : "Crear cuenta"}
          </button>
          {error ? <p className="error">{error}</p> : null}
        </form>
      </section>
    </div>
  );
}
