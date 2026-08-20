import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addThread } from '../../states/threads/threadsSlice';
import './NewThreadPage.css';

function NewThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', category: '', body: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const isLoading = useSelector((state) => state.loading.count > 0);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const result = await dispatch(addThread({
      title: form.title.trim(),
      body: form.body.trim(),
      category: form.category.trim() || 'umum',
    }));
    setIsSubmitting(false);

    if (addThread.fulfilled.match(result)) {
      navigate(`/threads/${result.payload.id}`);
    } else {
      setError(result.error?.message || 'Gagal membuat thread.');
    }
  }

  return (
    <div className="new-thread-page">
      <h1>Mulai thread baru</h1>
      <p className="new-thread-page__subtitle">Bagikan topik yang ingin kamu diskusikan.</p>

      <form onSubmit={handleSubmit} className="new-thread-form">
        <label htmlFor="title">
          Judul
          <input
            id="title"
            name="title"
            type="text"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="Judul thread"
          />
        </label>

        <label htmlFor="category">
          Kategori
          <input
            id="category"
            name="category"
            type="text"
            value={form.category}
            onChange={handleChange}
            placeholder="mis. redux, react, umum"
          />
        </label>

        <label htmlFor="body">
          Isi
          <textarea
            id="body"
            name="body"
            required
            rows={8}
            value={form.body}
            onChange={handleChange}
            placeholder="Tuliskan isi diskusimu di sini..."
          />
        </label>

        {error && <p className="new-thread-form__error">{error}</p>}

        <button type="submit" className="btn btn--primary btn--md" disabled={isSubmitting || isLoading}>
          {isSubmitting ? 'Menyimpan...' : 'Publikasikan thread'}
        </button>
      </form>
    </div>
  );
}

export default NewThreadPage;
