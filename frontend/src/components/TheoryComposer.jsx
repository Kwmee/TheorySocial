import { useState } from "react";

const initialState = {
  title: "",
  content: "",
};

export function TheoryComposer({ onSubmit }) {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");

    try {
      await onSubmit(form);
      setForm(initialState);
      setFeedback("Teoria publicada correctamente.");
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel social-panel composer-panel">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Nueva publicacion</p>
          <h2>Comparte una teoria con contexto</h2>
        </div>
      </div>

      <form className="stack" onSubmit={handleSubmit}>
        <label>
          Titulo
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={180}
            placeholder="Ej. La cooperacion nace del relato compartido"
            required
          />
        </label>
        <label>
          Desarrollo
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows="8"
            placeholder="Explica la hipotesis, contexto y argumentos centrales."
            required
          />
        </label>

        <div className="composer-hints">
          <span className="pill subtle">Consejo: menciona el tema principal</span>
          <span className="pill subtle">Ej.: confianza, identidad, poder</span>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Publicando..." : "Publicar teoria"}
        </button>
        {feedback ? <p className="feedback">{feedback}</p> : null}
      </form>
    </section>
  );
}
