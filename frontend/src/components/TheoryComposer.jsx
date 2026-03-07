import { useState } from "react";

const initialState = {
  authorId: "1",
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
      await onSubmit({
        ...form,
        authorId: Number(form.authorId),
      });
      setForm(initialState);
      setFeedback("Teoria publicada.");
    } catch (error) {
      setFeedback("No se pudo publicar la teoria.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel">
      <h2>Publicar teoria</h2>
      <form className="stack" onSubmit={handleSubmit}>
        <label>
          Autor ID
          <input
            name="authorId"
            value={form.authorId}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Titulo
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={180}
            required
          />
        </label>
        <label>
          Contenido
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows="7"
            required
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? "Publicando..." : "Publicar"}
        </button>
        {feedback ? <p className="feedback">{feedback}</p> : null}
      </form>
    </section>
  );
}
