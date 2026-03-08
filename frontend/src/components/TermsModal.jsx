import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function TermsModal() {
  const { user, acceptTerms } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!user || user.acceptedTerms) {
    return null;
  }

  const handleAccept = async () => {
    setSubmitting(true);
    setError("");

    try {
      await acceptTerms();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <p className="panel-kicker">Terminos y condiciones</p>
        <h2>Debes aceptar las condiciones para continuar</h2>
        <p>
          Aceptas publicar contenido propio, respetar el debate civil y no
          reutilizar la plataforma para abuso, acoso o suplantacion.
        </p>
        <button className="primary-action" onClick={handleAccept} disabled={submitting}>
          {submitting ? "Guardando..." : "Aceptar y continuar"}
        </button>
        {error ? <p className="error">{error}</p> : null}
      </div>
    </div>
  );
}
