import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddTechnology() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not-started',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newTechnology = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    const saved = localStorage.getItem('technologies');
    const technologies = saved ? JSON.parse(saved) : [];
    technologies.push(newTechnology);
    localStorage.setItem('technologies', JSON.stringify(technologies));

    navigate('/technologies');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Добавить технологию</h1>
      </div>

      <form onSubmit={handleSubmit} className="technology-form">
        <div className="form-group">
          <label>Название технологии *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Описание *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Начальный статус</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="not-started">Не начато</option>
            <option value="in-progress">В процессе</option>
            <option value="completed">Завершено</option>
          </select>
        </div>

        <div className="form-group">
          <label>Заметки (необязательно)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Добавить технологию
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/technologies')}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTechnology;